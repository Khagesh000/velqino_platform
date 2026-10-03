"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegisterCustomerMutation, useMergeCartMutation } from '../../redux/customer/slices/customerSlice';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Package,
  Award,
  Clock,
  UserPlus
} from '../../utils/icons';
import { toast } from 'react-toastify';
import CustomerLoginModal from './CustomerLoginModal';
import { setAuthTokens } from '@/utils/cookieUtils';

export default function CustomerRegistration() {
  const router = useRouter();
  const [registerCustomer, { isLoading }] = useRegisterCustomerMutation();
  const [mergeCart] = useMergeCartMutation();

  // Login Modal Trigger from Registration Page
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirm_password: '',
    date_of_birth: '',
    terms_accepted: true
  });

  // Errors & Touched
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [touched, setTouched] = useState({});

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  // Blur handler for live field validation
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateSingleField(field);
  };

  // Validate single field
  const validateSingleField = (field) => {
    const newErrors = { ...errors };

    if (field === 'username') {
      const val = formData.username.trim();
      if (!val) {
        newErrors.username = 'Username is required.';
      } else if (val.length < 3) {
        newErrors.username = 'Username must be at least 3 characters.';
      } else if (!/^[a-zA-Z0-9_.-]+$/.test(val)) {
        newErrors.username = 'Only letters, numbers, dots, and underscores allowed.';
      } else {
        delete newErrors.username;
      }
    }

    if (field === 'email') {
      const val = formData.email.trim();
      if (!val) {
        newErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        newErrors.email = 'Please enter a valid email address.';
      } else {
        delete newErrors.email;
      }
    }

    if (field === 'mobile') {
      const val = formData.mobile.replace(/\D/g, '');
      if (!val) {
        newErrors.mobile = 'Mobile number is required.';
      } else if (!/^[6-9]\d{9}$/.test(val)) {
        newErrors.mobile = 'Enter a valid 10-digit mobile number starting with 6-9.';
      } else {
        delete newErrors.mobile;
      }
    }

    if (field === 'password') {
      const val = formData.password;
      if (!val) {
        newErrors.password = 'Password is required.';
      } else if (val.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long.';
      } else if (!/[A-Za-z]/.test(val) || !/\d/.test(val)) {
        newErrors.password = 'Password must include both letters and numbers.';
      } else {
        delete newErrors.password;
      }
    }

    if (field === 'confirm_password') {
      if (!formData.confirm_password) {
        newErrors.confirm_password = 'Confirming your password is required.';
      } else if (formData.confirm_password !== formData.password) {
        newErrors.confirm_password = 'Passwords do not match.';
      } else {
        delete newErrors.confirm_password;
      }
    }

    setErrors(newErrors);
  };

  // Full form validation
  const validateForm = () => {
    const newErrors = {};
    const usernameVal = formData.username.trim();
    const emailVal = formData.email.trim();
    const mobileVal = formData.mobile.replace(/\D/g, '');

    if (!usernameVal) {
      newErrors.username = 'Username is required.';
    } else if (usernameVal.length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(usernameVal)) {
      newErrors.username = 'Only letters, numbers, dots, and underscores allowed.';
    }

    if (!emailVal) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!mobileVal) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(mobileVal)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number starting with 6-9.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter and one number.';
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Confirming your password is required.';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match.';
    }

    if (!formData.terms_accepted) {
      newErrors.terms_accepted = 'You must accept the terms and conditions to register.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200', width: 'w-0' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Za-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = getPasswordStrength(formData.password);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      toast.error('Please resolve the highlighted errors before submitting.');
      return;
    }

    try {
      const response = await registerCustomer({
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.replace(/\D/g, ''),
        password: formData.password,
        confirm_password: formData.confirm_password,
        date_of_birth: formData.date_of_birth || null
      }).unwrap();

      toast.success('Account created successfully! Welcome to Velqino.');

      // Auto login if access token returned
      if (response.access) {
        setAuthTokens({ access: response.access, refresh: response.refresh });
        localStorage.setItem('user_role', 'customer');

        const userName = response.data?.full_name || response.data?.username || formData.username;
        localStorage.setItem('user_name', userName);

        const userId = response.data?.id || response.user_id || response.id;
        if (userId) {
          localStorage.setItem('user_id', userId);
        }

        const sessionId = localStorage.getItem('guest_session_id');
        if (sessionId) {
          try {
            await mergeCart(sessionId).unwrap();
            localStorage.removeItem('guest_session_id');
          } catch (mergeErr) {
            console.warn('Guest cart merge failed:', mergeErr);
          }
        }

        setTimeout(() => {
          router.push('/customer/dashboard');
        }, 800);
      } else {
        setIsLoginModalOpen(true);
      }

    } catch (err) {
      console.error('Registration failed:', err);
      const backendErrors = err?.errors || err?.data?.errors || err?.response?.data?.errors;
      const backendMsg = err?.message || err?.data?.message || err?.response?.data?.message || 'Registration failed. Please check your information.';

      if (backendErrors && typeof backendErrors === 'object') {
        const fieldErrors = {};
        Object.entries(backendErrors).forEach(([field, messages]) => {
          fieldErrors[field] = Array.isArray(messages) ? messages[0] : String(messages);
        });
        setErrors(fieldErrors);
        const firstError = Object.values(fieldErrors)[0];
        setGeneralError(backendMsg || firstError);
        toast.error(firstError || backendMsg);
      } else {
        setGeneralError(backendMsg);
        toast.error(backendMsg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/40 via-surface-0 to-surface-1 py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Navigation Breadcrumb / Return */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-secondary-600 hover:text-primary-700 transition-colors"
          >
            <span>← Back to Store</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-medium text-secondary-500">
            <span>Customer Portal</span>
            <span>•</span>
            <span className="text-primary-600 font-semibold">Account Creation</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/70 border border-primary-200 text-primary-800 text-xs font-bold tracking-wide uppercase mb-3 shadow-2xs">
            <UserPlus size={14} className="text-primary-600" />
            <span>Join Velqino Luxury Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary-900 tracking-tight">
            Create Your Customer Account
          </h1>
          <p className="text-sm sm:text-base text-secondary-600 mt-2.5 leading-relaxed">
            Register to enjoy transparent pricing, direct verified seller communication, real-time shipment tracking, and streamlined invoice management.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-primary-200/60 p-6 sm:p-10 relative overflow-hidden">
          {/* Top subtle decorative accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700" />

          {/* Top General Error Banner */}
          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-red-800">
                <span className="font-semibold block">Registration Notice</span>
                {generalError}
              </div>
              <button
                type="button"
                onClick={() => setGeneralError('')}
                className="text-red-400 hover:text-red-600 p-0.5"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Identity & Credentials */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary-700 mb-3.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-600" />
                1. Account Credentials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* Username */}
                <div>
                  <label className="block text-secondary-700 font-semibold text-xs sm:text-sm mb-1.5">
                    Username / Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('username')}
                      placeholder="e.g. alex_stone"
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.username
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1.5">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      <span>{errors.username}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-secondary-700 font-semibold text-xs sm:text-sm mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="you@domain.com"
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.email
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1.5">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Personal Details */}
            <div className="pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary-700 mb-3.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-600" />
                2. Contact & Verification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* Mobile Number */}
                <div>
                  <label className="block text-secondary-700 font-semibold text-xs sm:text-sm mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type="tel"
                      name="mobile"
                      maxLength={10}
                      value={formData.mobile}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('mobile')}
                      placeholder="10-digit mobile number"
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.mobile
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1.5">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      <span>{errors.mobile}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-secondary-500 mt-1">
                    Used for order notifications and OTP dispatch verification.
                  </p>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-secondary-700 font-semibold text-xs sm:text-sm mb-1.5">
                    Date of Birth <span className="text-secondary-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type="date"
                      name="date_of_birth"
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border border-secondary-200 bg-secondary-50/40 hover:bg-white focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-secondary-500 mt-1">
                    Receive exclusive member anniversary and birthday perks.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Password & Security */}
            <div className="pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary-700 mb-3.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-600" />
                3. Security Credentials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* Password */}
                <div>
                  <label className="block text-secondary-700 font-semibold text-xs sm:text-sm mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('password')}
                      placeholder="Min. 8 characters"
                      className={`w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.password
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-primary-600 p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-medium text-secondary-500">
                        <span>Strength: <span className="font-semibold text-secondary-700">{strength.label}</span></span>
                        <span>{strength.score}/4</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                      </div>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-secondary-500">
                        <span className={formData.password.length >= 8 ? 'text-emerald-600 font-medium' : ''}>
                          {formData.password.length >= 8 ? '✓' : '•'} 8+ characters
                        </span>
                        <span className={/[A-Za-z]/.test(formData.password) ? 'text-emerald-600 font-medium' : ''}>
                          {/[A-Za-z]/.test(formData.password) ? '✓' : '•'} Letters
                        </span>
                        <span className={/\d/.test(formData.password) ? 'text-emerald-600 font-medium' : ''}>
                          {/\d/.test(formData.password) ? '✓' : '•'} Numbers
                        </span>
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1.5">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-secondary-700 font-semibold text-xs sm:text-sm mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('confirm_password')}
                      placeholder="Confirm your password"
                      className={`w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.confirm_password
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-primary-600 p-1"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1.5">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      <span>{errors.confirm_password}</span>
                    </p>
                  )}
                  {!errors.confirm_password && formData.confirm_password && formData.password === formData.confirm_password && (
                    <p className="text-emerald-600 text-xs mt-1.5 flex items-center gap-1.5">
                      <CheckCircle size={13} />
                      <span>Passwords match correctly</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="terms_accepted"
                  checked={formData.terms_accepted}
                  onChange={handleInputChange}
                  className="mt-0.5 w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-secondary-600 leading-snug">
                  I agree to the Velqino{' '}
                  <span className="text-primary-700 font-semibold hover:underline">Terms of Service</span>{' '}
                  and acknowledge the{' '}
                  <span className="text-primary-700 font-semibold hover:underline">Privacy Policy</span>.
                </span>
              </label>
              {errors.terms_accepted && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1.5">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.terms_accepted}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-primary-600 via-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Creating Your Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Complete Customer Registration</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-secondary-400 font-medium">
                Already registered with Velqino?
              </span>
            </div>
          </div>

          {/* Sign In Prompt */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-primary-200 text-primary-700 font-bold text-sm hover:bg-primary-50 transition-colors"
            >
              <span>Sign In to Existing Account</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="p-4 bg-white rounded-2xl border border-primary-100/70 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100/70 flex items-center justify-center text-primary-700 flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-secondary-800">Verified Sellers</h4>
              <p className="text-[11px] text-secondary-500 mt-0.5">Strict quality and authenticity vetting</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-primary-100/70 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100/70 flex items-center justify-center text-primary-700 flex-shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-secondary-800">Transparent Pricing</h4>
              <p className="text-[11px] text-secondary-500 mt-0.5">Zero hidden markups or surcharges</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-primary-100/70 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100/70 flex items-center justify-center text-primary-700 flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-secondary-800">Real-Time Dispatch</h4>
              <p className="text-[11px] text-secondary-500 mt-0.5">Continuous live tracking updates</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-primary-100/70 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100/70 flex items-center justify-center text-primary-700 flex-shrink-0">
              <Package size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-secondary-800">GST Invoicing</h4>
              <p className="text-[11px] text-secondary-500 mt-0.5">Automated tax invoices ready to download</p>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Customer Login Modal when triggered */}
      <CustomerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={() => {
          setIsLoginModalOpen(false);
          router.push('/customer/dashboard');
        }}
      />
    </div>
  );
}
