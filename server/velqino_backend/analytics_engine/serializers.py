from rest_framework import serializers
from .models import GSTReturn, ScheduledReport

class WholesalerStatsSerializer(serializers.Serializer):
    """Serializer for wholesaler dashboard statistics"""
    
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    revenue_change = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)
    revenue_trend = serializers.CharField(default='up')
    
    pending_orders = serializers.IntegerField()
    pending_change = serializers.IntegerField(default=0)
    
    total_products = serializers.IntegerField()
    products_change = serializers.IntegerField(default=0)
    
    low_stock_products = serializers.IntegerField(default=0)
    out_of_stock_products = serializers.IntegerField(default=0)
    
    total_customers = serializers.IntegerField()
    customers_change = serializers.IntegerField(default=0)
    
    avg_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    completed_orders = serializers.IntegerField()
    completion_rate = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)


class OrderStatsSerializer(serializers.Serializer):
    """Serializer for order statistics"""
    
    today = serializers.IntegerField()
    this_week = serializers.IntegerField()
    this_month = serializers.IntegerField()
    total = serializers.IntegerField()


class RevenueStatsSerializer(serializers.Serializer):
    """Serializer for revenue statistics"""
    
    today = serializers.DecimalField(max_digits=12, decimal_places=2)
    this_week = serializers.DecimalField(max_digits=12, decimal_places=2)
    this_month = serializers.DecimalField(max_digits=12, decimal_places=2)
    total = serializers.DecimalField(max_digits=12, decimal_places=2)


class ProductStatsSerializer(serializers.Serializer):
    """Serializer for product statistics"""
    
    active = serializers.IntegerField()
    draft = serializers.IntegerField()
    archived = serializers.IntegerField()
    low_stock = serializers.IntegerField()
    out_of_stock = serializers.IntegerField()


#-------------------------------------------RETAILERS--------------------------------------------
class KPIValueSerializer(serializers.Serializer):
    value = serializers.FloatField()
    change = serializers.FloatField()
    trend = serializers.CharField()
    period = serializers.CharField()

class RetailerKPIStatsSerializer(serializers.Serializer):
    today_sales = KPIValueSerializer()
    total_orders = KPIValueSerializer()
    total_customers = KPIValueSerializer()
    total_products = KPIValueSerializer()


class HourlySalesSerializer(serializers.Serializer):
    hour = serializers.CharField()
    sales = serializers.FloatField()
    target = serializers.FloatField(required=False, default=0)

class PeakHourSerializer(serializers.Serializer):
    hour = serializers.CharField()
    sales = serializers.FloatField()

class DailySalesSerializer(serializers.Serializer):
    today = HourlySalesSerializer(many=True)
    yesterday = HourlySalesSerializer(many=True)
    peak_hour = PeakHourSerializer()
    total_today = serializers.FloatField()
    total_yesterday = serializers.FloatField()
    growth = serializers.FloatField()

class TopProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    sku = serializers.CharField()
    sales = serializers.IntegerField()
    revenue = serializers.FloatField()
    stock = serializers.IntegerField()
    trend = serializers.CharField()

class CustomerActivitySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    type = serializers.CharField()
    visits = serializers.IntegerField()
    lastVisit = serializers.CharField()
    amount = serializers.FloatField()
    phone = serializers.CharField()
    email = serializers.CharField()
    status = serializers.CharField()
    avatar = serializers.CharField()


class TransactionSerializer(serializers.Serializer):
    id = serializers.CharField()
    customer = serializers.CharField()
    items = serializers.IntegerField()
    amount = serializers.FloatField()
    payment = serializers.CharField()
    status = serializers.CharField()
    time = serializers.CharField()
    date = serializers.CharField()


class LowStockAlertSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    sku = serializers.CharField()
    currentStock = serializers.IntegerField()
    reorderLevel = serializers.IntegerField()
    supplier = serializers.CharField()
    supplierContact = serializers.CharField()
    leadTime = serializers.CharField()
    price = serializers.FloatField()
    status = serializers.CharField()
    image = serializers.CharField()


class HourlyBreakdownSerializer(serializers.Serializer):
    hour = serializers.CharField()
    transactions = serializers.IntegerField()
    amount = serializers.FloatField()

class PaymentMethodsSerializer(serializers.Serializer):
    upi = serializers.IntegerField()
    card = serializers.IntegerField()
    cash = serializers.IntegerField()
    wallet = serializers.IntegerField()

class TodaySummarySerializer(serializers.Serializer):
    totalTransactions = serializers.IntegerField()
    averageBill = serializers.FloatField()
    busiestHour = serializers.CharField()
    busiestHourSales = serializers.FloatField()
    totalItems = serializers.IntegerField()
    uniqueCustomers = serializers.IntegerField()
    peakHourCustomers = serializers.IntegerField()
    revenue = serializers.FloatField()
    target = serializers.FloatField()
    paymentMethods = PaymentMethodsSerializer()
    hourlyBreakdown = HourlyBreakdownSerializer(many=True)


class QuickReorderSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    sku = serializers.CharField()
    currentStock = serializers.IntegerField()
    reorderLevel = serializers.IntegerField()
    salesVelocity = serializers.FloatField()
    daysUntilOut = serializers.IntegerField()
    suggestedQty = serializers.IntegerField()
    supplier = serializers.CharField()
    price = serializers.FloatField()
    urgency = serializers.CharField()
    image = serializers.CharField()



#---------------------------------Analytics report-----------------------------
class GSTReturnSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = GSTReturn
        fields = ['id', 'period', 'tax_amount', 'status', 'status_display', 
                  'filed_date', 'due_date', 'reference_number', 'created_at']
        read_only_fields = ['id', 'created_at']


class FileGSTReturnSerializer(serializers.Serializer):
    period = serializers.CharField(max_length=20)
    due_date = serializers.DateField(required=False)
    reference_number = serializers.CharField(max_length=50, required=False)


class ScheduledReportSerializer(serializers.ModelSerializer):
    frequency_display = serializers.CharField(source='get_frequency_display', read_only=True)
    format_display = serializers.CharField(source='get_format_type_display', read_only=True)
    
    class Meta:
        model = ScheduledReport
        fields = ['id', 'name', 'report_type', 'frequency', 'frequency_display', 
                  'format_type', 'format_display', 'recipients', 'is_active', 
                  'last_sent', 'created_at', 'updated_at']


class ScheduledReportCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    report_type = serializers.CharField(max_length=20)
    frequency = serializers.ChoiceField(choices=ScheduledReport.FREQUENCY_CHOICES)
    format_type = serializers.ChoiceField(choices=ScheduledReport.FORMAT_CHOICES, default='excel')
    recipients = serializers.CharField()
    is_active = serializers.BooleanField(default=True)


class ScheduledReportUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, required=False)
    frequency = serializers.ChoiceField(choices=ScheduledReport.FREQUENCY_CHOICES, required=False)
    format_type = serializers.ChoiceField(choices=ScheduledReport.FORMAT_CHOICES, required=False)
    recipients = serializers.CharField(required=False)
    is_active = serializers.BooleanField(required=False)