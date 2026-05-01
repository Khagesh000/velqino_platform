# catalog/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from commerce.models import Order, OrderItem
from catalog.models import Product  # ✅ ADD THIS
from analytics_engine.tasks import update_stats_on_order_created

print("✅ Signals file loaded - Waiting for orders app")

# ✅ ADD THIS - Auto clear product cache when products change
@receiver([post_save, post_delete], sender=Product)
def clear_product_cache(sender, instance, **kwargs):
    """Clear product cache when product is created, updated, or deleted"""
    cache.delete_pattern('product:list:*')
    cache.delete(f"product:{instance.id}")
    print(f"✅ Product cache cleared for ID: {instance.id}")


@receiver(post_save, sender=Order)
def order_post_save(sender, instance, created, **kwargs):
    if created and instance.wholesaler:
        update_stats_on_order_created.delay(instance.id)


@receiver(post_save, sender=OrderItem)
def orderitem_post_save(sender, instance, created, **kwargs):
    if created and instance.order and instance.order.wholesaler:
        update_stats_on_order_created.delay(instance.order.id)