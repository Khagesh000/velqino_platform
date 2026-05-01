from django.core.cache import cache
from django.db.models import Q
from django.db import models
from .models import FAQ, FAQCategory, SupportTicket, TicketReply
from django.core.mail import send_mail
from django.conf import settings
from celery import shared_task
import logging

logger = logging.getLogger(__name__)

class FAQService:
    CACHE_KEY_FAQS = "faqs_all"
    CACHE_KEY_CATEGORIES = "faq_categories"
    CACHE_TTL = 3600  # 1 hour

    @staticmethod
    def get_all_faqs():
        cache_key = FAQService.CACHE_KEY_FAQS
        faqs = cache.get(cache_key)
        if faqs is None:
            faqs = FAQ.objects.filter(is_active=True).select_related('category')
            cache.set(cache_key, faqs, FAQService.CACHE_TTL)
        return faqs

    @staticmethod
    def get_categories():
        cache_key = FAQService.CACHE_KEY_CATEGORIES
        categories = cache.get(cache_key)
        if categories is None:
            categories = FAQCategory.objects.filter(is_active=True)
            cache.set(cache_key, categories, FAQService.CACHE_TTL)
        return categories

    @staticmethod
    def search_faqs(query):
        if not query:
            return FAQ.objects.none()
        return FAQ.objects.filter(
            Q(question__icontains=query) | Q(answer__icontains=query),
            is_active=True
        ).select_related('category')

    @staticmethod
    def mark_helpful(faq_id, was_helpful):
        cache.delete(FAQService.CACHE_KEY_FAQS)
        if was_helpful:
            return FAQ.objects.filter(id=faq_id).update(helpful_count=models.F('helpful_count') + 1)
        return FAQ.objects.filter(id=faq_id).update(not_helpful_count=models.F('not_helpful_count') + 1)

    @staticmethod
    def increment_view(faq_id):
        return FAQ.objects.filter(id=faq_id).update(views=models.F('views') + 1)
    

class TicketService:
    CACHE_TICKET_PREFIX = "ticket_"
    CACHE_CATEGORIES = "ticket_categories"
    CACHE_TTL = 300  # 5 minutes

    @staticmethod
    def get_ticket_categories():
        categories = cache.get(TicketService.CACHE_CATEGORIES)
        if categories is None:
            from .models import TicketCategory
            categories = list(TicketCategory.objects.filter(is_active=True).values('id', 'name', 'slug'))
            cache.set(TicketService.CACHE_CATEGORIES, categories, TicketService.CACHE_TTL)
        return categories

    @staticmethod
    def clear_ticket_cache(ticket_id):
        cache.delete(f"{TicketService.CACHE_TICKET_PREFIX}{ticket_id}")
        cache.delete(TicketService.CACHE_CATEGORIES)

    @staticmethod
    @shared_task
    def send_ticket_notification(ticket_id, user_email, subject, message):
        try:
            send_mail(
                subject=f"[Support Ticket] {subject}",
                message=f"Ticket ID: {ticket_id}\n\n{message}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user_email],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Failed to send ticket email: {e}")


class TicketStatusService:
    @staticmethod
    def can_update_status(current_status, new_status, user_role):
        status_flow = {
            'open': ['in_progress', 'closed'],
            'in_progress': ['resolved', 'closed'],
            'resolved': ['closed'],
            'closed': []
        }
        
        if new_status not in status_flow.get(current_status, []):
            return False
        
        if user_role == 'customer' and new_status == 'closed':
            return True
        
        return user_role in ['admin', 'support']