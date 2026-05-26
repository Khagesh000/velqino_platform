from rest_framework import serializers
from .models import (Order, OrderItem, Review, Cart, CartItem, 
                     ReturnRequest, LoyaltySettings, PointsTransaction, Reward, Campaign)
from catalog.serializers import ProductListSerializer, ProductDetailSerializer
from decimal import Decimal


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



class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'product', 'product_name', 'product_image', 'customer', 'customer_name', 'customer_email',
            'rating', 'title', 'comment', 'images', 'is_verified_purchase', 'helpful_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'customer', 'is_verified_purchase', 'helpful_count', 'created_at', 'updated_at']
    
    def get_customer_name(self, obj):
        return obj.customer.get_full_name() or obj.customer.email.split('@')[0]
    
    def get_customer_email(self, obj):
        return obj.customer.email
    
    def get_product_image(self, obj):
        primary_image = obj.product.images.filter(is_primary=True).first()
        if primary_image:
            return primary_image.image.url
        return None


class CreateReviewSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    order_id = serializers.CharField(required=False, allow_null=True)
    rating = serializers.IntegerField(min_value=1, max_value=5)
    title = serializers.CharField(max_length=200)
    comment = serializers.CharField()
    images = serializers.ListField(child=serializers.URLField(), required=False, default=list)


class UpdateReviewSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value=1, max_value=5, required=False)
    title = serializers.CharField(max_length=200, required=False)
    comment = serializers.CharField(required=False)
    images = serializers.ListField(child=serializers.URLField(), required=False)



#----------------------------------------------------Retailers Loyality---------------------------------------------------
class LoyaltySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltySettings
        fields = [
            'id', 'points_per_rupee', 'min_redemption_points', 'max_redemption_points',
            'points_expiry_months', 'welcome_bonus_points', 'birthday_bonus_points',
            'referral_bonus_points', 'bronze_threshold', 'silver_threshold',
            'gold_threshold', 'platinum_threshold', 'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']


class UpdateLoyaltySettingsSerializer(serializers.Serializer):
    points_per_rupee = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=Decimal('0.01'), required=False)
    min_redemption_points = serializers.IntegerField(min_value=1, required=False)
    max_redemption_points = serializers.IntegerField(min_value=1, required=False)
    points_expiry_months = serializers.IntegerField(min_value=1, max_value=24, required=False)
    welcome_bonus_points = serializers.IntegerField(min_value=0, required=False)
    birthday_bonus_points = serializers.IntegerField(min_value=0, required=False)
    referral_bonus_points = serializers.IntegerField(min_value=0, required=False)
    bronze_threshold = serializers.IntegerField(min_value=0, required=False)
    silver_threshold = serializers.IntegerField(min_value=0, required=False)
    gold_threshold = serializers.IntegerField(min_value=0, required=False)
    platinum_threshold = serializers.IntegerField(min_value=0, required=False)
    
    def validate(self, data):
        # Ensure thresholds are in order
        silver = data.get('silver_threshold')
        gold = data.get('gold_threshold')
        platinum = data.get('platinum_threshold')
        
        if silver and gold and silver >= gold:
            raise serializers.ValidationError("Silver threshold must be less than Gold threshold")
        if gold and platinum and gold >= platinum:
            raise serializers.ValidationError("Gold threshold must be less than Platinum threshold")
        
        return data



class PointsTransactionSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.EmailField(source='customer.email', read_only=True)
    retailer_name = serializers.SerializerMethodField()
    
    class Meta:
        model = PointsTransaction
        fields = [
            'transaction_id', 'customer', 'customer_name', 'customer_email',
            'retailer', 'retailer_name', 'transaction_type', 'points',
            'balance_after', 'description', 'metadata', 'created_at', 'expires_at'
        ]
        read_only_fields = ['transaction_id', 'balance_after', 'created_at']
    
    def get_customer_name(self, obj):
        return obj.customer.get_full_name() or obj.customer.email.split('@')[0]
    
    def get_retailer_name(self, obj):
        if obj.retailer:
            return obj.retailer.get_full_name() or obj.retailer.email
        return None


