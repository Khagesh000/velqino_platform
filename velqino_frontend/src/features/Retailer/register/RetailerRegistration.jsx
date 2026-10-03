"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegisterRetailerMutation } from '@/redux/retailer/slices/retailerSlice';
import {
  Store,
  Building,
  Mail,
  User,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  RefreshCw,
  UserPlus
} from '@/utils/icons';
import RetailerLoginModal from '@/features/common/RetailerLoginModal';
import { setAuthTokens } from '@/utils/cookieUtils';
import { toast } from 'react-toastify';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Chandigarh", "Jammu and Kashmir", "Ladakh", "Puducherry"
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

  // Password strength calculation
  const getPasswordScore = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordScore = getPasswordScore(formData.password);
  const strengthLabels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-secondary-200', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
  const strengthText = ['text-secondary-400', 'text-red-600', 'text-amber-600', 'text-blue-600', 'text-emerald-600'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'gst_number') val = value.toUpperCase();
    if (name === 'mobile') val = value.replace(/\D/g, '').slice(0, 10);
    if (name === 'pincode') val = value.replace(/\D/g, '').slice(0, 6);

    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (backendErrors[name]) setBackendErrors(prev => ({ ...prev, [name]: null }));
    if (generalError) setGeneralError('');
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    const newErrors = { ...errors };

    if (field === 'business_name') {
      if (!formData.business_name.trim()) newErrors.business_name = 'Business name is required.';
      else if (formData.business_name.trim().length < 2) newErrors.business_name = 'Must be at least 2 characters.';
      else delete newErrors.business_name;
    }
    if (field === 'gst_number' && formData.gst_number.trim()) {
      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_number.trim())) {
        newErrors.gst_number = 'Enter valid 15-character GSTIN (e.g. 22AAAAA0000A1Z5).';
      } else delete newErrors.gst_number;
    }
    if (field === 'username') {
      if (!formData.username.trim()) newErrors.username = 'Username is required.';
      else if (formData.username.trim().length < 3) newErrors.username = 'Must be at least 3 characters.';
      else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username.trim())) newErrors.username = 'Only letters, numbers, dots, and underscores.';
      else delete newErrors.username;
    }
    if (field === 'email') {
      if (!formData.email.trim()) newErrors.email = 'Email address is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Enter a valid email address.';
      else delete newErrors.email;
    }
    if (field === 'mobile') {
      if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required.';
      else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) newErrors.mobile = 'Enter valid 10-digit number starting with 6-9.';
      else delete newErrors.mobile;
    }
    if (field === 'shipping_address') {
      if (!formData.shipping_address.trim()) newErrors.shipping_address = 'Store delivery address is required.';
      else delete newErrors.shipping_address;
    }
    if (field === 'city') {
      if (!formData.city.trim()) newErrors.city = 'City is required.';
      else delete newErrors.city;
    }
    if (field === 'state') {
      if (!formData.state.trim()) newErrors.state = 'Please select a state.';
      else delete newErrors.state;
    }
    if (field === 'pincode') {
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required.';
      else if (!/^\d{6}$/.test(formData.pincode.trim())) newErrors.pincode = 'Must be exactly 6 digits.';
      else delete newErrors.pincode;
    }
    if (field === 'password') {
      if (!formData.password) newErrors.password = 'Password is required.';
      else if (formData.password.length < 8) newErrors.password = 'Must be at least 8 characters long.';
      else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) newErrors.password = 'Must contain letters and numbers.';
      else delete newErrors.password;
    }
    if (field === 'confirm_password') {
      if (!formData.confirm_password) newErrors.confirm_password = 'Confirm password is required.';
      else if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match.';
      else delete newErrors.confirm_password;
    }

    setErrors(newErrors);
  };

  const validateAll = () => {
    ['business_name', 'gst_number', 'username', 'email', 'mobile', 'shipping_address', 'city', 'state', 'pincode', 'password', 'confirm_password'].forEach(f => validateField(f));
    const newErrors = {};
    if (!formData.business_name.trim()) newErrors.business_name = 'Business name is required.';
    if (!formData.username.trim() || formData.username.trim().length < 3) newErrors.username = 'Valid username is required.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Valid email is required.';
    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile.trim())) newErrors.mobile = 'Valid 10-digit mobile is required.';
    if (!formData.shipping_address.trim()) newErrors.shipping_address = 'Address is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.state.trim()) newErrors.state = 'State is required.';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) newErrors.pincode = 'Valid 6-digit PIN is required.';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be 8+ chars.';
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords must match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setBackendErrors({});

    if (!validateAll()) {
      toast.error('Please fix the highlighted errors before submitting.');
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

      if (response.access) {
        setAuthTokens({ access: response.access, refresh: response.refresh });
        localStorage.setItem('user_role', 'retailer');
        localStorage.setItem('user_name', formData.business_name.trim());
        localStorage.setItem('user_id', response.user_id || response.data?.id);
        localStorage.setItem('is_retailer_registered', 'true');
        localStorage.removeItem('guest_session_id');
      }

      toast.success('Registration successful! Welcome to the Velqino Retail Network.');
      setTimeout(() => router.push('/retailer/retailerdashboard'), 700);
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
      }
      setGeneralError(serverMsg);
      toast.error(serverMsg);
    }
  };

  const getFieldErr = (f) => (touched[f] && errors[f]) || backendErrors[f];

  const inputCls = (f) =>
    `w-full py-2.5 px-3.5 border rounded-xl text-sm font-medium transition-all bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 ${
      getFieldErr(f)
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 via-surface-0 to-surface-1 py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-secondary-600 hover:text-primary-700">
            ← Back to Store
          </Link>
          <div className="text-xs font-semibold text-secondary-500">
            Retail Partner Network • <span className="text-primary-700 font-bold">Store Onboarding</span>
          </div>
        </div>

        {/* Unified Responsive Grid: Form on Left (~60%), Info Sidebar on Right (~40% on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-5">
            {/* Header */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100/80 text-primary-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Store size={14} className="text-primary-600" /> Retailer Registration
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight">
                Register as a Verified Retailer
              </h1>
              <p className="text-xs sm:text-sm text-secondary-600 mt-1">
                Source products directly from verified manufacturers with bulk tier pricing and doorstep fulfillment.
              </p>
            </div>

            {/* General Error Banner */}
            {generalError && (
              <div className="p-3.5 bg-red-50/90 border border-red-200/80 rounded-2xl flex items-start gap-2.5 text-xs sm:text-sm text-red-800 font-medium">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-secondary-200/80 p-5 sm:p-7">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Store Profile */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-secondary-100">
                    <Building size={18} className="text-primary-600" />
                    <h2 className="text-sm sm:text-base font-bold text-secondary-900">1. Store & Business Profile</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5">Store / Business Name *</label>
                      <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('business_name')}
                        placeholder="e.g. Royal Fashion Mart"
                        className={inputCls('business_name')}
                      />
                      {getFieldErr('business_name') && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{getFieldErr('business_name')}</p>}
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider">GSTIN Number</label>
                        <span className="text-[11px] text-secondary-400 font-medium">(Optional)</span>
                      </div>
                      <input
                        type="text"
                        name="gst_number"
                        value={formData.gst_number}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('gst_number')}
                        maxLength={15}
                        placeholder="22AAAAA0000A1Z5"
                        className={`${inputCls('gst_number')} font-mono`}
                      />
                      {getFieldErr('gst_number') && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{getFieldErr('gst_number')}</p>}
                    </div>
                  </div>
                </div>

                {/* 2. Owner & Contact Credentials */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-secondary-100">
                    <User size={18} className="text-primary-600" />
                    <h2 className="text-sm sm:text-base font-bold text-secondary-900">2. Owner & Contact Credentials</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5">Username *</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('username')}
                        placeholder="royalfashion"
                        className={inputCls('username')}
                      />
                      {getFieldErr('username') && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{getFieldErr('username')}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('email')}
                        placeholder="store@domain.com"
                        className={inputCls('email')}
                      />
                      {getFieldErr('email') && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{getFieldErr('email')}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5">Mobile Number *</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary-500 font-bold text-xs bg-secondary-100 px-1.5 py-0.5 rounded">+91</span>
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('mobile')}
                          maxLength={10}
                          placeholder="9876543210"
                          className={`${inputCls('mobile')} pl-12`}
                        />
                      </div>
                      {getFieldErr('mobile') && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{getFieldErr('mobile')}</p>}
                    </div>
                  </div>
                </div>

                {/* 3. Shipping & Delivery Address */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-secondary-100">
                    <MapPin size={18} className="text-primary-600" />
                    <h2 className="text-sm sm:text-base font-bold text-secondary-900">3. Shipping & Delivery Address</h2>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5">Shop Address *</label>
                    <textarea
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('shipping_address')}
                      rows="2"
                      placeholder="Shop No, Building Name, Street / Market Area, Landmark"
                      className={`${inputCls('shipping_address')} resize-none`}
                    />
                    {getFieldErr('shipping_address') && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{getFieldErr('shipping_address')}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5">City / District *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('city')}
                        placeholder="e.g. Mumbai"
                        className={inputCls('city')}
                      />
                      {getFieldErr('city') && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{getFieldErr('city')}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5">State / UT *</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('state')}
                        className={inputCls('state')}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {getFieldErr('state') && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{getFieldErr('state')}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5">PIN Code *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('pincode')}
                        maxLength={6}
                        placeholder="6-digit PIN"
                        className={inputCls('pincode')}
                      />
                      {getFieldErr('pincode') && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{getFieldErr('pincode')}</p>}
                    </div>
                  </div>
                </div>

                {/* 4. Security Password */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-secondary-100">
                    <Lock size={18} className="text-primary-600" />
                    <h2 className="text-sm sm:text-base font-bold text-secondary-900">4. Security Password</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5">Password *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('password')}
                          placeholder="Min 8 characters"
                          className={`${inputCls('password')} pr-10`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold">
                          <span className="text-secondary-500">Strength: <strong className={strengthText[passwordScore]}>{strengthLabels[passwordScore]}</strong></span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map(step => (
                              <span key={step} className={`w-4 h-1.5 rounded-full ${passwordScore >= step ? strengthColors[passwordScore] : 'bg-secondary-200'}`} />
                            ))}
                          </div>
                        </div>
                      )}
                      {getFieldErr('password') && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{getFieldErr('password')}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5">Confirm Password *</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('confirm_password')}
                          placeholder="Repeat password"
                          className={`${inputCls('confirm_password')} pr-10`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {formData.confirm_password && formData.password === formData.confirm_password && (
                        <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1 font-semibold"><CheckCircle size={12} />Passwords match</p>
                      )}
                      {getFieldErr('confirm_password') && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{getFieldErr('confirm_password')}</p>}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 disabled:opacity-60"
                >
                  {isLoading ? <><RefreshCw size={18} className="animate-spin" /><span>Creating Retailer Account...</span></> : <><span>Complete Retailer Registration</span><ArrowRight size={18} /></>}
                </button>

                {/* Sign-in prompt directly below submit */}
                <div className="pt-2 text-center border-t border-secondary-100">
                  <p className="text-xs sm:text-sm text-secondary-600">
                    Already have a retailer account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsLoginModalOpen(true)}
                      className="text-primary-600 hover:text-primary-700 font-bold hover:underline"
                    >
                      Sign in to Retailer Hub
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Informational Sidebar (Cleanly hidden on mobile: hidden lg:block) */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-5 lg:sticky lg:top-20 space-y-5">
            {/* Value Proposition Banner */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Store size={22} className="text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-200">Velqino Retail Network</span>
                <h3 className="text-lg font-extrabold text-white mt-0.5">Direct Wholesale Sourcing</h3>
                <p className="text-xs text-primary-100/90 mt-1 leading-relaxed">
                  Join 10,000+ local store owners sourcing directly from verified suppliers across India with factory-direct rates.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/15 text-xs text-white/95">
                <div className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-primary-200 flex-shrink-0 mt-0.5" />
                  <span><strong>Tiered Wholesale Rates:</strong> Save 25–40% vs distributor channels.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-primary-200 flex-shrink-0 mt-0.5" />
                  <span><strong>Automated GST Invoicing:</strong> Instant Input Tax Credit on every order.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-primary-200 flex-shrink-0 mt-0.5" />
                  <span><strong>Pan-India Logistics:</strong> Express insured shipping to 28,000+ PINs.</span>
                </div>
              </div>
            </div>

            {/* Trust & Security Card */}
            <div className="bg-secondary-50/70 rounded-3xl p-5 border border-secondary-200/80 space-y-2 text-xs text-secondary-600 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-secondary-900">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Enterprise Trust & Security</span>
              </div>
              <p>Every wholesaler on Velqino is strictly vetted for GST compliance and product quality. Your data is protected by 256-bit SSL encryption.</p>
              <div className="flex justify-between pt-1 border-t border-secondary-200/60 font-semibold text-[11px] text-secondary-500">
                <span>✓ Zero Upfront Fees</span>
                <span>✓ 100% Verified Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RetailerLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
