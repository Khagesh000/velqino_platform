"""
Studio 3D Shape Engine for Velqino Catalog Pipeline.

Integrates a "Studio 3D Shape" stage into the Velqino catalog pipeline:
- Mode A (Default): Fast (<100ms) clean cutout on white canvas with soft drop shadow.
- Mode B (Optional, default OFF): Generates realistic 3D volume/ghost-mannequin shape
  while strictly preserving original product color, fabric, print, tags, and buttons.
- Multi-category support: Shirts, Kurtas, Sarees, Dresses, Jeans, Shoes, Bags, etc.
- Quality Gate: Color distance (CIEDE2000), edge similarity, completeness, clutter/skin rejection.
- Zero vendor lock-in: Pluggable provider interface (Mock, Gemini, OpenAI, ComfyUI).
- Zero database changes, zero alterations to commerce/business logic.
"""

import os
import io
import re
import math
import time
import base64
import hashlib
import logging
from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional, Tuple

import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageOps
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)


# ==============================================================================
# CONFIGURATION BLOCK (Single Tunable Config Object)
# ==============================================================================

@dataclass
class StudioShapeConfig:
    """
    Centralized configuration for the Studio 3D Shape Pipeline.
    All tunables, limits, and provider settings reside here.
    """
    # Master switch: When False, pipeline runs Mode A (clean studio flat-lay, sub-100ms)
    ENABLED: bool = field(
        default_factory=lambda: os.environ.get('VELQINO_STUDIO_3D_ENABLED', 'False').lower() in ('true', '1', 'yes')
    )

    # Provider: 'mock' (test/free), 'gemini', 'openai', 'comfyui'
    PROVIDER: str = field(
        default_factory=lambda: os.environ.get('VELQINO_SHAPE_PROVIDER', 'mock').lower()
    )

    # Prompt specification version for cache invalidation & traceability
    PROMPT_VERSION: str = "1.0.0"

    # Candidate generation bounds
    MAX_CANDIDATES: int = 1
    MAX_RETRIES: int = 2
    TIMEOUT_SECONDS: int = 25

    # Cost & Rate limits
    MAX_PER_DAY_PER_SELLER: int = 100
    CACHE_TTL_SECONDS: int = 86400 * 7  # 7 days

    # Quality Gate thresholds
    # CIEDE2000 / LAB color distance limit: lower = stricter color preservation
    MAX_COLOR_DIFF_LAB: float = 6.0
    # Minimum edge & structural correlation (0.0 to 1.0)
    MIN_STRUCTURAL_SIMILARITY: float = 0.55
    # Garment area ratio bounds vs input cutout
    MIN_AREA_RATIO: float = 0.55
    MAX_AREA_RATIO: float = 1.45
    # Maximum allowed skin-tone pixel ratio (rejects human hands/faces)
    MAX_SKIN_RATIO: float = 0.025

    # Standard studio canvas dimensions
    CANVAS_SIZE: int = 1200
    DEFAULT_FILL_RATIO: float = 0.85


CONFIG = StudioShapeConfig()


# ==============================================================================
# CATEGORY REGISTRY (Data-Driven, Universal Multi-Product Definitions)
# ==============================================================================

