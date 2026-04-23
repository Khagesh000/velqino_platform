"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegisterCustomerMutation } from '../../redux/customer/slices/customerSlice';
import { Eye, EyeOff, User, Mail, Phone, Lock } from '../../utils/icons';
import { toast } from 'react-toastify';

export default function CustomerRegistration() {
  const router = useRouter();
  const [registerCustomer, { isLoading }] = useRegisterCustomerMutation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirm_password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (backendErrors[name]) {
      setBackendErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  try {
    const response = await registerCustomer({
      username: formData.username,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      confirm_password: formData.confirm_password
    }).unwrap();
    
    toast.success('Registration successful! Please login.');
    
    if (response.access) {
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      localStorage.setItem('user_role', 'customer');
      localStorage.setItem('user_name', formData.username);
      
      // ✅ Clear guest session after registration
      localStorage.removeItem('guest_session_id');
    }
    
    router.push('/');
    
  } catch (error) {
    if (error?.data?.errors) {
      setBackendErrors(error.data.errors);
      Object.values(error.data.errors).forEach(err => {
        toast.error(Array.isArray(err) ? err[0] : err);
      });
    } else {
      toast.error(error?.data?.message || 'Registration failed. Please try again.');
    }
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8 sm:py-12 md:py-16">
  <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
    
    {/* Header */}
    {/* <div className="text-center mb-6 sm:mb-8 md:mb-10">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
        <User size={28} className="text-primary-600 sm:w-8 sm:h-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
        Create Account
      </h1>
      <p className="text-sm sm:text-base text-gray-500 mt-2">Join us to start shopping and get exclusive offers</p>
    </div> */}

    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-gray-700 text-center">
        Create Customer Account
      </h3>
    
    {/* Form Card */}
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 md:p-8 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        
        {/* Username & Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-1.5">Username *</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-sm sm:text-base ${
                  errors.username || backendErrors.username 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                }`}
                placeholder="Choose a username"
              />
            </div>
            {(errors.username || backendErrors.username) && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {backendErrors.username || errors.username}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-1.5">Email Address *</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-sm sm:text-base ${
                  errors.email || backendErrors.email 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                }`}
                placeholder="your@email.com"
              />
            </div>
            {(errors.email || backendErrors.email) && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {backendErrors.email || errors.email}
              </p>
            )}
          </div>
        </div>
        
        {/* Mobile */}
        <div>
          <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-1.5">Mobile Number *</label>
          <div className="relative group">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-sm sm:text-base ${
                errors.mobile || backendErrors.mobile 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
              }`}
              placeholder="10-digit mobile number"
              maxLength={10}
            />
          </div>
          {(errors.mobile || backendErrors.mobile) && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
              {backendErrors.mobile || errors.mobile}
            </p>
          )}
        </div>
        
        {/* Password & Confirm Password Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-1.5">Password *</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-sm sm:text-base ${
                  errors.password || backendErrors.password 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                }`}
                placeholder="Create password (min 8 characters)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {(errors.password || backendErrors.password) && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {backendErrors.password || errors.password}
              </p>
            )}
            {!errors.password && !backendErrors.password && formData.password && (
              <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-green-500 rounded-full"></span>
                Password strength: Strong
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-1.5">Confirm Password *</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-sm sm:text-base ${
                  errors.confirm_password 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.confirm_password}
              </p>
            )}
            {!errors.confirm_password && formData.confirm_password && formData.password === formData.confirm_password && (
              <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-green-500 rounded-full"></span>
                Passwords match
              </p>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 sm:py-3.5 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base shadow-md hover:shadow-lg mt-4"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <User size={18} />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>
      
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400 text-xs sm:text-sm">or</span>
        </div>
      </div>
      
      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-600 text-sm sm:text-base">
          Already have an account?{' '}
          <Link href="/customer/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all">
            Sign in here
          </Link>
        </p>
      </div>
      
      {/* Benefits Section */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
        <p className="text-xs sm:text-sm font-semibold text-primary-700 mb-2 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
          Benefits of your account:
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <p className="text-[11px] sm:text-xs text-gray-600 flex items-center gap-1">✓ Easy checkout & tracking</p>
          <p className="text-[11px] sm:text-xs text-gray-600 flex items-center gap-1">✓ Exclusive offers & discounts</p>
          <p className="text-[11px] sm:text-xs text-gray-600 flex items-center gap-1">✓ Wishlist & saved addresses</p>
          <p className="text-[11px] sm:text-xs text-gray-600 flex items-center gap-1">✓ Order history & returns</p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}