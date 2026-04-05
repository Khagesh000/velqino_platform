'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Building, User, MapPin, Package, CreditCard, Check, Upload, AlertCircle } from '../../../utils/icons';
import { useRegisterWholesalerMutation } from '@/redux/wholesaler/slices/wholesalerSlice';
import ClientOnly from '@/app/ClientOnly';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function RegistrationFormContent() {

  const [currentStep, setCurrentStep] = useState(1);

  // ✅ HOOK IS NOW HERE - UNCONDITIONAL
  const [registerWholesaler, { isLoading, error, isSuccess }] = useRegisterWholesalerMutation();
  



  const [formData, setFormData] = useState({
    // Personal Info (matches backend: first_name, last_name)
    first_name: '',  // changed from firstName
    last_name: '',   // changed from lastName
    mobile: '',
    email: '',
    
    // Business Info (matches backend: business_name, business_type)
    business_name: '',     // changed from businessName
    business_type: '',     // changed from businessType
    gst_number: '',        // changed from gstNumber
    pan_number: '',        // changed from panNumber
    business_desc: '',     // changed from businessDesc
    
    // Address (matches backend: shop_address)
    shop_address: '',      // changed from shopAddress
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    
    // Product Categories
    categories: [],
    moq: '',
    price_range: '',       // changed from priceRange
    
    // Bank Details (matches backend: account_holder, bank_name, account_number, ifsc_code, upi_id)
    account_holder: '',    // changed from accountHolder
    bank_name: '',         // changed from bankName
    account_number: '',    // changed from accountNumber
    ifsc_code: '',         // changed from ifscCode
    upi_id: '',            // changed from upiId
    
    // Password fields (matches backend: password, confirm_password)
    password: '',
    confirm_password: ''   // ADDED - required by backend
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});
  const [errorStep, setErrorStep] = useState(null);

  const categories = [
    "Men's Clothing",
    "Women's Clothing", 
    "Kids Wear",
    "Footwear",
    "Accessories",
    "Traditional Wear",
    "Western Wear"
  ];

  const businessTypes = [
    "Manufacturer",
    "Wholesaler", 
    "Distributor",
    "Retailer"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
    
    // Clear categories error when user toggles selection
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        if (!formData.first_name) newErrors.first_name = 'First name is required';
        if (!formData.last_name) newErrors.last_name = 'Last name is required';
        if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
        else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Enter valid 10-digit number';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter valid email';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.confirm_password) newErrors.confirm_password = 'Please confirm password';
        else if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match';
        if (!otpSent || !otp) newErrors.otp = 'Please verify OTP';
        break;
        
      case 2:
        if (!formData.business_name) newErrors.business_name = 'Business name is required';
        if (!formData.business_type) newErrors.business_type = 'Business type is required';
        break;
        
      case 3:
        if (!formData.shop_address) newErrors.shop_address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.pincode) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter valid 6-digit pincode';
        break;
        
      case 4:
        if (formData.categories.length === 0) newErrors.categories = 'Select at least one category';
        if (!formData.price_range) newErrors.price_range = 'Price range is required';
        break;
        
      case 5:
        // Validate bank details before allowing submit
        if (!formData.account_holder) newErrors.account_holder = 'Account holder name is required';
        if (!formData.bank_name) newErrors.bank_name = 'Bank name is required';
        if (!formData.account_number) newErrors.account_number = 'Account number is required';
        if (!formData.ifsc_code) newErrors.ifsc_code = 'IFSC code is required';
        if (formData.ifsc_code && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code)) {
          newErrors.ifsc_code = 'Enter valid IFSC code';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateStep(5)) {
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    const response = await registerWholesaler(formData).unwrap();
    
    console.log('Token received:', response.access);
    
    // Store tokens after successful registration
    localStorage.setItem('access', response.access);
    localStorage.setItem('refresh', response.refresh);
    localStorage.setItem('username', response.data.username);
    localStorage.setItem('user_id', response.data.user_id);

    localStorage.setItem('is_wholesaler_registered', 'true');
    
    toast.success('Registration successful!', {
      position: "top-right",
      autoClose: 3000,
      theme: "colored"
    });
    
    // Redirect to dashboard or product page
    window.location.href = '/wholesaler/wholesalerdashboard';
    
  } catch (err) {
    console.error('Registration failed:', err);
    
    // Clear previous backend errors
    setBackendErrors({});
    
    // Field to step mapping
    const fieldToStep = {
      'first_name': 1, 'last_name': 1, 'mobile': 1, 'email': 1,
      'password': 1, 'confirm_password': 1,
      'business_name': 2, 'business_type': 2, 'gst_number': 2, 'pan_number': 2,
      'shop_address': 3, 'city': 3, 'state': 3, 'pincode': 3, 'landmark': 3,
      'categories': 4, 'price_range': 4,
      'account_holder': 5, 'bank_name': 5, 'account_number': 5, 'ifsc_code': 5, 'upi_id': 5
    };
    
    let stepToShow = null;
    const newBackendErrors = {};
    
    // Parse backend errors
    if (err.response?.data?.errors) {
      const backendErrorData = err.response.data.errors;
      
      for (const [field, errorMsg] of Object.entries(backendErrorData)) {
        newBackendErrors[field] = errorMsg;
        if (fieldToStep[field] && stepToShow === null) {
          stepToShow = fieldToStep[field];
        }
      }
    }
    
    // Handle duplicate email error
    if (err.response?.data?.message?.includes('Duplicate entry')) {
      newBackendErrors.email = 'Email already exists. Please use a different email.';
      stepToShow = 1;
    }
    
    // Handle non-field errors
    if (err.response?.data?.message && !stepToShow) {
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored"
      });
    }
    
    if (Object.keys(newBackendErrors).length > 0) {
      setBackendErrors(newBackendErrors);
      
      if (stepToShow) {
        setErrorStep(stepToShow);
        setCurrentStep(stepToShow);
        
        toast.error(`Please fix errors in ${steps[stepToShow-1].name} section`, {
          position: "top-right",
          autoClose: 5000,
          theme: "colored"
        });
      }
    } else if (!err.response?.data?.message) {
      toast.error('Registration failed. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        theme: "colored"
      });
    }
    
  } finally {
    setIsSubmitting(false);
  }
};

  useEffect(() => {
    if (isSuccess) {
      alert('Registration successful!');
      setFormData({
        first_name: '', last_name: '', mobile: '', email: '', password: '', confirm_password: '',
        business_name: '', business_type: '', gst_number: '', pan_number: '', business_desc: '',
        shop_address: '', city: '', state: '', pincode: '', landmark: '',
        categories: [], moq: '', price_range: '',
        account_holder: '', bank_name: '', account_number: '', ifsc_code: '', upi_id: ''
      });
      setCurrentStep(1);
      setOtpSent(false);
      setOtp('');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      alert(`Error: ${error?.data?.message || error?.message || 'Registration failed'}`);
    }
  }, [error]);

  const steps = [
    { number: 1, name: 'Personal Info', icon: User },
    { number: 2, name: 'Business Info', icon: Building },
    { number: 3, name: 'Address', icon: MapPin },
    { number: 4, name: 'Products', icon: Package },
    { number: 5, name: 'Bank Details', icon: CreditCard }
  ];

