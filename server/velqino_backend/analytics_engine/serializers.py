from rest_framework import serializers

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