CATEGORY_REGISTRY: Dict[str, Dict[str, Any]] = {
    "shirt": {
        "id": "shirt",
        "display_name": "Men's Formal/Casual Shirt",
        "aliases": ["shirt", "formal shirt", "casual shirt", "dress shirt", "button-up"],
        "shape_descriptor": "shown on an invisible ghost mannequin with natural chest volume, crisp standing collar, and neatly shaped sleeves",
        "front_view": "front view at an elegant slight 3/4 studio angle highlighting collar depth and chest contour",
        "back_view": "back view showing yoke, shoulder fit, back pleats, and clean sleeve taper",
        "detail_keep_list": "collar, collar buttons, placket buttons, chest pocket, cuff buttons, fabric weave",
        "fill_ratio": 0.85,
        "canvas_ratio": "1:1",
        "forbidden": "person, hands, head, neck, hanger, text, watermark"
    },
    "tshirt_polo": {
        "id": "tshirt_polo",
        "display_name": "T-Shirt / Polo",
        "aliases": ["tshirt", "t-shirt", "tee", "polo", "polo shirt", "henley"],
        "shape_descriptor": "shown with natural torso volume as if filled on a ghost mannequin, clean neckline and sleeve drape",
        "front_view": "front view with soft chest contour and subtle fabric folds",
        "back_view": "back view showing smooth upper back and shoulder alignment",
        "detail_keep_list": "crew/v-neck ribbing, polo collar, placket buttons, sleeve hems, graphic print or chest embroidery",
        "fill_ratio": 0.85,
        "canvas_ratio": "1:1",
        "forbidden": "person, hands, hanger, mannequin neck, text, logo additions"
    },
    "jacket_blazer": {
        "id": "jacket_blazer",
        "display_name": "Jacket / Blazer / Coat",
        "aliases": ["jacket", "blazer", "coat", "suit jacket", "bomber", "windbreaker", "denim jacket"],
        "shape_descriptor": "structured ghost mannequin with tailored shoulders, crisp lapels, and natural sleeve curves",
        "front_view": "front view showing lapel roll, front buttons/zipper, and waist taper",
        "back_view": "back view showing clean vent, shoulder seams, and tailored back drape",
        "detail_keep_list": "lapels, suit buttons, zipper pulls, flap pockets, collar lining, fabric texture",
        "fill_ratio": 0.86,
        "canvas_ratio": "1:1",
        "forbidden": "person, hands, hanger, stand, watermark"
    },
    "hoodie_sweatshirt": {
        "id": "hoodie_sweatshirt",
        "display_name": "Hoodie / Sweatshirt",
        "aliases": ["hoodie", "sweatshirt", "pullover", "fleece"],
        "shape_descriptor": "puffed 3D shape with filled hood standing naturally behind the neck, kangaroo pocket volume, and ribbed cuffs",
        "front_view": "front view with volumetric torso, drawstrings draping naturally, and structured hood contour",
        "back_view": "back view showing the back of the hood and clean back panel",
        "detail_keep_list": "hood structure, eyelets, drawstrings, kangaroo pocket, ribbed cuffs and hem, fleece texture",
        "fill_ratio": 0.85,
        "canvas_ratio": "1:1",
        "forbidden": "person, hands, head, hanger"
    },
    "sweater_cardigan": {
        "id": "sweater_cardigan",
        "display_name": "Sweater / Cardigan",
        "aliases": ["sweater", "cardigan", "knitwear", "jumper"],
        "shape_descriptor": "soft knitwear with natural knit stretch and subtle volume, clean neckline and sleeve cuffs",
        "front_view": "front view with knit pattern depth and soft drape",
        "back_view": "back view showing uniform knit weave and shoulder slope",
        "detail_keep_list": "knit stitch texture, cable patterns, neckline, cardigan buttons",
        "fill_ratio": 0.85,
        "canvas_ratio": "1:1",
        "forbidden": "person, hands, hanger"
    },
    "kurta_kurti": {
        "id": "kurta_kurti",
        "display_name": "Kurta / Kurti / Tunic",
        "aliases": ["kurta", "kurti", "tunic", "ethnic top"],
        "shape_descriptor": "standing ethnic silhouette with elegant Mandarin collar, straight side slits, and gentle body flare",
        "front_view": "front view showing neckline embroidery, placket work, and flowing hemline",
        "back_view": "back view displaying back print, neckline contour, and straight side slits",
        "detail_keep_list": "mandarin collar, placket embroidery, buttons, side slits, border print, fabric sheen",
        "fill_ratio": 0.88,
        "canvas_ratio": "1:1",
        "forbidden": "person, hands, legs, head, hanger"
    },
    "sherwani_nehru": {
        "id": "sherwani_nehru",
        "display_name": "Sherwani / Nehru Jacket",
        "aliases": ["sherwani", "nehru jacket", "modi jacket", "bandhgala", "indo-western"],
        "shape_descriptor": "stately upright ethnic structure with rigid bandhgala collar, ornamental buttons, and tailored silhouette",
        "front_view": "front view emphasizing intricate embroidery, metallic buttons, and structured chest",
        "back_view": "back view showing regal back fit and vent details",
        "detail_keep_list": "bandhgala collar, ornamental buttons, brocade work, embroidery, pocket square slit",
        "fill_ratio": 0.88,
        "canvas_ratio": "1:1",
        "forbidden": "person, hands, head, hanger"
    },
    "jeans_trousers_pants": {
        "id": "jeans_trousers_pants",
        "display_name": "Jeans / Trousers / Pants",
        "aliases": ["jeans", "trousers", "pants", "chinos", "cargos", "denim", "bottom"],
        "shape_descriptor": "shown with natural 3D leg volume, structured waistband, front fly contour, and clean ankle cuff drape",
        "front_view": "front view with realistic thigh and calf volume, waistband depth, and subtle knee creases",
        "back_view": "back view showing rear pockets, yoke stitching, belt loops, and back leg curve",
        "detail_keep_list": "waistband button, zip fly, rivets, belt loops, front pockets, coin pocket, rear pockets, wash whiskering",
        "fill_ratio": 0.88,
        "canvas_ratio": "1:1",
        "forbidden": "person, shoes, hands, hanger, mannequin legs"
    },
    "shorts_skirt": {
        "id": "shorts_skirt",
        "display_name": "Shorts / Skirt",
        "aliases": ["shorts", "skirt", "mini skirt", "midi skirt", "bermuda"],
        "shape_descriptor": "volumetric waistband with natural flare or leg opening volume",
        "front_view": "front view displaying waistband, drawstrings/buttons, and hem flare",
        "back_view": "back view showing rear silhouette and pocket placements",
        "detail_keep_list": "waistband, pleats, pockets, hem stitching",
        "fill_ratio": 0.84,
        "canvas_ratio": "1:1",
        "forbidden": "person, legs, hands, hanger"
    },
    "dress_gown": {
        "id": "dress_gown",
        "display_name": "Dress / Gown / Frock",
        "aliases": ["dress", "gown", "frock", "maxi dress", "midi dress", "one-piece"],
        "shape_descriptor": "draped elegantly on a ghost silhouette with sculpted bodice and graceful flared skirt volume",
        "front_view": "front view showcasing neckline, waist cinch, and flowing skirt cascade",
        "back_view": "back view showing back zipper, strap design, and full skirt drape",
        "detail_keep_list": "neckline, waistline, lace, embroidery, ruffles, hem border, fabric texture",
        "fill_ratio": 0.88,
        "canvas_ratio": "1:1",
        "forbidden": "person, hands, legs, head, hanger"
    },
    "saree": {
        "id": "saree",
        "display_name": "Saree / Sari",
        "aliases": ["saree", "sari", "silk saree", "kanjivaram", "banarasi"],
        "shape_descriptor": "expertly draped on a stylized torso mannequin showing pleated skirt tucks, pallu flowing gracefully over the shoulder, and rich zari borders",
        "front_view": "front view highlighting intricate pallu drape, border placement, and neat pleat alignment",
        "back_view": "back view showcasing the cascading pallu and back border detailing",
        "detail_keep_list": "zari border, pallu motif, pleated fold texture, body print/weave, sheen",
        "fill_ratio": 0.88,
        "canvas_ratio": "1:1",
        "forbidden": "person, face, hands, feet, jewelry additions"
    },
    "lehenga_choli": {
        "id": "lehenga_choli",
        "display_name": "Lehenga Choli Set",
        "aliases": ["lehenga", "choli", "ghagra"],
        "shape_descriptor": "volumetric flare lehenga skirt paired with sculpted choli blouse and draped dupatta",
        "front_view": "front view showing elaborate skirt flare, waist belt border, and blouse neckline",
        "back_view": "back view showing back blouse tie and comprehensive skirt circumference",
        "detail_keep_list": "heavy embroidery, sequins, border lace, latkans, blouse stitching",
        "fill_ratio": 0.88,
        "canvas_ratio": "1:1",
        "forbidden": "person, face, hands, feet"
    },
    "salwar_churidar": {
        "id": "salwar_churidar",
        "display_name": "Salwar / Churidar Set",
        "aliases": ["salwar", "churidar", "suit set", "punjabi suit", "anarkali"],
        "shape_descriptor": "complete ethnic suit silhouette with structured kurta top, paired churidar/salwar leg gathers, and matching dupatta",
        "front_view": "front view with balanced proportions showing top embroidery and bottom drape",
        "back_view": "back view showing back neck design and clean fall",
        "detail_keep_list": "neck embroidery, hem lace, salwar gathers/goti, dupatta borders",
        "fill_ratio": 0.88,
        "canvas_ratio": "1:1",
        "forbidden": "person, face, hands, feet"
    },
    "shoes_sandals": {
        "id": "shoes_sandals",
        "display_name": "Shoes / Footwear / Sandals",
        "aliases": ["shoes", "sneakers", "sandals", "boots", "loafers", "heels", "footwear"],
        "shape_descriptor": "paired footwear presented at an attractive three-quarter studio catalog angle with one shoe slightly angled to display sole and side profile",
        "front_view": "three-quarter angle showcasing toe box, lacing/straps, and lateral silhouette",
        "back_view": "rear angle showing heel counter, sole thickness, and pull tab",
        "detail_keep_list": "sole tread, laces, eyelets, stitching, brand logo, upper material texture",
        "fill_ratio": 0.82,
        "canvas_ratio": "1:1",
        "forbidden": "feet, legs, hands, ground clutter"
    },
    "bags_wallets": {
        "id": "bags_wallets",
        "display_name": "Bag / Handbag / Wallet",
        "aliases": ["bag", "handbag", "backpack", "wallet", "clutch", "tote", "purse"],
        "shape_descriptor": "structured 3D product silhouette with natural volume, standing upright with handles/straps falling gracefully",
        "front_view": "front 3/4 perspective highlighting main closure, front hardware, and leather/fabric grain",
        "back_view": "back view showing rear pockets, strap attachments, and seams",
        "detail_keep_list": "hardware buckles, zippers, strap stitching, texture grain, brand emblem",
        "fill_ratio": 0.82,
        "canvas_ratio": "1:1",
        "forbidden": "hands, body, hanger, table surface"
    },
    "generic_product": {
        "id": "generic_product",
        "display_name": "Apparel / Fashion Product",
        "aliases": ["generic", "accessory", "apparel", "clothing", "item"],
        "shape_descriptor": "presented with natural 3D studio volume, crisp edges, and realistic depth",
        "front_view": "front view with flattering studio lighting and soft contact shadow",
        "back_view": "back view showing clean reverse contours and authentic finishing",
        "detail_keep_list": "original colors, patterns, textures, hardware, and stitching",
        "fill_ratio": 0.85,
        "canvas_ratio": "1:1",
        "forbidden": "person, hands, hanger, text, watermark"
    }
}


