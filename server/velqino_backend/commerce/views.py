from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from .models import Order, OrderItem
from catalog.models import Product
import uuid

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