const renderPersonalInfo = () => (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-primary-600 mb-6">Personal Information</h3>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-text-secondary font-medium mb-2">First Name *</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.first_name) {
              setBackendErrors(prev => ({ ...prev, first_name: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.first_name || backendErrors.first_name ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter first name"
        />
        {(errors.first_name || backendErrors.first_name) && (
          <p className="text-error-500 text-sm mt-1">
            {backendErrors.first_name || errors.first_name}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-text-secondary font-medium mb-2">Last Name *</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.last_name) {
              setBackendErrors(prev => ({ ...prev, last_name: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.last_name || backendErrors.last_name ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter last name"
        />
        {(errors.last_name || backendErrors.last_name) && (
          <p className="text-error-500 text-sm mt-1">
            {backendErrors.last_name || errors.last_name}
          </p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-text-secondary font-medium mb-2">Mobile Number *</label>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.mobile) {
              setBackendErrors(prev => ({ ...prev, mobile: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.mobile || backendErrors.mobile ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter 10 digit number"
          maxLength="10"
        />
        {(errors.mobile || backendErrors.mobile) && (
          <p className="text-error-500 text-sm mt-1">
            {backendErrors.mobile || errors.mobile}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-text-secondary font-medium mb-2">Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.email) {
              setBackendErrors(prev => ({ ...prev, email: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.email || backendErrors.email ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter email address"
        />
        {(errors.email || backendErrors.email) && (
          <p className="text-error-500 text-sm mt-1">
            {backendErrors.email || errors.email}
          </p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-text-secondary font-medium mb-2">Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.password) {
              setBackendErrors(prev => ({ ...prev, password: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.password || backendErrors.password ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Create a password"
        />
        {(errors.password || backendErrors.password) && (
          <p className="text-error-500 text-sm mt-1">
            {backendErrors.password || errors.password}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-text-secondary font-medium mb-2">Confirm Password *</label>
        <input
          type="password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.confirm_password) {
              setBackendErrors(prev => ({ ...prev, confirm_password: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.confirm_password || backendErrors.confirm_password ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Confirm password"
        />
        {(errors.confirm_password || backendErrors.confirm_password) && (
          <p className="text-error-500 text-sm mt-1">
            {backendErrors.confirm_password || errors.confirm_password}
          </p>
        )}
      </div>
    </div>

    {/* OTP Section */}
    <div className="bg-primary-50 p-6 rounded-radius-xl border-2 border-primary-200">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary text-center sm:text-left tracking-widest font-mono ${
              errors.otp ? 'border-error-500' : 'border-medium focus:border-focus'
            }`}
            maxLength="6"
            disabled={!otpSent}
          />
        </div>
        <button
          type="button"
          onClick={() => setOtpSent(true)}
          className="px-6 py-3 bg-accent-500 text-text-inverse rounded-radius-lg font-medium hover:bg-accent-600 transition-fast whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!formData.mobile || !formData.email}
        >
          {otpSent ? 'Resend OTP' : 'Send OTP'}
        </button>
      </div>
      {errors.otp && <p className="text-error-500 text-sm mt-2">{errors.otp}</p>}
      {otpSent && !errors.otp && (
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-text-tertiary">OTP sent to {formData.mobile}</p>
          <p className="text-xs text-accent-600 cursor-pointer hover:underline">Change number?</p>
        </div>
      )}
    </div>
  </div>
);

const renderBusinessInfo = () => (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-primary-600 mb-6">Business Information</h3>
    
    <div>
      <label className="block text-text-secondary font-medium mb-2">Business/Store Name *</label>
      <input
        type="text"
        name="business_name"
        value={formData.business_name}
        onChange={(e) => {
          handleInputChange(e);
          if (backendErrors.business_name) {
            setBackendErrors(prev => ({ ...prev, business_name: null }));
          }
        }}
        className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
          errors.business_name || backendErrors.business_name ? 'border-error-500' : 'border-medium focus:border-focus'
        }`}
        placeholder="Enter business name"
      />
      {(errors.business_name || backendErrors.business_name) && (
        <p className="text-error-500 text-sm mt-1">
          {backendErrors.business_name || errors.business_name}
        </p>
      )}
    </div>

    <div>
      <label className="block text-text-secondary font-medium mb-2">Business Type *</label>
      <select
        name="business_type"
        value={formData.business_type}
        onChange={(e) => {
          handleInputChange(e);
          if (backendErrors.business_type) {
            setBackendErrors(prev => ({ ...prev, business_type: null }));
          }
        }}
        className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
          errors.business_type || backendErrors.business_type ? 'border-error-500' : 'border-medium focus:border-focus'
        }`}
      >
        <option value="">Select business type</option>
        {businessTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      {(errors.business_type || backendErrors.business_type) && (
        <p className="text-error-500 text-sm mt-1">
          {backendErrors.business_type || errors.business_type}
        </p>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-text-secondary font-medium mb-2">GST Number</label>
        <input
          type="text"
          name="gst_number"
          value={formData.gst_number}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.gst_number) {
              setBackendErrors(prev => ({ ...prev, gst_number: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            backendErrors.gst_number ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter GST number"
        />
        {backendErrors.gst_number && (
          <p className="text-error-500 text-sm mt-1">{backendErrors.gst_number}</p>
        )}
      </div>
      
      <div>
        <label className="block text-text-secondary font-medium mb-2">PAN Number</label>
        <input
          type="text"
          name="pan_number"
          value={formData.pan_number}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.pan_number) {
              setBackendErrors(prev => ({ ...prev, pan_number: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            backendErrors.pan_number ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter PAN number"
        />
        {backendErrors.pan_number && (
          <p className="text-error-500 text-sm mt-1">{backendErrors.pan_number}</p>
        )}
      </div>
    </div>

    <div>
      <label className="block text-text-secondary font-medium mb-2">Business Description</label>
      <textarea
        name="business_desc"
        value={formData.business_desc}
        onChange={handleInputChange}
        rows="3"
        className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
        placeholder="Tell us about your business..."
      />
    </div>
  </div>
);

const renderAddressInfo = () => (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-primary-600 mb-6">Address Details</h3>
    
    <div>
      <label className="block text-text-secondary font-medium mb-2">Shop/Office Address *</label>
      <input
        type="text"
        name="shop_address"
        value={formData.shop_address}
        onChange={(e) => {
          handleInputChange(e);
          if (backendErrors.shop_address) {
            setBackendErrors(prev => ({ ...prev, shop_address: null }));
          }
        }}
        className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
          errors.shop_address || backendErrors.shop_address ? 'border-error-500' : 'border-medium focus:border-focus'
        }`}
        placeholder="Enter full address"
      />
      {(errors.shop_address || backendErrors.shop_address) && (
        <p className="text-error-500 text-sm mt-1">
          {backendErrors.shop_address || errors.shop_address}
        </p>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-text-secondary font-medium mb-2">City *</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.city) {
              setBackendErrors(prev => ({ ...prev, city: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.city || backendErrors.city ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter city"
        />
        {(errors.city || backendErrors.city) && (
          <p className="text-error-500 text-sm mt-1">
            {backendErrors.city || errors.city}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-text-secondary font-medium mb-2">State *</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.state) {
              setBackendErrors(prev => ({ ...prev, state: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.state || backendErrors.state ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter state"
        />
        {(errors.state || backendErrors.state) && (
          <p className="text-error-500 text-sm mt-1">
            {backendErrors.state || errors.state}
          </p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-text-secondary font-medium mb-2">Pincode *</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.pincode) {
              setBackendErrors(prev => ({ ...prev, pincode: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.pincode || backendErrors.pincode ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter pincode"
          maxLength="6"
        />
        {(errors.pincode || backendErrors.pincode) && (
          <p className="text-error-500 text-sm mt-1">
            {backendErrors.pincode || errors.pincode}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-text-secondary font-medium mb-2">Landmark</label>
        <input
          type="text"
          name="landmark"
          value={formData.landmark}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
          placeholder="Nearby landmark"
        />
      </div>
    </div>
  </div>
);

const renderProductInfo = () => (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-primary-600 mb-6">Product Categories</h3>
    
    <div>
      <label className="block text-text-secondary font-medium mb-3">Select Categories *</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map(category => (
          <label
            key={category}
            className={`flex items-center p-3 border-2 rounded-radius-lg cursor-pointer transition-all ${
              formData.categories.includes(category)
                ? 'border-primary-500 bg-primary-50'
                : 'border-medium hover:border-primary-300'
            }`}
          >
            <input
              type="checkbox"
              checked={formData.categories.includes(category)}
              onChange={() => {
                handleCategoryToggle(category);
                if (backendErrors.categories) {
                  setBackendErrors(prev => ({ ...prev, categories: null }));
                }
              }}
              className="w-4 h-4 text-primary-500 border-2 border-medium rounded focus:ring-primary-300"
            />
            <span className="ml-3 text-text-primary">{category}</span>
          </label>
        ))}
      </div>
      {(errors.categories || backendErrors.categories) && (
        <p className="text-error-500 text-sm mt-2">
          {backendErrors.categories || errors.categories}
        </p>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-text-secondary font-medium mb-2">Minimum Order Quantity</label>
        <input
          type="number"
          name="moq"
          value={formData.moq}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
          placeholder="Enter MOQ"
        />
      </div>
      
      <div>
        <label className="block text-text-secondary font-medium mb-2">Price Range *</label>
        <select
          name="price_range"
          value={formData.price_range}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.price_range) {
              setBackendErrors(prev => ({ ...prev, price_range: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.price_range || backendErrors.price_range ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
        >
          <option value="">Select price range</option>
          <option value="budget">Budget (Under ₹500)</option>
          <option value="mid">Mid-range (₹500 - ₹2000)</option>
          <option value="premium">Premium (₹2000 - ₹5000)</option>
          <option value="luxury">Luxury (₹5000+)</option>
        </select>
        {(errors.price_range || backendErrors.price_range) && (
          <p className="text-error-500 text-sm mt-1">
            {backendErrors.price_range || errors.price_range}
          </p>
        )}
      </div>
    </div>
  </div>
);

const renderBankInfo = () => (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-primary-600 mb-6">Bank Details</h3>
    
    <div>
      <label className="block text-text-secondary font-medium mb-2">Account Holder Name *</label>
      <input
        type="text"
        name="account_holder"
        value={formData.account_holder}
        onChange={(e) => {
          handleInputChange(e);
          if (backendErrors.account_holder) {
            setBackendErrors(prev => ({ ...prev, account_holder: null }));
          }
        }}
        className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
          errors.account_holder || backendErrors.account_holder ? 'border-error-500' : 'border-medium focus:border-focus'
        }`}
        placeholder="Enter account holder name"
      />
      {(errors.account_holder || backendErrors.account_holder) && (
        <p className="text-error-500 text-sm mt-1">
          {backendErrors.account_holder || errors.account_holder}
        </p>
      )}
    </div>

    <div>
      <label className="block text-text-secondary font-medium mb-2">Bank Name *</label>
      <input
        type="text"
        name="bank_name"
        value={formData.bank_name}
        onChange={(e) => {
          handleInputChange(e);
          if (backendErrors.bank_name) {
            setBackendErrors(prev => ({ ...prev, bank_name: null }));
          }
        }}
        className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
          errors.bank_name || backendErrors.bank_name ? 'border-error-500' : 'border-medium focus:border-focus'
        }`}
        placeholder="Enter bank name"
      />
      {(errors.bank_name || backendErrors.bank_name) && (
        <p className="text-error-500 text-sm mt-1">
          {backendErrors.bank_name || errors.bank_name}
        </p>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-text-secondary font-medium mb-2">Account Number *</label>
        <input
          type="text"
          name="account_number"
          value={formData.account_number}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.account_number) {
              setBackendErrors(prev => ({ ...prev, account_number: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.account_number || backendErrors.account_number ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter account number"
        />
        {(errors.account_number || backendErrors.account_number) && (
          <p className="text-error-500 text-sm mt-1">
            {backendErrors.account_number || errors.account_number}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-text-secondary font-medium mb-2">IFSC Code *</label>
        <input
          type="text"
          name="ifsc_code"
          value={formData.ifsc_code}
          onChange={(e) => {
            handleInputChange(e);
            if (backendErrors.ifsc_code) {
              setBackendErrors(prev => ({ ...prev, ifsc_code: null }));
            }
          }}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.ifsc_code || backendErrors.ifsc_code ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter IFSC code"
        />
        {(errors.ifsc_code || backendErrors.ifsc_code) && (
          <p className="text-error-500 text-sm mt-1">
            {backendErrors.ifsc_code || errors.ifsc_code}
          </p>
        )}
      </div>
    </div>

    <div>
      <label className="block text-text-secondary font-medium mb-2">UPI ID (Optional)</label>
      <input
        type="text"
        name="upi_id"
        value={formData.upi_id}
        onChange={handleInputChange}
        className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
        placeholder="Enter UPI ID"
      />
    </div>

    {/* Document Upload */}
    <div className="border-2 border-dashed border-medium rounded-radius-xl p-6 text-center hover:border-primary-400 transition-all cursor-pointer">
      <Upload className="mx-auto text-text-tertiary mb-2" size={32} />
      <p className="text-text-secondary font-medium">Upload Cancelled Cheque</p>
      <p className="text-xs text-text-tertiary mt-1">PDF or Image (Max 2MB)</p>
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2">Vendor Registration</h2>
          <p className="text-secondary text-lg">Join as a wholesale partner and grow your business</p>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-secondary">Submitting registration...</p>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
  <div className="flex items-center justify-between relative">
    {steps.map((step, index) => {
      const hasError = errorStep === step.number;
      return (
        <div key={step.number} className="flex-1 text-center relative z-10">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              currentStep > step.number 
                ? 'bg-accent-500 border-accent-500 text-inverse' 
                : currentStep === step.number
                ? 'border-primary-500 bg-primary-500 text-inverse'
                : hasError
                ? 'border-error-500 bg-error-50 text-error-500'
                : 'border-medium bg-surface-1 text-secondary'
            }`}>
              {currentStep > step.number ? (
                <Check size={20} />
              ) : hasError && currentStep !== step.number ? (
                <AlertCircle size={20} />
              ) : (
                <step.icon size={20} />
              )}
            </div>
            <span className={`text-xs sm:text-sm mt-2 hidden sm:block ${
              currentStep >= step.number ? 'text-primary-600 font-medium' : 
              hasError ? 'text-error-500 font-medium' : 'text-tertiary'
            }`}>
              {step.name}
              {hasError && currentStep !== step.number && ' ⚠️'}
            </span>
          </div>
        </div>
      );
    })}
    {/* Progress Line */}
    <div className="absolute top-5 left-0 right-0 h-0.5 bg-medium -z-10">
      <div 
        className="h-full bg-accent-500 transition-all duration-300"
        style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
      />
    </div>
  </div>
</div>

        {/* Form Container */}
        <div className="bg-card rounded-radius-2xl border-2 border-medium shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderPersonalInfo()}
            {currentStep === 2 && renderBusinessInfo()}
            {currentStep === 3 && renderAddressInfo()}
            {currentStep === 4 && renderProductInfo()}
            {currentStep === 5 && renderBankInfo()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-light">
              <button
                type="button"
                onClick={handlePrevious}
                className={`flex items-center gap-2 px-6 py-3 rounded-radius-lg border-2 border-medium text-text-secondary hover:bg-primary-100 transition-fast ${
                  currentStep === 1 ? 'invisible' : ''
                }`}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              {currentStep === 5 ? (
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-accent-500 text-text-inverse rounded-radius-lg font-medium hover:bg-accent-600 transition-fast disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  {!isLoading && !isSubmitting && <Check size={20} />}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-primary-500 text-text-inverse rounded-radius-lg font-medium hover:bg-primary-600 transition-fast"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


// Main component with ClientOnly wrapper
export default function RegistrationForm() {
  return (
    <ClientOnly>
      <RegistrationFormContent />
    </ClientOnly>
  );
}