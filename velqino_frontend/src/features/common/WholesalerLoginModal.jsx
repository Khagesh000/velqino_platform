"use client";

import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  Store,
  Building,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  TrendingUp,
  Package,
  UserPlus
} from '../../utils/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useLoginWholesalerMutation } from '@/redux/wholesaler/slices/wholesalerSlice';
import API from '@/utils/apiConfig';

export default function WholesalerLoginModal({ isOpen, onClose, onLogin, initialMode = 'login' }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [touched, setTouched] = useState({});

  const [loginWholesaler, { isLoading }] = useLoginWholesalerMutation();

  // Reset state when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setGeneralError('');
      setTouched({});
      setShowPassword(false);
      setActiveTab(initialMode);
    }
  }, [isOpen, initialMode]);

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
        newErrors.email = 'Business email address is required.';
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
      newErrors.email = 'Business email address is required.';
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
      toast.error('Please fix the errors in the form.');
      return;
    }

    try {
      const response = await loginWholesaler({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      }).unwrap();

      // Store tokens and wholesaler identification
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      localStorage.setItem('user_role', 'wholesaler');
      
      const userName = response.data?.business_name || response.data?.user?.username || formData.email.split('@')[0];
      localStorage.setItem('user_name', userName);

      const userId = response.user_id || response.data?.user?.id || response.data?.id;
      if (userId) {
        localStorage.setItem('user_id', userId);
      }
      localStorage.setItem('is_wholesaler_registered', 'true');

      // Cart merge via centralized API client (no hardcoded ports)
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

      toast.success(`Welcome back, ${userName}!`);

      if (typeof onLogin === 'function') {
        onLogin(response);
      }

      onClose();
      setTimeout(() => {
        router.push('/wholesaler/wholesalerdashboard');
      }, 600);

    } catch (err) {
      console.error('Wholesaler Login Error:', err);
      const backendErrors = err?.errors || err?.data?.errors || err?.response?.data?.errors;
      const backendMsg = err?.message || err?.data?.message || err?.response?.data?.message || 'Invalid email or password.';

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

  if (!isOpen) return null;

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
          {/* Header Banner */}
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
                <Building size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-200 block">
                  Velqino Wholesale Portal
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Wholesaler Sign In
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-primary-100/90 leading-relaxed max-w-sm">
              Access bulk catalogs, retail purchase orders, invoice automation, and verified store analytics.
            </p>

            {/* Tab navigation pills */}
            <div className="mt-4 p-1 bg-black/20 backdrop-blur-sm rounded-xl flex items-center gap-1 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
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
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-white text-primary-700 shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <UserPlus size={15} />
                Register as Vendor
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto">
            {/* General Error Alert */}
            {generalError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200/80 rounded-2xl flex items-start gap-3 animate-fadeIn">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs sm:text-sm text-red-700">
                  <span className="font-semibold block">Wholesaler Authentication Notice</span>
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

            {/* TAB 1: LOGIN FORM */}
            {activeTab === 'login' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                    Business Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="wholesaler@example.com"
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
                    <button
                      type="button"
                      onClick={() => toast.info('Please contact support@velqino.com to reset your wholesale credentials.')}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-primary-600 p-1"
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
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-secondary-600 font-medium">Keep me signed in</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Sign In to Wholesaler Dashboard</span>
                    </>
                  )}
                </button>

                {/* Footer Link to Registration */}
                <div className="pt-3 text-center border-t border-secondary-100">
                  <p className="text-xs sm:text-sm text-secondary-600">
                    Want to sell in bulk on Velqino?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors"
                    >
                      Register Now
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* TAB 2: REGISTER CALLOUT */
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center p-4 bg-primary-50/60 rounded-2xl border border-primary-200/60">
                  <Store size={32} className="mx-auto text-primary-600 mb-2" />
                  <h3 className="text-base font-bold text-secondary-900">Become a Verified Wholesaler</h3>
                  <p className="text-xs text-secondary-600 mt-1 max-w-sm mx-auto">
                    Expand your reach to thousands of retailers with guaranteed payments, automated invoicing, and zero marketing setup costs.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-secondary-700">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary-50">
                    <TrendingUp size={16} className="text-primary-600 flex-shrink-0" />
                    <span>Direct wholesale B2B inquiries with instant quoting.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary-50">
                    <Package size={16} className="text-primary-600 flex-shrink-0" />
                    <span>Bulk inventory management & automated MOQ controls.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary-50">
                    <ShieldCheck size={16} className="text-primary-600 flex-shrink-0" />
                    <span>Verified GST & bank settlement with 24/7 seller support.</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push('/wholesaler/wholesalerregistrationform');
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Open Full Wholesaler Application</span>
                  <ArrowRight size={16} />
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-xs text-secondary-500 hover:text-primary-600 font-medium"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </div>
            )}

            {/* Security Guarantee Pill */}
            <div className="mt-5 p-3 rounded-2xl bg-primary-50/70 border border-primary-200/50 flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-primary-600 flex-shrink-0" />
              <p className="text-[11px] sm:text-xs text-primary-800 leading-snug font-medium">
                Wholesaler accounts undergo verification for authentic GST and PAN credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
