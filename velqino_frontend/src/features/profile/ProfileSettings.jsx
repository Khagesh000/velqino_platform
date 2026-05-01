"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../redux/customer/slices/customerSlice';
import { User, Mail, Phone, Building, MapPin, City, CreditCard, Ban, Save, Loader2, Edit2 } from '../../utils/icons';
import { toast } from 'react-toastify';

export default function ProfileSettings() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
  
  const { data, isLoading, refetch } = useGetProfileQuery({ userId, userRole }, {
    skip: !userId || !userRole
  });
  
  const [updateProfile] = useUpdateProfileMutation();
  
  useEffect(() => {
    if (data?.data) {
      const profile = data.data;
      
      // Common fields for all roles
      const commonData = {
        email: profile.user?.email || profile.email || '',
        mobile: profile.user?.mobile || profile.mobile || '',
        username: profile.user?.username || profile.username || '',
        created_at: profile.created_at,
      };
      
      // Role-specific fields
      if (userRole === 'customer') {
        setFormData({
          ...commonData,
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          address_line1: profile.address_line1 || '',
          address_line2: profile.address_line2 || '',
          city: profile.city || '',
          state: profile.state || '',
          pincode: profile.pincode || '',
          landmark: profile.landmark || '',
          email_notifications: profile.email_notifications || false,
          sms_notifications: profile.sms_notifications || false,
        });
      } 
      else if (userRole === 'retailer') {
        setFormData({
          ...commonData,
          business_name: profile.business_name || '',
          gst_number: profile.gst_number || '',
          shipping_address: profile.shipping_address || '',
          city: profile.city || '',
          state: profile.state || '',
          pincode: profile.pincode || '',
          is_active: profile.is_active || false,
        });
      } 
      else if (userRole === 'wholesaler') {
        setFormData({
          ...commonData,
          business_name: profile.business_name || '',
          business_type: profile.business_type || '',
          gst_number: profile.gst_number || '',
          pan_number: profile.pan_number || '',
          shop_address: profile.shop_address || '',
          city: profile.city || '',
          state: profile.state || '',
          pincode: profile.pincode || '',
          landmark: profile.landmark || '',
          categories: profile.categories || [],
          minimum_order_quantity: profile.minimum_order_quantity || 1,
          price_range: profile.price_range || '',
          account_holder: profile.account_holder || '',
          bank_name: profile.bank_name || '',
          account_number: profile.account_number || '',
          ifsc_code: profile.ifsc_code || '',
          upi_id: profile.upi_id || '',
          verified: profile.verified || false,
        });
      }
    }
  }, [data, userRole]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile({ 
        userId, 
        userRole, 
        data: formData
      }).unwrap();
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="bg-gray-100 rounded-xl h-96"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Role Badge */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
              {userRole === 'customer' && '👤 Customer Account'}
              {userRole === 'retailer' && '🏪 Retailer Account'}
              {userRole === 'wholesaler' && '📦 Wholesaler Account'}
            </span>
          </div>
          
          <div className="p-6 space-y-6">
            
            {/* Basic Information - Common for all roles */}
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-primary-500" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userRole === 'customer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                )}
                
                {(userRole === 'retailer' || userRole === 'wholesaler') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
                
                {userRole === 'customer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
            
            {/* Business Information - Retailer & Wholesaler only */}
            {(userRole === 'retailer' || userRole === 'wholesaler') && (
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building size={20} className="text-primary-500" />
                  Business Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userRole === 'wholesaler' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                        <input
                          type="text"
                          name="business_type"
                          value={formData.business_type || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                        <input
                          type="text"
                          name="price_range"
                          value={formData.price_range || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                        />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                    <input
                      type="text"
                      name="gst_number"
                      value={formData.gst_number || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  
                  {userRole === 'wholesaler' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                      <input
                        type="text"
                        name="pan_number"
                        value={formData.pan_number || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                      />
                    </div>
                  )}
                  
                  {userRole === 'wholesaler' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Quantity</label>
                      <input
                        type="number"
                        name="minimum_order_quantity"
                        value={formData.minimum_order_quantity || 1}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Address Information */}
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-primary-500" />
                Address Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {userRole === 'customer' ? 'Address Line 1' : userRole === 'retailer' ? 'Shipping Address' : 'Shop Address'}
                  </label>
                  <textarea
                    name={userRole === 'customer' ? 'address_line1' : userRole === 'retailer' ? 'shipping_address' : 'shop_address'}
                    value={userRole === 'customer' ? formData.address_line1 || '' : userRole === 'retailer' ? formData.shipping_address || '' : formData.shop_address || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
                
                {userRole === 'customer' && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      name="address_line2"
                      value={formData.address_line2 || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
                
                {userRole !== 'retailer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Bank Details - Wholesaler only */}
            {userRole === 'wholesaler' && (
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Ban size={20} className="text-primary-500" />
                  Bank Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      name="account_holder"
                      value={formData.account_holder || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      name="bank_name"
                      value={formData.bank_name || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      name="account_number"
                      value={formData.account_number || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      name="ifsc_code"
                      value={formData.ifsc_code || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                    <input
                      type="text"
                      name="upi_id"
                      value={formData.upi_id || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Preferences - Customer only */}
            {userRole === 'customer' && (
              <div className="pb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="email_notifications"
                      checked={formData.email_notifications || false}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700">Receive email notifications</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="sms_notifications"
                      checked={formData.sms_notifications || false}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700">Receive SMS notifications</span>
                  </label>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    refetch();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
            
            {!isEditing && (
              <div className="text-center text-sm text-gray-400 pt-4 border-t border-gray-100">
                Click "Edit Profile" to make changes
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}