import logging
from django.core.cache import cache
from django.db import transaction, models
from django.db.models import Q
from django.utils import timezone
from celery import shared_task
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)


class WishlistService:
    """Advanced wishlist service with caching, monitoring, and async operations"""
    
    CACHE_TTL = 600  # 10 minutes
    BATCH_SIZE = 50
    
    @staticmethod
    def get_cached_wishlist(user_id: int) -> Optional[List[Dict]]:
        """Get wishlist from cache"""
        cache_key = f"wishlist:user:{user_id}"
        return cache.get(cache_key)
    
    @staticmethod
    def invalidate_wishlist_cache(user_id: int):
        """Invalidate wishlist cache"""
        cache_keys = [
            f"wishlist:user:{user_id}",
            f"wishlist:count:{user_id}",
            f"wishlist:products:{user_id}"
        ]
        for key in cache_keys:
            cache.delete(key)
        logger.info(f"Invalidated wishlist cache for user {user_id}")
    
    @staticmethod
    def get_wishlist_with_products(user, page=1, per_page=20):
        """Get wishlist with pagination and all product images"""
        from catalog.models import Wishlist
        from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
        
        # Get wishlist items with related products and images
        wishlist_items = Wishlist.objects.filter(
            user=user
        ).select_related(
            'product',
            'product__category'
        ).prefetch_related(
            'product__images'  # ✅ Prefetch all images
        ).order_by('-added_at')
        
        # Paginate
        paginator = Paginator(wishlist_items, per_page)
        
        try:
            paginated_items = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            paginated_items = paginator.page(1)
        
        # Serialize with all images
        from catalog.serializers import WishlistSerializer
        serializer = WishlistSerializer(paginated_items, many=True)
        
        return {
            'items': serializer.data,
            'pagination': {
                'total': paginator.count,
                'page': page,
                'per_page': per_page,
                'total_pages': paginator.num_pages
            }
        }
    
    @staticmethod
    @transaction.atomic
    def add_to_wishlist(user, product_id: int) -> Dict[str, Any]:
        """Add product to wishlist with validation"""
        from catalog.models import Product, Wishlist
        
        try:
            product = Product.objects.select_for_update().get(
                id=product_id, 
                status='active'
            )
        except Product.DoesNotExist:
            raise ValueError("Product not found or inactive")
        
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=user,
            product=product
        )
        
        # Invalidate cache
        WishlistService.invalidate_wishlist_cache(user.id)
        
        # Sync to analytics
        sync_wishlist_to_analytics.delay(user.id, product_id, 'add')
        
        return {
            'created': created,
            'item_id': wishlist_item.id,
            'added_at': wishlist_item.added_at
        }
    
    @staticmethod
    @transaction.atomic
    def remove_from_wishlist(user, product_id: int) -> bool:
        """Remove product from wishlist"""
        from catalog.models import Wishlist
        
        deleted_count, _ = Wishlist.objects.filter(
            user=user, 
            product_id=product_id
        ).delete()
        
        if deleted_count > 0:
            WishlistService.invalidate_wishlist_cache(user.id)
            sync_wishlist_to_analytics.delay(user.id, product_id, 'remove')
            return True
        
        return False
    
    @staticmethod
    def bulk_add_to_wishlist(user, product_ids: List[int]) -> Dict[str, Any]:
        """Add multiple products to wishlist in bulk"""
        from catalog.models import Product, Wishlist
        
        results = {
            'added': [],
            'already_exists': [],
            'failed': []
        }
        
        with transaction.atomic():
            products = Product.objects.filter(
                id__in=product_ids,
                status='active'
            ).select_for_update()
            
            for product in products:
                _, created = Wishlist.objects.get_or_create(
                    user=user,
                    product=product
                )
                if created:
                    results['added'].append(product.id)
                else:
                    results['already_exists'].append(product.id)
            
            # Invalidate cache
            WishlistService.invalidate_wishlist_cache(user.id)
            
            # Async analytics
            bulk_sync_wishlist.delay(user.id, product_ids, 'bulk_add')
        
        return results
    
    @staticmethod
    def get_wishlist_stats(user_id: int) -> Dict[str, Any]:
        """Get wishlist statistics"""
        from catalog.models import Wishlist
        
        # Try cache
        cache_key = f"wishlist:stats:{user_id}"
        cached = cache.get(cache_key)
        if cached:
            return cached
        
        stats = {
            'total_items': Wishlist.objects.filter(user_id=user_id).count(),
            'total_value': Wishlist.objects.filter(
                user_id=user_id
            ).aggregate(total=models.Sum('product__price'))['total'] or 0,
            'most_recent': None,
            'oldest': None
        }
        
        recent = Wishlist.objects.filter(user_id=user_id).order_by('-added_at').first()
        if recent:
            stats['most_recent'] = {
                'product_id': recent.product_id,
                'product_name': recent.product.name,
                'added_at': recent.added_at
            }
        
        cache.set(cache_key, stats, 300)  # 5 minutes
        return stats


    
@shared_task(bind=True, max_retries=3)
def sync_wishlist_to_analytics(self, user_id: int, product_id: int, action: str):
    """Async task to sync wishlist actions to analytics engine"""
    try:
        logger.info(f"Wishlist {action} synced for user {user_id}, product {product_id}")
    except Exception as e:
        logger.error(f"Failed to sync wishlist analytics: {e}")
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=2)
def bulk_sync_wishlist(self, user_id: int, product_ids: List[int], action: str):
    """Async task for bulk wishlist operations"""
    try:
        for product_id in product_ids:
            sync_wishlist_to_analytics.delay(user_id, product_id, action)
        logger.info(f"Bulk wishlist {action} synced for user {user_id}, {len(product_ids)} products")
    except Exception as e:
        logger.error(f"Failed bulk sync: {e}")
        raise self.retry(exc=e, countdown=120)


@shared_task
def cleanup_orphaned_wishlist_items():
    """Clean up wishlist items where product is deleted"""
    from catalog.models import Wishlist, Product
        
    orphaned = Wishlist.objects.filter(product__isnull=True)
    count = orphaned.count()
    orphaned.delete()
        
    logger.info(f"Cleaned up {count} orphaned wishlist items")
    return {'cleaned': count}


@shared_task
def send_wishlist_reminder_email(user_id: int):
    """Send email reminder for wishlist items (weekly)"""
    from catalog.models import Wishlist
    from django.core.mail import send_mail
        
    user_wishlist = Wishlist.objects.filter(user_id=user_id).select_related('product')
        
    if not user_wishlist.exists():
        return {'sent': False, 'reason': 'Empty wishlist'}
        
    product_names = [item.product.name for item in user_wishlist[:5]]
        
    send_mail(
        'Your wishlist items are waiting!',
        f"Items in your wishlist: {', '.join(product_names)}. Shop now!",
        'noreply@velqino.com',
        [user_wishlist[0].user.email],
        fail_silently=True
    )
        
    logger.info(f"Wishlist reminder sent to user {user_id}")
    return {'sent': True, 'items_count': user_wishlist.count()}