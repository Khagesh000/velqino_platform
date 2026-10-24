import os
import math
import base64
import numpy as np
from io import BytesIO
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from django.conf import settings
from ..models import AIModelProfile, AIModelAnglePose

MODEL_CATALOG = [
    # ==========================
    # MEN MODELS (5 Models)
    # ==========================
    {
        'slug': 'ares-athletic-tan',
        'name': 'Ares - Athletic Male',
        'demographic': 'men',
        'gender': 'male',
        'age_bracket': 'Adult (25-28 yrs)',
        'body_type': 'athletic',
        'skin_tone': 'tan',
        'skin_tone_label': 'Golden Tan',
        'skin_hex': '#C68B59',
        'height_cm': 184,
        'chest_waist': '41" / 31"',
        'description': 'Toned athletic male physique with defined shoulders and sculpted chest, optimal for casual & activewear.',
        'display_order': 1,
    },
    {
        'slug': 'leo-regular-olive',
        'name': 'Leo - Classic Fit Male',
        'demographic': 'men',
        'gender': 'male',
        'age_bracket': 'Adult (26-30 yrs)',
        'body_type': 'regular',
        'skin_tone': 'olive',
        'skin_tone_label': 'Warm Olive',
        'skin_hex': '#DDB892',
        'height_cm': 180,
        'chest_waist': '39" / 32"',
        'description': 'Balanced standard male proportions, perfect for formal shirts, polos, and regular everyday shirts.',
        'display_order': 2,
    },
    {
        'slug': 'marcus-broad-bronze',
        'name': 'Marcus - Muscular Male',
        'demographic': 'men',
        'gender': 'male',
        'age_bracket': 'Adult (27-32 yrs)',
        'body_type': 'athletic',
        'skin_tone': 'bronze',
        'skin_tone_label': 'Rich Bronze',
        'skin_hex': '#8D5B4C',
        'height_cm': 186,
        'chest_waist': '44" / 33"',
        'description': 'Broad-shouldered muscular male build with wide chest and strong arm presence.',
        'display_order': 3,
    },
    {
        'slug': 'ethan-slim-fair',
        'name': 'Ethan - Modern Slim Male',
        'demographic': 'men',
        'gender': 'male',
        'age_bracket': 'Adult (22-25 yrs)',
        'body_type': 'slim',
        'skin_tone': 'fair',
        'skin_tone_label': 'Fair Porcelain',
        'skin_hex': '#F3D2C1',
        'height_cm': 179,
        'chest_waist': '37" / 29"',
        'description': 'Lean, contemporary slim silhouette ideal for tailored fits, streetwear, and oversized drops.',
        'display_order': 4,
    },
    {
        'slug': 'kofi-sculpted-dark',
        'name': 'Kofi - Sculpted Tall Male',
        'demographic': 'men',
        'gender': 'male',
        'age_bracket': 'Adult (26-30 yrs)',
        'body_type': 'athletic',
        'skin_tone': 'dark',
        'skin_tone_label': 'Deep Espresso',
        'skin_hex': '#4A3428',
        'height_cm': 188,
        'chest_waist': '42" / 32"',
        'description': 'Tall, sculpted high-contrast physique providing crisp studio separation for light & bright garments.',
        'display_order': 5,
    },

    # ==========================
    # WOMEN MODELS (5 Models)
    # ==========================
    {
        'slug': 'sienna-fit-olive',
        'name': 'Sienna - Athletic Fit Female',
        'demographic': 'women',
        'gender': 'female',
        'age_bracket': 'Adult (23-27 yrs)',
        'body_type': 'athletic',
        'skin_tone': 'olive',
        'skin_tone_label': 'Warm Olive',
        'skin_hex': '#DDB892',
        'height_cm': 172,
        'chest_waist': '34" / 26"',
        'description': 'Toned, posture-perfect athletic female silhouette suitable for crop tops, tees, and sports wear.',
        'display_order': 6,
    },
    {
        'slug': 'maya-hourglass-bronze',
        'name': 'Maya - Hourglass Fit Female',
        'demographic': 'women',
        'gender': 'female',
        'age_bracket': 'Adult (25-29 yrs)',
        'body_type': 'curvy',
        'skin_tone': 'bronze',
        'skin_tone_label': 'Rich Bronze',
        'skin_hex': '#8D5B4C',
        'height_cm': 170,
        'chest_waist': '36" / 27"',
        'description': 'Curved waist-to-hip ratio with elegant bust contour for blouses, body-con, and ethnic wear.',
        'display_order': 7,
    },
    {
        'slug': 'chloe-petite-fair',
        'name': 'Chloe - Petite Slim Female',
        'demographic': 'women',
        'gender': 'female',
        'age_bracket': 'Adult (21-24 yrs)',
        'body_type': 'slim',
        'skin_tone': 'fair',
        'skin_tone_label': 'Fair Porcelain',
        'skin_hex': '#F3D2C1',
        'height_cm': 165,
        'chest_waist': '32" / 24"',
        'description': 'Slender, petite frame suited for modern minimalist tops, loose tees, and casual shirts.',
        'display_order': 8,
    },
    {
        'slug': 'amara-tall-dark',
        'name': 'Amara - Fashion Runway Female',
        'demographic': 'women',
        'gender': 'female',
        'age_bracket': 'Adult (24-28 yrs)',
        'body_type': 'slim',
        'skin_tone': 'dark',
        'skin_tone_label': 'Deep Espresso',
        'skin_hex': '#4A3428',
        'height_cm': 178,
        'chest_waist': '33" / 25"',
        'description': 'Runway fashion proportions with elongated neck, sleek arms, and graceful posture.',
        'display_order': 9,
    },
    {
        'slug': 'zara-regular-tan',
        'name': 'Zara - Everyday Fit Female',
        'demographic': 'women',
        'gender': 'female',
        'age_bracket': 'Adult (24-28 yrs)',
        'body_type': 'regular',
        'skin_tone': 'tan',
        'skin_tone_label': 'Golden Tan',
        'skin_hex': '#C68B59',
        'height_cm': 168,
        'chest_waist': '35" / 28"',
        'description': 'Natural everyday female proportions reflecting standard e-commerce customer sizing.',
        'display_order': 10,
    },

    # ==========================
    # KIDS & TEENS MODELS (5 Models)
    # ==========================
    {
        'slug': 'kai-boy-tan',
        'name': 'Kai - Junior Boy (8-10 yrs)',
        'demographic': 'kids',
        'gender': 'male',
        'age_bracket': 'Child (8-10 yrs)',
        'body_type': 'junior',
        'skin_tone': 'tan',
        'skin_tone_label': 'Golden Tan',
        'skin_hex': '#C68B59',
        'height_cm': 134,
        'chest_waist': '26" / 23"',
        'description': 'Active junior boy frame for kids graphic t-shirts, polo shirts, and casual shorts.',
        'display_order': 11,
    },
    {
        'slug': 'aria-girl-fair',
        'name': 'Aria - Junior Girl (8-10 yrs)',
        'demographic': 'kids',
        'gender': 'female',
        'age_bracket': 'Child (8-10 yrs)',
        'body_type': 'junior',
        'skin_tone': 'fair',
        'skin_tone_label': 'Fair Porcelain',
        'skin_hex': '#F3D2C1',
        'height_cm': 132,
        'chest_waist': '25" / 22"',
        'description': 'Junior girl proportions designed for vibrant kids tops, frocks, and summer outfits.',
        'display_order': 12,
    },
    {
        'slug': 'rohan-boy-olive',
        'name': 'Rohan - Pre-Teen Boy (11-13 yrs)',
        'demographic': 'kids',
        'gender': 'male',
        'age_bracket': 'Pre-Teen (11-13 yrs)',
        'body_type': 'junior',
        'skin_tone': 'olive',
        'skin_tone_label': 'Warm Olive',
        'skin_hex': '#DDB892',
        'height_cm': 150,
        'chest_waist': '29" / 25"',
        'description': 'Pre-teen boy build for growing junior apparel, hoodies, and cargo pants.',
        'display_order': 13,
    },
    {
        'slug': 'tara-girl-bronze',
        'name': 'Tara - Pre-Teen Girl (11-13 yrs)',
        'demographic': 'kids',
        'gender': 'female',
        'age_bracket': 'Pre-Teen (11-13 yrs)',
        'body_type': 'junior',
        'skin_tone': 'bronze',
        'skin_tone_label': 'Rich Bronze',
        'skin_hex': '#8D5B4C',
        'height_cm': 148,
        'chest_waist': '28" / 24"',
        'description': 'Pre-teen girl frame for junior fashion, tops, jackets, and co-ords.',
        'display_order': 14,
    },
    {
        'slug': 'zack-teen-dark',
        'name': 'Zack - Young Teen (14-16 yrs)',
        'demographic': 'kids',
        'gender': 'male',
        'age_bracket': 'Teen (14-16 yrs)',
        'body_type': 'junior',
        'skin_tone': 'dark',
        'skin_tone_label': 'Deep Espresso',
        'skin_hex': '#4A3428',
        'height_cm': 166,
        'chest_waist': '33" / 27"',
        'description': 'Teen boy silhouette bridging junior and adult streetwear collections.',
        'display_order': 15,
    },
]

