from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from .models import User, WholesalerProfile, RetailerProfile
from .serializers import (
    WholesalerProfileSerializer,
    WholesalerProfileCreateSerializer,
    WholesalerProfileUpdateSerializer,
    WholesalerProfileListSerializer,
    RetailerRegisterSerializer,
    RetailerProfileSerializer,
    RetailerProfileUpdateSerializer,
)
from .tasks import verify_wholesaler_profile
from .utils.cache_utils import CacheService
import logging
from django_ratelimit.decorators import ratelimit
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes


logger = logging.getLogger(__name__)

@api_view(['POST'])
@ratelimit(key='ip', rate='5/hour', method='POST')
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
                
                # Generate JWT token
                refresh = RefreshToken.for_user(profile.user)
                
                # Return response with serialized data
                response_serializer = WholesalerProfileSerializer(profile)
                
                logger.info(f"New wholesaler registered: {profile.user.email}")
                
                return Response({
                    'status': 'success',
                    'message': 'Wholesaler registered successfully',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
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
@permission_classes([IsAuthenticated])
def get_wholesaler_profile(request, user_id):
    """
    Get wholesaler profile with caching
    """
    try:
        # Check if user is accessing their own profile
        if request.user.id != user_id:
            return Response({
                'status': 'error',
                'message': 'Unauthorized access'
            }, status=status.HTTP_403_FORBIDDEN)
        
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
@permission_classes([IsAuthenticated])
def update_wholesaler_profile(request, user_id):
    """
    Update wholesaler profile
    """
    try:
        # Check if user is updating their own profile
        if request.user.id != user_id:
            return Response({
                'status': 'error',
                'message': 'Unauthorized access'
            }, status=status.HTTP_403_FORBIDDEN)
        
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
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def delete_wholesaler_profile(request, user_id):
    """
    Delete wholesaler profile
    """
    try:
        # Check if user is deleting their own profile
        if request.user.id != user_id:
            return Response({
                'status': 'error',
                'message': 'Unauthorized access'
            }, status=status.HTTP_403_FORBIDDEN)
        
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
    


""" @api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(request, username=email, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': user.id,
            'role': user.role
        })
    
    return Response({'error': 'Invalid credentials'}, status=400) """


#Retialers
@api_view(['POST'])
@ratelimit(key='ip', rate='10/hour', method='POST')
def register_retailer(request):
    """
    Register a new retailer (automatically sets role='retailer')
    """
    try:
        serializer = RetailerRegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            with transaction.atomic():
                # Create user
                user = serializer.save()
                
                # Create empty retailer profile (will be filled later)
                RetailerProfile.objects.create(
                    user=user,
                    business_name=user.username,
                    shipping_address="",
                    city="",
                    state="",
                    pincode=""
                )
                
                # Generate JWT token
                refresh = RefreshToken.for_user(user)
                
                logger.info(f"New retailer registered: {user.email}")
                
                return Response({
                    'status': 'success',
                    'message': 'Retailer registered successfully',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user_id': user.id
                }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'status': 'error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Retailer registration failed: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def retailer_login(request):
    """
    Retailer login
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = User.objects.filter(email=email).first()
        
        if not user or not user.check_password(password):
            return Response({
                'status': 'error',
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if user.role != 'retailer':
            return Response({
                'status': 'error',
                'message': 'Account is not a retailer account'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'status': 'success',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': user.id
        })
        
    except Exception as e:
        logger.error(f"Retailer login failed: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def retailer_profile(request, user_id):
    """
    Get or update retailer profile
    """
    try:
        # Security check
        if request.user.id != user_id or request.user.role != 'retailer':
            return Response({
                'status': 'error',
                'message': 'Unauthorized access'
            }, status=status.HTTP_403_FORBIDDEN)
        
        profile = RetailerProfile.objects.select_related('user').get(user_id=user_id)
        
        if request.method == 'GET':
            serializer = RetailerProfileSerializer(profile)
            return Response({
                'status': 'success',
                'data': serializer.data
            })
        
        elif request.method == 'PUT':
            serializer = RetailerProfileUpdateSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status': 'success',
                    'data': serializer.data
                })
            return Response({
                'status': 'error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except RetailerProfile.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Retailer profile error: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_retailers(request):
    """
    List all retailers (for wholesaler to see their customers)
    """
    try:
        # Only wholesalers can view retailers
        if request.user.role != 'wholesaler':
            return Response({
                'status': 'error',
                'message': 'Only wholesalers can view retailers'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Pagination
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 20))
        
        retailers = RetailerProfile.objects.select_related('user').filter(
            is_active=True
        ).order_by('-created_at')
        
        # Paginate
        start = (page - 1) * per_page
        end = start + per_page
        paginated = retailers[start:end]
        
        serializer = RetailerProfileSerializer(paginated, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'pagination': {
                'total': retailers.count(),
                'page': page,
                'per_page': per_page,
                'total_pages': (retailers.count() + per_page - 1) // per_page
            }
        })
        
    except Exception as e:
        logger.error(f"List retailers error: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)