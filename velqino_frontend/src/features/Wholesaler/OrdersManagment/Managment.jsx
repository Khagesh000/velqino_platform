"use client"

import React, { useState, lazy, Suspense, useEffect } from 'react'
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar'

// Lazy load all non-critical components
const OrdersFilters = lazy(() => import('./Components/OrdersFilters'))
const OrdersTable = lazy(() => import('./Components/OrdersTable'))
const OrderDetailsPanel = lazy(() => import('./Components/OrderDetailsPanel'))
const BulkActions = lazy(() => import('./Components/BulkActions'))

// Loading placeholders with EXACT heights to prevent layout shift
const FiltersPlaceholder = () => <div className="w-full h-[120px] bg-gray-50 rounded-xl animate-pulse" />
const TablePlaceholder = () => <div className="w-full h-[500px] bg-gray-50 rounded-xl animate-pulse" />
const DetailsPanelPlaceholder = () => <div className="w-full h-full bg-gray-50 animate-pulse" />
const BulkActionsPlaceholder = () => <div className="w-full h-[200px] bg-gray-50 rounded-xl animate-pulse" />

export default function Management() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Add this to watch state changes
  useEffect(() => {
    console.log('🔥 selectedOrder changed to:', selectedOrder)
  }, [selectedOrder])

  return (
    <div className="min-h-screen bg-gray-50">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      {/* Main content with dynamic margin based on sidebar state */}
      <main className={`
        transition-all duration-300 p-3 sm:p-4 lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto">
          
          {/* Filters Section */}
          <div style={{ minHeight: '120px' }}>
            <Suspense fallback={<FiltersPlaceholder />}>
              <OrdersFilters />
            </Suspense>
          </div>

          {/* Bulk Actions - MOVED INSIDE main AND before table */}
          <div className="mt-4 sm:mt-6" style={{ minHeight: '200px' }}>
            <Suspense fallback={<BulkActionsPlaceholder />}>
              <BulkActions 
                selectedCount={selectedOrder ? 3 : 0} 
                onActionComplete={(result) => {
                  console.log('Bulk action completed:', result)
                }}
              />
            </Suspense>
          </div>

          {/* Orders Table - Full width */}
          <div className="mt-4 sm:mt-6" style={{ minHeight: '500px' }}>
            <Suspense fallback={<TablePlaceholder />}>
              <OrdersTable onSelectOrder={setSelectedOrder} />
            </Suspense>
          </div>

        </div>
      </main>

      {/* Order Details Panel - Right Sidebar - ONLY SHOW WHEN ORDER SELECTED */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => {
              console.log('🟡 Backdrop clicked')
              setSelectedOrder(null)
            }}
          />
          
          {/* Panel */}
          <div className="absolute inset-y-0 right-0 w-full sm:w-[480px] md:w-[560px] lg:w-[640px] xl:w-[720px]">
            <Suspense fallback={<DetailsPanelPlaceholder />}>
              <OrderDetailsPanel 
                order={selectedOrder} 
                onClose={() => {
                  console.log('🟢 onClose called from panel')
                  setSelectedOrder(null)
                }}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  )
}