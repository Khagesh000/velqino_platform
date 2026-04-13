# catalog/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.cache import cache

# ✅ COMMENT OUT THE SIGNAL FOR NOW (since orders app doesn't exist yet)
"""
@receiver(post_save, sender='orders.OrderItem')
def update_product_stock_on_order(sender, instance, created, **kwargs):
    if created:
        product = instance.product
        if product.stock == 1:
            product.stock = 0
            product.save()
            cache.delete(f"product:{product.id}")
            cache.delete_pattern(f"product:list:*")
"""

# ✅ Just print that signals are ready (temporary)
print("✅ Signals file loaded - Waiting for orders app")