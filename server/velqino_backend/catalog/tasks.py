from celery import shared_task
from django.core.cache import cache
from django.db import transaction
from django.db import models
from .models import Product
from .utils.product_helpers import ProductHelpers
from commerce.models import StockHistory
import logging
import uuid
import cloudinary.uploader
from io import BytesIO
from datetime import datetime
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
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
                             upload_mode='bulk_single_product', sizes=None, task_id=None):
    """Process bulk images - creates ONE product with all images by default"""
    try:
        from catalog.services.ai_service import AIService

        # ✅ ADD THIS DEBUG LINE
        print(f"\n🔴🔴🔴 TASK - upload_mode value: '{upload_mode}'")
        print(f"🔴🔴🔴 TASK - upload_mode type: {type(upload_mode)}")
        print(f"🔴🔴🔴 TASK - Force to bulk_single_product for testing")
        
        # ✅ FORCE THE MODE HERE (TEMPORARY FIX)
        upload_mode = 'bulk_single_product'  # ← ADD THIS LINE

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
            upload_mode=upload_mode,  # ← This will now be 'bulk_single_product'
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



@shared_task(bind=True)
def retailer_bulk_same_details_task(self, seller_id, images_data, common_name_prefix, 
                                     common_price, common_cost, category_id, brand, 
                                     description, stock, threshold, sizes, 
                                     primary_color, pattern):
    """Celery task for bulk upload with same details for all images"""
    
    from catalog.models import Product, ProductImage, ProductVariant, Category
    
    task_id = self.request.id
    channel_layer = get_channel_layer()
    room_group_name = task_id
    
    def send_progress(progress, message):
        """Send progress update via WebSocket"""
        if channel_layer and room_group_name:
            try:
                async_to_sync(channel_layer.group_send)(
                    room_group_name,
                    {
                        'type': 'send_progress',
                        'data': {'progress': progress, 'message': message}
                    }
                )
            except Exception as e:
                logger.error(f"WebSocket send failed: {e}")
    
    try:
        # Validate category
        if not Category.objects.filter(id=category_id).exists():
            raise ValueError(f"Category {category_id} does not exist")
        
        send_progress(5, "Validating images...")
        
        created_products = []
        total_images = len(images_data)
        
        for idx, img_data in enumerate(images_data):
            # Update progress
            progress = 10 + int((idx / total_images) * 85)
            send_progress(progress, f"Creating product {idx+1}/{total_images}")
            
            # Generate unique SKU
            sku = f"RET-{uuid.uuid4().hex[:8].upper()}"
            
            # Create product name
            product_name = f"{common_name_prefix} {idx + 1}"
            
            # Create product in database
            with transaction.atomic():
                product = Product.objects.create(
                    seller_id=seller_id,
                    seller_type='retailer',
                    retailer_id=seller_id,
                    name=product_name,
                    sku=sku,
                    price=common_price,
                    cost=common_cost,
                    category_id=category_id,
                    brand=brand,
                    description=description,
                    stock=stock,
                    threshold=threshold,
                    pattern=pattern or '',
                    primary_color=primary_color or '',
                    status='active'
                )
                
                # Upload image to Cloudinary
                try:
                    upload_result = cloudinary.uploader.upload(
                        BytesIO(img_data['content']),
                        public_id=f"retailer/products/{datetime.now().strftime('%Y/%m')}/{sku}_image_1",
                        use_filename=True,
                        unique_filename=False,
                        overwrite=True,
                        invalidate=True
                    )
                    
                    # Create product image
                    ProductImage.objects.create(
                        product=product,
                        image=upload_result['secure_url'],
                        is_primary=True,
                        is_front=True,
                        order=0
                    )
                except Exception as e:
                    logger.error(f"Cloudinary upload failed for {sku}: {e}")
                    raise
                
                # Create size variants
                for size in sizes:
                    if size and size.strip():
                        ProductVariant.objects.create(
                            product=product,
                            size=size.strip(),
                            color=primary_color or '',
                            sku=f"{sku}-{size.strip()}",
                            stock=stock,
                            price=common_price
                        )
            
            created_products.append(product.id)
            
            # Clear individual product cache
            cache.delete(f"product:{product.id}")
        
        # Clear all retailer product caches
        cache.delete_pattern("retailer:product:list:*")
        cache.delete_pattern("product:list:public:*")
        
        send_progress(100, f"Successfully created {len(created_products)} products")
        
        return {
            'status': 'success',
            'products_created': len(created_products),
            'product_ids': created_products,
            'mode': 'same_details'
        }
        
    except Exception as e:
        logger.error(f"Bulk upload task failed: {str(e)}")
        send_progress(0, f"Error: {str(e)}")
        raise self.retry(exc=e, countdown=60, max_retries=3)


