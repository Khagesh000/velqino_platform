from rest_framework import serializers
from .models import FAQCategory, FAQ, TicketReply, TicketAttachment, TicketCategory, SupportTicket

class FAQCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQCategory
        fields = ['id', 'name', 'slug', 'icon', 'order', 'is_active']


class FAQSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    
    class Meta:
        model = FAQ
        fields = ['id', 'category', 'category_name', 'category_slug', 'question', 'answer', 
                  'views', 'helpful_count', 'order', 'is_active', 'created_at']
        
class TicketCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketCategory
        fields = ['id', 'name', 'slug', 'description', 'order']


class TicketReplySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = TicketReply
        fields = ['id', 'user', 'user_name', 'message', 'is_staff_reply', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class TicketAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketAttachment
        fields = ['id', 'file', 'filename', 'file_size', 'created_at']


class SupportTicketSerializer(serializers.ModelSerializer):
    replies = TicketReplySerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = ['id', 'ticket_id', 'user', 'user_name', 'category', 'category_name',
                  'subject', 'message', 'priority', 'status', 'assigned_to',
                  'created_at', 'updated_at', 'resolved_at', 'replies']
        read_only_fields = ['id', 'ticket_id', 'user', 'created_at', 'updated_at', 'resolved_at']


class CreateTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = ['category', 'subject', 'message', 'priority'] 