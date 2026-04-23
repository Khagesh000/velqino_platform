"use client";

import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, LogIn, Store, Shield } from '../../utils/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useLoginWholesalerMutation } from '@/redux/wholesaler/slices/wholesalerSlice';

export default function WholesalerLoginModal({ isOpen, onClose, onLogin }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loginWholesaler] = useLoginWholesalerMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.email || !formData.password) {
    toast.error('Please enter both email and password');
    return;
  }
  setIsLoading(true);
  try {
    const response = await loginWholesaler({ 
      email: formData.email, 
      password: formData.password 
    }).unwrap();
    
    localStorage.setItem('access', response.access);
    localStorage.setItem('refresh', response.refresh);
    localStorage.setItem('user_role', 'wholesaler');
    
    // ✅ MERGE GUEST CART AFTER LOGIN
    const sessionId = localStorage.getItem('guest_session_id');
    if (sessionId) {
      try {
        await fetch('http://localhost:8000/api/commerce/cart/merge/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${response.access}`,
            'Content-Type': 'application/json',
            'X-Session-ID': sessionId
          }
        });
        localStorage.removeItem('guest_session_id');
      } catch (mergeError) {
        console.log('Cart merge failed:', mergeError);
      }
    }
    
    toast.success('Login successful! Redirecting...');
    onClose();
    setTimeout(() => router.push('/wholesaler/wholesalerdashboard'), 1000);
    
  } catch (err) {
    toast.error(err?.data?.message || 'Invalid credentials');
  } finally {
    setIsLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
  <div className="flex min-h-full items-center justify-center p-4">
    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-slideUp">
      <button onClick={onClose} className="absolute right-4 top-4 p-1 text-gray-400 hover:text-primary-600 rounded-lg transition-all z-10">
        <X size={20} />
      </button>

      <div className="text-center pt-8 pb-4 px-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Store size={28} className="text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Wholesaler Login</h2>
        <p className="text-sm text-gray-500 mt-1">Access your wholesale dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
        {error && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-600">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="wholesaler@example.com"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <button type="button" className="text-sm text-primary-600 hover:text-primary-700">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <LogIn size={18} />
              <span>Login as Wholesaler</span>
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have a wholesaler account?{' '}
          <button
            type="button"
            onClick={() => router.push('/wholesaler/wholesalerregistrationform')}
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Register Now
          </button>
        </p>

        <div className="p-3 bg-primary-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield size={14} className="text-primary-600 mt-0.5" />
            <p className="text-xs text-primary-700">
              Wholesaler accounts are for businesses selling products in bulk quantities.
              Need help? Contact our support team.
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
  );
}