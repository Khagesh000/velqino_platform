import logging
from decimal import Decimal
from django.db import models
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count, Q, F
from typing import Dict, Any

logger = logging.getLogger(__name__)


class AnalyticsService:
    """Advanced analytics service with caching and optimization"""
    
    CACHE_TTL = 300  # 5 minutes
    CACHE_KEY_PREFIX = 'wholesaler_stats'
    
    @staticmethod
    def get_cache_key(user_id: int) -> str:
        """Generate cache key for wholesaler stats"""
        return f"{AnalyticsService.CACHE_KEY_PREFIX}:{user_id}"
    
    @staticmethod
    def get_wholesaler_stats(user, start_date=None, end_date=None, range_type=None):
        """Get all dashboard statistics for a wholesaler with date filtering"""
        from commerce.models import Order, OrderItem
        from catalog.models import Product
        from django.contrib.auth import get_user_model
        from django.db.models import Q
        
        User = get_user_model()
        
        # Generate cache key with date params
        cache_key = f"{AnalyticsService.get_cache_key(user.id)}:{start_date}:{end_date}:{range_type}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data
        
        # Build date filter
        date_filter = AnalyticsService._build_date_filter(start_date, end_date, range_type)
        
        # ==================== ORDER STATS ====================
        orders = Order.objects.filter(wholesaler=user)
        if date_filter:
            orders = orders.filter(**date_filter)
        
        delivered_orders = orders.filter(status='delivered')
        pending_orders = orders.filter(status__in=['pending', 'confirmed'])
        
        # Total revenue
        total_revenue = delivered_orders.aggregate(total=Sum('grand_total'))['total'] or Decimal('0')
        
        # Previous period for revenue change
        prev_date_filter = AnalyticsService._get_previous_period_filter(start_date, end_date, range_type)
        if prev_date_filter:
            prev_orders = Order.objects.filter(wholesaler=user, status='delivered', **prev_date_filter)
            prev_revenue = prev_orders.aggregate(total=Sum('grand_total'))['total'] or Decimal('0')
            revenue_change = round(((total_revenue - prev_revenue) / prev_revenue) * 100, 1) if prev_revenue > 0 else 0
            revenue_trend = 'up' if revenue_change >= 0 else 'down'
        else:
            revenue_change = 0
            revenue_trend = 'up'
        
        # ==================== ORDER COUNTS ====================
        pending_count = pending_orders.count()
        
        # ==================== PRODUCT STATS ====================
        products = Product.objects.filter(seller=user)
        total_products = products.filter(status='active').count()
        low_stock_products = products.filter(
            stock__lte=models.F('threshold'), 
            stock__gt=0,
            status='active'
        ).count()
        out_of_stock_products = products.filter(stock=0, status='active').count()
        
        # ==================== CUSTOMER STATS ====================
        unique_retailers = orders.filter(retailer__isnull=False).values('retailer').distinct().count()
        
        # ==================== ORDER VALUE ====================
        avg_order_value = 0
        if delivered_orders.count() > 0:
            avg_order_value = total_revenue / delivered_orders.count()
        
        # Completion rate
        total_orders = orders.count()
        completion_rate = round((delivered_orders.count() / total_orders) * 100, 1) if total_orders > 0 else 0
        
        result = {
            'total_revenue': float(total_revenue),
            'revenue_change': float(revenue_change),
            'revenue_trend': revenue_trend,
            'pending_orders': pending_count,
            'pending_change': 0,
            'total_products': total_products,
            'products_change': 0,
            'low_stock_products': low_stock_products,
            'out_of_stock_products': out_of_stock_products,
            'total_customers': unique_retailers,
            'customers_change': 0,
            'avg_order_value': float(avg_order_value),
            'completed_orders': delivered_orders.count(),
            'completion_rate': float(completion_rate)
        }
        
        cache.set(cache_key, result, AnalyticsService.CACHE_TTL)
        return result


    @staticmethod
    def _build_date_filter(start_date=None, end_date=None, range_type=None):
        """Build date filter from parameters"""
        from django.utils import timezone
        from datetime import timedelta
        
        if start_date and end_date:
            return {'created_at__date__gte': start_date, 'created_at__date__lte': end_date}
        
        today = timezone.now().date()
        
        range_map = {
            'today': {'created_at__date': today},
            'yesterday': {'created_at__date': today - timedelta(days=1)},
            'last7days': {'created_at__date__gte': today - timedelta(days=7)},
            'last30days': {'created_at__date__gte': today - timedelta(days=30)},
            'thisMonth': {'created_at__date__gte': today.replace(day=1)},
            'lastMonth': {
                'created_at__date__gte': (today.replace(day=1) - timedelta(days=1)).replace(day=1),
                'created_at__date__lt': today.replace(day=1)
            },
        }
        
        return range_map.get(range_type, {})


    @staticmethod
    def _get_previous_period_filter(start_date=None, end_date=None, range_type=None):
        """Get filter for previous period for comparison"""
        from django.utils import timezone
        from datetime import timedelta
        
        if start_date and end_date:
            duration = (datetime.strptime(end_date, '%Y-%m-%d') - datetime.strptime(start_date, '%Y-%m-%d')).days
            prev_end = datetime.strptime(start_date, '%Y-%m-%d') - timedelta(days=1)
            prev_start = prev_end - timedelta(days=duration)
            return {'created_at__date__gte': prev_start.date(), 'created_at__date__lte': prev_end.date()}
        
        today = timezone.now().date()
        
        range_map = {
            'today': {'created_at__date': today - timedelta(days=1)},
            'yesterday': {'created_at__date': today - timedelta(days=2)},
            'last7days': {'created_at__date__range': [today - timedelta(days=14), today - timedelta(days=8)]},
            'last30days': {'created_at__date__range': [today - timedelta(days=60), today - timedelta(days=31)]},
            'thisMonth': {'created_at__date__range': [
                (today.replace(day=1) - timedelta(days=1)).replace(day=1),
                today.replace(day=1) - timedelta(days=1)
            ]},
            'lastMonth': {'created_at__date__range': [
                (today.replace(day=1) - timedelta(days=32)).replace(day=1),
                (today.replace(day=1) - timedelta(days=1)).replace(day=1) - timedelta(days=1)
            ]},
        }
        
        return range_map.get(range_type, {})
    
    @staticmethod
    def get_order_stats(user) -> Dict[str, Any]:
        """Get order statistics (today, week, month, total)"""
        from commerce.models import Order
        
        today = timezone.now().date()
        week_start = today - timedelta(days=7)
        month_start = today - timedelta(days=30)
        
        orders = Order.objects.filter(wholesaler=user)
        
        return {
            'today': orders.filter(created_at__date=today).count(),
            'this_week': orders.filter(created_at__date__gte=week_start).count(),
            'this_month': orders.filter(created_at__date__gte=month_start).count(),
            'total': orders.count()
        }
    
    @staticmethod
    def get_revenue_stats(user) -> Dict[str, Any]:
        """Get revenue statistics (today, week, month, total)"""
        from commerce.models import Order
        
        today = timezone.now().date()
        week_start = today - timedelta(days=7)
        month_start = today - timedelta(days=30)
        
        delivered_orders = Order.objects.filter(wholesaler=user, status='delivered')
        
        today_revenue = delivered_orders.filter(created_at__date=today).aggregate(
            total=Sum('grand_total')
        )['total'] or Decimal('0')
        
        week_revenue = delivered_orders.filter(created_at__date__gte=week_start).aggregate(
            total=Sum('grand_total')
        )['total'] or Decimal('0')
        
        month_revenue = delivered_orders.filter(created_at__date__gte=month_start).aggregate(
            total=Sum('grand_total')
        )['total'] or Decimal('0')
        
        total_revenue = delivered_orders.aggregate(total=Sum('grand_total'))['total'] or Decimal('0')
        
        return {
            'today': float(today_revenue),
            'this_week': float(week_revenue),
            'this_month': float(month_revenue),
            'total': float(total_revenue)
        }
    
    @staticmethod
    def get_product_stats(user) -> Dict[str, Any]:
        """Get product statistics"""
        from catalog.models import Product
        
        products = Product.objects.filter(seller=user)
        
        return {
            'active': products.filter(status='active').count(),
            'draft': products.filter(status='draft').count(),
            'archived': products.filter(status='archived').count(),
            'low_stock': products.filter(stock__lte=models.F('threshold'), stock__gt=0).count(),
            'out_of_stock': products.filter(stock=0).count()
        }
    
    @staticmethod
    def invalidate_cache(user_id: int):
        """Invalidate cache when data changes"""
        cache_key = AnalyticsService.get_cache_key(user_id)
        cache.delete(cache_key)
        logger.info(f"Invalidated analytics cache for user {user_id}")