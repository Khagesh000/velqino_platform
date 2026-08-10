"use client"

import React, { useState, lazy, Suspense, useEffect } from 'react'
import WholesaleNavbar from './components/WholesaleNavbar'
import { useGetWholesalerDashboardQuery } from '@/redux/wholesaler/slices/statsSlice'

// Lazy load components
import KPIStatsCards from './components/KPIStatsCards'
import QuickActionsRow from './components/QuickActionsRow'
const SalesAnalyticsChart = lazy(() => import('./components/SalesAnalyticsChart'))
const CategoryPerformance = lazy(() => import('./components/CategoryPerformance'))
const RecentOrdersTable = lazy(() => import('./components/RecentOrdersTable'))
const LowStockAlerts = lazy(() => import('./components/LowStockAlerts'))
const RecentActivityFeed = lazy(() => import('./components/RecentActivityFeed'))
const TopCustomersList = lazy(() => import('./components/TopCustomersList'))
const PendingTasks = lazy(() => import('./components/PendingTasks'))
const QuickInsights = lazy(() => import('./components/QuickInsights'))

// Placeholders
const ChartPlaceholder = () => <div className="w-full h-[400px] animate-pulse bg-gray-100 rounded-xl" />
const CategoryPlaceholder = () => <div className="w-full h-[350px] animate-pulse bg-gray-100 rounded-xl" />
const TablePlaceholder = () => <div className="w-full h-[380px] animate-pulse bg-gray-100 rounded-xl" />
const AlertPlaceholder = () => <div className="w-full h-[300px] animate-pulse bg-gray-100 rounded-xl" />
const ActivityPlaceholder = () => <div className="w-full h-[400px] animate-pulse bg-gray-100 rounded-xl" />
const CustomersPlaceholder = () => <div className="w-full h-[350px] animate-pulse bg-gray-100 rounded-xl" />
const TasksPlaceholder = () => <div className="w-full h-[350px] animate-pulse bg-gray-100 rounded-xl" />
const InsightsPlaceholder = () => <div className="w-full h-[300px] animate-pulse bg-gray-100 rounded-xl" />

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Pagination state variables
  const [ordersPage, setOrdersPage] = useState(1)
  const [lowStockPage, setLowStockPage] = useState(1)
  const [activityPage, setActivityPage] = useState(1)
  const [customersPage, setCustomersPage] = useState(1)
  const [tasksPage, setTasksPage] = useState(1)
  const [activeTab, setActiveTab] = useState('all')
  const [chartPeriod, setChartPeriod] = useState('weekly')

  // Pagination handlers
  const handleOrdersPageChange = (page) => setOrdersPage(page)
  const handleLowStockPageChange = (page) => setLowStockPage(page)
  const handleActivityPageChange = (page) => setActivityPage(page)
  const handleCustomersPageChange = (page) => setCustomersPage(page)
  const handleTasksPageChange = (page) => setTasksPage(page)
  const handleTabChange = (tab) => setActiveTab(tab)
  const handleChartPeriodChange = (period) => setChartPeriod(period)

  // ✅ SINGLE API CALL — replaces all 9 separate calls
  const { 
    data: dashboardData, 
    isLoading: dashboardLoading, 
    isFetching: dashboardFetching 
  } = useGetWholesalerDashboardQuery()

  // ✅ Store only pending_orders and total_customers in localStorage
  useEffect(() => {
    if (dashboardData?.data?.stats) {
      const stats = dashboardData.data.stats;
      localStorage.setItem('wholesaler_pending_orders', stats.pending_orders || 0);
      localStorage.setItem('wholesaler_customers_count', stats.total_customers || 0);
    }
  }, [dashboardData]);

  // Single loading flag for ALL components
  const isLoading = dashboardLoading || dashboardFetching

  // Extract ALL data from single response
  const dashboard = dashboardData?.data || {}
  
  const stats = dashboard.stats || {}
  const products = dashboard.products || []
  const orders = dashboard.orders || []
  const salesChart = dashboard.salesAnalytics || {}
  const categories = dashboard.categoryPerformance || []
  const recentOrders = dashboard.recentOrders || []
  const lowStockItems = dashboard.lowStockAlerts || []
  const activities = dashboard.recentActivity || []
  const topCustomers = dashboard.topCustomers || []
  const pendingTasks = dashboard.pendingTasks || []
  const orderStats = dashboard.orderStats || {}
  const quickInsights = dashboard.quickInsights || {}
  
  // Pagination metadata (keep for future use)
  const ordersTotalPages = 1
  const lowStockTotalPages = 1
  const activityTotalPages = 1
  const customersTotalPages = 1
  const tasksTotalPages = 1
  const customersTotalSpent = '₹0'
  const customersGrowth = '0%'
  const customersTotalCount = 0
  const tasksStats = {}

  return (
    <div className="pb-20">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`transition-all duration-300 p-4 lg:p-6 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Critical components - load immediately */}
          <KPIStatsCards stats={stats} isLoading={isLoading} />
          
          <div className="mt-6">
            <QuickActionsRow 
              products={products} 
              orders={orders} 
              stats={stats} 
            />
          </div>

          {/* Lazy loaded components */}
          <div className="mt-6" style={{ minHeight: '400px' }}>
            <Suspense fallback={<ChartPlaceholder />}>
              <SalesAnalyticsChart 
                data={salesChart} 
                isLoading={isLoading} 
                activePeriod={chartPeriod} 
                onPeriodChange={handleChartPeriodChange}  
              />
            </Suspense>
          </div>

          <div className="mt-6" style={{ minHeight: '350px' }}>
            <Suspense fallback={<CategoryPlaceholder />}>
              <CategoryPerformance data={categories} isLoading={isLoading} />
            </Suspense>
          </div>

          <div className="mt-6" style={{ minHeight: '380px' }}>
            <Suspense fallback={<TablePlaceholder />}>
              <RecentOrdersTable 
                orders={recentOrders} 
                isLoading={isLoading}
                currentPage={ordersPage}
                totalPages={ordersTotalPages}
                onPageChange={handleOrdersPageChange}
              />
            </Suspense>
          </div>

          <div className="mt-6" style={{ minHeight: '300px' }}>
            <Suspense fallback={<AlertPlaceholder />}>
              <LowStockAlerts 
                items={lowStockItems}
                isLoading={isLoading}
                currentPage={lowStockPage}
                totalPages={lowStockTotalPages}
                onPageChange={handleLowStockPageChange}
              />
            </Suspense>
          </div>

          <div className="mt-6" style={{ minHeight: '400px' }}>
            <Suspense fallback={<ActivityPlaceholder />}>
              <RecentActivityFeed 
                activities={activities}
                isLoading={isLoading}
                currentPage={activityPage}
                totalPages={activityTotalPages}
                onPageChange={handleActivityPageChange}
              />
            </Suspense>
          </div>

          <div className="mt-6" style={{ minHeight: '350px' }}>
            <Suspense fallback={<CustomersPlaceholder />}>
              <TopCustomersList 
                customers={topCustomers} 
                isLoading={isLoading}
                currentPage={customersPage}
                totalPages={customersTotalPages}
                totalCount={customersTotalCount}
                totalSpent={customersTotalSpent}
                growth={customersGrowth}
                onPageChange={handleCustomersPageChange}
              />
            </Suspense>
          </div>

          <div className="mt-6" style={{ minHeight: '350px' }}>
            <Suspense fallback={<TasksPlaceholder />}>
              <PendingTasks 
                tasks={pendingTasks}
                isLoading={isLoading}
                activeTab={activeTab}
                currentPage={tasksPage}
                totalPages={tasksTotalPages}
                stats={tasksStats}
                onTabChange={handleTabChange}
                onPageChange={handleTasksPageChange}
              />
            </Suspense>
          </div>

          <div className="mt-6" style={{ minHeight: '300px' }}>
            <Suspense fallback={<InsightsPlaceholder />}>
              <QuickInsights 
                stats={stats} 
                orderStats={orderStats} 
                isLoading={isLoading}
              />
            </Suspense>
          </div>
          
        </div>
      </main>
    </div>
  )
}