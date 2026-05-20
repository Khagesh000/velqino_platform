from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from cloudinary.models import CloudinaryField


class Category(models.Model):
    """Product categories"""
    name = models.CharField(max_length=100, unique=True, db_index=True)
    slug = models.SlugField(unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['slug'])]

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    """Product catalog"""
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('draft', 'Draft'),
        ('archived', 'Archived'),
    )

    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    seller_type = models.CharField(max_length=20, choices=[('wholesaler', 'Wholesaler'), ('retailer', 'Retailer')], default='wholesaler', db_index=True)


    # ✅ ADD THESE 2 FIELDS RIGHT AFTER seller
    wholesaler = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='wholesaler_products',
        null=True,
        blank=True
    )
    retailer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='retailer_products',
        null=True,
        blank=True
    )

    
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')

    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(unique=True)
    sku = models.CharField(max_length=100, unique=True, db_index=True, blank=True, null=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])

    retail_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        default=0,
        help_text="MRP for customers"
    )
    
    min_order_qty = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text="Minimum quantity per order"
    )
    
    compare_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])

    stock = models.IntegerField(default=1, validators=[MinValueValidator(0)])
    threshold = models.IntegerField(default=10, help_text="Low stock alert level")

    description = models.TextField(blank=True)
    brand = models.CharField(max_length=100, blank=True)

    pattern = models.CharField(max_length=50, blank=True, help_text="Striped, checked, floral, solid, graphic")
    primary_color = models.CharField(max_length=50, blank=True)
    secondary_colors = models.JSONField(default=list, blank=True)

    weight = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    dimensions = models.CharField(max_length=50, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', db_index=True)
  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_sold = models.IntegerField(default=0, db_index=True, help_text="Total number sold")

    class Meta:
        indexes = [
            models.Index(fields=['seller', 'status']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['-total_sold']),
            models.Index(fields=['sku']),
            models.Index(fields=['brand']),

            models.Index(fields=['seller_type', 'status']),
            models.Index(fields=['price']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.sku})"

    def is_low_stock(self):
        return self.stock <= self.threshold

    def save(self, *args, **kwargs):
        # ✅ SKU FIRST
        if not self.sku:
            import uuid
            self.sku = f"PROD-{uuid.uuid4().hex[:8].upper()}"

        # ✅ SLUG SECOND (uses SKU)
        if not self.slug:
            from django.utils.text import slugify
            base_slug = slugify(self.name)
            self.slug = f"{base_slug}-{self.sku}"[:50]

        super().save(*args, **kwargs)


class ProductImage(models.Model):
    """Multiple images per product"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField(
    'image',
    folder='products',
    overwrite=True,
    invalidate=True
    )
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    is_front = models.BooleanField(default=True, help_text="Is this front view?")
    
    class Meta:
        ordering = ['order']
        indexes = [
            models.Index(fields=['product', 'is_primary']),
            models.Index(fields=['product', 'is_front']),
        ]
    
    def __str__(self):
        return f"Image for {self.product.name}"


class ProductVariant(models.Model):
    """Size/color variations"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    
    color = models.CharField(max_length=50, blank=True)
    size = models.CharField(max_length=50, blank=True)
    sku = models.CharField(max_length=100, unique=True)
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    class Meta:
        indexes = [models.Index(fields=['sku'])]
        unique_together = ['product', 'color', 'size']
    
    def __str__(self):
        return f"{self.product.name} - {self.color} {self.size}"
    

class Wishlist(models.Model):
    """User wishlist model"""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wishlist_items'
    )
    product = models.ForeignKey(
        'Product',
        on_delete=models.CASCADE,
        related_name='wishlisted_by'
    )
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'product']
        indexes = [
            models.Index(fields=['user', '-added_at']),
            models.Index(fields=['product']),
        ]
        ordering = ['-added_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.product.name}"
    

class DealOfTheDay(models.Model):
    """Wholesaler-controlled daily deals"""
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='daily_deals')
    wholesaler = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role': 'wholesaler'})
    
    # Deal-specific pricing (overrides product price during deal period)
    deal_price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price_was = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    
    # Scheduling
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    # Display order (for multiple deals)
    display_order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['display_order', 'start_date']
        indexes = [
            models.Index(fields=['wholesaler', 'is_active']),
            models.Index(fields=['start_date', 'end_date']),
        ]
    
    def __str__(self):
        return f"Deal: {self.product.name} - ₹{self.deal_price} (was ₹{self.original_price_was})"
    
    def save(self, *args, **kwargs):
        if not self.original_price_was:
            self.original_price_was = self.product.price
        super().save(*args, **kwargs)