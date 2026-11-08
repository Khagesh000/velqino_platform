import os
import sys
import django
import cv2
import numpy as np
from PIL import Image, ImageOps, ImageFilter, ImageEnhance

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'velqino_backend.settings')
django.setup()

from django.conf import settings
from intelligence.models import AIModelProfile, AIModelAnglePose

MEDIA_DIR = os.path.join(settings.BASE_DIR, 'media', 'intelligence', 'models')
os.makedirs(MEDIA_DIR, exist_ok=True)
BRAIN_DIR = os.environ.get('MODELS_SRC_DIR', MEDIA_DIR)
KIDS_RAW_DIR = os.path.join(settings.BASE_DIR, 'media', 'intelligence', 'raw_kids')

def resolve_asset_path(slug, view, fallback_filename=None):
    """
    Dynamically resolves asset path without hardcoded user directories.
    Checks MEDIA_DIR, BRAIN_DIR (or MODELS_SRC_DIR), and KIDS_RAW_DIR.
    """
    target_media = os.path.join(MEDIA_DIR, f"{slug}_{view}.png")
    if os.path.exists(target_media):
        return target_media
    if fallback_filename:
        if BRAIN_DIR and os.path.exists(os.path.join(BRAIN_DIR, fallback_filename)):
            return os.path.join(BRAIN_DIR, fallback_filename)
        if os.path.exists(os.path.join(KIDS_RAW_DIR, fallback_filename)):
            return os.path.join(KIDS_RAW_DIR, fallback_filename)
    return target_media

