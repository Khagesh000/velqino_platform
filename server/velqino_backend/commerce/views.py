from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from rest_framework import status
from .models import Order, OrderItem, Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer,  ApplyCouponSerializer, UpdateCartItemSerializer, CartItemSerializer, OrderListSerializer, OrderCreateSerializer, UpdateReturnStatusSerializer
from catalog.models import Product
from identity.serializers import AddressSerializer
from .services.cart_service import CartService
from decimal import Decimal
from django.core.cache import cache
import uuid
from identity.permissions import IsAdmin, IsSupport, IsAdminOrSupport
from django.http import HttpResponse
from reportlab.lib.pagesizes import A4 # type: ignore
from reportlab.lib.units import inch # type: ignore
from reportlab.lib import colors # type: ignore
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer # type: ignore
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle # type: ignore
from reportlab.lib.enums import TA_CENTER, TA_RIGHT # type: ignore
from django.utils import timezone
import logging
from commerce.models import OrderStatusHistory

logger = logging.getLogger(__name__)
import io


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """Create order from cart"""
    from .models import Cart, Order, OrderItem, OrderStatusHistory
    from catalog.models import Product
    from identity.models import Address
    import uuid
    from decimal import Decimal

    serializer = OrderCreateSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response({'status': 'error', 'errors': serializer.errors}, status=400)
    
    user = request.user
    
    # ✅ Only customers and retailers can place orders
    if user.role not in ['customer', 'retailer']:
        return Response({
            'status': 'error',
            'message': 'Only customers and retailers can place orders'
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
    shipping_charge = Decimal('99') if delivery_type == 'express' else Decimal('0')
    tax = round((float(subtotal) - float(discount)) * 0.05, 2)
    grand_total = float(subtotal) - float(discount) + float(shipping_charge) + tax
    
    # ✅ Get wholesaler from first cart item (if retailer is buying from wholesaler)
    first_item = cart.items.first()
    seller = first_item.product.seller
    seller_type = first_item.product.seller_type

    # Set retailer and wholesaler fields correctly
    retailer_field = None
    wholesaler_field = None

    if user.role == 'customer':
        # Customer buys from RETAILER
        if seller_type == 'retailer':
            retailer_field = seller
        elif seller_type == 'wholesaler':
            # Customer cannot buy from wholesaler (your validation prevents this)
            retailer_field = None
    elif user.role == 'retailer':
        # Retailer buys from WHOLESALER
        if seller_type == 'wholesaler':
            wholesaler_field = seller
        elif seller_type == 'retailer':
            # Retailer cannot buy from retailer (your validation prevents this)
            wholesaler_field = None

    # Create order
    order = Order.objects.create(
        order_number=f"ORD-{uuid.uuid4().hex[:8].upper()}",
        customer=user,
        retailer=retailer_field,
        wholesaler=wholesaler_field,
        total_amount=subtotal,
        discount_amount=discount,
        shipping_charge=shipping_charge,
        tax_amount=Decimal(str(tax)),
        grand_total=Decimal(str(grand_total)),
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
    
    OrderStatusHistory.objects.create(
        order=order,
        status='pending',
        notes='Order placed successfully',
        created_by=user if user.is_authenticated else None
    )
    
    # Create order items and update stock
    for cart_item in cart.items.all():
        # Get primary image URL
        product_image = None
        primary_image = cart_item.product.images.filter(is_primary=True).first()
        if primary_image:
            product_image = primary_image.image.url
        elif cart_item.product.images.first():
            product_image = cart_item.product.images.first().image.url
        
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            product_name=cart_item.product.name,
            product_sku=cart_item.product.sku,
            product_image=product_image,
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
    """Get user orders based on role"""
    from .models import Order
    from django.db.models import Q, Prefetch
    from django.core.paginator import Paginator

    user = request.user

    # ✅ Optimized with select_related and prefetch_related
    base_queryset = Order.objects.select_related('customer', 'retailer', 'wholesaler').prefetch_related(
        Prefetch('items', queryset=OrderItem.objects.select_related('product'))
    )

    if user.role in ['admin', 'support']:
        orders = base_queryset.all()
    elif user.role == 'customer':
        orders = base_queryset.filter(customer=user)
    elif user.role == 'retailer':
        orders = base_queryset.filter(retailer=user)
    elif user.role == 'wholesaler':
        orders = base_queryset.filter(items__product__seller=user).distinct()
    else:
        orders = Order.objects.none()

    # Filters (same as before)
    status_filter = request.query_params.get('status')
    if status_filter:
        orders = orders.filter(status=status_filter)

    payment_filter = request.query_params.get('payment_status')
    if payment_filter:
        orders = orders.filter(payment_status=payment_filter)

    search = request.query_params.get('search')
    if search:
        orders = orders.filter(
            Q(order_number__icontains=search) |
            Q(customer__email__icontains=search) |
            Q(customer__first_name__icontains=search) |
            Q(customer__last_name__icontains=search) |
            Q(shipping_name__icontains=search)
        )

    days = request.query_params.get('days')
    if days and days != 'custom':
        from django.utils import timezone
        from datetime import timedelta
        cutoff = timezone.now() - timedelta(days=int(days))
        orders = orders.filter(created_at__gte=cutoff)

    min_amount = request.query_params.get('min_amount')
    max_amount = request.query_params.get('max_amount')
    if min_amount:
        orders = orders.filter(grand_total__gte=float(min_amount))
    if max_amount:
        orders = orders.filter(grand_total__lte=float(max_amount))

    orders = orders.order_by('-created_at')

    # Pagination
    page = int(request.query_params.get('page', 1))
    per_page = int(request.query_params.get('per_page', 10))
    paginator = Paginator(orders, per_page)
    page_obj = paginator.get_page(page)

    data = []
    for order in page_obj.object_list:
        # ✅ Customer name
        customer_name = ""
        if order.customer:
            customer_name = order.customer.get_full_name() or order.customer.email
        
        # ✅ Retailer name
        retailer_name = ""
        if order.retailer:
            retailer_name = order.retailer.get_full_name() or order.retailer.email
        
        # ✅ Delivered date (use delivered_at field from your model)
        delivered_date = order.delivered_at if order.delivered_at else None
        
        # ✅ Items with images
        items_data = []
        for item in order.items.all():
            product_images = []
            if item.product:
                primary_image = item.product.images.filter(is_primary=True).first()
                if primary_image:
                    product_images.append(primary_image.image.url)
                else:
                    for img in item.product.images.all()[:3]:
                        product_images.append(img.image.url)
            
            items_data.append({
                'id': item.id,
                'product_name': item.product_name,
                'product_sku': item.product_sku,
                'quantity': item.quantity,
                'price': float(item.price),
                'total': float(item.total),
                'product_images': product_images
            })
        
        data.append({
            'id': order.id,
            'order_number': order.order_number,
            'customer_name': customer_name,
            'customer_email': order.customer.email if order.customer else None,
            'retailer_name': retailer_name,
            'total_amount': float(order.grand_total),
            'status': order.status,
            'payment_status': order.payment_status,
            'payment_method': order.payment_method,
            'delivery_type': order.delivery_type,
            'created_at': order.created_at,
            'delivered_date': delivered_date,
            'expected_delivery_date': order.expected_delivery_date,
            'tracking_number': order.tracking_number,
            'items_count': order.items.count(),
            'items': items_data
        })

    return Response({
        'status': 'success',
        'data': data,
        'pagination': {
            'total': paginator.count,
            'total_pages': paginator.num_pages,
            'page': page,
            'per_page': per_page,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
        }
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
    
    if user.role in ['admin', 'support']:
        pass  # Allow access to any order
    
    # Check permission for regular users
    elif user.role == 'customer' and order.customer.id != user.id:
        return Response({
            'status': 'error',
            'message': 'You are not authorized to view this order'
        }, status=status.HTTP_403_FORBIDDEN)
    
    elif user.role == 'retailer' and order.retailer and order.retailer.id != user.id:
        return Response({
            'status': 'error',
            'message': 'You are not authorized to view this order'
        }, status=status.HTTP_403_FORBIDDEN)
    
    elif user.role == 'wholesaler' and order.wholesaler and order.wholesaler.id != user.id:
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
            'product_image': item.product_image,
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    """Cancel an order with stock restoration and status history"""
    from .models import Order, OrderStatusHistory
    from django.db import transaction
    
    user = request.user
    CANCELLABLE_STATUSES = ['pending', 'confirmed', 'processing']

    # Fetch order with prefetched items and products in one query
    try:
        if str(order_id).startswith('ORD-'):
            order = (
                Order.objects
                .select_related('customer', 'retailer', 'wholesaler')
                .prefetch_related('items__product')
                .get(order_number=order_id)
            )
        else:
            order = (
                Order.objects
                .select_related('customer', 'retailer', 'wholesaler')
                .prefetch_related('items__product')
                .get(id=order_id)
            )
    except Order.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Order not found'
        }, status=status.HTTP_404_NOT_FOUND)

    # Role-based permission check
    if user.role == 'customer' and order.customer_id != user.id:
        return Response({
            'status': 'error',
            'message': 'You are not authorized to cancel this order'
        }, status=status.HTTP_403_FORBIDDEN)

    elif user.role == 'retailer' and (not order.retailer or order.retailer_id != user.id):
        return Response({
            'status': 'error',
            'message': 'You are not authorized to cancel this order'
        }, status=status.HTTP_403_FORBIDDEN)

    elif user.role == 'wholesaler':
        # Wholesaler can cancel only if they own at least one product in the order
        owns_item = order.items.filter(product__seller=user).exists()
        if not owns_item:
            return Response({
                'status': 'error',
                'message': 'You are not authorized to cancel this order'
            }, status=status.HTTP_403_FORBIDDEN)

    # Check if order is in a cancellable state
    if order.status not in CANCELLABLE_STATUSES:
        return Response({
            'status': 'error',
            'message': f'Order cannot be cancelled. Current status: {order.status}'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Already cancelled
    if order.status == 'cancelled':
        return Response({
            'status': 'error',
            'message': 'Order is already cancelled'
        }, status=status.HTTP_400_BAD_REQUEST)

    cancel_reason = request.data.get('reason', 'Cancelled by user')

    # Atomic transaction — cancel + restore stock together
    with transaction.atomic():
        # Restore stock for each item
        for item in order.items.all():
            product = item.product
            product.stock += item.quantity
            product.save(update_fields=['stock'])

        # Update order status
        order.status = 'cancelled'
        order.save(update_fields=['status', 'updated_at'])

        # Log status history
        OrderStatusHistory.objects.create(
            order=order,
            status='cancelled',
            notes=cancel_reason,
            created_by=user
        )

    return Response({
        'status': 'success',
        'message': 'Order cancelled successfully',
        'data': {
            'order_number': order.order_number,
            'status': order.status,
            'reason': cancel_reason
        }
    }, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def merge_cart(request):
    """Merge guest cart with user cart after login"""
    
    session_id = request.headers.get('X-Session-ID')
    user = request.user
    
    if not session_id:
        return Response({'status': 'error', 'message': 'Session ID required'}, status=400)
    
    # Get guest cart
    guest_cart = Cart.objects.filter(session_id=session_id, status='active', user__isnull=True).first()
    
    if not guest_cart:
        return Response({'status': 'success', 'message': 'No guest cart to merge'})
    
    # Get or create user cart
    user_cart = Cart.objects.filter(user=user, status='active').first()
    if not user_cart:
        user_cart = Cart.objects.create(user=user, user_type=user.role, status='active')
    
    # Move items from guest cart to user cart
    for guest_item in guest_cart.items.all():
        existing_item = user_cart.items.filter(
            product=guest_item.product,
            selected_size=guest_item.selected_size,
            selected_color=guest_item.selected_color
        ).first()
        
        if existing_item:
            existing_item.quantity += guest_item.quantity
            existing_item.save()
            guest_item.delete()
        else:
            guest_item.cart = user_cart
            guest_item.save()
    
    # Delete guest cart
    guest_cart.delete()
    
    return Response({'status': 'success', 'message': 'Cart merged successfully'})

@api_view(['GET'])
def get_cart(request):
    """Get current user's cart"""
    
    # Get session ID from request
    session_id = request.headers.get('X-Session-ID', request.COOKIES.get('session_id'))
    
    # Get authenticated user (if any)
    user = request.user if request.user.is_authenticated else None
    
    # ✅ Pass user correctly
    cart = CartService.get_or_create_cart(
        user=user,  # Pass the user object
        session_id=session_id,
        user_type=user.role if user else 'customer'
    )
    
    # ✅ If user is authenticated but cart has no user, update it
    if user and not cart.user:
        cart.user = user
        cart.user_type = user.role
        cart.save()
    
    # Get cart details
    cart_data = CartService.get_cart_details(cart)
    serializer = CartSerializer(cart_data['cart'])
    
    response = Response({
        'status': 'success',
        'data': serializer.data,
        'summary': cart_data['summary']
    })
    
    # Set session ID cookie for guests
    if not user and session_id:
        response.set_cookie('session_id', session_id, max_age=30*24*60*60)
    
    return response


@api_view(['POST'])
def add_to_cart(request):
    """Add product to cart"""
    
    serializer = AddToCartSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response({'status': 'error', 'errors': serializer.errors}, status=400)
    
    # Get session ID
    session_id = request.headers.get('X-Session-ID', request.COOKIES.get('session_id'))
    
    # Get authenticated user
    user = request.user if request.user.is_authenticated else None
    
    # ✅ Get or create cart with correct user
    cart = CartService.get_or_create_cart(
        user=user,
        session_id=session_id,
        user_type=user.role if user else 'customer'
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
            'data': CartItemSerializer(cart_item).data
        }, status=201)
        
    except ValueError as e:
        return Response({'status': 'error', 'message': str(e)}, status=400)


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
    
    from .serializers import OrderListSerializer  # ✅ Use correct name
    serializer = OrderListSerializer(orders, many=True)
    
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_invoice(request, order_id):
    """Download order invoice as PDF"""
    from .models import Order
    
    try:
        if str(order_id).startswith('ORD-'):
            order = Order.objects.get(order_number=order_id)
        else:
            order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'status': 'error', 'message': 'Order not found'}, status=404)
    
    # Check permission
    user = request.user
    if user.role not in ['admin', 'support']:
        if user.role == 'customer' and order.customer.id != user.id:
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
        elif user.role == 'retailer' and order.retailer and order.retailer.id != user.id:
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
    
    # Create PDF
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch, bottomMargin=0.5*inch)
    styles = getSampleStyleSheet()
    elements = []
    
    # Title Style
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], alignment=TA_CENTER, fontSize=24, textColor=colors.HexColor('#396d72'))
    
    # Header
    elements.append(Paragraph("VELTRIX", title_style))
    elements.append(Paragraph("Invoice", styles['Heading2']))
    elements.append(Spacer(1, 0.3*inch))
    
    # Order Info Table
    order_data = [
        ['Order Number:', order.order_number, 'Order Date:', order.created_at.strftime('%d/%m/%Y')],
        ['Payment Method:', order.payment_method.upper(), 'Payment Status:', order.payment_status.upper()],
        ['Order Status:', order.status.upper(), 'Delivery Type:', order.delivery_type.upper()]
    ]
    
    order_table = Table(order_data, colWidths=[1.5*inch, 2*inch, 1.5*inch, 2*inch])
    order_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(order_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Customer Info
    customer_data = [
        ['Bill To:', 'Ship To:'],
        [f"{order.customer.get_full_name() or order.customer.email}", f"{order.shipping_name}"],
        [f"{order.customer.email}", f"{order.shipping_phone}"],
        ['', f"{order.shipping_address}"],
        ['', f"{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}"]
    ]
    
    customer_table = Table(customer_data, colWidths=[3*inch, 4*inch])
    customer_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOX', (0, 0), (-1, -1), 1, colors.grey),
    ]))
    elements.append(customer_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Items Table
    items_data = [['#', 'Product', 'SKU', 'Quantity', 'Price', 'Total']]
    
    for idx, item in enumerate(order.items.all(), 1):
        items_data.append([
            str(idx),
            item.product_name,
            item.product_sku,
            str(item.quantity),
            f"₹{item.price}",
            f"₹{item.total}"
        ])
    
    # Add total row
    items_data.append(['', '', '', '', 'Subtotal:', f"₹{order.total_amount}"])
    items_data.append(['', '', '', '', 'Discount:', f"-₹{order.discount_amount}"])
    items_data.append(['', '', '', '', 'Shipping:', f"₹{order.shipping_charge}"])
    items_data.append(['', '', '', '', 'Tax (GST):', f"₹{order.tax_amount}"])
    items_data.append(['', '', '', '', 'Grand Total:', f"₹{order.grand_total}"])
    
    items_table = Table(items_data, colWidths=[0.5*inch, 2.5*inch, 1.5*inch, 0.8*inch, 1.2*inch, 1.2*inch])
    items_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#396d72')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (4, 1), (-1, -1), 'RIGHT'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -6), 0.5, colors.grey),
        ('BOX', (0, -5), (-1, -1), 0.5, colors.grey),
        ('FONTNAME', (4, -5), (-1, -1), 'Helvetica-Bold'),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Footer
    footer_style = ParagraphStyle('FooterStyle', parent=styles['Normal'], alignment=TA_CENTER, fontSize=8, textColor=colors.grey)
    elements.append(Paragraph("Thank you for shopping with VELTRIX!", footer_style))
    elements.append(Paragraph("For any queries, contact support@veltrix.com | +91 1800 123 4567", footer_style))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="invoice_{order.order_number}.pdf"'
    return response


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    """
    Update order status (Wholesaler/Admin only)
    Status flow: pending → confirmed → processing → shipped → out_for_delivery → delivered
    """
    from .models import Order
    
    user = request.user
    
    # ✅ Only wholesaler, admin, or support can update order status
    if user.role not in ['wholesaler', 'admin', 'support']:
        return Response({
            'status': 'error',
            'message': 'You are not authorized to update order status'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # ✅ Get order
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
    
    # ✅ Check if wholesaler owns this order
    if user.role == 'wholesaler' and order.wholesaler and order.wholesaler.id != user.id:
        return Response({
            'status': 'error',
            'message': 'You can only update your own orders'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # ✅ Get new status from request
    new_status = request.data.get('status')
    tracking_number = request.data.get('tracking_number')
    notes = request.data.get('notes', '')
    
    if not new_status:
        return Response({
            'status': 'error',
            'message': 'Status is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # ✅ Define valid status transitions
    valid_transitions = {
        'pending': ['confirmed', 'cancelled'],
        'confirmed': ['processing', 'cancelled'],
        'processing': ['shipped', 'cancelled'],
        'shipped': ['out_for_delivery', 'cancelled'],
        'out_for_delivery': ['delivered', 'cancelled'],
        'delivered': ['refunded'],
        'cancelled': [],
        'refunded': []
    }
    
    # ✅ Check if transition is valid
    current_status = order.status
    if new_status not in valid_transitions.get(current_status, []):
        return Response({
            'status': 'error',
            'message': f'Invalid status transition from {current_status} to {new_status}'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # ✅ Update order status
    order.status = new_status
    order.updated_at = timezone.now()

    if tracking_number:
        order.tracking_number = tracking_number

    if notes:
        order.notes = (order.notes + '\n' + notes) if order.notes else notes

    if new_status == 'delivered':
        order.delivered_at = timezone.now()

    order.save()

    # ✅ Add status history HERE (after save, before cache delete)
    from commerce.models import OrderStatusHistory
    OrderStatusHistory.objects.create(
        order=order,
        status=new_status,
        notes=notes or f'Status updated from {current_status} to {new_status}',
        created_by=user
    )

    # ✅ Invalidate cache
    cache.delete(f"order:{order.id}")
    cache.delete(f"order:{order.order_number}")

    # ✅ Log status change
    logger.info(f"Order {order.order_number} status updated from {current_status} to {new_status} by {user.email}")

    
    # ✅ Send notification (optional - can add Celery task)
    # from commerce.tasks import send_order_status_email
    # send_order_status_email.delay(order.id, current_status, new_status)
    
    return Response({
        'status': 'success',
        'message': f'Order status updated to {new_status}',
        'data': {
            'order_id': order.order_number,
            'previous_status': current_status,
            'current_status': order.status,
            'tracking_number': order.tracking_number,
            'updated_at': order.updated_at
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_status_history(request, order_id):
    """
    Get order status history and timeline
    """
    from .models import Order
    from commerce.models import OrderStatusHistory
    
    user = request.user
    
    # ✅ Get order
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
    
    # ✅ Check permission
    if user.role not in ['admin', 'support']:
        if user.role == 'wholesaler' and order.wholesaler and order.wholesaler.id != user.id:
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
        elif user.role == 'retailer' and order.retailer and order.retailer.id != user.id:
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
        elif user.role == 'customer' and order.customer.id != user.id:
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
    
    # ✅ Get status history
    history = OrderStatusHistory.objects.filter(order=order).order_by('-created_at')
    
    history_data = []
    for h in history:
        history_data.append({
            'status': h.status,
            'notes': h.notes,
            'created_at': h.created_at,
            'created_by': h.created_by.email if h.created_by else None
        })
    
    # ✅ Build timeline
    timeline = [
        {'status': 'pending', 'label': 'Order Placed', 'completed': True, 'date': order.created_at},
        {'status': 'confirmed', 'label': 'Order Confirmed', 'completed': order.status in ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'], 'date': None},
        {'status': 'processing', 'label': 'Processing', 'completed': order.status in ['processing', 'shipped', 'out_for_delivery', 'delivered'], 'date': None},
        {'status': 'shipped', 'label': 'Shipped', 'completed': order.status in ['shipped', 'out_for_delivery', 'delivered'], 'date': order.shipped_at if hasattr(order, 'shipped_at') else None},
        {'status': 'out_for_delivery', 'label': 'Out for Delivery', 'completed': order.status in ['out_for_delivery', 'delivered'], 'date': None},
        {'status': 'delivered', 'label': 'Delivered', 'completed': order.status == 'delivered', 'date': order.delivered_at},
    ]
    
    return Response({
        'status': 'success',
        'data': {
            'current_status': order.status,
            'tracking_number': order.tracking_number,
            'history': history_data,
            'timeline': timeline
        }
    })


# ========== RETURNS MANAGEMENT VIEWS ==========

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_retailer_returns(request):
    """
    Retailer sees all return requests for their orders
    """
    user = request.user
    
    if user.role != 'retailer':
        return Response({
            'status': 'error',
            'message': 'Only retailers can view returns'
        }, status=status.HTTP_403_FORBIDDEN)
    
    from .models import ReturnRequest
    from .serializers import ReturnRequestSerializer
    
    returns = ReturnRequest.objects.filter(retailer=user).order_by('-created_at')
    serializer = ReturnRequestSerializer(returns, many=True)
    
    return Response({
        'status': 'success',
        'data': serializer.data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_return_request(request):
    """
    Customer creates a return request
    """
    user = request.user
    
    if user.role != 'customer':
        return Response({
            'status': 'error',
            'message': 'Only customers can create return requests'
        }, status=status.HTTP_403_FORBIDDEN)
    
    from .models import Order, ReturnRequest
    from .serializers import CreateReturnRequestSerializer
    
    serializer = CreateReturnRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    order_id = data.get('order_id')
    
    try:
        order = Order.objects.get(order_number=order_id, customer=user)
    except Order.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Order not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check if order is delivered
    if order.status != 'delivered':
        return Response({
            'status': 'error',
            'message': 'Only delivered orders can be returned'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if return already exists for this order
    if ReturnRequest.objects.filter(order=order).exists():
        return Response({
            'status': 'error',
            'message': 'Return request already exists for this order'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Calculate refund amount
    items = data.get('items', [])
    refund_amount = sum(float(item.get('total', 0)) for item in items)
    
    # Create return request
    return_request = ReturnRequest.objects.create(
        order=order,
        retailer=order.retailer,
        customer=user,
        return_type=data.get('return_type'),
        reason=data.get('reason'),
        comments=data.get('comments', ''),
        items=items,
        refund_amount=refund_amount,
        status='pending'
    )
    
    return Response({
        'status': 'success',
        'message': 'Return request created successfully',
        'data': {
            'return_number': return_request.return_number
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_return_status(request, return_id):
    """
    Retailer updates return request status
    """
    user = request.user
    
    if user.role != 'retailer':
        return Response({
            'status': 'error',
            'message': 'Only retailers can update return status'
        }, status=status.HTTP_403_FORBIDDEN)
    
    from .models import ReturnRequest
    from .serializers import UpdateReturnStatusSerializer
    
    serializer = UpdateReturnStatusSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    new_status = serializer.validated_data.get('status')
    
    try:
        return_request = ReturnRequest.objects.get(return_number=return_id, retailer=user)
    except ReturnRequest.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Return request not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    return_request.status = new_status
    return_request.save()
    
    # If approved, update order status
    if new_status == 'approved':
        return_request.order.status = 'refunded'
        return_request.order.save()
    
    return Response({
        'status': 'success',
        'message': f'Return request {new_status} successfully'
    })