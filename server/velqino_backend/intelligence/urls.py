from django.urls import path
from .views import (
    AIModelListAPIView,
    AIModelDetailAPIView,
    VirtualTryOnGenerateAPIView,
    TryOnSessionDetailAPIView,
    TryOnHistoryAPIView,
    ExportToProductAPIView,
    FitGarmentAPIView
)

urlpatterns = [
    path('models/', AIModelListAPIView.as_view(), name='ai_models_list'),
    path('models/<str:slug>/', AIModelDetailAPIView.as_view(), name='ai_model_detail'),
    path('generate-tryon/', VirtualTryOnGenerateAPIView.as_view(), name='generate_tryon'),
    path('fit-garment/', FitGarmentAPIView.as_view(), name='fit_garment'),
    path('sessions/<int:session_id>/', TryOnSessionDetailAPIView.as_view(), name='tryon_session_detail'),
    path('history/', TryOnHistoryAPIView.as_view(), name='tryon_history'),
    path('export-product/', ExportToProductAPIView.as_view(), name='export_to_product'),
]
