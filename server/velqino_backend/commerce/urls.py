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

    path('orders/create/', views.create_order, name='create-order'),
    path('orders/', views.get_orders, name='get-orders'),
    path('orders/<str:order_id>/', views.get_order, name='get-order'),
    
    # Customer orders
    path('orders/customer/create/', views.create_customer_order, name='create-customer-order'),
    path('orders/customer/list/', views.get_customer_orders, name='customer-orders'),
    
    # Retailer orders & customers
    path('orders/retailer/list/', views.get_retailer_orders, name='retailer-orders'),
    path('retailer/customers/', views.get_retailer_customers, name='retailer-customers'),
]