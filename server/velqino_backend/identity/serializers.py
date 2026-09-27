import re
from datetime import date
from rest_framework import serializers
from .models import User, WholesalerProfile, RetailerProfile, CustomerProfile, Address

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
    """Serializer for CREATING a new wholesaler with full validations"""
    
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            'min_length': 'Password must be at least 8 characters long.',
            'required': 'Password is required.',
            'blank': 'Password cannot be blank.'
        }
    )
    confirm_password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            'min_length': 'Confirm password must be at least 8 characters long.',
            'required': 'Please confirm your password.',
            'blank': 'Confirm password cannot be blank.'
        }
    )
    first_name = serializers.CharField(
        write_only=True,
        error_messages={'required': 'First name is required.'}
    )
    last_name = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )
    email = serializers.EmailField(
        write_only=True,
        error_messages={'required': 'Email address is required.'}
    )
    mobile = serializers.CharField(
        write_only=True,
        error_messages={'required': 'Mobile number is required.'}
    )
    
    class Meta:
        model = WholesalerProfile
        fields = [
            # User fields
            'first_name', 'last_name', 'email', 'mobile', 
            'password', 'confirm_password',
            
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
        extra_kwargs = {
            'business_name': {'required': True, 'error_messages': {'required': 'Business name is required.'}},
            'business_type': {'required': True, 'error_messages': {'required': 'Business type is required.'}},
            'shop_address': {'required': True, 'error_messages': {'required': 'Shop/Office address is required.'}},
            'city': {'required': True, 'error_messages': {'required': 'City is required.'}},
            'state': {'required': True, 'error_messages': {'required': 'State is required.'}},
            'pincode': {'required': True, 'error_messages': {'required': 'Pincode is required.'}},
        }

    def to_internal_value(self, data):
        # Map frontend aliases gracefully
        mutable_data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'moq' in mutable_data and 'minimum_order_quantity' not in mutable_data:
            try:
                mutable_data['minimum_order_quantity'] = int(mutable_data['moq'])
            except (ValueError, TypeError):
                mutable_data['minimum_order_quantity'] = 1
        if 'business_desc' in mutable_data and 'business_description' not in mutable_data:
            mutable_data['business_description'] = mutable_data['business_desc']
        if 'priceRange' in mutable_data and 'price_range' not in mutable_data:
            mutable_data['price_range'] = mutable_data['priceRange']

        return super().to_internal_value(mutable_data)

    def validate_email(self, value):
        email = value.strip().lower()
        if not email:
            raise serializers.ValidationError("Email address is required.")
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            raise serializers.ValidationError("Please enter a valid email address.")
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email address already exists. Please sign in or use another email.")
        return email

    def validate_mobile(self, value):
        mobile = re.sub(r'[\s\-\(\)\+]', '', str(value))
        if len(mobile) == 12 and mobile.startswith('91'):
            mobile = mobile[2:]
        if not re.match(r'^[6-9]\d{9}$', mobile):
            raise serializers.ValidationError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.")
        if User.objects.filter(mobile=mobile).exists():
            raise serializers.ValidationError("This mobile number is already registered. Please sign in or use another number.")
        return mobile

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Za-z]', value):
            raise serializers.ValidationError("Password must contain at least one letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        return value

    def validate_gst_number(self, value):
        if value:
            gst = value.strip().upper()
            if not re.match(r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$', gst):
                raise serializers.ValidationError("Please enter a valid 15-character GST number (e.g. 22AAAAA0000A1Z5).")
            return gst
        return value

    def validate_pan_number(self, value):
        if value:
            pan = value.strip().upper()
            if not re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$', pan):
                raise serializers.ValidationError("Please enter a valid 10-character PAN number (e.g. ABCDE1234F).")
            return pan
        return value

    def validate_pincode(self, value):
        pincode = str(value).strip()
        if not re.match(r'^\d{6}$', pincode):
            raise serializers.ValidationError("Pincode must be exactly 6 digits.")
        return pincode

    def validate_ifsc_code(self, value):
        if value:
            ifsc = value.strip().upper()
            if not re.match(r'^[A-Z]{4}0[A-Z0-9]{6}$', ifsc):
                raise serializers.ValidationError("Please enter a valid 11-character IFSC code (e.g. HDFC0001234).")
            return ifsc
        return value

    def validate(self, data):
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        if password and confirm_password and password != confirm_password:
            raise serializers.ValidationError({
                'confirm_password': ['Passwords do not match. Please verify your password.']
            })
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        
        email = validated_data.pop('email').strip().lower()
        first_name = validated_data.pop('first_name', '').strip()
        last_name = validated_data.pop('last_name', '').strip()
        mobile = validated_data.pop('mobile').strip()
        password = validated_data.pop('password')
        
        # Unique username derived from email or business
        username = email.split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username__iexact=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            mobile=mobile,
            role='wholesaler'
        )
        
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
    

class UserUpdateSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True, required=False)
    
    def update(self, instance, validated_data):
        if 'username' in validated_data:
            instance.username = validated_data['username']
        if 'email' in validated_data:
            instance.email = validated_data['email']
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()
        return instance


class WholesalerProfileListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for LIST views"""
    
    class Meta:
        model = WholesalerProfile
        fields = [
            'id', 'business_name', 'business_type', 'city', 
            'verified', 'price_range', 'minimum_order_quantity', 'shop_photo'
        ]


# Retailers
# identity/serializers.py - ADD THIS

class RetailerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['email', 'mobile', 'password', 'confirm_password', 'username']
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data.get('username', validated_data['email'].split('@')[0]),
            email=validated_data['email'],
            mobile=validated_data['mobile'],
            password=validated_data['password'],
            role='retailer'  # ✅ Auto-set role
        )
        return user


class RetailerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    mobile = serializers.CharField(source='user.mobile', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = RetailerProfile
        fields = '__all__'
        depth = 1


class RetailerProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerProfile
        fields = ['business_name', 'gst_number', 'shipping_address', 'city', 'state', 'pincode']



# identity/serializers.py

class CustomerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            'min_length': 'Password must be at least 8 characters long.',
            'blank': 'Password cannot be blank.',
            'required': 'Password is required.'
        }
    )
    confirm_password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            'min_length': 'Confirm password must be at least 8 characters long.',
            'blank': 'Confirm password cannot be blank.',
            'required': 'Please confirm your password.'
        }
    )
    date_of_birth = serializers.DateField(
        required=False,
        allow_null=True,
        error_messages={'invalid': 'Please enter a valid date of birth.'}
    )

    class Meta:
        model = User
        fields = [
            'email',
            'mobile',
            'password',
            'confirm_password',
            'username',
            'date_of_birth'
        ]
        extra_kwargs = {
            'email': {'required': True, 'error_messages': {'required': 'Email address is required.'}},
            'username': {'required': True, 'error_messages': {'required': 'Username is required.'}},
            'mobile': {'required': True, 'error_messages': {'required': 'Mobile number is required.'}},
        }

    def validate_email(self, value):
        email = value.strip().lower()
        if not email:
            raise serializers.ValidationError("Email address is required.")
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            raise serializers.ValidationError("Please enter a valid email address.")
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email address already exists. Please sign in or use another email.")
        return email

    def validate_username(self, value):
        username = value.strip()
        if not username:
            raise serializers.ValidationError("Username is required.")
        if len(username) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        if not re.match(r'^[a-zA-Z0-9_.-]+$', username):
            raise serializers.ValidationError("Username can only contain letters, numbers, dots, and underscores.")
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError("This username is already taken. Please choose another username.")
        return username

    def validate_mobile(self, value):
        mobile = re.sub(r'[\s\-\(\)\+]', '', str(value))
        # If entered with 91 prefix and 12 digits, extract the 10 digits
        if len(mobile) == 12 and mobile.startswith('91'):
            mobile = mobile[2:]
        if not re.match(r'^[6-9]\d{9}$', mobile):
            raise serializers.ValidationError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.")
        if User.objects.filter(mobile=mobile).exists():
            raise serializers.ValidationError("This mobile number is already registered. Please sign in or use another number.")
        return mobile

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Za-z]', value):
            raise serializers.ValidationError("Password must contain at least one letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        return value

    def validate_date_of_birth(self, value):
        if value and value > date.today():
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        return value

    def validate(self, data):
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        if password and confirm_password and password != confirm_password:
            raise serializers.ValidationError({
                "confirm_password": ["Passwords do not match. Please verify your password."]
            })
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        date_of_birth = validated_data.pop('date_of_birth', None)

        user = User.objects.create_user(
            username=validated_data.get(
                'username',
                validated_data['email'].split('@')[0]
            ),
            email=validated_data['email'],
            mobile=validated_data['mobile'],
            password=validated_data['password'],
            role='customer'
        )
        if date_of_birth:
            user.date_of_birth = date_of_birth
            user.save(update_fields=['date_of_birth'])

        return user


# ✅ ADD Customer Profile Serializer
class CustomerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    mobile = serializers.CharField(source='user.mobile', read_only=True)
    
    class Meta:
        model = CustomerProfile
        fields = '__all__'
        depth = 1


# ✅ ADD Customer Profile Update Serializer
class CustomerProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ['full_name', 'phone', 'address_line1', 'address_line2', 'city', 'state', 'pincode', 'landmark', 'date_of_birth', 'anniversary_date']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'address_type', 'full_name', 'phone', 'street', 'city', 'state', 'pincode', 'country', 'landmark', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']