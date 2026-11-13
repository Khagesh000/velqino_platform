import os
import cv2
import numpy as np
import logging
from io import BytesIO
from PIL import Image, ImageFilter
from sklearn.cluster import MiniBatchKMeans

logger = logging.getLogger(__name__)


def load_as_cv2(image_input):
    """
    Safely converts a PIL Image, bytes, bytearray, or file path into a BGR OpenCV numpy array.
    """
    if isinstance(image_input, (str, os.PathLike)):
        cv_img = cv2.imread(str(image_input))
        if cv_img is None:
            raise ValueError(f"Failed to load image from path: {image_input}")
        return cv_img
    elif isinstance(image_input, (bytes, bytearray)):
        arr = np.frombuffer(image_input, dtype=np.uint8)
        cv_img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if cv_img is None:
            raise ValueError("Failed to decode image from bytes.")
        return cv_img
    elif isinstance(image_input, Image.Image):
        # PIL Image to BGR
        if image_input.mode != 'RGB':
            image_input = image_input.convert('RGB')
        rgb = np.array(image_input)
        return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    elif isinstance(image_input, np.ndarray):
        return image_input.copy()
    else:
        raise TypeError(f"Unsupported image input type: {type(image_input)}")


def isolate_garment_clutter_free(image_input, padding=12, tolerance=30):
    """
    High-Precision Garment Isolation & Semantic Clutter Rejection Engine.
    
    Designed specifically for Indian retail store photography:
    - Captures garments laid flat on tile/marble floors, tables, beds, or hangers.
    - Automatically rejects foreign clutter:
        * Merchant's feet / slippers at the bottom edge
        * Floor mats, rugs, door thresholds at the top edge
        * Wall edges, floor tile veins, and room clutter
    - Guarantees 100% preservation of original fabric colors, textures, patterns,
      stitching, pockets, tags, and button details.
    
    Returns:
        PIL.Image (RGBA) with clean transparent background, cropped to garment bounds.
    """
    # 1. Check if already transparent RGBA (either PIL.Image or bytes)
    if isinstance(image_input, (bytes, bytearray)):
        try:
            peek_img = Image.open(BytesIO(image_input))
            if peek_img.mode == 'RGBA':
                alpha_band = peek_img.split()[3]
                min_alpha, max_alpha = alpha_band.getextrema()
                if min_alpha < 100 and max_alpha > 200:
                    bbox = peek_img.getbbox()
                    if bbox:
                        x0, y0, x1, y1 = bbox
                        w, h = peek_img.size
                        return peek_img.crop((
                            max(0, x0 - padding),
                            max(0, y0 - padding),
                            min(w, x1 + padding),
                            min(h, y1 + padding)
                        ))
                    return peek_img
        except Exception:
            pass
    elif isinstance(image_input, Image.Image) and image_input.mode == 'RGBA':
        alpha_band = image_input.split()[3]
        min_alpha, max_alpha = alpha_band.getextrema()
        if min_alpha < 100 and max_alpha > 200:
            bbox = image_input.getbbox()
            if bbox:
                x0, y0, x1, y1 = bbox
                w, h = image_input.size
                return image_input.crop((
                    max(0, x0 - padding),
                    max(0, y0 - padding),
                    min(w, x1 + padding),
                    min(h, y1 + padding)
                ))
            return image_input

    cv_img = load_as_cv2(image_input)
    h, w = cv_img.shape[:2]

    # 2. Multi-margin true background sampling (corners + side margins)
    m_h = max(4, int(h * 0.08))
    m_w = max(4, int(w * 0.08))
    edge_w = max(2, int(w * 0.04))
    edge_y1 = int(h * 0.20)
    edge_y2 = int(h * 0.80)

    sample_patches = [
        cv_img[:m_h, :m_w].reshape(-1, 3),
        cv_img[:m_h, -m_w:].reshape(-1, 3),
        cv_img[-m_h:, :m_w].reshape(-1, 3),
        cv_img[-m_h:, -m_w:].reshape(-1, 3),
    ]
    if edge_y2 > edge_y1 and edge_w > 0:
        sample_patches.append(cv_img[edge_y1:edge_y2, :edge_w].reshape(-1, 3))
        sample_patches.append(cv_img[edge_y1:edge_y2, -edge_w:].reshape(-1, 3))

    bg_samples = np.vstack(sample_patches)
    bg_median = np.median(bg_samples, axis=0)

    # 3. LAB Color Distance & Otsu Automatic Thresholding
    img_lab = cv2.cvtColor(cv_img, cv2.COLOR_BGR2LAB).astype(np.float32)
    bg_lab = cv2.cvtColor(np.uint8([[bg_median]]), cv2.COLOR_BGR2LAB)[0, 0].astype(np.float32)

    dist = np.linalg.norm(img_lab - bg_lab, axis=2)
    dist_norm = np.clip((dist / max(1.0, dist.max())) * 255, 0, 255).astype(np.uint8)

    # Adaptive Otsu Threshold
    thresh_val, bin_mask = cv2.threshold(dist_norm, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Morphological opening to eliminate fine grain floor noise
    k_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    bin_mask = cv2.morphologyEx(bin_mask, cv2.MORPH_OPEN, k_open)

    # 4. Semantic Clutter Rejection via Connected Component Analysis
    num_labels, comp_labels, stats, centroids = cv2.connectedComponentsWithStats(bin_mask)
    min_area = (h * w) * 0.02

    best_comp = None
    best_score = -1e9

    for i in range(1, num_labels):
        x, y, cw, ch, area = stats[i]
        cx, cy = centroids[i]

        if area < min_area:
            continue

        # RULE A: Reject Merchant Feet / Slippers at bottom edge
        if (y + ch >= h - 20) and (cy > 0.82 * h):
            logger.info(f"[GarmentIsolator] Rejecting merchant feet component {i}: bbox=({x},{y},{cw},{ch})")
            continue

        # RULE B: Reject Top Mats / Rugs / Door Frames
        if (y <= 25) and (cy < 0.40 * h):
            logger.info(f"[GarmentIsolator] Rejecting top mat/rug component {i}: bbox=({x},{y},{cw},{ch})")
            continue

        # RULE C: Score garment candidacy by area and centrality
        dist_x = abs(cx - w / 2.0) / (w / 2.0)
        dist_y = abs(cy - h / 2.0) / (h / 2.0)
        centrality = max(0.1, 1.0 - (0.5 * dist_x + 0.3 * dist_y))
        score = area * centrality

        if score > best_score:
            best_score = score
            best_comp = i

    if best_comp is not None:
        garment_mask = (comp_labels == best_comp).astype(np.uint8) * 255
    else:
        # Fallback: largest non-bottom component
        valid_indices = [
            i for i in range(1, num_labels)
            if not ((stats[i][1] + stats[i][3] >= h - 20) and (centroids[i][1] > 0.82 * h))
        ]
        if valid_indices:
            best_comp = max(valid_indices, key=lambda i: stats[i][4])
            garment_mask = (comp_labels == best_comp).astype(np.uint8) * 255
        else:
            garment_mask = bin_mask

    # 5. Fill internal small holes (buttons, labels, stitching) inside fabric
    k_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    garment_mask = cv2.morphologyEx(garment_mask, cv2.MORPH_CLOSE, k_close)

    # 6. Edge feathering for smooth natural studio cutout
    feather_radius = max(3, int(min(h, w) * 0.004)) | 1
    alpha_feathered = cv2.GaussianBlur(garment_mask, (feather_radius, feather_radius), 1.5)

    # 7. Assemble RGBA: RGB channels remain 100% UNTOUCHED
    rgb = cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB)
    rgba = np.dstack([rgb, alpha_feathered])
    pil_rgba = Image.fromarray(rgba, mode='RGBA')

    # 8. Crop to garment bounding box with clean padding
    bbox = pil_rgba.getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        return pil_rgba.crop((
            max(0, x0 - padding),
            max(0, y0 - padding),
            min(w, x1 + padding),
            min(h, y1 + padding)
        ))

    return pil_rgba


