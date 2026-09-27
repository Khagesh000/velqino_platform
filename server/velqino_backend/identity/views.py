from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction
from datetime import date, timedelta
from .models import User, WholesalerProfile, RetailerProfile, Address
from .serializers import (
    WholesalerProfileSerializer,
    WholesalerProfileCreateSerializer,
    UserUpdateSerializer,
    WholesalerProfileUpdateSerializer,
    WholesalerProfileListSerializer,
    RetailerRegisterSerializer,
    RetailerProfileSerializer,
    RetailerProfileUpdateSerializer,
    CustomerProfile,
    CustomerProfileSerializer,
    CustomerProfileUpdateSerializer,
    CustomerRegisterSerializer,
    AddressSerializer
)
from .tasks import verify_wholesaler_profile
from .utils.cache_utils import CacheService
import logging
from django_ratelimit.decorators import ratelimit
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from commerce.models import Order
from django.db.models import Sum, Count, Max

logger = logging.getLogger(__name__)


@api_view(['POST'])
def admin_login(request):
    """Admin login"""
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        # ✅ Case-insensitive role check
        user = User.objects.filter(email=email).first()
        
        if not user or user.role.lower() != 'admin':
            return Response({
                'status': 'error',
                'message': 'Invalid admin credentials'
            }, status=401)
        
        if not user.check_password(password):
            return Response({
                'status': 'error',
                'message': 'Invalid admin credentials'
            }, status=401)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'status': 'success',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'data': {
                'id': user.id,
                'email': user.email,
                'role': user.role
            }
        })
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=400)


@api_view(['POST'])
def support_login(request):
    """Support staff login"""
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        # ✅ Case-insensitive role check
        user = User.objects.filter(email=email).first()
        
        if not user or user.role.lower() != 'support':
            return Response({
                'status': 'error',
                'message': 'Invalid support credentials'
            }, status=401)
        
        if not user.check_password(password):
            return Response({
                'status': 'error',
                'message': 'Invalid support credentials'
            }, status=401)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'status': 'success',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'data': {
                'id': user.id,
                'email': user.email,
                'role': user.role
            }
        })
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=400)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    """Admin/Support: Get all users"""
    user = request.user
    
    # Only admin and support can access
    if user.role not in ['admin', 'support']:
        return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
    
    users = User.objects.all().order_by('-id')
    
    data = []
    for u in users:
        data.append({
            'id': u.id,
            'email': u.email,
            'mobile': u.mobile,
            'username': u.username,
            'role': u.role,
            'is_active': u.is_active,
            'created_at': u.created_at
        })
    
    return Response({'status': 'success', 'data': data})



