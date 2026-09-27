"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegisterRetailerMutation } from '@/redux/retailer/slices/retailerSlice';
import {
  Store,
  Building,
  Mail,
  Phone,
  User,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Package,
  FileText,
  Truck,
  RefreshCw,
  Sparkles,
  Award,
  Clock,
  HelpCircle,
  UserPlus
} from '@/utils/icons';
import RetailerLoginModal from '@/features/common/RetailerLoginModal';
import { toast } from 'react-toastify';

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Chandigarh",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry"
];

export default function RetailerRegistration() {
  const router = useRouter();
  const [registerRetailer, { isLoading }] = useRegisterRetailerMutation();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    business_name: '',
    gst_number: '',
    username: '',
    email: '',
    mobile: '',
    shipping_address: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Password strength calculator
  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const getStrengthLabel = (score) => {
    switch (score) {
      case 1:
        return { label: 'Weak', color: 'bg-red-500', text: 'text-red-600' };
      case 2:
        return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
      case 3:
        return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-600' };
      case 4:
        return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
      default:
        return { label: 'Too short', color: 'bg-secondary-200', text: 'text-secondary-400' };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'gst_number') {
      processedValue = value.toUpperCase();
    } else if (name === 'mobile') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'pincode') {
      processedValue = value.replace(/\D/g, '').slice(0, 6);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));

    // Clear live errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (backendErrors[name]) {
      setBackendErrors(prev => ({ ...prev, [name]: null }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'business_name':
        if (!formData.business_name.trim()) {
          newErrors.business_name = 'Business or store name is required.';
        } else if (formData.business_name.trim().length < 2) {
          newErrors.business_name = 'Business name must be at least 2 characters.';
        } else {
          delete newErrors.business_name;
        }
        break;

      case 'gst_number':
        if (formData.gst_number.trim()) {
          const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
          if (!gstRegex.test(formData.gst_number.trim())) {
            newErrors.gst_number = 'Please enter a valid 15-character GSTIN (e.g. 22AAAAA0000A1Z5).';
          } else {
            delete newErrors.gst_number;
          }
        } else {
          delete newErrors.gst_number;
        }
        break;

      case 'username':
        if (!formData.username.trim()) {
          newErrors.username = 'Username is required.';
        } else if (formData.username.trim().length < 3) {
          newErrors.username = 'Username must be at least 3 characters long.';
        } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username.trim())) {
          newErrors.username = 'Only letters, numbers, dots, and underscores allowed.';
        } else {
          delete newErrors.username;
        }
        break;

      case 'email':
        if (!formData.email.trim()) {
          newErrors.email = 'Business email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          newErrors.email = 'Please enter a valid email address.';
        } else {
          delete newErrors.email;
        }
        break;

      case 'mobile':
        if (!formData.mobile.trim()) {
          newErrors.mobile = 'Mobile number is required.';
        } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
          newErrors.mobile = 'Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.';
        } else {
          delete newErrors.mobile;
        }
        break;

      case 'shipping_address':
        if (!formData.shipping_address.trim()) {
          newErrors.shipping_address = 'Store delivery address is required.';
        } else if (formData.shipping_address.trim().length < 5) {
          newErrors.shipping_address = 'Please provide a complete address with street/locality.';
        } else {
          delete newErrors.shipping_address;
        }
        break;

      case 'city':
        if (!formData.city.trim()) {
          newErrors.city = 'City is required.';
        } else {
          delete newErrors.city;
        }
        break;

      case 'state':
        if (!formData.state.trim()) {
          newErrors.state = 'Please select a state.';
        } else {
          delete newErrors.state;
        }
        break;

      case 'pincode':
        if (!formData.pincode.trim()) {
          newErrors.pincode = 'Pincode is required.';
        } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
          newErrors.pincode = 'Pincode must be exactly 6 digits.';
        } else {
          delete newErrors.pincode;
        }
        break;

      case 'password':
        if (!formData.password) {
          newErrors.password = 'Password is required.';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long.';
        } else if (!/[A-Za-z]/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one letter.';
        } else if (!/\d/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one number.';
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirm_password':
        if (!formData.confirm_password) {
          newErrors.confirm_password = 'Please confirm your password.';
        } else if (formData.password !== formData.confirm_password) {
          newErrors.confirm_password = 'Passwords do not match.';
        } else {
          delete newErrors.confirm_password;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateAllFields = () => {
    const newErrors = {};

    if (!formData.business_name.trim()) {
      newErrors.business_name = 'Business or store name is required.';
    }

    if (formData.gst_number.trim()) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(formData.gst_number.trim())) {
        newErrors.gst_number = 'Please enter a valid 15-character GSTIN.';
      }
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Business email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.';
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Store delivery address is required.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required.';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required.';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Pincode must be exactly 6 digits.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      newErrors.password = 'Password must include both letters and numbers.';
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password.';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setBackendErrors({});

    if (!validateAllFields()) {
      toast.error('Please fix all highlighted errors before submitting.');
      return;
    }

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password,
        business_name: formData.business_name.trim(),
        gst_number: formData.gst_number.trim() ? formData.gst_number.trim().toUpperCase() : null,
        shipping_address: formData.shipping_address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim()
      };

      const response = await registerRetailer(payload).unwrap();

      // Store tokens and retailer profile
      if (response.access) {
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
        localStorage.setItem('user_role', 'retailer');
        localStorage.setItem('user_name', formData.business_name.trim());
        localStorage.setItem('user_id', response.user_id || response.data?.id);
        localStorage.setItem('is_retailer_registered', 'true');

        // Clear guest session
        localStorage.removeItem('guest_session_id');
      }

      toast.success('Registration successful! Welcome to the Velqino Retail Network.');

      setTimeout(() => {
        router.push('/retailer/retailerdashboard');
      }, 700);

    } catch (err) {
      console.error('Retailer registration error:', err);
      const serverErrors = err?.errors || err?.data?.errors || err?.response?.data?.errors;
      const serverMsg = err?.message || err?.data?.message || err?.response?.data?.message || 'Registration failed. Please check your inputs.';

      if (serverErrors && typeof serverErrors === 'object') {
        const fieldErrors = {};
        Object.entries(serverErrors).forEach(([field, messages]) => {
          fieldErrors[field] = Array.isArray(messages) ? messages[0] : String(messages);
        });
        setBackendErrors(fieldErrors);
        setGeneralError(serverMsg);
      } else {
        setGeneralError(serverMsg);
      }

      toast.error(serverMsg);
    }
  };

  const strengthInfo = getStrengthLabel(passwordStrength);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 via-surface-0 to-surface-1 py-6 sm:py-10 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Top Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-secondary-600 hover:text-primary-700 transition-colors"
          >
            <span>← Back to Store</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary-500">
            <span>Retail Partner Network</span>
            <span>•</span>
            <span className="text-primary-700 font-bold">Store Onboarding</span>
          </div>
        </div>

        {/* 60/40 Split Grid on Laptop/Large Screens; Natural Stack on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column (60-65%): Compact Left Header + Registration Form */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            
            {/* Header (Left-aligned, sleek, visible above the fold on laptop) */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/80 border border-primary-200 text-primary-800 text-xs font-bold tracking-wide uppercase shadow-2xs">
                <Store size={14} className="text-primary-600" />
                <span>Retailer Registration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-secondary-900 tracking-tight">
                Register as a Verified Retailer
              </h1>
              <p className="text-xs sm:text-sm text-secondary-600 leading-relaxed max-w-2xl">
                Source high-demand products directly from verified manufacturers and wholesalers with bulk tier pricing, flexible credit, and doorstep fulfillment.
              </p>
            </div>

            {/* General Error Banner */}
            {generalError && (
              <div className="p-4 bg-red-50/90 border border-red-200/80 rounded-2xl flex items-start gap-3 shadow-xs animate-fadeIn">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800 font-medium leading-relaxed">
                  {generalError}
                </div>
              </div>
            )}

            {/* Form Container */}
            <div className="bg-white rounded-3xl shadow-xl border border-secondary-200/80 p-5 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-7">
                
                {/* Section 1: Business Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-secondary-100">
                    <div className="w-10 h-10 rounded-xl bg-primary-100/70 border border-primary-200 flex items-center justify-center text-primary-700">
                      <Building size={20} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-secondary-900">1. Store & Business Profile</h2>
                      <p className="text-xs text-secondary-500">Tell us about your retail shop or commercial enterprise</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
                    {/* Business Name */}
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-2">
                        Store / Business Name *
                      </label>
                      <div className="relative group">
                        <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                          type="text"
                          name="business_name"
                          value={formData.business_name}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('business_name')}
                          placeholder="e.g. Royal Fashion Mart"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm font-medium transition-all bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 ${
                            (touched.business_name && errors.business_name) || backendErrors.business_name
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70'
                          }`}
                        />
                      </div>
                      {((touched.business_name && errors.business_name) || backendErrors.business_name) && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                          <AlertCircle size={13} />
                          <span>{backendErrors.business_name || errors.business_name}</span>
                        </p>
                      )}
                    </div>

                    {/* GST Number */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider">
                          GSTIN Number
                        </label>
                        <span className="text-[11px] text-secondary-400 font-semibold">(Optional)</span>
                      </div>
                      <div className="relative group">
                        <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                          type="text"
                          name="gst_number"
                          value={formData.gst_number}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('gst_number')}
                          maxLength={15}
                          placeholder="22AAAAA0000A1Z5"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm font-medium transition-all bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 font-mono ${
                            (touched.gst_number && errors.gst_number) || backendErrors.gst_number
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70'
                          }`}
                        />
                      </div>
                      {((touched.gst_number && errors.gst_number) || backendErrors.gst_number) && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                          <AlertCircle size={13} />
                          <span>{backendErrors.gst_number || errors.gst_number}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Account & Contact Credentials */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-secondary-100">
                    <div className="w-10 h-10 rounded-xl bg-primary-100/70 border border-primary-200 flex items-center justify-center text-primary-700">
                      <User size={20} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-secondary-900">2. Owner & Contact Credentials</h2>
                      <p className="text-xs text-secondary-500">Your primary login username and contact channels</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pt-1">
                    {/* Username */}
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-2">
                        Account Username *
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('username')}
                          placeholder="royalfashion"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm font-medium transition-all bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 ${
                            (touched.username && errors.username) || backendErrors.username
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70'
                          }`}
                        />
                      </div>
                      {((touched.username && errors.username) || backendErrors.username) && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                          <AlertCircle size={13} />
                          <span>{backendErrors.username || errors.username}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('email')}
                          placeholder="store@domain.com"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm font-medium transition-all bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 ${
                            (touched.email && errors.email) || backendErrors.email
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70'
                          }`}
                        />
                      </div>
                      {((touched.email && errors.email) || backendErrors.email) && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                          <AlertCircle size={13} />
                          <span>{backendErrors.email || errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-2">
                        Mobile Number *
                      </label>
                      <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500 font-bold text-xs bg-secondary-100 px-1.5 py-0.5 rounded">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('mobile')}
                          maxLength={10}
                          placeholder="9876543210"
                          className={`w-full pl-13 pr-4 py-3 border rounded-xl text-sm font-medium transition-all bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 ${
                            (touched.mobile && errors.mobile) || backendErrors.mobile
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70'
                          }`}
                        />
                      </div>
                      {((touched.mobile && errors.mobile) || backendErrors.mobile) && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                          <AlertCircle size={13} />
                          <span>{backendErrors.mobile || errors.mobile}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Shipping & Delivery Logistics */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-secondary-100">
                    <div className="w-10 h-10 rounded-xl bg-primary-100/70 border border-primary-200 flex items-center justify-center text-primary-700">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-secondary-900">3. Shipping & Delivery Address</h2>
                      <p className="text-xs text-secondary-500">Destination where bulk wholesale shipments will be delivered</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    {/* Full Address */}
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-2">
                        Shop / Store Address *
                      </label>
                      <div className="relative group">
                        <MapPin className="absolute left-3.5 top-3.5 text-secondary-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <textarea
                          name="shipping_address"
                          value={formData.shipping_address}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('shipping_address')}
                          rows="2"
                          placeholder="Shop No, Building Name, Street / Market Area, Landmark"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm font-medium transition-all bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 resize-none ${
                            (touched.shipping_address && errors.shipping_address) || backendErrors.shipping_address
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70'
                          }`}
                        />
                      </div>
                      {((touched.shipping_address && errors.shipping_address) || backendErrors.shipping_address) && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                          <AlertCircle size={13} />
                          <span>{backendErrors.shipping_address || errors.shipping_address}</span>
                        </p>
                      )}
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                      {/* City */}
                      <div>
                        <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-2">
                          City / District *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('city')}
                          placeholder="e.g. Mumbai"
                          className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 ${
                            (touched.city && errors.city) || backendErrors.city
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70'
                          }`}
                        />
                        {((touched.city && errors.city) || backendErrors.city) && (
                          <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle size={13} />
                            <span>{backendErrors.city || errors.city}</span>
                          </p>
                        )}
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-2">
                          State / UT *
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('state')}
                          className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 ${
                            (touched.state && errors.state) || backendErrors.state
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70'
                          }`}
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        {((touched.state && errors.state) || backendErrors.state) && (
                          <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle size={13} />
                            <span>{backendErrors.state || errors.state}</span>
                          </p>
                        )}
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-2">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('pincode')}
                          maxLength={6}
                          placeholder="6-digit PIN"
                          className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 ${
                            (touched.pincode && errors.pincode) || backendErrors.pincode
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70'
                          }`}
                        />
                        {((touched.pincode && errors.pincode) || backendErrors.pincode) && (
                          <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle size={13} />
                            <span>{backendErrors.pincode || errors.pincode}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Security & Password */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-secondary-100">
                    <div className="w-10 h-10 rounded-xl bg-primary-100/70 border border-primary-200 flex items-center justify-center text-primary-700">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-secondary-900">4. Security & Access Password</h2>
                      <p className="text-xs text-secondary-500">Create a secure password with at least 8 characters</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
                    {/* Password */}
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-2">
                        Account Password *
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('password')}
                          placeholder="Minimum 8 characters"
                          className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm font-medium transition-all bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 ${
                            (touched.password && errors.password) || backendErrors.password
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 p-1"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2 space-y-1.5 animate-fadeIn">
                          <div className="flex items-center justify-between text-[11px] font-semibold">
                            <span className="text-secondary-500">Password strength:</span>
                            <span className={strengthInfo.text}>{strengthInfo.label}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 h-1.5">
                            <div className={`rounded-full transition-all duration-300 ${passwordStrength >= 1 ? strengthInfo.color : 'bg-secondary-200'}`} />
                            <div className={`rounded-full transition-all duration-300 ${passwordStrength >= 2 ? strengthInfo.color : 'bg-secondary-200'}`} />
                            <div className={`rounded-full transition-all duration-300 ${passwordStrength >= 3 ? strengthInfo.color : 'bg-secondary-200'}`} />
                            <div className={`rounded-full transition-all duration-300 ${passwordStrength >= 4 ? strengthInfo.color : 'bg-secondary-200'}`} />
                          </div>
                        </div>
                      )}

                      {((touched.password && errors.password) || backendErrors.password) && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                          <AlertCircle size={13} />
                          <span>{backendErrors.password || errors.password}</span>
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('confirm_password')}
                          placeholder="Repeat password"
                          className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm font-medium transition-all bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 ${
                            (touched.confirm_password && errors.confirm_password) || backendErrors.confirm_password
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 p-1"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      {/* Password Match Status */}
                      {formData.confirm_password && (
                        <div className="mt-1.5">
                          {formData.password === formData.confirm_password ? (
                            <p className="text-emerald-600 text-xs flex items-center gap-1 font-semibold animate-fadeIn">
                              <CheckCircle size={13} />
                              <span>Passwords match perfectly</span>
                            </p>
                          ) : (
                            <p className="text-red-500 text-xs flex items-center gap-1 font-medium animate-fadeIn">
                              <AlertCircle size={13} />
                              <span>Passwords do not match yet</span>
                            </p>
                          )}
                        </div>
                      )}

                      {((touched.confirm_password && errors.confirm_password) || backendErrors.confirm_password) && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                          <AlertCircle size={13} />
                          <span>{backendErrors.confirm_password || errors.confirm_password}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-extrabold text-base rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-xl shadow-primary-600/25 disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={20} className="animate-spin text-white" />
                        <span>Creating Retailer Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Retailer Registration</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Mobile-only Login Trigger */}
              <div className="lg:hidden mt-6 pt-6 border-t border-secondary-200 text-center">
                <p className="text-sm text-secondary-600">
                  Already have an active retailer account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-primary-600 hover:text-primary-700 font-bold hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>

            {/* Mobile-only B2B Benefits Accordion / Section */}
            <div className="lg:hidden p-5 bg-primary-50/70 border border-primary-200/80 rounded-2xl">
              <div className="flex items-center gap-2 text-primary-800 font-bold text-sm mb-3">
                <Sparkles size={17} className="text-primary-600" />
                <span>Velqino Retail Partner Benefits:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-secondary-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
                  <span>Tiered Wholesale Volume Discounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
                  <span>Verified Direct-from-Factory Catalog</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
                  <span>Automated GST Compliant Invoices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
                  <span>Express Pan-India Logistics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (35-40%): Sticky Information Sidebar on Large Screens */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-5 lg:sticky lg:top-20 space-y-6">
            
            {/* Sidebar Card 1: Value Proposition Banner */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Store size={24} className="text-white" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary-200">
                    Velqino Retail Network
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    Direct Sourcing Advantage
                  </h3>
                  <p className="text-xs text-primary-100/90 mt-1 leading-relaxed">
                    Join over 10,000+ local store owners sourcing directly from verified suppliers across India with factory-direct pricing.
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/15">
                  <div className="flex items-start gap-2.5 text-xs text-white/95">
                    <CheckCircle size={16} className="text-primary-200 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-semibold">Tiered Wholesale Rates</strong>
                      <span className="text-primary-100/80">Save 25–40% vs traditional distributor channels.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-white/95">
                    <CheckCircle size={16} className="text-primary-200 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-semibold">Automated GST Invoicing</strong>
                      <span className="text-primary-100/80">Instantly claim Input Tax Credit on every shipment.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-white/95">
                    <CheckCircle size={16} className="text-primary-200 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-semibold">Pan-India Doorstep Dispatch</strong>
                      <span className="text-primary-100/80">Insured express logistics covering 28,000+ PIN codes.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Card 2: Already Registered? Quick Sign-In */}
            <div className="bg-white rounded-3xl p-6 border border-secondary-200/80 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-secondary-900">Already Registered?</h4>
                  <p className="text-xs text-secondary-500">Access your store dashboard</p>
                </div>
              </div>
              <p className="text-xs text-secondary-600 mb-4 leading-relaxed">
                If you already have a retailer account, sign in to view wholesale catalog pricing, manage store orders, and track active dispatches.
              </p>
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl border-2 border-primary-200 hover:border-primary-400 bg-primary-50/60 hover:bg-primary-50 text-primary-700 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>Sign in to Retailer Hub</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Sidebar Card 3: Trust & Protection Guarantee */}
            <div className="bg-secondary-50/70 rounded-3xl p-5 border border-secondary-200/80 space-y-3">
              <div className="flex items-center gap-2.5 text-secondary-900 font-bold text-xs">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span>Enterprise Trust & Verification</span>
              </div>
              <p className="text-[11px] text-secondary-600 leading-relaxed">
                Every wholesaler on Velqino is strictly vetted for GST compliance, quality standards, and dispatch speed. Your transactions and business data are secured with 256-bit SSL encryption.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-secondary-200/60 text-[11px] font-semibold text-secondary-500">
                <span>✓ Zero Upfront Joining Fee</span>
                <span>✓ 100% Verified Stock</span>
              </div>
            </div>

            {/* Sidebar Card 4: Need Assistance */}
            <div className="p-4 rounded-2xl bg-white border border-secondary-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary-100 flex items-center justify-center text-secondary-700 flex-shrink-0">
                <HelpCircle size={18} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-secondary-900 block">Need Help Registering?</span>
                <span className="text-secondary-500">Our B2B onboarding team is available Mon-Sat, 9AM-7PM.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Retailer Login Modal */}
      <RetailerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
