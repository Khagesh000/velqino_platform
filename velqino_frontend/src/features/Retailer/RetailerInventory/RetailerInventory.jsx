"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'

// Lazy load all components
const StockOverview = lazy(() => import('./Components/StockOverview'))
const StockMovement = lazy(() => import('./Components/StockMovement'))
const ReorderList = lazy(() => import('./Components/ReorderList'))
const SupplierInfo = lazy(() => import('./Components/SupplierInfo'))
const StockTake = lazy(() => import('./Components/StockTake'))
const ExpiryTracking = lazy(() => import('./Components/ExpiryTracking'))
const InwardStock = lazy(() => import('./Components/InwardStock')) 

// Loading placeholders
const CardPlaceholder = () => <div className="w-full h-[180px] bg-gray-100 rounded-xl animate-pulse" />
const TablePlaceholder = () => <div className="w-full h-[350px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerInventory() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage your stock</p>
          </div>

          {/* Stock Overview Cards */}
          <div className="mb-6">
            <Suspense fallback={<CardPlaceholder />}>
              <StockOverview refreshTrigger={refreshTrigger} />
            </Suspense>
          </div>

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Left Column - Stock Movement (2/3 width) */}
            <div className="lg:col-span-2">
             <div style={{ minHeight: '400px' }}>
                <Suspense fallback={<TablePlaceholder />}>
                  <StockMovement />
                </Suspense>
              </div> 
            </div>

            {/* Right Column - Reorder List (1/3 width) */}
           <div style={{ minHeight: '400px' }}>
              <Suspense fallback={<SidebarPlaceholder />}>
                <ReorderList onReorder={() => setRefreshTrigger(prev => prev + 1)} />
              </Suspense>
            </div> 

          </div>

          {/* Bottom Section - 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
           <div style={{ minHeight: '300px' }}>
              <Suspense fallback={<SidebarPlaceholder />}>
                <SupplierInfo />
              </Suspense>
            </div> 
            
           <div style={{ minHeight: '300px' }}>
              <Suspense fallback={<SidebarPlaceholder />}>
                <StockTake onComplete={() => setRefreshTrigger(prev => prev + 1)} />
              </Suspense>
            </div> 
            
            <div className="space-y-6">
             <div style={{ minHeight: '250px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <ExpiryTracking />
                </Suspense>
              </div> 
              <div style={{ minHeight: '200px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <InwardStock onComplete={() => setRefreshTrigger(prev => prev + 1)} />
                </Suspense>
              </div> 
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}