from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.paginator import Paginator
from drf_yasg.utils import swagger_auto_schema # type: ignore
from drf_yasg import openapi # type: ignore
from .models import SupportTicket, TicketReply, TicketAttachment, TicketCategory, FAQ, FAQCategory
from .serializers import (
    SupportTicketSerializer, CreateTicketSerializer, 
    TicketCategorySerializer, TicketReplySerializer,
    FAQSerializer, FAQCategorySerializer
)
from .services import FAQService, TicketService, TicketStatusService
import logging

logger = logging.getLogger(__name__)


@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter('page', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
        openapi.Parameter('per_page', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
        openapi.Parameter('category', openapi.IN_QUERY, type=openapi.TYPE_STRING),
    ]
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_faqs(request):
    """List all FAQs with pagination and category filter"""
    try:
        category_slug = request.GET.get('category')
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 20))
        
        faqs = FAQService.get_all_faqs()
        
        if category_slug:
            faqs = faqs.filter(category__slug=category_slug)
        
        # Pagination
        paginator = Paginator(faqs, per_page)
        paginated_faqs = paginator.get_page(page)
        
        serializer = FAQSerializer(paginated_faqs, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'pagination': {
                'total': paginator.count,
                'page': page,
                'per_page': per_page,
                'total_pages': paginator.num_pages
            }
        })
        
    except Exception as e:
        logger.error(f"Error listing FAQs: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_faq_categories(request):
    """List all FAQ categories"""
    try:
        categories = FAQService.get_categories()
        serializer = FAQCategorySerializer(categories, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data
        })
        
    except Exception as e:
        logger.error(f"Error listing FAQ categories: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter('q', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True),
    ]
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_faqs(request):
    """Search FAQs by keyword"""
    try:
        query = request.GET.get('q', '').strip()
        
        if not query:
            return Response({
                'status': 'error',
                'message': 'Search query is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        faqs = FAQService.search_faqs(query)
        serializer = FAQSerializer(faqs, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'total': faqs.count()
        })
        
    except Exception as e:
        logger.error(f"Error searching FAQs: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_faq_helpful(request, faq_id):
    """Mark FAQ as helpful or not helpful"""
    try:
        was_helpful = request.data.get('helpful', True)
        
        FAQService.increment_view(faq_id)
        FAQService.mark_helpful(faq_id, was_helpful)
        
        return Response({
            'status': 'success',
            'message': 'Feedback recorded successfully'
        })
        
    except FAQ.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'FAQ not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error marking FAQ helpful: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def increment_faq_view(request, faq_id):
    """Increment FAQ view count"""
    try:
        FAQService.increment_view(faq_id)
        
        return Response({
            'status': 'success',
            'message': 'View count updated'
        })
        
    except FAQ.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'FAQ not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error incrementing FAQ view: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_ticket(request):
    """Create a new support ticket"""
    try:
        serializer = CreateTicketSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'status': 'error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        ticket = SupportTicket.objects.create(
            user=request.user,
            category_id=serializer.validated_data.get('category'),
            subject=serializer.validated_data['subject'],
            message=serializer.validated_data['message'],
            priority=serializer.validated_data.get('priority', 'medium')
        )
        
        # Send notification email
        TicketService.send_ticket_notification.delay(
            ticket.ticket_id, request.user.email, ticket.subject, ticket.message
        )
        
        return Response({
            'status': 'success',
            'data': SupportTicketSerializer(ticket).data,
            'message': 'Ticket created successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error creating ticket: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ticket_categories(request):
    """Get ticket categories"""
    try:
        categories = TicketService.get_ticket_categories()
        return Response({
            'status': 'success',
            'data': categories
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_tickets(request):
    """Get user's support tickets"""
    try:
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 10))
        status_filter = request.GET.get('status')
        
        tickets = SupportTicket.objects.filter(user=request.user)
        
        if status_filter:
            tickets = tickets.filter(status=status_filter)
        
        paginator = Paginator(tickets, per_page)
        paginated_tickets = paginator.get_page(page)
        
        return Response({
            'status': 'success',
            'data': SupportTicketSerializer(paginated_tickets, many=True).data,
            'pagination': {
                'total': paginator.count,
                'page': page,
                'per_page': per_page,
                'total_pages': paginator.num_pages
            }
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ticket_detail(request, ticket_id):
    """Get ticket details"""
    try:
        ticket = SupportTicket.objects.get(ticket_id=ticket_id, user=request.user)
        return Response({
            'status': 'success',
            'data': SupportTicketSerializer(ticket).data
        })
    except SupportTicket.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Ticket not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reply_ticket(request, ticket_id):
    """Add reply to ticket"""
    try:
        ticket = SupportTicket.objects.get(ticket_id=ticket_id, user=request.user)
        message = request.data.get('message')
        
        if not message:
            return Response({
                'status': 'error',
                'message': 'Message is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        reply = TicketReply.objects.create(
            ticket=ticket,
            user=request.user,
            message=message,
            is_staff_reply=(request.user.role in ['admin', 'support'])
        )
        
        # Update ticket status to in_progress if it was closed
        if ticket.status == 'closed':
            ticket.status = 'in_progress'
            ticket.save()
        
        TicketService.clear_ticket_cache(ticket_id)
        
        return Response({
            'status': 'success',
            'data': TicketReplySerializer(reply).data
        }, status=status.HTTP_201_CREATED)
        
    except SupportTicket.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Ticket not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_attachment(request):
    """Upload attachment for ticket"""
    try:
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({
                'status': 'error',
                'message': 'No file provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate file size (max 5MB)
        if uploaded_file.size > 5 * 1024 * 1024:
            return Response({
                'status': 'error',
                'message': 'File size exceeds 5MB limit'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Temporary attachment (will be linked to reply later)
        attachment_data = {
            'filename': uploaded_file.name,
            'file_size': uploaded_file.size,
            'file_url': None  # Will be saved after DB record
        }
        
        return Response({
            'status': 'success',
            'data': attachment_data,
            'message': 'File uploaded successfully'
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ticket_replies(request, ticket_id):
    """Get all replies for a ticket"""
    try:
        ticket = SupportTicket.objects.get(ticket_id=ticket_id, user=request.user)
        replies = ticket.replies.all().order_by('created_at')
        serializer = TicketReplySerializer(replies, many=True)
        return Response({'status': 'success', 'data': serializer.data})
    except SupportTicket.DoesNotExist:
        return Response({'status': 'error', 'message': 'Ticket not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def close_ticket(request, ticket_id):
    """Close a ticket"""
    try:
        ticket = SupportTicket.objects.get(ticket_id=ticket_id, user=request.user)
        ticket.status = 'closed'
        ticket.save()
        return Response({'status': 'success', 'message': 'Ticket closed successfully'})
    except SupportTicket.DoesNotExist:
        return Response({'status': 'error', 'message': 'Ticket not found'}, status=404)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def system_status(request):
    """Get system status for all services"""
    from datetime import datetime
    
    services = [
        {'id': 'api', 'name': 'API Gateway', 'status': 'operational', 'uptime': '99.99%', 'response_time': '120ms'},
        {'id': 'database', 'name': 'Database', 'status': 'operational', 'uptime': '99.95%', 'response_time': '45ms'},
        {'id': 'payment', 'name': 'Payment Gateway', 'status': 'operational', 'uptime': '99.98%', 'response_time': '230ms'},
        {'id': 'notifications', 'name': 'Notification Service', 'status': 'degraded', 'uptime': '99.85%', 'response_time': '310ms'},
        {'id': 'search', 'name': 'Search Service', 'status': 'operational', 'uptime': '99.97%', 'response_time': '85ms'},
        {'id': 'storage', 'name': 'File Storage', 'status': 'operational', 'uptime': '99.99%', 'response_time': '95ms'},
    ]
    
    overall = 'All Systems Operational' if all(s['status'] == 'operational' for s in services) else 'Degraded Performance'
    
    maintenance = [
        {'id': 1, 'title': 'Database Upgrade', 'status': 'completed', 'date': '2024-03-20', 'duration': '2 hours', 'impact': 'Read-only mode'},
        {'id': 2, 'title': 'Payment Gateway Update', 'status': 'upcoming', 'date': '2024-03-25', 'duration': '3 hours', 'impact': 'Payment delays'},
        {'id': 3, 'title': 'Security Patch', 'status': 'in-progress', 'date': '2024-03-22', 'duration': '4 hours', 'impact': 'No downtime'},
    ]
    
    incidents = [
        {'id': 1, 'title': 'Payment Gateway Timeout', 'status': 'resolved', 'date': '2024-03-18', 'resolution': 'Fixed in 15 min', 'affected': 'Payment Service'},
        {'id': 2, 'title': 'Delayed Notifications', 'status': 'monitoring', 'date': '2024-03-20', 'resolution': 'Investigating', 'affected': 'Notification Service'},
    ]
    
    return Response({
        'status': 'success',
        'data': {
            'overall_status': overall,
            'last_checked': datetime.now().isoformat(),
            'services': services,
            'maintenance': maintenance,
            'incidents': incidents
        }
    })