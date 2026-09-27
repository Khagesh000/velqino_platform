"use client";

import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  User,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  UserPlus
} from '../../utils/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useLoginCustomerMutation,
  useRegisterCustomerMutation,
  useMergeCartMutation
} from '../../redux/customer/slices/customerSlice';
import { toast } from 'react-toastify';

export default function CustomerLoginModal({ isOpen, onClose, onLogin, initialMode = 'login' }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialMode); // 'login' | 'register'
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirm_password: '',
    date_of_birth: ''
  });

  // Validation & Error states
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [touched, setTouched] = useState({});

  // Mutations
  const [loginCustomer, { isLoading: isLoggingIn }] = useLoginCustomerMutation();
  const [registerCustomer, { isLoading: isRegistering }] = useRegisterCustomerMutation();
  const [mergeCart] = useMergeCartMutation();

  // Reset states when modal opens/closes or tab changes
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setGeneralError('');
      setTouched({});
      setShowPassword(false);
      setShowConfirmPassword(false);
      setActiveTab(initialMode);
    }
  }, [isOpen, initialMode]);

  // Handle Tab Switch
  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setGeneralError('');
    setTouched({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Input change handler for Login
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) setGeneralError('');
  };

  // Input change handler for Register
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) setGeneralError('');
  };

  // Mark field as touched on blur
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  // Live single-field validation
  const validateField = (field) => {
    const newErrors = { ...errors };

    if (activeTab === 'login') {
      if (field === 'email') {
        const val = loginForm.email.trim();
        if (!val) {
          newErrors.email = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          newErrors.email = 'Please enter a valid email address.';
        } else {
          delete newErrors.email;
        }
      }
      if (field === 'password') {
        if (!loginForm.password) {
          newErrors.password = 'Password is required.';
        } else if (loginForm.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters.';
        } else {
          delete newErrors.password;
        }
      }
    } else {
      if (field === 'username') {
        const val = registerForm.username.trim();
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
        const val = registerForm.email.trim();
        if (!val) {
          newErrors.email = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          newErrors.email = 'Please enter a valid email address.';
        } else {
          delete newErrors.email;
        }
      }
      if (field === 'mobile') {
        const val = registerForm.mobile.replace(/\D/g, '');
        if (!val) {
          newErrors.mobile = 'Mobile number is required.';
        } else if (!/^[6-9]\d{9}$/.test(val)) {
          newErrors.mobile = 'Enter a valid 10-digit number starting with 6, 7, 8, or 9.';
        } else {
          delete newErrors.mobile;
        }
      }
      if (field === 'password') {
        const val = registerForm.password;
        if (!val) {
          newErrors.password = 'Password is required.';
        } else if (val.length < 8) {
          newErrors.password = 'Password must be at least 8 characters.';
        } else if (!/[A-Za-z]/.test(val) || !/\d/.test(val)) {
          newErrors.password = 'Must include at least one letter and one number.';
        } else {
          delete newErrors.password;
        }
      }
      if (field === 'confirm_password') {
        if (!registerForm.confirm_password) {
          newErrors.confirm_password = 'Confirming your password is required.';
        } else if (registerForm.confirm_password !== registerForm.password) {
          newErrors.confirm_password = 'Passwords do not match.';
        } else {
          delete newErrors.confirm_password;
        }
      }
    }

    setErrors(newErrors);
  };

  // Full form client validation before submit
  const validateLoginForm = () => {
    const newErrors = {};
    const emailVal = loginForm.email.trim();
    if (!emailVal) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!loginForm.password) {
      newErrors.password = 'Password is required.';
    } else if (loginForm.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    const usernameVal = registerForm.username.trim();
    const emailVal = registerForm.email.trim();
    const mobileVal = registerForm.mobile.replace(/\D/g, '');

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

    if (!registerForm.password) {
      newErrors.password = 'Password is required.';
    } else if (registerForm.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Za-z]/.test(registerForm.password) || !/\d/.test(registerForm.password)) {
      newErrors.password = 'Password must contain at least one letter and one number.';
    }

    if (!registerForm.confirm_password) {
      newErrors.confirm_password = 'Confirming your password is required.';
    } else if (registerForm.password !== registerForm.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Password strength calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
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

  // Server error parser
  const handleServerErrors = (err, fallbackMsg) => {
    console.error('Customer Auth Error:', err);
    const backendErrors = err?.errors || err?.data?.errors || err?.response?.data?.errors;
    const backendMsg = err?.message || err?.data?.message || err?.response?.data?.message || fallbackMsg;

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
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateLoginForm()) {
      toast.error('Please correct the errors in the form.');
      return;
    }

    try {
      const response = await loginCustomer({
        email: loginForm.email.trim().toLowerCase(),
        password: loginForm.password
      }).unwrap();

      // Store tokens and user info
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      localStorage.setItem('user_role', 'customer');
      
      const userName = response.data?.full_name || response.data?.username || loginForm.email.split('@')[0];
      localStorage.setItem('user_name', userName);

      const userId = response.data?.id || response.user_id || response.id;
      if (userId) {
        localStorage.setItem('user_id', userId);
      }

      // Guest cart merge
      const sessionId = localStorage.getItem('guest_session_id');
      if (sessionId) {
        try {
          await mergeCart(sessionId).unwrap();
          localStorage.removeItem('guest_session_id');
        } catch (mergeErr) {
          console.warn('Guest cart merge warning:', mergeErr);
        }
      }

      toast.success(`Welcome back, ${userName}!`);
      
      if (typeof onLogin === 'function') {
        onLogin(response);
      }

      onClose();
      // Smooth redirect
      setTimeout(() => {
        router.refresh();
      }, 500);

    } catch (err) {
      handleServerErrors(err, 'Invalid email or password. Please try again.');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateRegisterForm()) {
      toast.error('Please fill all required fields correctly.');
      return;
    }

    try {
      const response = await registerCustomer({
        username: registerForm.username.trim(),
        email: registerForm.email.trim().toLowerCase(),
        mobile: registerForm.mobile.replace(/\D/g, ''),
        password: registerForm.password,
        confirm_password: registerForm.confirm_password,
        date_of_birth: registerForm.date_of_birth || null
      }).unwrap();

      toast.success('Registration successful! Welcome to Velqino.');

      // Auto login if access token returned
      if (response.access) {
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
        localStorage.setItem('user_role', 'customer');

        const userName = response.data?.full_name || response.data?.username || registerForm.username;
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
            console.warn('Guest cart merge warning:', mergeErr);
          }
        }

        if (typeof onLogin === 'function') {
          onLogin(response);
        }

        onClose();
        setTimeout(() => {
          router.refresh();
        }, 500);
      } else {
        // Switch to login tab
        switchTab('login');
        setLoginForm(prev => ({
          ...prev,
          email: registerForm.email
        }));
      }

    } catch (err) {
      handleServerErrors(err, 'Registration failed. Please check the provided information.');
    }
  };

  if (!isOpen) return null;

  const strength = getPasswordStrength(registerForm.password);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-secondary-950/70 backdrop-blur-md transition-opacity animate-fadeIn" 
        onClick={onClose} 
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-5">
        <div 
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-primary-100 overflow-hidden z-10 animate-scaleUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Decorative Header Banner */}
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white px-6 pt-6 pb-5 relative">
            <button 
              onClick={onClose} 
              aria-label="Close modal"
              className="absolute right-4 top-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all focus:outline-none"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white backdrop-blur-sm shadow-inner">
                {activeTab === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-200 block">
                  Velqino Luxury Commerce
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {activeTab === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-primary-100/90 leading-relaxed max-w-sm">
              {activeTab === 'login'
                ? 'Welcome back! Sign in to access your orders, saved addresses, and exclusive pricing.'
                : 'Join Velqino to unlock verified pricing, direct seller connections, and real-time dispatch.'}
            </p>

            {/* Tab Navigation Pill */}
            <div className="mt-4 p-1 bg-black/20 backdrop-blur-sm rounded-xl flex items-center gap-1 border border-white/10">
              <button
                type="button"
                onClick={() => switchTab('login')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'bg-white text-primary-700 shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <LogIn size={15} />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchTab('register')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-white text-primary-700 shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <UserPlus size={15} />
                Create Account
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto">
            {/* General Error Banner */}
            {generalError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200/80 rounded-2xl flex items-start gap-3 animate-fadeIn">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs sm:text-sm text-red-700">
                  <span className="font-semibold block">Authentication Notice</span>
                  {generalError}
                </div>
                <button
                  type="button"
                  onClick={() => setGeneralError('')}
                  className="text-red-400 hover:text-red-600 p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* ===================== TAB 1: LOGIN ===================== */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="e.g. alex@example.com"
                      autoComplete="email"
                      className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.email
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1.5 animate-fadeIn">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <Link
                      href="/customer/changepassword"
                      onClick={onClose}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      onBlur={() => handleBlur('password')}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={`w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.password
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-primary-600 p-1 rounded-md transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1.5 animate-fadeIn">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={loginForm.rememberMe}
                      onChange={handleLoginChange}
                      className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-secondary-600 font-medium">Keep me signed in</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Sign In to Customer Account</span>
                    </>
                  )}
                </button>

                {/* Switch to Register link */}
                <div className="pt-3 text-center border-t border-secondary-100">
                  <p className="text-xs sm:text-sm text-secondary-600">
                    New to Velqino?{' '}
                    <button
                      type="button"
                      onClick={() => switchTab('register')}
                      className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors"
                    >
                      Create an account
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ===================== TAB 2: REGISTER ===================== */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Username */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1">
                    Username / Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type="text"
                      name="username"
                      value={registerForm.username}
                      onChange={handleRegisterChange}
                      onBlur={() => handleBlur('username')}
                      placeholder="e.g. john_doe"
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-secondary-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.username
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1.5 animate-fadeIn">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      <span>{errors.username}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-secondary-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.email
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1.5 animate-fadeIn">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Mobile Number & DOB Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                      <input
                        type="tel"
                        name="mobile"
                        maxLength={10}
                        value={registerForm.mobile}
                        onChange={handleRegisterChange}
                        onBlur={() => handleBlur('mobile')}
                        placeholder="10-digit number"
                        className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-secondary-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                          errors.mobile
                            ? 'border-red-500 ring-2 ring-red-100'
                            : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                        }`}
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1.5 animate-fadeIn">
                        <AlertCircle size={13} className="flex-shrink-0" />
                        <span>{errors.mobile}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                      <input
                        type="date"
                        name="date_of_birth"
                        max={new Date().toISOString().split('T')[0]}
                        value={registerForm.date_of_birth}
                        onChange={handleRegisterChange}
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-secondary-200 bg-secondary-50/50 hover:bg-white focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      onBlur={() => handleBlur('password')}
                      placeholder="Min. 8 characters"
                      className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border bg-secondary-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all ${
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

                  {/* Password Strength Meter */}
                  {registerForm.password && (
                    <div className="mt-1.5 space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between text-[11px] font-medium text-secondary-500">
                        <span>Strength: <span className="font-semibold text-secondary-700">{strength.label}</span></span>
                        <span>{strength.score}/4</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1.5 animate-fadeIn">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm_password"
                      value={registerForm.confirm_password}
                      onChange={handleRegisterChange}
                      onBlur={() => handleBlur('confirm_password')}
                      placeholder="Re-enter your password"
                      className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border bg-secondary-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all ${
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
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1.5 animate-fadeIn">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      <span>{errors.confirm_password}</span>
                    </p>
                  )}
                  {!errors.confirm_password && registerForm.confirm_password && registerForm.password === registerForm.confirm_password && (
                    <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1.5">
                      <CheckCircle size={13} />
                      <span>Passwords match perfectly</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      <span>Complete Registration</span>
                    </>
                  )}
                </button>

                {/* Switch to Login / Full Page link */}
                <div className="pt-2 text-center border-t border-secondary-100 flex flex-col gap-1.5">
                  <p className="text-xs sm:text-sm text-secondary-600">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => switchTab('login')}
                      className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors"
                    >
                      Sign In here
                    </button>
                  </p>
                  <Link
                    href="/customerregistration"
                    onClick={onClose}
                    className="text-[11px] text-secondary-500 hover:text-primary-600 transition-colors inline-flex items-center justify-center gap-1"
                  >
                    <span>Prefer full page registration?</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </form>
            )}

            {/* Platform Guarantee Pill */}
            <div className="mt-5 p-3 rounded-2xl bg-primary-50/70 border border-primary-200/50 flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-primary-600 flex-shrink-0" />
              <p className="text-[11px] sm:text-xs text-primary-800 leading-snug font-medium">
                Your data is protected with 256-bit enterprise encryption and strict privacy safeguards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
