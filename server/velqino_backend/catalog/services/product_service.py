from django.db import transaction
from django.core.paginator import Paginator
from django.core.cache import cache
from ..models import Product, Category, ProductImage
from ..utils.product_helpers import ProductHelpers
from ..tasks import process_bulk_images_task, process_bulk_video_task
import logging

logger = logging.getLogger(__name__)


class ProductService:
    """Business logic layer with connection pooling and indexing"""
    
    @staticmethod
    def create_product(seller, data, front_image=None, back_image=None):
        """Create single product with images"""
        with transaction.atomic():
            product = Product.objects.create(
                seller=seller,
                name=data.get('name'),
                price=data['price'],
                cost=data['cost'],
                category_id=data.get('category_id'),
                brand=data.get('brand', ''),
                description=data.get('description', ''),
                pattern=data.get('pattern', ''),
                primary_color=data.get('primary_color', ''),
                status='active'
            )
            
            # Add front image
            if front_image:
                ProductImage.objects.create(
                    product=product,
                    image=front_image,
                    is_primary=True,
                    is_front=True,
                    order=0
                )
            
            # Add back image
            if back_image:
                ProductImage.objects.create(
                    product=product,
                    image=back_image,
                    is_primary=False,
                    is_front=False,
                    order=1
                )
            
            ProductHelpers.invalidate_product_caches(seller.id)
            return product
    
    @staticmethod
    def get_products_with_filters(seller_id, filters, page=1, per_page=20):
        """Get products with filtering, pagination, and indexing"""
        cache_key = f"product:list:{seller_id}:{hash(str(filters))}:{page}:{per_page}"
        cached = cache.get(cache_key)
        
        if cached:
            return cached
        
        queryset = Product.objects.filter(seller_id=seller_id).select_related('category')
        
        # Apply filters with indexes
        if filters.get('category'):
            queryset = queryset.filter(category_id=filters['category'])
        
        if filters.get('status'):
            queryset = queryset.filter(status=filters['status'])
        
        if filters.get('min_price'):
            queryset = queryset.filter(price__gte=filters['min_price'])
        
        if filters.get('max_price'):
            queryset = queryset.filter(price__lte=filters['max_price'])
        
        if filters.get('pattern'):
            queryset = queryset.filter(pattern=filters['pattern'])
        
        if filters.get('low_stock'):
            queryset = ProductHelpers.get_low_stock_products(seller_id)
        
        if filters.get('search'):
            queryset = ProductHelpers.search_products(filters['search'], seller_id)
        
        # Paginate
        paginator = Paginator(queryset, per_page)
        products = paginator.get_page(page)
        
        result = {
            'products': products,
            'total': paginator.count,
            'page': page,
            'per_page': per_page,
            'total_pages': paginator.num_pages
        }
        
        cache.set(cache_key, result, 300)  # 5 minutes
        return result
    
    @staticmethod
    def bulk_operation(seller_id, product_ids, operation, value=None):
        """Perform bulk operations"""
        products = Product.objects.filter(seller_id=seller_id, id__in=product_ids)
        
        if operation == 'delete':
            count = products.delete()[0]
            ProductHelpers.invalidate_product_caches(seller_id)
            return {'deleted': count}
        
        elif operation == 'update_status':
            count = products.update(status=value)
            ProductHelpers.invalidate_product_caches(seller_id)
            return {'updated': count}
        
        elif operation == 'update_price':
            with transaction.atomic():
                for product in products:
                    product.price = value
                    product.save()
            ProductHelpers.invalidate_product_caches(seller_id)
            return {'updated': len(product_ids)}
        
        return {'error': 'Invalid operation'}
    
    @staticmethod
    def trigger_bulk_image_processing(seller_id, images, common_data):
        """Trigger async task for bulk image processing"""
        task = process_bulk_images_task.delay(
            seller_id=seller_id,
            images_data=[img.read() for img in images],
            common_price=common_data['common_price'],
            common_cost=common_data['common_cost'],
            category_id=common_data.get('category_id'),
            common_name_prefix=common_data.get('common_name_prefix', 'Product'),
            brand=common_data.get('brand', ''),
            description=common_data.get('description', ''),
            upload_mode=common_data.get('upload_mode', 'front_back'),
            sizes=common_data.get('sizes', []),
        )
        return {'task_id': task.id, 'status': 'queued'}
    
    @staticmethod
    def trigger_bulk_video_processing(seller_id, video, common_data):
        """Trigger async task for bulk video processing"""
        task = process_bulk_video_task.delay(
            seller_id=seller_id,
            video_data=video.read(),
            number_of_products=common_data['number_of_products'],
            common_price=common_data['common_price'],
            common_cost=common_data['common_cost'],
            category_id=common_data.get('category_id'),
            common_name_prefix=common_data.get('common_name_prefix', 'Product'),
            brand=common_data.get('brand', ''),
            description=common_data.get('description', ''),
            sizes=common_data.get('sizes', []),
            grid_rows=common_data.get('grid_rows', 2),
            grid_columns=common_data.get('grid_columns', 5)
        )
        return {'task_id': task.id, 'status': 'queued'}