from django.urls import path
from . import views

urlpatterns = [
    # FAQ endpoints
    path('faqs/', views.list_faqs, name='list-faqs'),
    path('faqs/categories/', views.list_faq_categories, name='faq-categories'),
    path('faqs/search/', views.search_faqs, name='search-faqs'),
    path('faqs/<int:faq_id>/helpful/', views.mark_faq_helpful, name='faq-helpful'),
    path('faqs/<int:faq_id>/view/', views.increment_faq_view, name='faq-view'),

    # Add these to existing urlpatterns
    path('tickets/', views.create_ticket, name='create-ticket'),
    path('tickets/categories/', views.ticket_categories, name='ticket-categories'),
    path('tickets/my-tickets/', views.user_tickets, name='user-tickets'),
    path('tickets/<str:ticket_id>/', views.ticket_detail, name='ticket-detail'),
    path('tickets/<str:ticket_id>/reply/', views.reply_ticket, name='reply-ticket'),
    path('tickets/attachments/', views.upload_attachment, name='upload-attachment'),

    path('tickets/<str:ticket_id>/reply/', views.reply_ticket, name='reply-ticket'),
    path('tickets/<str:ticket_id>/close/', views.close_ticket, name='close-ticket'),

    path('system/status/', views.system_status, name='system-status'),
]