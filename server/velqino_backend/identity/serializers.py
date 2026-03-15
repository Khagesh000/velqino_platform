from rest_framework import serializers
from .models import User, WholesalerProfile

class UserSerializer(serializers.ModelSerializer):
    """Serialize User model - basic user info"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'mobile', 'role', 'created_at']
        read_only_fields = ['id', 'role', 'created_at']


class WholesalerProfileSerializer(serializers.ModelSerializer):
    """Serialize WholesalerProfile with nested user details"""
    
    # Nested user fields
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_mobile = serializers.CharField(source='user.mobile', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    user_role = serializers.CharField(source='user.role', read_only=True)
    
    class Meta:
        model = WholesalerProfile
        fields = [
            # IDs
            'id', 'user_id',
            
            # User info (nested)
            'username', 'user_email', 'user_mobile', 'user_role',
            
            # Business Information
            'business_name', 'business_type', 'gst_number', 'pan_number',
            'business_description',
            
            # Address
            'shop_address', 'city', 'state', 'pincode', 'landmark',
            
            # Product Details
            'categories', 'minimum_order_quantity', 'price_range',
            
            # Bank Details
            'account_holder', 'bank_name', 'account_number', 'ifsc_code', 'upi_id',
            
            # Status
            'verified', 'verification_date', 'shop_photo',
            
            # Timestamps
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user_id', 'verified', 'verification_date', 
                           'created_at', 'updated_at']


class WholesalerProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer for CREATING a new wholesaler"""
    
    # User fields
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'})  # ⭐ NEW
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.EmailField(write_only=True)
    mobile = serializers.CharField(write_only=True)
    
    class Meta:
        model = WholesalerProfile
        fields = [
            # User fields
            'first_name', 'last_name', 'email', 'mobile', 
            'password', 'confirm_password',  # ⭐ BOTH password fields
            
            # Business info
            'business_name', 'business_type', 'gst_number', 'pan_number',
            'business_description',
            
            # Address
            'shop_address', 'city', 'state', 'pincode', 'landmark',
            
            # Product details
            'categories', 'minimum_order_quantity', 'price_range',
            
            # Bank details
            'account_holder', 'bank_name', 'account_number', 'ifsc_code', 'upi_id',
        ]
    
    # ⭐ NEW: Validate password match
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'password': 'Passwords do not match'
            })
        return data
    
    def create(self, validated_data):
        # Remove confirm_password (not needed in DB)
        validated_data.pop('confirm_password')
        
        # Extract user data
        user_data = {
            'username': validated_data.get('email'),
            'email': validated_data.pop('email'),
            'password': validated_data.pop('password'),  # Django hashes it!
            'first_name': validated_data.pop('first_name', ''),
            'last_name': validated_data.pop('last_name', ''),
            'mobile': validated_data.pop('mobile'),
            'role': 'wholesaler'
        }
        
        # Create user (password auto-hashed)
        user = User.objects.create_user(**user_data)
        
        # Create profile
        profile = WholesalerProfile.objects.create(
            user=user,
            **validated_data
        )
        
        return profile


class WholesalerProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for UPDATING an existing wholesaler"""
    
    class Meta:
        model = WholesalerProfile
        fields = [
            'business_name', 'business_type', 'gst_number', 'pan_number',
            'business_description', 'shop_address', 'city', 'state', 
            'pincode', 'landmark', 'categories', 'minimum_order_quantity',
            'price_range', 'account_holder', 'bank_name', 'account_number',
            'ifsc_code', 'upi_id', 'shop_photo'
        ]
    
    def validate_gst_number(self, value):
        if value and len(value) != 15:
            raise serializers.ValidationError("GST number must be 15 characters")
        return value
    
    def validate_pan_number(self, value):
        if value and len(value) != 10:
            raise serializers.ValidationError("PAN number must be 10 characters")
        return value
    
    def validate_ifsc_code(self, value):
        if value and len(value) != 11:
            raise serializers.ValidationError("IFSC code must be 11 characters")
        return value


class WholesalerProfileListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for LIST views"""
    
    class Meta:
        model = WholesalerProfile
        fields = [
            'id', 'business_name', 'business_type', 'city', 
            'verified', 'price_range', 'minimum_order_quantity', 'shop_photo'
        ]