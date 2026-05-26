from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny  # ✅ Added AllowAny
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Sum, Q, Avg  # ✅ Added Avg
from rest_framework import status
from datetime import timedelta  # ✅ Added timedelta
from decimal import Decimal
from django.core.cache import cache  # ✅ Fixed (was cacheSum)
import uuid
import io
import logging

from .models import Order, OrderItem, Cart, CartItem, LoyaltySettings, PointsTransaction, Reward, Campaign
from .serializers import (
    CartSerializer, AddToCartSerializer, ApplyCouponSerializer, 
    UpdateCartItemSerializer, CartItemSerializer, OrderListSerializer, 
    OrderCreateSerializer, UpdateReturnStatusSerializer,
    LoyaltySettingsSerializer, PointsTransactionSerializer, 
    RedeemPointsSerializer, CustomerPointsSummarySerializer, CreateRewardSerializer,
    RewardSerializer, UpdateLoyaltySettingsSerializer, UpdateRewardSerializer, 
    CampaignSerializer, UpdateCampaignSerializer, CreateCampaignSerializer, 
)
from .utils import (
    calculate_points, calculate_tier, get_customer_total_spent,
    get_customer_points_balance, add_points_transaction
)
from .services.cart_service import CartService
from catalog.models import Product
from identity.serializers import AddressSerializer
from identity.permissions import IsAdmin, IsSupport, IsAdminOrSupport
from commerce.models import OrderStatusHistory

# ReportLab imports
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT

from django.utils import timezone
from django.http import HttpResponse

