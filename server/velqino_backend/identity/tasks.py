# tasks.py
from celery import shared_task
from celery.exceptions import MaxRetriesExceededError
from django.core.cache import cache
from django.db import transaction
from .models import WholesalerProfile, User
from .utils.cache_utils import CacheService
import logging
from typing import Dict, Any
from django_redis import get_redis_connection
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def verify_wholesaler_profile(self, profile_id: int) -> Dict[str, Any]:
    """
    Verify wholesaler profile with retry mechanism
    """
    try:
        with transaction.atomic():
            profile = WholesalerProfile.objects.select_for_update().get(id=profile_id)
            
            # Your verification logic
            verification_result = {
                'gst_valid': bool(profile.gst_number and len(profile.gst_number) == 15),
                'pan_valid': bool(profile.pan_number and len(profile.pan_number) == 10),
                'bank_details_valid': bool(
                    profile.account_number and 
                    profile.ifsc_code and 
                    profile.account_holder
                ),
                'business_info_complete': bool(
                    profile.business_name and 
                    profile.business_type
                )
            }
            
            # Auto-verify if all conditions met
            if all(verification_result.values()):
                profile.verify_profile()  # This will invalidate cache
                
                # Send notification (you can implement this)
                # send_verification_notification.delay(profile.user_id, True)
                
                result = {
                    'status': 'success',
                    'verified': True,
                    'profile_id': profile_id,
                    'verification_details': verification_result
                }
            else:
                result = {
                    'status': 'pending',
                    'verified': False,
                    'profile_id': profile_id,
                    'verification_details': verification_result,
                    'missing_fields': [k for k, v in verification_result.items() if not v]
                }
            
            logger.info(f"Profile {profile_id} verification completed: {result}")
            return result
            
    except WholesalerProfile.DoesNotExist:
        logger.error(f"Profile {profile_id} not found")
        return {'status': 'error', 'message': 'Profile not found'}
    
    except Exception as e:
        logger.error(f"Verification failed for profile {profile_id}: {e}")
        try:
            self.retry(countdown=60 * (2 ** self.request.retries))
        except MaxRetriesExceededError:
            logger.error(f"Max retries exceeded for profile {profile_id}")
            return {'status': 'error', 'message': str(e)}


@shared_task
def bulk_verify_wholesalers(city: str = None):
    """
    Bulk verification of wholesaler profiles
    """
    queryset = WholesalerProfile.objects.filter(verified=False)
    
    if city:
        queryset = queryset.filter(city=city)
    
    profile_ids = list(queryset.values_list('id', flat=True))
    
    # Queue verification for each profile
    for profile_id in profile_ids:
        verify_wholesaler_profile.delay(profile_id)
    
    return {
        'status': 'queued',
        'total_profiles': len(profile_ids),
        'city': city
    }


@shared_task
def update_wholesaler_cache(profile_id: int):
    """
    Update cache for wholesaler profile
    """
    try:
        profile = WholesalerProfile.objects.select_related('user').get(id=profile_id)
        
        # Update profile cache
        CacheService.get_wholesaler_profile(profile.user_id)
        
        # Update list cache if needed
        cache_key = f"wholesaler_list_{profile.city}_*"
        # Pattern delete for list caches
        # This is Redis specific
        
        redis_conn = get_redis_connection("default")
        for key in redis_conn.scan_iter(cache_key):
            redis_conn.delete(key)
        
        logger.info(f"Cache updated for profile {profile_id}")
        
    except Exception as e:
        logger.error(f"Cache update failed for profile {profile_id}: {e}")



# Retailers
@shared_task
def send_retailer_welcome_email(user_id):
    """Send welcome email to new retailer"""
    from .models import User, RetailerProfile
    
    try:
        user = User.objects.get(id=user_id)
        profile = RetailerProfile.objects.get(user_id=user_id)
        
        subject = f"Welcome to Velqino - {profile.business_name}"
        message = f"""
        Dear {profile.business_name},
        
        Welcome to Velqino Platform!
        
        Your retailer account has been successfully created.
        
        Login Email: {user.email}
        
        Get started:
        1. Complete your profile
        2. Browse products from wholesalers
        3. Place your first order
        
        Thank you for joining Velqino!
        
        Best Regards,
        Velqino Team
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        
        logger.info(f"Welcome email sent to retailer: {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send welcome email: {e}")
        return False


@shared_task
def verify_retailer_profile_async(profile_id):
    """Async verification of retailer profile"""
    from .models import RetailerProfile
    
    try:
        profile = RetailerProfile.objects.get(id=profile_id)
        
        # Auto-verify if all required fields are filled
        if profile.business_name and profile.shipping_address and profile.city:
            profile.is_verified = True
            profile.save()
            cache.delete(f"retailer_profile_{profile.user_id}")
            logger.info(f"Retailer profile auto-verified: {profile.user_id}")
            return True
        
        return False
        
    except Exception as e:
        logger.error(f"Retailer verification failed: {e}")
        return False


@shared_task
def cleanup_inactive_retailers():
    """Clean up inactive retailer profiles (runs monthly)"""
    from .models import RetailerProfile
    from datetime import timedelta
    from django.utils import timezone
    
    # Deactivate retailers with no activity for 6 months
    six_months_ago = timezone.now() - timedelta(days=180)
    
    inactive = RetailerProfile.objects.filter(
        is_active=True,
        created_at__lt=six_months_ago,
        user__last_login__lt=six_months_ago
    )
    
    count = inactive.update(is_active=False)
    
    # Clear cache for all deactivated
    for profile in inactive:
        cache.delete(f"retailer_profile_{profile.user_id}")
    
    logger.info(f"Cleaned up {count} inactive retailers")
    return count