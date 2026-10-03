"use client";

import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Store,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  UserPlus,
  CheckCircle,
  RefreshCw
} from '../../utils/icons';
import { useRouter } from 'next/navigation';
import { useLoginRetailerMutation } from '@/redux/retailer/slices/retailerSlice';
import API from '@/utils/apiConfig';
import { setAuthTokens, setAuthUser } from '@/utils/cookieUtils';
import { toast } from 'react-toastify';

export default function RetailerLoginModal({ isOpen, onClose, onLogin, initialMode = 'login' }) {
  const router = useRouter();
  const [loginRetailer, { isLoading }] = useLoginRetailerMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [touched, setTouched] = useState({});

  // Reset states on open/close
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setGeneralError('');
      setTouched({});
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

    if (field === 'email') {
      const emailVal = formData.email.trim();
      if (!emailVal) {
        newErrors.email = 'Retailer email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        newErrors.email = 'Please enter a valid email address.';
      } else {
        delete newErrors.email;
      }
    }

    if (field === 'password') {
      if (!formData.password) {
        newErrors.password = 'Password is required.';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long.';
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    const emailVal = formData.email.trim();

    if (!emailVal) {
      newErrors.email = 'Retailer email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      toast.error('Please fill in all required fields properly.');
      return;
    }

    try {
      const response = await loginRetailer({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      }).unwrap();

      // Store tokens securely in cookies
      setAuthTokens({ access: response.access, refresh: response.refresh });
      
      const userEmail = response.data?.email || response.data?.user?.email || formData.email.trim().toLowerCase();
      const businessName = response.data?.business_name || response.data?.username || response.data?.user?.username || (userEmail ? userEmail.split('@')[0] : 'Retailer');
      const userId = response.user_id || response.data?.user?.id || response.data?.id;

      setAuthUser({
        name: businessName,
        email: userEmail,
        role: 'retailer',
        id: userId
      });
      localStorage.setItem('is_retailer_registered', 'true');

      // Seamless guest cart merging using centralized API client
      const sessionId = localStorage.getItem('guest_session_id');
      if (sessionId) {
        try {
          await API.post('commerce/cart/merge/', {}, {
            headers: {
              'X-Session-ID': sessionId
            }
          });
          localStorage.removeItem('guest_session_id');
        } catch (mergeError) {
          console.warn('Cart merge warning:', mergeError);
        }
      }

      toast.success(`Welcome back, ${businessName}!`);

      if (typeof onLogin === 'function') {
        onLogin(response);
      }

      onClose();
      setTimeout(() => {
        router.push('/retailer/retailerdashboard');
      }, 600);

    } catch (err) {
      console.error('Retailer Login Error:', err);
      const backendErrors = err?.errors || err?.data?.errors || err?.response?.data?.errors;
      const backendMsg = err?.message || err?.data?.message || err?.response?.data?.message || 'Invalid email or password.';

      if (backendErrors && typeof backendErrors === 'object') {
        const fieldErrors = {};
        Object.entries(backendErrors).forEach(([field, messages]) => {
          fieldErrors[field] = Array.isArray(messages) ? messages[0] : String(messages);
        });
        setErrors(fieldErrors);
        setGeneralError(backendMsg);
      } else {
        setGeneralError(backendMsg);
      }

      toast.error(backendMsg);
    }
  };

  const handleNavigateToRegister = () => {
    onClose();
    router.push('/retailer/register');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-secondary-900/60 backdrop-blur-xs transition-opacity animate-fadeIn" 
        onClick={onClose} 
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-secondary-200/80 overflow-hidden z-10 animate-slideUp">
          
          {/* Header Gradient Top Banner */}
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 px-6 pt-7 pb-6 text-white relative">
            <button
              onClick={onClose}
              type="button"
              className="absolute right-4 top-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <ShoppingBag size={24} className="text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-primary-200 block">
                  Velqino Retail Partner
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Retailer Sign In
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-primary-100/90 leading-snug">
              Access wholesale catalog pricing, manage store orders, and track deliveries.
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-7">
            {generalError && (
              <div className="mb-5 p-3.5 bg-red-50/90 border border-red-200/80 rounded-2xl flex items-start gap-3 animate-fadeIn">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-red-800 leading-relaxed font-medium">
                  {generalError}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5">
                  Retailer Email Address *
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('email')}
                    placeholder="retailer@business.com"
                    autoComplete="email"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all bg-secondary-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 ${
                      touched.email && errors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100 text-secondary-900'
                        : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70 text-secondary-900'
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium animate-fadeIn">
                    <AlertCircle size={13} />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.info('Please contact support or your account administrator to reset your password.')}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('password')}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm font-medium transition-all bg-secondary-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 ${
                      touched.password && errors.password
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100 text-secondary-900'
                        : 'border-secondary-200 focus:border-primary-500 focus:ring-primary-100/70 text-secondary-900'
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
                {touched.password && errors.password && (
                  <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium animate-fadeIn">
                    <AlertCircle size={13} />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 transition-colors"
                  />
                  <span className="text-xs sm:text-sm text-secondary-600 font-medium">
                    Keep me signed in on this device
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-primary-600/20 disabled:opacity-60 disabled:cursor-not-allowed group text-sm sm:text-base mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin text-white" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Retailer Hub</span>
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-secondary-400 font-semibold tracking-wider">
                  New to Velqino?
                </span>
              </div>
            </div>

            {/* Register CTA */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleNavigateToRegister}
                className="w-full py-3 px-4 rounded-xl border-2 border-primary-200 hover:border-primary-400 bg-primary-50/50 hover:bg-primary-50 text-primary-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <UserPlus size={17} />
                <span>Create New Retailer Account</span>
              </button>
            </div>

            {/* Security Guarantee Note */}
            <div className="mt-5 p-3 rounded-xl bg-secondary-50 border border-secondary-200/80 flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
              <p className="text-[11px] text-secondary-600 font-medium leading-snug">
                Bank-grade SSL encryption. Authorized B2B pricing and verified supplier direct orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
