# utils/cache_utils.py
from django.core.cache import cache
from django.conf import settings
import redis
import json
from typing import Optional, Any, Union
import logging

logger = logging.getLogger(__name__)

class RedisConnectionPool:
    """Manage Redis connection pool"""
    _instance = None
    _pool = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize_pool()
        return cls._instance
    
    def _initialize_pool(self):
        """Initialize Redis connection pool"""
        try:
            self._pool = redis.ConnectionPool(
                host=settings.REDIS_HOST or 'localhost',
                port=settings.REDIS_PORT or 6379,
                db=settings.REDIS_DB or 0,
                max_connections=settings.REDIS_MAX_CONNECTIONS or 20,
                decode_responses=True
            )
            logger.info("Redis connection pool initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Redis pool: {e}")
            self._pool = None
    
    def get_connection(self):
        """Get Redis connection from pool"""
        if self._pool:
            return redis.Redis(connection_pool=self._pool)
        return None

# Initialize pool globally
redis_pool = RedisConnectionPool()

class CacheService:
    """Service for handling cache operations with fallback"""
    
    # Cache keys patterns
    WHOLESALER_PROFILE = "wholesaler:profile:{user_id}"
    WHOLESALER_LIST = "wholesaler:list:{city}:{page}"
    WHOLESALER_SEARCH = "wholesaler:search:{query}"
    WHOLESALER_STATS = "wholesaler:stats"
    
    # Cache timeouts (in seconds)
    SHORT_TIMEOUT = 60 * 5  # 5 minutes
    MEDIUM_TIMEOUT = 60 * 30  # 30 minutes
    LONG_TIMEOUT = 60 * 60 * 24  # 24 hours
    
    @classmethod
    def get_wholesaler_profile(cls, user_id: int) -> Optional[dict]:
        """Get wholesaler profile with caching"""
        cache_key = cls.WHOLESALER_PROFILE.format(user_id=user_id)
        
        # Try to get from cache
        cached_data = cls._get_from_cache(cache_key)
        if cached_data:
            logger.debug(f"Cache hit for profile {user_id}")
            return cached_data
        
        # If not in cache, get from database
        logger.debug(f"Cache miss for profile {user_id}, fetching from DB")
        from identity.models import WholesalerProfile
        
        try:
            profile = WholesalerProfile.objects.select_related('user').get(user_id=user_id)
            profile_data = cls._serialize_profile(profile)
            
            # Store in cache
            cls._set_in_cache(cache_key, profile_data, timeout=cls.MEDIUM_TIMEOUT)
            
            return profile_data
        except WholesalerProfile.DoesNotExist:
            logger.warning(f"Profile not found for user {user_id}")
            return None
    
    @classmethod
    def _get_from_cache(cls, key: str) -> Optional[Any]:
        """Get data from cache with error handling"""
        try:
            # Try Django cache first
            data = cache.get(key)
            if data:
                return data
            
            # Try direct Redis connection
            redis_conn = redis_pool.get_connection()
            if redis_conn:
                data = redis_conn.get(key)
                if data:
                    return json.loads(data)
            
            return None
        except Exception as e:
            logger.error(f"Cache get error for key {key}: {e}")
            return None
    
    @classmethod
    def _set_in_cache(cls, key: str, value: Any, timeout: int = MEDIUM_TIMEOUT):
        """Set data in cache with error handling"""
        try:
            # Set in Django cache
            cache.set(key, value, timeout=timeout)
            
            # Also set in Redis directly
            redis_conn = redis_pool.get_connection()
            if redis_conn:
                redis_conn.setex(key, timeout, json.dumps(value))
        except Exception as e:
            logger.error(f"Cache set error for key {key}: {e}")
    
    @classmethod
    def invalidate_profile(cls, user_id: int):
        """Invalidate cached profile"""
        cache_key = cls.WHOLESALER_PROFILE.format(user_id=user_id)
        try:
            cache.delete(cache_key)
            redis_conn = redis_pool.get_connection()
            if redis_conn:
                redis_conn.delete(cache_key)
            logger.info(f"Cache invalidated for profile {user_id}")
        except Exception as e:
            logger.error(f"Cache invalidation error: {e}")
    
    @classmethod
    def _serialize_profile(cls, profile) -> dict:
        """Serialize profile object to dictionary"""
        return {
            'id': profile.id,
            'user_id': profile.user_id,
            'business_name': profile.business_name,
            'business_type': profile.business_type,
            'gst_number': profile.gst_number,
            'pan_number': profile.pan_number,
            'business_description': profile.business_description,
            'shop_address': profile.shop_address,
            'city': profile.city,
            'state': profile.state,
            'pincode': profile.pincode,
            'landmark': profile.landmark,
            'categories': profile.categories,
            'minimum_order_quantity': profile.minimum_order_quantity,
            'price_range': profile.price_range,
            'verified': profile.verified,
            'created_at': profile.created_at.isoformat() if profile.created_at else None,
            'user': {
                'username': profile.user.username,
                'email': profile.user.email,
                'mobile': profile.user.mobile,
            } if profile.user else None
        }