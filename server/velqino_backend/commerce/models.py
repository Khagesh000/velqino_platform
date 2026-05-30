import uuid
from django.db import models
from django.conf import settings
from catalog.models import Product
from django.core.validators import MinValueValidator
from decimal import Decimal
from identity.models import User
from django.utils import timezone

class Cart(models.Model):
    """Shopping Cart - Supports guest and authenticated users"""
    
    CART_STATUS = (
        ('active', 'Active'),
        ('abandoned', 'Abandoned'),
        ('converted', 'Converted to Order'),
    )
    
    # User can be null for guest users
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='carts',
        null=True,
        blank=True
    )
    
    # Session ID for guest users
    session_id = models.CharField(max_length=100, db_index=True, null=True, blank=True)
    
    # User type at cart creation (wholesaler/retailer/customer)
    user_type = models.CharField(max_length=20, choices=User.ROLE_CHOICES, default='customer')
    
    # Cart metadata
    status = models.CharField(max_length=20, choices=CART_STATUS, default='active', db_index=True)
    coupon_code = models.CharField(max_length=50, blank=True)
    coupon_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['session_id', 'status']),
            models.Index(fields=['-last_activity']),
        ]
        ordering = ['-updated_at']
    
    def __str__(self):
        if self.user:
            return f"Cart {self.id} - {self.user.email} ({self.user_type})"
        return f"Cart {self.id} - Guest ({self.session_id})"
    
    @property
    def subtotal(self):
        """Calculate subtotal of all items"""
        return sum(item.subtotal for item in self.items.all())
    
    @property
    def discount_amount(self):
        """Calculate discount from coupon"""
        return self.coupon_discount
    
    @property
    def total(self):
        """Calculate final total after discount"""
        return self.subtotal - self.discount_amount
    
    @property
    def item_count(self):
        """Total quantity of items"""
        return sum(item.quantity for item in self.items.all())
    
    @property
    def unique_item_count(self):
        """Number of unique products in cart"""
        return self.items.count()
    
    def apply_coupon(self, code, discount):
        """Apply coupon to cart"""
        self.coupon_code = code
        self.coupon_discount = min(discount, self.subtotal)  # Don't exceed subtotal
        self.save()
    
    def remove_coupon(self):
        """Remove applied coupon"""
        self.coupon_code = ''
        self.coupon_discount = 0
        self.save()
    
    def is_abandoned(self):
        """Check if cart is abandoned (no activity for 7 days)"""
        from django.utils import timezone
        from datetime import timedelta
        return self.last_activity < timezone.now() - timedelta(days=7)
    
    def merge_with_user_cart(self, user_cart):
        """Merge guest cart with user's existing cart when user logs in"""
        for guest_item in self.items.all():
            user_item = user_cart.items.filter(product=guest_item.product).first()
            if user_item:
                user_item.quantity += guest_item.quantity
                user_item.save()
                guest_item.delete()
            else:
                guest_item.cart = user_cart
                guest_item.save()
        
        # Update user cart with any coupon
        if self.coupon_code and not user_cart.coupon_code:
            user_cart.apply_coupon(self.coupon_code, self.coupon_discount)
        
        self.delete()
        return user_cart


class CartItem(models.Model):
    """Individual item in shopping cart"""
    
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('catalog.Product', on_delete=models.CASCADE, related_name='cart_items')
    
    # Quantity and pricing
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    price_at_add = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Selected options
    selected_size = models.CharField(max_length=50, blank=True)
    selected_color = models.CharField(max_length=50, blank=True)
    
    # Additional metadata
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['cart', 'product']),
            models.Index(fields=['-added_at']),
        ]
        unique_together = ['cart', 'product', 'selected_size', 'selected_color']
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name} in Cart {self.cart.id}"
    
    @property
    def subtotal(self):
        """Calculate line item subtotal"""
        return self.price_at_add * self.quantity
    
    @property
    def saved_amount(self):
        """Calculate savings if compare_price exists"""
        if self.product.compare_price and self.product.compare_price > self.price_at_add:
            return (self.product.compare_price - self.price_at_add) * self.quantity
        return 0
    
    def update_quantity(self, new_quantity):
        """Update quantity with validation"""
        if new_quantity < 1:
            self.delete()
            return None
        
        # Check stock availability
        if new_quantity > self.product.stock:
            raise ValueError(f"Only {self.product.stock} items available")
        
        self.quantity = new_quantity
        self.save()
        return self
    


