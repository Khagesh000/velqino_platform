# tasks.py
from celery import shared_task
from celery.exceptions import MaxRetriesExceededError
from django.core.cache import cache
from django.db import transaction
from .models import WholesalerProfile, User
from .utils.cache_utils import CacheService
import logging
from typing import Dict, Any

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
        from django_redis import get_redis_connection
        redis_conn = get_redis_connection("default")
        keys = redis_conn.keys(cache_key)
        if keys:
            redis_conn.delete(*keys)
        
        logger.info(f"Cache updated for profile {profile_id}")
        
    except Exception as e:
        logger.error(f"Cache update failed for profile {profile_id}: {e}")