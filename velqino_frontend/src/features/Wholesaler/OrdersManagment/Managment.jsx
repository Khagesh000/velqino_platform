"use client"

import React, { useState, lazy, Suspense, useEffect } from 'react'
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar'
import { useGetOrdersQuery } from '@/redux/wholesaler/slices/ordersSlice'
// Lazy load all non-critical components
const OrdersFilters = lazy(() => import('./components/OrdersFilters'))
const OrdersTable = lazy(() => import('./components/OrdersTable'))
const OrderDetailsPanel = lazy(() => import('./components/OrderDetailsPanel'))
const BulkActions = lazy(() => import('./components/BulkActions'))

// Loading placeholders with EXACT heights to prevent layout shift
const FiltersPlaceholder = () => <div className="w-full h-[120px] bg-gray-50 rounded-xl animate-pulse" />
const TablePlaceholder = () => <div className="w-full h-[500px] bg-gray-50 rounded-xl animate-pulse" />
const DetailsPanelPlaceholder = () => <div className="w-full h-full bg-gray-50 animate-pulse" />
const BulkActionsPlaceholder = () => <div className="w-full h-[200px] bg-gray-50 rounded-xl animate-pulse" />

export default function Management() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { data: ordersData } = useGetOrdersQuery();
  const [activeFilters, setActiveFilters] = useState({});

  // Add this to watch state changes
  useEffect(() => {
    console.log('🔥 selectedOrder changed to:', selectedOrder)
  }, [selectedOrder])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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
              <OrdersFilters 
              onFilterChange={(filters) => {
                setActiveFilters(filters);
                
              }}
              totalOrders={ordersData?.data?.length || 0}
              />
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
              <OrdersTable 
                onSelectOrder={(orderId) => setSelectedOrder(orderId)}
                filters={activeFilters}
              />
            </Suspense>
          </div>

        </div>
      </main>

      {/* Order Details Panel - Right Sidebar - ONLY SHOW WHEN ORDER SELECTED */}
        {selectedOrder && (
  <div className="fixed inset-0 z-50 overflow-hidden">
    <div 
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setSelectedOrder(null)}
    />
    <div className="absolute inset-y-0 right-0 w-full max-w-4xl pt-[56px] pb-[70px] sm:pt-[70px] sm:pb-[56px]">
      <div className="mt-4">  {/* ✅ Add margin-top here */}
        <Suspense fallback={<DetailsPanelPlaceholder />}>
          <OrderDetailsPanel 
            orderId={selectedOrder} 
            onClose={() => setSelectedOrder(null)}
          />
        </Suspense>
      </div>
    </div>
  </div>
)}


    </div>
  )
}