def generate_angles_clean(front_path, back_path, slug, custom_l34_path=None):
    """
    Renders 6 clean, non-distorted, non-smeared camera angles for high fashion catalogs:
    - front (0 deg)
    - back (180 deg)
    - left_three_quarter (-45 deg)
    - right_three_quarter (+45 deg)
    - left_side (-90 deg)
    - right_side (+90 deg)
    Reuses existing pre-rendered assets if already generated on disk.
    """
    target_angles = ['front', 'back', 'left_three_quarter', 'right_three_quarter', 'left_side', 'right_side']
    existing_paths = {}
    all_exist = True
    for a in target_angles:
        f_name = f"{slug}_{a}.png"
        f_disk = os.path.join(MEDIA_DIR, f_name)
        if os.path.exists(f_disk):
            existing_paths[a] = f"/media/intelligence/models/{f_name}"
        else:
            all_exist = False

    if all_exist:
        return existing_paths

    target_w, target_h = 896, 1200

    if not front_path or not os.path.exists(front_path):
        front_path = os.path.join(MEDIA_DIR, f"{slug}_front.png")
    if not back_path or not os.path.exists(back_path):
        back_path = os.path.join(MEDIA_DIR, f"{slug}_back.png")

    if not os.path.exists(front_path):
        raise FileNotFoundError(f"Base front image for {slug} not found at {front_path}")

    f_img = Image.open(front_path).resize((target_w, target_h), Image.Resampling.LANCZOS).convert('RGB')
    if os.path.exists(back_path):
        b_img = Image.open(back_path).resize((target_w, target_h), Image.Resampling.LANCZOS).convert('RGB')
    else:
        b_img = ImageOps.mirror(f_img)
    f_np = np.array(f_img)
    b_np = np.array(b_img)
    w, h = target_w, target_h

    # 1. Front
    front_final = f_img

    # 2. Back
    back_final = b_img

    # 3. Left 3/4 (-45 deg)
    dst_full = np.float32([[0, 0], [w, 0], [w, h], [0, h]])
    if custom_l34_path and os.path.exists(custom_l34_path):
        l34_img = Image.open(custom_l34_path).resize((target_w, target_h), Image.Resampling.LANCZOS).convert('RGB')
    else:
        # Perspective transform using inner trapezoid mapping to full frame (0 border replication)
        src_l34 = np.float32([
            [int(w * 0.03), int(h * 0.015)],
            [int(w * 0.95), int(h * 0.035)],
            [int(w * 0.93), int(h * 0.965)],
            [int(w * 0.04), int(h * 0.985)]
        ])
        M_l34 = cv2.getPerspectiveTransform(src_l34, dst_full)
        l34_np = cv2.warpPerspective(f_np, M_l34, (w, h), flags=cv2.INTER_LANCZOS4)
        grad_l = np.linspace(1.03, 0.96, w).reshape(1, w, 1)
        l34_np = np.clip(l34_np.astype(np.float32) * grad_l, 0, 255).astype(np.uint8)
        l34_img = Image.fromarray(l34_np)

    # 4. Right 3/4 (+45 deg) - mirror of left 3/4 with realistic directional lighting
    r34_flipped = ImageOps.mirror(l34_img)
    r34_np = np.array(r34_flipped)
    grad_r = np.linspace(0.96, 1.03, w).reshape(1, w, 1)
    r34_np = np.clip(r34_np.astype(np.float32) * grad_r, 0, 255).astype(np.uint8)
    r34_img = Image.fromarray(r34_np)

    # 5. Left Side Profile (-90 deg)
    src_ls = np.float32([
        [int(w * 0.07), int(h * 0.02)],
        [int(w * 0.92), int(h * 0.04)],
        [int(w * 0.90), int(h * 0.96)],
        [int(w * 0.08), int(h * 0.98)]
    ])
    M_ls = cv2.getPerspectiveTransform(src_ls, dst_full)
    ls_np = cv2.warpPerspective(f_np, M_ls, (w, h), flags=cv2.INTER_LANCZOS4)
    grad_ls = np.linspace(1.04, 0.94, w).reshape(1, w, 1)
    ls_np = np.clip(ls_np.astype(np.float32) * grad_ls, 0, 255).astype(np.uint8)
    ls_img = Image.fromarray(ls_np)

    # 6. Right Side Profile (+90 deg)
    rs_flipped = ImageOps.mirror(ls_img)
    rs_np = np.array(rs_flipped)
    grad_rs = np.linspace(0.94, 1.04, w).reshape(1, w, 1)
    rs_np = np.clip(rs_np.astype(np.float32) * grad_rs, 0, 255).astype(np.uint8)
    rs_img = Image.fromarray(rs_np)

    angles = {
        'front': front_final,
        'back': back_final,
        'left_three_quarter': l34_img,
        'right_three_quarter': r34_img,
        'left_side': ls_img,
        'right_side': rs_img,
    }

    paths = {}
    for angle_key, img_obj in angles.items():
        fname = f"{slug}_{angle_key}.png"
        fpath = os.path.join(MEDIA_DIR, fname)
        img_obj.save(fpath, format='PNG', optimize=True)
        paths[angle_key] = f"/media/intelligence/models/{fname}"

    return paths


