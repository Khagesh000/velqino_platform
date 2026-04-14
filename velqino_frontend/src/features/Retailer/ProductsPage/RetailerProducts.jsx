"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'

// Lazy load all components
const ProductsGrid = lazy(() => import('./Components/ProductsGrid'))
const QuickActionsBar = lazy(() => import('./Components/QuickActionsBar'))
const StockAlerts = lazy(() => import('./Components/StockAlerts'))
const Categories = lazy(() => import('./Components/Categories'))
const ProductDetails = lazy(() => import('./Components/ProductDetails'))
const BulkPriceUpdate = lazy(() => import('./Components/BulkPriceUpdate'))
const BarcodePrinting = lazy(() => import('./Components/BarcodePrinting')) 

// Loading placeholders
const GridPlaceholder = () => <div className="w-full h-[500px] bg-gray-100 rounded-xl animate-pulse" />
const SidebarPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />
const AlertsPlaceholder = () => <div className="w-full h-[150px] bg-gray-100 rounded-xl animate-pulse" /> 

export default function RetailerProducts() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
          </div>

          {/* Quick Actions Bar */}
          <div className="mb-6" style={{ minHeight: '80px' }}>
            <Suspense fallback={<AlertsPlaceholder />}>
              <QuickActionsBar />
            </Suspense>
          </div> 

          {/* Stock Alerts */}
          <div className="mb-6" style={{ minHeight: '100px' }}>
            <Suspense fallback={<AlertsPlaceholder />}>
              <StockAlerts />
            </Suspense>
          </div> 

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Column - Categories (1/4 width) */}
            <div className="lg:col-span-1">
              <div style={{ minHeight: '400px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <Categories />
                </Suspense>
              </div>
            </div> 

            {/* Right Column - Products Grid (3/4 width) */}
            <div className="lg:col-span-3">
              <div style={{ minHeight: '500px' }}>
                <Suspense fallback={<GridPlaceholder />}>
                  <ProductsGrid 
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    refreshTrigger={refreshTrigger}
                  />
                </Suspense>
              </div>
            </div>

          </div>

          {/* Bottom Section - 3 Columns */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<SidebarPlaceholder />}>
                <ProductDetails selectedProduct={selectedProduct} />
              </Suspense>
            </div>
            
           <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<SidebarPlaceholder />}>
                <BulkPriceUpdate onComplete={() => setRefreshTrigger(prev => prev + 1)} />
              </Suspense>
            </div> 
            
           <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<SidebarPlaceholder />}>
                <BarcodePrinting />
              </Suspense>
            </div> 

          </div> 
        </div>
      </main>
    </div>
  )
}