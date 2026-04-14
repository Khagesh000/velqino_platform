"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'

// Lazy load all components
const OrdersTable = lazy(() => import('./Components/OrdersTable'))
const OrderStatus = lazy(() => import('./Components/OrderStatus'))
const OrderDetails = lazy(() => import('./Components/OrderDetails'))
const ReturnsManagement = lazy(() => import('./Components/ReturnsManagement'))
const OrderHistory = lazy(() => import('./Components/OrderHistory'))
const BulkActions = lazy(() => import('./Components/BulkActions')) 

// Loading placeholders
const TablePlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const DetailsPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[250px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerOrders() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage all customer orders</p>
          </div>

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Orders Table (2/3 width) */}
            <div className="lg:col-span-2">
              <div style={{ minHeight: '500px' }}>
                <Suspense fallback={<TablePlaceholder />}>
                  <OrdersTable 
                    selectedOrder={selectedOrder}
                    setSelectedOrder={setSelectedOrder}
                    refreshTrigger={refreshTrigger}
                  />
                </Suspense>
              </div>
            </div>

            {/* Right Column - Order Status & Details (1/3 width) */}
            <div className="space-y-6">
              <div style={{ minHeight: '400px' }}>
                <Suspense fallback={<DetailsPlaceholder />}>
                  <OrderStatus 
                    selectedOrder={selectedOrder}
                    onStatusUpdate={() => setRefreshTrigger(prev => prev + 1)}
                  />
                </Suspense>
              </div>
              
             <div style={{ minHeight: '250px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <OrderDetails selectedOrder={selectedOrder} />
                </Suspense>
              </div> 
            </div>

          </div>

          {/* Bottom Section - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            
           <div style={{ minHeight: '300px' }}>
              <Suspense fallback={<SidebarPlaceholder />}>
                <ReturnsManagement selectedOrder={selectedOrder} />
              </Suspense>
            </div> 
            
            <div className="space-y-6">
             <div style={{ minHeight: '200px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <BulkActions 
                    selectedOrders={selectedOrder ? [selectedOrder] : []}
                    onComplete={() => setRefreshTrigger(prev => prev + 1)}
                  />
                </Suspense>
              </div> 
              
             <div style={{ minHeight: '250px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <OrderHistory selectedOrder={selectedOrder} />
                </Suspense>
              </div> 
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}