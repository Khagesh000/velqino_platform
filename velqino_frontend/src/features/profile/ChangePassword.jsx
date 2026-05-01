"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../utils/apiConfig';
import { Lock, Eye, EyeOff, Loader2 } from '../../utils/icons';
import { toast } from 'react-toastify';
import { useChangePasswordMutation } from '@/redux/customer/slices/customerSlice';
export default function ChangePassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    try {
      await changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password
      }).unwrap();
      
      toast.success('Password changed! Please login again');
      setTimeout(() => {
        localStorage.clear();
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to change password');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Current Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showCurrent ? 'text' : 'password'}
              value={formData.current_password}
              onChange={(e) => setFormData({...formData, current_password: e.target.value})}
              className="w-full pl-10 pr-10 py-2 border rounded-lg"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showNew ? 'text' : 'password'}
              value={formData.new_password}
              onChange={(e) => setFormData({...formData, new_password: e.target.value})}
              className="w-full pl-10 pr-10 py-2 border rounded-lg"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showConfirm ? 'text' : 'password'}
              value={formData.confirm_password}
              onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
              className="w-full pl-10 pr-10 py-2 border rounded-lg"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={() => router.back()} className="flex-1 px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            {loading ? 'Changing...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}