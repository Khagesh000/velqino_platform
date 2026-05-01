from django.contrib import admin
from .models import FAQCategory, FAQ, TicketCategory, SupportTicket, TicketReply, TicketAttachment

@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['order', 'is_active']
    search_fields = ['name']

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'views', 'helpful_count', 'order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['question', 'answer']
    list_editable = ['order', 'is_active']
    readonly_fields = ['views', 'helpful_count', 'not_helpful_count']

@admin.register(TicketCategory)
class TicketCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_id', 'user', 'subject', 'priority', 'status', 'created_at']
    list_filter = ['status', 'priority', 'created_at']
    search_fields = ['ticket_id', 'subject', 'message']
    readonly_fields = ['ticket_id']

@admin.register(TicketReply)
class TicketReplyAdmin(admin.ModelAdmin):
    list_display = ['ticket', 'user', 'is_staff_reply', 'created_at']
    list_filter = ['is_staff_reply', 'created_at']

@admin.register(TicketAttachment)
class TicketAttachmentAdmin(admin.ModelAdmin):
    list_display = ['reply', 'filename', 'file_size', 'created_at']