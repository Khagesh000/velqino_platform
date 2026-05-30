from django.db import models
from django.conf import settings

class GSTReturn(models.Model):
    RETURN_STATUS = (
        ('pending', 'Pending'),
        ('filed', 'Filed'),
        ('overdue', 'Overdue'),
    )
    
    retailer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='gst_returns')
    period = models.CharField(max_length=20, help_text="e.g., Q1 2026, Jan-Mar 2026")
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=RETURN_STATUS, default='pending', db_index=True)
    filed_date = models.DateField(null=True, blank=True)
    due_date = models.DateField()
    reference_number = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-period']
        indexes = [
            models.Index(fields=['retailer', 'status']),
            models.Index(fields=['period']),
        ]
    
    def __str__(self):
        return f"GST Return {self.period} - {self.retailer.email}"
    


class ScheduledReport(models.Model):
    FREQUENCY_CHOICES = (
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    )
    
    FORMAT_CHOICES = (
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
    )
    
    retailer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='scheduled_reports')
    name = models.CharField(max_length=100)
    report_type = models.CharField(max_length=20)  # sales, products, customers, tax, profit
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES)
    format_type = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='excel')
    recipients = models.TextField(help_text="Comma-separated email addresses")
    is_active = models.BooleanField(default=True)
    last_sent = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.frequency}"