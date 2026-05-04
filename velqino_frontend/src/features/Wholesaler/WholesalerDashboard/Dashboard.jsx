"use client"

import React, { useState, lazy, Suspense } from 'react'
import WholesaleNavbar from './components/WholesaleNavbar'
import { useGetWholesalerStatsQuery } from '@/redux/wholesaler/slices/statsSlice'
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice'
import { useGetOrdersQuery } from '@/redux/wholesaler/slices/ordersSlice'
import { useGetSalesAnalyticsQuery } from '@/redux/wholesaler/slices/statsSlice'
import { useGetCategoryPerformanceQuery } from '@/redux/wholesaler/slices/statsSlice'
import { useGetRecentOrdersQuery } from '@/redux/wholesaler/slices/statsSlice'
import { useGetLowStockAlertsQuery } from '@/redux/wholesaler/slices/statsSlice'
import { useGetRecentActivityQuery } from '@/redux/wholesaler/slices/statsSlice'
import { useGetTopCustomersQuery } from '@/redux/wholesaler/slices/statsSlice'
import { useGetPendingTasksQuery } from '@/redux/wholesaler/slices/statsSlice'
import { useGetOrderStatsQuery } from '@/redux/wholesaler/slices/statsSlice'

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

  // Fetch data ONCE at parent level
  const { data: statsData, isLoading: statsLoading } = useGetWholesalerStatsQuery()
  const { data: productsData } = useGetProductsQuery({ per_page: 100 })
  const { data: ordersData } = useGetOrdersQuery({ per_page: 100 })
  const { data: salesData, isLoading: salesLoading } = useGetSalesAnalyticsQuery(chartPeriod)
  const { data: categoryData } = useGetCategoryPerformanceQuery()
  const { data: recentOrdersData } = useGetRecentOrdersQuery({ page: ordersPage, per_page: 10 })
  const { data: lowStockData, isLoading: lowStockLoading, refetch: refetchLowStock  } = useGetLowStockAlertsQuery({ page: lowStockPage, per_page: 8 })
  const { data: activityData } = useGetRecentActivityQuery({ page: activityPage, per_page: 8 })
  const { data: topCustomersData, isLoading: customersLoading } = useGetTopCustomersQuery({ page: customersPage, per_page: 6 })
  const { data: pendingTasksData } = useGetPendingTasksQuery({ page: tasksPage, per_page: 8, type: activeTab })
  const { data: orderStatsData } = useGetOrderStatsQuery()

  // Extract data for children
  const stats = statsData?.data || {}
  const products = productsData?.data?.products || []
  const orders = ordersData?.data || []
  const salesChart = salesData?.data || {}
  const categories = categoryData?.data || {}
  const recentOrders = recentOrdersData?.data || []
  const lowStockItems = lowStockData?.data || []
  const activities = activityData?.data || []
  const topCustomers = topCustomersData?.data || []
  const pendingTasks = pendingTasksData?.data || []
  const orderStats = orderStatsData?.data || {}
  
  // Pagination metadata
  const ordersTotalPages = recentOrdersData?.total_pages || 1
  const lowStockTotalPages = lowStockData?.total_pages || 1
  const activityTotalPages = activityData?.total_pages || 1
  const customersTotalPages = topCustomersData?.total_pages || 1
  const tasksTotalPages = pendingTasksData?.total_pages || 1
  const customersTotalSpent = topCustomersData?.total_spent || '₹0'
  const customersGrowth = topCustomersData?.growth || '0%'
  const customersTotalCount = topCustomersData?.count || 0
  const tasksStats = pendingTasksData?.stats || {}

  return (
    <div className="pb-20">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`transition-all duration-300 p-4 lg:p-6 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Critical components - load immediately */}
          <KPIStatsCards stats={stats} isLoading={statsLoading} />
          
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
                isLoading={salesLoading} 
                activePeriod={chartPeriod} 
                onPeriodChange={handleChartPeriodChange}  
              />
            </Suspense>
          </div>

          <div className="mt-6" style={{ minHeight: '350px' }}>
            <Suspense fallback={<CategoryPlaceholder />}>
              <CategoryPerformance data={categories} />
            </Suspense>
          </div>

          <div className="mt-6" style={{ minHeight: '380px' }}>
            <Suspense fallback={<TablePlaceholder />}>
              <RecentOrdersTable 
                orders={recentOrders} 
                isLoading={statsLoading}
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
                isLoading={statsLoading}
                currentPage={lowStockPage}
                totalPages={lowStockTotalPages}
                onPageChange={handleLowStockPageChange}
                refetch={refetchLowStock}
              />
            </Suspense>
          </div>

          <div className="mt-6" style={{ minHeight: '400px' }}>
            <Suspense fallback={<ActivityPlaceholder />}>
              <RecentActivityFeed 
                activities={activities}
                isLoading={statsLoading}
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
                isLoading={customersLoading}
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
                isLoading={statsLoading}
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
                isLoading={statsLoading}
              />
            </Suspense>
          </div>
          
        </div>
      </main>
    </div>
  )
}