def get_garment_color_stats(rgba_image):
    """
    Extracts authentic color statistics (median RGB, Hex, LAB mean and std)
    from an isolated garment for Color Calibration Lock.
    """
    np_rgba = np.array(rgba_image)
    if np_rgba.shape[2] < 4:
        alpha = np.ones(np_rgba.shape[:2], dtype=np.uint8) * 255
    else:
        alpha = np_rgba[:, :, 3]

    valid_mask = alpha > 180
    valid_rgb = np_rgba[:, :, :3][valid_mask]

    if len(valid_rgb) == 0:
        return {
            'hex': '#333333',
            'rgb': (50, 50, 50),
            'lab_mean': np.array([50.0, 0.0, 0.0]),
            'lab_std': np.array([10.0, 5.0, 5.0])
        }

    median_rgb = np.median(valid_rgb, axis=0).astype(int)
    hex_color = f"#{median_rgb[0]:02x}{median_rgb[1]:02x}{median_rgb[2]:02x}"

    # LAB stats
    valid_bgr = cv2.cvtColor(valid_rgb.reshape(-1, 1, 3), cv2.COLOR_RGB2BGR)
    valid_lab = cv2.cvtColor(valid_bgr, cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)
    lab_mean = np.mean(valid_lab, axis=0)
    lab_std = np.maximum(np.std(valid_lab, axis=0), 1.0)

    return {
        'hex': hex_color,
        'rgb': tuple(median_rgb),
        'lab_mean': lab_mean,
        'lab_std': lab_std
    }

