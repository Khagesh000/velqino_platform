from celery import shared_task
from django.core.mail import send_mail
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_order_confirmation_email(order_id):
    """Send order confirmation email"""
    from commerce.models import Order
    
    try:
        order = Order.objects.get(id=order_id)
        
        send_mail(
            f'Order Confirmation - {order.order_number}',
            f'Your order has been placed successfully!\n\nOrder ID: {order.order_number}\nTotal: ₹{order.grand_total}\nExpected Delivery: {order.expected_delivery_date}',
            'orders@velqino.com',
            [order.customer.email],
            fail_silently=True,
        )
        
        logger.info(f"Order confirmation email sent for {order.order_number}")
        
    except Exception as e:
        logger.error(f"Failed to send order email: {str(e)}")


@shared_task
def update_order_analytics(order_id):
    """Update analytics after order"""
    from commerce.models import Order
    from analytics_engine.models import OrderMetric  # Create if needed
    
    try:
        order = Order.objects.get(id=order_id)
        
        # Update cache for dashboard
        cache_key = f"analytics:daily_orders:{order.created_at.date()}"
        daily_orders = cache.get(cache_key, 0)
        cache.set(cache_key, daily_orders + 1, 86400)
        
        cache_key_amount = f"analytics:daily_revenue:{order.created_at.date()}"
        daily_revenue = cache.get(cache_key_amount, 0)
        cache.set(cache_key_amount, daily_revenue + float(order.grand_total), 86400)
        
        logger.info(f"Analytics updated for order {order.order_number}")
        
    except Exception as e:
        logger.error(f"Failed to update analytics: {str(e)}")