logger = logging.getLogger(__name__)


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
    Retailer sees all customers who bought from them with full order details
    """
    user = request.user
    
    if user.role != 'retailer':
        return Response({
            'status': 'error',
            'message': 'Only retailers can view customers'
        }, status=403)
    
    # Get all orders with their items
    orders = Order.objects.filter(
        retailer=user
    ).select_related('customer').prefetch_related('items__product').order_by('-created_at')
    
    data = []
    for order in orders:
        # Get items for this order
        items_data = []
        for item in order.items.all():
            items_data.append({
                'product_id': item.product.id,
                'product_name': item.product_name,
                'product_sku': item.product_sku,
                'quantity': item.quantity,
                'price': str(item.price),
                'total': str(item.total)
            })
        
        data.append({
            'customer__id': order.customer.id,
            'customer__email': order.customer.email,
            'customer__mobile': order.customer.mobile,
            'order_number': order.order_number,
            'grand_total': str(order.grand_total),
            'status': order.status,
            'created_at': order.created_at,
            'items': items_data
        })
    
    return Response({
        'status': 'success',
        'data': data
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


# ========== REVIEWS VIEWS ==========

@api_view(['GET'])
@permission_classes([AllowAny])  # ✅ No authentication required
def get_product_reviews(request, product_id):
    """
    Get all reviews for a product (public access)
    """
    from catalog.models import Product
    from .models import Review
    from .serializers import ReviewSerializer
    
    try:
        product = Product.objects.get(id=product_id, status='active')
    except Product.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Product not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    reviews = Review.objects.filter(product=product, is_approved=True).order_by('-created_at')
    
    # Pagination
    page = int(request.GET.get('page', 1))
    per_page = int(request.GET.get('per_page', 10))
    start = (page - 1) * per_page
    end = start + per_page
    paginated = reviews[start:end]
    
    serializer = ReviewSerializer(paginated, many=True)
    
    # Calculate rating summary
    total_reviews = reviews.count()
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
    
    return Response({
        'status': 'success',
        'data': {
            'reviews': serializer.data,
            'summary': {
                'total': total_reviews,
                'average_rating': round(avg_rating, 1),
                'rating_distribution': {
                    5: reviews.filter(rating=5).count(),
                    4: reviews.filter(rating=4).count(),
                    3: reviews.filter(rating=3).count(),
                    2: reviews.filter(rating=2).count(),
                    1: reviews.filter(rating=1).count(),
                }
            },
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total_reviews,
                'total_pages': (total_reviews + per_page - 1) // per_page
            }
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])  # ✅ No authentication required
def get_product_reviews_summary(request, product_id):
    """
    Get only rating summary for a product (lightweight, public)
    """
    from catalog.models import Product
    from .models import Review
    from django.db.models import Avg
    
    try:
        product = Product.objects.get(id=product_id, status='active')
    except Product.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Product not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    reviews = Review.objects.filter(product=product, is_approved=True)
    total_reviews = reviews.count()
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
    
    return Response({
        'status': 'success',
        'data': {
            'product_id': product_id,
            'product_name': product.name,
            'total_reviews': total_reviews,
            'average_rating': round(avg_rating, 1),
            'rating_distribution': {
                5: reviews.filter(rating=5).count(),
                4: reviews.filter(rating=4).count(),
                3: reviews.filter(rating=3).count(),
                2: reviews.filter(rating=2).count(),
                1: reviews.filter(rating=1).count(),
            }
        }
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    """
    Create a product review (authentication required)
    """
    user = request.user
    
    if user.role != 'customer':
        return Response({
            'status': 'error',
            'message': 'Only customers can write reviews'
        }, status=status.HTTP_403_FORBIDDEN)
    
    from catalog.models import Product
    from .models import Review, Order, OrderItem
    from .serializers import CreateReviewSerializer
    
    serializer = CreateReviewSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    product_id = data.get('product_id')
    order_id = data.get('order_id')
    rating = data.get('rating')
    title = data.get('title')
    comment = data.get('comment')
    images = data.get('images', [])
    
    # Check if product exists
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Product not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user already reviewed this product
    if Review.objects.filter(product=product, customer=user).exists():
        return Response({
            'status': 'error',
            'message': 'You have already reviewed this product'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user actually purchased this product (verified purchase)
    is_verified = False
    order = None
    if order_id:
        try:
            order = Order.objects.get(order_number=order_id, customer=user)
            # Check if this order contains the product
            if OrderItem.objects.filter(order=order, product=product).exists():
                is_verified = True
        except Order.DoesNotExist:
            pass
    
    # Create review
    review = Review.objects.create(
        product=product,
        customer=user,
        order=order,
        rating=rating,
        title=title,
        comment=comment,
        images=images,
        is_verified_purchase=is_verified,
        is_approved=True  # Auto-approve for now
    )
    
    from .serializers import ReviewSerializer
    response_serializer = ReviewSerializer(review)
    
    return Response({
        'status': 'success',
        'message': 'Review submitted successfully',
        'data': response_serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_review(request, review_id):
    """
    Update own review (authentication required)
    """
    user = request.user
    
    from .models import Review
    from .serializers import UpdateReviewSerializer
    
    try:
        review = Review.objects.get(id=review_id, customer=user)
    except Review.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Review not found or you are not authorized'
        }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UpdateReviewSerializer(data=request.data, partial=True)
    if not serializer.is_valid():
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    
    if 'rating' in data:
        review.rating = data['rating']
    if 'title' in data:
        review.title = data['title']
    if 'comment' in data:
        review.comment = data['comment']
    if 'images' in data:
        review.images = data['images']
    
    review.save()
    
    from .serializers import ReviewSerializer
    response_serializer = ReviewSerializer(review)
    
    return Response({
        'status': 'success',
        'message': 'Review updated successfully',
        'data': response_serializer.data
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request, review_id):
    """
    Delete own review (authentication required)
    """
    user = request.user
    
    from .models import Review
    
    try:
        review = Review.objects.get(id=review_id, customer=user)
    except Review.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Review not found or you are not authorized'
        }, status=status.HTTP_404_NOT_FOUND)
    
    review.delete()
    
    return Response({
        'status': 'success',
        'message': 'Review deleted successfully'
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_review_helpful(request, review_id):
    """
    Mark a review as helpful (customer action)
    """
    user = request.user
    
    from .models import Review
    
    try:
        review = Review.objects.get(id=review_id)
    except Review.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Review not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Simple increment - can add tracking to prevent multiple marks
    review.helpful_count += 1
    review.save()
    
    return Response({
        'status': 'success',
        'message': 'Marked as helpful',
        'data': {'helpful_count': review.helpful_count}
    })



#----------------------------------------------------------Retailers Anaylyitcs-----------------------------------------------
# ========== LOYALTY SETTINGS ENDPOINTS ==========

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def loyalty_settings(request):
    """
    GET: Get loyalty program settings
    PUT: Update loyalty program settings (admin/retailer only)
    """
    user = request.user
    
    # Only admin or retailer can update settings
    if request.method == 'PUT' and user.role not in ['admin', 'retailer']:
        return Response({
            'status': 'error',
            'message': 'Only admin or retailers can update loyalty settings'
        }, status=status.HTTP_403_FORBIDDEN)
    
    settings_obj = LoyaltySettings.objects.first()
    
    if not settings_obj:
        # Create default settings if none exist
        settings_obj = LoyaltySettings.objects.create()
    
    if request.method == 'GET':
        serializer = LoyaltySettingsSerializer(settings_obj)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    elif request.method == 'PUT':
        serializer = LoyaltySettingsSerializer(settings_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Loyalty settings updated successfully',
                'data': serializer.data
            })
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# ========== POINTS TRANSACTION ENDPOINTS ==========

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_points_transactions(request):
    """
    Get points transactions for a customer
    Query params: ?customer_id=123&page=1&per_page=20&type=earned
    """
    user = request.user
    
    # Retailer can view any customer's transactions
    if user.role == 'retailer':
        customer_id = request.GET.get('customer_id')
        if customer_id:
            from identity.models import User
            try:
                customer = User.objects.get(id=customer_id, role='customer')
            except User.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Customer not found'
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({
                'status': 'error',
                'message': 'customer_id required for retailer'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    # Customer can only view their own transactions
    elif user.role == 'customer':
        customer = user
    
    else:
        return Response({
            'status': 'error',
            'message': 'Unauthorized access'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Build queryset
    transactions = PointsTransaction.objects.filter(customer=customer)
    
    # Filter by transaction type
    transaction_type = request.GET.get('type')
    if transaction_type:
        transactions = transactions.filter(transaction_type=transaction_type)
    
    # Filter by date range
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    if from_date:
        transactions = transactions.filter(created_at__date__gte=from_date)
    if to_date:
        transactions = transactions.filter(created_at__date__lte=to_date)
    
    # Pagination
    page = int(request.GET.get('page', 1))
    per_page = int(request.GET.get('per_page', 20))
    start = (page - 1) * per_page
    end = start + per_page
    
    total = transactions.count()
    paginated = transactions[start:end]
    
    serializer = PointsTransactionSerializer(paginated, many=True)
    
    return Response({
        'status': 'success',
        'data': {
            'transactions': serializer.data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': (total + per_page - 1) // per_page
            }
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_customer_points_summary(request):
    """
    Get points summary for a customer (balance, tier, expiring points)
    """
    user = request.user
    
    # Retailer can view any customer's summary
    if user.role == 'retailer':
        customer_id = request.GET.get('customer_id')
        if not customer_id:
            return Response({
                'status': 'error',
                'message': 'customer_id required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        from identity.models import User
        try:
            customer = User.objects.get(id=customer_id, role='customer')
        except User.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Customer not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    elif user.role == 'customer':
        customer = user
    
    else:
        return Response({
            'status': 'error',
            'message': 'Unauthorized access'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get settings
    settings_obj = LoyaltySettings.objects.first()
    if not settings_obj:
        settings_obj = LoyaltySettings.objects.create()
    
    # Calculate totals
    transactions = PointsTransaction.objects.filter(customer=customer)
    
    total_earned = transactions.filter(
        transaction_type__in=['earned', 'bonus']
    ).aggregate(total=Sum('points'))['total'] or 0
    
    total_redeemed = transactions.filter(
        transaction_type='redeemed'
    ).aggregate(total=Sum('points'))['total'] or 0
    
    total_expired = transactions.filter(
        transaction_type='expired'
    ).aggregate(total=Sum('points'))['total'] or 0
    
    available_points = total_earned - total_redeemed - total_expired
    
    # Get expiring points (next 30 days)
    next_30_days = timezone.now() + timedelta(days=30)
    expiring_transactions = transactions.filter(
        transaction_type='earned',
        expires_at__lte=next_30_days,
        expires_at__gt=timezone.now()
    )
    expiring_points = expiring_transactions.aggregate(total=Sum('points'))['total'] or 0
    expiring_date = expiring_transactions.order_by('expires_at').first()
    
    # Calculate tier based on total spent
    total_spent = get_customer_total_spent(customer)
    current_tier = calculate_tier(total_spent)
    
    # Calculate points needed for next tier
    tier_thresholds = {
        'Bronze': settings_obj.silver_threshold,
        'Silver': settings_obj.gold_threshold,
        'Gold': settings_obj.platinum_threshold,
        'Platinum': None
    }
    
    next_tier_threshold = tier_thresholds.get(current_tier)
    next_tier = None
    points_to_next_tier = None
    
    if next_tier_threshold:
        points_needed_rupees = next_tier_threshold - total_spent
        points_to_next_tier = int(points_needed_rupees * float(settings_obj.points_per_rupee))
        next_tier = {
            'Bronze': 'Silver',
            'Silver': 'Gold',
            'Gold': 'Platinum'
        }.get(current_tier)
    
    return Response({
        'status': 'success',
        'data': {
            'total_earned': total_earned,
            'total_redeemed': total_redeemed,
            'total_expired': total_expired,
            'available_points': available_points,
            'current_tier': current_tier,
            'points_to_next_tier': max(0, points_to_next_tier) if points_to_next_tier else 0,
            'next_tier': next_tier,
            'expiring_points': expiring_points,
            'expiring_date': expiring_transactions.order_by('expires_at').first().expires_at.date() if expiring_transactions.first() else None
        }
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def redeem_points(request):
    """
    Redeem points for a reward
    """
    user = request.user
    
    if user.role != 'customer':
        return Response({
            'status': 'error',
            'message': 'Only customers can redeem points'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = RedeemPointsSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    reward_id = data.get('reward_id')
    order_id = data.get('order_id')
    metadata = data.get('metadata', {})
    
    # Get reward
    try:
        reward = Reward.objects.get(id=reward_id, is_active=True)
    except Reward.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Reward not found or inactive'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Get current points balance
    current_balance = get_customer_points_balance(user)
    
    # Check if customer has enough points
    if current_balance < reward.points_required:
        return Response({
            'status': 'error',
            'message': f'Insufficient points. Need {reward.points_required}, you have {current_balance}'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check stock
    if reward.stock != -1 and reward.stock <= 0:
        return Response({
            'status': 'error',
            'message': 'Reward out of stock'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get order if provided
    order = None
    if order_id:
        from .models import Order
        try:
            order = Order.objects.get(order_number=order_id, customer=user)
        except Order.DoesNotExist:
            pass
    
    # Create redemption transaction
    transaction = add_points_transaction(
        customer=user,
        points=-reward.points_required,
        transaction_type='redeemed',
        description=f"Redeemed: {reward.name}",
        order=order,
        reward=reward,
        metadata={
            'reward_name': reward.name,
            'reward_category': reward.category,
            'value': str(reward.value) if reward.value else None,
            **metadata
        }
    )
    
    # Update reward stock
    if reward.stock != -1:
        reward.stock -= 1
        reward.total_redeemed += 1
        reward.save()
    
    from .serializers import PointsTransactionSerializer
    transaction_serializer = PointsTransactionSerializer(transaction)
    
    return Response({
        'status': 'success',
        'message': f'Successfully redeemed {reward.name} for {reward.points_required} points',
        'data': {
            'transaction': transaction_serializer.data,
            'remaining_points': current_balance - reward.points_required,
            'reward': {
                'id': reward.id,
                'name': reward.name,
                'code': f"REDEEM-{transaction.transaction_id}"
            }
        }
    })


# ========== REWARDS CATALOG ENDPOINTS ==========

@api_view(['GET'])
@permission_classes([AllowAny])  # Anyone can view rewards (customers, retailers)
def list_rewards(request):
    """
    GET: List all available rewards
    Query params: ?category=discount&min_points=100&max_points=1000&active_only=true
    """
    rewards = Reward.objects.all()
    
    # Filter by category
    category = request.GET.get('category')
    if category:
        rewards = rewards.filter(category=category)
    
    # Filter by points range
    min_points = request.GET.get('min_points')
    max_points = request.GET.get('max_points')
    if min_points:
        rewards = rewards.filter(points_required__gte=min_points)
    if max_points:
        rewards = rewards.filter(points_required__lte=max_points)
    
    # Filter active only
    active_only = request.GET.get('active_only', 'true').lower() == 'true'
    if active_only:
        rewards = rewards.filter(is_active=True)
    
    # Filter in stock only
    in_stock_only = request.GET.get('in_stock_only', 'false').lower() == 'true'
    if in_stock_only:
        rewards = rewards.filter(Q(stock__gt=0) | Q(stock=-1))
    
    # Order by
    ordering = request.GET.get('ordering', 'points_required')
    if ordering == '-points_required':
        rewards = rewards.order_by('-points_required')
    elif ordering == 'name':
        rewards = rewards.order_by('name')
    elif ordering == '-name':
        rewards = rewards.order_by('-name')
    elif ordering == 'popular':
        rewards = rewards.order_by('-is_popular', '-total_redeemed')
    else:
        rewards = rewards.order_by('points_required')
    
    # Pagination
    page = int(request.GET.get('page', 1))
    per_page = int(request.GET.get('per_page', 20))
    start = (page - 1) * per_page
    end = start + per_page
    
    total = rewards.count()
    paginated = rewards[start:end]
    
    serializer = RewardSerializer(paginated, many=True)
    
    return Response({
        'status': 'success',
        'data': {
            'rewards': serializer.data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': (total + per_page - 1) // per_page
            }
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_reward_detail(request, reward_id):
    """
    GET: Get single reward details
    """
    try:
        reward = Reward.objects.get(id=reward_id)
    except Reward.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Reward not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = RewardSerializer(reward)
    
    return Response({
        'status': 'success',
        'data': serializer.data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reward(request):
    """
    POST: Create new reward (Admin or Retailer only)
    """
    user = request.user
    
    if user.role not in ['admin', 'retailer']:
        return Response({
            'status': 'error',
            'message': 'Only admin or retailers can create rewards'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = CreateRewardSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    
    reward = Reward.objects.create(
        name=data['name'],
        category=data['category'],
        points_required=data['points_required'],
        description=data['description'],
        value=data.get('value'),
        image_url=data.get('image_url', ''),
        icon=data.get('icon', ''),
        stock=data.get('stock', 999),
        is_active=data.get('is_active', True),
        is_popular=data.get('is_popular', False)
    )
    
    response_serializer = RewardSerializer(reward)
    
    return Response({
        'status': 'success',
        'message': 'Reward created successfully',
        'data': response_serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_reward(request, reward_id):
    """
    PUT: Update reward (Admin or Retailer only)
    """
    user = request.user
    
    if user.role not in ['admin', 'retailer']:
        return Response({
            'status': 'error',
            'message': 'Only admin or retailers can update rewards'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        reward = Reward.objects.get(id=reward_id)
    except Reward.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Reward not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UpdateRewardSerializer(data=request.data, partial=True)
    if not serializer.is_valid():
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    
    if 'name' in data:
        reward.name = data['name']
    if 'category' in data:
        reward.category = data['category']
    if 'points_required' in data:
        reward.points_required = data['points_required']
    if 'description' in data:
        reward.description = data['description']
    if 'value' in data:
        reward.value = data['value']
    if 'image_url' in data:
        reward.image_url = data['image_url']
    if 'icon' in data:
        reward.icon = data['icon']
    if 'stock' in data:
        reward.stock = data['stock']
    if 'is_active' in data:
        reward.is_active = data['is_active']
    if 'is_popular' in data:
        reward.is_popular = data['is_popular']
    
    reward.save()
    
    response_serializer = RewardSerializer(reward)
    
    return Response({
        'status': 'success',
        'message': 'Reward updated successfully',
        'data': response_serializer.data
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_reward(request, reward_id):
    """
    DELETE: Delete reward (Admin or Retailer only)
    """
    user = request.user
    
    if user.role not in ['admin', 'retailer']:
        return Response({
            'status': 'error',
            'message': 'Only admin or retailers can delete rewards'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        reward = Reward.objects.get(id=reward_id)
    except Reward.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Reward not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check if reward has been redeemed
    if reward.total_redeemed > 0:
        return Response({
            'status': 'error',
            'message': f'Cannot delete reward that has been redeemed {reward.total_redeemed} times. Mark as inactive instead.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    reward.delete()
    
    return Response({
        'status': 'success',
        'message': 'Reward deleted successfully'
    })


# ========== CAMPAIGNS ENDPOINTS ==========

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_campaigns(request):
    """
    GET: List all campaigns
    Query params: ?status=active&type=bonus&page=1&per_page=20
    """
    user = request.user
    
    campaigns = Campaign.objects.all()
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter:
        campaigns = campaigns.filter(status=status_filter)
    else:
        # Default show active and scheduled only for customers
        if user.role == 'customer':
            campaigns = campaigns.filter(status__in=['active', 'scheduled'])
    
    # Filter by campaign type
    campaign_type = request.GET.get('type')
    if campaign_type:
        campaigns = campaigns.filter(campaign_type=campaign_type)
    
    # Filter active campaigns only (for customers)
    active_only = request.GET.get('active_only', 'false').lower() == 'true'
    if active_only:
        from django.utils import timezone
        now = timezone.now()
        campaigns = campaigns.filter(
            start_date__lte=now,
            end_date__gte=now,
            status='active'
        )
    
    # Filter by eligibility (for customers)
    if user.role == 'customer':
        # Get customer tier (simplified - you can implement proper tier detection)
        customer_tier = 'silver'  # This should come from actual customer data
        campaigns = campaigns.filter(
            Q(eligible_tiers=[]) | Q(eligible_tiers__contains=[customer_tier])
        )
    
    # Ordering
    ordering = request.GET.get('ordering', '-created_at')
    campaigns = campaigns.order_by(ordering)
    
    # Pagination
    page = int(request.GET.get('page', 1))
    per_page = int(request.GET.get('per_page', 20))
    start = (page - 1) * per_page
    end = start + per_page
    
    total = campaigns.count()
    paginated = campaigns[start:end]
    
    serializer = CampaignSerializer(paginated, many=True)
    
    return Response({
        'status': 'success',
        'data': {
            'campaigns': serializer.data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': (total + per_page - 1) // per_page
            }
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_campaign_detail(request, campaign_id):
    """
    GET: Get single campaign details
    """
    try:
        campaign = Campaign.objects.get(id=campaign_id)
    except Campaign.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Campaign not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Customers can only view active or scheduled campaigns
    user = request.user
    if user.role == 'customer' and campaign.status not in ['active', 'scheduled']:
        return Response({
            'status': 'error',
            'message': 'Campaign not available'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = CampaignSerializer(campaign)
    
    return Response({
        'status': 'success',
        'data': serializer.data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_campaign(request):
    """
    POST: Create new campaign (Admin or Retailer only)
    """
    user = request.user
    
    if user.role not in ['admin', 'retailer']:
        return Response({
            'status': 'error',
            'message': 'Only admin or retailers can create campaigns'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = CreateCampaignSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    
    campaign = Campaign.objects.create(
        name=data['name'],
        campaign_type=data['campaign_type'],
        bonus_points=data['bonus_points'],
        description=data.get('description', ''),
        eligible_tiers=data.get('eligible_tiers', []),
        min_order_value=data.get('min_order_value'),
        start_date=data['start_date'],
        end_date=data['end_date'],
        status='scheduled'
    )
    
    response_serializer = CampaignSerializer(campaign)
    
    return Response({
        'status': 'success',
        'message': 'Campaign created successfully',
        'data': response_serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_campaign(request, campaign_id):
    """
    PUT: Update campaign (Admin or Retailer only)
    """
    user = request.user
    
    if user.role not in ['admin', 'retailer']:
        return Response({
            'status': 'error',
            'message': 'Only admin or retailers can update campaigns'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        campaign = Campaign.objects.get(id=campaign_id)
    except Campaign.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Campaign not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UpdateCampaignSerializer(data=request.data, partial=True)
    if not serializer.is_valid():
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    
    if 'name' in data:
        campaign.name = data['name']
    if 'campaign_type' in data:
        campaign.campaign_type = data['campaign_type']
    if 'bonus_points' in data:
        campaign.bonus_points = data['bonus_points']
    if 'description' in data:
        campaign.description = data['description']
    if 'eligible_tiers' in data:
        campaign.eligible_tiers = data['eligible_tiers']
    if 'min_order_value' in data:
        campaign.min_order_value = data['min_order_value']
    if 'start_date' in data:
        campaign.start_date = data['start_date']
    if 'end_date' in data:
        campaign.end_date = data['end_date']
    if 'status' in data:
        campaign.status = data['status']
    
    campaign.save()
    
    response_serializer = CampaignSerializer(campaign)
    
    return Response({
        'status': 'success',
        'message': 'Campaign updated successfully',
        'data': response_serializer.data
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_campaign(request, campaign_id):
    """
    DELETE: Delete campaign (Admin or Retailer only)
    """
    user = request.user
    
    if user.role not in ['admin', 'retailer']:
        return Response({
            'status': 'error',
            'message': 'Only admin or retailers can delete campaigns'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        campaign = Campaign.objects.get(id=campaign_id)
    except Campaign.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Campaign not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Cannot delete campaign that has been redeemed
    if campaign.total_redeemed > 0:
        return Response({
            'status': 'error',
            'message': f'Cannot delete campaign that has been used {campaign.total_redeemed} times. Cancel it instead.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    campaign.delete()
    
    return Response({
        'status': 'success',
        'message': 'Campaign deleted successfully'
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_campaign_bonus(request, campaign_id):
    """
    POST: Apply campaign bonus to customer order (internal use)
    Called when customer completes an order that qualifies for campaign
    """
    user = request.user
    
    if user.role != 'customer':
        return Response({
            'status': 'error',
            'message': 'Only customers can claim campaign bonuses'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        campaign = Campaign.objects.get(id=campaign_id)
    except Campaign.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Campaign not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check if campaign is active
    from django.utils import timezone
    now = timezone.now()
    
    if not campaign.is_active_now():
        return Response({
            'status': 'error',
            'message': 'Campaign is not currently active'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if customer qualifies (simplified - should check tier and order value)
    order_id = request.data.get('order_id')
    order_value = request.data.get('order_value', 0)
    
    if campaign.min_order_value and float(order_value) < float(campaign.min_order_value):
        return Response({
            'status': 'error',
            'message': f'Minimum order value of ₹{campaign.min_order_value} required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Add bonus points to customer
    from .utils import add_points_transaction
    
    transaction = add_points_transaction(
        customer=user,
        points=campaign.bonus_points,
        transaction_type='bonus',
        description=f"Campaign bonus: {campaign.name}",
        metadata={
            'campaign_id': campaign.id,
            'campaign_name': campaign.name,
            'order_id': order_id
        }
    )
    
    # Increment campaign redemption count
    campaign.total_redeemed += 1
    campaign.save()
    
    return Response({
        'status': 'success',
        'message': f'Bonus {campaign.bonus_points} points added from {campaign.name}',
        'data': {
            'bonus_points': campaign.bonus_points,
            'campaign_name': campaign.name,
            'transaction_id': transaction.transaction_id
        }
    })


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def loyalty_settings(request):
    """
    GET: Get loyalty program settings
    PUT: Update loyalty program settings (Admin or Retailer only)
    """
    user = request.user
    
    # Get or create default settings
    settings_obj = LoyaltySettings.objects.first()
    if not settings_obj:
        settings_obj = LoyaltySettings.objects.create()
    
    # GET request - anyone authenticated can view
    if request.method == 'GET':
        serializer = LoyaltySettingsSerializer(settings_obj)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    # PUT request - only admin or retailer can update
    if request.method == 'PUT':
        if user.role not in ['admin', 'retailer']:
            return Response({
                'status': 'error',
                'message': 'Only admin or retailers can update loyalty settings'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = UpdateLoyaltySettingsSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({
                'status': 'error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        # Update only provided fields
        if 'points_per_rupee' in data:
            settings_obj.points_per_rupee = data['points_per_rupee']
        if 'min_redemption_points' in data:
            settings_obj.min_redemption_points = data['min_redemption_points']
        if 'max_redemption_points' in data:
            settings_obj.max_redemption_points = data['max_redemption_points']
        if 'points_expiry_months' in data:
            settings_obj.points_expiry_months = data['points_expiry_months']
        if 'welcome_bonus_points' in data:
            settings_obj.welcome_bonus_points = data['welcome_bonus_points']
        if 'birthday_bonus_points' in data:
            settings_obj.birthday_bonus_points = data['birthday_bonus_points']
        if 'referral_bonus_points' in data:
            settings_obj.referral_bonus_points = data['referral_bonus_points']
        if 'bronze_threshold' in data:
            settings_obj.bronze_threshold = data['bronze_threshold']
        if 'silver_threshold' in data:
            settings_obj.silver_threshold = data['silver_threshold']
        if 'gold_threshold' in data:
            settings_obj.gold_threshold = data['gold_threshold']
        if 'platinum_threshold' in data:
            settings_obj.platinum_threshold = data['platinum_threshold']
        
        settings_obj.save()
        
        response_serializer = LoyaltySettingsSerializer(settings_obj)
        
        return Response({
            'status': 'success',
            'message': 'Loyalty settings updated successfully',
            'data': response_serializer.data
        })