class Order(models.Model):
    """Advanced Order model with indexing and monitoring"""
    
    STATUS_CHOICES = (
        ('pending', 'Pending Payment'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    )
    
    PAYMENT_STATUS = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    
    DELIVERY_CHOICES = (
        ('standard', 'Standard (5-7 days)'),
        ('express', 'Express (2-3 days)'),
    )
    
    # Order identifiers
    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    tracking_number = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    
    # User connections (MULTI-ROLE SUPPORT)
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='customer_orders',
        db_index=True
    )
    retailer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='retailer_orders',
        null=True,
        blank=True,
        db_index=True
    )
    wholesaler = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wholesaler_orders',
        null=True,
        blank=True,
        db_index=True
    )
    
    # Order details
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending', db_index=True)
    payment_method = models.CharField(max_length=50)
    
    # Address (denormalized for performance)
    shipping_name = models.CharField(max_length=255)
    shipping_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_pincode = models.CharField(max_length=10, db_index=True)
    
    # Delivery
    delivery_type = models.CharField(max_length=20, choices=DELIVERY_CHOICES, default='standard')
    expected_delivery_date = models.DateField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Timestamps with indexes
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
   
    
    class Meta:
        indexes = [
            models.Index(fields=['customer', 'status']),
            models.Index(fields=['retailer', 'status']),
            models.Index(fields=['wholesaler', 'status']),
            models.Index(fields=['order_number']),
            models.Index(fields=['tracking_number']),
            models.Index(fields=['created_at']),
            models.Index(fields=['status', 'payment_status']),
            models.Index(fields=['shipping_pincode']),

            models.Index(fields=['wholesaler', 'status', 'created_at']),
            models.Index(fields=['wholesaler', 'status', '-created_at']),
            models.Index(fields=['created_at', 'status']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order {self.order_number} - {self.customer.email}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"ORD-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)
    
    def can_cancel(self):
        """Check if order can be cancelled"""
        return self.status in ['pending', 'confirmed'] and self.payment_status != 'paid'
    
    def update_stock(self, deduct=True):
        """Update stock for all order items"""
        from catalog.tasks import update_product_stock_task
        for item in self.items.all():
            update_product_stock_task.delay(item.product.id, item.quantity, deduct)


class OrderItem(models.Model):
    """Order items with performance optimization"""
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', db_index=True)
    product = models.ForeignKey('catalog.Product', on_delete=models.CASCADE, db_index=True)
    
    # Snapshot of product details at order time (for historical accuracy)
    product_name = models.CharField(max_length=255, db_index=True)
    product_sku = models.CharField(max_length=100, db_index=True)
    product_image = models.CharField(max_length=500, blank=True)
    
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Seller info snapshot
    seller_id = models.IntegerField(db_index=True)
    seller_name = models.CharField(max_length=255)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['order', 'product']),
            models.Index(fields=['product_sku']),
            models.Index(fields=['seller_id']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"{self.product_name} x {self.quantity}"


class StockHistory(models.Model):
    """Track all stock changes for monitoring"""
    
    TRANSACTION_TYPES = (
        ('order', 'Order Placed'),
        ('cancel', 'Order Cancelled'),
        ('return', 'Product Returned'),
        ('restock', 'Restocked'),
        ('adjust', 'Manual Adjustment'),
    )
    
    product = models.ForeignKey('catalog.Product', on_delete=models.CASCADE, related_name='stock_history', db_index=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES, db_index=True)
    quantity = models.IntegerField()
    old_stock = models.IntegerField()
    new_stock = models.IntegerField()
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['product', '-created_at']),
            models.Index(fields=['transaction_type', 'created_at']),
            models.Index(fields=['order']),
        ]
        ordering = ['-created_at']


class OrderStatusHistory(models.Model):
    """Track order status changes"""
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.order.order_number} → {self.status}"
    


