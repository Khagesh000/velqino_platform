from django.db.models import Q, Sum, F
from django.core.cache import cache
from ..models import Product, ProductVariant


class ProductHelpers:
    """Helper functions for product operations with caching"""
    
    CACHE_TTL = 300  # 5 minutes
    
    @staticmethod
    def get_low_stock_products(seller_id):
        """Get low stock products for a seller"""
        cache_key = f"low_stock:{seller_id}"
        cached = cache.get(cache_key)
        
        if cached is not None:
            return cached
        
        result = Product.objects.filter(
            seller_id=seller_id,
            status='active',
            stock__lte=F('threshold')
        )
        
        cache.set(cache_key, result, ProductHelpers.CACHE_TTL)
        return result
    
    @staticmethod
    def get_total_stock_value(seller_id):
        """Calculate total inventory value"""
        cache_key = f"stock_value:{seller_id}"
        cached = cache.get(cache_key)
        
        if cached is not None:
            return cached
        
        products = Product.objects.filter(seller_id=seller_id, status='active')
        total = sum(float(p.cost or 0) * p.stock for p in products)
        
        cache.set(cache_key, total, ProductHelpers.CACHE_TTL)
        return total
    
    @staticmethod
    def search_products(query, seller_id=None, limit=50):
        """Search products by name, sku, brand with indexing"""
        cache_key = f"search:{seller_id}:{query}"
        cached = cache.get(cache_key)
        
        if cached is not None:
            return cached
        
        q = Q(name__icontains=query) | Q(sku__icontains=query) | Q(brand__icontains=query)
        if seller_id:
            q &= Q(seller_id=seller_id)
        
        result = Product.objects.filter(q)[:limit]
        cache.set(cache_key, result, 60)  # 1 minute for search
        return result
    
    @staticmethod
    def bulk_update_price(product_ids, percentage):
        """Bulk update prices by percentage"""
        multiplier = 1 + (percentage / 100)
        updated = Product.objects.filter(id__in=product_ids).update(
            price=F('price') * multiplier
        )
        
        # Invalidate caches
        for pid in product_ids:
            cache.delete(f"product:{pid}")
        
        return updated
    
    @staticmethod
    def invalidate_product_caches(seller_id, product_id=None):
        """Invalidate all product-related caches"""
        if product_id:
            cache.delete(f"product:{product_id}")
        cache.delete_pattern(f"product:list:{seller_id}:*")
        cache.delete(f"low_stock:{seller_id}")
        cache.delete(f"stock_value:{seller_id}")