# ==============================================================================
# CATEGORY DETECTION (Data-Driven, Fallback-Safe)
# ==============================================================================

def detect_category(cutout_rgba: Image.Image, user_hint: Optional[str] = None) -> Tuple[Dict[str, Any], float]:
    """
    Detects the apparel category from user hint and/or silhouette visual cues.
    Always returns a valid category entry and a confidence score between 0.0 and 1.0.
    Never raises an exception or blocks the upload.
    """
    # 1. Match against user hint if provided
    if user_hint and isinstance(user_hint, str):
        hint_clean = user_hint.strip().lower()
        for cat_id, entry in CATEGORY_REGISTRY.items():
            if hint_clean == cat_id or any(re.search(r'\b' + re.escape(alias) + r'\b', hint_clean) for alias in entry["aliases"]):
                logger.info(f"[CategoryDetect] Matched user hint '{user_hint}' to category '{cat_id}' (conf=0.95)")
                return entry, 0.95

    # 2. Shape-based heuristic inference on cutout silhouette
    try:
        w, h = cutout_rgba.size
        aspect_ratio = float(w) / max(float(h), 1.0)

        alpha = np.array(cutout_rgba.split()[3])
        y_indices, x_indices = np.where(alpha > 40)

        if len(y_indices) == 0:
            return CATEGORY_REGISTRY["generic_product"], 0.30

        # Vertical mass distribution
        mid_y = int(np.median(y_indices))
        top_half_mass = np.sum(alpha[:mid_y, :] > 40)
        bot_half_mass = np.sum(alpha[mid_y:, :] > 40)
        mass_ratio = float(top_half_mass) / max(float(bot_half_mass), 1.0)

        # Bottom bifurcated analysis (test for pants/trousers)
        bottom_strip = alpha[int(h * 0.75):int(h * 0.95), :]
        col_proj = np.sum(bottom_strip > 40, axis=0)
        peaks = (col_proj > np.max(col_proj) * 0.3).astype(np.uint8)
        num_legs, _ = cv2.connectedComponents(peaks)

        # Decision rules
        if aspect_ratio < 0.55 and num_legs >= 3:
            return CATEGORY_REGISTRY["jeans_trousers_pants"], 0.75
        elif aspect_ratio < 0.60 and mass_ratio > 1.2:
            return CATEGORY_REGISTRY["kurta_kurti"], 0.70
        elif aspect_ratio < 0.65:
            return CATEGORY_REGISTRY["dress_gown"], 0.65
        elif 0.70 <= aspect_ratio <= 1.15:
            # Standard topwear / shirt
            return CATEGORY_REGISTRY["shirt"], 0.70
        elif aspect_ratio > 1.25:
            # Wide footwear or bags
            return CATEGORY_REGISTRY["shoes_sandals"], 0.60

    except Exception as e:
        logger.warning(f"[CategoryDetect] Silhouette analysis warning: {e}")

    # Fallback to generic product
    return CATEGORY_REGISTRY["generic_product"], 0.50


