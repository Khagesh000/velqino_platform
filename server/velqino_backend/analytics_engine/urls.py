from django.urls import path
from . import views
from .views import CategoryPerformanceAPIView, LowStockAlertsAPIView, RecentOrdersAPIView, RecentActivityAPIView, TopCustomersAPIView, PendingTasksAPIView, WithdrawalStatsAPIView, TopProductsAPIView, GeographicSalesAPIView, HourlySalesAPIView, ExportReportAPIView


urlpatterns = [
    path('wholesaler/stats/', views.wholesaler_dashboard_stats, name='wholesaler-stats'),
    path('wholesaler/order-stats/', views.order_stats, name='order-stats'),
    path('wholesaler/revenue-stats/', views.revenue_stats, name='revenue-stats'),
    path('wholesaler/product-stats/', views.product_stats, name='product-stats'),

    path('wholesaler/sales-analytics/', views.sales_analytics, name='sales-analytics'),
    path('wholesaler/category-performance/', CategoryPerformanceAPIView.as_view(), name='category-performance'),
    path('wholesaler/low-stock-alerts/', LowStockAlertsAPIView.as_view(), name='low-stock-alerts'),
    path('wholesaler/recent-orders/', RecentOrdersAPIView.as_view(), name='recent-orders'),
    path('wholesaler/recent-activity/', RecentActivityAPIView.as_view(), name='recent-activity'),
    path('wholesaler/top-customers/', TopCustomersAPIView.as_view(), name='top-customers'),
    path('wholesaler/pending-tasks/', PendingTasksAPIView.as_view(), name='pending-tasks'),
    path('wholesaler/withdrawal-stats/', WithdrawalStatsAPIView.as_view(), name='withdrawal-stats'),

    path('wholesaler/top-products/', TopProductsAPIView.as_view(), name='top-products'),
    path('wholesaler/geo-sales/', GeographicSalesAPIView.as_view(), name='geo-sales'),
    path('wholesaler/hourly-sales/', HourlySalesAPIView.as_view(), name='hourly-sales'),
    path('wholesaler/export-report/', ExportReportAPIView.as_view(), name='export-report'),
    ]