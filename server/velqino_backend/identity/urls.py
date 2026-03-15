from django.urls import path
from . import views

urlpatterns = [
    path('wholesaler/register/', views.register_wholesaler),
    path('wholesaler/profile/<int:user_id>/', views.get_wholesaler_profile),
    path('wholesaler/profile/<int:user_id>/update/', views.update_wholesaler_profile),
    path('wholesaler/profile/<int:user_id>/delete/', views.delete_wholesaler_profile),
    path('wholesalers/', views.list_wholesalers),
]