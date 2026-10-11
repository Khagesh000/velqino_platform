"use client"

import React, { useState, lazy, Suspense, useCallback, useMemo } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'
import { useGetRetailerReportsSummaryQuery } from '@/redux/retailer/slices/retailerReportsSlice'
import { 
  TrendingUp, TrendingDown, DollarSign, Package, Users, 
  FileText, RefreshCw, Calendar, ArrowUpRight, ArrowDownRight,
  PieChart, ShieldCheck, Download, Layers
} from '../../../utils/icons'

// Lazy load child reporting widgets
const SalesReport = lazy(() => import('./components/SalesReport'))
const ProductReport = lazy(() => import('./components/ProductReport'))
const CustomerReport = lazy(() => import('./components/CustomerReport'))
const ProfitLoss = lazy(() => import('./components/ProfitLoss'))
const TaxReport = lazy(() => import('./components/TaxReport'))
const StaffPerformance = lazy(() => import('./components/StaffPerformance'))
const ExportOptions = lazy(() => import('./components/ExportOptions'))

// Skeleton Loading Cards
const CardSkeleton = () => (
  <div className="w-full h-[380px] bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between animate-pulse">
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded-md w-1/3" />
      <div className="h-3 bg-gray-100 rounded-md w-1/2" />
    </div>
    <div className="h-44 bg-gray-50 rounded-xl" />
    <div className="h-4 bg-gray-100 rounded-md w-1/4" />
  </div>
)

