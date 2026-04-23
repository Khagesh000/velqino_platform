from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from django.shortcuts import get_object_or_404
from .models import Product, Category, ProductImage, ProductVariant
from .serializers import (
    ProductListSerializer, ProductDetailSerializer,
    BulkImageUploadSerializer, BulkVideoUploadSerializer,
    CategorySerializer, ProductCreateSerializer, ProductUpdateSerializer
)
from .services.product_service import ProductService
from .utils.product_helpers import ProductHelpers
import logging
from django.http import HttpResponse

logger = logging.getLogger(__name__)


# ============= PRODUCT ENDPOINTS =============

@api_view(['GET', 'POST'])
def product_list(request):
    """List all products or create new product"""
    
    if request.method == 'GET':
        # ✅ PUBLIC - Anyone can view products

        user = request.user
        if user.is_authenticated and user.role in ['admin', 'support']:
            products = Product.objects.all()
            serializer = ProductListSerializer(products, many=True, context={'request': request})
            return Response({'status': 'success', 'data': {'products': serializer.data}})
        
        cache_key = f"product:list:public:{request.GET.urlencode()}"
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
        
        # ✅ Pass None for seller_id (get ALL products)
        result = ProductService.get_products_with_filters(request.user, filters, page, per_page)
        serializer = ProductListSerializer(result['products'], many=True, context={'request': request})
        
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
        # ✅ PRIVATE - Only authenticated users can create products
        if not request.user.is_authenticated:
            return Response({'status': 'error', 'message': 'Authentication required'}, status=401)
        
        seller_id = request.user.id
        
        # Rest of your POST code remains EXACTLY THE SAME...
        try:
            print("=" * 60)
            print("🔍 PRODUCT CREATION DEBUG - START")
            print(f"Request method: {request.method}")
            print(f"All POST data: {dict(request.POST)}")
            print(f"Stock from request POST: '{request.POST.get('stock')}'")
            print(f"Stock type: {type(request.POST.get('stock'))}")

            # Get or generate SKU
            sku = request.POST.get('sku') or ''

            stock_raw = request.POST.get('stock', 1)
            print(f"stock_raw value: {stock_raw}")
            
            stock_value = int(stock_raw)
            print(f"stock_value after int(): {stock_value}")
            
            # Create product
            product = Product.objects.create(
                seller=request.user,
                wholesaler=request.data.get('wholesaler_id') if request.user.role == 'retailer' else None,
                retailer=request.user if request.user.role == 'retailer' else None,
                name=request.POST.get('name'),
                sku=sku,
                price=request.POST.get('price'),
                cost=request.POST.get('cost') or 0,
                compare_price=request.POST.get('compare_price') or None,
                category_id=request.POST.get('category_id') or None,
                brand=request.POST.get('brand', ''),
                description=request.POST.get('description', ''),
                stock=stock_value,
                threshold=int(request.POST.get('threshold', 10)),
                weight=request.POST.get('weight') or None,
                status=request.POST.get('status', 'draft')
            )
            
            print(f"✅ Product created with ID: {product.id}")
            print(f"✅ Product stock after save: {product.stock}")
            print("=" * 60)
            
            # Process sizes
            sizes = request.POST.getlist('sizes')
            print(f"Sizes received: {sizes}")
            
            for size in sizes:
                if size and size.strip():
                    variant = ProductVariant.objects.create(
                        product=product,
                        size=size.strip(),
                        sku=f"{product.sku}-{size.strip()}",
                        stock=product.stock,
                        price=product.price
                    )
                    print(f"✅ Variant created: {variant.size} with stock: {variant.stock}")
            
            # Process images
            images = request.FILES.getlist('images')
            print(f"Images count: {len(images)}")
            
            for idx, img in enumerate(images):
                product_image = ProductImage.objects.create(
                    product=product,
                    image=img,
                    is_primary=(idx == 0),
                    order=idx,
                    is_front=(idx == 0)
                )
                print(f"✅ Image {idx+1} saved: {product_image.image.url if product_image.image else 'No URL'}")
            
            # Invalidate cache
            cache.delete_pattern(f"product:list:{seller_id}:*")
            
            print("🎉 PRODUCT CREATION COMPLETED SUCCESSFULLY!")
            print("=" * 60)
            
            # Return full product data
            return Response({
                'status': 'success',
                'data': ProductDetailSerializer(product).data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"❌ ERROR in product creation: {str(e)}")
            import traceback
            traceback.print_exc()
            print("=" * 60)
            return Response({
                'status': 'error',
                'errors': {'__all__': str(e)}
            }, status=status.HTTP_400_BAD_REQUEST)
        



@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, product_id):
    """Get, update or delete a single product"""
    
    # ✅ GET method - PUBLIC (no authentication required)
    if request.method == 'GET':
        product = get_object_or_404(Product, id=product_id)
        
        cache_key = f"product:{product_id}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response({'status': 'success', 'data': cached_data, 'source': 'cache'})
        
        serializer = ProductDetailSerializer(product)
        cache.set(cache_key, serializer.data, timeout=1800)
        return Response({'status': 'success', 'data': serializer.data})
    
    # ✅ PUT and DELETE - PRIVATE (authentication required)
    elif request.method == 'PUT' or request.method == 'DELETE':
        if not request.user.is_authenticated:
            return Response({'status': 'error', 'message': 'Authentication required'}, status=401)
        
        seller_id = request.user.id
        product = get_object_or_404(Product, id=product_id, seller_id=seller_id)
        
        if request.method == 'PUT':
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
    Upload multiple images to create ONE product with multiple images
    Supports: bulk_single_product (default), front_back, single
    """
    serializer = BulkImageUploadSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({'status': 'error', 'errors': serializer.errors},
                       status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    images = data['images']

    # ✅ Default mode is 'bulk_single_product' (one product with all images)
    upload_mode = request.data.get('upload_mode', 'bulk_single_product')

    # ✅ Validate based on mode
    if upload_mode == 'front_back' and len(images) % 2 != 0:
        return Response({
            'status': 'error',
            'message': 'Front + Back mode requires even number of images'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if upload_mode == 'bulk_single_product':
        # All images go to ONE product
        product_count = 1
        print(f"📦 Bulk Single Product Mode: {len(images)} images → 1 product")

    sizes = request.data.getlist('sizes', [])

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
        'message': f'Processing {product_count} product(s) with {len(images)} images',
        'task_id': result['task_id']
    }, status=status.HTTP_202_ACCEPTED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_video_upload(request):
    """
    Upload one video showing multiple products in grid layout
    Creates ONE product with multiple items detected
    """
    serializer = BulkVideoUploadSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({'status': 'error', 'errors': serializer.errors}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    upload_mode = request.data.get('upload_mode', 'bulk_single_product')
    sizes = request.data.getlist('sizes', [])

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
            'upload_mode': upload_mode,
            'sizes': sizes,
            'grid_rows': data.get('grid_rows', 2),
            'grid_columns': data.get('grid_columns', 5)
        }
    )

    return Response({
        'status': 'success',
        'message': f'Processing video with {data["number_of_products"]} detected items',
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
    seller_id = request.user.id
    product_ids = [int(id) for id in request.POST.getlist('product_ids')]
    operation = request.POST.get('operation')
    value = request.POST.get('value')
    percentage = request.POST.get('percentage')
    category_id = request.POST.get('category_id')
    images = request.FILES.getlist('images')
    
    # ✅ Convert percentage to float if exists
    if percentage:
        percentage = float(percentage)
    
    # ✅ Convert value to float if exists
    if value:
        try:
            value = float(value)
        except ValueError:
            pass
    
    # ✅ Map frontend operation names to backend operation names
    operation_map = {
        'price': 'update_price',
        'category': 'update_category',
        'status': 'update_status',
        'stock': 'update_stock',
        'images': 'update_images'
    }
    backend_operation = operation_map.get(operation, operation)
    
    if not product_ids or not operation:
        return Response({
            'status': 'error',
            'message': 'product_ids and operation are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    result = ProductService.bulk_operation(
        seller_id, product_ids, backend_operation, 
        value=value, percentage=percentage, 
        category_id=category_id, images=images
    )
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
    
# catalog/views.py - ADD this function
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def category_detail(request, category_id):
    """Get, update or delete a single category"""
    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response({'status': 'error', 'message': 'Category not found'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response({'status': 'success', 'data': serializer.data})
    
    elif request.method == 'PUT':
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            cache.delete("categories:all")
            return Response({'status': 'success', 'data': serializer.data})
        return Response({'status': 'error', 'errors': serializer.errors}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Check if category has products
        if category.products.exists():
            return Response({
                'status': 'error',
                'message': 'Cannot delete category with products. Move or delete products first.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        category.delete()
        cache.delete("categories:all")
        return Response({'status': 'success', 'message': 'Category deleted'})
    
# catalog/views.py - ADD this function for drag-drop reordering
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def category_reorder(request):
    """Reorder categories (for drag-drop functionality)"""
    data = request.data
    ordered_ids = data.get('ordered_ids', [])
    
    for index, category_id in enumerate(ordered_ids):
        Category.objects.filter(id=category_id).update(order=index)
    
    cache.delete("categories:all")
    return Response({'status': 'success', 'message': 'Categories reordered'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_products(request):
    """Export products to CSV or Excel"""
    seller_id = request.user.id
    format_type = request.data.get('format', 'csv')
    
    try:
        if format_type == 'csv':
            data = ProductService.export_products_to_csv(seller_id)
            response = HttpResponse(data, content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="products_{seller_id}.csv"'
            return response
        
        elif format_type == 'excel':
            data = ProductService.export_products_to_excel(seller_id)
            response = HttpResponse(data, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = f'attachment; filename="products_{seller_id}.xlsx"'
            return response
        
        else:
            return Response({'status': 'error', 'message': 'Invalid format'}, status=400)
            
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=500)