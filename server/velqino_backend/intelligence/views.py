import time
import base64
import requests
from io import BytesIO
from PIL import Image
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import AIModelProfile, AIModelAnglePose, TryOnGenerationSession, TryOnGeneratedAngle
from .serializers import (
    AIModelProfileSerializer,
    TryOnGenerationSessionSerializer,
    VirtualTryOnSubmitSerializer
)
from .services.tryon_engine import execute_virtual_tryon
from catalog.models import Product, ProductImage


class AIModelListAPIView(APIView):
    """
    Returns the curated collection of faceless AI Human Models with diverse skin tones,
    demographics (Men, Women, Kids), body types, and multi-angle poses.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = AIModelProfile.objects.filter(is_active=True).prefetch_related('angles')

        # Optional demographic filter
        demographic = request.query_params.get('demographic')
        if demographic and demographic in ['men', 'women', 'kids']:
            queryset = queryset.filter(demographic=demographic)

        # Optional skin tone filter
        skin_tone = request.query_params.get('skin_tone')
        if skin_tone:
            queryset = queryset.filter(skin_tone=skin_tone)

        # Optional body type filter
        body_type = request.query_params.get('body_type')
        if body_type:
            queryset = queryset.filter(body_type=body_type)

        serializer = AIModelProfileSerializer(queryset, many=True)
        return Response({
            'success': True,
            'count': queryset.count(),
            'models': serializer.data
        }, status=status.HTTP_200_OK)


class AIModelDetailAPIView(APIView):
    """
    Returns single AI Model Profile with all 6 angles and landmarks.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        model_profile = get_object_or_404(AIModelProfile.objects.prefetch_related('angles'), slug=slug)
        serializer = AIModelProfileSerializer(model_profile)
        return Response({
            'success': True,
            'model': serializer.data
        }, status=status.HTTP_200_OK)


def decode_base64_image(base64_str):
    """Decodes data:image/...;base64,... into bytes."""
    if ',' in base64_str:
        base64_str = base64_str.split(',', 1)[1]
    return base64.b64decode(base64_str)


