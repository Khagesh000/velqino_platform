import uuid
from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant


# catalog/serializers.py - UPDATE CategorySerializer
class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'parent_name', 'description', 'children']
    
    def get_children(self, obj):
        children = obj.category_set.all()  # Categories that have this as parent
        return CategorySerializer(children, many=True).data


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
    
    # ✅ ADD THESE FIELDS
    display_price = serializers.SerializerMethodField()
    display_min_order = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'sku', 'price', 'retail_price', 'display_price', 
                  'stock', 'status', 'primary_image', 'category_name', 'pattern', 
                  'primary_color', 'min_order_qty', 'display_min_order']
    
    def get_display_price(self, obj):
        request = self.context.get('request')
        
        # Guest (no login) or Customer - show retail price
        if not request or not request.user.is_authenticated:
            return float(obj.retail_price) if obj.retail_price else float(obj.price)
        
        if request.user.role == 'customer':
            return float(obj.retail_price) if obj.retail_price else float(obj.price)
        
        # Wholesaler or Retailer - show wholesale price
        return float(obj.price)
    
    def get_display_min_order(self, obj):
        request = self.context.get('request')
        
        if not request or not request.user.is_authenticated:
            return 1
        
        if request.user.role == 'customer':
            return 1
        
        return obj.min_order_qty
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        return primary.image.url if primary else None


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'


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
    class Meta:
        model = Product
        fields = ['name', 'price', 'cost', 'stock', 'status', 'description']


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