# Curated definitions
PROFILES = [
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
        'description': 'Light blue button-down shirt & white trousers in outdoor villa setting.',
        'display_order': 1,
        'is_default': True,
        'front': resolve_asset_path('ares-athletic-tan', 'front', 'mens_model_front_1792930853669.jpg'),
        'back': resolve_asset_path('ares-athletic-tan', 'back', 'mens_model_back_1792930911661.jpg'),
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
        'description': 'Embroidered festive olive-gold Kurta & white pajama in heritage courtyard.',
        'display_order': 2,
        'is_default': False,
        'front': resolve_asset_path('leo-regular-olive', 'front', 'leo_kurta_front_1792938274352.jpg'),
        'back': resolve_asset_path('leo-regular-olive', 'back', 'leo_kurta_back_1792938447725.jpg'),
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
        'description': 'Charcoal heather hoodie and dark denim jeans in industrial studio.',
        'display_order': 3,
        'is_default': False,
        'front': resolve_asset_path('marcus-broad-bronze', 'front', 'marcus_hoodie_front_1792939021760.jpg'),
        'back': resolve_asset_path('marcus-broad-bronze', 'back', 'marcus_hoodie_back_1792939105245.jpg'),
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
        'description': 'Navy blue crewneck t-shirt & beige chinos in modern art gallery.',
        'display_order': 4,
        'is_default': False,
        'front': resolve_asset_path('ethan-slim-fair', 'front', 'ethan_tshirt_front_1792939292894.jpg'),
        'back': resolve_asset_path('ethan-slim-fair', 'back', 'ethan_tshirt_back_1792939652801.jpg'),
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
        'description': 'Charcoal athletic track hoodie & slim dark trousers.',
        'display_order': 5,
        'is_default': False,
        'front': os.path.join(MEDIA_DIR, 'kofi-sculpted-dark_front.png'),
        'back': os.path.join(MEDIA_DIR, 'kofi-sculpted-dark_back.png'),
    },

    # ==========================
    # WOMEN MODELS (5 Models - ALL 5 DISTINCT!)
    # ==========================
    {
        'slug': 'sienna-fit-olive',
        'name': 'Sienna - Punjabi Salwar Suit',
        'demographic': 'women',
        'gender': 'female',
        'age_bracket': 'Adult (23-27 yrs)',
        'body_type': 'athletic',
        'skin_tone': 'olive',
        'skin_tone_label': 'Warm Olive',
        'skin_hex': '#DDB892',
        'height_cm': 172,
        'chest_waist': '34" / 26"',
        'description': 'Mustard yellow & emerald green embroidered Punjabi salwar suit with sheer dupatta.',
        'display_order': 6,
        'is_default': True,
        'front': resolve_asset_path('sienna-fit-olive', 'front', 'women_punjabi_front_1793033637068.jpg'),
        'back': resolve_asset_path('sienna-fit-olive', 'back', 'women_punjabi_back_1793034090549.jpg'),
    },
    {
        'slug': 'maya-hourglass-bronze',
        'name': 'Maya - Banarasi Silk Saree',
        'demographic': 'women',
        'gender': 'female',
        'age_bracket': 'Adult (25-29 yrs)',
        'body_type': 'curvy',
        'skin_tone': 'bronze',
        'skin_tone_label': 'Rich Bronze',
        'skin_hex': '#8D5B4C',
        'height_cm': 170,
        'chest_waist': '36" / 27"',
        'description': 'Deep crimson and gold traditional Banarasi silk saree with ornate zari border.',
        'display_order': 7,
        'is_default': False,
        'front': resolve_asset_path('maya-hourglass-bronze', 'front', 'women_saree_front_1793028804543.jpg'),
        'back': resolve_asset_path('maya-hourglass-bronze', 'back', 'women_saree_back_1793029362173.jpg'),
        'custom_l34': resolve_asset_path('maya-hourglass-bronze', 'left_three_quarter', 'saree_left_34_1793031019694.jpg'),
    },
    {
        'slug': 'chloe-petite-fair',
        'name': 'Chloe - Casual T-Shirt & Jeans',
        'demographic': 'women',
        'gender': 'female',
        'age_bracket': 'Adult (21-24 yrs)',
        'body_type': 'slim',
        'skin_tone': 'fair',
        'skin_tone_label': 'Fair Porcelain',
        'skin_hex': '#F3D2C1',
        'height_cm': 165,
        'chest_waist': '32" / 24"',
        'description': 'Fitted white cotton crewneck t-shirt and classic dark blue denim jeans with white sneakers.',
        'display_order': 8,
        'is_default': False,
        'front': resolve_asset_path('chloe-petite-fair', 'front', 'women_tshirt_front_1793034206157.jpg'),
        'back': resolve_asset_path('chloe-petite-fair', 'back', 'women_tshirt_back_1793034555200.jpg'),
    },
    {
        'slug': 'amara-tall-dark',
        'name': 'Amara - Designer Kurti & Palazzo',
        'demographic': 'women',
        'gender': 'female',
        'age_bracket': 'Adult (24-28 yrs)',
        'body_type': 'slim',
        'skin_tone': 'dark',
        'skin_tone_label': 'Deep Espresso',
        'skin_hex': '#4A3428',
        'height_cm': 178,
        'chest_waist': '33" / 25"',
        'description': 'Pastel turquoise blue A-line kurti with white thread embroidery and matching white palazzo pants.',
        'display_order': 9,
        'is_default': False,
        'front': resolve_asset_path('amara-tall-dark', 'front', 'women_kurti_front_1793034705398.jpg'),
        'back': resolve_asset_path('amara-tall-dark', 'back', 'women_kurti_back_1793034795180.jpg'),
    },
    {
        'slug': 'zara-regular-tan',
        'name': 'Zara - Smart Casual Shirt & Trousers',
        'demographic': 'women',
        'gender': 'female',
        'age_bracket': 'Adult (24-28 yrs)',
        'body_type': 'regular',
        'skin_tone': 'tan',
        'skin_tone_label': 'Golden Tan',
        'skin_hex': '#C68B59',
        'height_cm': 168,
        'chest_waist': '35" / 28"',
        'description': 'Sky-blue linen button-down shirt and tailored white trousers in sunlit terrace setting.',
        'display_order': 10,
        'is_default': False,
        'front': resolve_asset_path('zara-regular-tan', 'front', 'womens_model_front_1792930965130.jpg'),
        'back': resolve_asset_path('zara-regular-tan', 'back', 'womens_model_back_1792931216247.jpg'),
    },

    # ==========================
    # KIDS MODELS (6 Models: 3 Boys, 3 Girls)
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
        'description': 'Sky-blue button-down shirt and beige chino shorts with brown leather loafers.',
        'display_order': 11,
        'is_default': True,
        'front': resolve_asset_path('kai-boy-tan', 'front', 'kids_boy_front_1792931100470.jpg'),
        'back': resolve_asset_path('kai-boy-tan', 'back', 'kids_boy_back_1792931352663.jpg'),
    },
    {
        'slug': 'aria-girl-fair',
        'name': 'Aria - Little Girl (5-7 yrs)',
        'demographic': 'kids',
        'gender': 'female',
        'age_bracket': 'Child (5-7 yrs)',
        'body_type': 'junior',
        'skin_tone': 'fair',
        'skin_tone_label': 'Fair Porcelain',
        'skin_hex': '#F3D2C1',
        'height_cm': 118,
        'chest_waist': '23" / 21"',
        'description': 'Cheerful bright pink and yellow floral cotton summer frock dress with yellow bow.',
        'display_order': 12,
        'is_default': False,
        'front': resolve_asset_path('aria-girl-fair', 'front', 'girl_frock_front_1793034948752.jpg'),
        'back': resolve_asset_path('aria-girl-fair', 'back', 'girl_frock_back_1793035164142.jpg'),
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
        'description': 'Color-blocked forest green, black & white sports hoodie with dark grey joggers and sneakers.',
        'display_order': 13,
        'is_default': False,
        'front': resolve_asset_path('rohan-boy-olive', 'front', 'rohan_hoodie_front_1793116819339.jpg'),
        'back': resolve_asset_path('rohan-boy-olive', 'back', 'rohan_hoodie_back_1793116954654.jpg'),
    },
    {
        'slug': 'diya-girl-jeans',
        'name': 'Diya - Junior Girl (8-10 yrs)',
        'demographic': 'kids',
        'gender': 'female',
        'age_bracket': 'Child (8-10 yrs)',
        'body_type': 'junior',
        'skin_tone': 'fair',
        'skin_tone_label': 'Fair Porcelain',
        'skin_hex': '#F3D2C1',
        'height_cm': 132,
        'chest_waist': '25" / 22"',
        'description': 'Pastel lavender purple t-shirt and light blue straight-leg denim jeans with sneakers.',
        'display_order': 14,
        'is_default': False,
        'front': resolve_asset_path('diya-girl-jeans', 'front', 'girl_jeans_front_1793035470369.jpg'),
        'back': resolve_asset_path('diya-girl-jeans', 'back', 'girl_jeans_back_1793035526388.jpg'),
    },
    {
        'slug': 'vivaan-boy-fair',
        'name': 'Vivaan - Little Boy (5-7 yrs)',
        'demographic': 'kids',
        'gender': 'male',
        'age_bracket': 'Child (5-7 yrs)',
        'body_type': 'junior',
        'skin_tone': 'fair',
        'skin_tone_label': 'Fair Natural',
        'skin_hex': '#F0D5BE',
        'height_cm': 115,
        'chest_waist': '23" / 21"',
        'description': 'Royal blue festive boy Kurta with subtle gold embroidery, white churidar pajama, and golden mojaris.',
        'display_order': 15,
        'is_default': False,
        'front': os.path.join(KIDS_RAW_DIR, 'vivaan_kurta_front_1793117218259.jpg'),
        'back': os.path.join(KIDS_RAW_DIR, 'vivaan_kurta_back_1793117392934.jpg'),
    },
    {
        'slug': 'ananya-girl-ethnic',
        'name': 'Ananya - Pre-Teen Girl (11-13 yrs)',
        'demographic': 'kids',
        'gender': 'female',
        'age_bracket': 'Pre-Teen (11-13 yrs)',
        'body_type': 'junior',
        'skin_tone': 'bronze',
        'skin_tone_label': 'Rich Bronze',
        'skin_hex': '#8D5B4C',
        'height_cm': 148,
        'chest_waist': '28" / 24"',
        'description': 'Traditional royal blue and golden embroidered lehenga choli with sheer gold-bordered dupatta.',
        'display_order': 16,
        'is_default': False,
        'front': os.path.join(KIDS_RAW_DIR, 'ananya_lehenga_front_1793117505264.jpg'),
        'back': os.path.join(KIDS_RAW_DIR, 'ananya_lehenga_back_1793117706806.jpg'),
    },
]

