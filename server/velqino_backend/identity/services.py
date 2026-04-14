# identity/services.py

import logging
from django.core.cache import cache
from django.db import transaction
from django.db import models
from .models import User, WholesalerProfile, RetailerProfile
from .serializers import WholesalerProfileSerializer, RetailerProfileSerializer

logger = logging.getLogger(__name__)


# ==================== WHOLESALER SERVICES ====================

class WholesalerService:
    
    @staticmethod
    def get_wholesaler_profile(user_id):
        """Get wholesaler profile with Redis caching"""
        cache_key = f"wholesaler_profile_{user_id}"
        profile = cache.get(cache_key)
        
        if profile:
            return profile
        
        profile = WholesalerProfile.objects.select_related("user").get(user_id=user_id)
        cache.set(cache_key, profile, timeout=60 * 10)  # Cache for 10 minutes
        
        return profile
    
    @staticmethod
    def update_wholesaler_profile(user_id, data):
        """Update wholesaler profile and clear cache"""
        cache_key = f"wholesaler_profile_{user_id}"
        
        with transaction.atomic():
            profile = WholesalerProfile.objects.select_for_update().get(user_id=user_id)
            
            for key, value in data.items():
                if hasattr(profile, key) and value is not None:
                    setattr(profile, key, value)
            
            profile.save()
            cache.delete(cache_key)
            logger.info(f"Wholesaler profile updated: {user_id}")
            return profile
    
    @staticmethod
    def clear_wholesaler_cache(user_id):
        """Clear wholesaler cache"""
        cache_key = f"wholesaler_profile_{user_id}"
        cache.delete(cache_key)


# ==================== RETAILER SERVICES ====================

class RetailerService:
    
    @staticmethod
    def get_retailer_profile(user_id):
        """Get retailer profile with Redis caching"""
        cache_key = f"retailer_profile_{user_id}"
        profile = cache.get(cache_key)
        
        if profile:
            return profile
        
        profile = RetailerProfile.objects.select_related("user").get(user_id=user_id)
        cache.set(cache_key, profile, timeout=60 * 10)  # Cache for 10 minutes
        
        return profile
    
    @staticmethod
    def update_retailer_profile(user_id, data):
        """Update retailer profile and clear cache"""
        cache_key = f"retailer_profile_{user_id}"
        
        with transaction.atomic():
            profile = RetailerProfile.objects.select_for_update().get(user_id=user_id)
            
            for key, value in data.items():
                if hasattr(profile, key) and value is not None:
                    setattr(profile, key, value)
            
            profile.save()
            cache.delete(cache_key)
            logger.info(f"Retailer profile updated: {user_id}")
            return profile
    
    @staticmethod
    def clear_retailer_cache(user_id):
        """Clear retailer cache"""
        cache_key = f"retailer_profile_{user_id}"
        cache.delete(cache_key)
    
    @staticmethod
    def get_retailers_paginated(page=1, per_page=20, filters=None):
        """Get paginated retailers list"""
        queryset = RetailerProfile.objects.select_related('user').filter(is_active=True)
        
        if filters:
            if filters.get('city'):
                queryset = queryset.filter(city__icontains=filters['city'])
            if filters.get('state'):
                queryset = queryset.filter(state__icontains=filters['state'])
            if filters.get('search'):
                queryset = queryset.filter(
                    models.Q(business_name__icontains=filters['search']) |
                    models.Q(user__email__icontains=filters['search'])
                )
        
        queryset = queryset.order_by('-created_at')
        
        start = (page - 1) * per_page
        end = start + per_page
        total = queryset.count()
        retailers = queryset[start:end]
        
        serializer = RetailerProfileSerializer(retailers, many=True)
        
        return {
            'retailers': serializer.data,
            'pagination': {
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': (total + per_page - 1) // per_page
            }
        }