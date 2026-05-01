from django.contrib import admin
from .models import Category, Product, ProductImage, ProductVariant, Wishlist


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'slug', 'parent', 'created_at']
    list_filter = ['parent']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'sku', 'price', 'stock', 'status', 
                   'pattern', 'primary_color', 'seller', 'created_at']
    list_filter = ['status', 'category', 'pattern', 'primary_color', 'seller', 'created_at']
    search_fields = ['name', 'sku', 'brand', 'description']
    readonly_fields = ['created_at', 'updated_at']
    list_select_related = ['category', 'seller']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'sku', 'seller', 'category', 'brand', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'compare_price', 'cost')
        }),
        ('Inventory', {
            'fields': ('stock', 'threshold')
        }),
        ('AI Detected', {
            'fields': ('pattern', 'primary_color', 'secondary_colors'),
            'classes': ('collapse',)
        }),
        ('Shipping', {
            'fields': ('weight', 'dimensions')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'image', 'is_primary', 'is_front', 'order']
    list_filter = ['is_primary', 'is_front', 'product']
    search_fields = ['product__name']


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'color', 'size', 'sku', 'stock', 'price']
    list_filter = ['product']
    search_fields = ['sku', 'product__name']


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'product', 'added_at']
    list_filter = ['added_at']
    search_fields = ['user__email', 'product__name']
    readonly_fields = ['added_at']

