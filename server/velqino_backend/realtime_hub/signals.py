from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import FAQ, FAQCategory
from .tasks import clear_faq_cache

@receiver([post_save, post_delete], sender=FAQ)
@receiver([post_save, post_delete], sender=FAQCategory)
def clear_faq_cache_on_change(sender, **kwargs):
    clear_faq_cache.delay()