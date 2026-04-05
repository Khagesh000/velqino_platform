from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings


class Category(models.Model):
    """Product categories"""
    name = models.CharField(max_length=100, unique=True, db_index=True)
    slug = models.SlugField(unique=True)
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
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')

    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(unique=True)
    sku = models.CharField(max_length=100, unique=True, db_index=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    compare_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])

    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
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

    class Meta:
        indexes = [
            models.Index(fields=['seller', 'status']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['sku']),
            models.Index(fields=['brand']),
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
    image = models.ImageField(upload_to='products/%Y/%m/')
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