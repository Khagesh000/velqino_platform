"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  useGetProfileQuery, 
  useUpdateProfileMutation 
} from '../../redux/customer/slices/customerSlice';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Save, 
  Loader2, 
  Edit2, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Bell, 
  Calendar, 
  Check, 
  ShoppingBag, 
  ArrowRight 
} from '../../utils/icons';
import { toast } from 'react-toastify';
import DashboardHeader from './components/DashboardHeader';
import DashboardSidebar from './components/DashboardSidebar';
import ChangePassword from './ChangePassword';

// Helper component for reusable, performant input fields
function ProfileField({
  label,
  name,
  value,
  onChange,
  disabled,
  placeholder,
  type = 'text',
  icon: Icon,
  badge,
  className = '',
  maxLength
}) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-bold text-gray-700">{label}</label>
        {badge}
      </div>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5 rounded-2xl border border-gray-200/90 text-xs sm:text-sm text-gray-900 transition-all ${
            disabled 
              ? 'bg-gray-100/80 text-gray-600 cursor-not-allowed' 
              : 'bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
          }`}
        />
      </div>
    </div>
  );
}

// Helper component for KPI Cards
function StatCard({ title, value, subText, icon: Icon, badgeIcon: BadgeIcon, iconBg, iconColor, badgeColor }) {
  return (
    <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
      <div>
        <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight truncate max-w-[130px] sm:max-w-none">
          {value}
        </h3>
        <span className={`text-[9px] sm:text-[10px] ${badgeColor} font-semibold mt-0.5 inline-flex items-center gap-1`}>
          {BadgeIcon && <BadgeIcon size={11} className="hidden sm:inline-block" />}
          <span>{subText}</span>
        </span>
      </div>
      <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
        <Icon size={18} className="sm:w-5 sm:h-5" />
      </div>
    </div>
  );
}

export default function ProfileSettings({ initialTab = 'profile' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams?.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || initialTab);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
  const userRole = typeof window !== 'undefined' ? (localStorage.getItem('user_role') || 'customer') : 'customer';

  const { data, isLoading, refetch } = useGetProfileQuery({ userId, userRole }, {
    skip: !userId || !userRole
  });

  const [updateProfile] = useUpdateProfileMutation();

  useEffect(() => {
    if (tabFromUrl && (tabFromUrl === 'profile' || tabFromUrl === 'security')) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    if (data?.data) {
      const profile = data.data;
      const commonData = {
        email: profile.user?.email || profile.email || '',
        mobile: profile.user?.mobile || profile.mobile || '',
        username: profile.user?.username || profile.username || '',
        created_at: profile.created_at,
      };

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
          email_notifications: Boolean(profile.email_notifications),
          sms_notifications: Boolean(profile.sms_notifications),
        });
      } else if (userRole === 'retailer') {
        setFormData({
          ...commonData,
          business_name: profile.business_name || '',
          gst_number: profile.gst_number || '',
          shipping_address: profile.shipping_address || '',
          city: profile.city || '',
          state: profile.state || '',
          pincode: profile.pincode || '',
          is_active: Boolean(profile.is_active),
        });
      } else {
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
        });
      }
    }
  }, [data, userRole]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    if (refetch) await refetch();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        userId,
        userRole,
        data: formData
      }).unwrap();

      toast.success('Profile details saved successfully!');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Active Member';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Active Member';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-20 lg:pb-12">
      <DashboardHeader 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      <div className="flex">
        <DashboardSidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />

        <main className="flex-1 lg:ml-64 transition-all duration-300 p-3 sm:p-5 lg:p-8 min-w-0 max-w-full overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto space-y-5 sm:space-y-6">

            {/* Executive Header Ribbon */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 border border-gray-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                    <Sparkles size={12} className="text-primary-600" />
                    Account Profile &amp; Security Console
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Verified Velqino Account
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Profile &amp; Security Settings
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                  Manage your personal details, verified contact channels, doorstep address coordinates, and account credentials in one centralized hub.
                </p>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing || isLoading}
                  className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={14} className={isRefreshing || isLoading ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                  <span>{isRefreshing || isLoading ? 'Syncing...' : 'Sync Data'}</span>
                </button>

                {activeTab === 'profile' && !isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4.5 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white hover:!text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    style={{ color: '#ffffff' }}
                  >
                    <Edit2 size={14} className="!text-white text-white" style={{ color: '#ffffff' }} />
                    <span className="!text-white text-white" style={{ color: '#ffffff' }}>Edit Profile</span>
                  </button>
                ) : activeTab === 'profile' && isEditing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      refetch();
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Cancel Edit</span>
                  </button>
                ) : null}
              </div>
            </div>

            {/* Top KPI Metrics Ribbon (4 Cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <StatCard 
                title="Account Status" 
                value="Verified" 
                subText="Customer Tier Active" 
                icon={ShieldCheck} 
                badgeIcon={ShieldCheck} 
                iconBg="bg-emerald-50" 
                iconColor="text-emerald-600" 
                badgeColor="text-emerald-600" 
              />
              <StatCard 
                title="Member Since" 
                value={formatDate(formData.created_at)} 
                subText="Active customer" 
                icon={Calendar} 
                badgeIcon={Calendar} 
                iconBg="bg-primary-50" 
                iconColor="text-primary-600" 
                badgeColor="text-primary-600" 
              />
              <StatCard 
                title="Security Protection" 
                value="Secured" 
                subText="Encrypted credentials" 
                icon={Lock} 
                badgeIcon={Lock} 
                iconBg="bg-indigo-50" 
                iconColor="text-indigo-600" 
                badgeColor="text-indigo-600" 
              />
              <StatCard 
                title="Alerts & Updates" 
                value={formData.email_notifications || formData.sms_notifications ? 'Enabled' : 'Standard'} 
                subText="Real-time dispatch notices" 
                icon={Bell} 
                badgeIcon={Bell} 
                iconBg="bg-amber-50" 
                iconColor="text-amber-600" 
                badgeColor="text-amber-600" 
              />
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl w-full sm:w-auto self-start border border-gray-200/60 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User size={15} className={activeTab === 'profile' ? 'text-primary-600' : 'text-gray-400'} />
                <span>Personal &amp; Contact Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Lock size={15} className={activeTab === 'security' ? 'text-primary-600' : 'text-gray-400'} />
                <span>Password &amp; Security</span>
              </button>
            </div>

            {/* TAB 1: Profile Information */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* Personal & Contact Details */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
                        Personal &amp; Contact Information
                      </h2>
                    </div>
                    {isEditing && (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        Editing Mode Active
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userRole === 'customer' && (
                      <ProfileField
                        label="Full Name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                        icon={User}
                      />
                    )}

                    {(userRole === 'retailer' || userRole === 'wholesaler') && (
                      <ProfileField
                        label="Business Name"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Registered enterprise name"
                        icon={Building}
                      />
                    )}

                    <ProfileField
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      disabled={true}
                      icon={Mail}
                      badge={
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                          <Check size={10} /> Verified
                        </span>
                      }
                    />

                    <ProfileField
                      label="Mobile Number"
                      name="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Primary contact mobile"
                      icon={Phone}
                    />

                    {userRole === 'customer' && (
                      <ProfileField
                        label="Alternate Contact Phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Secondary contact number"
                        icon={Phone}
                      />
                    )}

                    <ProfileField
                      label="Username Reference"
                      name="username"
                      value={formData.username}
                      disabled={true}
                      icon={User}
                    />
                  </div>
                </div>

                {/* Delivery Address Coordinates */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-2xs space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                      <MapPin size={16} />
                    </div>
                    <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
                      {userRole === 'customer' ? 'Doorstep Address Coordinates' : userRole === 'retailer' ? 'Shipping Warehouse' : 'Registered Shop Location'}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        {userRole === 'customer' ? 'Address Line 1 (Flat, House, Building, Street)' : 'Street Location Address'}
                      </label>
                      <textarea
                        name={userRole === 'customer' ? 'address_line1' : userRole === 'retailer' ? 'shipping_address' : 'shop_address'}
                        value={userRole === 'customer' ? (formData.address_line1 || '') : userRole === 'retailer' ? (formData.shipping_address || '') : (formData.shop_address || '')}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows={2}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50/80 border border-gray-200/90 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-gray-100/60 disabled:text-gray-600 transition-all"
                        placeholder="House / Flat / Area address"
                      />
                    </div>

                    {userRole === 'customer' && (
                      <ProfileField
                        label="Address Line 2 (Area, Sector, Landmark Details)"
                        name="address_line2"
                        value={formData.address_line2}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Sector, colony, or landmark notes"
                        className="sm:col-span-2"
                      />
                    )}

                    <ProfileField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="City"
                    />

                    <ProfileField
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="State"
                    />

                    <ProfileField
                      label="PIN Code"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      maxLength={6}
                      placeholder="6-digit PIN code"
                    />

                    <ProfileField
                      label="Landmark"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Nearby popular location"
                    />
                  </div>
                </div>

                {/* Notifications & Alert Preferences (Customer Role) */}
                {userRole === 'customer' && (
                  <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                        <Bell size={16} />
                      </div>
                      <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
                        Fulfillment Notifications &amp; Alerts
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200/80 cursor-pointer hover:bg-gray-100/60 transition-colors">
                        <input
                          type="checkbox"
                          name="email_notifications"
                          checked={Boolean(formData.email_notifications)}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-4 h-4 mt-0.5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer disabled:opacity-50"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block">Email Order Notifications</span>
                          <span className="text-gray-500">Receive order confirmations, tax invoices, and courier dispatch tracking via email.</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200/80 cursor-pointer hover:bg-gray-100/60 transition-colors">
                        <input
                          type="checkbox"
                          name="sms_notifications"
                          checked={Boolean(formData.sms_notifications)}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-4 h-4 mt-0.5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer disabled:opacity-50"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block">SMS Delivery Alerts</span>
                          <span className="text-gray-500">Get instant SMS updates on out-for-delivery status and delivery agent verification.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Action Buttons (When editing) */}
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 bg-white rounded-3xl border border-gray-200/80 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        refetch();
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    >
                      Cancel Changes
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      style={{ color: '#ffffff' }}
                    >
                      {saving ? (
                        <>
                          <Loader2 size={15} className="animate-spin !text-white text-white" style={{ color: '#ffffff' }} />
                          <span className="!text-white text-white" style={{ color: '#ffffff' }}>Saving Updates...</span>
                        </>
                      ) : (
                        <>
                          <Save size={15} className="!text-white text-white" style={{ color: '#ffffff' }} />
                          <span className="!text-white text-white" style={{ color: '#ffffff' }}>Save Profile Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-3xl border border-gray-200/80 shadow-2xs text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span>Account information is synchronized with Velqino Core Security.</span>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-primary-600 hover:text-primary-700 font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <Edit2 size={13} />
                      <span>Edit Information</span>
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* TAB 2: Password & Account Security (Rendered via clean, modular ChangePassword component) */}
            {activeTab === 'security' && (
              <div className="space-y-5">
                <ChangePassword />
              </div>
            )}

            {/* Bottom Executive CTA Banner */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-6 bg-white rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100 shadow-2xs">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                    Explore Velqino Shopping &amp; Orders
                  </h4>
                  <p className="text-xs text-gray-500">
                    Track your current parcel fulfillments or browse trending products right now.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-col sm:flex-row shrink-0">
                <Link 
                  href="/customer/orderslist" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 text-gray-700 font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
                >
                  <span>View My Orders</span>
                </Link>
                <Link 
                  href="/product/productlistingpage" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                  style={{ color: '#ffffff' }}
                >
                  <ShoppingBag size={16} className="!text-white text-white" style={{ color: '#ffffff' }} />
                  <span className="!text-white text-white font-bold" style={{ color: '#ffffff' }}>Continue Shopping</span>
                  <ArrowRight size={14} className="!text-white text-white" style={{ color: '#ffffff' }} />
                </Link>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
