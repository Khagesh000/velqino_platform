from django.db import models
from django.conf import settings
from decimal import Decimal


class AIModelProfile(models.Model):
    """
    Curated library of AI Human Models for Virtual Try-On & Studio Photoshoots.
    Faceless / headless focus with realistic athletic and natural anatomy and skin tones.
    """
    DEMOGRAPHIC_CHOICES = (
        ('men', 'Men'),
        ('women', 'Women'),
        ('kids', 'Kids & Teens'),
    )
    
    BODY_TYPE_CHOICES = (
        ('athletic', 'Athletic / Toned'),
        ('regular', 'Standard Regular Fit'),
        ('slim', 'Slim & Lean Fit'),
        ('curvy', 'Curvy / Fit'),
        ('junior', 'Junior / Teen Fit'),
    )
    
    SKIN_TONE_CHOICES = (
        ('fair', 'Fair / Porcelain'),
        ('olive', 'Warm Olive / Neutral'),
        ('tan', 'Golden Tan / Honey'),
        ('bronze', 'Rich Bronze / Caramel'),
        ('dark', 'Deep Espresso / Dark'),
    )

    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    name = models.CharField(max_length=120)
    demographic = models.CharField(max_length=20, choices=DEMOGRAPHIC_CHOICES, db_index=True)
    gender = models.CharField(max_length=20, default='male')
    age_bracket = models.CharField(max_length=60, default='Adult (24-28 yrs)')
    body_type = models.CharField(max_length=30, choices=BODY_TYPE_CHOICES, default='athletic')
    skin_tone = models.CharField(max_length=30, choices=SKIN_TONE_CHOICES, default='tan')
    skin_tone_label = models.CharField(max_length=80, default='Golden Tan')
    skin_hex = models.CharField(max_length=20, default='#C68B59', help_text="Representative skin tone color")
    height_cm = models.IntegerField(default=180)
    chest_waist = models.CharField(max_length=60, default='40" / 32"', blank=True)
    description = models.TextField(blank=True)
    preview_image_url = models.TextField(blank=True, help_text="Primary thumbnail image")
    is_faceless = models.BooleanField(default=True, help_text="Cropped at chin/neck to highlight garment fit")
    is_active = models.BooleanField(default=True, db_index=True)
    display_order = models.IntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', 'demographic', 'name']
        indexes = [
            models.Index(fields=['demographic', 'is_active']),
            models.Index(fields=['skin_tone', 'body_type']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_demographic_display()} - {self.skin_tone_label})"


class AIModelAnglePose(models.Model):
    """
    Specific camera angles for each AI Human Model (Front, Back, Side Profiles, 3/4 angles).
    Directly corresponds to 360 multi-angle photoshoot studio.
    """
    ANGLE_CHOICES = (
        ('front', 'Front View (0°)'),
        ('back', 'Back View (180°)'),
        ('left_three_quarter', 'Left 3/4 View (-45°)'),
        ('right_three_quarter', 'Right 3/4 View (+45°)'),
        ('left_side', 'Left Profile (-90°)'),
        ('right_side', 'Right Profile (+90°)'),
    )

    model_profile = models.ForeignKey(AIModelProfile, on_delete=models.CASCADE, related_name='angles')
    angle_key = models.CharField(max_length=40, choices=ANGLE_CHOICES, db_index=True)
    angle_label = models.CharField(max_length=80)
    rotation_degrees = models.IntegerField(default=0)
    base_image_url = models.TextField(help_text="Base faceless model image for this angle")
    torso_landmarks = models.JSONField(default=dict, blank=True, help_text="Keypoints: neck, shoulders, chest, waist, hips")
    legs_landmarks = models.JSONField(default=dict, blank=True, help_text="Keypoints: waist, thighs, knees, ankles")
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order']
        unique_together = ['model_profile', 'angle_key']

    def __str__(self):
        return f"{self.model_profile.name} - {self.angle_label}"


