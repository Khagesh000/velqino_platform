"use client"

import React, { useState, lazy, Suspense, useEffect } from 'react'
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar'
import { useFetchProfileQuery } from '@/redux/wholesaler/slices/wholesalerSlice'

// Lazy load all non-critical components
const ProfileSettings = lazy(() => import('./components/ProfileSettings'))
const AccountSecurity = lazy(() => import('./Components/AccountSecurity'))
const BankDetails = lazy(() => import('./Components/BankDetails'))
const TaxInformation = lazy(() => import('./Components/TaxInformation'))
const NotificationPreferences = lazy(() => import('./Components/NotificationPreferences'))
const TeamManagement = lazy(() => import('./Components/TeamManagement'))
const APIAccess = lazy(() => import('./Components/APIAccess'))
const ShippingSettings = lazy(() => import('./Components/ShippingSettings'))
const BillingSubscription = lazy(() => import('./Components/BillingSubscription'))
const StoreCustomization = lazy(() => import('./Components/StoreCustomization'))

// Loading placeholders
const ProfilePlaceholder = () => <div className="w-full h-[500px] bg-gray-50 rounded-xl animate-pulse" />
const SecurityPlaceholder = () => <div className="w-full h-[400px] bg-gray-50 rounded-xl animate-pulse" />
const BankPlaceholder = () => <div className="w-full h-[350px] bg-gray-50 rounded-xl animate-pulse" />
const TaxPlaceholder = () => <div className="w-full h-[400px] bg-gray-50 rounded-xl animate-pulse" />
const NotificationPlaceholder = () => <div className="w-full h-[380px] bg-gray-50 rounded-xl animate-pulse" />
const TeamPlaceholder = () => <div className="w-full h-[420px] bg-gray-50 rounded-xl animate-pulse" />
const APIPlaceholder = () => <div className="w-full h-[380px] bg-gray-50 rounded-xl animate-pulse" />
const ShippingPlaceholder = () => <div className="w-full h-[350px] bg-gray-50 rounded-xl animate-pulse" />
const BillingPlaceholder = () => <div className="w-full h-[400px] bg-gray-50 rounded-xl animate-pulse" />
const StorePlaceholder = () => <div className="w-full h-[380px] bg-gray-50 rounded-xl animate-pulse" />

export default function Settings() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [userId, setUserId] = useState(null)  // ✅ Add this line

  console.log('🔵 [Settings] Component mounted')

  useEffect(() => {
  console.log('🔵 [Settings] useEffect running - getting userId from token')
  
  // ✅ Use 'access' instead of 'access_token'
  const token = localStorage.getItem('access')
  console.log('🔵 [Settings] Token exists?', token ? 'Yes' : 'No')
  
  if (token) {
    try {
      const base64Payload = token.split('.')[1]
      const payload = JSON.parse(atob(base64Payload))
      console.log('🔵 [Settings] user_id from token:', payload.user_id)
      setUserId(payload.user_id)
    } catch (error) {
      console.error('🔴 [Settings] Error decoding token:', error)
    }
  }
}, [])

  console.log('🔵 [Settings] Current userId state:', userId)

  const { data: wholesalerData, isLoading: wholesalerLoading, error: wholesalerError } = useFetchProfileQuery(userId, {
    skip: !userId
  })

  console.log('🔵 [Settings] Query state:', {
    userId,
    skip: !userId,
    isLoading: wholesalerLoading,
    hasData: !!wholesalerData,
    error: wholesalerError
  })

  if (wholesalerData) {
    console.log('🔵 [Settings] wholesalerData received:', wholesalerData)
  }

  const wholesaler = wholesalerData?.data || null
  console.log('🔵 [Settings] Final wholesaler object:', wholesaler)

  const tabs = [
    { id: 'profile', label: 'Profile Settings' },
    { id: 'security', label: 'Account Security' },
    { id: 'bank', label: 'Bank Details' },
    { id: 'tax', label: 'Tax Information' },
    { id: 'notifications', label: 'Notification Preferences' },
    { id: 'team', label: 'Team Management' },
    { id: 'api', label: 'API Access' },
    { id: 'shipping', label: 'Shipping Settings' },
    { id: 'billing', label: 'Billing & Subscription' },
    { id: 'store', label: 'Store Customization' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`
        transition-all duration-300 p-3 sm:p-4 lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="w-full px-2 sm:px-4 md:px-6 lg:max-w-7xl lg:mx-auto overflow-x-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">Manage your account and business preferences</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="overflow-x-auto scrollbar-hide mb-6">
            <div className="flex items-center gap-1 border-b border-gray-200 min-w-max pb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium capitalize border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content - Pass wholesaler data as props */}
          {activeTab === 'profile' && (
            <div style={{ minHeight: '500px' }}>
              <Suspense fallback={<ProfilePlaceholder />}>
                <ProfileSettings wholesaler={wholesaler} isLoading={wholesalerLoading} />
              </Suspense>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ minHeight: '400px' }}>
              <Suspense fallback={<SecurityPlaceholder />}>
                <AccountSecurity user={wholesaler?.user} />
              </Suspense>
            </div>
          )}

          {activeTab === 'bank' && (
            <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<BankPlaceholder />}>
                <BankDetails wholesaler={wholesaler} />
              </Suspense>
            </div>
          )}

          {activeTab === 'tax' && (
            <div style={{ minHeight: '400px' }}>
              <Suspense fallback={<TaxPlaceholder />}>
                <TaxInformation wholesaler={wholesaler} />
              </Suspense>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ minHeight: '380px' }}>
              <Suspense fallback={<NotificationPlaceholder />}>
                <NotificationPreferences />
              </Suspense>
            </div>
          )}

          {activeTab === 'team' && (
            <div style={{ minHeight: '420px' }}>
              <Suspense fallback={<TeamPlaceholder />}>
                <TeamManagement />
              </Suspense>
            </div>
          )}

          {activeTab === 'api' && (
            <div style={{ minHeight: '380px' }}>
              <Suspense fallback={<APIPlaceholder />}>
                <APIAccess />
              </Suspense>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<ShippingPlaceholder />}>
                <ShippingSettings />
              </Suspense>
            </div>
          )}

          {activeTab === 'billing' && (
            <div style={{ minHeight: '400px' }}>
              <Suspense fallback={<BillingPlaceholder />}>
                <BillingSubscription />
              </Suspense>
            </div>
          )}

          {activeTab === 'store' && (
            <div style={{ minHeight: '380px' }}>
              <Suspense fallback={<StorePlaceholder />}>
                <StoreCustomization />
              </Suspense>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}