"use client"

import React, { useState, lazy, Suspense } from 'react'
import WholesaleNavbar from './components/WholesaleNavbar'
import KPIStatsCards from './components/KPIStatsCards'
import QuickActionsRow from './components/QuickActionsRow'

// Lazy load all non-critical components
const SalesAnalyticsChart = lazy(() => import('./components/SalesAnalyticsChart'))
const CategoryPerformance = lazy(() => import('./components/CategoryPerformance'))
const RecentOrdersTable = lazy(() => import('./components/RecentOrdersTable'))
const LowStockAlerts = lazy(() => import('./components/LowStockAlerts'))
const RecentActivityFeed = lazy(() => import('./components/RecentActivityFeed'))
const TopCustomersList = lazy(() => import('./components/TopCustomersList'))
const PendingTasks = lazy(() => import('./components/PendingTasks'))
const QuickInsights = lazy(() => import('./components/QuickInsights'))

// Loading placeholders with EXACT heights to prevent layout shift
const ChartPlaceholder = () => <div className="w-full h-[400px]" /> 
const CategoryPlaceholder = () => <div className="w-full h-[350px]" /> 
const TablePlaceholder = () => <div className="w-full h-[380px]" /> 
const AlertPlaceholder = () => <div className="w-full h-[300px]" /> 
const ActivityPlaceholder = () => <div className="w-full h-[400px]" /> 
const CustomersPlaceholder = () => <div className="w-full h-[350px]" /> 
const TasksPlaceholder = () => <div className="w-full h-[350px]" /> 
const InsightsPlaceholder = () => <div className="w-full h-[300px]" /> 

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div>
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      {/* Main content with dynamic margin based on sidebar state */}
      <main className={`
        transition-all duration-300 p-4 lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto">
          {/* Critical components load immediately */}
          <KPIStatsCards />
          
          <div className="mt-6">
  <QuickActionsRow />
</div>

{/* All components with reserved space - NO LAYOUT SHIFT */}
<div className="mt-6" style={{ minHeight: '400px' }}>
  <Suspense fallback={<ChartPlaceholder />}>
    <SalesAnalyticsChart />
  </Suspense>
</div>

<div className="mt-6" style={{ minHeight: '350px' }}>
  <Suspense fallback={<CategoryPlaceholder />}>
    <CategoryPerformance />
  </Suspense>
</div>

<div className="mt-6" style={{ minHeight: '380px' }}>
  <Suspense fallback={<TablePlaceholder />}>
    <RecentOrdersTable />
  </Suspense>
</div>

<div className="mt-6" style={{ minHeight: '300px' }}>
  <Suspense fallback={<AlertPlaceholder />}>
    <LowStockAlerts />
  </Suspense>
</div>

<div className="mt-6" style={{ minHeight: '400px' }}>
  <Suspense fallback={<ActivityPlaceholder />}>
    <RecentActivityFeed />
  </Suspense>
</div>

<div className="mt-6" style={{ minHeight: '350px' }}>
  <Suspense fallback={<CustomersPlaceholder />}>
    <TopCustomersList />
  </Suspense>
</div>

<div className="mt-6" style={{ minHeight: '350px' }}>
  <Suspense fallback={<TasksPlaceholder />}>
    <PendingTasks />
  </Suspense>
</div>

<div className="mt-6" style={{ minHeight: '300px' }}>
  <Suspense fallback={<InsightsPlaceholder />}>
    <QuickInsights />
  </Suspense>
</div>
        </div>
      </main>
    </div>
  )
}