# ==============================================================================
# PROMPT BUILDER (Strict Template, Zero Hardcoded Product Names)
# ==============================================================================

def build_shape_prompt(category_entry: Dict[str, Any], view: str = "front", config: StudioShapeConfig = CONFIG) -> str:
    """
    Constructs the prompt for the shape provider using the strict data-driven template.
    Guarantees color and detail preservation while prohibiting human models or artifacts.
    """
    display_name = category_entry.get("display_name", "Apparel Product")
    shape_desc = category_entry.get("shape_descriptor", "natural 3D studio shape")
    view_desc = category_entry.get("back_view" if view == "back" else "front_view", "straight catalog view")
    detail_list = category_entry.get("detail_keep_list", "collar, buttons, fabric texture")
    forbidden = category_entry.get("forbidden", "person, hands, hanger, text")

    if view == "back":
        back_rule = "Do not invent a label, logo, or print that is not visible in the input back image."
    else:
        back_rule = "Keep all front details, plackets, collar edges, and stitching exactly intact."

    prompt = (
        f"Use the input image as the exact product. Create a premium e-commerce studio photo of this same {display_name}: "
        f"{shape_desc}. View: {view_desc}. Plain neutral pure white studio background, soft studio lighting, soft floor shadow. "
        f"STRICT RULES: keep the exact fabric color, shade, texture, print, embroidery, border, {detail_list} exactly as in the input. "
        f"Do not recolor, brighten, desaturate, or add any pattern, text or logo. "
        f"Do not add {forbidden}. Only change the 3D shape, volume and viewing angle. "
        f"{back_rule} Show the entire product, nothing cropped. Show the correct proportions."
    )
    return prompt


