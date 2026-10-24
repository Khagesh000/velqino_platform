from rest_framework import serializers
from .models import AIModelProfile, AIModelAnglePose, TryOnGenerationSession, TryOnGeneratedAngle
from catalog.models import Product


class AIModelAnglePoseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIModelAnglePose
        fields = [
            'id',
            'angle_key',
            'angle_label',
            'rotation_degrees',
            'base_image_url',
            'torso_landmarks',
            'legs_landmarks',
            'display_order'
        ]


class AIModelProfileSerializer(serializers.ModelSerializer):
    angles = AIModelAnglePoseSerializer(many=True, read_only=True)

    class Meta:
        model = AIModelProfile
        fields = [
            'id',
            'slug',
            'name',
            'demographic',
            'gender',
            'age_bracket',
            'body_type',
            'skin_tone',
            'skin_tone_label',
            'skin_hex',
            'height_cm',
            'chest_waist',
            'description',
            'preview_image_url',
            'is_faceless',
            'display_order',
            'angles'
        ]


class TryOnGeneratedAngleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TryOnGeneratedAngle
        fields = [
            'id',
            'angle_key',
            'angle_label',
            'rotation_degrees',
            'image_url',
            'thumbnail_url',
            'is_front',
            'is_back',
            'created_at'
        ]


class TryOnGenerationSessionSerializer(serializers.ModelSerializer):
    model_profile = AIModelProfileSerializer(read_only=True)
    renders = TryOnGeneratedAngleSerializer(many=True, read_only=True)

    class Meta:
        model = TryOnGenerationSession
        fields = [
            'id',
            'seller_type',
            'product',
            'model_profile',
            'garment_type',
            'garment_title',
            'front_image_url',
            'back_image_url',
            'fit_silhouette',
            'tuck_style',
            'backdrop_style',
            'selected_angles',
            'status',
            'error_message',
            'generation_time_ms',
            'created_at',
            'renders'
        ]


class VirtualTryOnSubmitSerializer(serializers.Serializer):
    model_slug = serializers.CharField(required=True)
    garment_type = serializers.ChoiceField(choices=['top', 'bottom', 'outfit'], default='top')
    garment_title = serializers.CharField(required=False, default='Apparel Garment')
    
    # Image uploads (either multipart file or base64 data string)
    front_image = serializers.ImageField(required=False, allow_null=True)
    front_image_base64 = serializers.CharField(required=False, allow_blank=True)
    
    back_image = serializers.ImageField(required=False, allow_null=True)
    back_image_base64 = serializers.CharField(required=False, allow_blank=True)

    # Catalog product selection
    product_id = serializers.IntegerField(required=False, allow_null=True)

    fit_silhouette = serializers.ChoiceField(
        choices=['slim', 'regular', 'relaxed', 'oversized'],
        default='regular'
    )
    tuck_style = serializers.ChoiceField(
        choices=['untucked', 'tucked'],
        default='untucked'
    )
    backdrop_style = serializers.ChoiceField(
        choices=['pure_white', 'soft_shadow', 'warm_canvas', 'transparent'],
        default='pure_white'
    )
    angles = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=['front', 'back', 'left_three_quarter', 'right_three_quarter', 'left_side', 'right_side']
    )
    seller_type = serializers.ChoiceField(
        choices=['retailer', 'wholesaler', 'guest'],
        default='retailer'
    )
