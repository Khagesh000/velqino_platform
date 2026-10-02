"use client";

import React, { useState, lazy, Suspense, useEffect, useMemo } from 'react';
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar';
import { useGetWholesalerAnalyticsSummaryQuery } from '@/redux/wholesaler/slices/statsSlice';
import { 
  BarChart3, 
  RefreshCw, 
  Sparkles, 
  ArrowLeftRight, 
  Grid, 
  DollarSign, 
  ShoppingBag, 
  FileText 
} from '@/utils/icons';

// Lazy load non-critical components
const OverviewCards = lazy(() => import('./components/OverviewCards'));
const ChartsSection = lazy(() => import('./components/ChartsSection'));
const ReportsSection = lazy(() => import('./components/ReportsSection'));
const DateRangeSelector = lazy(() => import('./components/DateRangeSelector'));
const ComparisonTool = lazy(() => import('./components/ComparisonTool'));

// Structured executive skeleton placeholders
const OverviewPlaceholder = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-[146px] bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-slate-200" />
          <div className="w-12 h-5 rounded-md bg-slate-100" />
        </div>
        <div className="space-y-1.5">
          <div className="w-24 h-6 rounded-md bg-slate-200" />
          <div className="w-16 h-3 rounded bg-slate-100" />
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-100" />
      </div>
    ))}
  </div>
);

const ChartsPlaceholder = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse shadow-xs">
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
      <div className="space-y-2">
        <div className="w-48 h-5 rounded-md bg-slate-200" />
        <div className="w-64 h-3.5 rounded bg-slate-100" />
      </div>
      <div className="w-24 h-7 rounded-lg bg-slate-100" />
    </div>
    <div className="h-64 rounded-xl bg-slate-50 flex items-center justify-center">
      <div className="w-3/4 h-32 bg-slate-200/50 rounded-lg" />
    </div>
  </div>
);

const ReportsPlaceholder = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse shadow-xs">
    <div className="flex items-center justify-between mb-4">
      <div className="w-40 h-5 rounded bg-slate-200" />
      <div className="w-24 h-8 rounded-lg bg-slate-100" />
    </div>
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="w-full h-10 rounded-lg bg-slate-100" />
      ))}
    </div>
  </div>
);

const DateRangePlaceholder = () => (
  <div className="w-44 h-10 bg-white rounded-xl border border-slate-200 animate-pulse shadow-2xs" />
);

const ComparisonPlaceholder = () => (
  <div className="w-full h-52 bg-white rounded-2xl border border-slate-200 animate-pulse shadow-xs" />
);

