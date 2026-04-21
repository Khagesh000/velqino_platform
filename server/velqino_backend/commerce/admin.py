from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem, StockHistory

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