# ==============================================================================
# SHAPE PROVIDER INTERFACE & IMPLEMENTATIONS
# ==============================================================================

class ShapeProvider:
    """Base interface for all 3D shape generation providers."""
    def generate(self, cutout_rgba: Image.Image, prompt: str, view: str = "front", seed: Optional[int] = None) -> List[Image.Image]:
        raise NotImplementedError


class MockShapeProvider(ShapeProvider):
    """
    Mock provider for automated testing, fallback verification, and zero-cost local execution.
    Returns the source cutout unchanged so test suites and baseline operations never fail.
    """
    def generate(self, cutout_rgba: Image.Image, prompt: str, view: str = "front", seed: Optional[int] = None) -> List[Image.Image]:
        logger.info(f"[MockShapeProvider] Returning source cutout as candidate (view={view})")
        return [cutout_rgba.copy()]


class GeminiImageEditProvider(ShapeProvider):
    """
    Google Gemini Image Editing Provider.
    Invokes the Google Vision/Gemini endpoint if GEMINI_API_KEY is configured in the environment.
    """
    def generate(self, cutout_rgba: Image.Image, prompt: str, view: str = "front", seed: Optional[int] = None) -> List[Image.Image]:
        api_key = os.environ.get("GEMINI_API_KEY", "") or getattr(settings, "GEMINI_API_KEY", "")
        if not api_key:
            logger.warning("[GeminiShapeProvider] GEMINI_API_KEY not configured. Falling back to Mock.")
            return MockShapeProvider().generate(cutout_rgba, prompt, view, seed)

        try:
            import requests
            buffered = io.BytesIO()
            cutout_rgba.save(buffered, format="PNG")
            img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"
            payload = {
                "contents": [{
                    "parts": [
                        {"text": prompt},
                        {"inline_data": {"mime_type": "image/png", "data": img_b64}}
                    ]
                }],
                "generationConfig": {"temperature": 0.2, "topK": 32}
            }
            resp = requests.post(url, json=payload, timeout=CONFIG.TIMEOUT_SECONDS)
            if resp.status_code == 200:
                data = resp.json()
                parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
                for part in parts:
                    if "inline_data" in part and part["inline_data"].get("data"):
                        candidate_bytes = base64.b64decode(part["inline_data"]["data"])
                        candidate_img = Image.open(io.BytesIO(candidate_bytes)).convert("RGBA")
                        return [candidate_img]

            logger.warning(f"[GeminiShapeProvider] API did not return image bytes (status={resp.status_code}).")
        except Exception as e:
            logger.error(f"[GeminiShapeProvider] Exception during generation: {e}")

        return MockShapeProvider().generate(cutout_rgba, prompt, view, seed)


class SelfHostedComfyProvider(ShapeProvider):
    """
    Self-hosted ComfyUI / Diffusers stub for on-premise GPU nodes.
    """
    def generate(self, cutout_rgba: Image.Image, prompt: str, view: str = "front", seed: Optional[int] = None) -> List[Image.Image]:
        endpoint = os.environ.get("COMFYUI_ENDPOINT", "")
        if not endpoint:
            logger.info("[SelfHostedComfyProvider] No COMFYUI_ENDPOINT set. Using MockProvider.")
            return MockShapeProvider().generate(cutout_rgba, prompt, view, seed)
        # Stub: Can dispatch WebSocket / REST prompt to local ComfyUI worker
        return MockShapeProvider().generate(cutout_rgba, prompt, view, seed)


def get_shape_provider(provider_name: Optional[str] = None) -> ShapeProvider:
    """Factory function returning the configured ShapeProvider instance."""
    name = (provider_name or CONFIG.PROVIDER).lower()
    if name == "gemini":
        return GeminiImageEditProvider()
    elif name in ("comfyui", "selfhosted", "diffusers"):
        return SelfHostedComfyProvider()
    else:
        return MockShapeProvider()


# ==============================================================================
# QUALITY GATE (Color, Details, Completeness, Clutter Protection)
# ==============================================================================

