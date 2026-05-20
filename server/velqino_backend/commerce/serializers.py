from rest_framework import serializers
from .models import Order, OrderItem, Cart, CartItem
from catalog.serializers import ProductListSerializer, ProductDetailSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for cart items"""
    
    product_detail = ProductDetailSerializer(source='product', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    saved_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_detail', 'quantity', 
            'price_at_add', 'selected_size', 'selected_color',
            'subtotal', 'saved_amount', 'added_at'
        ]
        read_only_fields = ['price_at_add', 'added_at']


class CartSerializer(serializers.ModelSerializer):
    """Serializer for shopping cart"""
    
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    unique_item_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Cart
        fields = [
            'id', 'user', 'user_type', 'status', 'items',
            'subtotal', 'discount_amount', 'total', 
            'coupon_code', 'item_count', 'unique_item_count',
            'created_at', 'updated_at', 'last_activity'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_activity']


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding item to cart"""
    
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    selected_size = serializers.CharField(required=False, allow_blank=True)
    selected_color = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        """✅ ADD THIS VALIDATION"""
        from catalog.models import Product
        
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return data
        
        user = request.user
        product = Product.objects.get(id=data['product_id'])
        
        # ✅ Retailer cannot add retailer products to cart
        if product.seller_type == 'retailer' and user.role == 'retailer':
            raise serializers.ValidationError(
                'Retailers cannot add retailer products to cart. Only customers can buy retailer products.'
            )
        
        # ✅ Customer cannot add wholesaler products to cart
        if product.seller_type == 'wholesaler' and user.role == 'customer':
            raise serializers.ValidationError(
                'Customers cannot add wholesaler products to cart. Only retailers can buy wholesaler products.'
            )
        
        return data


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer for updating cart item quantity"""
    
    quantity = serializers.IntegerField(min_value=1)


class ApplyCouponSerializer(serializers.Serializer):
    """Serializer for applying coupon"""
    
    coupon_code = serializers.CharField(max_length=50)


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items with all product images"""
    
    product_images = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_sku', 'quantity', 'price', 'total', 'product_images']
    
    def get_product_images(self, obj):
        if obj.product:
            return [img.image.url for img in obj.product.images.all()]
        return []

class OrderListSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'tracking_number', 'grand_total', 'status', 'payment_status', 'payment_method', 'delivery_type', 'expected_delivery_date', 'created_at', 'items']

class OrderCreateSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    delivery_type = serializers.ChoiceField(choices=['standard', 'express'])
    payment_method = serializers.CharField(max_length=50)
    
    def validate(self, data):
        """✅ ADD THIS VALIDATION"""
        from .models import Cart
        from catalog.models import Product
        
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return data
        
        user = request.user
        cart = Cart.objects.filter(user=user, status='active').first()
        
        if not cart or not cart.items.exists():
            raise serializers.ValidationError('Cart is empty')
        
        # ✅ Validate each cart item
        for cart_item in cart.items.all():
            product = cart_item.product
            
            # Retailer cannot order retailer products
            if product.seller_type == 'retailer' and user.role == 'retailer':
                raise serializers.ValidationError(
                    f'Cannot place order: {product.name} is a retailer product. Retailers cannot buy retailer products.'
                )
            
            # Customer cannot order wholesaler products
            if product.seller_type == 'wholesaler' and user.role == 'customer':
                raise serializers.ValidationError(
                    f'Cannot place order: {product.name} is a wholesaler product. Customers cannot buy wholesaler products.'
                )
        
        return data