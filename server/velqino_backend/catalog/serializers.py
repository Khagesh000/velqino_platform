import uuid
from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant, Wishlist



class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data

class CategorySerializer(serializers.ModelSerializer):
    children = RecursiveField(many=True, allow_null=True, required=False)
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'parent_name', 'description', 'is_active', 'children', 'created_at']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'order', 'is_front']


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'color', 'size', 'sku', 'stock', 'price']


class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_id = serializers.IntegerField(source='category.id', read_only=True)
    # ✅ ADD THESE FIELDS
    display_price = serializers.SerializerMethodField()
    display_min_order = serializers.SerializerMethodField()

    is_wishlisted = serializers.SerializerMethodField()

    images = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'sku', 'price', 'retail_price', 'display_price', 
                  'stock', 'status', 'primary_image', 'category_name', 'pattern', 'images',
                  'primary_color', 'min_order_qty', 'display_min_order', 'is_wishlisted', 'category_id',]
        
    def get_images(self, obj):
        """Return all product images for bulk products"""
        return [{'id': img.id, 'image': img.image.url, 'is_primary': img.is_primary} 
                for img in obj.images.all()]
        
    def get_is_wishlisted(self, obj):
        request = self.context.get('request')
        
        if not request:
            return False
        
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return False
        
        from catalog.models import Wishlist
        return Wishlist.objects.filter(user=user, product=obj).exists()
    
    def get_display_price(self, obj):
        request = self.context.get('request')
        
        # ✅ FIX: Handle None user correctly
        if not request:
            return float(obj.retail_price) if obj.retail_price else float(obj.price)
        
        # Check if user exists and is authenticated
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return float(obj.retail_price) if obj.retail_price else float(obj.price)
        
        if user.role == 'customer':
            return float(obj.retail_price) if obj.retail_price else float(obj.price)
        
        # Wholesaler or Retailer - show wholesale price
        return float(obj.price)
    
    def get_display_min_order(self, obj):
        request = self.context.get('request')
        
        # ✅ FIX: Handle None user correctly
        if not request:
            return 1
        
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return 1
        
        if user.role == 'customer':
            return 1
        
        return obj.min_order_qty
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        return primary.image.url if primary else None


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    # ✅ ADD THESE FIELDS (same as ProductListSerializer)
    display_price = serializers.SerializerMethodField()
    display_min_order = serializers.SerializerMethodField()
    is_wishlisted = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = '__all__'
    
    def get_display_price(self, obj):
        request = self.context.get('request')
        if not request:
            return float(obj.retail_price) if obj.retail_price else float(obj.price)
        
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return float(obj.retail_price) if obj.retail_price else float(obj.price)
        
        if user.role == 'customer':
            return float(obj.retail_price) if obj.retail_price else float(obj.price)
        
        return float(obj.price)
    
    def get_display_min_order(self, obj):
        request = self.context.get('request')
        if not request:
            return 1
        
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return 1
        
        if user.role == 'customer':
            return 1
        
        return obj.min_order_qty
    
    def get_is_wishlisted(self, obj):
        request = self.context.get('request')
        if not request:
            return False
        
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return False
        
        from catalog.models import Wishlist
        return Wishlist.objects.filter(user=user, product=obj).exists()
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        return primary.image.url if primary else None


# ============= NEW BULK UPLOAD SERIALIZERS =============

