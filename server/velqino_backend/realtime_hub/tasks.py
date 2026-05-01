from celery import shared_task
from django.core.cache import cache
from .models import FAQ
from .services import FAQService

@shared_task
def clear_faq_cache():
    """Clear FAQ cache after updates"""
    cache.delete(FAQService.CACHE_KEY_FAQS)
    cache.delete(FAQService.CACHE_KEY_CATEGORIES)
    return "FAQ cache cleared"

@shared_task
def bulk_update_faq_views():
    """Bulk update FAQ views from Redis to DB"""
    # Implement if using Redis for view counting
    pass