@shared_task(bind=True)
def retailer_bulk_different_task(self, seller_id, products_data):
    """Celery task for bulk upload with different details for each product"""
    
    from catalog.models import Product, ProductImage, ProductVariant
    
    task_id = self.request.id
    channel_layer = get_channel_layer()
    room_group_name = task_id
    
    def send_progress(progress, message):
        """Send progress update via WebSocket"""
        if channel_layer and room_group_name:
            try:
                async_to_sync(channel_layer.group_send)(
                    room_group_name,
                    {
                        'type': 'send_progress',
                        'data': {'progress': progress, 'message': message}
                    }
                )
            except Exception as e:
                logger.error(f"WebSocket send failed: {e}")
    
    try:
        send_progress(5, "Processing product data...")
        
        created_products = []
        total_products = len(products_data)
        
        for idx, product_data in enumerate(products_data):
            # Update progress
            progress = 10 + int((idx / total_products) * 85)
            send_progress(progress, f"Creating product {idx+1}/{total_products}")
            
            # Generate unique SKU
            sku = f"RET-{uuid.uuid4().hex[:8].upper()}"
            
            # Create product in database
            with transaction.atomic():
                product = Product.objects.create(
                    seller_id=seller_id,
                    seller_type='retailer',
                    retailer_id=seller_id,
                    name=product_data.get('name'),
                    sku=sku,
                    price=product_data.get('price'),
                    cost=product_data.get('cost', 0),
                    category_id=product_data.get('category_id'),
                    brand=product_data.get('brand', ''),
                    description=product_data.get('description', ''),
                    stock=int(product_data.get('stock', 1)),
                    threshold=int(product_data.get('threshold', 10)),
                    pattern=product_data.get('pattern', ''),
                    primary_color=product_data.get('primary_color', ''),
                    status='active'
                )
                
                # Upload image if provided
                if product_data.get('image_content'):
                    try:
                        upload_result = cloudinary.uploader.upload(
                            BytesIO(product_data['image_content']),
                            public_id=f"retailer/products/{datetime.now().strftime('%Y/%m')}/{sku}_image_1",
                            use_filename=True,
                            unique_filename=False,
                            overwrite=True,
                            invalidate=True
                        )
                        
                        ProductImage.objects.create(
                            product=product,
                            image=upload_result['secure_url'],
                            is_primary=True,
                            is_front=True,
                            order=0
                        )
                    except Exception as e:
                        logger.error(f"Cloudinary upload failed for {sku}: {e}")
                        raise
                
                # Create size variants
                sizes = product_data.get('sizes', [])
                for size in sizes:
                    if size and size.strip():
                        ProductVariant.objects.create(
                            product=product,
                            size=size.strip(),
                            color=product_data.get('primary_color', ''),
                            sku=f"{sku}-{size.strip()}",
                            stock=product.get('stock', 1),
                            price=product.get('price', 0)
                        )
            
            created_products.append(product.id)
            cache.delete(f"product:{product.id}")
        
        # Clear all retailer product caches
        cache.delete_pattern("retailer:product:list:*")
        cache.delete_pattern("product:list:public:*")
        
        send_progress(100, f"Successfully created {len(created_products)} products")
        
        return {
            'status': 'success',
            'products_created': len(created_products),
            'product_ids': created_products,
            'mode': 'different_details'
        }
        
    except Exception as e:
        logger.error(f"Bulk upload task failed: {str(e)}")
        send_progress(0, f"Error: {str(e)}")
        raise self.retry(exc=e, countdown=60, max_retries=3)


@shared_task
def clear_product_cache_task(product_id=None):
    """Clear product cache - can be called after updates"""
    
    if product_id:
        cache.delete(f"product:{product_id}")
        cache.delete_pattern(f"product:list:*:{product_id}:*")
    else:
        cache.delete_pattern("product:list:*")
        cache.delete_pattern("retailer:product:list:*")
    
    logger.info(f"Cache cleared for product {product_id if product_id else 'ALL'}")
    return {'status': 'success', 'message': 'Cache cleared'}


@shared_task
def update_product_stock_task(product_id, new_stock):
    """Update product stock asynchronously"""
    
    from catalog.models import Product
    
    try:
        product = Product.objects.get(id=product_id)
        product.stock = new_stock
        product.save(update_fields=['stock', 'updated_at'])
        
        # Clear cache
        cache.delete(f"product:{product_id}")
        
        logger.info(f"Stock updated for product {product_id}: {new_stock}")
        return {'status': 'success', 'message': 'Stock updated'}
    except Product.DoesNotExist:
        logger.error(f"Product {product_id} not found")
        return {'status': 'error', 'message': 'Product not found'}
    


# Add to catalog/tasks.py

@shared_task(bind=True)
def retailer_bulk_video_same_task(self, seller_id, video_data, product_count, grid_rows, grid_columns,
                                   common_name_prefix, common_price, common_cost, category_id,
                                   brand, description, stock, threshold, sizes, primary_color, pattern):
    """Celery task for bulk video upload with same details"""
    
    from catalog.services.retailer_bulk_video_service import RetailerBulkVideoService
    
    task_id = self.request.id
    
    try:
        result = RetailerBulkVideoService.process_bulk_video_same_details(
            seller_id=seller_id,
            video_data=video_data,
            product_count=product_count,
            grid_rows=grid_rows,
            grid_columns=grid_columns,
            common_name_prefix=common_name_prefix,
            common_price=common_price,
            common_cost=common_cost,
            category_id=category_id,
            brand=brand,
            description=description,
            stock=stock,
            threshold=threshold,
            sizes=sizes,
            primary_color=primary_color,
            pattern=pattern,
            task_id=task_id
        )
        return result
    except Exception as e:
        logger.error(f"Bulk video task failed: {str(e)}")
        raise self.retry(exc=e, countdown=60, max_retries=3)