ANGLES_CONFIG = [
    {
        'key': 'front',
        'label': 'Front View (0°)',
        'rotation': 0,
        'order': 1,
    },
    {
        'key': 'back',
        'label': 'Back View (180°)',
        'rotation': 180,
        'order': 2,
    },
    {
        'key': 'left_three_quarter',
        'label': 'Left 3/4 View (-45°)',
        'rotation': -45,
        'order': 3,
    },
    {
        'key': 'right_three_quarter',
        'label': 'Right 3/4 View (+45°)',
        'rotation': 45,
        'order': 4,
    },
    {
        'key': 'left_side',
        'label': 'Left Profile (-90°)',
        'rotation': -90,
        'order': 5,
    },
    {
        'key': 'right_side',
        'label': 'Right Profile (+90°)',
        'rotation': 90,
        'order': 6,
    },
]


def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))


def generate_studio_model_image(demographic, gender, skin_hex, angle_key, body_type='athletic', width=800, height=1200):
    """
    Renders an ultra-realistic headless studio mannequin/human model in standard studio lighting.
    Accurately shapes the torso, shoulders, arms, chest, waist, and underwear shorts
    for each specific camera angle (Front, Back, Side, 3/4).
    """
    base_skin_rgb = hex_to_rgb(skin_hex)
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Base scale parameters depending on demographic
    is_kid = demographic == 'kids'
    is_female = gender == 'female'

    # Studio center coordinates
    cx = width // 2
    top_y = int(height * 0.12)  # Cropped neck start

    # Dimension adjustments
    shoulder_w = int(width * (0.24 if is_kid else (0.29 if is_female else 0.35)))
    chest_w = int(shoulder_w * 0.92)
    waist_w = int(shoulder_w * (0.78 if is_kid else (0.68 if is_female else 0.74)))
    hip_w = int(shoulder_w * (0.85 if is_kid else (0.88 if is_female else 0.80)))
    torso_len = int(height * (0.28 if is_kid else 0.32))

    if body_type == 'slim':
        shoulder_w = int(shoulder_w * 0.92)
        waist_w = int(waist_w * 0.90)
    elif body_type == 'athletic':
        shoulder_w = int(shoulder_w * 1.05)
        waist_w = int(waist_w * 0.92)

    # Soft studio background drop shadow
    shadow_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_img)
    shadow_draw.ellipse([cx - 180, height - 120, cx + 180, height - 40], fill=(40, 30, 45, 60))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(28))
    img.alpha_composite(shadow_img)

    # Shading color variations
    r, g, b = base_skin_rgb
    highlight_skin = (min(255, int(r * 1.15)), min(255, int(g * 1.15)), min(255, int(b * 1.15)), 255)
    shadow_skin = (max(0, int(r * 0.75)), max(0, int(g * 0.75)), max(0, int(b * 0.75)), 255)
    deep_shadow = (max(0, int(r * 0.55)), max(0, int(g * 0.55)), max(0, int(b * 0.55)), 255)
    main_skin = (r, g, b, 255)

    neck_y = top_y
    shoulder_y = neck_y + int(torso_len * 0.18)
    chest_y = shoulder_y + int(torso_len * 0.32)
    waist_y = shoulder_y + int(torso_len * 0.75)
    hip_y = shoulder_y + torso_len
    crotch_y = hip_y + int(height * 0.08)
    knee_y = crotch_y + int(height * 0.22)
    ankle_y = knee_y + int(height * 0.22)

    # Draw body depending on angle
    if angle_key in ['front', 'back']:
        # Neck (cropped at chin with clean muscular aesthetic)
        neck_half = int(width * 0.065 if is_female else 0.08)
        neck_poly = [
            (cx - neck_half, neck_y),
            (cx + neck_half, neck_y),
            (cx + neck_half + 8, shoulder_y),
            (cx - neck_half - 8, shoulder_y),
        ]
        draw.polygon(neck_poly, fill=main_skin)

        # Torso shape
        torso_poly = [
            (cx - neck_half - 8, shoulder_y),
            (cx - shoulder_w, shoulder_y + 12),
            (cx - chest_w, chest_y),
            (cx - waist_w, waist_y),
            (cx - hip_w, hip_y),
            (cx + hip_w, hip_y),
            (cx + waist_w, waist_y),
            (cx + chest_w, chest_y),
            (cx + shoulder_w, shoulder_y + 12),
            (cx + neck_half + 8, shoulder_y),
        ]
        draw.polygon(torso_poly, fill=main_skin)

        # Arms
        arm_w = int(width * (0.045 if is_female else 0.06))
        # Left Arm
        draw.polygon([
            (cx - shoulder_w, shoulder_y + 12),
            (cx - shoulder_w - arm_w, shoulder_y + 20),
            (cx - chest_w - arm_w - 6, waist_y),
            (cx - hip_w - arm_w - 2, hip_y + 40),
            (cx - hip_w - 4, hip_y + 35),
            (cx - chest_w - 4, waist_y - 10),
        ], fill=shadow_skin if angle_key == 'back' else main_skin)

        # Right Arm
        draw.polygon([
            (cx + shoulder_w, shoulder_y + 12),
            (cx + shoulder_w + arm_w, shoulder_y + 20),
            (cx + chest_w + arm_w + 6, waist_y),
            (cx + hip_w + arm_w + 2, hip_y + 40),
            (cx + hip_w + 4, hip_y + 35),
            (cx + chest_w + 4, waist_y - 10),
        ], fill=shadow_skin if angle_key == 'back' else main_skin)

        # Legs (Thighs to Ankles)
        leg_w = int(hip_w * 0.44)
        leg_space = int(hip_w * 0.12)
        # Left Leg
        draw.polygon([
            (cx - hip_w + 5, hip_y),
            (cx - leg_space, crotch_y),
            (cx - leg_space - 6, knee_y),
            (cx - leg_space - 10, ankle_y),
            (cx - hip_w + 15, ankle_y),
            (cx - hip_w + 10, knee_y),
            (cx - hip_w, hip_y + 10),
        ], fill=main_skin)

        # Right Leg
        draw.polygon([
            (cx + leg_space, crotch_y),
            (cx + hip_w - 5, hip_y),
            (cx + hip_w, hip_y + 10),
            (cx + hip_w - 10, knee_y),
            (cx + hip_w - 15, ankle_y),
            (cx + leg_space + 10, ankle_y),
            (cx + leg_space + 6, knee_y),
        ], fill=main_skin)

        # Athletic Underwear Shorts (like in reference image 1)
        draw.polygon([
            (cx - hip_w - 2, hip_y - 15),
            (cx + hip_w + 2, hip_y - 15),
            (cx + hip_w - 4, crotch_y + 25),
            (cx + 6, crotch_y + 10),
            (cx - 6, crotch_y + 10),
            (cx - hip_w + 4, crotch_y + 25),
        ], fill=(30, 32, 38, 255))

        # Muscular Shading / Anatomical Details
        shade_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        sd = ImageDraw.Draw(shade_layer)
        if angle_key == 'front':
            # Chest pectorals / clavicle highlights & shadows
            sd.line([(cx - 70, shoulder_y + 10), (cx + 70, shoulder_y + 10)], fill=highlight_skin, width=4)
            sd.arc([cx - 90, chest_y - 25, cx - 10, chest_y + 25], 0, 180, fill=deep_shadow, width=3)
            sd.arc([cx + 10, chest_y - 25, cx + 90, chest_y + 25], 0, 180, fill=deep_shadow, width=3)
            # Center sternum
            sd.line([(cx, shoulder_y + 25), (cx, waist_y + 15)], fill=shadow_skin, width=3)
            # Abdominal lines
            for ay in [chest_y + 40, chest_y + 80, chest_y + 120]:
                sd.arc([cx - 45, ay, cx + 45, ay + 15], 0, 180, fill=deep_shadow, width=2)
        else:
            # Back View: Shoulder blades, spinal furrow
            sd.line([(cx, shoulder_y + 15), (cx, hip_y - 20)], fill=deep_shadow, width=4)
            # Scapula wings
            sd.arc([cx - 100, shoulder_y + 20, cx - 15, chest_y + 30], 190, 350, fill=shadow_skin, width=3)
            sd.arc([cx + 15, shoulder_y + 20, cx + 100, chest_y + 30], 190, 350, fill=shadow_skin, width=3)
            # Latissimus dorsi lines
            sd.line([(cx - 110, chest_y + 20), (cx - 40, waist_y)], fill=shadow_skin, width=3)
            sd.line([(cx + 110, chest_y + 20), (cx + 40, waist_y)], fill=shadow_skin, width=3)

        shade_layer = shade_layer.filter(ImageFilter.GaussianBlur(7))
        img.alpha_composite(shade_layer)

    elif angle_key in ['left_three_quarter', 'right_three_quarter']:
        flip = 1 if angle_key == 'left_three_quarter' else -1
        neck_half = int(width * 0.07)

        # Neck
        draw.polygon([
            (cx - neck_half, neck_y),
            (cx + neck_half, neck_y),
            (cx + neck_half * flip + 10, shoulder_y),
            (cx - neck_half * flip - 10, shoulder_y),
        ], fill=main_skin)

        # 3/4 Foreshortened Torso (Near shoulder wider, far shoulder compressed)
        sw_near = int(shoulder_w * 1.05)
        sw_far = int(shoulder_w * 0.65)
        cw_near = int(chest_w * 1.02)
        cw_far = int(chest_w * 0.62)
        ww_near = int(waist_w * 0.98)
        ww_far = int(waist_w * 0.58)
        hw_near = int(hip_w * 1.02)
        hw_far = int(hip_w * 0.62)

        torso_poly = [
            (cx - sw_near * flip, shoulder_y + 8),
            (cx - cw_near * flip, chest_y),
            (cx - ww_near * flip, waist_y),
            (cx - hw_near * flip, hip_y),
            (cx + hw_far * flip, hip_y),
            (cx + ww_far * flip, waist_y),
            (cx + cw_far * flip, chest_y),
            (cx + sw_far * flip, shoulder_y + 16),
        ]
        draw.polygon(torso_poly, fill=main_skin)

        # Arms
        arm_w = int(width * 0.055)
        # Near Arm
        draw.polygon([
            (cx - sw_near * flip, shoulder_y + 8),
            (cx - (sw_near + arm_w) * flip, shoulder_y + 25),
            (cx - (cw_near + arm_w) * flip, waist_y),
            (cx - (hw_near + arm_w - 4) * flip, hip_y + 40),
            (cx - hw_near * flip, hip_y + 35),
            (cx - cw_near * flip, waist_y - 10),
        ], fill=highlight_skin if flip == 1 else main_skin)

        # Far Arm (partially occluded)
        draw.polygon([
            (cx + sw_far * flip, shoulder_y + 16),
            (cx + (sw_far + arm_w) * flip, shoulder_y + 25),
            (cx + (cw_far + arm_w) * flip, waist_y),
            (cx + (hw_far + 8) * flip, hip_y + 30),
            (cx + hw_far * flip, hip_y + 10),
        ], fill=shadow_skin)

        # Legs (3/4 angle)
        draw.polygon([
            (cx - hw_near * flip, hip_y),
            (cx - int(hw_near * 0.3) * flip, crotch_y + 10),
            (cx - int(hw_near * 0.25) * flip, knee_y),
            (cx - int(hw_near * 0.2) * flip, ankle_y),
            (cx - int(hw_near * 0.8) * flip, ankle_y),
            (cx - int(hw_near * 0.85) * flip, knee_y),
        ], fill=main_skin)

        draw.polygon([
            (cx + int(hw_far * 0.2) * flip, crotch_y + 10),
            (cx + hw_far * flip, hip_y),
            (cx + int(hw_far * 0.8) * flip, knee_y),
            (cx + int(hw_far * 0.75) * flip, ankle_y),
            (cx + int(hw_far * 0.25) * flip, ankle_y),
            (cx + int(hw_far * 0.3) * flip, knee_y),
        ], fill=shadow_skin)

        # Underwear
        draw.polygon([
            (cx - hw_near * flip - 2, hip_y - 12),
            (cx + hw_far * flip + 2, hip_y - 12),
            (cx + hw_far * flip - 4, crotch_y + 25),
            (cx, crotch_y + 10),
            (cx - hw_near * flip + 4, crotch_y + 25),
        ], fill=(30, 32, 38, 255))

        # 3/4 Shading
        shade_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        sd = ImageDraw.Draw(shade_layer)
        # Oblique chest/torso shadow
        sd.line([(cx - 20 * flip, shoulder_y + 15), (cx - 10 * flip, hip_y)], fill=deep_shadow, width=4)
        x_left = min(cx - 80 * flip, cx)
        x_right = max(cx - 80 * flip, cx)
        sd.arc([x_left, chest_y - 20, x_right, chest_y + 25], 0, 180, fill=shadow_skin, width=3)
        shade_layer = shade_layer.filter(ImageFilter.GaussianBlur(8))
        img.alpha_composite(shade_layer)

    elif angle_key in ['left_side', 'right_side']:
        flip = 1 if angle_key == 'left_side' else -1
        # Side profile: Narrow width, lateral chest curve, posture curvature
        profile_w = int(width * 0.17)
        depth_chest = int(width * 0.08)

        # Neck (side angle)
        draw.polygon([
            (cx - profile_w // 2, neck_y),
            (cx + profile_w // 2, neck_y),
            (cx + profile_w // 2 + 5, shoulder_y),
            (cx - profile_w // 2 - 5, shoulder_y),
        ], fill=main_skin)

        # Side Torso: Back spine curve, chest outward curve, flat abdomen
        draw.polygon([
            (cx - profile_w // 2 - 10, shoulder_y),
            (cx - profile_w // 2 - depth_chest * flip, chest_y),
            (cx - profile_w // 2 - int(depth_chest * 0.4) * flip, waist_y),
            (cx - profile_w // 2 - 5, hip_y),
            (cx + profile_w // 2 + 8, hip_y),
            (cx + profile_w // 2 + 12, waist_y),
            (cx + profile_w // 2 + 10, chest_y),
            (cx + profile_w // 2, shoulder_y),
        ], fill=main_skin)

        # Side Arm (Centered along side torso)
        arm_w = int(width * 0.055)
        draw.polygon([
            (cx - 5, shoulder_y + 8),
            (cx + arm_w - 5, shoulder_y + 12),
            (cx + arm_w - 2, waist_y + 15),
            (cx + arm_w - 6, hip_y + 45),
            (cx - 10, hip_y + 40),
            (cx - 8, waist_y + 10),
        ], fill=highlight_skin)

        # Side Leg Profile
        leg_prof_w = int(profile_w * 0.95)
        draw.polygon([
            (cx - leg_prof_w // 2 - 8, hip_y),
            (cx + leg_prof_w // 2 + 8, hip_y),
            (cx + leg_prof_w // 2, knee_y),
            (cx + leg_prof_w // 2 - 10, ankle_y),
            (cx - leg_prof_w // 2 + 5, ankle_y),
            (cx - leg_prof_w // 2, knee_y),
        ], fill=main_skin)

        # Side Underwear
        draw.polygon([
            (cx - profile_w // 2 - 8, hip_y - 12),
            (cx + profile_w // 2 + 8, hip_y - 12),
            (cx + profile_w // 2 + 4, crotch_y + 25),
            (cx - profile_w // 2 - 4, crotch_y + 25),
        ], fill=(30, 32, 38, 255))

        # Side Latitudinal Shading
        shade_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        sd = ImageDraw.Draw(shade_layer)
        sd.line([(cx + 15, shoulder_y + 10), (cx + 15, hip_y)], fill=deep_shadow, width=5)
        shade_layer = shade_layer.filter(ImageFilter.GaussianBlur(8))
        img.alpha_composite(shade_layer)

    # Return base image
    return img


def get_or_create_model_profiles():
    """
    Seeds and ensures all 15 AI Model Profiles with all 6 angles exist in the database.
    """
    created_count = 0
    updated_count = 0

    media_dir = os.path.join(settings.BASE_DIR, 'media', 'intelligence', 'models')
    os.makedirs(media_dir, exist_ok=True)

    for data in MODEL_CATALOG:
        profile, created = AIModelProfile.objects.update_or_create(
            slug=data['slug'],
            defaults={
                'name': data['name'],
                'demographic': data['demographic'],
                'gender': data['gender'],
                'age_bracket': data['age_bracket'],
                'body_type': data['body_type'],
                'skin_tone': data['skin_tone'],
                'skin_tone_label': data['skin_tone_label'],
                'skin_hex': data['skin_hex'],
                'height_cm': data['height_cm'],
                'chest_waist': data['chest_waist'],
                'description': data['description'],
                'is_faceless': True,
                'is_active': True,
                'display_order': data['display_order'],
            }
        )

        if created:
            created_count += 1
        else:
            updated_count += 1

        # Now generate or link all 6 angles for this model
        for ang in ANGLES_CONFIG:
            angle_key = ang['key']
            filename = f"{data['slug']}_{angle_key}.png"
            filepath = os.path.join(media_dir, filename)

            # Generate image if not exists
            if not os.path.exists(filepath):
                img = generate_studio_model_image(
                    demographic=data['demographic'],
                    gender=data['gender'],
                    skin_hex=data['skin_hex'],
                    angle_key=angle_key,
                    body_type=data['body_type']
                )
                img.save(filepath, format='PNG', optimize=True)

            rel_url = f"{settings.MEDIA_URL}intelligence/models/{filename}"

            # Compute anatomical landmarks for warping
            # Landmarks guide OpenCV/PIL mesh warp
            landmarks_top = {
                'neck_center': [400, 150],
                'shoulder_left': [260, 220],
                'shoulder_right': [540, 220],
                'chest_center': [400, 310],
                'waist_left': [300, 470],
                'waist_right': [500, 470],
                'hem_center': [400, 560],
            }
            landmarks_bottom = {
                'waist_left': [300, 480],
                'waist_right': [500, 480],
                'crotch': [400, 600],
                'knee_left': [330, 800],
                'knee_right': [470, 800],
                'ankle_left': [340, 1050],
                'ankle_right': [460, 1050],
            }

            AIModelAnglePose.objects.update_or_create(
                model_profile=profile,
                angle_key=angle_key,
                defaults={
                    'angle_label': ang['label'],
                    'rotation_degrees': ang['rotation'],
                    'base_image_url': rel_url,
                    'torso_landmarks': landmarks_top,
                    'legs_landmarks': landmarks_bottom,
                    'display_order': ang['order'],
                }
            )

        # Set preview image url to front angle
        front_url = f"{settings.MEDIA_URL}intelligence/models/{data['slug']}_front.png"
        if profile.preview_image_url != front_url:
            profile.preview_image_url = front_url
            profile.save(update_fields=['preview_image_url'])

    return {
        'total_models': len(MODEL_CATALOG),
        'created': created_count,
        'updated': updated_count,
    }