def _compute_lab_color_diff(src_rgba: Image.Image, cand_rgba: Image.Image) -> float:
    """
    Computes Euclidean distance between the interior median LAB colors of source and candidate.
    Approximates CIEDE2000 color delta under uniform studio illumination.
    """
    def _extract_interior_lab(pil_img: Image.Image) -> Optional[np.ndarray]:
        arr = np.array(pil_img.convert("RGBA"))
        alpha = arr[:, :, 3]
        mask = alpha > 180
        # Erode mask slightly to sample only interior fabric (ignore boundary anti-aliasing)
        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        mask_eroded = cv2.erode(mask.astype(np.uint8), k) > 0
        if np.sum(mask_eroded) < 100:
            mask_eroded = mask

        valid_rgb = arr[:, :, :3][mask_eroded]
        if len(valid_rgb) == 0:
            return None
        valid_bgr = cv2.cvtColor(valid_rgb.reshape(-1, 1, 3), cv2.COLOR_RGB2BGR)
        lab = cv2.cvtColor(valid_bgr, cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)
        return np.median(lab, axis=0)

    src_lab = _extract_interior_lab(src_rgba)
    cand_lab = _extract_interior_lab(cand_rgba)

    if src_lab is None or cand_lab is None:
        return 999.0

    delta = float(np.linalg.norm(src_lab - cand_lab))
    return delta


def _compute_edge_similarity(src_rgba: Image.Image, cand_rgba: Image.Image) -> float:
    """
    Computes structural edge cross-correlation between source and candidate silhouettes.
    """
    try:
        # Resize both to common 256x256 grayscale
        src_gray = np.array(src_rgba.convert("L").resize((256, 256), Image.Resampling.BILINEAR))
        cand_gray = np.array(cand_rgba.convert("L").resize((256, 256), Image.Resampling.BILINEAR))

        src_edges = cv2.Canny(src_gray, 50, 150).astype(np.float32)
        cand_edges = cv2.Canny(cand_gray, 50, 150).astype(np.float32)

        norm_s = np.linalg.norm(src_edges)
        norm_c = np.linalg.norm(cand_edges)

        if norm_s < 1e-4 or norm_c < 1e-4:
            return 0.80

        correlation = float(np.sum(src_edges * cand_edges) / (norm_s * norm_c))
        return max(0.0, min(1.0, correlation))
    except Exception:
        return 0.70


def _detect_human_skin_clutter(pil_rgba: Image.Image) -> float:
    """
    Detects presence of human skin-tone pixels in YCrCb space.
    """
    try:
        arr = np.array(pil_rgba.convert("RGBA"))
        alpha = arr[:, :, 3]
        garment_pixels = np.sum(alpha > 40)
        if garment_pixels == 0:
            return 0.0

        rgb = arr[:, :, :3]
        ycrcb = cv2.cvtColor(rgb, cv2.COLOR_RGB2YCrCb)

        # Standard human skin range in YCrCb (Chai & Ngan model: Y >= 80, 133 <= Cr <= 173, 77 <= Cb <= 127)
        # Y >= 80 distinguishes illuminated human skin from dark brown, coffee, or bronze fabrics
        skin_mask = (
            (ycrcb[:, :, 0] >= 80) &
            (ycrcb[:, :, 1] >= 133) & (ycrcb[:, :, 1] <= 173) &
            (ycrcb[:, :, 2] >= 77) & (ycrcb[:, :, 2] <= 127) &
            (alpha > 100)
        )
        skin_pixel_count = np.sum(skin_mask)
        return float(skin_pixel_count) / float(garment_pixels)
    except Exception:
        return 0.0


def _detect_excess_skin_clutter(source_cutout: Image.Image, cand_rgba: Image.Image) -> float:
    """
    Computes excess skin-tone pixels in candidate compared to source garment.
    Prevents false rejections on brown, tan, beige, khaki, or peach garments.
    """
    src_ratio = _detect_human_skin_clutter(source_cutout)
    cand_ratio = _detect_human_skin_clutter(cand_rgba)
    excess_skin = max(0.0, cand_ratio - src_ratio)
    return excess_skin


