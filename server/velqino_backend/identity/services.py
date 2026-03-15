from django.core.cache import cache
from .models import WholesalerProfile


def get_wholesaler_profile(user_id):

    cache_key = f"wholesaler_profile_{user_id}"

    profile = cache.get(cache_key)

    if profile:
        return profile

    profile = WholesalerProfile.objects.select_related("user").get(user_id=user_id)

    cache.set(cache_key, profile, timeout=60 * 10)

    return profile