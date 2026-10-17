"use client";

import React, { useState } from 'react';
import { 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Loader2 
} from '../../utils/icons';
import { useChangePasswordMutation } from '@/redux/customer/slices/customerSlice';
import { toast } from 'react-toastify';

export default function ChangePassword({ onSuccess }) {
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.current_password) {
      toast.error('Please enter your current password');
      return;
    }

    if (formData.new_password.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      toast.error('New password and confirmation do not match');
      return;
    }

    try {
      await changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password
      }).unwrap();

      toast.success('Account password updated successfully!');
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update password. Verify current password.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-5 sm:p-7 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
          <Lock size={20} />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
            Change Account Password
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Choose a strong, unique password of at least 8 characters to keep your Velqino account secure.
          </p>
        </div>
      </div>

      {/* Password Change Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Current Account Password *
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={formData.current_password}
              onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-gray-50/80 border border-gray-200/90 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              placeholder="Enter your existing password"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
            >
              {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            New Strong Password *
          </label>
          <div className="relative">
            <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={formData.new_password}
              onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-gray-50/80 border border-gray-200/90 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              placeholder="Minimum 8 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
            >
              {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Confirm New Password *
          </label>
          <div className="relative">
            <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-gray-50/80 border border-gray-200/90 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              placeholder="Re-enter new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Password Security Rules Checklist */}
        <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200/70 space-y-2 text-xs">
          <p className="font-bold text-gray-700">Security Requirements:</p>
          <div className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
              formData.new_password.length >= 8 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              ✓
            </span>
            <span className={formData.new_password.length >= 8 ? 'text-emerald-700 font-bold' : 'text-gray-500'}>
              At least 8 characters long
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
              formData.new_password && formData.new_password === formData.confirm_password ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              ✓
            </span>
            <span className={formData.new_password && formData.new_password === formData.confirm_password ? 'text-emerald-700 font-bold' : 'text-gray-500'}>
              Passwords match
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setFormData({ current_password: '', new_password: '', confirm_password: '' })}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            {isChangingPassword ? (
              <>
                <Loader2 size={15} className="animate-spin !text-white text-white" style={{ color: '#ffffff' }} />
                <span className="!text-white text-white" style={{ color: '#ffffff' }}>Updating Password...</span>
              </>
            ) : (
              <>
                <Lock size={15} className="!text-white text-white" style={{ color: '#ffffff' }} />
                <span className="!text-white text-white" style={{ color: '#ffffff' }}>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}