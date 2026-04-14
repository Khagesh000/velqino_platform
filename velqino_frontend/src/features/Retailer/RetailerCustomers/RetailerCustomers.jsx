"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'

// Lazy load all components
const CustomersList = lazy(() => import('./Components/CustomersList'))
const LoyaltyProgram = lazy(() => import('./Components/LoyaltyProgram'))
const CustomerDetails = lazy(() => import('./Components/CustomerDetails'))
const WalkInTracker = lazy(() => import('./Components/WalkInTracker'))
const FeedbackReviews = lazy(() => import('./Components/FeedbackReviews'))
const BirthdayAnniversary = lazy(() => import('./Components/BirthdayAnniversary'))
const QuickActions = lazy(() => import('./Components/QuickActions')) 

// Loading placeholders
const TablePlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const CardPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[250px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerCustomers() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-sm text-gray-500 mt-1">Manage customer relationships and loyalty</p>
          </div>

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Customers List (2/3 width) */}
            <div className="lg:col-span-2">
              <div style={{ minHeight: '500px' }}>
                <Suspense fallback={<TablePlaceholder />}>
                  <CustomersList 
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                    refreshTrigger={refreshTrigger}
                  />
                </Suspense>
              </div>
            </div>

            {/* Right Column - Customer Details & Quick Actions (1/3 width) */}
            <div className="space-y-6">
              <div style={{ minHeight: '350px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <CustomerDetails selectedCustomer={selectedCustomer} />
                </Suspense>
              </div> 
              <div style={{ minHeight: '200px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <QuickActions selectedCustomer={selectedCustomer} />
                </Suspense>
              </div> 
            </div>

          </div>

          {/* Bottom Section - 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
           <div style={{ minHeight: '300px' }}>
              <Suspense fallback={<CardPlaceholder />}>
                <LoyaltyProgram selectedCustomer={selectedCustomer} />
              </Suspense>
            </div> 
            
            <div style={{ minHeight: '300px' }}>
              <Suspense fallback={<CardPlaceholder />}>
                <WalkInTracker />
              </Suspense>
            </div> 
            
            <div className="space-y-6">
              <div style={{ minHeight: '250px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <FeedbackReviews selectedCustomer={selectedCustomer} />
                </Suspense>
              </div> 
              <div style={{ minHeight: '200px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <BirthdayAnniversary />
                </Suspense>
              </div> 
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}