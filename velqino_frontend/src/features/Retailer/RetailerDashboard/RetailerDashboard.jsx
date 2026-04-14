"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from './components/RetailerNavbar'
import RetailerKPIStatsCards from './components/RetailerKPIStatsCards'
import RetailerQuickActionsRow from './Components/RetailerQuickActionsRow' 

// Lazy load all non-critical components
const DailySalesChart = lazy(() => import('./Components/DailySalesChart'))
const TopSellingProducts = lazy(() => import('./Components/TopSellingProducts'))
const RecentTransactions = lazy(() => import('./Components/RecentTransactions'))
const LowStockAlerts = lazy(() => import('./Components/LowStockAlerts'))
const CustomerActivity = lazy(() => import('./Components/CustomerActivity'))
const TodaysSummary = lazy(() => import('./Components/TodaysSummary'))
const QuickReorder = lazy(() => import('./Components/QuickReorder')) 

// Loading placeholders with EXACT heights to prevent layout shift
const ChartPlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const ProductsPlaceholder = () => <div className="w-full h-[350px] bg-gray-100 rounded-xl animate-pulse" />
const TablePlaceholder = () => <div className="w-full h-[380px] bg-gray-100 rounded-xl animate-pulse" />
const AlertPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />
const ActivityPlaceholder = () => <div className="w-full h-[350px] bg-gray-100 rounded-xl animate-pulse" />
const SummaryPlaceholder = () => <div className="w-full h-[200px] bg-gray-100 rounded-xl animate-pulse" />
const ReorderPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="pb-20 lg:pb-0">
      <RetailerNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      {/* Main content with dynamic margin based on sidebar state */}
      <main className={`
        transition-all duration-300 p-4 lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Welcome back, Retail Store</h1>
            <p className="text-sm text-gray-500 mt-1">Monday, April 13, 2026 • 10:30 AM</p>
          </div>

          {/* Critical components load immediately */}
          <RetailerKPIStatsCards />
          
           <div className="mt-6">
            <RetailerQuickActionsRow />
          </div> 

          {/* All components with reserved space - NO LAYOUT SHIFT */}
          <div className="mt-6" style={{ minHeight: '400px' }}>
            <Suspense fallback={<ChartPlaceholder />}>
              <DailySalesChart />
            </Suspense>
          </div> 

           <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<ProductsPlaceholder />}>
                <TopSellingProducts />
              </Suspense>
            </div>
          <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<ActivityPlaceholder />}>
                <CustomerActivity />
              </Suspense>
            </div> 
          </div>

          <div className="mt-6" style={{ minHeight: '380px' }}>
            <Suspense fallback={<TablePlaceholder />}>
              <RecentTransactions />
            </Suspense>
          </div> 

          <div className="mt-6" style={{ minHeight: '300px' }}>
            <Suspense fallback={<AlertPlaceholder />}>
              <LowStockAlerts />
            </Suspense>
          </div> 

           <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div style={{ minHeight: '200px' }}>
              <Suspense fallback={<SummaryPlaceholder />}>
                <TodaysSummary />
              </Suspense>
            </div>
            <div style={{ minHeight: '300px' }}>
              <Suspense fallback={<ReorderPlaceholder />}>
                <QuickReorder />
              </Suspense>
            </div> 
          </div>  
        </div>
      </main>
    </div>
  )
}