export default function Reports() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState('last30days');
  const [customDate, setCustomDate] = useState({ start: '', end: '' });
  const [showComparison, setShowComparison] = useState(false);
  const [reportType, setReportType] = useState('sales');

  // Client-side cache for instantaneous zero-flicker loading
  const [cachedData, setCachedData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('velqino_wholesaler_analytics_cache');
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const queryParams = useMemo(() => {
    if (dateRange === 'custom' && customDate.start && customDate.end) {
      return { start_date: customDate.start, end_date: customDate.end };
    }
    return { range: dateRange };
  }, [dateRange, customDate]);

  // SINGLE UNIFIED API ENDPOINT CALL
  const { 
    data: analyticsData, 
    isLoading, 
    isFetching,
    error, 
    refetch 
  } = useGetWholesalerAnalyticsSummaryQuery(queryParams);

  // Sync fresh response with sessionStorage cache
  useEffect(() => {
    if (analyticsData?.data) {
      setCachedData(analyticsData.data);
      try {
        sessionStorage.setItem('velqino_wholesaler_analytics_cache', JSON.stringify(analyticsData.data));
      } catch (e) {}
    }
  }, [analyticsData]);

  // Resolve effective data
  const data = analyticsData?.data || cachedData || {};
  const stats = data.stats || {};
  const salesAnalytics = data.salesAnalytics || {};
  const topProducts = data.topProducts || [];
  const categoryPerformance = data.categoryPerformance || [];
  const orderStatusDistribution = data.orderStatusDistribution || [];
  const geoSales = data.geoSales || [];
  const hourlySales = data.hourlySales || [];

  const isCacheSource = !analyticsData?.data && !!cachedData;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`
        transition-all duration-300 p-3 sm:p-4 lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Executive Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <BarChart3 size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Analytics & Executive Reports
                  </h1>
                  <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isFetching 
                      ? 'bg-amber-100 text-amber-800' 
                      : isCacheSource 
                      ? 'bg-slate-100 text-slate-700' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isFetching ? 'bg-amber-500 animate-ping' : isCacheSource ? 'bg-slate-400' : 'bg-emerald-500'
                    }`} />
                    {isFetching ? 'Syncing...' : isCacheSource ? 'Cached' : 'Live Sync'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Track wholesale revenue, order fulfillment status, and catalog trends
                </p>
              </div>
            </div>
            
            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                title="Refresh analytics data"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all shadow-2xs disabled:opacity-50"
              >
                <RefreshCw size={17} className={isFetching ? 'animate-spin text-primary-600' : ''} />
              </button>

              <Suspense fallback={<DateRangePlaceholder />}>
                <DateRangeSelector 
                  value={dateRange}
                  onChange={(range) => setDateRange(range)}
                  customDate={customDate}
                  onCustomDateChange={(dates) => {
                    setCustomDate(dates);
                    setDateRange('custom');
                  }}
                />
              </Suspense>
            </div> 
          </div>

          {/* KPI Overview Cards */}
          <div style={{ minHeight: '146px' }}>
            <Suspense fallback={<OverviewPlaceholder />}>
              <OverviewCards 
                dateRange={dateRange}
                customDate={customDate}
                isLoading={isLoading && !cachedData}
                statsData={data}
              />
            </Suspense>
          </div>

          {/* Period Comparison Toggle Bar */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200/80 px-4 py-2.5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Sparkles size={15} className="text-primary-500" />
              <span>Comparative Performance Diagnostics</span>
            </div>

            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all
                ${showComparison 
                  ? 'bg-primary-50 text-primary-700 border-primary-200' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}
              `}
            >
              <ArrowLeftRight size={14} className={showComparison ? 'text-primary-600' : 'text-slate-400'} />
              <span>{showComparison ? 'Hide Comparison Tool' : 'Compare with Prior Period'}</span>
            </button>
          </div> 

          {/* Performance Comparison Tool */}
          {showComparison && (
            <div style={{ minHeight: '200px' }}>
              <Suspense fallback={<ComparisonPlaceholder />}>
                <ComparisonTool 
                  dateRange={dateRange}
                  customDate={customDate}
                  statsData={data}
                />
              </Suspense>
            </div>
          )}  

          {/* Interactive Charts Hub */}
          <div style={{ minHeight: '380px' }}>
            <Suspense fallback={<ChartsPlaceholder />}>
              <ChartsSection 
                dateRange={dateRange}
                customDate={customDate}
                showComparison={showComparison}
                statsData={stats}
                salesData={salesAnalytics}
                categoryData={categoryPerformance}
                topProductsData={topProducts}
                orderStatusData={orderStatusDistribution}
                geoData={geoSales}  
                hourlyData={hourlySales}
              />
            </Suspense>
          </div> 

          {/* Structured Reports Section */}
          <div style={{ minHeight: '280px' }}>
            <Suspense fallback={<ReportsPlaceholder />}>
              <ReportsSection 
                type={reportType}
                dateRange={dateRange}
                customDate={customDate}
                statsData={data}
                topProducts={topProducts}
                orderStatus={orderStatusDistribution}
              />
            </Suspense>
          </div> 

        </div>
      </main>
    </div>
  );
}