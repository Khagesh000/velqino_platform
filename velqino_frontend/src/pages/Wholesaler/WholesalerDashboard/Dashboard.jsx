"use client"

import React, { useState } from 'react'
import WholesaleNavbar from './components/WholesaleNavbar'
import KPIStatsCards from './components/KPIStatsCards'
import QuickActionsRow from './components/QuickActionsRow'
import SalesAnalyticsChart from './components/SalesAnalyticsChart'
import CategoryPerformance from './components/CategoryPerformance'
import RecentOrdersTable from './components/RecentOrdersTable'
import LowStockAlerts from './components/LowStockAlerts'
import RecentActivityFeed from './components/RecentActivityFeed'

export default function HomePage() {
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
        <KPIStatsCards />
        <div className="mt-6">
        <QuickActionsRow />
        </div>
        <div className="mt-6">
        <SalesAnalyticsChart />
        </div>
        <div className="mt-6">
        <CategoryPerformance />
        </div>
        <div className="mt-6">
        <RecentOrdersTable />
        </div>
        <div className="mt-6">
        <LowStockAlerts />
        </div>
        <div className="mt-6">
        <RecentActivityFeed />
        </div>
      </div>
      </main>
    </div>
  )
}