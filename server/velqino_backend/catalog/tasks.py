from celery import shared_task
from django.core.cache import cache
from .models import Product
from .utils.product_helpers import ProductHelpers
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, soft_time_limit=300, time_limit=600)
def process_bulk_video_task(self, seller_id, video_data, number_of_products, 
                            common_price, common_cost, category_id, 
                            common_name_prefix, brand, description, 
                            grid_rows, grid_columns, sizes=None,):
    """
    Process video and create multiple products
    """
    try:
        from .services.ai_service import AIService
        
        print(f"🎥 Processing bulk video task for seller {seller_id}")
        
        result = AIService.process_bulk_video(
            seller_id=seller_id,
            video_data=video_data,
            product_count=number_of_products,
            common_price=common_price,
            common_cost=common_cost,
            category_id=category_id,
            name_prefix=common_name_prefix,
            brand=brand,
            description=description,
            sizes=sizes or [],
            grid_rows=grid_rows,
            grid_columns=grid_columns,
            task_id=self.request.id
        )
        
        # Invalidate caches
        ProductHelpers.invalidate_product_caches(seller_id)
        
        return result
        
    except Exception as e:
        logger.error(f"Bulk video task failed: {e}")
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3, soft_time_limit=300, time_limit=600)
def process_bulk_images_task(self, seller_id, images_data, common_price, common_cost,
                             category_id, common_name_prefix, brand, description, sizes=None,
                             upload_mode='front_back'):  # ✅ ADD
    try:
        from .services.ai_service import AIService

        print(f"🖼️ Processing bulk images task for seller {seller_id}")

        result = AIService.process_bulk_images(
            seller_id=seller_id,
            images_data=images_data,
            common_price=common_price,
            common_cost=common_cost,
            category_id=category_id,
            name_prefix=common_name_prefix,
            brand=brand,
            description=description,
            upload_mode=upload_mode,  
            sizes=sizes or [],
            task_id=self.request.id
        )

        ProductHelpers.invalidate_product_caches(seller_id)
        return result

    except Exception as e:
        logger.error(f"Bulk images task failed: {e}")
        raise self.retry(exc=e, countdown=60)


@shared_task
def check_low_stock_task(seller_id):
    """Check and alert low stock products"""
    low_stock = ProductHelpers.get_low_stock_products(seller_id)
    
    if low_stock.exists():
        logger.warning(f"Low stock alert: {low_stock.count()} products for seller {seller_id}")
        return {
            'low_stock_count': low_stock.count(),
            'products': list(low_stock.values('id', 'name', 'stock', 'threshold'))
        }
    
    return {'low_stock_count': 0}