class BulkImageUploadSerializer(serializers.Serializer):
    """For bulk image upload - multiple images, one price"""
    images = serializers.ListField(
        child=serializers.ImageField(),
        help_text="Multiple product images (front and back views)"
    )
    common_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    common_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    category_id = serializers.IntegerField(required=False, allow_null=True)
    common_name_prefix = serializers.CharField(max_length=255, required=False, allow_blank=True)
    brand = serializers.CharField(max_length=100, required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    sizes = serializers.ListField(
    child=serializers.CharField(max_length=10),
    required=False,
    default=list
    )
    
    def validate_images(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("At least 2 images required")
        if len(value) > 100:
            raise serializers.ValidationError("Maximum 100 images per batch")
        return value


class BulkVideoUploadSerializer(serializers.Serializer):
    """For video upload - one video, many products"""
    video = serializers.FileField(help_text="Video file showing all products in grid")
    number_of_products = serializers.IntegerField(min_value=1, max_value=50)
    common_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    common_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    category_id = serializers.IntegerField(required=False, allow_null=True)
    common_name_prefix = serializers.CharField(max_length=255, required=False, allow_blank=True)
    brand = serializers.CharField(max_length=100, required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    sizes = serializers.ListField(
    child=serializers.CharField(max_length=10),
    required=False,
    default=list
    )
    grid_rows = serializers.IntegerField(default=2, min_value=1, max_value=5)
    grid_columns = serializers.IntegerField(default=5, min_value=1, max_value=10)
    
    def validate_video(self, value):
        ext = value.name.split('.')[-1].lower()
        if ext not in ['mp4', 'mov', 'avi', 'mkv', 'webm']:
            raise serializers.ValidationError("Video must be MP4, MOV, AVI, MKV, or WEBM format")
        if value.size > 500 * 1024 * 1024:  # 500MB
            raise serializers.ValidationError("Video size must be less than 500MB")
        return value
    

class ProductCreateSerializer(serializers.ModelSerializer):
    """Create new product"""
    compare_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    threshold = serializers.IntegerField(default=10, required=False)
    weight = serializers.DecimalField(max_digits=8, decimal_places=2, required=False, allow_null=True)
    status = serializers.ChoiceField(choices=['active', 'draft', 'archived'], default='draft')
    sku = serializers.CharField(required=False, allow_blank=True, allow_null=True)  # ✅ ADD THIS LINE
    
    class Meta:
        model = Product
        fields = ['name', 'sku', 'price', 'compare_price', 'cost', 'category_id', 
                  'brand', 'description', 'stock', 'threshold', 'weight', 'status']


class ProductUpdateSerializer(serializers.ModelSerializer):
    """Update existing product"""
    compare_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    threshold = serializers.IntegerField(default=10, required=False)
    weight = serializers.DecimalField(max_digits=8, decimal_places=2, required=False, allow_null=True)
    pattern = serializers.CharField(required=False, allow_blank=True)
    primary_color = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Product
        fields = ['name', 'price', 'cost', 'stock', 'status', 'description', 
                  'brand', 'category_id', 'compare_price', 'threshold', 'weight',
                  'pattern', 'primary_color', 'min_order_qty']


# ADD this to existing serializers.py

class SingleProductCreateSerializer(serializers.Serializer):
    """Single product creation serializer"""
    name = serializers.CharField(max_length=255)
    sku = serializers.CharField(max_length=100, required=False, allow_blank=True)
    category_id = serializers.IntegerField(required=False, allow_null=True)
    brand = serializers.CharField(max_length=100, required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    cost = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    compare_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    stock = serializers.IntegerField(default=0)
    threshold = serializers.IntegerField(default=10)
    weight = serializers.DecimalField(max_digits=8, decimal_places=2, required=False, allow_null=True)
    status = serializers.ChoiceField(choices=['active', 'draft'], default='draft')


class WishlistSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)
    product_price = serializers.DecimalField(source='product.price', read_only=True, max_digits=10, decimal_places=2)
    product_compare_price = serializers.DecimalField(source='product.compare_price', read_only=True, max_digits=10, decimal_places=2)
    product_primary_image = serializers.SerializerMethodField()
    product_stock = serializers.IntegerField(source='product.stock', read_only=True)
    product_images = serializers.SerializerMethodField()  # ✅ ADD THIS
    
    class Meta:
        model = Wishlist
        fields = [
            'id', 'product_id', 'product_name', 'product_slug',
            'product_price', 'product_compare_price', 'product_primary_image',
            'product_images', 'product_stock', 'added_at'
        ]
    
    def get_product_primary_image(self, obj):
        primary = obj.product.images.filter(is_primary=True).first()
        return primary.image.url if primary else None
    
    def get_product_images(self, obj):
        """Return all product images URLs"""
        return [img.image.url for img in obj.product.images.all()]