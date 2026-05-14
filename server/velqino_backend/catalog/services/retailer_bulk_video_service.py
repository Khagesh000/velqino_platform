# catalog/services/retailer_bulk_video_service.py

import logging
import uuid
import cloudinary.uploader
import io
from PIL import Image
from datetime import datetime
from django.core.cache import cache
from django.db import transaction
from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logger = logging.getLogger(__name__)


class RetailerBulkVideoService:
    
    @staticmethod
    def extract_frames_from_video(video_data, grid_rows, grid_columns):
        """Extract frames from video and detect grid layout"""
        
        import cv2
        import numpy as np
        
        # Save video temporarily
        temp_path = f"/tmp/video_{uuid.uuid4().hex[:8]}.mp4"
        with open(temp_path, 'wb') as f:
            f.write(video_data)
        
        cap = cv2.VideoCapture(temp_path)
        frames = []
        
        # Get total frames
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Extract frames at regular intervals
        frame_interval = total_frames // 10  # Extract 10 frames
        
        for i in range(10):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i * frame_interval)
            ret, frame = cap.read()
            if ret:
                # Convert frame to bytes
                _, buffer = cv2.imencode('.jpg', frame)
                frames.append(buffer.tobytes())
        
        cap.release()
        
        # Clean up temp file
        import os
        os.remove(temp_path)
        
        return {'front': frames[0] if frames else None}
    
    @staticmethod
    def detect_and_crop_products(frames, grid_rows, grid_columns, product_count):
        """Detect grid and crop individual products from frame"""
        
        import cv2
        import numpy as np
        
        frame_data = frames.get('front')
        if not frame_data:
            return []
        
        # Convert bytes to numpy array
        nparr = np.frombuffer(frame_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        height, width = img.shape[:2]
        
        # Calculate grid cell dimensions
        cell_height = height // grid_rows
        cell_width = width // grid_columns
        
        products_data = []
        
        for idx in range(min(product_count, grid_rows * grid_columns)):
            row = idx // grid_columns
            col = idx % grid_columns
            
            # Crop cell
            y1 = row * cell_height
            y2 = (row + 1) * cell_height
            x1 = col * cell_width
            x2 = (col + 1) * cell_width
            
            cropped = img[y1:y2, x1:x2]
            
            # Encode cropped image
            _, buffer = cv2.imencode('.png', cropped)
            products_data.append({
                'front': buffer.tobytes(),
                'back': None
            })
        
        return products_data
    
    @staticmethod
    def process_final_image(img_data):
        """Process image - remove background, crop, resize"""
        
        try:
            from PIL import Image, ImageOps
            import io
            
            # Open image
            img = Image.open(io.BytesIO(img_data))
            
            # Convert to RGB if needed
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Resize to max 1200x1200
            img.thumbnail((1200, 1200), Image.LANCZOS)
            
            # Create white background square
            size = max(img.size)
            new_img = Image.new('RGB', (size, size), (255, 255, 255))
            
            # Paste centered
            x = (size - img.width) // 2
            y = (size - img.height) // 2
            new_img.paste(img, (x, y))
            
            # Save to bytes
            output = io.BytesIO()
            new_img.save(output, format='PNG', optimize=True)
            return output.getvalue()
            
        except Exception as e:
            logger.error(f"Image processing failed: {e}")
            return img_data
    
    @staticmethod
    @transaction.atomic
    def process_bulk_video_same_details(
        seller_id, video_data, product_count, grid_rows, grid_columns,
        common_name_prefix, common_price, common_cost, category_id,
        brand, description, stock, threshold, sizes, primary_color, pattern,
        task_id=None
    ):
        """Process video and create separate product per detected item"""
        
        from catalog.models import Product, ProductImage, ProductVariant, Category
        
        if not Category.objects.filter(id=category_id).exists():
            raise ValueError(f"Category {category_id} does not exist")
        
        channel_layer = get_channel_layer()
        room_group_name = task_id
        
        def send_progress(progress, message):
            if channel_layer and room_group_name:
                try:
                    async_to_sync(channel_layer.group_send)(
                        room_group_name,
                        {'type': 'send_progress', 'data': {'progress': progress, 'message': message}}
                    )
                except Exception:
                    pass
        
        send_progress(10, "Extracting frames from video...")
        
        # Extract frames
        frames = RetailerBulkVideoService.extract_frames_from_video(video_data, grid_rows, grid_columns)
        
        send_progress(30, "Detecting products in grid...")
        
        # Detect and crop products
        products_data = RetailerBulkVideoService.detect_and_crop_products(
            frames, grid_rows, grid_columns, product_count
        )
        
        send_progress(40, f"Found {len(products_data)} products")
        
        created_products = []
        total_products = len(products_data)
        
        for idx, product_frames in enumerate(products_data):
            progress = 40 + int((idx / total_products) * 55)
            send_progress(progress, f"Creating product {idx+1}/{total_products}")
            
            front_img_data = product_frames.get('front')
            if not front_img_data:
                continue
            
            # Process image
            processed_img = RetailerBulkVideoService.process_final_image(front_img_data)
            
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
            
            # Upload image to Cloudinary
            upload_result = cloudinary.uploader.upload(
                processed_img,
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
            cache.delete(f"product:{product.id}")
        
        # Clear caches
        cache.delete_pattern("retailer:product:list:*")
        cache.delete_pattern("product:list:public:*")
        
        send_progress(100, f"Successfully created {len(created_products)} products")
        
        return {
            'status': 'success',
            'products_created': len(created_products),
            'product_ids': created_products,
            'mode': 'video_same_details'
        }