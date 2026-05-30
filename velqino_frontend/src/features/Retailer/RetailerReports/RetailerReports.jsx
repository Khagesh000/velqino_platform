"use client"

import React, { useState, lazy, Suspense, useCallback, useMemo } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'
import { 
  useGetCOGSQuery,
  useGetExpensesQuery,
  useGetTaxSummaryQuery,
  useGetGSTReturnsQuery,
  useGetScheduledReportsQuery,
  useGetExpenseByCategoryQuery
} from '@/redux/retailer/slices/retailerReportsSlice'

// Lazy load all components
const SalesReport = lazy(() => import('./components/SalesReport'))
const ProductReport = lazy(() => import('./components/ProductReport'))
const CustomerReport = lazy(() => import('./components/CustomerReport'))
const ProfitLoss = lazy(() => import('./components/ProfitLoss'))
const TaxReport = lazy(() => import('./components/TaxReport'))
const StaffPerformance = lazy(() => import('./components/StaffPerformance'))
const ExportOptions = lazy(() => import('./components/ExportOptions'))

// Loading placeholders
const ChartPlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const TablePlaceholder = () => <div className="w-full h-[350px] bg-gray-100 rounded-xl animate-pulse" />
const CardPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerReports() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [dateRange, setDateRange] = useState('month')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // ========== MEMOIZE DATE RANGE STRING ==========
  const getDateRangeString = useCallback(() => {
    const today = new Date()
    switch(dateRange) {
      case 'day':
        return today.toISOString().split('T')[0]
      case 'week':
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        return `${weekStart.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`
      case 'month':
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3) + 1
        return `Q${quarter} ${today.getFullYear()}`
      case 'year':
        return `${today.getFullYear()}`
      default:
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
    }
  }, [dateRange])

  const dateRangeString = useMemo(() => getDateRangeString(), [getDateRangeString])

  // ========== API CALLS WITH SKIP OPTION ==========
  // Only fetch when dateRange changes
  const cogsQuery = useGetCOGSQuery({ period: dateRange }, { refetchOnMountOrArgChange: true })
  const expensesQuery = useGetExpensesQuery({ period: dateRange }, { refetchOnMountOrArgChange: true })
  const expenseCategoryQuery = useGetExpenseByCategoryQuery({ period: dateRange }, { refetchOnMountOrArgChange: true })
  const taxSummaryQuery = useGetTaxSummaryQuery({ period: dateRange }, { refetchOnMountOrArgChange: true })
  const gstReturnsQuery = useGetGSTReturnsQuery({ period: dateRange }, { refetchOnMountOrArgChange: true })
  const scheduledReportsQuery = useGetScheduledReportsQuery(undefined, { refetchOnMountOrArgChange: true })

  // Extract data
  const cogsData = cogsQuery.data?.data
  const expensesData = expensesQuery.data?.data
  const expenseByCategoryData = expenseCategoryQuery.data?.data
  const taxSummaryData = taxSummaryQuery.data?.data
  const gstReturnsData = gstReturnsQuery.data?.data?.returns || []
  const scheduledReportsData = scheduledReportsQuery.data?.data

  // Loading states
  const isLoading = cogsQuery.isLoading || expensesQuery.isLoading || expenseCategoryQuery.isLoading || 
                    taxSummaryQuery.isLoading || gstReturnsQuery.isLoading || scheduledReportsQuery.isLoading

  // Refresh all - only refetch if data exists
  const refreshAll = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
    if (cogsQuery.data) cogsQuery.refetch()
    if (expensesQuery.data) expensesQuery.refetch()
    if (expenseCategoryQuery.data) expenseCategoryQuery.refetch()
    if (taxSummaryQuery.data) taxSummaryQuery.refetch()
    if (gstReturnsQuery.data) gstReturnsQuery.refetch()
    if (scheduledReportsQuery.data) scheduledReportsQuery.refetch()
  }, [cogsQuery, expensesQuery, expenseCategoryQuery, taxSummaryQuery, gstReturnsQuery, scheduledReportsQuery])

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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Track performance and insights</p>
          </div>

          {/* Date Range Selector */}
          <div className="mb-6 flex flex-wrap gap-2">
            {['day', 'week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  dateRange === range ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range === 'day' ? 'Today' : range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : range === 'quarter' ? 'This Quarter' : 'This Year'}
              </button>
            ))}
          </div>

          {/* Loading Overlay - Show only when all data is loading */}
          {isLoading && !cogsData && !expensesData ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <p className="ml-3 text-gray-500">Loading reports data...</p>
            </div>
          ) : (
            <>
              {/* Main Content - 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div style={{ minHeight: '400px' }}>
                  <Suspense fallback={<ChartPlaceholder />}>
                    <SalesReport 
                      dateRange={dateRange}
                      dateRangeString={dateRangeString}
                      onRefresh={refreshAll}
                    />
                  </Suspense>
                </div>
                
                <div style={{ minHeight: '400px' }}>
                  <Suspense fallback={<ChartPlaceholder />}>
                    <ProductReport 
                      dateRange={dateRange}
                      cogsData={cogsData}
                      isLoading={cogsQuery.isLoading}
                      onRefresh={refreshAll}
                    />
                  </Suspense>
                </div>
              </div>

              {/* Second Row - 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div style={{ minHeight: '350px' }}>
                  <Suspense fallback={<CardPlaceholder />}>
                    <CustomerReport 
                      dateRange={dateRange}
                      dateRangeString={dateRangeString}
                      onRefresh={refreshAll}
                    />
                  </Suspense>
                </div>
                
                <div style={{ minHeight: '350px' }}>
                  <Suspense fallback={<CardPlaceholder />}>
                    <ProfitLoss 
                      dateRange={dateRange}
                      expensesData={expensesData}
                      expenseByCategory={expenseByCategoryData}
                      cogsData={cogsData}
                      isLoading={expensesQuery.isLoading || expenseCategoryQuery.isLoading || cogsQuery.isLoading}
                      onRefresh={refreshAll}
                    />
                  </Suspense>
                </div>
              </div>

              {/* Third Row - 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div style={{ minHeight: '300px' }}>
                  <Suspense fallback={<TablePlaceholder />}>
                    <TaxReport 
                      dateRange={dateRange}
                      taxSummary={taxSummaryData}
                      gstReturns={gstReturnsData}
                      isLoading={taxSummaryQuery.isLoading || gstReturnsQuery.isLoading}
                      onRefresh={refreshAll}
                    />
                  </Suspense>
                </div>
                
                <div style={{ minHeight: '300px' }}>
                  <Suspense fallback={<TablePlaceholder />}>
                    <StaffPerformance 
                      dateRange={dateRange}
                      onRefresh={refreshAll}
                    />
                  </Suspense>
                </div>
              </div>

              {/* Export Options */}
              <div style={{ minHeight: '150px' }}>
                <Suspense fallback={<CardPlaceholder />}>
                  <ExportOptions 
                    onRefresh={refreshAll}
                    dateRange={dateRange}
                    scheduledReports={scheduledReportsData}
                    isLoading={scheduledReportsQuery.isLoading}
                  />
                </Suspense>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}