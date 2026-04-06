from django.urls import path
from . import views

urlpatterns = [
    # Product endpoints
    path('products/', views.product_list, name='product-list'),
    path('products/<int:product_id>/', views.product_detail, name='product-detail'),
    path('products/low-stock/', views.low_stock_products, name='low-stock'),
    path('products/bulk/', views.bulk_product_action, name='bulk-action'),
    
    # NEW: Bulk upload endpoints
    path('products/bulk-upload-images/', views.bulk_image_upload, name='bulk-image-upload'),
    path('products/bulk-upload-video/', views.bulk_video_upload, name='bulk-video-upload'),
    
    # Category endpoints
    path('categories/', views.category_list, name='category-list'),

    path('products/export/', views.export_products, name='export-products'),
]