export default function RetailerReports() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [dateRange, setDateRange] = useState('month')
  const [activeView, setActiveView] = useState('all')

  // ========== SINGLE CONSOLIDATED BACKEND QUERY ==========
  // Replaces all 7 individual API calls with a single cached request
  const { 
    data: responseData, 
    isLoading, 
    isFetching, 
    refetch 
  } = useGetRetailerReportsSummaryQuery(
    { period: dateRange }, 
    { refetchOnMountOrArgChange: true }
  )

  const summaryData = responseData?.data || {}
  const kpis = summaryData?.kpis || {}

  // Helpers
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(val || 0))
  }

  // Readable period label
  const getDateRangeLabel = useCallback(() => {
    const today = new Date()
    switch (dateRange) {
      case 'day': return 'Today'
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      case 'quarter': return 'This Quarter'
      case 'year': return 'This Year'
      default: return 'Current Period'
    }
  }, [dateRange])

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
        return today.toLocaleString('default', { month: 'long', year: 'numeric' })
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3) + 1
        return `Q${quarter} ${today.getFullYear()}`
      case 'year':
        return `${today.getFullYear()}`
      default:
        return today.toISOString().split('T')[0]
    }
  }, [dateRange])

  const dateRangeString = useMemo(() => getDateRangeString(), [getDateRangeString])

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20 lg:pb-10">
      <RetailerNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`
        transition-all duration-300 p-4 sm:p-6 lg:p-8
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Executive Header Banner */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold">
                  <PieChart size={20} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Executive Reports & Analytics
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Unified revenue, margin analysis, tax filings & team performance for <span className="font-semibold text-gray-700">{dateRangeString}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
              {/* Period Filter Buttons */}
              <div className="flex items-center bg-gray-100/80 p-1 rounded-xl">
                {[
                  { id: 'day', label: 'Today' },
                  { id: 'week', label: 'Week' },
                  { id: 'month', label: 'Month' },
                  { id: 'quarter', label: 'Quarter' },
                  { id: 'year', label: 'Year' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDateRange(item.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      dateRange === item.id 
                        ? 'bg-white text-gray-900 shadow-xs' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Instant Refresh Button */}
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                title="Refresh Report Data"
                className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isFetching ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                <span className="hidden sm:inline">{isFetching ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* Top 6 Financial KPI Highlight Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* 1. Gross Revenue */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Gross Sales</span>
                <span className="w-7 h-7 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <DollarSign size={14} />
                </span>
              </div>
              <p className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                ₹{formatCurrency(kpis.gross_sales)}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[11px]">
                <span className={`inline-flex items-center font-bold ${
                  (kpis.growth_rate || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {(kpis.growth_rate || 0) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(kpis.growth_rate || 0)}%
                </span>
                <span className="text-gray-400 truncate">• {kpis.total_orders || 0} orders</span>
              </div>
            </div>

            {/* 2. Total COGS */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total COGS</span>
                <span className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Package size={14} />
                </span>
              </div>
              <p className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                ₹{formatCurrency(kpis.total_cogs)}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 truncate">
                Product acquisition cost
              </p>
            </div>

            {/* 3. Gross Profit & Margin */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Gross Profit</span>
                <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp size={14} />
                </span>
              </div>
              <p className="text-lg sm:text-xl font-black text-emerald-600 tracking-tight">
                ₹{formatCurrency(kpis.gross_profit)}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[11px]">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  {kpis.gross_margin_pct || 0}%
                </span>
                <span className="text-gray-400">margin</span>
              </div>
            </div>

            {/* 4. Operating Expenses */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Operating Costs</span>
                <span className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ArrowDownRight size={14} />
                </span>
              </div>
              <p className="text-lg sm:text-xl font-black text-rose-600 tracking-tight">
                ₹{formatCurrency(kpis.total_expenses)}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 truncate">
                Rent, wages, utilities
              </p>
            </div>

            {/* 5. Net Operating Profit */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Net Profit</span>
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  (kpis.net_profit || 0) >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  <ShieldCheck size={14} />
                </span>
              </div>
              <p className={`text-lg sm:text-xl font-black tracking-tight ${
                (kpis.net_profit || 0) >= 0 ? 'text-indigo-600' : 'text-rose-600'
              }`}>
                ₹{formatCurrency(kpis.net_profit)}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[11px]">
                <span className={`font-bold px-1.5 py-0.2 rounded ${
                  (kpis.net_profit || 0) >= 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {kpis.net_margin_pct || 0}%
                </span>
                <span className="text-gray-400">net</span>
              </div>
            </div>

            {/* 6. Tax Accrued */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">GST Accrued</span>
                <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FileText size={14} />
                </span>
              </div>
              <p className="text-lg sm:text-xl font-black text-purple-700 tracking-tight">
                ₹{formatCurrency(kpis.total_tax_collected)}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 truncate">
                18% GST collected
              </p>
            </div>
          </div>

          {/* View Filter Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200/80">
            {[
              { id: 'all', label: 'All Reports & Overview', icon: <Layers size={14} /> },
              { id: 'sales', label: 'Sales & Products', icon: <Package size={14} /> },
              { id: 'finance', label: 'P&L & Expenses', icon: <DollarSign size={14} /> },
              { id: 'tax', label: 'Tax & Compliance', icon: <ShieldCheck size={14} /> },
              { id: 'customers', label: 'Customers & Team', icon: <Users size={14} /> },
              { id: 'export', label: 'Export & Automations', icon: <Download size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeView === tab.id
                    ? 'bg-primary-500 text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-100 hover:border-gray-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Grid Layout */}
          {isLoading && !summaryData.kpis ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Row 1: Sales Trends & Product Margins */}
              {(activeView === 'all' || activeView === 'sales') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="min-h-[400px]">
                    <Suspense fallback={<CardSkeleton />}>
                      <SalesReport 
                        dateRange={dateRange}
                        dateRangeString={dateRangeString}
                        salesData={summaryData?.sales_trends}
                        kpisData={summaryData?.kpis}
                        isLoading={isLoading}
                        onRefresh={refetch}
                      />
                    </Suspense>
                  </div>
                  
                  <div className="min-h-[400px]">
                    <Suspense fallback={<CardSkeleton />}>
                      <ProductReport 
                        dateRange={dateRange}
                        cogsData={summaryData?.cogs}
                        isLoading={isLoading}
                        onRefresh={refetch}
                      />
                    </Suspense>
                  </div>
                </div>
              )}

              {/* Row 2: Profit & Loss Statement & Tax Compliance */}
              {(activeView === 'all' || activeView === 'finance') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="min-h-[380px]">
                    <Suspense fallback={<CardSkeleton />}>
                      <ProfitLoss 
                        dateRange={dateRange}
                        expensesData={summaryData?.expenses}
                        expenseByCategory={summaryData?.expenses?.by_category}
                        cogsData={summaryData?.cogs}
                        kpisData={summaryData?.kpis}
                        isLoading={isLoading}
                        onRefresh={refetch}
                      />
                    </Suspense>
                  </div>
                  
                  <div className="min-h-[380px]">
                    <Suspense fallback={<CardSkeleton />}>
                      <TaxReport 
                        dateRange={dateRange}
                        taxSummary={summaryData?.tax_summary}
                        gstReturns={summaryData?.gst_returns}
                        isLoading={isLoading}
                        onRefresh={refetch}
                      />
                    </Suspense>
                  </div>
                </div>
              )}

              {/* Row 3: Customer Retention & Staff Sales */}
              {(activeView === 'all' || activeView === 'customers') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="min-h-[380px]">
                    <Suspense fallback={<CardSkeleton />}>
                      <CustomerReport 
                        dateRange={dateRange}
                        customersData={summaryData?.customers}
                        isLoading={isLoading}
                        onRefresh={refetch}
                      />
                    </Suspense>
                  </div>
                  
                  <div className="min-h-[380px]">
                    <Suspense fallback={<CardSkeleton />}>
                      <StaffPerformance 
                        dateRange={dateRange}
                        isLoading={isLoading}
                        onRefresh={refetch}
                      />
                    </Suspense>
                  </div>
                </div>
              )}

              {/* Row 4: Tax Only View if selected */}
              {activeView === 'tax' && (
                <div className="grid grid-cols-1 gap-6">
                  <Suspense fallback={<CardSkeleton />}>
                    <TaxReport 
                      dateRange={dateRange}
                      taxSummary={summaryData?.tax_summary}
                      gstReturns={summaryData?.gst_returns}
                      isLoading={isLoading}
                      onRefresh={refetch}
                    />
                  </Suspense>
                </div>
              )}

              {/* Row 5: Export & Scheduled Jobs */}
              {(activeView === 'all' || activeView === 'export') && (
                <div className="min-h-[220px]">
                  <Suspense fallback={<CardSkeleton />}>
                    <ExportOptions 
                      onRefresh={refetch}
                      dateRange={dateRange}
                      scheduledReports={summaryData?.scheduled_reports}
                      isLoading={isLoading}
                    />
                  </Suspense>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}