"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'

// Lazy load all components
const StoreProfile = lazy(() => import('./Components/StoreProfile'))
const PosSettings = lazy(() => import('./Components/PosSettings'))
const TaxSettings = lazy(() => import('./Components/TaxSettings'))
const DiscountSettings = lazy(() => import('./Components/DiscountSettings'))
const ReceiptCustomization = lazy(() => import('./Components/ReceiptCustomization'))
const BackupRestore = lazy(() => import('./Components/BackupRestore'))
const StaffAccess = lazy(() => import('./Components/StaffAccess'))
const NotificationPreferences = lazy(() => import('./Components/NotificationPreferences'))

// Loading placeholders
const CardPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[250px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerSettings() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const settingsTabs = [
    { id: 'profile', label: 'Store Profile', icon: '🏪' },
    { id: 'pos', label: 'POS Settings', icon: '🖨️' },
    { id: 'tax', label: 'Tax Settings', icon: '📊' },
    { id: 'discount', label: 'Discount Settings', icon: '🏷️' },
    { id: 'receipt', label: 'Receipt Customization', icon: '🧾' },
    { id: 'backup', label: 'Backup & Restore', icon: '💾' },
    { id: 'staff', label: 'Staff Access', icon: '🔐' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <RetailerNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`
        transition-all duration-300 p-4 lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your store settings and preferences</p>
          </div>

          {/* Settings Tabs */}
          <div className="flex overflow-x-auto gap-1 mb-6 pb-2 border-b border-gray-200">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Main Settings Form (2/3 width) */}
            <div className="lg:col-span-2">
              <div style={{ minHeight: '500px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  {activeTab === 'profile' && <StoreProfile />}
                  {activeTab === 'pos' && <PosSettings />}
                  {activeTab === 'tax' && <TaxSettings />}
                  {activeTab === 'discount' && <DiscountSettings />}
                  {activeTab === 'receipt' && <ReceiptCustomization />}
                  {activeTab === 'backup' && <BackupRestore />}
                  {activeTab === 'staff' && <StaffAccess />}
                  {activeTab === 'notifications' && <NotificationPreferences />}
                </Suspense>
              </div>
            </div>

            {/* Right Column - Help/Info Sidebar (1/3 width) */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Need Help?</h4>
                <p className="text-xs text-blue-600 mb-3">Configure your store settings correctly to ensure smooth operations.</p>
                <button className="text-xs text-blue-700 font-medium">Contact Support →</button>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">📋 Quick Tips</h4>
                <ul className="text-xs text-gray-600 space-y-1.5">
                  <li>• Update GST rates as per government regulations</li>
                  <li>• Test receipt printer before going live</li>
                  <li>• Take regular backups of your data</li>
                  <li>• Set up staff access with proper permissions</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}