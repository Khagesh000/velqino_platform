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

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
from django.core.files.base import ContentFile
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from catalog.models import Product, ProductVariant, ProductImage

from PIL import ImageFilter
try:
    from realesrgan import RealESRGANer
    import torch
    REALESRGAN_AVAILABLE = True
except ImportError:
    REALESRGAN_AVAILABLE = False

logger = logging.getLogger(__name__)


class AIService:
    _sr_model = None
    

    # =========================
    # 🚀 MAIN ENTRY FOR VIDEO PROCESSING
    # =========================
    @staticmethod
    def process_bulk_video(seller_id, video_data, product_count, common_price, common_cost, 
                           category_id, name_prefix, brand, description, grid_rows, grid_columns, sizes=None, task_id=None):
        """
        Process one video containing multiple products in grid layout
        """
        print(f"\n🚀 Processing video with {product_count} products in {grid_rows}x{grid_columns} grid")\
        
        from ..models import Category  # adjust import path if needed
        if not Category.objects.filter(id=category_id).exists():
            raise ValueError(f"category_id {category_id} does not exist. Cannot create products.")
        
        channel_layer = get_channel_layer()
        room_group_name = task_id
        
        # Send progress
        AIService._send_progress(channel_layer, room_group_name, 10, "Extracting frames from video...")
        
        # Step 1: Extract frames from video
        frames = AIService._extract_frames_from_video(video_data, grid_rows, grid_columns)
        
        if not frames.get('front'):
            print("❌ No frames extracted from video")
            return None
        
        AIService._send_progress(channel_layer, room_group_name, 30, f"Extracted {len(frames)} frames")
        
        # Step 2: Detect grid and crop individual products
        products_data = AIService._detect_and_crop_products(frames, grid_rows, grid_columns, product_count)
        
        AIService._send_progress(channel_layer, room_group_name, 30, "Extracted front and back frames")
        
        # Step 3: Process each product
        created_products = []
        
        for idx, product_frames in enumerate(products_data[:product_count]):
            progress = 50 + int((idx / product_count) * 40)
            AIService._send_progress(
                channel_layer, room_group_name, progress, 
                f"Processing product {idx+1}/{product_count}"
            )
            
            # Get front and back images
            front_img = product_frames.get('front')
            back_img = product_frames.get('back')
            
            if not front_img:
                continue
            
            # Remove background
            front_cleaned = AIService._process_final_image(front_img)
            back_cleaned = AIService._process_final_image(back_img) if back_img else None

            # Detect pattern and colors
            pattern = AIService._detect_pattern(front_img)
            colors = AIService._detect_colors(front_img)
            primary_color = colors[0]['name'] if colors else ''
            
            # Generate product name
            product_name = f"{name_prefix} {idx+1}"
            if pattern and pattern != 'solid':
                product_name = f"{pattern.capitalize()} {primary_color} {name_prefix}"
            elif primary_color:
                product_name = f"{primary_color} {name_prefix}"
            
            # Create product
            product = Product.objects.create(
                seller_id=seller_id,
                name=product_name,
                price=common_price,
                cost=common_cost,
                category_id=category_id,
                brand=brand,
                description=description,
                pattern=pattern,
                primary_color=primary_color,
                status='active'
            )
            
            # Save images
            if front_cleaned:
                ProductImage.objects.create(
                    product=product,
                    image=ContentFile(front_cleaned, name=f"{product.sku}_front.png"),
                    is_primary=True,
                    is_front=True,
                    order=0
                )
            
            if back_cleaned:
                ProductImage.objects.create(
                    product=product,
                    image=ContentFile(back_cleaned, name=f"{product.sku}_back.png"),
                    is_primary=False,
                    is_front=False,
                    order=1
                )
            
            created_products.append(product.id)
            if sizes:
                import uuid
                for size in sizes:
                    ProductVariant.objects.create(
                        product=product,
                        size=size,
                        color=primary_color or '',
                        sku=f"{product.sku}-{size}",
                        stock=0,  # wholesaler updates stock later
                        price=common_price
                    )
                print(f"✅ Created {len(sizes)} size variants for {product_name}")
        
        AIService._send_progress(channel_layer, room_group_name, 100, "Completed!")
        
        return {
            'products_created': len(created_products),
            'product_ids': created_products
        }
    
    # =========================
    # 🚀 MAIN ENTRY FOR BULK IMAGES PROCESSING
    # =========================
    @staticmethod
    def process_bulk_images(seller_id, images_data, common_price, common_cost,
                        category_id, name_prefix, brand, description,
                        upload_mode='front_back', sizes=None, task_id=None):
        """
        Process multiple images — supports front only OR front+back pairs
        upload_mode: 'front_only' or 'front_back'
        """
        print(f"\n🚀 Processing {len(images_data)} images (mode: {upload_mode})")

        from ..models import Category
        if not Category.objects.filter(id=category_id).exists():
            raise ValueError(f"category_id {category_id} does not exist. Cannot create products.")

        channel_layer = get_channel_layer()
        room_group_name = task_id

        AIService._send_progress(channel_layer, room_group_name, 10, "Processing images...")

        # ✅ Decide product count based on mode
        if upload_mode == 'front_only':
            products_to_create = len(images_data)
        else:
            products_to_create = len(images_data) // 2

        print(f"📦 Creating {products_to_create} products")

        created_products = []

        for idx in range(products_to_create):

            # ✅ Get front and back based on mode
            if upload_mode == 'front_only':
                front_img_data = images_data[idx]
                back_img_data = None
            else:
                front_img_data = images_data[idx * 2]
                back_img_data = images_data[idx * 2 + 1] if (idx * 2 + 1) < len(images_data) else None

            progress = 10 + int((idx / products_to_create) * 80)
            AIService._send_progress(
                channel_layer, room_group_name, progress,
                f"Processing product {idx+1}/{products_to_create}"
            )

            # ✅ Process images — background removal, HD, center on canvas
            front_cleaned = AIService._process_final_image(front_img_data)
            back_cleaned = AIService._process_final_image(back_img_data) if back_img_data else None

            # ✅ Detect pattern and colors from front image
            front_img = Image.open(io.BytesIO(front_img_data))
            pattern = AIService._detect_pattern(front_img)
            colors = AIService._detect_colors(front_img)
            primary_color = colors[0]['name'] if colors else ''

            # ✅ Generate product name
            product_name = f"{name_prefix} {idx+1}"
            if pattern and pattern != 'solid':
                product_name = f"{pattern.capitalize()} {primary_color} {name_prefix}"
            elif primary_color:
                product_name = f"{primary_color} {name_prefix}"

            # ✅ Create product
            product = Product.objects.create(
                seller_id=seller_id,
                name=product_name,
                price=common_price,
                cost=common_cost,
                category_id=category_id,
                brand=brand,
                description=description,
                pattern=pattern,
                primary_color=primary_color,
                status='active'
            )

            # ✅ Save front image — always PNG, 1200x1200
            if front_cleaned:
                ProductImage.objects.create(
                    product=product,
                    image=ContentFile(front_cleaned, name=f"{product.sku}_front.png"),
                    is_primary=True,
                    is_front=True,
                    order=0
                )
                print(f"✅ Saved front image for product {idx+1}")

            # ✅ Save back image — only if provided
            if back_cleaned:
                ProductImage.objects.create(
                    product=product,
                    image=ContentFile(back_cleaned, name=f"{product.sku}_back.png"),
                    is_primary=False,
                    is_front=False,
                    order=1
                )
                print(f"✅ Saved back image for product {idx+1}")

            created_products.append(product.id)
            if sizes:
                import uuid
                for size in sizes:
                    ProductVariant.objects.create(
                        product=product,
                        size=size,
                        color=primary_color or '',
                        sku=f"{product.sku}-{size}",
                        stock=0,  # wholesaler updates stock later
                        price=common_price
                    )
                print(f"✅ Created {len(sizes)} size variants for {product_name}")

        AIService._send_progress(channel_layer, room_group_name, 100, "Completed!")

        try:
            import asyncio
            group_name = f'ai_task_{task_id}'
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

            async def send_complete():
                await channel_layer.group_send(
                    group_name,
                    {
                        'type': 'send_progress',
                        'data': {
                            'progress': 100,
                            'message': 'Completed!'
                        }
                    }
                )
            loop.run_until_complete(send_complete())
            loop.close()
        except Exception as e:
            print(f"❌ Complete send failed: {e}")

        return {
            'products_created': len(created_products),
            'product_ids': created_products
        }

    @staticmethod
    def _smooth_wrinkles(image):
        return image
    

    @staticmethod
    def _load_sr_model():
        if not REALESRGAN_AVAILABLE:
            print("⚠️ RealESRGAN not available")
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
            print(f"❌ HD conversion failed: {e}")
            return image
    
    # =========================
    # 🔧 HELPER METHODS
    # =========================
    
    @staticmethod
    def _send_progress(channel_layer, room_group_name, progress, message):
        print(f"🔔 _send_progress called: {progress}% - {room_group_name}")
        
        if not room_group_name or not channel_layer:
            print("⚠️ Skipping — no room_group_name or channel_layer")
            return

        try:
            import asyncio

            group_name = f'ai_task_{room_group_name}'
            print(f"📤 Sending to group: {group_name}")

            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

            async def send():
                await channel_layer.group_send(
                    group_name,
                    {
                        'type': 'send_progress',
                        'data': {
                            'progress': progress,
                            'message': message
                        }
                    }
                )

            loop.run_until_complete(send())
            loop.close()
            print(f"📡 Progress sent to {group_name}: {progress}% - {message}")

        except Exception as e:
            print(f"❌ Progress send failed: {e}")
            import traceback
            traceback.print_exc()


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
                print("❌ No frames found in video")
                return frames

            # ── Step 1: Find transition point (front → back) ──────────────────
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

            # Find where diff jumps significantly (front→back transition)
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

            print(f"📍 Transition detected at frame {transition_frame}/{total_frames}")

            # ── Step 2: Pick best (sharpest) front frame ──────────────────────
            front_search_end = max(1, transition_frame - 2)
            front_candidates = []

            for i in range(0, front_search_end, max(1, front_search_end // 8)):
                cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                ret, frame = cap.read()
                if ret:
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
                    front_candidates.append((sharpness, frame))

            # ── Step 3: Pick best (sharpest) back frame ───────────────────────
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
                print(f"✅ Best front frame selected (sharpness: {max(front_candidates, key=lambda x: x[0])[0]:.1f})")

            if back_candidates:
                best_back = max(back_candidates, key=lambda x: x[0])[1]
                frames['back'] = Image.fromarray(cv2.cvtColor(best_back, cv2.COLOR_BGR2RGB))
                print(f"✅ Best back frame selected (sharpness: {max(back_candidates, key=lambda x: x[0])[0]:.1f})")
            else:
                print("⚠️ No back view found — using front only")

        except Exception as e:
            print(f"❌ Frame extraction failed: {e}")
        finally:
            os.unlink(tmp_path)

        return frames
    
    @staticmethod
    def _detect_and_crop_products(frames, grid_rows, grid_columns, product_count):
        import cv2
        import numpy as np
        from PIL import Image

        products = []
        front_frame = frames.get('front')
        back_frame = frames.get('back')

        if front_frame is None:
            print("❌ No front frame available")
            return products

        def detect_shirts_yolo(pil_img, expected_count):
            """
            Use YOLOv8 to detect each shirt as individual bounding box.
            Falls back to equal grid if YOLO finds wrong count.
            """
            try:
                from ultralytics import YOLO
                import numpy as np

                # Load YOLOv8 nano — detects 'person' class which covers clothing
                # We use it to find distinct objects in the image
                model = YOLO('yolov8n.pt')  # auto-downloads on first run

                img_array = np.array(pil_img.convert('RGB'))

                # Run detection — classes 0=person, 26=handbag, 27=tie
                # For clothing/shirts use class agnostic detection
                results = model(img_array, verbose=False, conf=0.1, iou=0.3)

                boxes = []
                for result in results:
                    for box in result.boxes:
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        conf = float(box.conf[0])
                        cls  = int(box.cls[0])
                        boxes.append((x1, y1, x2, y2, conf, cls))

                # Sort left→right, top→bottom (grid order)
                boxes.sort(key=lambda b: (b[1] // (pil_img.height // 3), b[0]))

                print(f"🎯 YOLO detected {len(boxes)} objects (expected {expected_count})")

                # If YOLO found correct count → use YOLO boxes
                if abs(len(boxes) - expected_count) <= 2 and len(boxes) > 0:
                    crops = []
                    for (x1, y1, x2, y2, conf, cls) in boxes[:expected_count]:
                        # Add 5% padding around each detected shirt
                        pw = int((x2 - x1) * 0.05)
                        ph = int((y2 - y1) * 0.05)
                        x1 = max(0, x1 - pw)
                        y1 = max(0, y1 - ph)
                        x2 = min(pil_img.width,  x2 + pw)
                        y2 = min(pil_img.height, y2 + ph)

                        crop = pil_img.crop((x1, y1, x2, y2))

                        # Upscale to min 512px
                        if crop.width < 512:
                            scale = 512 / crop.width
                            crop = crop.resize(
                                (int(crop.width * scale), int(crop.height * scale)),
                                Image.LANCZOS
                            )
                        crops.append(crop)
                        print(f"  ✅ YOLO shirt: {x1},{y1}->{x2},{y2} conf={conf:.2f}")

                    return crops, 'yolo'

                else:
                    print(f"⚠️ YOLO count mismatch → falling back to equal grid")
                    return None, 'fallback'

            except Exception as e:
                print(f"⚠️ YOLO failed: {e} → falling back to equal grid")
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
                    print(f"  ✅ Grid shirt_{r}_{c}: {x2-x1}x{y2-y1}px")

            return crops

        # ── Main: try YOLO first, fallback to equal grid ──────────────────────
        print(f"\n🔍 Detecting {product_count} shirts using YOLOv8...")
        front_crops, method = detect_shirts_yolo(front_frame, product_count)

        if front_crops is None:
            print("📐 Using equal grid fallback...")
            front_crops = equal_grid_crop(front_frame, grid_rows, grid_columns, product_count)

        # Same method for back
        if back_frame:
            back_crops, _ = detect_shirts_yolo(back_frame, product_count)
            if back_crops is None:
                back_crops = equal_grid_crop(back_frame, grid_rows, grid_columns, product_count)
        else:
            back_crops = []

        print(f"✅ Final: {len(front_crops)} front / {len(back_crops)} back ({method})")

        for idx, front_crop in enumerate(front_crops):
            back_crop = back_crops[idx] if idx < len(back_crops) else None
            products.append({
                'front': front_crop,
                'back':  back_crop,
                'row':   idx // grid_columns,
                'col':   idx %  grid_columns,
            })

        return products




    
    @staticmethod
    def _remove_background(image_data):
        try:
            api_key = getattr(settings, 'REMOVE_BG_API_KEY', None)

            if isinstance(image_data, Image.Image):
                img_bytes = io.BytesIO()
                image_data.save(img_bytes, format='PNG')
                image_data = img_bytes.getvalue()

            # ✅ Check size — remove.bg rejects tiny images (<100px)
            img_check = Image.open(io.BytesIO(image_data))
            print(f"🔍 Sending to remove.bg: {img_check.width}x{img_check.height}px")

            if img_check.width < 100 or img_check.height < 100:
                print("⚠️ Image too small — upscaling before remove.bg")
                scale = max(200 / img_check.width, 200 / img_check.height)
                img_check = img_check.resize(
                    (int(img_check.width * scale), int(img_check.height * scale)),
                    Image.LANCZOS
                )
                buf = io.BytesIO()
                img_check.save(buf, format='PNG')
                image_data = buf.getvalue()

            if not api_key:
                print("⚠️ No remove.bg API key — using fallback")
                return AIService._simple_background_removal(image_data)

            response = requests.post(
                'https://api.remove.bg/v1.0/removebg',
                files={'image_file': image_data},
                data={'size': 'auto'},
                headers={'X-Api-Key': api_key},
                timeout=30
            )

            if response.status_code == 200:
                print("✅ remove.bg success")
                return response.content

            print(f"⚠️ remove.bg failed: {response.status_code} — using fallback")
            return AIService._simple_background_removal(image_data)

        except Exception as e:
            print(f"❌ Background removal failed: {e}")
            return AIService._simple_background_removal(image_data)
    
    @staticmethod
    def _simple_background_removal(image_data):
        try:
            if isinstance(image_data, bytes):
                img = Image.open(io.BytesIO(image_data))
            else:
                img = image_data

            img = img.convert("RGBA")
            arr = np.array(img)

            # ✅ Only remove near-pure white (>250) — old 240 was too aggressive
            r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
            white_mask = (r > 250) & (g > 250) & (b > 250)
            arr[white_mask, 3] = 0
            img = Image.fromarray(arr)

            # ✅ Validate — if too much removed revert to original
            visible = np.sum(arr[:,:,3] > 30)
            if visible / arr[:,:,3].size < 0.05:
                print("⚠️ Simple BG removal too aggressive — returning original")
                if isinstance(image_data, bytes):
                    return image_data
                output = io.BytesIO()
                image_data.convert("RGB").save(output, format='JPEG', quality=90)
                return output.getvalue()

            white_bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
            white_bg.paste(img, (0, 0), img)
            final = white_bg.convert('RGB')

            output = io.BytesIO()
            final.save(output, format='JPEG', quality=90)
            return output.getvalue()

        except Exception as e:
            print(f"❌ Simple removal failed: {e}")
            return None
    
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
        """Detect dominant colors using K-means"""
        try:
            from sklearn.cluster import KMeans
            
            if isinstance(image, bytes):
                img = Image.open(io.BytesIO(image))
            else:
                img = image
            
            img = img.resize((100, 100))
            img_array = np.array(img)
            pixels = img_array.reshape(-1, 3)
            
            # K-means clustering
            kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
            kmeans.fit(pixels)
            
            colors = []
            for rgb in kmeans.cluster_centers_.astype(int):
                color_name = AIService._rgb_to_color_name(tuple(rgb))
                hex_code = "#{:02x}{:02x}{:02x}".format(*rgb)
                colors.append({'name': color_name, 'code': hex_code, 'rgb': tuple(rgb)})
            
            return colors
            
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
    def _process_final_image(image):
        try:
            if isinstance(image, bytes):
                img = Image.open(io.BytesIO(image)).convert("RGBA")
            else:
                img = image.convert("RGBA")

            # 1. AI HD
            img = AIService._enhance_ai_hd(img)

            # 2. Auto rotate — disabled (causes wrong rotation)
            # img = AIService._auto_rotate(img)

            # 3. Wrinkle smooth
            img = AIService._smooth_wrinkles(img)

            # 4. Remove background
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='PNG')
            bg_removed = AIService._remove_background(img_bytes.getvalue())

            if bg_removed is None:
                print("⚠️ BG removal returned None — using original")
                img_bytes.seek(0)
                bg_removed = img_bytes.getvalue()

            img = Image.open(io.BytesIO(bg_removed)).convert("RGBA")

            # ✅ Validate shirt not blank after bg removal
            arr = np.array(img)
            alpha = arr[:, :, 3]
            visible_pixels = np.sum(alpha > 30)
            if visible_pixels / alpha.size < 0.05:
                print("⚠️ BG removal made shirt blank — reverting to original")
                if isinstance(image, bytes):
                    img = Image.open(io.BytesIO(image)).convert("RGBA")
                else:
                    img = image.convert("RGBA")

            # ✅ TIGHT CROP — remove all transparent padding first
            # So 85% fill is based on actual shirt pixels not empty space
            arr = np.array(img)
            alpha = arr[:, :, 3]
            rows_ok = np.where(np.sum(alpha > 30, axis=1) > 0)[0]
            cols_ok = np.where(np.sum(alpha > 30, axis=0) > 0)[0]
            if len(rows_ok) > 0 and len(cols_ok) > 0:
                x1 = max(0, int(cols_ok[0]) - 5)
                y1 = max(0, int(rows_ok[0]) - 5)
                x2 = min(img.width,  int(cols_ok[-1]) + 5)
                y2 = min(img.height, int(rows_ok[-1]) + 5)
                img = img.crop((x1, y1, x2, y2))
                print(f"✂️ Tight crop: {img.width}x{img.height}px")

            # 5. Add shadow
            img = AIService._add_shadow(img)

            # ✅ Scale shirt to fill 85% of canvas
            canvas_size = 1200
            target_size = int(canvas_size * 0.85)
            ratio = min(target_size / img.width, target_size / img.height)
            new_w = int(img.width * ratio)
            new_h = int(img.height * ratio)
            img = img.resize((new_w, new_h), Image.LANCZOS)

            # ✅ Perfect center on white canvas
            bg = Image.new("RGBA", (canvas_size, canvas_size), (255, 255, 255, 255))
            x = (canvas_size - new_w) // 2
            y = (canvas_size - new_h) // 2
            bg.paste(img, (x, y), img)

            # 7. Final PNG
            final = bg.convert("RGB")
            output = io.BytesIO()
            final.save(output, format='PNG', compress_level=0)

            print(f"✅ Final image: shirt {new_w}x{new_h}px on {canvas_size}x{canvas_size} ({new_w/canvas_size*100:.0f}% fill)")
            return output.getvalue()

        except Exception as e:
            print(f"❌ Final processing failed: {e}")
            return None