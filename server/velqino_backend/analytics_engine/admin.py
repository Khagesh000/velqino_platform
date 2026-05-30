from django.contrib import admin

from .models import GSTReturn, ScheduledReport

@admin.register(GSTReturn)
class GSTReturnAdmin(admin.ModelAdmin):
    list_display = ['id', 'retailer', 'period', 'tax_amount', 'status', 'filed_date', 'due_date']
    list_filter = ['status', 'period']
    search_fields = ['retailer__email', 'period']
    date_hierarchy = 'filed_date'


@admin.register(ScheduledReport)
class ScheduledReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'retailer', 'report_type', 'frequency', 'is_active', 'last_sent']
    list_filter = ['frequency', 'is_active', 'report_type']
    search_fields = ['name', 'retailer__email']