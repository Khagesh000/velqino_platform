"use client"

import React, { useState, lazy, Suspense, useEffect } from 'react'
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar'
import { useGetWholesalerStatsQuery } from '@/redux/wholesaler/slices/statsSlice'

// Lazy load all non-critical components
const OverviewCards = lazy(() => import('./Components/OverviewCards'))
const ChartsSection = lazy(() => import('./Components/ChartsSection'))
const ReportsSection = lazy(() => import('./Components/ReportsSection'))
const DateRangeSelector = lazy(() => import('./Components/DateRangeSelector'))
const ComparisonTool = lazy(() => import('./Components/ComparisonTool')) 

// Loading placeholders with EXACT heights to prevent layout shift
const OverviewPlaceholder = () => <div className="w-full h-[140px] bg-gray-50 rounded-xl animate-pulse" />
const ChartsPlaceholder = () => <div className="w-full h-[400px] bg-gray-50 rounded-xl animate-pulse" />
const ReportsPlaceholder = () => <div className="w-full h-[300px] bg-gray-50 rounded-xl animate-pulse" />
const DateRangePlaceholder = () => <div className="w-full h-[80px] bg-gray-50 rounded-xl animate-pulse" />
const ComparisonPlaceholder = () => <div className="w-full h-[200px] bg-gray-50 rounded-xl animate-pulse" />

export default function Reports() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [dateRange, setDateRange] = useState('last30days')
  const [customDate, setCustomDate] = useState({ start: '', end: '' })
  const [showComparison, setShowComparison] = useState(false)
  const [reportType, setReportType] = useState('sales')
  const [isLoading, setIsLoading] = useState(false)

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const getDateParams = () => {
      if (dateRange === 'custom' && customDate.start && customDate.end) {
        return { start_date: customDate.start, end_date: customDate.end };
      }
      return { range: dateRange };
    };

    // Use in query
    const { data: statsData, refetch } = useGetWholesalerStatsQuery(getDateParams());

  // Refetch when date range changes
  useEffect(() => {
    refetch();
  }, [dateRange, customDate, refetch]);

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
        <div className="max-w-7xl mx-auto overflow-x-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-sm text-gray-500">Track performance and gain insights</p>
              </div>
            </div>
            
            {/* Date Range Selector - Critical for data filtering */}
              <div className="w-full sm:w-auto" style={{ minHeight: '80px' }}>
              <Suspense fallback={<DateRangePlaceholder />}>
                <DateRangeSelector 
                  value={dateRange}
                  onChange={(range) => {
                    setDateRange(range);
                    // trigger refresh
                    setRefreshTrigger(prev => prev + 1);
                  }}
                  customDate={customDate}
                  onCustomDateChange={(dates) => {
                    setCustomDate(dates);
                    setDateRange('custom');
                    setRefreshTrigger(prev => prev + 1);
                  }}
                />
              </Suspense>
            </div> 
          </div>

          {/* Overview Cards - Key metrics load first */}
          <div style={{ minHeight: '140px' }}>
            <Suspense fallback={<OverviewPlaceholder />}>
              <OverviewCards 
                dateRange={dateRange}
                customDate={customDate}
                isLoading={isLoading}
                statsData={statsData}
              />
            </Suspense>
          </div>

          {/* Comparison Tool Toggle */}
         <div className="mt-4 flex items-center justify-end">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-primary-600 transition-all"
            >
              <span>Compare with previous period</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showComparison ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div> 

          {/* Comparison Tool (Conditional) */}
           {showComparison && (
            <div className="mt-4" style={{ minHeight: '200px' }}>
              <Suspense fallback={<ComparisonPlaceholder />}>
                <ComparisonTool 
                  dateRange={dateRange}
                  customDate={customDate}
                  statsData={statsData}
                />
              </Suspense>
            </div>
          )}  

          {/* Charts Section - Main visual data */}
          <div className="mt-6" style={{ minHeight: '400px' }}>
            <Suspense fallback={<ChartsPlaceholder />}>
              <ChartsSection 
                dateRange={dateRange}
                customDate={customDate}
                showComparison={showComparison}
                statsData={statsData}
              />
            </Suspense>
          </div> 

          {/* Report Type Tabs */}
        <div className="mt-8 overflow-x-auto scrollbar-hide -mb-px">
  <div className="flex items-center gap-2 border-b border-gray-200 min-w-max pb-px">
    {['sales', 'inventory', 'customer', 'tax', 'payout', 'product'].map((type) => (
      <button
        key={type}
        onClick={() => setReportType(type)}
        className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium capitalize border-b-2 transition-all whitespace-nowrap ${
          reportType === type
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        {type} Report
      </button>
    ))}
  </div>
</div>

          {/* Reports Section - Exportable data */}
          <div className="mt-6" style={{ minHeight: '300px' }}>
            <Suspense fallback={<ReportsPlaceholder />}>
              <ReportsSection 
                type={reportType}
                dateRange={dateRange}
                customDate={customDate}
                statsData={statsData}
              />
            </Suspense>
          </div> 

        </div>
      </main>
    </div>
  )
}