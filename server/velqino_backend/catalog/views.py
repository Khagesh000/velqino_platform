from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from django.shortcuts import get_object_or_404
from .models import Product, Category
from .serializers import (
    ProductListSerializer, ProductDetailSerializer,
    BulkImageUploadSerializer, BulkVideoUploadSerializer,
    CategorySerializer, ProductCreateSerializer, ProductUpdateSerializer
)
from .services.product_service import ProductService
from .utils.product_helpers import ProductHelpers
import logging

logger = logging.getLogger(__name__)


# ============= PRODUCT ENDPOINTS =============

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def product_list(request):
    """List all products or create new product"""
    seller_id = request.user.id
    
    if request.method == 'GET':
        cache_key = f"product:list:{seller_id}:{request.GET.urlencode()}"
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response({'status': 'success', 'data': cached_data, 'source': 'cache'})
        
        filters = {
            'category': request.query_params.get('category'),
            'status': request.query_params.get('status'),
            'min_price': request.query_params.get('min_price'),
            'max_price': request.query_params.get('max_price'),
            'low_stock': request.query_params.get('low_stock'),
            'search': request.query_params.get('search'),
            'pattern': request.query_params.get('pattern'),
        }
        
        page = int(request.query_params.get('page', 1))
        per_page = int(request.query_params.get('per_page', 20))
        
        result = ProductService.get_products_with_filters(seller_id, filters, page, per_page)
        serializer = ProductListSerializer(result['products'], many=True)
        
        response_data = {
            'products': serializer.data,
            'pagination': {
                'total': result['total'],
                'page': result['page'],
                'per_page': result['per_page'],
                'total_pages': result['total_pages']
            }
        }
        
        cache.set(cache_key, response_data, 300)
        return Response({'status': 'success', 'data': response_data})
    
    elif request.method == 'POST':
        serializer = ProductCreateSerializer(data=request.data)
        if serializer.is_valid():
            product = ProductService.create_product_with_variants(request.user, serializer.validated_data)
            cache.delete_pattern(f"product:list:{seller_id}:*")
            return Response({
                'status': 'success',
                'data': ProductDetailSerializer(product).data
            }, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def product_detail(request, product_id):
    """Get, update or delete a single product"""
    seller_id = request.user.id
    product = get_object_or_404(Product, id=product_id, seller_id=seller_id)
    
    if request.method == 'GET':
        cache_key = f"product:{product_id}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response({'status': 'success', 'data': cached_data, 'source': 'cache'})
        
        serializer = ProductDetailSerializer(product)
        cache.set(cache_key, serializer.data, timeout=1800)
        return Response({'status': 'success', 'data': serializer.data})
    
    elif request.method == 'PUT':
        serializer = ProductUpdateSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            cache.delete(f"product:{product_id}")
            cache.delete_pattern(f"product:list:{seller_id}:*")
            return Response({'status': 'success', 'data': ProductDetailSerializer(product).data})
        return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        product.delete()
        cache.delete(f"product:{product_id}")
        cache.delete_pattern(f"product:list:{seller_id}:*")
        return Response({'status': 'success', 'message': 'Product deleted'})


# ============= NEW BULK UPLOAD ENDPOINTS =============

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_image_upload(request):
    """
    Upload multiple images to create multiple products
    Supports front only OR front+back pairs
    """
    serializer = BulkImageUploadSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({'status': 'error', 'errors': serializer.errors},
                       status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    images = data['images']

    # ✅ Get upload mode from request
    upload_mode = request.data.get('upload_mode', 'front_back')

    # ✅ Validate based on mode
    if upload_mode == 'front_back' and len(images) % 2 != 0:
        return Response({
            'status': 'error',
            'message': 'Front + Back mode requires even number of images'
        }, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Calculate product count based on mode
    product_count = len(images) // 2 if upload_mode == 'front_back' else len(images)
    sizes = request.data.getlist('sizes', [])
    print(f"🔴 SIZES FROM REQUEST: {sizes}")

    # Trigger async task
    result = ProductService.trigger_bulk_image_processing(
        seller_id=request.user.id,
        images=images,
        common_data={
            'common_price': data['common_price'],
            'common_cost': data['common_cost'],
            'category_id': data.get('category_id'),
            'common_name_prefix': data.get('common_name_prefix', 'Product'),
            'brand': data.get('brand', ''),
            'description': data.get('description', ''),
            'upload_mode': upload_mode,
            'sizes': sizes,
        }
    )

    return Response({
        'status': 'success',
        'message': f'Processing {product_count} products',
        'task_id': result['task_id']
    }, status=status.HTTP_202_ACCEPTED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_video_upload(request):
    """
    Upload one video showing multiple products in grid layout
    Creates products for each detected item
    """
    serializer = BulkVideoUploadSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({'status': 'error', 'errors': serializer.errors}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data

    sizes = request.data.getlist('sizes', [])
    print(f"🔴 SIZES FROM REQUEST: {sizes}")
    
    # Trigger async task
    result = ProductService.trigger_bulk_video_processing(
        seller_id=request.user.id,
        video=data['video'],
        common_data={
            'number_of_products': data['number_of_products'],
            'common_price': data['common_price'],
            'common_cost': data['common_cost'],
            'category_id': data.get('category_id'),
            'common_name_prefix': data.get('common_name_prefix', 'Product'),
            'brand': data.get('brand', ''),
            'description': data.get('description', ''),
            'sizes': sizes,
            'grid_rows': data.get('grid_rows', 2),
            'grid_columns': data.get('grid_columns', 5)
        }
    )
    
    return Response({
        'status': 'success',
        'message': f'Processing video for {data["number_of_products"]} products',
        'task_id': result['task_id']
    }, status=status.HTTP_202_ACCEPTED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def low_stock_products(request):
    """Get all low stock products"""
    seller_id = request.user.id
    products = ProductHelpers.get_low_stock_products(seller_id)
    serializer = ProductListSerializer(products, many=True)
    
    return Response({
        'status': 'success',
        'count': products.count(),
        'data': serializer.data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_product_action(request):
    """Bulk actions on products (delete, update status, update price)"""
    seller_id = request.user.id
    product_ids = request.data.get('product_ids', [])
    operation = request.data.get('operation')
    value = request.data.get('value')
    
    if not product_ids or not operation:
        return Response({
            'status': 'error',
            'message': 'product_ids and operation are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    result = ProductService.bulk_operation(seller_id, product_ids, operation, value)
    return Response({'status': 'success', 'data': result})


# ============= CATEGORY ENDPOINTS =============

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def category_list(request):
    """List all categories or create new"""
    if request.method == 'GET':
        cache_key = "categories:all"
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response({'status': 'success', 'data': cached_data, 'source': 'cache'})
        
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        cache.set(cache_key, serializer.data, timeout=86400)
        
        return Response({'status': 'success', 'data': serializer.data})
    
    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.delete("categories:all")
            return Response({'status': 'success', 'data': serializer.data}, 
                          status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'errors': serializer.errors}, 
                       status=status.HTTP_400_BAD_REQUEST)