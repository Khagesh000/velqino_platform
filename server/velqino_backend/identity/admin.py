from django.contrib import admin
from .models import User, WholesalerProfile

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