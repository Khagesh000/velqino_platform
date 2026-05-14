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
    path('categories/<int:category_id>/', views.category_detail, name='category-detail'),
     path('categories/reorder/', views.category_reorder, name='category-reorder'),

    path('products/export/', views.export_products, name='export-products'),

    path('wishlist/', views.get_wishlist, name='wishlist'),
    path('wishlist/add/', views.add_to_wishlist, name='add-to-wishlist'),
    path('wishlist/remove/', views.remove_from_wishlist, name='remove-from-wishlist'),
    path('wishlist/bulk-add/', views.bulk_add_to_wishlist, name='bulk-add-wishlist'),
    path('wishlist/stats/', views.wishlist_stats, name='wishlist-stats'),

    path('retailer/products/', views.retailer_product_list, name='retailer-product-list'),
    path('retailer/products/<int:product_id>/', views.retailer_product_detail, name='retailer-product-detail'),
    
    # Retailer Bulk Images
    path('retailer/bulk-images/same/', views.retailer_bulk_images_same, name='retailer-bulk-same'),
    path('retailer/bulk-images/different/', views.retailer_bulk_images_different, name='retailer-bulk-different'),
    path('retailer/bulk-status/<str:task_id>/', views.retailer_bulk_status, name='retailer-bulk-status'),
    
    # Retailer Bulk Video
    path('retailer/bulk-video/', views.retailer_bulk_video_upload, name='retailer-bulk-video'),
    path('retailer/bulk-video-status/<str:task_id>/', views.retailer_bulk_video_status, name='retailer-bulk-video-status'),
    
    # ✅ ADD THESE MISSING ENDPOINTS
    # Retailer Bulk Edit & Delete
    path('retailer/products/bulk-edit/', views.retailer_bulk_edit, name='retailer-bulk-edit'),
    path('retailer/products/bulk-delete/', views.retailer_bulk_delete, name='retailer-bulk-delete'),

    path('retailer/products/import/', views.retailer_import_products, name='retailer-import-products'),
    path('retailer/products/export/', views.retailer_export_products, name='retailer-export-products'),
   
]