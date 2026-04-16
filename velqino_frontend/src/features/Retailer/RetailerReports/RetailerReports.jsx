"use client"

import React, { useState, lazy, Suspense } from 'react'
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar'

// Lazy load all components
const SalesReport = lazy(() => import('./Components/SalesReport'))
const ProductReport = lazy(() => import('./Components/ProductReport'))
const CustomerReport = lazy(() => import('./Components/CustomerReport'))
const ProfitLoss = lazy(() => import('./Components/ProfitLoss'))
const TaxReport = lazy(() => import('./Components/TaxReport'))
const StaffPerformance = lazy(() => import('./Components/StaffPerformance'))
const ExportOptions = lazy(() => import('./Components/ExportOptions')) 

// Loading placeholders
const ChartPlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const TablePlaceholder = () => <div className="w-full h-[350px] bg-gray-100 rounded-xl animate-pulse" />
const CardPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerReports() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [dateRange, setDateRange] = useState('month')
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Track performance and insights</p>
          </div>

          {/* Date Range Selector */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setDateRange('day')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${dateRange === 'day' ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${dateRange === 'week' ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              This Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${dateRange === 'month' ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateRange('quarter')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${dateRange === 'quarter' ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              This Quarter
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${dateRange === 'year' ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              This Year
            </button>
          </div>

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            <div style={{ minHeight: '400px' }}>
              <Suspense fallback={<ChartPlaceholder />}>
                <SalesReport dateRange={dateRange} />
              </Suspense>
            </div>
            
           <div style={{ minHeight: '400px' }}>
              <Suspense fallback={<ChartPlaceholder />}>
                <ProductReport dateRange={dateRange} />
              </Suspense>
            </div> 

          </div>

          {/* Second Row - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
           <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<CardPlaceholder />}>
                <CustomerReport dateRange={dateRange} />
              </Suspense>
            </div> 
            
            <div style={{ minHeight: '350px' }}>
              <Suspense fallback={<CardPlaceholder />}>
                <ProfitLoss dateRange={dateRange} />
              </Suspense>
            </div>

          </div>

          {/* Third Row - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
           <div style={{ minHeight: '300px' }}>
              <Suspense fallback={<TablePlaceholder />}>
                <TaxReport dateRange={dateRange} />
              </Suspense>
            </div>
            
            <div style={{ minHeight: '300px' }}>
              <Suspense fallback={<TablePlaceholder />}>
                <StaffPerformance dateRange={dateRange} />
              </Suspense>
            </div> 

          </div>

          {/* Export Options */}
         <div style={{ minHeight: '150px' }}>
            <Suspense fallback={<CardPlaceholder />}>
              <ExportOptions />
            </Suspense>
          </div> 

        </div>
      </main>
    </div>
  )
}