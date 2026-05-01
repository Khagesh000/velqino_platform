from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.utils import timezone
import logging
from rest_framework.views import APIView
from .services.analytics_service import AnalyticsService
from .serializers import (
    WholesalerStatsSerializer, OrderStatsSerializer,
    RevenueStatsSerializer, ProductStatsSerializer
)
from django.db import models
from catalog.models import Product
from commerce.models import Order, OrderItem
from django.db.models import Q, Sum, Count
from django.core.paginator import Paginator
from identity.models import User
from datetime import timedelta
from decimal import Decimal

from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
import csv
import io
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wholesaler_dashboard_stats(request):
    """Get all dashboard statistics for wholesaler"""
    user = request.user
    
    if user.role != 'wholesaler':
        return Response({'status': 'error', 'message': 'Only wholesalers can access dashboard stats'}, status=403)
    
    try:
        # ✅ Get date parameters from request
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        range_type = request.GET.get('range')
        
        stats = AnalyticsService.get_wholesaler_stats(user, start_date, end_date, range_type)
        serializer = WholesalerStatsSerializer(stats)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'cached': cache.has_key(f"wholesaler_stats:{user.id}:{start_date}:{end_date}:{range_type}")
        })
        
    except Exception as e:
        logger.error(f"Error fetching wholesaler stats: {e}")
        return Response({'status': 'error', 'message': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_stats(request):
    """Get order statistics (today, week, month, total)"""
    user = request.user
    
    if user.role != 'wholesaler':
        return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
    
    stats = AnalyticsService.get_order_stats(user)
    serializer = OrderStatsSerializer(stats)
    
    return Response({'status': 'success', 'data': serializer.data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def revenue_stats(request):
    """Get revenue statistics (today, week, month, total)"""
    user = request.user
    
    if user.role != 'wholesaler':
        return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
    
    stats = AnalyticsService.get_revenue_stats(user)
    serializer = RevenueStatsSerializer(stats)
    
    return Response({'status': 'success', 'data': serializer.data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def product_stats(request):
    """Get product statistics"""
    user = request.user
    
    if user.role != 'wholesaler':
        return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
    
    stats = AnalyticsService.get_product_stats(user)
    serializer = ProductStatsSerializer(stats)
    
    return Response({'status': 'success', 'data': serializer.data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_analytics(request):
    """Get sales analytics chart data (daily/weekly/monthly)"""
    from commerce.models import Order
    from django.db.models import Sum, Count
    from django.utils import timezone
    from datetime import timedelta
    
    user = request.user
    
    if user.role != 'wholesaler':
        return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
    
    period = request.GET.get('period', 'weekly')  # daily, weekly, monthly
    
    today = timezone.now().date()
    
    if period == 'daily':
        days = 7
        dates = [(today - timedelta(days=i)) for i in range(days - 1, -1, -1)]
        labels = [d.strftime('%a') for d in dates]
    elif period == 'weekly':
        weeks = 6
        dates = [(today - timedelta(weeks=i)) for i in range(weeks - 1, -1, -1)]
        labels = [f"Week {d.isocalendar()[1]}" for d in dates]
    else:  # monthly
        months = 6
        dates = [(today.replace(day=1) - timedelta(days=30*i)) for i in range(months - 1, -1, -1)]
        labels = [d.strftime('%b %Y') for d in dates]
    
    sales_data = []
    for date in dates:
        if period == 'daily':
            start_date = date
            end_date = date + timedelta(days=1)
        elif period == 'weekly':
            start_date = date - timedelta(days=date.weekday())
            end_date = start_date + timedelta(days=7)
        else:  # monthly
            start_date = date.replace(day=1)
            next_month = start_date.replace(month=start_date.month + 1) if start_date.month < 12 else start_date.replace(year=start_date.year + 1, month=1)
            end_date = next_month
        
        total = Order.objects.filter(
            wholesaler=user,
            status='delivered',
            created_at__date__gte=start_date,
            created_at__date__lt=end_date
        ).aggregate(total=Sum('grand_total'))['total'] or 0
        
        sales_data.append(float(total))
    
    return Response({
        'status': 'success',
        'data': {
            'period': period,
            'labels': labels,
            'values': sales_data,
            'max_value': max(sales_data) if sales_data else 0,
            'total': sum(sales_data)
        }
    })


class CategoryPerformanceAPIView(APIView):
    """Get sales performance by category"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Handle GET request"""
        from commerce.models import Order, OrderItem
        from catalog.models import Category
        from django.db.models import Sum
        
        user = request.user
        
        if user.role != 'wholesaler':
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get all order items from wholesaler's delivered orders
        order_items = OrderItem.objects.filter(
            order__wholesaler=user,
            order__status='delivered'
        ).select_related('product__category')
        
        # Aggregate by category
        category_data = {}
        for item in order_items:
            category = item.product.category
            if category:
                cat_name = category.name
                if cat_name not in category_data:
                    category_data[cat_name] = {
                        'total': 0,
                        'revenue': 0
                    }
                category_data[cat_name]['total'] += 1
                category_data[cat_name]['revenue'] += float(item.price * item.quantity)
        
        # Calculate percentages and prepare response
        total_revenue = sum(data['revenue'] for data in category_data.values())
        total_items = sum(data['total'] for data in category_data.values())
        
        result = []
        colors = ['primary', 'success', 'accent', 'warning', 'info']
        for idx, (name, data) in enumerate(category_data.items()):
            percentage = (data['revenue'] / total_revenue * 100) if total_revenue > 0 else 0
            result.append({
                'id': idx + 1,
                'name': name,
                'value': round(percentage, 1),
                'color': colors[idx % len(colors)],
                'amount': f"₹{data['revenue']:,.0f}",
                'revenue': data['revenue'],
                'item_count': data['total']
            })
        
        # Sort by revenue descending
        result.sort(key=lambda x: x['revenue'], reverse=True)
        
        return Response({
            'status': 'success',
            'data': {
                'categories': result,
                'total_revenue': f"₹{total_revenue:,.0f}",
                'total_items': total_items
            }
        })
    

class LowStockAlertsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.role != 'wholesaler':
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
        
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 8))
        
        products = Product.objects.filter(
            seller=user,
            stock__lte=models.F('threshold'),
            stock__gt=0,
            status='active'
        ).select_related('category').order_by('stock')
        
        paginator = Paginator(products, per_page)
        page_obj = paginator.get_page(page)
        
        data = []
        for product in page_obj:
            data.append({
                'id': product.id,
                'name': product.name,
                'sku': product.sku,
                'stock': product.stock,
                'threshold': product.threshold,
                'category': product.category.name if product.category else 'Uncategorized',
            })
        
        return Response({
            'status': 'success',
            'data': data,
            'count': paginator.count,
            'page': page,
            'total_pages': paginator.num_pages,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous()
        })
    

class RecentOrdersAPIView(APIView):
    """Get recent orders for wholesaler dashboard"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role != 'wholesaler':
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
        
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 10))
        
        orders = Order.objects.filter(
            wholesaler=user
        ).select_related('customer').order_by('-created_at')
        
        paginator = Paginator(orders, per_page)
        page_obj = paginator.get_page(page)
        
        data = []
        for order in page_obj:
            data.append({
                'id': order.order_number,
                'customer': order.customer.get_full_name() or order.customer.email,
                'items': order.items.count(),
                'amount': float(order.grand_total),
                'date': self.get_time_ago(order.created_at),
                'status': order.status,
                'payment': order.payment_status
            })
        
        return Response({
            'status': 'success',
            'data': data,
            'count': paginator.count,
            'page': page,
            'total_pages': paginator.num_pages,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous()
        })
    
    def get_time_ago(self, created_at):
        from django.utils import timezone
        from datetime import datetime
        
        now = timezone.now()
        diff = now - created_at
        
        if diff.seconds < 60:
            return f"{diff.seconds} sec ago"
        elif diff.seconds < 3600:
            minutes = diff.seconds // 60
            return f"{minutes} min ago"
        elif diff.days == 0:
            hours = diff.seconds // 3600
            return f"{hours} hour ago"
        elif diff.days == 1:
            return "Yesterday"
        else:
            return f"{diff.days} days ago"
        

class RecentActivityAPIView(APIView):
    """Get recent activity for wholesaler dashboard"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role != 'wholesaler':
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
        
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 8))
        
        activities = []
        
        # Get recent orders
        recent_orders = Order.objects.filter(wholesaler=user).order_by('-created_at')[:20]
        for order in recent_orders:
            activities.append({
                'id': f"order_{order.id}",
                'type': 'order',
                'message': f"Order {order.order_number}",
                'time': self.get_time_ago(order.created_at),
                'amount': float(order.grand_total),
                'status': order.status,
                'icon': 'Package',
                'color': 'primary'
            })
        
        # Sort by time
        activities.sort(key=lambda x: x['time'], reverse=True)
        
        # Paginate
        paginator = Paginator(activities, per_page)
        page_obj = paginator.get_page(page)
        
        return Response({
            'status': 'success',
            'data': page_obj.object_list,
            'count': paginator.count,
            'page': page,
            'total_pages': paginator.num_pages,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous()
        })
    
    def get_time_ago(self, created_at):
        now = timezone.now()
        diff = now - created_at
        
        if diff.seconds < 60:
            return f"{diff.seconds} sec ago"
        elif diff.seconds < 3600:
            minutes = diff.seconds // 60
            return f"{minutes} min ago"
        elif diff.days == 0:
            hours = diff.seconds // 3600
            return f"{hours} hour ago"
        elif diff.days == 1:
            return "Yesterday"
        else:
            return f"{diff.days} days ago"
        


class TopCustomersAPIView(APIView):
    """Get top customers for wholesaler dashboard"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role != 'wholesaler':
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
        
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 6))
        
        # Get all retailers who bought from this wholesaler
        customers_data = {}
        orders = Order.objects.filter(wholesaler=user, status='delivered').select_related('customer')
        
        for order in orders:
            customer = order.customer
            if customer.id not in customers_data:
                customers_data[customer.id] = {
                    'id': customer.id,
                    'name': customer.get_full_name() or customer.email,
                    'email': customer.email,
                    'phone': customer.mobile or '',
                    'orders': 0,
                    'spent': 0,
                    'since': customer.date_joined.year
                }
            customers_data[customer.id]['orders'] += 1
            customers_data[customer.id]['spent'] += float(order.grand_total)
        
        # Convert to list and sort by spent
        customers_list = list(customers_data.values())
        customers_list.sort(key=lambda x: x['spent'], reverse=True)
        
        # Add rank and avatar
        for idx, cust in enumerate(customers_list):
            cust['rank'] = idx + 1
            cust['avatar'] = cust['name'][:2].upper()
            cust['color'] = ['primary', 'success', 'accent', 'warning', 'info'][idx % 5]
            cust['type'] = 'retailer'
            cust['spent_formatted'] = f"₹{cust['spent']:,.0f}"
        
        # Paginate
        paginator = Paginator(customers_list, per_page)
        page_obj = paginator.get_page(page)
        
        # Calculate total growth (mock for now)
        total_spent = sum(c['spent'] for c in customers_list)
        previous_spent = total_spent * 0.77  # Mock 23% growth
        
        return Response({
            'status': 'success',
            'data': page_obj.object_list,
            'count': paginator.count,
            'page': page,
            'total_pages': paginator.num_pages,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'total_spent': f"₹{total_spent:,.0f}",
            'growth': '23%'
        })
    

class PendingTasksAPIView(APIView):
    """Get pending tasks for wholesaler dashboard"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role != 'wholesaler':
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
        
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 8))
        task_type = request.GET.get('type', 'all')  # all, orders, products, payouts
        
        tasks = []
        
        # Pending Orders
        if task_type in ['all', 'orders']:
            pending_orders = Order.objects.filter(
                wholesaler=user,
                status__in=['pending', 'confirmed']
            ).order_by('-created_at')[:20]
            
            for order in pending_orders:
                tasks.append({
                    'id': f"order_{order.id}",
                    'type': 'order',
                    'task': f"Process order {order.order_number}",
                    'time': self.get_time_ago(order.created_at),
                    'priority': self.get_priority(order.created_at),
                    'amount': f"₹{float(order.grand_total):,.0f}",
                    'customer': order.customer.get_full_name() or order.customer.email
                })
        
        # Low Stock Products
        if task_type in ['all', 'products']:
            low_stock_products = Product.objects.filter(
                seller=user,
                stock__lte=models.F('threshold'),
                stock__gt=0,
                status='active'
            ).order_by('stock')[:20]
            
            for product in low_stock_products:
                tasks.append({
                    'id': f"product_{product.id}",
                    'type': 'product',
                    'task': f"Restock {product.name}",
                    'time': f"Stock: {product.stock}/{product.threshold}",
                    'priority': 'high' if product.stock <= 2 else 'medium',
                    'product': product.name,
                    'sku': product.sku
                })
        
        # Sort by priority
        priority_order = {'high': 0, 'medium': 1, 'low': 2}
        tasks.sort(key=lambda x: priority_order.get(x.get('priority', 'low'), 3))
        
        # Calculate stats
        high_count = sum(1 for t in tasks if t.get('priority') == 'high')
        medium_count = sum(1 for t in tasks if t.get('priority') == 'medium')
        low_count = sum(1 for t in tasks if t.get('priority') == 'low')
        
        # Paginate
        paginator = Paginator(tasks, per_page)
        page_obj = paginator.get_page(page)
        
        return Response({
            'status': 'success',
            'data': page_obj.object_list,
            'count': paginator.count,
            'page': page,
            'total_pages': paginator.num_pages,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'stats': {
                'high': high_count,
                'medium': medium_count,
                'low': low_count,
                'total': len(tasks)
            }
        })
    
    def get_time_ago(self, created_at):
        now = timezone.now()
        diff = now - created_at
        
        if diff.seconds < 3600:
            minutes = diff.seconds // 60
            return f"{minutes} min ago" if minutes > 0 else "Just now"
        elif diff.days == 0:
            hours = diff.seconds // 3600
            return f"{hours} hour ago"
        elif diff.days == 1:
            return "Yesterday"
        else:
            return f"{diff.days} days ago"
    
    def get_priority(self, created_at):
        now = timezone.now()
        diff = now - created_at
        
        if diff.seconds < 3600:  # Less than 1 hour
            return 'high'
        elif diff.days == 0:  # Less than 24 hours
            return 'medium'
        else:
            return 'low'
        

class WithdrawalStatsAPIView(APIView):
    """Get withdrawal statistics for wholesaler"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role != 'wholesaler':
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
        
        # Get total withdrawals (from your withdrawal model - create if needed)
        # For now, calculate from orders or use mock data
        total_withdrawn = Decimal('0')
        pending_withdrawals = Decimal('0')
        next_payout_date = "Mar 25, 2024"
        
        # Calculate available balance (total_revenue - total_withdrawn)
        from commerce.models import Order
        total_revenue = Order.objects.filter(
            wholesaler=user,
            status='delivered'
        ).aggregate(total=models.Sum('grand_total'))['total'] or Decimal('0')
        
        available_balance = total_revenue - total_withdrawn
        
        return Response({
            'status': 'success',
            'data': {
                'total_withdrawn': float(total_withdrawn),
                'pending_withdrawals': float(pending_withdrawals),
                'available_balance': float(available_balance),
                'next_payout_date': next_payout_date,
                'total_revenue': float(total_revenue)
            }
        })
    

class TopProductsAPIView(APIView):
    """Get top selling products for wholesaler"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.role != 'wholesaler':
            return Response({'error': 'Unauthorized'}, status=403)
        
        # Get delivered order items
        top_products = OrderItem.objects.filter(
            order__wholesaler=user,
            order__status='delivered'
        ).values('product_id', 'product_name').annotate(
            total_sold=Sum('quantity'),
            total_revenue=Sum('total')
        ).order_by('-total_sold')[:10]
        
        return Response({
            'status': 'success',
            'data': list(top_products)
        })


class GeographicSalesAPIView(APIView):
    """Get sales by region/city"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.role != 'wholesaler':
            return Response({'error': 'Unauthorized'}, status=403)
        
        geo_sales = Order.objects.filter(
            wholesaler=user,
            status='delivered'
        ).values('shipping_city').annotate(
            total=Sum('grand_total'),
            orders=Count('id')
        ).order_by('-total')[:10]
        
        return Response({
            'status': 'success',
            'data': list(geo_sales)
        })


class HourlySalesAPIView(APIView):
    """Get sales by hour of day"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.role != 'wholesaler':
            return Response({'error': 'Unauthorized'}, status=403)
        
        # Get orders from last 30 days
        thirty_days_ago = timezone.now() - timedelta(days=30)
        
        hourly_data = []
        for hour in range(24):
            total = Order.objects.filter(
                wholesaler=user,
                status='delivered',
                created_at__hour=hour,
                created_at__gte=thirty_days_ago
            ).aggregate(total=Sum('grand_total'))['total'] or 0
            
            hourly_data.append({
                'hour': f"{hour}:00",
                'total': float(total)
            })
        
        return Response({
            'status': 'success',
            'data': hourly_data
        })
    

class ExportReportAPIView(APIView):
    """Export report to PDF/Excel/CSV"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        report_type = request.GET.get('type', 'sales')
        format_type = request.GET.get('format', 'pdf')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        
        user = request.user
        if user.role != 'wholesaler':
            return Response({'error': 'Unauthorized'}, status=403)
        
        # Get data based on report type
        data = self.get_report_data(user, report_type, start_date, end_date)
        
        if format_type == 'csv':
            return self.export_csv(data, report_type)
        elif format_type == 'excel':
            return self.export_excel(data, report_type)
        else:
            return self.export_pdf(data, report_type)
    
    def get_report_data(self, user, report_type, start_date, end_date):
        from commerce.models import Order, OrderItem
        from catalog.models import Product
        
        # Apply date filter
        date_filter = {}
        if start_date and end_date:
            date_filter = {'created_at__date__range': [start_date, end_date]}
        
        if report_type == 'sales':
            orders = Order.objects.filter(wholesaler=user, **date_filter)
            return [{
                'Date': o.created_at.strftime('%Y-%m-%d'),
                'Order ID': o.order_number,
                'Amount': float(o.grand_total),
                'Status': o.status,
                'Payment': o.payment_status
            } for o in orders]
        
        elif report_type == 'inventory':
            products = Product.objects.filter(seller=user)
            return [{
                'SKU': p.sku,
                'Product': p.name,
                'Category': p.category.name if p.category else '-',
                'Stock': p.stock,
                'Threshold': p.threshold,
                'Status': 'Low Stock' if p.stock <= p.threshold else 'In Stock'
            } for p in products]
        
        elif report_type == 'customer':
            customers = Order.objects.filter(wholesaler=user).values('customer__email').distinct()
            return [{'Customer': c['customer__email'], 'Orders': 0} for c in customers]
        
        return []
    
    def export_csv(self, data, report_type):
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=data[0].keys() if data else [])
        writer.writeheader()
        writer.writerows(data)
        
        response = HttpResponse(output.getvalue(), content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{report_type}_report.csv"'
        return response
    
    def export_excel(self, data, report_type):
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = f"{report_type.capitalize()} Report"
        
        # Headers
        headers = list(data[0].keys()) if data else []
        for col, header in enumerate(headers, 1):
            cell = ws.cell(row=1, column=col, value=header)
            cell.font = Font(bold=True)
            cell.fill = PatternFill(start_color="3662d9", end_color="3662d9", fill_type="solid")
            cell.font = Font(bold=True, color="FFFFFF")
        
        # Data
        for row_idx, row in enumerate(data, 2):
            for col_idx, key in enumerate(headers, 1):
                ws.cell(row=row_idx, column=col_idx, value=row.get(key, ''))
        
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename="{report_type}_report.xlsx"'
        wb.save(response)
        return response
    
    def export_pdf(self, data, report_type):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()
        
        elements = []
        elements.append(Paragraph(f"{report_type.capitalize()} Report", styles['Title']))
        
        if data:
            table_data = [list(data[0].keys())] + [[row.get(k, '') for k in data[0].keys()] for row in data]
            table = Table(table_data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            elements.append(table)
        
        doc.build(elements)
        buffer.seek(0)
        
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{report_type}_report.pdf"'
        return response