class ReturnRequest(models.Model):
    """Return and Exchange Request Model"""
    
    RETURN_STATUS = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    )
    
    RETURN_TYPE = (
        ('return', 'Return'),
        ('exchange', 'Exchange'),
    )
    
    # Identifiers
    return_number = models.CharField(max_length=50, unique=True, db_index=True)
    
    # Relationships
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='return_requests')
    retailer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='retailer_returns')
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='customer_returns')
    
    # Return details
    return_type = models.CharField(max_length=20, choices=RETURN_TYPE, default='return')
    status = models.CharField(max_length=20, choices=RETURN_STATUS, default='pending')
    reason = models.TextField()
    comments = models.TextField(blank=True)
    
    # Items and amount
    items = models.JSONField(default=list)  # Stores list of returned items
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Images
    images = models.JSONField(default=list, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['return_number']),
            models.Index(fields=['status']),
            models.Index(fields=['retailer', 'status']),
            models.Index(fields=['order']),
        ]
    
    def __str__(self):
        return f"{self.return_number} - {self.order.order_number}"
    
    def save(self, *args, **kwargs):
        if not self.return_number:
            self.return_number = f"RET-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class Review(models.Model):
    """Product Review Model"""
    
    RATING_CHOICES = (
        (1, '1 Star - Poor'),
        (2, '2 Stars - Fair'),
        (3, '3 Stars - Good'),
        (4, '4 Stars - Very Good'),
        (5, '5 Stars - Excellent'),
    )
    
    # Relationships
    product = models.ForeignKey('catalog.Product', on_delete=models.CASCADE, related_name='reviews')
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    
    # Review content
    rating = models.IntegerField(choices=RATING_CHOICES)
    title = models.CharField(max_length=200)
    comment = models.TextField()
    
    # Images
    images = models.JSONField(default=list, blank=True)
    
    # Status
    is_verified_purchase = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)  # Auto-approve or admin approval
    is_featured = models.BooleanField(default=False)
    
    # Helpful votes
    helpful_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product', '-created_at']),
            models.Index(fields=['customer', '-created_at']),
            models.Index(fields=['rating']),
            models.Index(fields=['is_approved']),
        ]
        unique_together = ['product', 'customer']  # One review per product per customer
    
    def __str__(self):
        return f"{self.product.name} - {self.rating}★ by {self.customer.email}"
    
    def save(self, *args, **kwargs):
        # Auto-mark as verified purchase if customer actually bought this product
        if not self.is_verified_purchase and self.order:
            self.is_verified_purchase = True
        super().save(*args, **kwargs)




#-------------------------------------------------Retailers Loyality------------------------
class LoyaltySettings(models.Model):
    """Store loyalty program configuration"""
    
    # Point conversion
    points_per_rupee = models.DecimalField(max_digits=5, decimal_places=2, default=1.00)
    min_redemption_points = models.IntegerField(default=100)
    max_redemption_points = models.IntegerField(default=5000)
    
    # Expiry settings
    points_expiry_months = models.IntegerField(default=6)
    
    # Bonus settings
    welcome_bonus_points = models.IntegerField(default=50)
    birthday_bonus_points = models.IntegerField(default=100)
    referral_bonus_points = models.IntegerField(default=200)
    
    # Tier thresholds
    bronze_threshold = models.IntegerField(default=0)
    silver_threshold = models.IntegerField(default=10000)
    gold_threshold = models.IntegerField(default=25000)
    platinum_threshold = models.IntegerField(default=50000)
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Loyalty Settings"
    
    def __str__(self):
        return f"Loyalty Settings (Points per ₹: {self.points_per_rupee})"


