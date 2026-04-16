from django.urls import path
from . import views

urlpatterns = [
    # Customer orders
    path('orders/customer/create/', views.create_customer_order, name='create-customer-order'),
    path('orders/customer/list/', views.get_customer_orders, name='customer-orders'),
    
    # Retailer orders & customers
    path('orders/retailer/list/', views.get_retailer_orders, name='retailer-orders'),
    path('retailer/customers/', views.get_retailer_customers, name='retailer-customers'),
]