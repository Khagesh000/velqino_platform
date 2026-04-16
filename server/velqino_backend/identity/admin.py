from django.contrib import admin
from .models import User, WholesalerProfile, RetailerProfile, CustomerProfile

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email', 'mobile', 'role', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['username', 'email', 'mobile']

@admin.register(WholesalerProfile)
class WholesalerProfileAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'business_name', 'business_type', 'city', 
        'verified', 'created_at'
    ]
    list_filter = ['verified', 'city', 'business_type']
    search_fields = ['business_name', 'shop_address', 'gst_number']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Business Information', {
            'fields': ('user', 'business_name', 'business_type', 
                      'gst_number', 'pan_number', 'business_description')
        }),
        ('Address', {
            'fields': ('shop_address', 'city', 'state', 'pincode', 'landmark')
        }),
        ('Products', {
            'fields': ('categories', 'minimum_order_quantity', 'price_range')
        }),
        ('Bank Details', {
            'fields': ('account_holder', 'bank_name', 'account_number', 
                      'ifsc_code', 'upi_id')
        }),
        ('Status', {
            'fields': ('verified', 'verification_date', 'shop_photo')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )



# Retailer's
@admin.register(RetailerProfile)
class RetailerProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'business_name', 'user_email', 'city', 'pincode', 'is_active', 'created_at']
    list_filter = ['is_active', 'is_verified', 'city', 'state']
    search_fields = ['business_name', 'user__email', 'user__mobile', 'gst_number']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'business_name', 'gst_number')
        }),
        ('Address Information', {
            'fields': ('shipping_address', 'city', 'state', 'pincode')
        }),
        ('Status', {
            'fields': ('is_active', 'is_verified')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'



# identity/admin.py

# ✅ ADD Customer Admin
@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'user_email', 'phone', 'city', 'created_at']
    list_filter = ['city', 'state']
    search_fields = ['full_name', 'user__email', 'user__mobile', 'phone']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'full_name', 'phone')
        }),
        ('Address Information', {
            'fields': ('address_line1', 'address_line2', 'city', 'state', 'pincode', 'landmark')
        }),
        ('Preferences', {
            'fields': ('email_notifications', 'sms_notifications')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'