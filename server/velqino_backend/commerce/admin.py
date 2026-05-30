from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem, StockHistory, LoyaltySettings, PointsTransaction, Reward, Campaign, Expense

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('price_at_add', 'subtotal')
    fields = ('product', 'quantity', 'price_at_add', 'selected_size', 'selected_color', 'subtotal')
    
    def subtotal(self, obj):
        return obj.subtotal
    subtotal.short_description = 'Subtotal'


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'user_type', 'status', 'item_count', 'total', 'last_activity', 'created_at')
    list_filter = ('status', 'user_type', 'created_at')
    search_fields = ('user__email', 'user__phone', 'session_id', 'coupon_code')
    readonly_fields = ('subtotal', 'total', 'item_count', 'unique_item_count', 'created_at', 'updated_at', 'last_activity')
    inlines = [CartItemInline]
    fieldsets = (
        ('Cart Information', {
            'fields': ('user', 'session_id', 'user_type', 'status')
        }),
        ('Coupon Details', {
            'fields': ('coupon_code', 'coupon_discount')
        }),
        ('Calculations', {
            'fields': ('subtotal', 'total', 'item_count', 'unique_item_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'last_activity'),
            'classes': ('collapse',)
        }),
    )
    
    def item_count(self, obj):
        return obj.item_count
    item_count.short_description = 'Total Items'
    
    def unique_item_count(self, obj):
        return obj.unique_item_count
    unique_item_count.short_description = 'Unique Products'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'product', 'quantity', 'price_at_add', 'subtotal', 'selected_size', 'selected_color')
    list_filter = ('selected_size', 'selected_color', 'added_at')
    search_fields = ('product__name', 'product__sku', 'cart__user__email', 'cart__session_id')
    readonly_fields = ('subtotal', 'saved_amount', 'added_at', 'updated_at')
    fields = ('cart', 'product', 'quantity', 'price_at_add', 'selected_size', 'selected_color', 'subtotal', 'saved_amount', 'added_at', 'updated_at')
    
    def subtotal(self, obj):
        return obj.subtotal
    subtotal.short_description = 'Subtotal'
    
    def saved_amount(self, obj):
        return obj.saved_amount
    saved_amount.short_description = 'You Save'

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'product_sku', 'quantity', 'price', 'total')
    can_delete = False
    
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer', 'retailer', 'wholesaler', 'grand_total', 'status', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_status', 'delivery_type', 'created_at')
    search_fields = ('order_number', 'tracking_number', 'customer__email', 'customer__mobile')
    readonly_fields = ('order_number', 'created_at', 'updated_at')
    inlines = [OrderItemInline]



@admin.register(StockHistory)
class StockHistoryAdmin(admin.ModelAdmin):
    list_display = ('product', 'transaction_type', 'quantity', 'old_stock', 'new_stock', 'created_at')
    list_filter = ('transaction_type', 'created_at')
    search_fields = ('product__name', 'product__sku')
    readonly_fields = ('created_at',)



#----------------------------------------------Retailers Loyality--------------------------------------------
@admin.register(LoyaltySettings)
class LoyaltySettingsAdmin(admin.ModelAdmin):
    list_display = ['points_per_rupee', 'min_redemption_points', 'max_redemption_points', 
                    'points_expiry_months', 'updated_at']
    
    fieldsets = (
        ('Point Conversion', {
            'fields': ('points_per_rupee', 'min_redemption_points', 'max_redemption_points')
        }),
        ('Expiry Settings', {
            'fields': ('points_expiry_months',)
        }),
        ('Bonus Settings', {
            'fields': ('welcome_bonus_points', 'birthday_bonus_points', 'referral_bonus_points')
        }),
        ('Tier Thresholds (in ₹ spent)', {
            'fields': ('bronze_threshold', 'silver_threshold', 'gold_threshold', 'platinum_threshold')
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one settings record
        return not LoyaltySettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of settings
        return False


@admin.register(PointsTransaction)
class PointsTransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'customer', 'transaction_type', 'points', 
                    'balance_after', 'created_at']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['transaction_id', 'customer__email', 'description']
    readonly_fields = ['transaction_id', 'created_at']
    
    fieldsets = (
        ('Transaction Info', {
            'fields': ('transaction_id', 'customer', 'retailer', 'transaction_type', 
                       'points', 'balance_after')
        }),
        ('Details', {
            'fields': ('order', 'reward', 'description', 'metadata')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'expires_at')
        }),
    )


@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'points_required', 'stock', 'is_active', 
                    'total_redeemed', 'is_popular']
    list_filter = ['category', 'is_active', 'is_popular']
    search_fields = ['name', 'description']
    list_editable = ['is_active', 'is_popular', 'stock']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'category', 'points_required', 'description')
        }),
        ('Value & Media', {
            'fields': ('value', 'image_url', 'icon')
        }),
        ('Inventory', {
            'fields': ('stock', 'total_redeemed', 'is_active', 'is_popular')
        }),
    )
    
    actions = ['mark_active', 'mark_inactive', 'mark_popular']
    
    def mark_active(self, request, queryset):
        queryset.update(is_active=True)
    mark_active.short_description = "Mark selected rewards as Active"
    
    def mark_inactive(self, request, queryset):
        queryset.update(is_active=False)
    mark_inactive.short_description = "Mark selected rewards as Inactive"
    
    def mark_popular(self, request, queryset):
        queryset.update(is_popular=True)
    mark_popular.short_description = "Mark selected rewards as Popular"


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['name', 'campaign_type', 'bonus_points', 'status', 
                    'start_date', 'end_date', 'total_redeemed']
    list_filter = ['campaign_type', 'status']
    search_fields = ['name', 'description']
    list_editable = ['status']
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'campaign_type', 'bonus_points', 'description')
        }),
        ('Eligibility', {
            'fields': ('eligible_tiers', 'min_order_value')
        }),
        ('Schedule', {
            'fields': ('start_date', 'end_date', 'status')
        }),
        ('Tracking', {
            'fields': ('total_redeemed',)
        }),
    )
    
    actions = ['activate_campaigns', 'cancel_campaigns']
    
    def activate_campaigns(self, request, queryset):
        from django.utils import timezone
        now = timezone.now()
        updated = queryset.filter(start_date__lte=now, end_date__gte=now).update(status='active')
        queryset.filter(start_date__gt=now).update(status='scheduled')
        self.message_user(request, f'{updated} campaigns activated')
    activate_campaigns.short_description = "Activate selected campaigns"
    
    def cancel_campaigns(self, request, queryset):
        queryset.update(status='cancelled')
        self.message_user(request, 'Selected campaigns cancelled')
    cancel_campaigns.short_description = "Cancel selected campaigns"



@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['id', 'retailer', 'category', 'amount', 'date', 'payment_method']
    list_filter = ['category', 'payment_method', 'date']
    search_fields = ['retailer__email', 'description']
    date_hierarchy = 'date'