class VirtualTryOnGenerateAPIView(APIView):
    """
    Generates realistic photoshoot of the uploaded or catalog garment fitted onto
    the chosen faceless AI model for both Front and Back sides and all 6 camera angles.
    """
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        start_time = time.time()
        serializer = VirtualTryOnSubmitSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        model_slug = data['model_slug']
        garment_type = data.get('garment_type', 'top')
        garment_title = data.get('garment_title', 'Studio Garment')
        fit_silhouette = data.get('fit_silhouette', 'regular')
        tuck_style = data.get('tuck_style', 'untucked')
        backdrop_style = data.get('backdrop_style', 'pure_white')
        selected_angles = data.get('angles', ['front', 'back', 'left_three_quarter', 'right_three_quarter', 'left_side', 'right_side'])
        seller_type = data.get('seller_type', 'retailer')

        # Retrieve AI Model
        try:
            model_profile = AIModelProfile.objects.get(slug=model_slug)
        except AIModelProfile.DoesNotExist:
            model_profile = AIModelProfile.objects.first()
            if not model_profile:
                return Response({
                    'success': False,
                    'error': 'No AI models available in database.'
                }, status=status.HTTP_404_NOT_FOUND)

        # Retrieve Garment Images
        front_image_bytes = None
        back_image_bytes = None

        # 1. Check if uploaded files
        if 'front_image' in request.FILES:
            front_image_bytes = request.FILES['front_image'].read()
        elif data.get('front_image_base64'):
            front_image_bytes = decode_base64_image(data['front_image_base64'])

        if 'back_image' in request.FILES:
            back_image_bytes = request.FILES['back_image'].read()
        elif data.get('back_image_base64'):
            back_image_bytes = decode_base64_image(data['back_image_base64'])

        # 2. Check if selected from existing catalog Product
        product_id = data.get('product_id')
        product_obj = None
        if product_id and not front_image_bytes:
            try:
                product_obj = Product.objects.prefetch_related('images').get(id=product_id)
                garment_title = product_obj.name
                # Pull front and back images from ProductImage
                front_prod_img = product_obj.images.filter(is_front=True).first() or product_obj.images.first()
                if front_prod_img and front_prod_img.image:
                    img_url = front_prod_img.image.url
                    resp = requests.get(img_url, timeout=10)
                    if resp.status_code == 200:
                        front_image_bytes = resp.content

                back_prod_img = product_obj.images.filter(is_front=False).first()
                if back_prod_img and back_prod_img.image:
                    b_url = back_prod_img.image.url
                    resp = requests.get(b_url, timeout=10)
                    if resp.status_code == 200:
                        back_image_bytes = resp.content
            except Product.DoesNotExist:
                pass

        if not front_image_bytes:
            return Response({
                'success': False,
                'error': 'Front garment image is required. Please upload an image or select a product.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create session record
        user = request.user if request.user.is_authenticated else None
        session = TryOnGenerationSession.objects.create(
            user=user,
            seller_type=seller_type,
            product=product_obj,
            model_profile=model_profile,
            garment_type=garment_type,
            garment_title=garment_title,
            fit_silhouette=fit_silhouette,
            tuck_style=tuck_style,
            backdrop_style=backdrop_style,
            selected_angles=selected_angles,
            status='processing'
        )

        try:
            # Run Virtual Try-On Engine
            result = execute_virtual_tryon(
                front_image_file_or_bytes=front_image_bytes,
                back_image_file_or_bytes=back_image_bytes,
                model_slug=model_profile.slug,
                angles=selected_angles,
                garment_type=garment_type,
                fit_silhouette=fit_silhouette,
                tuck_style=tuck_style,
                backdrop_style=backdrop_style,
                session=session
            )

            elapsed_ms = int((time.time() - start_time) * 1000)
            session.status = 'completed'
            session.generation_time_ms = elapsed_ms
            session.save(update_fields=['status', 'generation_time_ms'])

            return Response({
                'success': True,
                'session_id': session.id,
                'generation_time_ms': elapsed_ms,
                'data': result
            }, status=status.HTTP_200_OK)

        except Exception as e:
            session.status = 'failed'
            session.error_message = str(e)
            session.save(update_fields=['status', 'error_message'])
            return Response({
                'success': False,
                'error': f"AI Try-On processing error: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TryOnSessionDetailAPIView(APIView):
    """
    Returns photoshoot results for a specific session ID.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, session_id):
        session = get_object_or_404(
            TryOnGenerationSession.objects.prefetch_related('renders', 'model_profile__angles'),
            id=session_id
        )
        serializer = TryOnGenerationSessionSerializer(session)
        return Response({
            'success': True,
            'session': serializer.data
        }, status=status.HTTP_200_OK)


class TryOnHistoryAPIView(APIView):
    """
    Returns recent virtual try-on photoshoot sessions.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        seller_type = request.query_params.get('seller_type', 'retailer')
        queryset = TryOnGenerationSession.objects.filter(
            seller_type=seller_type,
            status='completed'
        ).prefetch_related('renders', 'model_profile')[:20]

        serializer = TryOnGenerationSessionSerializer(queryset, many=True)
        return Response({
            'success': True,
            'sessions': serializer.data
        }, status=status.HTTP_200_OK)


class ExportToProductAPIView(APIView):
    """
    Attaches the generated photoshoot angles directly into the catalog Product's gallery.
    Assigns Front Angle with is_front=True and Back Angle with is_front=False.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        session_id = request.data.get('session_id')
        product_id = request.data.get('product_id')
        selected_angles = request.data.get('angles', [])

        if not session_id or not product_id:
            return Response({
                'success': False,
                'error': 'session_id and product_id are required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        session = get_object_or_404(TryOnGenerationSession.objects.prefetch_related('renders'), id=session_id)
        product = get_object_or_404(Product, id=product_id)

        renders_to_attach = session.renders.all()
        if selected_angles:
            renders_to_attach = renders_to_attach.filter(angle_key__in=selected_angles)

        created_images = []
        for idx, render in enumerate(renders_to_attach):
            # Create product image entry
            prod_img = ProductImage.objects.create(
                product=product,
                image=render.image_url,
                is_front=render.is_front,
                is_primary=(idx == 0 and render.is_front),
                order=idx + 10
            )
            created_images.append({
                'id': prod_img.id,
                'angle_key': render.angle_key,
                'is_front': render.is_front,
                'image_url': render.image_url
            })

        return Response({
            'success': True,
            'message': f"Successfully exported {len(created_images)} angles to Product {product.name} ({product.sku}).",
            'product_id': product.id,
            'images': created_images
        }, status=status.HTTP_200_OK)
