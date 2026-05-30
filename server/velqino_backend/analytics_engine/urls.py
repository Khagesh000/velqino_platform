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

    #-----------------------------------------------RETAILERS---------------------------------------
    path('retailer/kpi-stats/', views.retailer_kpi_stats, name='retailer-kpi-stats'),
    path('retailer/daily-sales/', views.retailer_daily_sales, name='retailer-daily-sales'),
    path('retailer/top-products/', views.retailer_top_products, name='retailer-top-products'),
    path('retailer/customer-activity/', views.retailer_customer_activity, name='retailer-customer-activity'),
    path('retailer/recent-transactions/', views.retailer_recent_transactions, name='retailer-recent-transactions'),
    path('retailer/low-stock-alerts/', views.retailer_low_stock_alerts, name='retailer-low-stock-alerts'),
    path('retailer/today-summary/', views.retailer_today_summary, name='retailer-today-summary'),
    path('retailer/quick-reorder/', views.retailer_quick_reorder, name='retailer-quick-reorder'),

    #----------------------------------------Retailers Reports--------------------------------------
    path('retailer/cogs/', views.retailer_cogs, name='retailer-cogs'),
    # ========== TAX REPORT URLS ==========
    path('retailer/tax-summary/', views.retailer_tax_summary, name='retailer-tax-summary'),
    path('retailer/gst-returns/', views.retailer_gst_returns, name='retailer-gst-returns'),
    path('retailer/gst-returns/file/', views.file_gst_return, name='file-gst-return'),

    # ========== EXPORT OPTIONS URLS ==========
    path('retailer/export/', views.retailer_export_report, name='retailer-export'),
    path('retailer/export/email/', views.retailer_email_report, name='retailer-email-report'),
    path('retailer/scheduled-reports/', views.list_scheduled_reports, name='scheduled-reports'),
    path('retailer/scheduled-reports/create/', views.create_scheduled_report, name='create-scheduled-report'),
    path('retailer/scheduled-reports/<int:report_id>/update/', views.update_scheduled_report, name='update-scheduled-report'),
    path('retailer/scheduled-reports/<int:report_id>/delete/', views.delete_scheduled_report, name='delete-scheduled-report'),
    ]