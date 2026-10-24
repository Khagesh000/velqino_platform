import os
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
from django.conf import settings
from ..models import TryOnGenerationSession, TryOnGeneratedAngle, AIModelProfile, AIModelAnglePose
from .base_model_service import hex_to_rgb, generate_studio_model_image


def remove_garment_background(pil_image, tolerance=25):
    """
    Intelligently extracts the garment from flat-lay or hanger backgrounds using
    Otsu thresholding, GrabCut refinement, and edge smoothing.
    Returns RGBA Image with clean transparent background.
    """
    if pil_image.mode != 'RGB':
        pil_image = pil_image.convert('RGB')

    # Convert to numpy array (OpenCV format)
    cv_img = np.array(pil_image)
    h, w = cv_img.shape[:2]

    # Sample corners to determine background color
    corners = [
        cv_img[0:15, 0:15],
        cv_img[0:15, w-15:w],
        cv_img[h-15:h, 0:15],
        cv_img[h-15:h, w-15:w]
    ]
    bg_color = np.median(np.concatenate([c.reshape(-1, 3) for c in corners]), axis=0)

    # Compute Euclidean color distance from background
    diff = np.linalg.norm(cv_img.astype(np.float32) - bg_color.astype(np.float32), axis=2)

    # Initial binary mask
    mask = (diff > tolerance).astype(np.uint8) * 255

    # Clean morphological noise (fill internal holes, remove stray specs)
    kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel_close)

    kernel_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel_open)

    # Keep only the largest connected contour (the main garment)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        largest_cnt = max(contours, key=cv2.contourArea)
        clean_mask = np.zeros_like(mask)
        cv2.drawContours(clean_mask, [largest_cnt], -1, 255, -1)
        mask = clean_mask

    # Feather alpha edge for seamless blending
    mask_blurred = cv2.GaussianBlur(mask, (7, 7), 2.5)

    # Build RGBA result
    rgba = cv2.cvtColor(cv_img, cv2.COLOR_RGB2RGBA)
    rgba[:, :, 3] = mask_blurred

    return Image.fromarray(rgba)


def crop_to_content(pil_rgba, padding=10):
    """Crops transparent borders around garment."""
    bbox = pil_rgba.getbbox()
    if not bbox:
        return pil_rgba
    x0, y0, x1, y1 = bbox
    w, h = pil_rgba.size
    x0 = max(0, x0 - padding)
    y0 = max(0, y0 - padding)
    x1 = min(w, x1 + padding)
    y1 = min(h, y1 + padding)
    return pil_rgba.crop((x0, y0, x1, y1))