class TryOnGenerationSession(models.Model):
    """
    Virtual Try-On generation task submitted by Retailer or Wholesaler.
    """
    GARMENT_TYPE_CHOICES = (
        ('top', 'Topwear (Shirt / T-Shirt / Polo / Kurta)'),
        ('bottom', 'Bottomwear (Pants / Trousers / Jeans / Shorts)'),
        ('outfit', 'Full Outfit (Top + Bottom Set)'),
    )

    FIT_CHOICES = (
        ('slim', 'Slim Fit'),
        ('regular', 'Regular Standard Fit'),
        ('relaxed', 'Relaxed / Easy Fit'),
        ('oversized', 'Oversized Streetwear Fit'),
    )

    TUCK_CHOICES = (
        ('untucked', 'Untucked (Casual drape)'),
        ('tucked', 'Tucked In (Formal / Clean waist)'),
    )

    BACKDROP_CHOICES = (
        ('pure_white', 'Pure Studio White (#FFFFFF)'),
        ('soft_shadow', 'Soft Commercial Studio Shadow'),
        ('warm_canvas', 'Warm Brand Canvas'),
        ('transparent', 'Transparent PNG'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing in AI Engine'),
        ('completed', 'Completed Successfully'),
        ('failed', 'Failed'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tryon_sessions'
    )
    seller_type = models.CharField(
        max_length=20,
        choices=[('retailer', 'Retailer'), ('wholesaler', 'Wholesaler'), ('guest', 'Guest')],
        default='retailer',
        db_index=True
    )
    product = models.ForeignKey(
        'catalog.Product',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tryon_sessions'
    )
    model_profile = models.ForeignKey(
        AIModelProfile,
        on_delete=models.CASCADE,
        related_name='tryon_sessions'
    )
    garment_type = models.CharField(max_length=20, choices=GARMENT_TYPE_CHOICES, default='top')
    garment_title = models.CharField(max_length=255, blank=True, default='Custom Apparel')
    
    # Garment images
    front_image = models.ImageField(upload_to='tryon/inputs/', null=True, blank=True)
    front_image_url = models.TextField(blank=True)
    back_image = models.ImageField(upload_to='tryon/inputs/', null=True, blank=True)
    back_image_url = models.TextField(blank=True)

    # Secondary garment (if full outfit)
    bottom_image = models.ImageField(upload_to='tryon/inputs/', null=True, blank=True)
    bottom_image_url = models.TextField(blank=True)

    fit_silhouette = models.CharField(max_length=30, choices=FIT_CHOICES, default='regular')
    tuck_style = models.CharField(max_length=20, choices=TUCK_CHOICES, default='untucked')
    backdrop_style = models.CharField(max_length=30, choices=BACKDROP_CHOICES, default='pure_white')
    selected_angles = models.JSONField(
        default=list,
        help_text="List of angle keys requested, e.g. ['front', 'back', 'left_three_quarter', 'right_three_quarter']"
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    error_message = models.TextField(blank=True)
    generation_time_ms = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"TryOn Session #{self.id} - {self.model_profile.name} ({self.status})"


class TryOnGeneratedAngle(models.Model):
    """
    Rendered photoshoot result for each angle of a session.
    """
    session = models.ForeignKey(
        TryOnGenerationSession,
        on_delete=models.CASCADE,
        related_name='renders'
    )
    angle_key = models.CharField(max_length=40, db_index=True)
    angle_label = models.CharField(max_length=80)
    rotation_degrees = models.IntegerField(default=0)
    image = models.ImageField(upload_to='tryon/renders/', null=True, blank=True)
    image_url = models.TextField(help_text="URL or Base64 data URI of the rendered photoshoot image")
    thumbnail_url = models.TextField(blank=True)
    is_front = models.BooleanField(default=False)
    is_back = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']
        unique_together = ['session', 'angle_key']

    def __str__(self):
        return f"Render #{self.id} for Session #{self.session_id} - {self.angle_label}"
