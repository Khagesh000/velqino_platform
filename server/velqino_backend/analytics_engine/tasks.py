from celery import shared_task
from django.core.cache import cache
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


@shared_task
def precompute_all_wholesaler_stats():
    """Precompute stats for all wholesalers (run daily via cron)"""
    from identity.models import User
    from analytics_engine.services.analytics_service import AnalyticsService
    
    wholesalers = User.objects.filter(role='wholesaler', is_active=True)
    
    for wholesaler in wholesalers:
        try:
            # Compute and cache stats
            stats = AnalyticsService.get_wholesaler_stats(wholesaler)
            logger.info(f"Precomputed stats for wholesaler {wholesaler.id}")
        except Exception as e:
            logger.error(f"Failed to precompute stats for wholesaler {wholesaler.id}: {e}")
    
    return {'processed': wholesalers.count()}


@shared_task
def update_stats_on_order_created(order_id):
    """Update stats when new order is created"""
    from commerce.models import Order
    from analytics_engine.services.analytics_service import AnalyticsService
    
    try:
        order = Order.objects.select_related('wholesaler').get(id=order_id)
        if order.wholesaler:
            AnalyticsService.invalidate_cache(order.wholesaler.id)
            logger.info(f"Invalidated cache for wholesaler {order.wholesaler.id} due to new order")
    except Exception as e:
        logger.error(f"Failed to update stats on order created: {e}")


@shared_task
def update_stats_on_product_created(product_id):
    """Update stats when new product is created"""
    from catalog.models import Product
    from analytics_engine.services.analytics_service import AnalyticsService
    
    try:
        product = Product.objects.select_related('seller').get(id=product_id)
        if product.seller and product.seller.role == 'wholesaler':
            AnalyticsService.invalidate_cache(product.seller.id)
    except Exception as e:
        logger.error(f"Failed to update stats on product created: {e}")


@shared_task
def clean_expired_analytics_cache():
    """Clean expired analytics cache entries"""
    # Redis will auto-expire, but this can be used for custom cleanup
    logger.info("Analytics cache cleanup completed")