@api_view(['POST'])
@permission_classes([AllowAny])
def register_wholesaler(request):
    """
    Register a new wholesaler (automatically sets role='wholesaler')
    with comprehensive validation and structured error responses.
    """
    try:
        serializer = WholesalerProfileCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            with transaction.atomic():
                profile = serializer.save()
                
                # Trigger verification asynchronously if task available
                try:
                    verify_wholesaler_profile.delay(profile.id)
                except Exception:
                    pass
                
                # Cache the new profile
                try:
                    CacheService.get_wholesaler_profile(profile.user.id)
                except Exception:
                    pass
                
                # Generate JWT token
                refresh = RefreshToken.for_user(profile.user)
                response_serializer = WholesalerProfileSerializer(profile)
                
                logger.info(f"New wholesaler registered: {profile.user.email}")
                
                return Response({
                    'status': 'success',
                    'message': 'Wholesaler account created successfully! Welcome to Velqino.',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user_id': profile.user.id,
                    'role': 'wholesaler',
                    'data': response_serializer.data
                }, status=status.HTTP_201_CREATED)
        else:
            first_error = None
            for field, err_list in serializer.errors.items():
                if isinstance(err_list, list) and len(err_list) > 0:
                    first_error = str(err_list[0])
                    break
                elif isinstance(err_list, str):
                    first_error = err_list
                    break
            
            return Response({
                'status': 'error',
                'message': first_error or 'Validation failed. Please correct the highlighted errors.',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Wholesaler registration failed: {e}")
        return Response({
            'status': 'error',
            'message': str(e) or 'Registration failed due to a server error. Please try again.'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def wholesaler_login(request):
    """
    Wholesaler login with case-insensitive email lookup, role verification,
    and structured field-level error messages.
    """
    try:
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')
        
        errors = {}
        if not email:
            errors['email'] = ['Email address is required.']
        if not password:
            errors['password'] = ['Password is required.']
            
        if errors:
            return Response({
                'status': 'error',
                'message': 'Please provide both email and password.',
                'errors': errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        user = User.objects.filter(email__iexact=email).first()
        
        if not user:
            return Response({
                'status': 'error',
                'message': 'No wholesaler account found with this email address. Please register or check your email.',
                'errors': {'email': ['No wholesaler account found with this email address.']}
            }, status=status.HTTP_401_UNAUTHORIZED)
            
        if not user.check_password(password):
            return Response({
                'status': 'error',
                'message': 'Incorrect password. Please verify and try again.',
                'errors': {'password': ['Incorrect password. Please verify and try again.']}
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({
                'status': 'error',
                'message': 'Your wholesaler account is deactivated. Please contact customer support.',
                'errors': {'general': ['Your wholesaler account is deactivated. Please contact customer support.']}
            }, status=status.HTTP_403_FORBIDDEN)
            
        if user.role != 'wholesaler':
            return Response({
                'status': 'error',
                'message': f'This email is registered as a {user.role.title()}. Please sign in using the {user.role.title()} portal.',
                'errors': {'general': [f'This email is registered as a {user.role.title()}. Please sign in using the {user.role.title()} portal.']}
            }, status=status.HTTP_403_FORBIDDEN)
        
        refresh = RefreshToken.for_user(user)
        
        # Ensure profile exists or retrieve it
        profile = WholesalerProfile.objects.filter(user=user).first()
        if not profile:
            profile = WholesalerProfile.objects.create(
                user=user,
                business_name=user.first_name or user.username,
                business_type='Wholesaler',
                shop_address='',
                city='',
                state='',
                pincode=''
            )
            
        profile_serializer = WholesalerProfileSerializer(profile)
        
        return Response({
            'status': 'success',
            'message': 'Welcome back! Logged in successfully.',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': user.id,
            'role': 'wholesaler',
            'data': profile_serializer.data
        })
        
    except Exception as e:
        logger.error(f"Wholesaler login failed: {e}")
        return Response({
            'status': 'error',
            'message': 'An unexpected error occurred during login. Please try again.'
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





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_wholesalers(request):
    """
    List all wholesalers (for retailers, admin, support to see)
    """
    try:
        # Allow retailers, admin, and support to view wholesalers
        if request.user.role not in ['retailer', 'admin', 'support']:
            return Response({
                'status': 'error',
                'message': 'Only retailers, admin, or support can view wholesalers'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Pagination
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 20))
        
        wholesalers = WholesalerProfile.objects.select_related('user').filter(
            verified=True
        ).order_by('-created_at')
        
        # Paginate
        start = (page - 1) * per_page
        end = start + per_page
        paginated = wholesalers[start:end]
        
        serializer = WholesalerProfileSerializer(paginated, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'pagination': {
                'total': wholesalers.count(),
                'page': page,
                'per_page': per_page,
                'total_pages': (wholesalers.count() + per_page - 1) // per_page
            }
        })
        
    except Exception as e:
        logger.error(f"List wholesalers error: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_wholesaler_profile(request, user_id):
    """Update wholesaler profile"""
    try:
        profile = WholesalerProfile.objects.get(user_id=user_id)
    except WholesalerProfile.DoesNotExist:
        return Response({'status': 'error', 'message': 'Profile not found'}, status=404)
    
    if request.user.id != user_id and request.user.role != 'admin':
        return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
    
    # ✅ Update User
    user = profile.user
    user_serializer = UserUpdateSerializer(user, data=request.data, partial=True)
    if not user_serializer.is_valid():
        return Response({'status': 'error', 'errors': user_serializer.errors}, status=400)
    user_serializer.save()
    
    # ✅ Update Profile
    from .serializers import WholesalerProfileUpdateSerializer
    profile_serializer = WholesalerProfileUpdateSerializer(profile, data=request.data, partial=True)
    if profile_serializer.is_valid():
        profile_serializer.save()
        
        # Return combined data
        response_data = profile_serializer.data
        response_data['username'] = user.username
        response_data['user_email'] = user.email
        return Response({'status': 'success', 'data': response_data})
    
    return Response({'status': 'error', 'errors': profile_serializer.errors}, status=400)


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
#@ratelimit(key='ip', rate='10/hour', method='POST')
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
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_retailer_profile(request, user_id):
    """Update retailer profile"""
    try:
        profile = RetailerProfile.objects.get(user_id=user_id)
    except RetailerProfile.DoesNotExist:
        return Response({'status': 'error', 'message': 'Profile not found'}, status=404)
    
    if request.user.id != user_id and request.user.role != 'admin':
        return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
    
    serializer = RetailerProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'data': serializer.data})
    return Response({'status': 'error', 'errors': serializer.errors}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_retailers(request):
    try:
        if request.user.role not in ['wholesaler', 'admin', 'support']:
            return Response({
                'status': 'error',
                'message': 'Only wholesalers, admin, or support can view retailers'
            }, status=status.HTTP_403_FORBIDDEN)

        retailers = RetailerProfile.objects.select_related('user').all()

        # ✅ Basic filters
        city = request.GET.get('city')
        if city and city != 'all':
            retailers = retailers.filter(city__iexact=city)

        status_filter = request.GET.get('status')
        if status_filter and status_filter not in ['', 'all']:
            is_active = status_filter == 'active'
            retailers = retailers.filter(is_active=is_active)

        # ✅ Annotate with order count and total spent
        retailers = retailers.annotate(
            order_count=Count('user__retailer_orders'),
            total_spent=Sum('user__retailer_orders__total_amount'),
            last_order_date=Max('user__retailer_orders__created_at')
        )

        # ✅ Filter by orders
        min_orders = request.GET.get('min_orders')
        max_orders = request.GET.get('max_orders')
        if min_orders:
            retailers = retailers.filter(order_count__gte=int(min_orders))
        if max_orders:
            retailers = retailers.filter(order_count__lte=int(max_orders))

        # ✅ Filter by spent
        min_spent = request.GET.get('min_spent')
        max_spent = request.GET.get('max_spent')
        if min_spent:
            retailers = retailers.filter(total_spent__gte=float(min_spent))
        if max_spent:
            retailers = retailers.filter(total_spent__lte=float(max_spent))

        # ✅ Filter by last order days
        last_order_days = request.GET.get('last_order_days')
        if last_order_days:
            from django.utils import timezone
            from datetime import timedelta
            cutoff = timezone.now() - timedelta(days=int(last_order_days))
            retailers = retailers.filter(last_order_date__gte=cutoff)

        # ✅ Search
        search = request.GET.get('search')
        if search:
            retailers = retailers.filter(
                business_name__icontains=search
            ) | retailers.filter(
                user__email__icontains=search
            )

        retailers = retailers.order_by('-created_at')

        # Pagination
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 500))
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
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def block_retailer(request, id):
    """Block a retailer"""
    try:
        if request.user.role not in ['wholesaler', 'admin']:
            return Response({'status': 'error', 'message': 'Permission denied'}, status=403)
        
        # ✅ FIX: Use 'id' instead of 'user_id'
        retailer = RetailerProfile.objects.get(id=id)  # ← Change here
        retailer.is_active = False
        retailer.save()
        
        return Response({'status': 'success', 'message': 'Retailer blocked successfully'})
        
    except RetailerProfile.DoesNotExist:
        return Response({'status': 'error', 'message': 'Retailer not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unblock_retailer(request, id):
    """Unblock a retailer"""
    try:
        if request.user.role not in ['wholesaler', 'admin']:
            return Response({'status': 'error', 'message': 'Permission denied'}, status=403)
        
        # ✅ FIX: Use 'id' instead of 'user_id'
        retailer = RetailerProfile.objects.get(id=id)  # ← Change here
        retailer.is_active = True
        retailer.save()
        
        return Response({'status': 'success', 'message': 'Retailer unblocked successfully'})
        
    except RetailerProfile.DoesNotExist:
        return Response({'status': 'error', 'message': 'Retailer not found'}, status=404)
    

# identity/views.py

# ✅ Customer Registration
@api_view(['POST'])
def register_customer(request):
    """
    Register a new customer (automatically sets role='customer')
    with comprehensive validation and structured error responses.
    """
    try:
        serializer = CustomerRegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            with transaction.atomic():
                user = serializer.save()
                
                # Create customer profile
                CustomerProfile.objects.create(
                    user=user,
                    full_name=user.username,
                    phone=user.mobile,
                    date_of_birth=user.date_of_birth,
                    address_line1="",
                    city="",
                    state="",
                    pincode=""
                )
                
                refresh = RefreshToken.for_user(user)
                
                logger.info(f"New customer registered: {user.email}")
                
                return Response({
                    'status': 'success',
                    'message': 'Account created successfully! Welcome to Velqino.',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user_id': user.id,
                    'role': 'customer',
                    'data': {
                        'id': user.id,
                        'email': user.email,
                        'username': user.username,
                        'full_name': user.username,
                        'mobile': user.mobile
                    }
                }, status=status.HTTP_201_CREATED)
        else:
            first_error = None
            for field, err_list in serializer.errors.items():
                if isinstance(err_list, list) and len(err_list) > 0:
                    first_error = str(err_list[0])
                    break
                elif isinstance(err_list, str):
                    first_error = err_list
                    break
            
            return Response({
                'status': 'error',
                'message': first_error or 'Validation failed. Please correct the highlighted errors.',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Customer registration failed: {e}")
        return Response({
            'status': 'error',
            'message': str(e) or 'Registration failed due to a server error. Please try again.'
        }, status=status.HTTP_400_BAD_REQUEST)


# ✅ Customer Login
@api_view(['POST'])
def customer_login(request):
    """
    Customer login with case-insensitive email lookup, role verification,
    and structured field-level error messages.
    """
    try:
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')
        
        errors = {}
        if not email:
            errors['email'] = ['Email address is required.']
        if not password:
            errors['password'] = ['Password is required.']
            
        if errors:
            return Response({
                'status': 'error',
                'message': 'Please provide both email and password.',
                'errors': errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        user = User.objects.filter(email__iexact=email).first()
        
        if not user:
            return Response({
                'status': 'error',
                'message': 'No account found with this email address. Please check your email or register.',
                'errors': {'email': ['No account found with this email address.']}
            }, status=status.HTTP_401_UNAUTHORIZED)
            
        if not user.check_password(password):
            return Response({
                'status': 'error',
                'message': 'Incorrect password. Please verify and try again.',
                'errors': {'password': ['Incorrect password. Please verify and try again.']}
            }, status=status.HTTP_401_UNAUTHORIZED)
            
        if not user.is_active:
            return Response({
                'status': 'error',
                'message': 'Your account is deactivated. Please contact customer support.',
                'errors': {'general': ['Your account is deactivated. Please contact customer support.']}
            }, status=status.HTTP_403_FORBIDDEN)
            
        if user.role != 'customer':
            return Response({
                'status': 'error',
                'message': f'This email is registered as a {user.role.title()}. Please sign in using the {user.role.title()} portal.',
                'errors': {'general': [f'This email is registered as a {user.role.title()}. Please sign in using the {user.role.title()} portal.']}
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Ensure CustomerProfile exists
        profile, _ = CustomerProfile.objects.get_or_create(
            user=user,
            defaults={
                'full_name': user.username,
                'phone': user.mobile,
                'date_of_birth': user.date_of_birth,
                'address_line1': '',
                'city': '',
                'state': '',
                'pincode': ''
            }
        )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'status': 'success',
            'message': 'Welcome back! Logged in successfully.',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': user.id,
            'role': 'customer',
            'data': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'full_name': profile.full_name or user.username,
                'mobile': user.mobile
            }
        })
        
    except Exception as e:
        logger.error(f"Customer login failed: {e}")
        return Response({
            'status': 'error',
            'message': 'An unexpected error occurred during login. Please try again.'
        }, status=status.HTTP_400_BAD_REQUEST)


# ✅ ADD Customer Profile Views
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def customer_profile(request, user_id):
    """Get or update customer profile"""
    try:
        if request.user.id != user_id or request.user.role != 'customer':
            return Response({
                'status': 'error',
                'message': 'Unauthorized access'
            }, status=status.HTTP_403_FORBIDDEN)
        
        profile = CustomerProfile.objects.select_related('user').get(user_id=user_id)
        
        if request.method == 'GET':
            serializer = CustomerProfileSerializer(profile)
            return Response({
                'status': 'success',
                'data': serializer.data
            })
        
        elif request.method == 'PUT':
            serializer = CustomerProfileUpdateSerializer(profile, data=request.data, partial=True)
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
            
    except CustomerProfile.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Customer profile error: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_customer_profile(request, user_id):
    """Update customer profile"""
    try:
        profile = CustomerProfile.objects.get(user_id=user_id)
    except CustomerProfile.DoesNotExist:
        return Response({'status': 'error', 'message': 'Profile not found'}, status=404)
    
    if request.user.id != user_id and request.user.role != 'admin':
        return Response({'status': 'error', 'message': 'Unauthorized'}, status=403)
    
    serializer = CustomerProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'data': serializer.data})
    return Response({'status': 'error', 'errors': serializer.errors}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_customers(request):
    """
    List all customers (for retailer, admin, support to see)
    """
    try:
        # Allow retailers, admin, and support to view customers
        if request.user.role not in ['retailer', 'admin', 'support']:
            return Response({
                'status': 'error',
                'message': 'Only retailers, admin, or support can view customers'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Pagination
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 20))
        
        customers = CustomerProfile.objects.select_related('user').order_by('-created_at')
        
        # Paginate
        start = (page - 1) * per_page
        end = start + per_page
        paginated = customers[start:end]
        
        serializer = CustomerProfileSerializer(paginated, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'pagination': {
                'total': customers.count(),
                'page': page,
                'per_page': per_page,
                'total_pages': (customers.count() + per_page - 1) // per_page
            }
        })
        
    except Exception as e:
        logger.error(f"List customers error: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    

from django.core.cache import cache

from django.core.cache import cache

@api_view(['GET', 'POST'])
def user_addresses(request):
    """Get or create user addresses"""
    
    # ✅ Get session_id from header
    session_id = request.headers.get('X-Session-ID')
    #print(f"🔑 Session ID: {session_id}")
    
    # ✅ GET method
    if request.method == 'GET':
       # print(f"📥 GET request - User authenticated: {request.user.is_authenticated}")
        
        if not request.user.is_authenticated:
            # Guest: Get address from cache using session_id
            if session_id:
                cache_key = f'guest_address_{session_id}'
                guest_address = cache.get(cache_key)
                print(f"🔍 Cache key: {cache_key}")
                print(f"📦 Retrieved from cache: {guest_address}")
                
                if guest_address:
                    return Response({'status': 'success', 'data': [guest_address], 'source': 'cache'})
            return Response({'status': 'success', 'data': []})
        
        # Logged-in user: Get from database
        if request.user.role in ['admin', 'support']:
            addresses = Address.objects.all()
        else:
            addresses = Address.objects.filter(user=request.user)
        
        serializer = AddressSerializer(addresses, many=True)
        return Response({'status': 'success', 'data': serializer.data})
    
    # ✅ POST method
    elif request.method == 'POST':
        print(f"📤 POST request - User authenticated: {request.user.is_authenticated}")
        
        serializer = AddressSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({'status': 'error', 'errors': serializer.errors}, status=400)
        
        # ✅ Logged-in user: Save to database
        if request.user.is_authenticated:
            print(f"💾 Saving address to DATABASE for user: {request.user.id}")
            user = request.user
            if request.user.role == 'admin' and request.data.get('user_id'):
                try:
                    user = User.objects.get(id=request.data.get('user_id'))
                except User.DoesNotExist:
                    return Response({'status': 'error', 'message': 'User not found'}, status=404)
            
            address = serializer.save(user=user)
            return Response({'status': 'success', 'data': AddressSerializer(address).data, 'saved': True}, status=201)
        
        # ✅ Guest: Save to cache using session_id
        else:
            print(f"💾 Saving address to CACHE for session: {session_id}")
            
            if not session_id:
                return Response({'status': 'error', 'message': 'Session ID required'}, status=400)
            
            cache_key = f'guest_address_{session_id}'
            cache.set(cache_key, serializer.validated_data, 3600)
            
            # Verify cache was set
            verify = cache.get(cache_key)
            print(f"✅ Cache key: {cache_key}")
            print(f"✅ Cache set at: {cache_key}")
            print(f"✅ Verify cache read: {verify}")
            
            return Response({
                'status': 'success',
                'data': serializer.validated_data,
                'saved': False,
                'expires_in': '1 hour',
                'message': 'Address stored temporarily (expires in 1 hour)'
            }, status=200)


@api_view(['PUT', 'DELETE'])
def address_detail(request, address_id):
    """Update or delete address"""
    
    if not request.user.is_authenticated:
        return Response({'status': 'error', 'message': 'Authentication required'}, status=401)
    
    try:
        address = Address.objects.get(id=address_id, user=request.user)
    except Address.DoesNotExist:
        return Response({'status': 'error', 'message': 'Address not found'}, status=404)
    
    if request.method == 'PUT':
        serializer = AddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'data': serializer.data})
        return Response({'status': 'error', 'errors': serializer.errors}, status=400)
    
    elif request.method == 'DELETE':
        address.delete()
        return Response({'status': 'success', 'message': 'Address deleted'})
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    
    if not user.check_password(current_password):
        return Response({'status': 'error', 'message': 'Current password is incorrect'}, status=400)
    
    if len(new_password) < 8:
        return Response({'status': 'error', 'message': 'Password must be at least 8 characters'}, status=400)
    
    user.set_password(new_password)
    user.save()
    
    return Response({'status': 'success', 'message': 'Password changed successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_birthdays(request):
    user = request.user
    if user.role != 'retailer':
        return Response({'error': 'Unauthorized'}, status=403)
    
    today = date.today()
    next_30_days = today + timedelta(days=30)
    
    customers = User.objects.filter(role='customer', date_of_birth__isnull=False)
    
    upcoming = []
    for customer in customers:
        dob = customer.date_of_birth
        birthday_this_year = date(today.year, dob.month, dob.day)
        if today <= birthday_this_year <= next_30_days:
            days_left = (birthday_this_year - today).days
            upcoming.append({
                'id': customer.id,
                'name': customer.get_full_name() or customer.email,
                'phone': getattr(customer, 'phone', ''),
                'email': customer.email,
                'date_of_birth': dob,
                'days_left': days_left,
                'tier': getattr(customer, 'loyalty_tier', 'Bronze'),
                'total_spent': getattr(customer, 'total_spent', 0)
            })
    
    upcoming.sort(key=lambda x: x['days_left'])
    return Response({'status': 'success', 'data': upcoming[:10]})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_anniversaries(request):
    user = request.user
    if user.role != 'retailer':
        return Response({'error': 'Unauthorized'}, status=403)
    
    today = date.today()
    next_30_days = today + timedelta(days=30)
    
    customers = User.objects.filter(role='customer', anniversary_date__isnull=False)
    
    upcoming = []
    for customer in customers:
        anniversary = customer.anniversary_date
        anniversary_this_year = date(today.year, anniversary.month, anniversary.day)
        if today <= anniversary_this_year <= next_30_days:
            days_left = (anniversary_this_year - today).days
            years_with_us = today.year - anniversary.year
            upcoming.append({
                'id': customer.id,
                'name': customer.get_full_name() or customer.email,
                'phone': getattr(customer, 'phone', ''),
                'email': customer.email,
                'anniversary_date': anniversary,
                'days_left': days_left,
                'years_with_us': years_with_us,
                'tier': getattr(customer, 'loyalty_tier', 'Bronze'),
                'total_spent': getattr(customer, 'total_spent', 0)
            })
    
    upcoming.sort(key=lambda x: x['days_left'])
    return Response({'status': 'success', 'data': upcoming[:10]})