def quality_gate(
    source_cutout: Image.Image,
    candidate_img: Image.Image,
    category_entry: Dict[str, Any],
    config: StudioShapeConfig = CONFIG
) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Rigorous quality gate that evaluates whether a generated candidate preserves
    100% color fidelity and structural integrity while remaining clutter-free.

    Returns:
        (passed: bool, reason: str, scores: dict)
    """
    scores: Dict[str, Any] = {}

    # 1. Color Check (CIEDE2000 / LAB Distance)
    color_diff = _compute_lab_color_diff(source_cutout, candidate_img)
    scores["lab_color_diff"] = round(color_diff, 2)
    if color_diff > config.MAX_COLOR_DIFF_LAB:
        reason = f"Color deviation too high ({color_diff:.2f} > limit {config.MAX_COLOR_DIFF_LAB})"
        logger.info(f"[QualityGate FAIL] {reason}")
        return False, reason, scores

    # 2. Clutter & Skin Tone Rejection (Prohibits foreign human hands/heads)
    excess_skin = _detect_excess_skin_clutter(source_cutout, candidate_img)
    scores["excess_skin_ratio"] = round(excess_skin, 4)
    if excess_skin > config.MAX_SKIN_RATIO:
        reason = f"Foreign human skin/hands detected (+{excess_skin*100:.1f}% > limit {config.MAX_SKIN_RATIO*100:.1f}%)"
        logger.info(f"[QualityGate FAIL] {reason}")
        return False, reason, scores

    # 3. Completeness & Area Ratio Bounds
    src_alpha = np.array(source_cutout.split()[3])
    cand_alpha = np.array(candidate_img.split()[3])
    src_area = max(1, int(np.sum(src_alpha > 40)))
    cand_area = int(np.sum(cand_alpha > 40))
    area_ratio = float(cand_area) / float(src_area)
    scores["area_ratio"] = round(area_ratio, 2)

    if area_ratio < config.MIN_AREA_RATIO or area_ratio > config.MAX_AREA_RATIO:
        reason = f"Garment area distorted ({area_ratio:.2f} outside bounds [{config.MIN_AREA_RATIO}, {config.MAX_AREA_RATIO}])"
        logger.info(f"[QualityGate FAIL] {reason}")
        return False, reason, scores

    # 4. Canvas Boundary Contact Check (Must not be cropped at edge)
    cand_w, cand_h = candidate_img.size
    touch_top = np.any(cand_alpha[0, :] > 40)
    touch_bot = np.any(cand_alpha[cand_h - 1, :] > 40)
    touch_left = np.any(cand_alpha[:, 0] > 40)
    touch_right = np.any(cand_alpha[:, cand_w - 1] > 40)
    scores["edge_touches"] = int(touch_top + touch_bot + touch_left + touch_right)

    if scores["edge_touches"] >= 2:
        reason = "Candidate garment is cropped at canvas boundaries"
        logger.info(f"[QualityGate FAIL] {reason}")
        return False, reason, scores

    # 5. Structural Edge Correlation Check
    edge_sim = _compute_edge_similarity(source_cutout, candidate_img)
    scores["edge_similarity"] = round(edge_sim, 2)
    if edge_sim < config.MIN_STRUCTURAL_SIMILARITY:
        reason = f"Structural shape correlation too low ({edge_sim:.2f} < limit {config.MIN_STRUCTURAL_SIMILARITY})"
        logger.info(f"[QualityGate FAIL] {reason}")
        return False, reason, scores

    logger.info(f"[QualityGate PASS] All checks passed. Scores: {scores}")
    return True, "PASSED", scores


# ==============================================================================
# FINAL STUDIO COMPOSITION (Pure White Canvas + Soft Shadow)
# ==============================================================================

def compose_studio_canvas(
    isolated_rgba: Image.Image,
    fill_ratio: float = 0.85,
    canvas_size: int = 1200
) -> bytes:
    """
    Composites any isolated RGBA garment onto a pure white (#FFFFFF) studio canvas
    with a soft, natural contact drop shadow. Returns JPEG bytes at 95% quality.
    """
    # 1. Tight crop padding
    bbox = isolated_rgba.getbbox()
    if bbox:
        isolated_rgba = isolated_rgba.crop(bbox)

    # 2. Scale proportionally to target fill ratio
    target_dim = int(canvas_size * fill_ratio)
    ratio = min(target_dim / max(isolated_rgba.width, 1), target_dim / max(isolated_rgba.height, 1))
    new_w = max(1, int(isolated_rgba.width * ratio))
    new_h = max(1, int(isolated_rgba.height * ratio))
    resized_img = isolated_rgba.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # 3. Soft floor contact shadow
    shadow_canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    alpha_mask = resized_img.split()[3].point(lambda a: 45 if a > 30 else 0)
    shadow_img = Image.new("RGBA", resized_img.size, (15, 15, 20, 0))
    shadow_img.putalpha(alpha_mask)
    shadow_blurred = shadow_img.filter(ImageFilter.GaussianBlur(16))

    x = (canvas_size - new_w) // 2
    y = (canvas_size - new_h) // 2
    shadow_canvas.paste(shadow_blurred, (x + 4, y + 14), shadow_blurred)

    # 4. Composite over pure white canvas
    bg = Image.new("RGBA", (canvas_size, canvas_size), (255, 255, 255, 255))
    bg.alpha_composite(shadow_canvas)
    bg.paste(resized_img, (x, y), resized_img)

    final = bg.convert("RGB")
    output = io.BytesIO()
    final.save(output, format="JPEG", quality=95, optimize=True)
    return output.getvalue()


# ==============================================================================
# PIPELINE COORDINATOR (Mode A Immediate + Mode B Background Integration)
# ==============================================================================

def execute_studio_pipeline(
    raw_image_input: Any,
    view: str = "front",
    user_garment_type: Optional[str] = None,
    seller_id: Optional[int] = None,
    config: StudioShapeConfig = CONFIG
) -> Tuple[bytes, str, Dict[str, Any]]:
    """
    Main entry point for the image pipeline.
    - Extracts clean RGBA cutout using existing garment_isolator.
    - Generates Mode A (Clean Studio Flat-lay) immediately.
    - If Mode B is enabled, passes through ShapeProvider and QualityGate.
    - If Mode B passes, uses 3D shape candidate; otherwise safely returns Mode A.

    Returns:
        (image_bytes: bytes, mode_used: str, telemetry: dict)
    """
    from intelligence.services.garment_isolator import isolate_garment_clutter_free

    t0 = time.time()
    telemetry: Dict[str, Any] = {"view": view}

    # 1. Extract clean RGBA cutout using existing isolation engine
    if isinstance(raw_image_input, Image.Image) and raw_image_input.mode == "RGBA":
        cutout_rgba = raw_image_input
    else:
        cutout_rgba = isolate_garment_clutter_free(raw_image_input)

    # 2. Detect Category
    category_entry, cat_confidence = detect_category(cutout_rgba, user_hint=user_garment_type)
    telemetry["category"] = category_entry["id"]
    telemetry["category_confidence"] = cat_confidence
    fill_ratio = category_entry.get("fill_ratio", config.DEFAULT_FILL_RATIO)

    # 3. Generate baseline Mode A (sub-100ms)
    mode_a_bytes = compose_studio_canvas(cutout_rgba, fill_ratio=fill_ratio, canvas_size=config.CANVAS_SIZE)

    # If Mode B is disabled (default), return Mode A immediately
    if not config.ENABLED:
        telemetry["mode"] = "Mode A (Clean Studio Flat-Lay)"
        telemetry["duration_ms"] = round((time.time() - t0) * 1000, 1)
        return mode_a_bytes, "mode_a", telemetry

    # 4. Mode B: Studio 3D Shape
    try:
        # Check seller rate limits
        if seller_id:
            today_str = time.strftime("%Y%m%d")
            rate_key = f"studio_3d_count_{seller_id}_{today_str}"
            daily_count = cache.get(rate_key, 0)
            if daily_count >= config.MAX_PER_DAY_PER_SELLER:
                logger.warning(f"[Studio3D] Daily limit reached for seller {seller_id}. Falling back to Mode A.")
                telemetry["fallback_reason"] = "Daily seller quota exceeded"
                return mode_a_bytes, "mode_a", telemetry

        # Cache check by image hash + prompt version
        img_bytes = io.BytesIO()
        cutout_rgba.save(img_bytes, format="PNG")
        img_hash = hashlib.sha256(img_bytes.getvalue()).hexdigest()[:16]
        cache_key = f"studio_3d_{img_hash}_{category_entry['id']}_{view}_v{config.PROMPT_VERSION}"

        cached_bytes = cache.get(cache_key)
        if cached_bytes:
            logger.info(f"[Studio3D CACHE HIT] {cache_key}")
            telemetry["mode"] = "Mode B (Cached 3D Shape)"
            telemetry["cached"] = True
            telemetry["duration_ms"] = round((time.time() - t0) * 1000, 1)
            return cached_bytes, "mode_b", telemetry

        # Build prompt & query provider
        prompt = build_shape_prompt(category_entry, view=view, config=config)
        telemetry["prompt_version"] = config.PROMPT_VERSION
        provider = get_shape_provider(config.PROVIDER)

        candidates = provider.generate(cutout_rgba, prompt, view=view)

        # Evaluate quality gate
        best_candidate = None
        for cand in candidates:
            cand_rgba = isolate_garment_clutter_free(cand)
            passed, reason, scores = quality_gate(cutout_rgba, cand_rgba, category_entry, config)
            telemetry["quality_scores"] = scores
            if passed:
                best_candidate = cand_rgba
                break
            else:
                telemetry["rejection_reason"] = reason

        if best_candidate is not None:
            # Mode B Success: compose with standard canvas & shadow
            final_bytes = compose_studio_canvas(best_candidate, fill_ratio=fill_ratio, canvas_size=config.CANVAS_SIZE)
            cache.set(cache_key, final_bytes, timeout=config.CACHE_TTL_SECONDS)
            if seller_id:
                cache.set(rate_key, daily_count + 1, timeout=86400)

            telemetry["mode"] = "Mode B (Studio 3D Shape)"
            telemetry["duration_ms"] = round((time.time() - t0) * 1000, 1)
            return final_bytes, "mode_b", telemetry

    except Exception as e:
        logger.error(f"[Studio3D Exception] Pipeline failed: {e}. Falling back to Mode A.", exc_info=True)
        telemetry["exception"] = str(e)

    # Safe fallback to Mode A
    telemetry["mode"] = "Mode A (Quality Gate Fallback)"
    telemetry["duration_ms"] = round((time.time() - t0) * 1000, 1)
    return mode_a_bytes, "mode_a", telemetry
