from django.urls import path
from . import views

urlpatterns = [
    path('wholesaler/register/', views.register_wholesaler),
    path('wholesaler/profile/<int:user_id>/', views.get_wholesaler_profile),
    path('wholesaler/profile/<int:user_id>/update/', views.update_wholesaler_profile),
    path('wholesaler/profile/<int:user_id>/delete/', views.delete_wholesaler_profile),
    path('wholesalers/', views.list_wholesalers),

    path('retailer/register/', views.register_retailer, name='register-retailer'),
    path('retailer/login/', views.retailer_login, name='retailer-login'),
    path('retailer/profile/<int:user_id>/', views.retailer_profile, name='retailer-profile'),
    path('retailers/list/', views.list_retailers, name='list-retailers'),

    
]