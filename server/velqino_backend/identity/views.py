from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from .models import User, WholesalerProfile
from .serializers import (
    WholesalerProfileSerializer,
    WholesalerProfileCreateSerializer,
    WholesalerProfileUpdateSerializer,
    WholesalerProfileListSerializer
)
from .tasks import verify_wholesaler_profile
from .utils.cache_utils import CacheService
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def register_wholesaler(request):
    """
    Register a new wholesaler (automatically sets role)
    """
    try:
        # Use serializer for validation and creation
        serializer = WholesalerProfileCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            with transaction.atomic():
                # Create user and profile
                profile = serializer.save()
                
                # Trigger verification asynchronously
                verify_wholesaler_profile.delay(profile.id)
                
                # Cache the new profile
                CacheService.get_wholesaler_profile(profile.user.id)
                
                # Return response with serialized data
                response_serializer = WholesalerProfileSerializer(profile)
                
                logger.info(f"New wholesaler registered: {profile.user.email}")
                
                return Response({
                    'status': 'success',
                    'message': 'Wholesaler registered successfully',
                    'data': response_serializer.data
                }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'status': 'error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Registration failed: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_wholesaler_profile(request, user_id):
    """
    Get wholesaler profile with caching
    """
    try:
        # Try cache first
        profile_data = CacheService.get_wholesaler_profile(user_id)
        
        if profile_data:
            return Response({
                'status': 'success',
                'data': profile_data,
                'source': 'cache'
            })
        
        # If not in cache, get from database
        profile = WholesalerProfile.objects.select_related('user').get(user_id=user_id)
        serializer = WholesalerProfileSerializer(profile)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'source': 'database'
        })
        
    except WholesalerProfile.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error fetching profile: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_wholesaler_profile(request, user_id):
    """
    Update wholesaler profile
    """
    try:
        profile = WholesalerProfile.objects.get(user_id=user_id)
        serializer = WholesalerProfileUpdateSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            # Invalidate cache
            CacheService.invalidate_profile(user_id)
            
            # Return updated data
            response_serializer = WholesalerProfileSerializer(profile)
            
            return Response({
                'status': 'success',
                'message': 'Profile updated successfully',
                'data': response_serializer.data
            })
        else:
            return Response({
                'status': 'error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except WholesalerProfile.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Update failed: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_wholesalers(request):
    """
    List all wholesalers with optional filters
    """
    try:
        city = request.query_params.get('city', None)
        verified = request.query_params.get('verified', None)
        
        # Build query
        queryset = WholesalerProfile.objects.select_related('user').all()
        
        if city:
            queryset = queryset.filter(city=city)
        if verified:
            queryset = queryset.filter(verified=verified.lower() == 'true')
        
        serializer = WholesalerProfileListSerializer(queryset, many=True)
        
        return Response({
            'status': 'success',
            'count': queryset.count(),
            'data': serializer.data
        })
        
    except Exception as e:
        logger.error(f"Error listing wholesalers: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_wholesaler_profile(request, user_id):
    """
    Delete wholesaler profile
    """
    try:
        profile = WholesalerProfile.objects.get(user_id=user_id)
        user = profile.user
        
        # Delete user (profile will be deleted via CASCADE)
        user.delete()
        
        # Invalidate cache
        CacheService.invalidate_profile(user_id)
        
        return Response({
            'status': 'success',
            'message': 'Profile deleted successfully'
        })
        
    except WholesalerProfile.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Delete failed: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)