class PointsTransaction(models.Model):
    """Track all points movements"""
    
    TRANSACTION_TYPES = (
        ('earned', 'Earned from Purchase'),
        ('redeemed', 'Redeemed for Reward'),
        ('expired', 'Expired Points'),
        ('bonus', 'Bonus Points'),
        ('adjusted', 'Manual Adjustment'),
    )
    
    transaction_id = models.CharField(max_length=50, unique=True, db_index=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, 
                                 related_name='points_transactions')
    retailer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, 
                                 null=True, blank=True, related_name='retailer_points_transactions')
    
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES, db_index=True)
    points = models.IntegerField()
    balance_after = models.IntegerField()
    
    # Related objects
    order = models.ForeignKey('Order', on_delete=models.SET_NULL, null=True, blank=True,
                              related_name='points_transactions')
    reward = models.ForeignKey('Reward', on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='points_transactions')
    
    description = models.CharField(max_length=255)
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['customer', '-created_at']),
            models.Index(fields=['transaction_type', 'created_at']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"{self.transaction_id} - {self.customer.email} - {self.transaction_type}: {self.points}"
    
    def save(self, *args, **kwargs):
        if not self.transaction_id:
            self.transaction_id = f"PTX-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)


class Reward(models.Model):
    """Rewards catalog for points redemption"""
    
    REWARD_CATEGORIES = (
        ('discount', 'Discount Coupon'),
        ('shipping', 'Free Shipping'),
        ('gift', 'Gift Card'),
        ('product', 'Free Product'),
        ('access', 'Early Access'),
    )
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=REWARD_CATEGORIES, db_index=True)
    points_required = models.IntegerField(validators=[MinValueValidator(1)])
    description = models.TextField()
    
    # Reward value (e.g., discount amount in rupees)
    value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Media
    image_url = models.URLField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    
    # Availability
    stock = models.IntegerField(default=999, help_text="Remaining quantity, -1 for unlimited")
    is_active = models.BooleanField(default=True, db_index=True)
    is_popular = models.BooleanField(default=False)
    
    # Usage tracking
    total_redeemed = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['points_required']
        indexes = [
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['points_required']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.points_required} pts)"
    
    def can_redeem(self, customer_points):
        return self.is_active and (self.stock > 0 or self.stock == -1) and customer_points >= self.points_required


class Campaign(models.Model):
    CAMPAIGN_TYPES = (
        ('bonus', 'Bonus Points'),
        ('birthday', 'Birthday Bonus'),
        ('referral', 'Referral Bonus'),
        ('welcome', 'Welcome Bonus'),
        ('festival', 'Festival Special'),
    )
    
    CAMPAIGN_STATUS = (
        ('scheduled', 'Scheduled'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    )
    
    name = models.CharField(max_length=200)
    campaign_type = models.CharField(max_length=20, choices=CAMPAIGN_TYPES, db_index=True)
    bonus_points = models.IntegerField()
    description = models.TextField(blank=True)
    eligible_tiers = models.JSONField(default=list, blank=True)
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    start_date = models.DateTimeField(db_index=True)
    end_date = models.DateTimeField(db_index=True)
    status = models.CharField(max_length=20, choices=CAMPAIGN_STATUS, default='scheduled', db_index=True)
    total_redeemed = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'start_date', 'end_date']),
            models.Index(fields=['campaign_type', 'status']),
        ]
    
    def is_active_now(self):
        from django.utils import timezone
        now = timezone.now()
        return self.start_date <= now <= self.end_date and self.status == 'active'
    
    

#----------------------------------Analytics report---------------------------------
class Expense(models.Model):
    EXPENSE_CATEGORIES = (
        ('rent', 'Rent'),
        ('salary', 'Staff Salary'),
        ('utilities', 'Utilities'),
        ('marketing', 'Marketing'),
        ('maintenance', 'Maintenance'),
        ('tax', 'Tax'),
        ('shipping', 'Shipping'),
        ('other', 'Other'),
    )
    
    PAYMENT_METHODS = (
        ('cash', 'Cash'),
        ('bank', 'Bank Transfer'),
        ('upi', 'UPI'),
        ('card', 'Card'),
    )
    
    retailer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expenses')
    category = models.CharField(max_length=20, choices=EXPENSE_CATEGORIES, db_index=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(db_index=True)
    description = models.TextField(blank=True)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, default='cash')
    receipt_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date']
        indexes = [
            models.Index(fields=['retailer', 'date']),
            models.Index(fields=['retailer', 'category']),
        ]
    
    def __str__(self):
        return f"{self.category} - ₹{self.amount} - {self.date}"