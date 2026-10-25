import re
from ..models import AIModelProfile


def analyze_garment_and_demographic(
    category_name='',
    product_name='',
    sizes=None,
    description='',
    user_demographic=None,
    user_garment_type=None,
    user_fit_silhouette=None
):
    """
    Intelligently analyzes garment category (topwear vs bottomwear), demographic / age group
    (men, women, kids/boys/girls), and fit silhouette (regular, slim, relaxed, oversized/loose fit).
    Returns complete metadata and the matching default AI Model Profile.
    """
    cat_str = str(category_name or '').strip().lower()
    name_str = str(product_name or '').strip().lower()
    desc_str = str(description or '').strip().lower()
    full_text = f"{cat_str} {name_str} {desc_str}"

    # -------------------------------------------------------------
    # 1. Garment Type Analysis (Topwear vs Bottomwear)
    # -------------------------------------------------------------
    if user_garment_type in ['top', 'bottom']:
        garment_type = user_garment_type
    else:
        bottomwear_keywords = [
            'pant', 'pants', 'trouser', 'trousers', 'jeans', 'denim',
            'short', 'shorts', 'cargo', 'cargos', 'jogger', 'joggers',
            'legging', 'leggings', 'skirt', 'skirts', 'boxer', 'pyjama',
            'pajama', 'trackpant', 'track pant', 'sweatpant', 'sweatpants'
        ]
        topwear_keywords = [
            'shirt', 't-shirt', 'tshirt', 'tee', 'top', 'tops', 'polo',
            'kurta', 'kurti', 'blazer', 'jacket', 'hoodie', 'sweater',
            'sweatshirt', 'coat', 'vest', 'tank', 'tunic', 'cardigan'
        ]

        # Check for bottomwear
        if any(re.search(r'\b' + re.escape(kw) + r'\b', full_text) for kw in bottomwear_keywords):
            garment_type = 'bottom'
        else:
            # Default to topwear for apparel catalog
            garment_type = 'top'

    garment_type_label = 'Topwear' if garment_type == 'top' else 'Bottomwear'

    # -------------------------------------------------------------
    # 2. Demographic & Age Group Analysis (Kids / Boy / Girl vs Women vs Men)
    # -------------------------------------------------------------
    if user_demographic in ['men', 'women', 'kids']:
        demographic = user_demographic
    else:
        # Check sizes for kids / age indicators (e.g. 6Y, 8Y, 10, 12, 10Y, 12Y, 8-10, etc.)
        sizes_list = []
        if sizes:
            if isinstance(sizes, str):
                sizes_list = [s.strip() for s in sizes.split(',') if s.strip()]
            elif isinstance(sizes, (list, tuple)):
                sizes_list = [str(s).strip() for s in sizes if str(s).strip()]

        kids_size_pattern = re.compile(
            r'^(?:[2-9]|1[0-6])\s*(?:y|yr|yrs|years)?$|^(?:[2-9]|1[0-6])\s*-\s*(?:[3-9]|1[0-6])$',
            re.IGNORECASE
        )
        has_kids_size = any(kids_size_pattern.match(s) for s in sizes_list)

        kids_keywords = [
            'kid', 'kids', 'boy', 'boys', 'girl', 'girls', 'child',
            'children', 'junior', 'toddler', 'infant', 'baby', 'teen',
            '8-10', '10-12', '12-14', '14-16', '12 year', '10 year', '12 yr'
        ]
        has_kids_keyword = any(re.search(r'\b' + re.escape(kw) + r'\b', full_text) for kw in kids_keywords)

        if has_kids_size or has_kids_keyword:
            demographic = 'kids'
        else:
            women_keywords = [
                'women', 'woman', 'womens', 'ladies', 'female', 'girl', 'girls',
                'saree', 'sari', 'kurti', 'lehenga', 'dress', 'blouse', 'bra',
                'lingerie', 'gown', 'salwar', 'dupatta'
            ]
            if any(re.search(r'\b' + re.escape(kw) + r'\b', full_text) for kw in women_keywords):
                demographic = 'women'
            else:
                demographic = 'men'

    demographic_labels = {
        'men': "Men's Apparel",
        'women': "Women's Apparel",
        'kids': "Junior / Kids Apparel"
    }
    demographic_label = demographic_labels.get(demographic, "Men's Apparel")

    # -------------------------------------------------------------
    # 3. Fit Silhouette (Regular, Slim, Relaxed, Loose/Oversized)
    # -------------------------------------------------------------
    if user_fit_silhouette in ['regular', 'slim', 'relaxed', 'oversized']:
        fit_silhouette = user_fit_silhouette
    else:
        if re.search(r'\b(?:oversized?|loose|baggy|wide)\b', full_text):
            fit_silhouette = 'oversized'
        elif re.search(r'\b(?:slim|fitted|skinny)\b', full_text):
            fit_silhouette = 'slim'
        elif re.search(r'\b(?:relaxed|comfort|easy)\b', full_text):
            fit_silhouette = 'relaxed'
        else:
            fit_silhouette = 'regular'

    fit_labels = {
        'regular': 'Regular Fit',
        'slim': 'Slim Fit',
        'relaxed': 'Relaxed Fit',
        'oversized': 'Loose / Oversized Fit'
    }
    fit_label = fit_labels.get(fit_silhouette, 'Regular Fit')

    # -------------------------------------------------------------
    # 4. Resolve Matching Default AI Model Profile from Database
    # -------------------------------------------------------------
    try:
        model = AIModelProfile.objects.filter(demographic=demographic, is_default=True).first()
        if not model:
            model = AIModelProfile.objects.filter(demographic=demographic).first()
        if not model:
            model = AIModelProfile.objects.first()
    except Exception:
        model = None

    fallback_slugs = {
        'men': 'ares-athletic-tan',
        'women': 'sienna-fit-olive',
        'kids': 'kai-boy-tan'
    }

    model_slug = model.slug if model else fallback_slugs.get(demographic, 'ares-athletic-tan')
    model_name = model.name if model else ('Ares - Athletic Male' if demographic == 'men' else ('Sienna - Athletic Fit Female' if demographic == 'women' else 'Kai - Junior Boy (8-10 yrs)'))
    preview_url = model.preview_image_url if model else f"/media/intelligence/models/{model_slug}_front.png"
    skin_hex = model.skin_hex if model else '#C68B59'

    return {
        'garment_type': garment_type,
        'garment_type_label': garment_type_label,
        'demographic': demographic,
        'demographic_label': demographic_label,
        'fit_silhouette': fit_silhouette,
        'fit_label': fit_label,
        'model': {
            'slug': model_slug,
            'name': model_name,
            'demographic': demographic,
            'preview_image_url': preview_url,
            'skin_hex': skin_hex,
            'body_type': getattr(model, 'body_type', 'athletic'),
            'age_bracket': getattr(model, 'age_bracket', 'Adult'),
        }
    }
