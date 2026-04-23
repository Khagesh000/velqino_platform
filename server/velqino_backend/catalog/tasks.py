from celery import shared_task
from django.core.cache import cache
from django.db import transaction
from django.db import models
from .models import Product
from .utils.product_helpers import ProductHelpers
from commerce.models import StockHistory
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, soft_time_limit=300, time_limit=600)
def process_bulk_video_task(self, seller_id, video_data, number_of_products, 
                            common_price, common_cost, category_id, 
                            common_name_prefix, brand, description, 
                            grid_rows, grid_columns, 
                            upload_mode='bulk_single_product', sizes=None):
    """
    Process video and create ONE product with all detected items
    """
    try:
        from catalog.services.ai_service import AIService
        
        print(f"🎥 Processing bulk video for seller {seller_id}")
        print(f"📌 Mode: {upload_mode}")
        print(f"📊 Detected products: {number_of_products}")
        
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
            upload_mode=upload_mode,
            sizes=sizes or [],
            grid_rows=grid_rows,
            grid_columns=grid_columns,
            task_id=self.request.id
        )
        
        from catalog.utils.product_helpers import ProductHelpers
        ProductHelpers.invalidate_product_caches(seller_id)
        
        print(f"✅ Bulk video processed: {result}")
        return result
        
    except Exception as e:
        logger.error(f"Bulk video task failed: {e}")
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3, soft_time_limit=300, time_limit=600)
def process_bulk_images_task(self, seller_id, images_data, common_price, common_cost,
                             category_id, common_name_prefix, brand, description, 
                             upload_mode='bulk_single_product', sizes=None):
    """Process bulk images - creates ONE product with all images by default"""
    try:
        from catalog.services.ai_service import AIService

        print(f"🖼️ Processing bulk images for seller {seller_id}")
        print(f"📌 Mode: {upload_mode}")
        print(f"📸 Images count: {len(images_data)}")

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

        from catalog.utils.product_helpers import ProductHelpers
        ProductHelpers.invalidate_product_caches(seller_id)
        
        print(f"✅ Bulk images processed: {result}")
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



@shared_task(bind=True, max_retries=3, soft_time_limit=30)
def update_product_stock_task(self, product_id, quantity, deduct=True):
    """
    Update product stock with retry mechanism
    """
    from catalog.models import Product
    from commerce.models import StockHistory
    
    try:
        with transaction.atomic():
            product = Product.objects.select_for_update().get(id=product_id)
            
            old_stock = product.stock
            
            if deduct:
                if product.stock < quantity:
                    raise ValueError(f"Insufficient stock for {product.name}")
                product.stock -= quantity
            else:
                product.stock += quantity
            
            product.save()
            
            # Log stock history
            StockHistory.objects.create(
                product=product,
                transaction_type='order' if deduct else 'cancel',
                quantity=quantity,
                old_stock=old_stock,
                new_stock=product.stock
            )
            
            # Invalidate cache
            cache.delete(f"product:{product_id}")
            
            # Check low stock alert
            if product.is_low_stock():
                check_low_stock_alert.delay(product_id)
            
            logger.info(f"Stock updated for {product.name}: {old_stock} → {product.stock}")
            
            return True
            
    except Exception as e:
        logger.error(f"Failed to update stock for product {product_id}: {str(e)}")
        raise self.retry(exc=e, countdown=60)


@shared_task
def check_low_stock_alert(product_id):
    """
    Send low stock alert
    """
    from catalog.models import Product
    from identity.models import User
    from django.core.mail import send_mail
    
    product = Product.objects.get(id=product_id)
    
    # Send notification to seller
    if product.seller.email:
        send_mail(
            f'Low Stock Alert: {product.name}',
            f'Product {product.name} has only {product.stock} units left. Threshold is {product.threshold}',
            'alerts@velqino.com',
            [product.seller.email],
            fail_silently=True,
        )
    
    logger.info(f"Low stock alert sent for {product.name}")


@shared_task
def monitor_daily_stock():
    """
    Daily stock monitoring - called by cron
    """
    from catalog.models import Product
    
    # Get all products with low stock
    low_stock_products = Product.objects.filter(stock__lte=models.F('threshold'))
    
    for product in low_stock_products:
        check_low_stock_alert.delay(product.id)
    
    # Stock analytics
    total_products = Product.objects.count()
    out_of_stock = Product.objects.filter(stock=0).count()
    
    logger.info(f"Stock Monitor: {out_of_stock}/{total_products} products out of stock")
    
    return {
        'total_products': total_products,
        'out_of_stock': out_of_stock,
        'low_stock': low_stock_products.count()
    }