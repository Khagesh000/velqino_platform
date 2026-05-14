# catalog/services/retailer_bulk_service.py

import logging
import uuid
import cloudinary.uploader
from io import BytesIO
from datetime import datetime
from django.core.cache import cache
from django.db import transaction
from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logger = logging.getLogger(__name__)

class RetailerBulkService:
    
    @staticmethod
    @transaction.atomic
    def process_bulk_same_details(
        seller_id, images, common_name_prefix, common_price, common_cost,
        category_id, brand, description, stock, threshold, sizes, 
        primary_color, pattern, task_id=None
    ):
        """Option 1: Same details for all images - creates separate product per image"""
        
        from catalog.models import Product, ProductImage, ProductVariant, Category
        
        # Validate category
        if not Category.objects.filter(id=category_id).exists():
            raise ValueError(f"Category {category_id} does not exist")
        
        created_products = []
        total_images = len(images)
        
        # Send progress via WebSocket
        channel_layer = get_channel_layer()
        room_group_name = task_id
        
        def send_progress(progress, message):
            if channel_layer and room_group_name:
                async_to_sync(channel_layer.group_send)(
                    room_group_name,
                    {
                        'type': 'send_progress',
                        'data': {'progress': progress, 'message': message}
                    }
                )
        
        for idx, img in enumerate(images):
            # ✅ DEBUG: Print what type and content of img is
            print(f"🔍 DEBUG: img type = {type(img)}")
            print(f"🔍 DEBUG: img content = {img}")
            if isinstance(img, dict):
                print(f"🔍 DEBUG: img keys = {img.keys()}")
                print(f"🔍 DEBUG: img['content'] type = {type(img.get('content'))}")
            
            # Calculate progress (10% to 90%)
            progress = 10 + int((idx / total_images) * 80)
            send_progress(progress, f"Creating product {idx+1}/{total_images}")
            
            # Generate SKU
            sku = f"RET-{uuid.uuid4().hex[:8].upper()}"
            
            # Create product name
            product_name = f"{common_name_prefix} {idx + 1}"
            
            # Create product
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
            
            # ✅ Get image data correctly
            if isinstance(img, dict):
                image_data = img.get('content')
            elif hasattr(img, 'read'):
                image_data = img.read()
            else:
                image_data = img
            
            print(f"🔍 DEBUG: image_data type = {type(image_data)}")
            print(f"🔍 DEBUG: image_data length = {len(image_data) if image_data else 0}")
            
            # Upload image to Cloudinary
            upload_result = cloudinary.uploader.upload(
                image_data,  # ✅ Now using extracted image_data
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
            
            # Clear cache for this product
            cache.delete(f"product:{product.id}")
        
        # Clear all retailer product caches
        cache.delete_pattern("retailer:product:list:*")
        
        send_progress(100, f"Successfully created {len(created_products)} products")
        
        return {
            'products_created': len(created_products),
            'product_ids': created_products,
            'mode': 'same_details'
        }
    
    @staticmethod
    def process_bulk_different_details(
        seller_id, products_data, task_id=None
    ):
        """Option 2: Different details for each product"""
        
        from catalog.models import Product, ProductImage, ProductVariant
        
        created_products = []
        total_products = len(products_data)
        
        channel_layer = get_channel_layer()
        room_group_name = task_id
        
        def send_progress(progress, message):
            if channel_layer and room_group_name:
                async_to_sync(channel_layer.group_send)(
                    room_group_name,
                    {
                        'type': 'send_progress',
                        'data': {'progress': progress, 'message': message}
                    }
                )
        
        for idx, product_data in enumerate(products_data):
            progress = 10 + int((idx / total_products) * 80)
            send_progress(progress, f"Creating product {idx+1}/{total_products}")
            
            # Generate SKU
            sku = f"RET-{uuid.uuid4().hex[:8].upper()}"
            
            # Create product
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
            
            # Upload image
            if product_data.get('image'):
                upload_result = cloudinary.uploader.upload(
                    product_data['image'],
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
        
        cache.delete_pattern("retailer:product:list:*")
        
        send_progress(100, f"Successfully created {len(created_products)} products")
        
        return {
            'products_created': len(created_products),
            'product_ids': created_products,
            'mode': 'different_details'
        }


@shared_task(bind=True)
def retailer_bulk_same_details_task(self, seller_id, images_data, common_name_prefix, 
                                     common_price, common_cost, category_id, brand, 
                                     description, stock, threshold, sizes, 
                                     primary_color, pattern):
    """Celery task for bulk upload with same details"""
    
    from catalog.services.retailer_bulk_service import RetailerBulkService
    
    task_id = self.request.id
    
    try:
        result = RetailerBulkService.process_bulk_same_details(
            seller_id=seller_id,
            images=images_data,
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
        logger.error(f"Bulk upload failed: {str(e)}")
        raise


@shared_task(bind=True)
def retailer_bulk_different_task(self, seller_id, products_data):
    """Celery task for bulk upload with different details"""
    
    from catalog.services.retailer_bulk_service import RetailerBulkService
    
    task_id = self.request.id
    
    try:
        result = RetailerBulkService.process_bulk_different_details(
            seller_id=seller_id,
            products_data=products_data,
            task_id=task_id
        )
        return result
    except Exception as e:
        logger.error(f"Bulk upload failed: {str(e)}")
        raise