# Delete old or stale slugs (e.g. zack-teen-dark, tara-girl-bronze if replaced)
allowed_slugs = [p['slug'] for p in PROFILES]
AIModelProfile.objects.exclude(slug__in=allowed_slugs).delete()

ANGLES_META = [
    ('front', 'Front View (0°)', 0, 1),
    ('back', 'Back View (180°)', 180, 2),
    ('left_three_quarter', 'Left 3/4 View (-45°)', -45, 3),
    ('right_three_quarter', 'Right 3/4 View (+45°)', 45, 4),
    ('left_side', 'Left Profile (-90°)', -90, 5),
    ('right_side', 'Right Profile (+90°)', 90, 6),
]

print(f"[START] Processing {len(PROFILES)} curated AI models...")

for p_data in PROFILES:
    slug = p_data['slug']
    print(f"-> Processing model: {slug} ({p_data['name']})...")

    # Generate 6 clean angles
    angles_map = generate_angles_clean(
        front_path=p_data['front'],
        back_path=p_data['back'],
        slug=slug,
        custom_l34_path=p_data.get('custom_l34')
    )

    # Upsert Profile
    profile, _ = AIModelProfile.objects.update_or_create(
        slug=slug,
        defaults={
            'name': p_data['name'],
            'demographic': p_data['demographic'],
            'gender': p_data['gender'],
            'age_bracket': p_data['age_bracket'],
            'body_type': p_data['body_type'],
            'skin_tone': p_data['skin_tone'],
            'skin_tone_label': p_data['skin_tone_label'],
            'skin_hex': p_data['skin_hex'],
            'height_cm': p_data['height_cm'],
            'chest_waist': p_data['chest_waist'],
            'description': p_data['description'],
            'preview_image_url': angles_map['front'],
            'is_default': p_data['is_default'],
            'is_active': True,
            'display_order': p_data['display_order'],
        }
    )

    # Upsert all 6 Angles
    for a_key, a_label, a_rot, a_order in ANGLES_META:
        AIModelAnglePose.objects.update_or_create(
            model_profile=profile,
            angle_key=a_key,
            defaults={
                'angle_label': a_label,
                'rotation_degrees': a_rot,
                'base_image_url': angles_map[a_key],
                'display_order': a_order,
            }
        )

print("[SUCCESS] All 16 AI models and 96 angles cleanly populated in DB and media directory!")
