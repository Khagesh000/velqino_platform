import uuid
import io
import os
import hashlib
import base64
import requests
import tempfile
import logging
import cv2
import numpy as np
import importlib
try:
    torch = importlib.import_module('torch')
    TORCH_AVAILABLE = True
except (ImportError, ModuleNotFoundError):
    torch = None
    TORCH_AVAILABLE = False

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
from django.core.files.base import ContentFile
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from django.db import connection, close_old_connections
from django.db.utils import OperationalError
from django.contrib.auth import get_user_model
from catalog.models import Product, ProductVariant, ProductImage, Category

try:
    realesrgan = importlib.import_module('realesrgan')
    RealESRGANer = getattr(realesrgan, 'RealESRGANer', None)
    REALESRGAN_AVAILABLE = bool(RealESRGANer)
except (ImportError, ModuleNotFoundError):
    RealESRGANer = None
    REALESRGAN_AVAILABLE = False

import cloudinary.uploader
from io import BytesIO
from datetime import datetime

logger = logging.getLogger(__name__)


class AIService:
    _sr_model = None

    @staticmethod
    def _safe_db_call(fn, max_retries=3):
        """
        Executes database write/read operations safely.
        Proactively purges dead or timed-out sockets, reconnects if dropped by
        Clever Cloud MySQL, and guards against max_user_connections saturation.
        """
        last_err = None
        for attempt in range(max_retries):
            try:
                close_old_connections()
                return fn()
            except OperationalError as oe:
                last_err = oe
                logger.warning(f"[DB RETRY] PyMySQL OperationalError (attempt {attempt+1}/{max_retries}): {oe}")
                if attempt < max_retries - 1:
                    import time
                    time.sleep(0.4 * (attempt + 1))
                    close_old_connections()
            except Exception as e:
                last_err = e
                close_old_connections()
                if attempt == 0:
                    import time
                    time.sleep(0.3)
                else:
                    raise e
        if last_err:
            raise last_err
    

    # =========================
    # [START] MAIN ENTRY FOR VIDEO PROCESSING
    # =========================
    @staticmethod
    def process_bulk_video(seller_id, video_data, product_count, common_price, common_cost, 
                        category_id, name_prefix, brand, description, grid_rows, grid_columns, 
                        upload_mode='bulk_single_product', sizes=None, garment_type='top', task_id=None):
        """
        Process one video containing multiple products in grid layout
        - bulk_single_product: ONE product with ALL detected items
        - front_back: Separate product per detected item
        """
        print(f"\n[START] Processing video with {product_count} products in {grid_rows}x{grid_columns} grid")
        print(f"[PIN] Upload mode: {upload_mode}")
        
        from ..models import Category
        cat_exists = AIService._safe_db_call(lambda: Category.objects.filter(id=category_id).exists())
        if not cat_exists:
            raise ValueError(f"category_id {category_id} does not exist. Cannot create products.")
        
        channel_layer = get_channel_layer()
        room_group_name = task_id
        
        # Send progress
        AIService._send_progress(channel_layer, room_group_name, 10, "Extracting frames from video...")
        
        created_products = []
        try:
            # Step 1: Extract frames from video
            frames = AIService._extract_frames_from_video(video_data, grid_rows, grid_columns)
            
            if not frames.get('front'):
                print("[FAIL] No frames extracted from video")
                return None
            
            AIService._send_progress(channel_layer, room_group_name, 30, f"Extracted {len(frames)} frames")
            
            # Step 2: Detect grid and crop individual products
            products_data = AIService._detect_and_crop_products(frames, grid_rows, grid_columns, product_count)
            
            AIService._send_progress(channel_layer, room_group_name, 35, "Extracted front and back frames")
            
            # [OK] BULK SINGLE PRODUCT MODE - ONE PRODUCT WITH ALL ITEMS
            if upload_mode == 'bulk_single_product':
                AIService._send_progress(channel_layer, room_group_name, 50, "Creating one bulk product with all items...")
                
                # Generate product name
                product_name = f"{name_prefix} (Bulk Pack)"
                
                # Detect pattern and colors from first item
                first_item = products_data[0] if products_data else {}
                front_img_data = first_item.get('front')
                if front_img_data:
                    from intelligence.services.garment_isolator import isolate_garment_clutter_free
                    first_rgba = isolate_garment_clutter_free(front_img_data)
                    pattern = AIService._detect_pattern(first_rgba)
                    colors = AIService._detect_colors(first_rgba)
                    primary_color = colors[0]['name'] if colors else ''
                else:
                    pattern = ''
                    primary_color = ''
                
                def _create_v_bulk_prod():
                    u_obj = get_user_model().objects.filter(id=seller_id).first()
                    s_type = getattr(u_obj, 'role', 'wholesaler') if u_obj else 'wholesaler'
                    w_val = u_obj if s_type == 'wholesaler' else None
                    r_val = u_obj if s_type == 'retailer' else None
                    return Product.objects.create(
                        seller_id=seller_id,
                        seller_type=s_type,
                        wholesaler=w_val,
                        retailer=r_val,
                        name=product_name,
                        price=common_price,
                        cost=common_cost,
                        category_id=category_id,
                        brand=brand,
                        description=description,
                        pattern=pattern,
                        primary_color=primary_color,
                        stock=len(products_data),
                        min_order_qty=len(products_data),
                        status='active',
                        garment_type=garment_type or 'top'
                    )
                product = AIService._safe_db_call(_create_v_bulk_prod)
                
                for idx, product_frames in enumerate(products_data[:product_count]):
                    front_img_data = product_frames.get('front')
                    back_img_data = product_frames.get('back')
                    
                    if not front_img_data:
                        continue
                    
                    front_cleaned = AIService._process_final_image(front_img_data)
                    back_cleaned = AIService._process_final_image(back_img_data) if back_img_data else None
                    
                    if front_cleaned:
                        front_bytes = BytesIO(front_cleaned)
                        front_result = cloudinary.uploader.upload(
                            front_bytes,
                            public_id=f"products/{datetime.now().strftime('%Y/%m')}/{product.sku}_item_{idx+1}_front",
                            overwrite=True,
                            invalidate=True
                        )
                        def _save_v_front(u_url=front_result['secure_url'], i_idx=idx):
                            ProductImage.objects.create(
                                product=product,
                                image=u_url,
                                is_primary=(i_idx == 0),
                                is_front=True,
                                order=i_idx * 2
                            )
                        AIService._safe_db_call(_save_v_front)
                    
                    if back_cleaned:
                        back_bytes = BytesIO(back_cleaned)
                        back_result = cloudinary.uploader.upload(
                            back_bytes,
                            public_id=f"products/{datetime.now().strftime('%Y/%m')}/{product.sku}_item_{idx+1}_back",
                            use_filename=True,
                            unique_filename=False,
                            overwrite=True,
                            invalidate=True
                        )
                        def _save_v_back(u_url=back_result['secure_url'], i_idx=idx):
                            ProductImage.objects.create(
                                product=product,
                                image=u_url,
                                is_primary=False,
                                is_front=False,
                                order=i_idx * 2 + 1
                            )
                        AIService._safe_db_call(_save_v_back)
                    
                    progress = 50 + int((idx / product_count) * 40)
                    AIService._send_progress(channel_layer, room_group_name, progress, f"Processing item {idx+1}/{product_count}")
                
                created_products.append(product.id)
                
                if sizes:
                    def _save_v_bulk_sizes():
                        for size in sizes:
                            ProductVariant.objects.create(
                                product=product,
                                size=size,
                                color=primary_color or '',
                                sku=f"{product.sku}-{size}",
                                stock=0,
                                price=common_price
                            )
                    AIService._safe_db_call(_save_v_bulk_sizes)
            
            # [OK] FRONT_BACK MODE - Separate product per detected item
            else:
                for idx, product_frames in enumerate(products_data[:product_count]):
                    progress = 40 + int((idx / product_count) * 50)
                    AIService._send_progress(
                        channel_layer, room_group_name, progress, 
                        f"Processing product {idx+1}/{product_count}"
                    )
                    
                    front_img_data = product_frames.get('front')
                    back_img_data = product_frames.get('back')
                    
                    if not front_img_data:
                        continue
                    
                    from intelligence.services.garment_isolator import isolate_garment_clutter_free
                    front_rgba = isolate_garment_clutter_free(front_img_data)
                    back_rgba = isolate_garment_clutter_free(back_img_data) if back_img_data else None

                    front_cleaned = AIService._process_final_image(front_rgba, view='front', garment_type=garment_type, seller_id=seller_id)
                    back_cleaned = AIService._process_final_image(back_rgba, view='back', garment_type=garment_type, seller_id=seller_id) if back_rgba else None

                    pattern = AIService._detect_pattern(front_rgba)
                    colors = AIService._detect_colors(front_rgba)
                    primary_color = colors[0]['name'] if colors else ''
                    
                    product_name = f"{name_prefix} {idx+1}"
                    if pattern and pattern != 'solid':
                        product_name = f"{pattern.capitalize()} {primary_color} {name_prefix}"
                    elif primary_color:
                        product_name = f"{primary_color} {name_prefix}"
                    
                    def _create_v_fb_prod():
                        u_obj = get_user_model().objects.filter(id=seller_id).first()
                        s_type = getattr(u_obj, 'role', 'wholesaler') if u_obj else 'wholesaler'
                        w_val = u_obj if s_type == 'wholesaler' else None
                        r_val = u_obj if s_type == 'retailer' else None
                        return Product.objects.create(
                            seller_id=seller_id,
                            seller_type=s_type,
                            wholesaler=w_val,
                            retailer=r_val,
                            name=product_name,
                            price=common_price,
                            cost=common_cost,
                            category_id=category_id,
                            brand=brand,
                            description=description,
                            pattern=pattern,
                            primary_color=primary_color,
                            status='active',
                            garment_type=garment_type or 'top'
                        )
                    product = AIService._safe_db_call(_create_v_fb_prod)
                    
                    if front_cleaned:
                        front_bytes = BytesIO(front_cleaned)
                        front_result = cloudinary.uploader.upload(
                            front_bytes,
                            public_id=f"products/{datetime.now().strftime('%Y/%m')}/{product.sku}_front",
                            overwrite=True,
                            invalidate=True
                        )
                        def _save_v_fb_front():
                            ProductImage.objects.create(
                                product=product,
                                image=front_result['secure_url'],
                                is_primary=True,
                                is_front=True,
                                order=0
                            )
                        AIService._safe_db_call(_save_v_fb_front)
                    
                    if back_cleaned:
                        back_bytes = BytesIO(back_cleaned)
                        back_result = cloudinary.uploader.upload(
                            back_bytes,
                            public_id=f"products/{datetime.now().strftime('%Y/%m')}/{product.sku}_back",
                            overwrite=True,
                            invalidate=True
                        )
                        def _save_v_fb_back():
                            ProductImage.objects.create(
                                product=product,
                                image=back_result['secure_url'],
                                is_primary=False,
                                is_front=False,
                                order=1
                            )
                        AIService._safe_db_call(_save_v_fb_back)
                    
                    created_products.append(product.id)
                    
                    if sizes:
                        def _save_v_fb_sizes():
                            for size in sizes:
                                ProductVariant.objects.create(
                                    product=product,
                                    size=size,
                                    color=primary_color or '',
                                    sku=f"{product.sku}-{size}",
                                    stock=0,
                                    price=common_price
                                )
                        AIService._safe_db_call(_save_v_fb_sizes)
            
            AIService._send_progress(channel_layer, room_group_name, 100, "Completed!")
            
            return {
                'products_created': len(created_products),
                'product_ids': created_products,
                'mode': upload_mode
            }
        finally:
            close_old_connections()
    
    # =========================
    # [START] MAIN ENTRY FOR BULK IMAGES PROCESSING
    # =========================
    @staticmethod
    def process_bulk_images(seller_id, images_data, common_price, common_cost,
                            category_id, name_prefix, brand, description,
                            upload_mode='bulk_single_product', sizes=None, task_id=None,
                            ai_fit_enabled=True, fit_silhouette='regular', demographic=None,
                            garment_type='top'):
        """
        Process multiple images — supports:
        - bulk_single_product: ONE product with ALL images
        - front_back: Create products with front+back pairs and fit on AI human model
        - front_only: Create separate product per image
        """
        print(f"\n[START] Processing {len(images_data)} images (mode: {upload_mode}, ai_fit: {ai_fit_enabled}, fit: {fit_silhouette})")


        from ..models import Category
        cat_exists = AIService._safe_db_call(lambda: Category.objects.filter(id=category_id).exists())
        if not cat_exists:
            raise ValueError(f"category_id {category_id} does not exist. Cannot create products.")

        channel_layer = get_channel_layer()
        room_group_name = task_id

        AIService._send_progress(channel_layer, room_group_name, 10, "Initializing AI vision pipeline...")

        created_products = []

        try:
            # [OK] BULK SINGLE PRODUCT MODE - ONE PRODUCT WITH ALL IMAGES
            if upload_mode == 'bulk_single_product':
                AIService._send_progress(channel_layer, room_group_name, 20, "Creating bulk pack product...")
                
                first_img_data = images_data[0]
                from intelligence.services.garment_isolator import isolate_garment_clutter_free
                first_rgba = isolate_garment_clutter_free(first_img_data)
                pattern = AIService._detect_pattern(first_rgba)
                colors = AIService._detect_colors(first_rgba)
                primary_color = colors[0]['name'] if colors else ''
                
                product_name = f"{name_prefix} (Bulk Pack)"
                if pattern and pattern != 'solid':
                    product_name = f"{pattern.capitalize()} {primary_color} {name_prefix} (Bulk)"
                elif primary_color:
                    product_name = f"{primary_color} {name_prefix} (Bulk)"
                
                def _create_bulk_prod():
                    u_obj = get_user_model().objects.filter(id=seller_id).first()
                    s_type = getattr(u_obj, 'role', 'wholesaler') if u_obj else 'wholesaler'
                    w_val = u_obj if s_type == 'wholesaler' else None
                    r_val = u_obj if s_type == 'retailer' else None
                    return Product.objects.create(
                        seller_id=seller_id,
                        seller_type=s_type,
                        wholesaler=w_val,
                        retailer=r_val,
                        name=product_name,
                        price=common_price,
                        cost=common_cost,
                        category_id=category_id,
                        brand=brand,
                        description=description,
                        pattern=pattern,
                        primary_color=primary_color,
                        stock=len(images_data),
                        min_order_qty=len(images_data),
                        status='active',
                        garment_type=garment_type or 'top'
                    )
                product = AIService._safe_db_call(_create_bulk_prod)
                
                for idx, img_data in enumerate(images_data):
                    progress = 20 + int((idx / len(images_data)) * 70)
                    AIService._send_progress(channel_layer, room_group_name, progress, f"Saving image {idx+1}/{len(images_data)}")
                    
                    cleaned_img = AIService._process_final_image(img_data)
                    if cleaned_img:
                        img_bytes = BytesIO(cleaned_img)
                        upload_result = cloudinary.uploader.upload(
                            img_bytes,
                            public_id=f"products/{datetime.now().strftime('%Y/%m')}/{product.sku}_image_{idx+1}",
                            use_filename=True,
                            unique_filename=False,
                            overwrite=True,
                            invalidate=False
                        )
                        def _save_bulk_img(u_url=upload_result['secure_url'], i_idx=idx):
                            ProductImage.objects.create(
                                product=product,
                                image=u_url,
                                is_primary=(i_idx == 0),
                                is_front=True,
                                order=i_idx
                            )
                        AIService._safe_db_call(_save_bulk_img)
                
                created_products.append(product.id)
                
                if sizes:
                    def _save_bulk_variants():
                        for size in sizes:
                            ProductVariant.objects.create(
                                product=product,
                                size=size,
                                color=primary_color or '',
                                sku=f"{product.sku}-{size}",
                                stock=0,
                                price=common_price
                            )
                    AIService._safe_db_call(_save_bulk_variants)
            
            # [OK] FRONT_BACK MODE - Separate product per front+back pair
            elif upload_mode == 'front_back':
                products_to_create = len(images_data) // 2
                print(f"[BOX] Front+Back mode: Creating {products_to_create} products")
                
                for idx in range(products_to_create):
                    front_img_data = images_data[idx * 2]
                    back_img_data = images_data[idx * 2 + 1] if (idx * 2 + 1) < len(images_data) else None

                    base_pct = 10 + int((idx / products_to_create) * 85)

                    # 1. Clean and isolate images
                    AIService._send_progress(
                        channel_layer, room_group_name, base_pct + 4,
                        f"Product {idx+1}/{products_to_create}: Semantic garment isolation & cleaning..."
                    )
                    from intelligence.services.garment_isolator import isolate_garment_clutter_free
                    front_rgba = isolate_garment_clutter_free(front_img_data)
                    back_rgba = isolate_garment_clutter_free(back_img_data) if back_img_data else None

                    front_cleaned = AIService._process_final_image(front_rgba, view='front', garment_type=garment_type, seller_id=seller_id)
                    back_cleaned = AIService._process_final_image(back_rgba, view='back', garment_type=garment_type, seller_id=seller_id) if back_rgba else None

                    # 2. Fabric analysis
                    AIService._send_progress(
                        channel_layer, room_group_name, base_pct + 12,
                        f"Product {idx+1}/{products_to_create}: Detecting fabric color & pattern..."
                    )
                    pattern = AIService._detect_pattern(front_rgba)
                    colors = AIService._detect_colors(front_rgba)
                    primary_color = colors[0]['name'] if colors else ''

                    product_name = f"{name_prefix} {idx+1}"
                    if pattern and pattern != 'solid':
                        product_name = f"{pattern.capitalize()} {primary_color} {name_prefix}"
                    elif primary_color:
                        product_name = f"{primary_color} {name_prefix}"

                    # 3. Create Product with resilient DB retry
                    AIService._send_progress(
                        channel_layer, room_group_name, base_pct + 20,
                        f"Product {idx+1}/{products_to_create}: Registering catalog product..."
                    )

                    def _create_fb_product():
                        u_obj = get_user_model().objects.filter(id=seller_id).first()
                        s_type = getattr(u_obj, 'role', 'wholesaler') if u_obj else 'wholesaler'
                        w_val = u_obj if s_type == 'wholesaler' else None
                        r_val = u_obj if s_type == 'retailer' else None
                        return Product.objects.create(
                            seller_id=seller_id,
                            seller_type=s_type,
                            wholesaler=w_val,
                            retailer=r_val,
                            name=product_name,
                            price=common_price,
                            cost=common_cost,
                            category_id=category_id,
                            brand=brand,
                            description=description,
                            pattern=pattern,
                            primary_color=primary_color,
                            status='active',
                            garment_type=garment_type or 'top'
                        )

                    product = AIService._safe_db_call(_create_fb_product)

                    # 4. Save Clean Studio Catalog Images (Pure white background with soft shadow)
                    AIService._send_progress(
                        channel_layer, room_group_name, min(base_pct + 40, 95),
                        f"Product {idx+1}/{products_to_create}: Generating clean studio catalog images..."
                    )

                    prod_media_dir = os.path.join(settings.BASE_DIR, 'media', 'products', datetime.now().strftime('%Y/%m'))
                    os.makedirs(prod_media_dir, exist_ok=True)

                    upload_tasks = []

                    if front_cleaned:
                        front_filename = f"{product.sku}_item_{idx+1}_front.jpg"
                        full_front_path = os.path.join(prod_media_dir, front_filename)
                        with open(full_front_path, 'wb') as f:
                            f.write(front_cleaned)
                        rel_front = f"/media/products/{datetime.now().strftime('%Y/%m')}/{front_filename}"

                        upload_tasks.append({
                            'file_path': full_front_path,
                            'public_id': f"products/{datetime.now().strftime('%Y/%m')}/{product.sku}_item_{idx+1}_front",
                            'fallback_url': rel_front,
                            'is_primary': True,
                            'is_front': True,
                            'order': 0
                        })

                    if back_cleaned:
                        back_filename = f"{product.sku}_item_{idx+1}_back.jpg"
                        full_back_path = os.path.join(prod_media_dir, back_filename)
                        with open(full_back_path, 'wb') as f:
                            f.write(back_cleaned)
                        rel_back = f"/media/products/{datetime.now().strftime('%Y/%m')}/{back_filename}"

                        upload_tasks.append({
                            'file_path': full_back_path,
                            'public_id': f"products/{datetime.now().strftime('%Y/%m')}/{product.sku}_item_{idx+1}_back",
                            'fallback_url': rel_back,
                            'is_primary': False,
                            'is_front': False,
                            'order': 1
                        })

                    def _do_upload(task_item):
                        f_path = task_item.get('file_path')
                        if f_path and os.path.exists(f_path):
                            try:
                                with open(f_path, 'rb') as rf:
                                    res = cloudinary.uploader.upload(
                                        rf,
                                        public_id=task_item['public_id'],
                                        overwrite=True,
                                        invalidate=False,
                                        timeout=12
                                    )
                                    sec_url = res.get('secure_url')
                                    if sec_url:
                                        return task_item, sec_url
                            except Exception as ce:
                                logger.warning(f"Cloudinary upload fallback for {task_item.get('public_id')}: {ce}")
                        return task_item, task_item.get('fallback_url')

                    # Upload sequentially to maintain a single HTTP keep-alive connection without exhausting pool
                    upload_results = []
                    for task_item in upload_tasks:
                        upload_results.append(_do_upload(task_item))

                    def _save_fb_imgs():
                        for task_item, uploaded_url in upload_results:
                            final_url = uploaded_url or task_item.get('fallback_url')
                            if final_url:
                                ProductImage.objects.create(
                                    product=product,
                                    image=final_url,
                                    is_primary=task_item['is_primary'],
                                    is_front=task_item['is_front'],
                                    order=task_item['order']
                                )
                    AIService._safe_db_call(_save_fb_imgs)

                    created_products.append(product.id)
                    
                    if sizes:
                        def _save_fb_sizes():
                            for size in sizes:
                                ProductVariant.objects.create(
                                    product=product,
                                    size=size,
                                    color=primary_color or '',
                                    sku=f"{product.sku}-{size}",
                                    stock=0,
                                    price=common_price
                                )
                        AIService._safe_db_call(_save_fb_sizes)

            # [OK] FRONT_ONLY MODE - Separate product per image
            else:
                products_to_create = len(images_data)
                print(f"[BOX] Front Only mode: Creating {products_to_create} products")
                
                for idx, img_data in enumerate(images_data):
                    progress = 10 + int((idx / products_to_create) * 80)
                    AIService._send_progress(
                        channel_layer, room_group_name, progress,
                        f"Processing product {idx+1}/{products_to_create}"
                    )

                    from intelligence.services.garment_isolator import isolate_garment_clutter_free
                    img_rgba = isolate_garment_clutter_free(img_data)
                    cleaned_img = AIService._process_final_image(img_rgba)

                    pattern = AIService._detect_pattern(img_rgba)
                    colors = AIService._detect_colors(img_rgba)
                    primary_color = colors[0]['name'] if colors else ''

                    product_name = f"{name_prefix} {idx+1}"
                    if pattern and pattern != 'solid':
                        product_name = f"{pattern.capitalize()} {primary_color} {name_prefix}"
                    elif primary_color:
                        product_name = f"{primary_color} {name_prefix}"

                    def _create_fo_product():
                        u_obj = get_user_model().objects.filter(id=seller_id).first()
                        s_type = getattr(u_obj, 'role', 'wholesaler') if u_obj else 'wholesaler'
                        w_val = u_obj if s_type == 'wholesaler' else None
                        r_val = u_obj if s_type == 'retailer' else None
                        return Product.objects.create(
                            seller_id=seller_id,
                            seller_type=s_type,
                            wholesaler=w_val,
                            retailer=r_val,
                            name=product_name,
                            price=common_price,
                            cost=common_cost,
                            category_id=category_id,
                            brand=brand,
                            description=description,
                            pattern=pattern,
                            primary_color=primary_color,
                            status='active',
                            garment_type=garment_type or 'top'
                        )
                    product = AIService._safe_db_call(_create_fo_product)

                    if cleaned_img:
                        img_bytes = BytesIO(cleaned_img)
                        upload_result = cloudinary.uploader.upload(
                            img_bytes,
                            public_id=f"products/{datetime.now().strftime('%Y/%m')}/{product.sku}_image",
                            use_filename=True,
                            unique_filename=False,
                            overwrite=True,
                            invalidate=False
                        )
                        def _save_fo_img():
                            ProductImage.objects.create(
                                product=product,
                                image=upload_result['secure_url'],
                                is_primary=True,
                                is_front=True,
                                order=0
                            )
                        AIService._safe_db_call(_save_fo_img)

                    created_products.append(product.id)
                    
                    if sizes:
                        def _save_fo_sizes():
                            for size in sizes:
                                ProductVariant.objects.create(
                                    product=product,
                                    size=size,
                                    color=primary_color or '',
                                    sku=f"{product.sku}-{size}",
                                    stock=0,
                                    price=common_price
                                )
                        AIService._safe_db_call(_save_fo_sizes)

            AIService._send_progress(channel_layer, room_group_name, 100, "Completed!")

        finally:
            close_old_connections()

        return {
            'products_created': len(created_products),
            'product_ids': created_products,
            'mode': upload_mode,
            'total_images': len(images_data)
        }

    @staticmethod
    def _smooth_wrinkles(image):
        return image
    

    @staticmethod
    def _load_sr_model():
        if not REALESRGAN_AVAILABLE:
            print("[WARN] RealESRGAN not available")
            return None
        if not hasattr(AIService, "_sr_model") or AIService._sr_model is None:
            device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            model = RealESRGANer(
                scale=2,
                model_path='weights/RealESRGAN_x2.pth',
                device=device
            )
            AIService._sr_model = model
        return AIService._sr_model
    

    @staticmethod
    def _enhance_ai_hd(image):
        # SR removed — RealESRGAN weights not available
        try:
            if isinstance(image, bytes):
                return Image.open(io.BytesIO(image)).convert("RGB")
            return image.convert("RGB")
        except Exception as e:
            print(f"[FAIL] HD conversion failed: {e}")
            return image
    
    # =========================
    # [TOOL] HELPER METHODS
    # =========================
    
    @staticmethod
    def _send_progress(channel_layer, room_group_name, progress, message):
        print(f"[ALERT] _send_progress called: {progress}% - {room_group_name}")
        
        if not room_group_name or not channel_layer:
            print("[WARN] Skipping — no room_group_name or channel_layer")
            return

        try:
            from asgiref.sync import async_to_sync

            group_name = f'ai_task_{room_group_name}'
            print(f"[OUTBOX] Sending to group: {group_name}")

            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    'type': 'send_progress',
                    'data': {
                        'progress': progress,
                        'message': message
                    }
                }
            )
            print(f"[SIGNAL] Progress sent to {group_name}: {progress}% - {message}")

        except Exception as e:
            print(f"[FAIL] Progress send failed: {e}")


    @staticmethod
    def _auto_rotate(image):
        # Disabled — HoughLines detects shirt graphics/logos not shirt orientation
        # causing incorrect 44° rotations. Return image as-is.
        return image


    @staticmethod
    def _add_shadow(image):
        try:
            shadow = Image.new('RGBA', image.size, (0,0,0,0))

            # Create shadow layer
            alpha = image.split()[-1] if image.mode == 'RGBA' else None
            if alpha:
                shadow_layer = Image.new('RGBA', image.size, (0,0,0,120))
                shadow.paste(shadow_layer, (10, 10), alpha)

            combined = Image.alpha_composite(shadow, image.convert('RGBA'))
            return combined
        except:
            return image
    
    
    @staticmethod
    def _extract_frames_from_video(video_data, grid_rows, grid_columns):
        """
        Extract best front and back frames from video.
        
        Video structure:
        - First half: all products FRONT view in grid
        - Second half: same products BACK view in grid
        - Auto-detects transition point between front and back
        """
        import tempfile, os
        import cv2
        import numpy as np
        from PIL import Image

        frames = {'front': None, 'back': None}

        # Save video to temp file
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as tmp:
            tmp.write(video_data)
            tmp_path = tmp.name

        try:
            cap = cv2.VideoCapture(tmp_path)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

            if total_frames == 0:
                print("[FAIL] No frames found in video")
                return frames

            # -- Step 1: Find transition point (front -> back) ------------------
            # Compare each frame to first frame — big diff = transition happened
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, ref = cap.read()
            if not ret:
                return frames
            ref_gray = cv2.cvtColor(ref, cv2.COLOR_BGR2GRAY).astype(float)

            diffs = []
            sample_step = max(1, total_frames // 40)

            for i in range(0, total_frames, sample_step):
                cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                ret, frame = cap.read()
                if ret:
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY).astype(float)
                    diff = float(np.mean(np.abs(gray - ref_gray)))
                    diffs.append((i, diff))

            # Find where diff jumps significantly (front->back transition)
            transition_frame = total_frames // 2  # default = midpoint
            if len(diffs) > 4:
                diff_values = [d for _, d in diffs]
                max_diff = max(diff_values)
                threshold = max_diff * 0.6

                # Find first frame where diff crosses threshold = transition start
                for i, (frame_idx, diff) in enumerate(diffs):
                    if diff > threshold and frame_idx > total_frames * 0.2:
                        transition_frame = frame_idx
                        break

            print(f"[PIN] Transition detected at frame {transition_frame}/{total_frames}")

            # -- Step 2: Pick best (sharpest) front frame ----------------------
            front_search_end = max(1, transition_frame - 2)
            front_candidates = []

            for i in range(0, front_search_end, max(1, front_search_end // 8)):
                cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                ret, frame = cap.read()
                if ret:
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
                    front_candidates.append((sharpness, frame))

            # -- Step 3: Pick best (sharpest) back frame -----------------------
            back_start = min(transition_frame + 2, total_frames - 1)
            back_candidates = []

            for i in range(back_start, total_frames, max(1, (total_frames - back_start) // 8)):
                cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                ret, frame = cap.read()
                if ret:
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
                    back_candidates.append((sharpness, frame))

            cap.release()

            # Use sharpest frame for each view
            if front_candidates:
                best_front = max(front_candidates, key=lambda x: x[0])[1]
                frames['front'] = Image.fromarray(cv2.cvtColor(best_front, cv2.COLOR_BGR2RGB))
                print(f"[OK] Best front frame selected (sharpness: {max(front_candidates, key=lambda x: x[0])[0]:.1f})")

            if back_candidates:
                best_back = max(back_candidates, key=lambda x: x[0])[1]
                frames['back'] = Image.fromarray(cv2.cvtColor(best_back, cv2.COLOR_BGR2RGB))
                print(f"[OK] Best back frame selected (sharpness: {max(back_candidates, key=lambda x: x[0])[0]:.1f})")
            else:
                print("[WARN] No back view found — using front only")

        except Exception as e:
            print(f"[FAIL] Frame extraction failed: {e}")
        finally:
            os.unlink(tmp_path)

        return frames
    
    @staticmethod
    def _detect_and_crop_products(frames, grid_rows, grid_columns, product_count):
        import cv2
        import numpy as np
        from PIL import Image
        import io  # [OK] ADD THIS IMPORT

        products = []
        front_frame = frames.get('front')
        back_frame = frames.get('back')

        if front_frame is None:
            print("[FAIL] No front frame available")
            return products

        def detect_garments_adaptive(pil_img, expected_count):
            """
            Computer Vision detector optimized for flat-lay clothing on counters, tables, or floors.
            Finds distinct garment bounding boxes based on contrast, color saliency, and morphology.
            """
            try:
                cv_img = cv2.cvtColor(np.array(pil_img.convert('RGB')), cv2.COLOR_RGB2BGR)
                gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
                blur = cv2.GaussianBlur(gray, (7, 7), 0)

                # Otsu + adaptive threshold
                _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
                kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15))
                cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

                contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                img_area = pil_img.width * pil_img.height
                min_area = img_area * 0.02
                max_area = img_area * 0.85

                garment_boxes = []
                for cnt in contours:
                    area = cv2.contourArea(cnt)
                    if min_area <= area <= max_area:
                        x, y, w, h = cv2.boundingRect(cnt)
                        aspect = w / float(h)
                        if 0.4 <= aspect <= 2.5:
                            garment_boxes.append((x, y, x + w, y + h, area))

                if abs(len(garment_boxes) - expected_count) <= 2 and len(garment_boxes) > 0:
                    row_height = max(50, pil_img.height // 4)
                    garment_boxes.sort(key=lambda b: (b[1] // row_height, b[0]))
                    crops = []
                    for (x1, y1, x2, y2, _) in garment_boxes[:expected_count]:
                        pw = int((x2 - x1) * 0.04)
                        ph = int((y2 - y1) * 0.04)
                        x1 = max(0, x1 - pw)
                        y1 = max(0, y1 - ph)
                        x2 = min(pil_img.width, x2 + pw)
                        y2 = min(pil_img.height, y2 + ph)
                        crop = pil_img.crop((x1, y1, x2, y2))
                        if crop.width < 512:
                            scale = 512 / crop.width
                            crop = crop.resize((int(crop.width * scale), int(crop.height * scale)), Image.LANCZOS)
                        crops.append(crop)
                    return crops, 'adaptive_contour'
                return None, 'fallback'
            except Exception as e:
                print(f"[WARN] Adaptive contour detection failed: {e}")
                return None, 'fallback'

        def detect_shirts_yolo(pil_img, expected_count):
            """
            Detects shirts and clothing items on flat counter/table.
            Uses custom YOLO model if configured, checks fashion classes,
            and validates bounding box count with adaptive contour fallback.
            """
            try:
                ultralytics_mod = importlib.import_module('ultralytics')
                YOLO = getattr(ultralytics_mod, 'YOLO', None)
                if YOLO is None:
                    raise ImportError("YOLO not found in ultralytics")

                # Dynamic model path (supports custom fine-tuned weights via environment)
                model_name = os.environ.get('YOLO_GARMENT_MODEL', 'yolov8n.pt')
                model = YOLO(model_name)

                img_array = np.array(pil_img.convert('RGB'))

                # Determine if model has dedicated fashion/clothing classes
                class_names = getattr(model, 'names', {})
                clothing_class_ids = [
                    cid for cid, name in class_names.items()
                    if any(term in str(name).lower() for term in ['shirt', 'dress', 'clothing', 'top', 'pant'])
                ]

                if clothing_class_ids:
                    results = model(img_array, verbose=False, conf=0.25, classes=clothing_class_ids)
                else:
                    results = model(img_array, verbose=False, conf=0.15, iou=0.35)

                boxes = []
                for result in results:
                    for box in result.boxes:
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        conf = float(box.conf[0])
                        cls  = int(box.cls[0])
                        boxes.append((x1, y1, x2, y2, conf, cls))

                # Sort left->right, top->bottom (grid order)
                row_h = max(50, pil_img.height // 3)
                boxes.sort(key=lambda b: (b[1] // row_h, b[0]))

                print(f"[TARGET] YOLO detected {len(boxes)} objects (expected {expected_count})")

                if abs(len(boxes) - expected_count) <= 2 and len(boxes) > 0:
                    crops = []
                    for (x1, y1, x2, y2, conf, cls) in boxes[:expected_count]:
                        pw = int((x2 - x1) * 0.05)
                        ph = int((y2 - y1) * 0.05)
                        x1 = max(0, x1 - pw)
                        y1 = max(0, y1 - ph)
                        x2 = min(pil_img.width,  x2 + pw)
                        y2 = min(pil_img.height, y2 + ph)

                        crop = pil_img.crop((x1, y1, x2, y2))
                        if crop.width < 512:
                            scale = 512 / crop.width
                            crop = crop.resize(
                                (int(crop.width * scale), int(crop.height * scale)),
                                Image.LANCZOS
                            )
                        crops.append(crop)
                        print(f"  [OK] YOLO shirt: {x1},{y1}->{x2},{y2} conf={conf:.2f}")

                    return crops, 'yolo'
                else:
                    print(f"[WARN] YOLO count mismatch ({len(boxes)} vs {expected_count}) -> checking adaptive contour detector")
                    return None, 'fallback'

            except Exception as e:
                print(f"[WARN] YOLO detection skipped: {e} -> checking adaptive contour detector")
                return None, 'fallback'

        def equal_grid_crop(pil_img, rows, cols, product_count):
            """
            Fallback: equal division crop with black border stripping.
            Used when YOLO count doesn't match expected product count.
            """
            gray = cv2.cvtColor(np.array(pil_img.convert('RGB')), cv2.COLOR_RGB2GRAY)
            rows_ok = np.where(np.sum(gray > 40, axis=1) > gray.shape[1] * 0.08)[0]
            cols_ok = np.where(np.sum(gray > 40, axis=0) > gray.shape[0] * 0.08)[0]

            if len(rows_ok) == 0 or len(cols_ok) == 0:
                left, top, right, bottom = 0, 0, pil_img.width, pil_img.height
            else:
                left   = int(cols_ok[0])
                top    = int(rows_ok[0])
                right  = int(cols_ok[-1])
                bottom = int(rows_ok[-1])

            cw = right - left
            ch = bottom - top
            cell_w = cw / cols
            cell_h = ch / rows

            pad_x = int(cell_w * 0.03)
            pad_y = int(cell_h * 0.02)

            crops = []
            for r in range(rows):
                for c in range(cols):
                    if len(crops) >= product_count:
                        break
                    x1 = max(0, int(left + c       * cell_w) + pad_x)
                    y1 = max(0, int(top  + r       * cell_h) + pad_y)
                    x2 = min(pil_img.width,  int(left + (c+1) * cell_w) - pad_x)
                    y2 = min(pil_img.height, int(top  + (r+1) * cell_h) - pad_y)

                    crop = pil_img.crop((x1, y1, x2, y2))

                    if crop.width < 512:
                        scale = 512 / crop.width
                        crop = crop.resize(
                            (int(crop.width * scale), int(crop.height * scale)),
                            Image.LANCZOS
                        )
                    crops.append(crop)
                    print(f"  [OK] Grid shirt_{r}_{c}: {x2-x1}x{y2-y1}px")

            return crops

        # -- Main detection pipeline: YOLO -> Adaptive Counter Contours -> Grid Slicing --
        print(f"\n[SEARCH] Detecting {product_count} shirts using intelligent garment detector...")
        front_crops, method = detect_shirts_yolo(front_frame, product_count)

        if front_crops is None:
            print("[SEARCH] Trying adaptive flat-lay contour detector...")
            front_crops, method = detect_garments_adaptive(front_frame, product_count)

        if front_crops is None:
            print("[MEASURE] Using equal grid fallback...")
            front_crops = equal_grid_crop(front_frame, grid_rows, grid_columns, product_count)
            method = 'grid'

        # Same method for back view
        if back_frame:
            back_crops, b_method = detect_shirts_yolo(back_frame, product_count)
            if back_crops is None:
                back_crops, b_method = detect_garments_adaptive(back_frame, product_count)
            if back_crops is None:
                back_crops = equal_grid_crop(back_frame, grid_rows, grid_columns, product_count)
        else:
            back_crops = []

        print(f"[OK] Final: {len(front_crops)} front / {len(back_crops)} back (Method: {method})")

        for idx, front_crop in enumerate(front_crops):
            back_crop = back_crops[idx] if idx < len(back_crops) else None
            products.append({
                'front': front_crop,
                'back':  back_crop,
                'row':   idx // grid_columns,
                'col':   idx %  grid_columns,
            })

        # [OK] [OK] [OK] ADD THIS CONVERSION - Convert PIL Images to Bytes [OK] [OK] [OK]
        for product in products:
            if product.get('front') and hasattr(product['front'], 'save'):
                img_byte_arr = io.BytesIO()
                product['front'].save(img_byte_arr, format='PNG')
                product['front'] = img_byte_arr.getvalue()
            if product.get('back') and hasattr(product['back'], 'save'):
                img_byte_arr = io.BytesIO()
                product['back'].save(img_byte_arr, format='PNG')
                product['back'] = img_byte_arr.getvalue()

        return products




    
    @staticmethod
    def _remove_background(image_data):
        """
        High-Performance Semantic Garment Isolation:
        Uses isolate_garment_clutter_free (MiniBatchKMeans + perimeter border analysis).
        Runs locally in ~50-80ms on CPU without external API timeouts or network bottlenecks.
        Rejects feet, mats, rugs, floor tiles, and non-garment clutter.
        """
        try:
            from intelligence.services.garment_isolator import isolate_garment_clutter_free
            isolated_pil = isolate_garment_clutter_free(image_data)
            buf = io.BytesIO()
            isolated_pil.save(buf, format='PNG')
            return buf.getvalue()
        except Exception as e:
            logger.warning(f"[WARN] Local clutter-free isolation fallback: {e}")
            return AIService._simple_background_removal(image_data)
    
    @staticmethod
    def _simple_background_removal(image_data):
        """
        Adaptive local CV background removal:
        Samples outer boundary / corners to detect background surface (wood, tile, cloth, cardboard)
        and extracts the garment contour using Euclidean color distance and Otsu morphological filtering.
        Guarantees non-white tables do not corrupt the garment crop.
        """
        try:
            if isinstance(image_data, bytes):
                img = Image.open(io.BytesIO(image_data)).convert("RGB")
            else:
                img = image_data.convert("RGB")

            cv_img = np.array(img)
            h, w = cv_img.shape[:2]

            # Sample corners and edge margins to estimate table/counter background
            sample_size = max(5, min(25, h // 20, w // 20))
            corners = [
                cv_img[0:sample_size, 0:sample_size],
                cv_img[0:sample_size, max(0, w - sample_size):w],
                cv_img[max(0, h - sample_size):h, 0:sample_size],
                cv_img[max(0, h - sample_size):h, max(0, w - sample_size):w]
            ]
            bg_color = np.median(np.concatenate([c.reshape(-1, 3) for c in corners]), axis=0)

            # Compute color distance from background
            diff = np.linalg.norm(cv_img.astype(np.float32) - bg_color.astype(np.float32), axis=2)

            # Normalized Otsu thresholding
            diff_norm = np.clip((diff / (np.max(diff) + 1e-5)) * 255, 0, 255).astype(np.uint8)
            _, mask = cv2.threshold(diff_norm, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

            # Clean morphological noise (fill fabric weave holes, remove table specks)
            kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
            mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel_close)
            kernel_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel_open)

            # Retain primary garment contour
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            if contours:
                largest_cnt = max(contours, key=cv2.contourArea)
                clean_mask = np.zeros_like(mask)
                cv2.drawContours(clean_mask, [largest_cnt], -1, 255, -1)
                mask = clean_mask

            # Edge feathering
            mask_blurred = cv2.GaussianBlur(mask, (7, 7), 2.0)

            # Build RGBA result: exact garment pixels preserved
            rgba = cv2.cvtColor(cv_img, cv2.COLOR_RGB2RGBA)
            rgba[:, :, 3] = mask_blurred

            # Validate that garment wasn't completely masked out
            visible = np.sum(mask > 30)
            if visible / mask.size < 0.05:
                print("[WARN] Local adaptive background removal was too aggressive — keeping original")
                buf = io.BytesIO()
                img.save(buf, format='JPEG', quality=92)
                return buf.getvalue()

            res_pil = Image.fromarray(rgba)
            white_bg = Image.new('RGBA', res_pil.size, (255, 255, 255, 255))
            white_bg.paste(res_pil, (0, 0), res_pil)
            final = white_bg.convert('RGB')

            output = io.BytesIO()
            final.save(output, format='JPEG', quality=92)
            return output.getvalue()

        except Exception as e:
            print(f"[FAIL] Adaptive local background removal failed: {e}")
            if isinstance(image_data, bytes):
                return image_data
            output = io.BytesIO()
            image_data.convert("RGB").save(output, format='JPEG', quality=90)
            return output.getvalue()
    
    @staticmethod
    def _detect_pattern(image):
        """Detect pattern using simple CV"""
        try:
            if isinstance(image, bytes):
                img = Image.open(io.BytesIO(image))
            else:
                img = image
            
            # Convert to numpy array
            img_array = np.array(img.convert('L'))  # Grayscale
            
            # Calculate edge density
            edges = cv2.Canny(img_array, 50, 150)
            edge_density = np.sum(edges > 0) / edges.size
            
            # Calculate frequency components
            fft = np.fft.fft2(img_array)
            fft_shift = np.fft.fftshift(fft)
            magnitude = np.abs(fft_shift)
            
            # Check for periodic patterns (stripes, checks)
            center_y, center_x = magnitude.shape[0] // 2, magnitude.shape[1] // 2
            vertical_energy = np.sum(magnitude[center_y-10:center_y+10, :])
            horizontal_energy = np.sum(magnitude[:, center_x-10:center_x+10])
            
            if edge_density > 0.3:
                if vertical_energy > horizontal_energy * 1.5:
                    return 'striped'
                elif horizontal_energy > vertical_energy * 1.5:
                    return 'striped'
                else:
                    return 'checked'
            elif edge_density < 0.1:
                return 'solid'
            else:
                return 'patterned'
                
        except Exception as e:
            print(f"Pattern detection failed: {e}")
            return 'solid'
    
    @staticmethod
    def _detect_colors(image):
        """Detect dominant garment colors using high-speed MiniBatchKMeans on isolated fabric pixels"""
        try:
            from sklearn.cluster import MiniBatchKMeans
            from intelligence.services.garment_isolator import isolate_garment_clutter_free

            # 1. First priority: Analyze isolated garment fabric pixels (ignoring floor tiles and clutter)
            if isinstance(image, (bytes, bytearray, Image.Image)):
                try:
                    garment_rgba = isolate_garment_clutter_free(image)
                    np_rgba = np.array(garment_rgba)
                    garment_pixels = np_rgba[np_rgba[:, :, 3] > 60][:, :3]
                    if len(garment_pixels) > 100:
                        step = max(1, len(garment_pixels) // 2500)
                        sample_pixels = garment_pixels[::step].astype(np.float32)

                        mbk = MiniBatchKMeans(n_clusters=4, random_state=42, batch_size=256, n_init='auto')
                        mbk.fit(sample_pixels)

                        colors = []
                        for rgb in mbk.cluster_centers_.astype(int):
                            color_name = AIService._rgb_to_color_name(tuple(rgb))
                            hex_code = "#{:02x}{:02x}{:02x}".format(*rgb)
                            colors.append({'name': color_name, 'code': hex_code, 'rgb': tuple(rgb)})
                        return colors
                except Exception as ex:
                    logger.debug(f"Garment color isolation fallback: {ex}")

            # 2. Fast Fallback
            if isinstance(image, bytes):
                img = Image.open(io.BytesIO(image))
            else:
                img = image

            if img.mode != 'RGB':
                img = img.convert('RGB')

            img = img.resize((100, 100))
            pixels = np.array(img).reshape(-1, 3).astype(np.float32)

            mbk = MiniBatchKMeans(n_clusters=5, random_state=42, batch_size=256, n_init='auto')
            mbk.fit(pixels)

            colors = []
            for rgb in mbk.cluster_centers_.astype(int):
                color_name = AIService._rgb_to_color_name(tuple(rgb))
                hex_code = "#{:02x}{:02x}{:02x}".format(*rgb)
                colors.append({'name': color_name, 'code': hex_code, 'rgb': tuple(rgb)})

            non_bg = [c for c in colors if not (c['rgb'][0] > 240 and c['rgb'][1] > 240 and c['rgb'][2] > 240)]
            return non_bg if non_bg else colors

        except Exception as e:
            print(f"Color detection failed: {e}")
            return [{'name': 'Unknown', 'code': '#000000', 'rgb': (0,0,0)}]
    
    @staticmethod
    def _rgb_to_color_name(rgb):
        """Convert RGB to color name"""
        color_names = {
            (255, 0, 0): "Red",
            (0, 255, 0): "Green",
            (0, 0, 255): "Blue",
            (0, 0, 0): "Black",
            (255, 255, 255): "White",
            (128, 128, 128): "Gray",
            (255, 255, 0): "Yellow",
            (255, 165, 0): "Orange",
            (128, 0, 128): "Purple",
            (255, 192, 203): "Pink",
            (139, 69, 19): "Brown",
        }
        
        # Find closest match
        closest = min(color_names.keys(), key=lambda c: sum((a-b)**2 for a,b in zip(rgb, c)))
        return color_names[closest]
    


    @staticmethod
    def _process_final_image(image, view='front', garment_type=None, seller_id=None):
        try:
            from intelligence.services.studio_shape_engine import execute_studio_pipeline
            final_bytes, mode, telemetry = execute_studio_pipeline(
                raw_image_input=image,
                view=view,
                user_garment_type=garment_type,
                seller_id=seller_id
            )
            return final_bytes
        except Exception as e:
            logger.error(f"[FAIL] Final processing failed: {e}", exc_info=True)
            return None