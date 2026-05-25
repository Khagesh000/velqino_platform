from django.urls import path
from . import views

urlpatterns = [

    path('cart/', views.get_cart, name='get-cart'),
    path('cart/add/', views.add_to_cart, name='add-to-cart'),
    path('cart/item/<int:item_id>/', views.update_cart_item, name='update-cart-item'),
    path('cart/item/<int:item_id>/remove/', views.remove_cart_item, name='remove-cart-item'),
    path('cart/coupon/apply/', views.apply_coupon, name='apply-coupon'),
    path('cart/coupon/remove/', views.remove_coupon, name='remove-coupon'),
    path('cart/clear/', views.clear_cart, name='clear-cart'),

    path('cart/merge/', views.merge_cart, name='merge-cart'),

    path('orders/create/', views.create_order, name='create-order'),
    path('orders/', views.get_orders, name='get-orders'),
    path('orders/<str:order_id>/', views.get_order, name='get-order'),
    path('orders/<str:order_id>/cancel/', views.cancel_order, name='cancel-order'),
    # Customer orders
    path('orders/customer/create/', views.create_customer_order, name='create-customer-order'),
    path('orders/customer/list/', views.get_customer_orders, name='customer-orders'),
    
    # Retailer orders & customers
    path('orders/retailer/list/', views.get_retailer_orders, name='retailer-orders'),
    path('retailer/customers/', views.get_retailer_customers, name='retailer-customers'),
    path('retailer/returns/', views.get_retailer_returns, name='retailer-returns'),
    path('returns/create/', views.create_return_request, name='create-return'),
    path('returns/<str:return_id>/status/', views.update_return_status, name='update-return-status'),

    path('orders/<str:order_id>/invoice/', views.download_invoice, name='download-invoice'),
    path('orders/<str:order_id>/status/', views.update_order_status, name='update-order-status'),
    path('orders/<str:order_id>/status-history/', views.get_order_status_history, name='order-status-history'),

    path('orders/<str:order_id>/status/', views.update_order_status, name='update-order-status'),
    path('orders/<str:order_id>/status-history/', views.get_order_status_history, name='order-status-history'),
]