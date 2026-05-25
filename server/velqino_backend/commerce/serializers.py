from rest_framework import serializers
from .models import Order, OrderItem, Cart, CartItem, ReturnRequest
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
    
    # ADD THESE 5 NEW FIELDS
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()
    customer_phone = serializers.SerializerMethodField()
    shipping_full_address = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'tracking_number', 'grand_total', 'status', 
                  'payment_status', 'payment_method', 'delivery_type', 
                  'expected_delivery_date', 'created_at', 'items',
                  'customer_name', 'customer_email', 'customer_phone', 'shipping_full_address']
    
    # ADD THESE 4 METHODS
    def get_customer_name(self, obj):
        """Returns customer's full name"""
        if obj.customer:
            return f"{obj.customer.first_name} {obj.customer.last_name}".strip() or obj.customer.username
        return None
    
    def get_customer_email(self, obj):
        """Returns customer's email"""
        return obj.customer.email if obj.customer else None
    
    def get_customer_phone(self, obj):
        """Returns customer's phone number"""
        # Check if customer has phone field, otherwise return shipping_phone
        if obj.customer and hasattr(obj.customer, 'phone'):
            return obj.customer.phone
        return obj.shipping_phone if obj.shipping_phone else None
    
    def get_shipping_full_address(self, obj):
        """Returns complete shipping address"""
        if obj.shipping_address:
            return {
                'name': obj.shipping_name,
                'phone': obj.shipping_phone,
                'address': obj.shipping_address,
                'city': obj.shipping_city,
                'state': obj.shipping_state,
                'pincode': obj.shipping_pincode
            }
        return None

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
    

class ReturnItemSerializer(serializers.Serializer):
    product_name = serializers.CharField()
    product_sku = serializers.CharField()
    quantity = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    total = serializers.DecimalField(max_digits=10, decimal_places=2)


class ReturnRequestSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    customer_email = serializers.EmailField(source='customer.email', read_only=True)
    
    class Meta:
        model = ReturnRequest
        fields = [
            'return_number', 'order_number', 'return_type', 'status',
            'reason', 'comments', 'items', 'refund_amount', 'images',
            'customer_name', 'customer_email', 'created_at', 'updated_at'
        ]


class CreateReturnRequestSerializer(serializers.Serializer):
    order_id = serializers.CharField()
    return_type = serializers.ChoiceField(choices=['return', 'exchange'])
    reason = serializers.CharField()
    comments = serializers.CharField(required=False, allow_blank=True)
    items = serializers.ListField(child=ReturnItemSerializer())


class UpdateReturnStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['pending', 'processing', 'approved', 'rejected', 'completed'])