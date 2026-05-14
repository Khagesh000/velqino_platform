# catalog/services/retailer_service.py

import logging
from django.core.cache import cache
from django.db.models import Q, F, Count, Sum
from django.core.paginator import Paginator
from datetime import datetime
import cloudinary.uploader
from io import BytesIO
from catalog.models import Product

logger = logging.getLogger(__name__)

class RetailerProductService:
    
    @staticmethod
    def get_retailer_products(request):
        """Get retailer products with advanced filtering, sorting, pagination"""
        
        cache_key = f"retailer:product:list:{request.GET.urlencode()}"
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return {'status': 'success', 'data': cached_data, 'source': 'cache'}
        
        # Query parameters
        sort_by = request.query_params.get('sort')
        discount = request.query_params.get('discount')
        limit = request.query_params.get('limit')
        category_id = request.query_params.get('category_id')
        season = request.query_params.get('season')
        search = request.query_params.get('search')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        
        page = int(request.query_params.get('page', 1))
        per_page = int(request.query_params.get('per_page', 20))
        
        if limit:
            per_page = int(limit)
        
        # Base queryset - only retailer products
        queryset = Product.objects.filter(seller_type='retailer', status='active')
        
        # Apply search
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(sku__icontains=search) |
                Q(brand__icontains=search)
            )
        
        # Apply price filter
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Apply discount filter
        if discount == 'true':
            queryset = queryset.filter(
                Q(retail_price__gt=F('price')) | Q(compare_price__gt=F('price'))
            )
        
        # Apply category filter
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Apply season filter
        if season:
            if season == 'summer':
                queryset = queryset.filter(created_at__month__in=[3, 4, 5, 6])
            elif season == 'winter':
                queryset = queryset.filter(created_at__month__in=[11, 12, 1, 2])
            elif season == 'festive':
                queryset = queryset.filter(created_at__month__in=[8, 9, 10])
        
        # Apply sorting
        if sort_by == '-total_sold':
            queryset = queryset.order_by('-total_sold')
        elif sort_by == '-created_at':
            queryset = queryset.order_by('-created_at')
        elif sort_by == '-price':
            queryset = queryset.order_by('-price')
        elif sort_by == 'price':
            queryset = queryset.order_by('price')
        else:
            queryset = queryset.order_by('-created_at')
        
        # Pagination
        paginator = Paginator(queryset, per_page)
        products_page = paginator.get_page(page)
        
        from catalog.serializers import ProductListSerializer
        serializer = ProductListSerializer(products_page, many=True, context={'request': request})
        
        response_data = {
            'products': serializer.data,
            'pagination': {
                'total': paginator.count,
                'page': page,
                'per_page': per_page,
                'total_pages': paginator.num_pages,
                'has_next': products_page.has_next(),
                'has_previous': products_page.has_previous()
            }
        }
        
        cache.set(cache_key, response_data, 300)
        return response_data
    
    @staticmethod
    def create_single_product(request):
        """Create a single retailer product with validation"""
        
        from catalog.serializers import RetailerProductCreateSerializer
        
        serializer = RetailerProductCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            product = serializer.save(seller=request.user)
            
            # Clear cache
            cache.delete_pattern("retailer:product:list:*")
            
            from catalog.serializers import ProductDetailSerializer
            return {
                'status': 'success',
                'data': ProductDetailSerializer(product, context={'request': request}).data
            }
        
        return {'status': 'error', 'errors': serializer.errors}
    
    @staticmethod
    def update_retailer_product(product_id, request):
        """Update retailer product with validation"""
        
        try:
            product = Product.objects.get(id=product_id, seller=request.user, seller_type='retailer')
        except Product.DoesNotExist:
            return {'status': 'error', 'message': 'Product not found'}
        
        # Update fields
        updatable_fields = ['name', 'price', 'cost', 'category_id', 'brand', 
                           'description', 'stock', 'threshold', 'status', 
                           'primary_color', 'pattern']
        
        for field in updatable_fields:
            if field in request.data:
                setattr(product, field, request.data.get(field))
        
        product.save()
        
        # Update variants if sizes provided
        if 'sizes' in request.data:
            sizes = request.data.getlist('sizes')
            existing_sizes = list(product.variants.values_list('size', flat=True))
            
            # Remove old variants
            product.variants.exclude(size__in=sizes).delete()
            
            # Add new variants
            for size in sizes:
                if size and size not in existing_sizes:
                    ProductVariant.objects.create(
                        product=product,
                        size=size,
                        color=request.data.get('primary_color', ''),
                        sku=f"{product.sku}-{size}",
                        stock=product.stock,
                        price=product.price
                    )
        
        # Update images if provided
        if request.FILES.getlist('images'):
            product.images.all().delete()
            for idx, img in enumerate(request.FILES.getlist('images')):
                upload_result = cloudinary.uploader.upload(
                    img,
                    public_id=f"retailer/products/{datetime.now().strftime('%Y/%m')}/{product.sku}_image_{idx+1}",
                    use_filename=True,
                    unique_filename=False,
                    overwrite=True,
                    invalidate=True
                )
                ProductImage.objects.create(
                    product=product,
                    image=upload_result['secure_url'],
                    is_primary=(idx == 0),
                    is_front=True,
                    order=idx
                )
        
        # Clear cache
        cache.delete_pattern("retailer:product:list:*")
        
        from catalog.serializers import ProductDetailSerializer
        return {
            'status': 'success',
            'data': ProductDetailSerializer(product, context={'request': request}).data
        }
    
    @staticmethod
    def delete_retailer_product(product_id, request):
        """Delete retailer product"""
        
        try:
            product = Product.objects.get(id=product_id, seller=request.user, seller_type='retailer')
            product.delete()
            cache.delete_pattern("retailer:product:list:*")
            return {'status': 'success', 'message': 'Product deleted'}
        except Product.DoesNotExist:
            return {'status': 'error', 'message': 'Product not found'}