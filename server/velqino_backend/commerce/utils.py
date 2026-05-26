# commerce/utils.py
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum

def calculate_points(amount, points_per_rupee=1):
    """Calculate points from amount spent"""
    return int(float(amount) * float(points_per_rupee))

def calculate_tier(total_spent):
    """Calculate customer tier based on total spent"""
    if total_spent >= 50000:
        return 'Platinum'
    elif total_spent >= 25000:
        return 'Gold'
    elif total_spent >= 10000:
        return 'Silver'
    return 'Bronze'

def get_tier_thresholds(settings):
    """Get tier thresholds from settings"""
    return {
        'Bronze': settings.bronze_threshold,
        'Silver': settings.silver_threshold,
        'Gold': settings.gold_threshold,
        'Platinum': settings.platinum_threshold,
    }

def get_customer_total_spent(customer, retailer=None):
    """Calculate total spent by customer with specific retailer"""
    from .models import Order
    orders = Order.objects.filter(customer=customer, status='delivered')
    if retailer:
        orders = orders.filter(retailer=retailer)
    total = orders.aggregate(total=Sum('grand_total'))['total'] or Decimal(0)
    return float(total)

def get_customer_points_balance(customer):
    """Get current points balance for customer"""
    from .models import PointsTransaction
    result = PointsTransaction.objects.filter(customer=customer).aggregate(
        total_earned=Sum('points', filter=models.Q(transaction_type__in=['earned', 'bonus'])),
        total_redeemed=Sum('points', filter=models.Q(transaction_type='redeemed')),
        total_expired=Sum('points', filter=models.Q(transaction_type='expired'))
    )
    earned = result['total_earned'] or 0
    redeemed = result['total_redeemed'] or 0
    expired = result['total_expired'] or 0
    return earned - redeemed - expired

def add_points_transaction(customer, points, transaction_type, description, 
                          retailer=None, order=None, reward=None, metadata=None):
    """Helper to add points transaction and update balance"""
    from .models import PointsTransaction, LoyaltySettings
    
    current_balance = get_customer_points_balance(customer)
    new_balance = current_balance + points
    
    transaction = PointsTransaction.objects.create(
        customer=customer,
        retailer=retailer,
        transaction_type=transaction_type,
        points=abs(points),
        balance_after=new_balance,
        order=order,
        reward=reward,
        description=description,
        metadata=metadata or {},
        expires_at=timezone.now() + timedelta(days=180) if transaction_type == 'earned' else None
    )
    
    return transaction