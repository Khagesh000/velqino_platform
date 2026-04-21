from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from rest_framework import status
from .models import Order, OrderItem, Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer,  ApplyCouponSerializer, UpdateCartItemSerializer, CartItemSerializer, OrderListSerializer, OrderCreateSerializer
from catalog.models import Product
from identity.serializers import AddressSerializer
from .services.cart_service import CartService
from decimal import Decimal
import uuid

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """Create order from cart"""
    from .models import Cart, Order, OrderItem
    from catalog.models import Product
    from identity.models import Address
    
    user = request.user
    
    # Only customers and retailers can place orders
    if user.role == 'wholesaler':
        return Response({
            'status': 'error',
            'message': 'Wholesalers cannot place orders'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get active cart
    cart = Cart.objects.filter(user=user, status='active').first()
    
    if not cart or not cart.items.exists():
        return Response({
            'status': 'error',
            'message': 'Cart is empty'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get address
    address_id = request.data.get('address_id')
    delivery_type = request.data.get('delivery_type', 'standard')
    payment_method = request.data.get('payment_method')
    
    if not address_id or not payment_method:
        return Response({
            'status': 'error',
            'message': 'Address and payment method required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        address = Address.objects.get(id=address_id, user=user)
    except Address.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Address not found'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Calculate totals
    subtotal = cart.subtotal
    discount = cart.discount_amount
    shipping_charge = 99 if delivery_type == 'express' else 0
    tax = round((subtotal - discount) * 0.05, 2)
    grand_total = subtotal - discount + shipping_charge + tax
    
    # Create order
    order = Order.objects.create(
        order_number=f"ORD-{uuid.uuid4().hex[:8].upper()}",
        customer=user,
        retailer=user if user.role == 'retailer' else None,
        total_amount=subtotal,
        discount_amount=discount,
        shipping_charge=shipping_charge,
        tax_amount=tax,
        grand_total=grand_total,
        payment_method=payment_method,
        delivery_type=delivery_type,
        shipping_name=address.full_name,
        shipping_phone=address.phone,
        shipping_address=address.street,
        shipping_city=address.city,
        shipping_state=address.state,
        shipping_pincode=address.pincode,
        status='pending',
        payment_status='pending'
    )
    
    # Create order items and update stock
    for cart_item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            product_name=cart_item.product.name,
            product_sku=cart_item.product.sku,
            quantity=cart_item.quantity,
            price=cart_item.price_at_add,
            total=cart_item.subtotal,
            seller_id=cart_item.product.seller.id,
            seller_name=cart_item.product.seller.email
        )
        
        # Decrease stock
        product = cart_item.product
        product.stock -= cart_item.quantity
        product.save()
    
    # Clear cart
    cart.items.all().delete()
    cart.status = 'converted'
    cart.save()
    
    return Response({
        'status': 'success',
        'message': 'Order placed successfully',
        'data': {
            'order_id': order.order_number,
            'total_amount': order.grand_total
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    """Get user orders"""
    from .models import Order
    
    user = request.user
    
    if user.role == 'customer':
        orders = Order.objects.filter(customer=user)
    elif user.role == 'retailer':
        orders = Order.objects.filter(retailer=user)
    elif user.role == 'wholesaler':
        orders = Order.objects.filter(wholesaler=user)
    else:
        orders = Order.objects.none()
    
    orders = orders.order_by('-created_at')
    
    data = []
    for order in orders:
        data.append({
            'id': order.id,
            'order_number': order.order_number,
            'total_amount': order.grand_total,
            'status': order.status,
            'payment_status': order.payment_status,
            'created_at': order.created_at,
            'items_count': order.items.count()
        })
    
    return Response({
        'status': 'success',
        'data': data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order(request, order_id):
    """Get single order details by order number or ID"""
    from .models import Order, OrderItem
    
    user = request.user
    
    # Get order by ID or order_number
    try:
        if str(order_id).startswith('ORD-'):
            order = Order.objects.get(order_number=order_id)
        else:
            order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Order not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check permission: only customer, retailer, or wholesaler can view
    if user.role == 'customer' and order.customer.id != user.id:
        return Response({
            'status': 'error',
            'message': 'You are not authorized to view this order'
        }, status=status.HTTP_403_FORBIDDEN)
    
    if user.role == 'retailer' and order.retailer and order.retailer.id != user.id:
        return Response({
            'status': 'error',
            'message': 'You are not authorized to view this order'
        }, status=status.HTTP_403_FORBIDDEN)
    
    if user.role == 'wholesaler' and order.wholesaler and order.wholesaler.id != user.id:
        return Response({
            'status': 'error',
            'message': 'You are not authorized to view this order'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get order items
    items = []
    for item in order.items.all():
        items.append({
            'id': item.id,
            'product_id': item.product.id,
            'product_name': item.product_name,
            'product_sku': item.product_sku,
            'product_image': item.product.primary_image if item.product else None,
            'quantity': item.quantity,
            'price': float(item.price),
            'total': float(item.total)
        })
    
    # Build response
    data = {
        'id': order.id,
        'order_number': order.order_number,
        'status': order.status,
        'payment_status': order.payment_status,
        'payment_method': order.payment_method,
        'created_at': order.created_at,
        'updated_at': order.updated_at,
        'expected_delivery_date': order.expected_delivery_date,
        'delivery_type': order.delivery_type,
        
        # Customer info
        'customer': {
            'id': order.customer.id,
            'name': order.customer.get_full_name() or order.customer.email,
            'email': order.customer.email,
            'phone': order.customer.mobile if hasattr(order.customer, 'mobile') else ''
        },
        
        # Shipping address
        'shipping_address': {
            'full_name': order.shipping_name,
            'phone': order.shipping_phone,
            'address': order.shipping_address,
            'city': order.shipping_city,
            'state': order.shipping_state,
            'pincode': order.shipping_pincode
        },
        
        # Price breakdown
        'subtotal': float(order.total_amount),
        'discount': float(order.discount_amount),
        'shipping_charge': float(order.shipping_charge),
        'tax': float(order.tax_amount),
        'total': float(order.grand_total),
        
        # Items
        'items': items,
        'items_count': len(items)
    }
    
    return Response({
        'status': 'success',
        'data': data
    })

@api_view(['GET'])
def get_cart(request):
    """Get current user's cart"""
    
    # Get session ID from request
    session_id = request.headers.get('X-Session-ID', request.COOKIES.get('session_id'))
    
    # Get or create cart
    cart = CartService.get_or_create_cart(
        user=request.user if request.user.is_authenticated else None,
        session_id=session_id,
        user_type=request.user.role if request.user.is_authenticated else 'customer'
    )
    
    # Get cart details
    cart_data = CartService.get_cart_details(cart)
    serializer = CartSerializer(cart_data['cart'])
    
    response = Response({
        'status': 'success',
        'data': serializer.data,
        'summary': cart_data['summary']
    })
    
    # Set session ID cookie for guests
    if not request.user.is_authenticated and session_id:
        response.set_cookie('session_id', session_id, max_age=30*24*60*60)  # 30 days
    
    return response


@api_view(['POST'])
def add_to_cart(request):
    """Add product to cart"""
    
    serializer = AddToCartSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get session ID
    session_id = request.headers.get('X-Session-ID', request.COOKIES.get('session_id'))
    
    # Get or create cart
    cart = CartService.get_or_create_cart(
        user=request.user if request.user.is_authenticated else None,
        session_id=session_id,
        user_type=request.user.role if request.user.is_authenticated else 'customer'
    )
    
    try:
        cart_item = CartService.add_to_cart(
            cart=cart,
            product_id=serializer.validated_data['product_id'],
            quantity=serializer.validated_data['quantity'],
            selected_size=serializer.validated_data.get('selected_size', ''),
            selected_color=serializer.validated_data.get('selected_color', '')
        )
        
        return Response({
            'status': 'success',
            'message': 'Product added to cart',
            'data': CartItemSerializer(cart_item).data if cart_item else None
        }, status=status.HTTP_201_CREATED)
        
    except ValueError as e:
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
def update_cart_item(request, item_id):
    """Update cart item quantity"""
    
    serializer = UpdateCartItemSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        cart_item = CartService.update_cart_item(
            item_id, 
            serializer.validated_data['quantity']
        )
        
        return Response({
            'status': 'success',
            'message': 'Cart updated',
            'data': CartItemSerializer(cart_item).data if cart_item else None
        })
        
    except ValueError as e:
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def remove_cart_item(request, item_id):
    """Remove item from cart"""
    
    try:
        CartService.remove_cart_item(item_id)
        return Response({
            'status': 'success',
            'message': 'Item removed from cart'
        })
    except CartItem.DoesNotExist:
        return Response({'status': 'error', 'message': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def apply_coupon(request):
    """Apply coupon to cart"""
    
    serializer = ApplyCouponSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    session_id = request.headers.get('X-Session-ID', request.COOKIES.get('session_id'))
    
    cart = CartService.get_or_create_cart(
        user=request.user if request.user.is_authenticated else None,
        session_id=session_id
    )
    
    # Your coupon validation logic here
    coupon_code = serializer.validated_data['coupon_code']
    
    # Example coupon logic
    if coupon_code == 'SAVE20':
        discount = cart.subtotal * Decimal('0.2')
        cart.apply_coupon(coupon_code, discount)
        return Response({
            'status': 'success',
            'message': f'Coupon applied! You saved ₹{discount}'
        })
    elif coupon_code == 'SAVE10':
        discount = cart.subtotal * Decimal('0.1')
        cart.apply_coupon(coupon_code, discount)
        return Response({
            'status': 'success',
            'message': f'Coupon applied! You saved ₹{discount}'
        })
    else:
        return Response({
            'status': 'error',
            'message': 'Invalid coupon code'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def remove_coupon(request):
    """Remove applied coupon"""
    
    session_id = request.headers.get('X-Session-ID', request.COOKIES.get('session_id'))
    
    cart = CartService.get_or_create_cart(
        user=request.user if request.user.is_authenticated else None,
        session_id=session_id
    )
    
    cart.remove_coupon()
    
    return Response({
        'status': 'success',
        'message': 'Coupon removed'
    })


@api_view(['DELETE'])
def clear_cart(request):
    """Clear all items from cart"""
    
    session_id = request.headers.get('X-Session-ID', request.COOKIES.get('session_id'))
    
    cart = CartService.get_or_create_cart(
        user=request.user if request.user.is_authenticated else None,
        session_id=session_id
    )
    
    CartService.clear_cart(cart)
    
    return Response({
        'status': 'success',
        'message': 'Cart cleared'
    })





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_customer_order(request):
    """
    Customer places order from retailer
    """
    user = request.user
    
    # Only customers can place orders
    if user.role != 'customer':
        return Response({
            'status': 'error',
            'message': 'Only customers can place orders'
        }, status=403)
    
    items = request.data.get('items', [])
    shipping_address = request.data.get('shipping_address')
    payment_method = request.data.get('payment_method')
    
    if not items or not shipping_address:
        return Response({
            'status': 'error',
            'message': 'Items and shipping address required'
        }, status=400)
    
    with transaction.atomic():
        # Get retailer from first product (all products should be from same retailer for one order)
        first_product = Product.objects.get(id=items[0]['product_id'])
        retailer = first_product.retailer
        
        # Create order
        order = Order.objects.create(
            customer=user,
            retailer=retailer,
            order_number=f"ORD-{uuid.uuid4().hex[:8].upper()}",
            total_amount=0,
            payment_method=payment_method,
            shipping_address=shipping_address.get('address'),
            city=shipping_address.get('city'),
            state=shipping_address.get('state'),
            pincode=shipping_address.get('pincode')
        )
        
        total = 0
        for item in items:
            product = Product.objects.get(id=item['product_id'])
            item_total = product.price * item['quantity']
            total += item_total
            
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_sku=product.sku,
                quantity=item['quantity'],
                price=product.price,
                total=item_total
            )
        
        order.total_amount = total
        order.save()
        
        return Response({
            'status': 'success',
            'message': 'Order placed successfully',
            'order_id': order.order_number,
            'total': total
        })
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_retailer_customers(request):
    """
    Retailer sees all customers who bought from them
    """
    user = request.user
    
    if user.role != 'retailer':
        return Response({
            'status': 'error',
            'message': 'Only retailers can view customers'
        }, status=403)
    
    # Get unique customers from orders
    customers = Order.objects.filter(
        retailer=user
    ).select_related('customer').values(
        'customer__id', 
        'customer__email',
        'customer__mobile'
    ).distinct()
    
    return Response({
        'status': 'success',
        'data': list(customers)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_retailer_orders(request):
    """
    Retailer sees orders from their customers
    """
    user = request.user
    
    if user.role != 'retailer':
        return Response({
            'status': 'error',
            'message': 'Only retailers can view orders'
        }, status=403)
    
    orders = Order.objects.filter(retailer=user).order_by('-created_at')
    
    from .serializers import OrderSerializer
    serializer = OrderSerializer(orders, many=True)
    
    return Response({
        'status': 'success',
        'data': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_customer_orders(request):
    """
    Customer sees their order history
    """
    user = request.user
    
    if user.role != 'customer':
        return Response({
            'status': 'error',
            'message': 'Only customers can view their orders'
        }, status=403)
    
    orders = Order.objects.filter(customer=user).order_by('-created_at')
    
    from .serializers import OrderSerializer
    serializer = OrderSerializer(orders, many=True)
    
    return Response({
        'status': 'success',
        'data': serializer.data
    })