class RedeemPointsSerializer(serializers.Serializer):
    reward_id = serializers.IntegerField()
    order_id = serializers.CharField(required=False, allow_null=True)
    metadata = serializers.DictField(required=False, default=dict)


class CustomerPointsSummarySerializer(serializers.Serializer):
    total_earned = serializers.IntegerField()
    total_redeemed = serializers.IntegerField()
    total_expired = serializers.IntegerField()
    available_points = serializers.IntegerField()
    current_tier = serializers.CharField()
    points_to_next_tier = serializers.IntegerField()
    next_tier = serializers.CharField()
    expiring_points = serializers.IntegerField()
    expiring_date = serializers.DateField(allow_null=True)


class RewardSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    is_low_stock = serializers.SerializerMethodField()
    
    class Meta:
        model = Reward
        fields = [
            'id', 'name', 'category', 'category_display', 'points_required',
            'description', 'value', 'image_url', 'icon', 'stock', 'is_active',
            'is_popular', 'total_redeemed', 'is_low_stock', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'total_redeemed', 'created_at', 'updated_at']
    
    def get_is_low_stock(self, obj):
        if obj.stock == -1:
            return False
        return obj.stock < 20


class CreateRewardSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    category = serializers.ChoiceField(choices=Reward.REWARD_CATEGORIES)
    points_required = serializers.IntegerField(min_value=1)
    description = serializers.CharField()
    value = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    image_url = serializers.URLField(required=False, allow_blank=True)
    icon = serializers.CharField(max_length=50, required=False, allow_blank=True)
    stock = serializers.IntegerField(default=999)
    is_active = serializers.BooleanField(default=True)
    is_popular = serializers.BooleanField(default=False)


class UpdateRewardSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200, required=False)
    category = serializers.ChoiceField(choices=Reward.REWARD_CATEGORIES, required=False)
    points_required = serializers.IntegerField(min_value=1, required=False)
    description = serializers.CharField(required=False)
    value = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    image_url = serializers.URLField(required=False, allow_blank=True)
    icon = serializers.CharField(max_length=50, required=False, allow_blank=True)
    stock = serializers.IntegerField(required=False)
    is_active = serializers.BooleanField(required=False)
    is_popular = serializers.BooleanField(required=False)



class CampaignSerializer(serializers.ModelSerializer):
    campaign_type_display = serializers.CharField(source='get_campaign_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_active_now = serializers.BooleanField(read_only=True)
    days_remaining = serializers.SerializerMethodField()
    
    class Meta:
        model = Campaign
        fields = [
            'id', 'name', 'campaign_type', 'campaign_type_display', 'bonus_points',
            'description', 'eligible_tiers', 'min_order_value', 'start_date', 'end_date',
            'status', 'status_display', 'total_redeemed', 'is_active_now', 'days_remaining',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'total_redeemed', 'created_at', 'updated_at', 'is_active_now', 'days_remaining']
    
    def get_days_remaining(self, obj):
        from django.utils import timezone
        now = timezone.now()
        if obj.end_date > now and obj.status == 'active':
            return (obj.end_date - now).days
        return 0


class CreateCampaignSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    campaign_type = serializers.ChoiceField(choices=Campaign.CAMPAIGN_TYPES)
    bonus_points = serializers.IntegerField(min_value=1)
    description = serializers.CharField(required=False, allow_blank=True)
    eligible_tiers = serializers.ListField(
        child=serializers.ChoiceField(choices=['bronze', 'silver', 'gold', 'platinum']),
        required=False,
        default=list
    )
    min_order_value = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    
    def validate(self, data):
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError("End date must be after start date")
        return data


class UpdateCampaignSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200, required=False)
    campaign_type = serializers.ChoiceField(choices=Campaign.CAMPAIGN_TYPES, required=False)
    bonus_points = serializers.IntegerField(min_value=1, required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    eligible_tiers = serializers.ListField(
        child=serializers.ChoiceField(choices=['bronze', 'silver', 'gold', 'platinum']),
        required=False
    )
    min_order_value = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    start_date = serializers.DateTimeField(required=False)
    end_date = serializers.DateTimeField(required=False)
    status = serializers.ChoiceField(choices=Campaign.CAMPAIGN_STATUS, required=False)
    
    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError("End date must be after start date")
        return data