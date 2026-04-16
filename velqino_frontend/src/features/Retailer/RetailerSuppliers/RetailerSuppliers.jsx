"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'

// Lazy load all components
const SuppliersList = lazy(() => import('./Components/SuppliersList'))
const SupplierDetails = lazy(() => import('./Components/SupplierDetails'))
const PurchaseOrders = lazy(() => import('./Components/PurchaseOrders'))
const ReorderSuggestions = lazy(() => import('./Components/ReorderSuggestions'))
const PaymentTracking = lazy(() => import('./Components/PaymentTracking'))

// Loading placeholders
const TablePlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[350px] bg-gray-100 rounded-xl animate-pulse" />
const CardPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerSuppliers() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Supplier Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage suppliers and purchase orders</p>
          </div>

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Left Column - Suppliers List (2/3 width) */}
            <div className="lg:col-span-2 h-full">
              <div style={{ minHeight: '500px' }}>
                <Suspense fallback={<TablePlaceholder />}>
                  <SuppliersList 
                    selectedSupplier={selectedSupplier}
                    setSelectedSupplier={setSelectedSupplier}
                    refreshTrigger={refreshTrigger}
                  />
                </Suspense>
              </div>
            </div>

            {/* Right Column - Supplier Details (1/3 width) */}
            <div className="h-full">
              <div style={{ minHeight: '500px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <SupplierDetails selectedSupplier={selectedSupplier} />
                </Suspense>
              </div>
            </div>

          </div>

          {/* Bottom Section - 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="h-full">
              <div style={{ minHeight: '350px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <PurchaseOrders selectedSupplier={selectedSupplier} />
                </Suspense>
              </div>
            </div>
            
            <div className="h-full">
              <div style={{ minHeight: '350px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <ReorderSuggestions />
                </Suspense>
              </div>
            </div>
            
            <div className="h-full">
              <div style={{ minHeight: '350px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <PaymentTracking selectedSupplier={selectedSupplier} />
                </Suspense>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}