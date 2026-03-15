from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, RegexValidator
from django.utils import timezone
import json


class User(AbstractUser):
    ROLE_CHOICES = (
        ("wholesaler", "Wholesaler"),
        ("retailer", "Retailer"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
    # Mobile with validation
    mobile = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in format: '+999999999'"
            )
        ]
    )
    
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # ========== FIX FOR THE ERROR - ADD THESE TWO FIELDS ==========
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='identity_user_groups',  # Custom name to avoid clash
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='identity_user_permissions',  # Custom name to avoid clash
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    # ==============================================================
    
    class Meta:
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]

    def __str__(self):
        return f"{self.username} ({self.role})"


class WholesalerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="wholesaler_profile"
    )

    # Business Information
    business_name = models.CharField(max_length=255, db_index=True)
    business_type = models.CharField(max_length=100)
    
    # GST with validation
    gst_number = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        validators=[
            RegexValidator(
                regex=r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
                message="Invalid GST format"
            )
        ]
    )
    
    # PAN with validation
    pan_number = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
                message="Invalid PAN format"
            )
        ]
    )
    
    business_description = models.TextField(blank=True, null=True)

    # Address
    shop_address = models.TextField()
    city = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10, db_index=True)
    landmark = models.CharField(max_length=255, blank=True, null=True)

    # Product Details
    categories = models.JSONField(default=list)
    minimum_order_quantity = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )
    price_range = models.CharField(max_length=50)

    # Bank Details
    account_holder = models.CharField(max_length=255, blank=True, null=True)
    bank_name = models.CharField(max_length=255, blank=True, null=True)
    account_number = models.CharField(max_length=30, blank=True, null=True)
    ifsc_code = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{4}0[A-Z0-9]{6}$',
                message="Invalid IFSC format"
            )
        ]
    )
    upi_id = models.CharField(max_length=255, blank=True, null=True)

    shop_photo = models.ImageField(upload_to="shop_photos/", blank=True, null=True)
    verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['business_name']),
            models.Index(fields=['verified', 'city']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return self.business_name
    
    def verify_profile(self):
        """Verify the wholesaler profile"""
        self.verified = True
        self.verification_date = timezone.now()
        self.save()
        
        # Clear cache when profile is updated
        from django.core.cache import cache
        cache.delete(f"wholesaler_profile_{self.user_id}")
        cache.delete(f"wholesaler_list_city_{self.city}")