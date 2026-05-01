"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegisterRetailerMutation } from '../../../redux/retailer/slices/retailerSlice';
import { Eye, EyeOff, Mail, Lock, Building, Phone, MapPin, Citrus, Hash, Store, User, CheckCircle } from '../../../utils/icons';
import { toast } from 'react-toastify';

export default function RetailerRegistration() {
  const router = useRouter();
  const [registerRetailer, { isLoading }] = useRegisterRetailerMutation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirm_password: '',
    business_name: '',
    gst_number: '',
    shipping_address: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (backendErrors[name]) {
      setBackendErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
        const newErrors = {};
        
        // ✅ ADD USERNAME VALIDATION
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        
        if (!formData.business_name.trim()) {
            newErrors.business_name = 'Business name is required';
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
        
        if (!formData.shipping_address.trim()) {
            newErrors.shipping_address = 'Shipping address is required';
        }
        
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }
        
        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }
        
        if (!formData.pincode.trim()) {
            newErrors.pincode = 'PIN code is required';
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'PIN code must be 6 digits';
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
    const response = await registerRetailer({
      username: formData.username,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      confirm_password: formData.confirm_password,
      business_name: formData.business_name,
      gst_number: formData.gst_number,
      shipping_address: formData.shipping_address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode
    }).unwrap();
    
    toast.success('Registration successful! Please login.');
    
    if (response.access) {
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      localStorage.setItem('user_role', 'retailer');
      localStorage.setItem('user_name', formData.business_name);
      localStorage.setItem('user_id', response.data?.id);
      
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-10 sm:py-14 md:py-20">
  <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
    
    {/* Header */}
    {/* <div className="text-center mb-8 sm:mb-10 md:mb-12">
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
        <Store size={32} className="text-primary-600 sm:w-9 sm:h-9" />
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
        Register as Retailer
      </h1>
      <p className="text-base sm:text-lg text-gray-500 mt-3">Start selling to customers and grow your business</p>
    </div> */}
    
    {/* Form Card */}
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
        
        {/* Business Information Section */}
        <div className="pb-3 border-b border-gray-200">
          <h5 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Building size={22} className="text-primary-500" />
            Business Information
          </h5>
          <p className="text-sm text-gray-500 mt-1">Enter your business details</p>
        </div>
        
        {/* Business Name & GST Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">Business Name *</label>
            <div className="relative group">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-base ${
                  errors.business_name || backendErrors.business_name 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                }`}
                placeholder="Your business / shop name"
              />
            </div>
            {(errors.business_name || backendErrors.business_name) && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {backendErrors.business_name || errors.business_name}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">GST Number</label>
            <div className="relative group">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
              <input
                type="text"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-100 transition-all bg-gray-50 hover:bg-white text-base"
                placeholder="22AAAAA0000A1Z (Optional)"
              />
            </div>
          </div>
        </div>
        
        {/* Contact Information Section */}
        <div className="pt-2 pb-3 border-b border-gray-200">
          {/* <h5 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
            <User size={22} className="text-primary-500" />
            Contact Information
          </h5> */}
          <p className="text-sm text-gray-500 mt-1">Your login credentials</p>
        </div>
        
        {/* Email & Mobile Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">Email Address *</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-base ${
                  errors.email || backendErrors.email 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                }`}
                placeholder="your@business.com"
              />
            </div>
            {(errors.email || backendErrors.email) && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {backendErrors.email || errors.email}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">Mobile Number *</label>
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-base ${
                  errors.mobile || backendErrors.mobile 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                }`}
                placeholder="10-digit mobile number"
                maxLength={10}
              />
            </div>
            {(errors.mobile || backendErrors.mobile) && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {backendErrors.mobile || errors.mobile}
              </p>
            )}
          </div>
        </div>
        
        {/* Username Field */}
        <div>
          <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">Username *</label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-base ${
                errors.username || backendErrors.username 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
              }`}
              placeholder="Choose a username"
            />
          </div>
          {(errors.username || backendErrors.username) && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
              {backendErrors.username || errors.username}
            </p>
          )}
        </div>
        
        {/* Shipping Address Section */}
        <div className="pt-2 pb-3 border-b border-gray-200">
          {/* <h5 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
            <MapPin size={22} className="text-primary-500" />
            Shipping Address
          </h5> */}
          <p className="text-sm text-gray-500 mt-1">Where products will be delivered</p>
        </div>
        
        {/* Address */}
        <div>
          <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">Full Address *</label>
          <div className="relative group">
            <MapPin className="absolute left-3 top-4 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
            <textarea
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleInputChange}
              rows="3"
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white resize-none text-base ${
                errors.shipping_address || backendErrors.shipping_address 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
              }`}
              placeholder="Street, building, area, landmark"
            />
          </div>
          {(errors.shipping_address || backendErrors.shipping_address) && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
              {backendErrors.shipping_address || errors.shipping_address}
            </p>
          )}
        </div>
        
        {/* City, State, Pincode Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">City *</label>
            <div className="relative group">
              <Citrus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-base ${
                  errors.city || backendErrors.city 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                }`}
                placeholder="City"
              />
            </div>
            {(errors.city || backendErrors.city) && (
              <p className="text-red-500 text-sm mt-1">{backendErrors.city || errors.city}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-base ${
                errors.state || backendErrors.state 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
              }`}
              placeholder="State"
            />
            {(errors.state || backendErrors.state) && (
              <p className="text-red-500 text-sm mt-1">{backendErrors.state || errors.state}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">PIN Code *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              maxLength={6}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-base ${
                errors.pincode || backendErrors.pincode 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
              }`}
              placeholder="6-digit PIN code"
            />
            {(errors.pincode || backendErrors.pincode) && (
              <p className="text-red-500 text-sm mt-1">{backendErrors.pincode || errors.pincode}</p>
            )}
          </div>
        </div>
        
        {/* Password Section */}
        <div className="pt-2 pb-3 border-b border-gray-200">
        {/* <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Lock size={22} className="text-primary-500" />
            Security
        </h2> */}
        <p className="text-sm text-gray-500 mt-1">Create a strong password</p>
        </div>

        {/* Password - Full width on mobile, side by side on desktop */}
        <div className="flex flex-col gap-5">
        <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">Password *</label>
            <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
            <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-base ${
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
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {backendErrors.password || errors.password}
            </p>
            )}
        </div>
        
        <div>
            <label className="block text-gray-700 font-semibold text-sm sm:text-base mb-2">Confirm Password *</label>
            <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
            <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white text-base ${
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
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.confirm_password}
            </p>
            )}
            {!errors.confirm_password && formData.confirm_password && formData.password === formData.confirm_password && (
            <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
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
          className="w-full bg-primary-50 from-primary-600 to-primary-500 text-black py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl mt-6"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              <span>Register as Retailer</span>
            </>
          )}
        </button>
      </form>
      
      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-6 bg-white text-gray-400 text-base">or</span>
        </div>
      </div>
      
      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-600 text-base sm:text-lg">
          Already have a retailer account?{' '}
          <Link href="/retailer/login" className="text-primary-600 hover:text-primary-700 font-bold hover:underline transition-all">
            Sign in here
          </Link>
        </p>
      </div>
      
      {/* Benefits Section */}
      <div className="mt-8 p-5 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
        <p className="text-base font-bold text-primary-700 mb-3 flex items-center gap-2">
          <CheckCircle size={18} />
          Benefits of Retailer Account:
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
          <p className="flex items-center gap-2">✓ Bulk purchase discounts</p>
          <p className="flex items-center gap-2">✓ Direct from wholesalers</p>
          <p className="flex items-center gap-2">✓ GST billing support</p>
          <p className="flex items-center gap-2">✓ Priority shipping</p>
          <p className="flex items-center gap-2">✓ Exclusive product catalog</p>
          <p className="flex items-center gap-2">✓ Dedicated support team</p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}