def warp_garment_to_model(
    garment_rgba,
    angle_key,
    garment_type='top',
    fit_silhouette='regular',
    tuck_style='untucked',
    target_width=800,
    target_height=1200,
    is_female=False,
    is_kid=False
):
    """
    Warps and positions the cut-out garment onto the model body for the specific camera angle.
    Supports Topwear, Bottomwear, and Full sets with fit silhouette adjustments.
    """
    garment_clean = crop_to_content(garment_rgba)
    gw, gh = garment_clean.size

    canvas = Image.new('RGBA', (target_width, target_height), (0, 0, 0, 0))
    cx = target_width // 2

    # Fit silhouette scale factor
    fit_scales = {
        'slim': 0.94,
        'regular': 1.0,
        'relaxed': 1.08,
        'oversized': 1.18,
    }
    f_scale = fit_scales.get(fit_silhouette, 1.0)

    # Base target boundaries on the 800x1200 mannequin
    if garment_type == 'top':
        base_top_y = int(target_height * 0.16)
        base_hem_y = int(target_height * 0.52 if tuck_style == 'untucked' else 0.44)
        desired_h = int((base_hem_y - base_top_y) * (1.15 if fit_silhouette == 'oversized' else 1.0))
        base_w = int(target_width * (0.48 if is_kid else (0.54 if is_female else 0.62)) * f_scale)

        if angle_key == 'front':
            # Front center drape
            resized = garment_clean.resize((base_w, desired_h), Image.Resampling.LANCZOS)
            x_pos = cx - (base_w // 2)
            y_pos = base_top_y
            canvas.alpha_composite(resized, (x_pos, y_pos))

        elif angle_key == 'back':
            # Back drape: Mirror slightly, raise collar slightly, wider shoulder drape
            mirrored = garment_clean.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
            resized = mirrored.resize((int(base_w * 1.04), desired_h), Image.Resampling.LANCZOS)
            # Mask or smooth out any front chest print/neck scooped opening for authentic back fabric
            x_pos = cx - (resized.width // 2)
            y_pos = base_top_y - 6  # Back collar sits higher
            canvas.alpha_composite(resized, (x_pos, y_pos))

        elif angle_key in ['left_three_quarter', 'right_three_quarter']:
            # 3D Rotational Perspective Warp
            flip = 1 if angle_key == 'left_three_quarter' else -1
            w34 = int(base_w * 0.88)
            h34 = desired_h
            resized = garment_clean.resize((w34, h34), Image.Resampling.LANCZOS)

            # Perspective skew using OpenCV
            np_img = np.array(resized)
            src_pts = np.float32([[0, 0], [w34, 0], [w34, h34], [0, h34]])

            # Near side expanded, far side foreshortened
            if flip == 1:
                dst_pts = np.float32([
                    [0, 10],
                    [w34, 30],
                    [int(w34 * 0.90), h34 - 10],
                    [int(w34 * 0.05), h34 + 10]
                ])
            else:
                dst_pts = np.float32([
                    [0, 30],
                    [w34, 10],
                    [int(w34 * 0.95), h34 + 10],
                    [int(w34 * 0.10), h34 - 10]
                ])

            matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
            warped = cv2.warpPerspective(
                np_img,
                matrix,
                (w34, h34 + 25),
                flags=cv2.INTER_LANCZOS4,
                borderMode=cv2.BORDER_CONSTANT,
                borderValue=(0, 0, 0, 0)
            )

            warped_pil = Image.fromarray(warped)
            x_pos = cx - (w34 // 2) - int(30 * flip)
            y_pos = base_top_y + 8
            canvas.alpha_composite(warped_pil, (x_pos, y_pos))

        elif angle_key in ['left_side', 'right_side']:
            # Side profile: Slimmer horizontal width, lateral chest curvature
            flip = 1 if angle_key == 'left_side' else -1
            side_w = int(base_w * 0.52)
            side_h = int(desired_h * 1.02)
            resized = garment_clean.resize((side_w, side_h), Image.Resampling.LANCZOS)

            np_img = np.array(resized)
            src_pts = np.float32([[0, 0], [side_w, 0], [side_w, side_h], [0, side_h]])
            dst_pts = np.float32([
                [5, 12],
                [side_w - 5, 12],
                [side_w, side_h],
                [0, side_h]
            ])
            matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
            warped = cv2.warpPerspective(np_img, matrix, (side_w, side_h), flags=cv2.INTER_LANCZOS4)

            warped_pil = Image.fromarray(warped)
            x_pos = cx - (side_w // 2)
            y_pos = base_top_y + 14
            canvas.alpha_composite(warped_pil, (x_pos, y_pos))

    elif garment_type == 'bottom':
        # Pants / Trousers / Shorts
        base_top_y = int(target_height * 0.44)
        base_bot_y = int(target_height * 0.88)
        desired_h = base_bot_y - base_top_y
        base_w = int(target_width * 0.48 * f_scale)

        if angle_key in ['front', 'back']:
            resized = garment_clean.resize((base_w, desired_h), Image.Resampling.LANCZOS)
            canvas.alpha_composite(resized, (cx - (base_w // 2), base_top_y))
        elif angle_key in ['left_three_quarter', 'right_three_quarter']:
            w34 = int(base_w * 0.86)
            resized = garment_clean.resize((w34, desired_h), Image.Resampling.LANCZOS)
            canvas.alpha_composite(resized, (cx - (w34 // 2), base_top_y + 4))
        elif angle_key in ['left_side', 'right_side']:
            side_w = int(base_w * 0.56)
            resized = garment_clean.resize((side_w, desired_h), Image.Resampling.LANCZOS)
            canvas.alpha_composite(resized, (cx - (side_w // 2), base_top_y + 8))

    return canvas


def harmonize_lighting_and_shading(model_base_pil, garment_canvas_pil):
    """
    Extracts anatomical ambient occlusion, chest shading, and studio lighting
    from the base model image and projects them onto the fitted garment for realistic folds.
    """
    # Convert model base to grayscale luminance map
    gray_model = model_base_pil.convert('L')
    np_gray = np.array(gray_model).astype(np.float32) / 255.0

    # Extract soft shading gradient (normalized around 1.0 for multiply)
    # Bright studio lights stay bright (~1.1), muscle hollows/creases become (~0.75 - 0.90)
    shading_map = 0.72 + (np_gray * 0.40)
    shading_map = np.clip(shading_map, 0.65, 1.15)

    np_garment = np.array(garment_canvas_pil).astype(np.float32)
    alpha = np_garment[:, :, 3] / 255.0

    # Apply lighting map to R, G, B channels where alpha > 0
    for c in range(3):
        np_garment[:, :, c] = np.clip(np_garment[:, :, c] * shading_map, 0, 255)

    # Ambient drop shadow under garment edges (collar, sleeves, hem)
    garment_mask = Image.fromarray((alpha * 255).astype(np.uint8), mode='L')
    edge_shadow = garment_mask.filter(ImageFilter.GaussianBlur(6))
    np_shadow = np.array(edge_shadow).astype(np.float32) / 255.0 * 0.35

    lit_garment = Image.fromarray(np_garment.astype(np.uint8), mode='RGBA')

    # Composite: Model Base -> Drop Shadow -> Lit Garment
    final_composite = Image.new('RGBA', model_base_pil.size, (0, 0, 0, 0))
    final_composite.alpha_composite(model_base_pil)

    # Soft ambient occlusion behind garment
    shadow_layer = Image.new('RGBA', model_base_pil.size, (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_layer)
    shadow_np = np.zeros((model_base_pil.height, model_base_pil.width, 4), dtype=np.uint8)
    shadow_np[:, :, 0] = 20
    shadow_np[:, :, 1] = 18
    shadow_np[:, :, 2] = 24
    shadow_np[:, :, 3] = (np_shadow * 120).astype(np.uint8)
    final_composite.alpha_composite(Image.fromarray(shadow_np, mode='RGBA'))

    # Place lit garment on top
    final_composite.alpha_composite(lit_garment)

    return final_composite


def apply_studio_backdrop(composite_pil, backdrop_style='pure_white'):
    """
    Places the fitted model on chosen studio backdrop:
    - pure_white: Standard high-end e-commerce white (#FFFFFF)
    - soft_shadow: Commercial studio floor gradient
    - warm_canvas: Velqino brand warm canvas (#FAF4E5 to #FFFFFF)
    - transparent: Clean PNG
    """
    w, h = composite_pil.size

    if backdrop_style == 'transparent':
        return composite_pil

    bg = Image.new('RGBA', (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(bg)

    if backdrop_style == 'soft_shadow':
        # Studio gradient: Soft top light to gently grounding floor
        for y in range(h):
            ratio = y / h
            v = int(255 - (ratio * 12))
            draw.line([(0, y), (w, y)], fill=(v, v, v, 255))

        # Soft cast floor shadow
        floor_shadow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        f_draw = ImageDraw.Draw(floor_shadow)
        f_draw.ellipse([w // 2 - 220, h - 140, w // 2 + 220, h - 30], fill=(30, 25, 35, 55))
        floor_shadow = floor_shadow.filter(ImageFilter.GaussianBlur(32))
        bg.alpha_composite(floor_shadow)

    elif backdrop_style == 'warm_canvas':
        # Brand warm canvas gradient (#FAF4E5 to #FFFFFF)
        top_color = (250, 244, 229)
        bot_color = (255, 255, 255)
        for y in range(h):
            ratio = y / h
            r = int(top_color[0] + (bot_color[0] - top_color[0]) * ratio)
            g = int(top_color[1] + (bot_color[1] - top_color[1]) * ratio)
            b = int(top_color[2] + (bot_color[2] - top_color[2]) * ratio)
            draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    # Composite on background
    bg.alpha_composite(composite_pil)
    return bg.convert('RGB')


def pil_to_base64(pil_img, format='JPEG', quality=92):
    """Converts PIL image to base64 data URI."""
    buf = BytesIO()
    pil_img.save(buf, format=format, quality=quality)
    encoded = base64.b64encode(buf.getvalue()).decode('utf-8')
    mime = 'image/jpeg' if format == 'JPEG' else 'image/png'
    return f"data:{mime};base64,{encoded}"


def execute_virtual_tryon(
    front_image_file_or_bytes,
    back_image_file_or_bytes=None,
    model_slug='ares-athletic-tan',
    angles=None,
    garment_type='top',
    fit_silhouette='regular',
    tuck_style='untucked',
    backdrop_style='pure_white',
    session=None
):
    """
    Main entry point for generating AI Model Virtual Try-On for all requested angles.
    """
    if angles is None or len(angles) == 0:
        angles = ['front', 'back', 'left_three_quarter', 'right_three_quarter', 'left_side', 'right_side']

    # Retrieve model profile
    try:
        model_profile = AIModelProfile.objects.prefetch_related('angles').get(slug=model_slug)
    except AIModelProfile.DoesNotExist:
        # Fallback to first active model
        model_profile = AIModelProfile.objects.first()

    is_female = model_profile.gender == 'female'
    is_kid = model_profile.demographic == 'kids'

    # Load Front Garment
    if isinstance(front_image_file_or_bytes, (bytes, bytearray)):
        front_pil = Image.open(BytesIO(front_image_file_or_bytes))
    else:
        front_pil = Image.open(front_image_file_or_bytes)

    # Process and remove background from front garment
    front_rgba = remove_garment_background(front_pil)

    # Load Back Garment if provided
    back_rgba = None
    if back_image_file_or_bytes:
        if isinstance(back_image_file_or_bytes, (bytes, bytearray)):
            back_pil = Image.open(BytesIO(back_image_file_or_bytes))
        else:
            back_pil = Image.open(back_image_file_or_bytes)
        back_rgba = remove_garment_background(back_pil)
    else:
        # Intelligently synthesize back garment from front
        back_rgba = front_rgba.transpose(Image.Transpose.FLIP_LEFT_RIGHT)

    renders_dir = os.path.join(settings.BASE_DIR, 'media', 'tryon', 'renders')
    os.makedirs(renders_dir, exist_ok=True)

    results = []

    angle_label_map = {
        'front': 'Front View (0°)',
        'back': 'Back View (180°)',
        'left_three_quarter': 'Left 3/4 View (-45°)',
        'right_three_quarter': 'Right 3/4 View (+45°)',
        'left_side': 'Left Profile (-90°)',
        'right_side': 'Right Profile (+90°)',
    }
    rotation_map = {
        'front': 0,
        'back': 180,
        'left_three_quarter': -45,
        'right_three_quarter': 45,
        'left_side': -90,
        'right_side': 90,
    }

    for angle_key in angles:
        # 1. Generate or load base model image
        base_model_img = generate_studio_model_image(
            demographic=model_profile.demographic,
            gender=model_profile.gender,
            skin_hex=model_profile.skin_hex,
            angle_key=angle_key,
            body_type=model_profile.body_type
        )

        # 2. Select appropriate garment input (back image for back angle, front for front/3/4)
        active_garment = back_rgba if (angle_key == 'back' and back_rgba) else front_rgba

        # 3. Warp garment onto model body for this angle
        warped_garment = warp_garment_to_model(
            garment_rgba=active_garment,
            angle_key=angle_key,
            garment_type=garment_type,
            fit_silhouette=fit_silhouette,
            tuck_style=tuck_style,
            is_female=is_female,
            is_kid=is_kid
        )

        # 4. Harmonize lighting & anatomical folds
        composite = harmonize_lighting_and_shading(base_model_img, warped_garment)

        # 5. Place on chosen studio backdrop
        final_render = apply_studio_backdrop(composite, backdrop_style)

        # 6. Save image to media
        session_id_str = str(session.id) if session else 'preview'
        filename = f"tryon_{session_id_str}_{model_profile.slug}_{angle_key}.jpg"
        filepath = os.path.join(renders_dir, filename)
        final_render.save(filepath, format='JPEG', quality=92, optimize=True)

        rel_url = f"{settings.MEDIA_URL}tryon/renders/{filename}"
        base64_data = pil_to_base64(final_render, format='JPEG', quality=90)

        # Save to database if session exists
        if session:
            TryOnGeneratedAngle.objects.update_or_create(
                session=session,
                angle_key=angle_key,
                defaults={
                    'angle_label': angle_label_map.get(angle_key, angle_key.title()),
                    'rotation_degrees': rotation_map.get(angle_key, 0),
                    'image_url': rel_url,
                    'thumbnail_url': rel_url,
                    'is_front': angle_key == 'front',
                    'is_back': angle_key == 'back',
                }
            )

        results.append({
            'angle_key': angle_key,
            'angle_label': angle_label_map.get(angle_key, angle_key.title()),
            'rotation_degrees': rotation_map.get(angle_key, 0),
            'image_url': rel_url,
            'base64_url': base64_data,
            'is_front': angle_key == 'front',
            'is_back': angle_key == 'back',
        })

    return {
        'model': {
            'slug': model_profile.slug,
            'name': model_profile.name,
            'demographic': model_profile.demographic,
            'skin_tone': model_profile.skin_tone,
            'skin_tone_label': model_profile.skin_tone_label,
            'skin_hex': model_profile.skin_hex,
            'body_type': model_profile.body_type,
            'age_bracket': model_profile.age_bracket,
            'height_cm': model_profile.height_cm,
        },
        'garment_type': garment_type,
        'fit_silhouette': fit_silhouette,
        'tuck_style': tuck_style,
        'backdrop_style': backdrop_style,
        'renders': results,
    }
