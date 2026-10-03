"use client";

import React, { useState, lazy, Suspense, useEffect } from 'react';
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar';
import { useFetchProfileQuery } from '@/redux/wholesaler/slices/wholesalerSlice';
import { getAccessToken } from '@/utils/cookieUtils';
import { 
  Settings as SettingsIcon,
  Building,
  Shield,
  Banknote,
  FileText,
  Bell,
  Users,
  Key,
  Truck,
  CreditCard,
  Store,
  CheckCircle,
  Sparkles,
  HelpCircle
} from '@/utils/icons';

// Lazy load all non-critical components
const ProfileSettings = lazy(() => import('./components/ProfileSettings'));
const AccountSecurity = lazy(() => import('./components/AccountSecurity'));
const BankDetails = lazy(() => import('./components/BankDetails'));
const TaxInformation = lazy(() => import('./components/TaxInformation'));
const NotificationPreferences = lazy(() => import('./components/NotificationPreferences'));
const TeamManagement = lazy(() => import('./components/TeamManagement'));
const APIAccess = lazy(() => import('./components/APIAccess'));
const ShippingSettings = lazy(() => import('./components/ShippingSettings'));
const BillingSubscription = lazy(() => import('./components/BillingSubscription'));
const StoreCustomization = lazy(() => import('./components/StoreCustomization'));

// Structured executive skeleton placeholder
const SettingsPlaceholder = ({ height = "h-[480px]" }) => (
  <div className={`w-full ${height} bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse shadow-xs space-y-5`}>
    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
      <div className="space-y-2">
        <div className="w-48 h-5 rounded bg-slate-200" />
        <div className="w-64 h-3.5 rounded bg-slate-100" />
      </div>
      <div className="w-24 h-8 rounded-lg bg-slate-100" />
    </div>
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-12 bg-slate-100 rounded-xl" />
      </div>
      <div className="h-28 bg-slate-100 rounded-xl" />
      <div className="h-14 bg-slate-100 rounded-xl" />
    </div>
  </div>
);

export default function Settings() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        setUserId(payload.user_id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const { data: wholesalerData, isLoading: wholesalerLoading } = useFetchProfileQuery(userId, {
    skip: !userId
  });

  const wholesaler = wholesalerData?.data || null;

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: Building },
    { id: 'security', label: 'Account Security', icon: Shield },
    { id: 'bank', label: 'Bank Details', icon: Banknote },
    { id: 'tax', label: 'Tax Information', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'api', label: 'API & Developer', icon: Key },
    { id: 'shipping', label: 'Shipping Rules', icon: Truck },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'store', label: 'Store Theme', icon: Store }
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`
        transition-all duration-300 p-3 sm:p-4 lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Executive Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <SettingsIcon size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Enterprise Settings & Configuration
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Verified Partner
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {wholesaler?.business_name 
                    ? `Configuring profile & operating preferences for ${wholesaler.business_name}` 
                    : "Manage your merchant profile, credentials, banking rails, and store customization"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a
                href="/wholesaler/support"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 transition-all shadow-2xs"
              >
                <HelpCircle size={14} className="text-primary-600" />
                <span>Documentation & Support</span>
              </a>
            </div>
          </div>

          {/* Executive Modern Tab Navigation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={15} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Content */}
          <div>
            {activeTab === 'profile' && (
              <div style={{ minHeight: '500px' }}>
                <Suspense fallback={<SettingsPlaceholder height="h-[520px]" />}>
                  <ProfileSettings wholesaler={wholesaler} isLoading={wholesalerLoading} />
                </Suspense>
              </div>
            )}

            {activeTab === 'security' && (
              <div style={{ minHeight: '400px' }}>
                <Suspense fallback={<SettingsPlaceholder height="h-[420px]" />}>
                  <AccountSecurity user={wholesaler?.user} />
                </Suspense>
              </div>
            )}

            {activeTab === 'bank' && (
              <div style={{ minHeight: '350px' }}>
                <Suspense fallback={<SettingsPlaceholder height="h-[380px]" />}>
                  <BankDetails wholesaler={wholesaler} />
                </Suspense>
              </div>
            )}

            {activeTab === 'tax' && (
              <div style={{ minHeight: '400px' }}>
                <Suspense fallback={<SettingsPlaceholder height="h-[420px]" />}>
                  <TaxInformation wholesaler={wholesaler} />
                </Suspense>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div style={{ minHeight: '380px' }}>
                <Suspense fallback={<SettingsPlaceholder height="h-[400px]" />}>
                  <NotificationPreferences />
                </Suspense>
              </div>
            )}

            {activeTab === 'team' && (
              <div style={{ minHeight: '420px' }}>
                <Suspense fallback={<SettingsPlaceholder height="h-[440px]" />}>
                  <TeamManagement />
                </Suspense>
              </div>
            )}

            {activeTab === 'api' && (
              <div style={{ minHeight: '380px' }}>
                <Suspense fallback={<SettingsPlaceholder height="h-[400px]" />}>
                  <APIAccess />
                </Suspense>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div style={{ minHeight: '350px' }}>
                <Suspense fallback={<SettingsPlaceholder height="h-[380px]" />}>
                  <ShippingSettings />
                </Suspense>
              </div>
            )}

            {activeTab === 'billing' && (
              <div style={{ minHeight: '400px' }}>
                <Suspense fallback={<SettingsPlaceholder height="h-[420px]" />}>
                  <BillingSubscription />
                </Suspense>
              </div>
            )}

            {activeTab === 'store' && (
              <div style={{ minHeight: '380px' }}>
                <Suspense fallback={<SettingsPlaceholder height="h-[400px]" />}>
                  <StoreCustomization />
                </Suspense>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
