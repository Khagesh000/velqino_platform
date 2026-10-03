"use client";

import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import Link from 'next/link';
import { 
  RefreshCw, 
  ShoppingCart, 
  Calendar, 
  Clock, 
  Sparkles, 
  Store,
  CheckCircle,
  TrendingUp,
  Package
} from '../../../utils/icons';
import RetailerNavbar from './components/RetailerNavbar';
import RetailerKPIStatsCards from './components/RetailerKPIStatsCards';
import RetailerQuickActionsRow from './components/RetailerQuickActionsRow';
import { useGetRetailerDashboardSummaryQuery } from '@/redux/retailer/slices/statsSlice';
import { getAuthUser } from '@/utils/cookieUtils';

// Lazy loaded dashboard widgets for fast rendering
const DailySalesChart = lazy(() => import('./components/DailySalesChart'));
const TodaysSummary = lazy(() => import('./components/TodaysSummary'));
const RecentTransactions = lazy(() => import('./components/RecentTransactions'));
const LowStockAlerts = lazy(() => import('./components/LowStockAlerts'));
const QuickReorder = lazy(() => import('./components/QuickReorder'));
const TopSellingProducts = lazy(() => import('./components/TopSellingProducts'));
const CustomerActivity = lazy(() => import('./components/CustomerActivity'));

// High-fidelity shimmer placeholders
const WidgetPlaceholder = ({ height = "h-72" }) => (
  <div className={`w-full ${height} bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs animate-pulse flex flex-col justify-between`}>
    <div className="space-y-3">
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
    </div>
    <div className="h-36 bg-gray-50 rounded-xl" />
  </div>
);

export default function RetailerDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [authProfile, setAuthProfile] = useState(() => getAuthUser());

  // Listen to auth profile updates dynamically
  useEffect(() => {
    setAuthProfile(getAuthUser());
    const handleAuth = (e) => {
      setAuthProfile(e?.detail || getAuthUser());
    };
    window.addEventListener('velqino:auth-user-updated', handleAuth);
    return () => window.removeEventListener('velqino:auth-user-updated', handleAuth);
  }, []);

  const displayName = useMemo(() => {
    if (authProfile.name && authProfile.name !== 'undefined') return authProfile.name;
    if (authProfile.email && authProfile.email !== 'undefined') return authProfile.email.split('@')[0];
    return 'Retail Store';
  }, [authProfile]);

  // Resilient Session Storage Caching: avoids flash of blank screen on refresh/navigation
  const [cachedData, setCachedData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('velqino_retailer_dashboard_cache');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Dashboard cache parse error:', e);
      }
    }
    return null;
  });

  // Single high-efficiency API query
  const { 
    data: dashboardResponse, 
    isLoading: isQueryLoading, 
    isFetching, 
    refetch 
  } = useGetRetailerDashboardSummaryQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
  });

  // Sync to session cache whenever fresh data arrives
  useEffect(() => {
    const rawData = dashboardResponse?.data;
    if (rawData && (rawData.kpiStats || rawData.todaySummary || rawData.lowStockAlerts)) {
      setCachedData(rawData);
      try {
        sessionStorage.setItem('velqino_retailer_dashboard_cache', JSON.stringify(rawData));
      } catch (e) {}
    }
  }, [dashboardResponse]);

  // Seamless fallback to cached data while fresh network response is loading
  const liveData = dashboardResponse?.data || cachedData || {};
  const isInitialLoading = isQueryLoading && !cachedData;

  // Extract structured slices from API payload
  const kpiStats = liveData.kpiStats || {};
  const todaySummary = liveData.todaySummary || {};
  const dailySales = liveData.dailySales || [];
  const recentTransactions = liveData.recentTransactions || [];
  const lowStockAlerts = liveData.lowStockAlerts || [];
  const quickReorder = liveData.quickReorder || [];
  const topProducts = liveData.topProducts || [];
  const customerActivity = liveData.customerActivity || [];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 lg:pb-12">
      {/* Top Navbar */}
      <RetailerNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <main className={`transition-all duration-300 p-4 sm:p-6 lg:p-8 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-[1520px] mx-auto space-y-6">
          
          {/* Welcome & Command Header */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-7 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Identity Banner */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
                    Retailer POS Terminal Active
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  Welcome back, {displayName}
                </h1>
                
                <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span>
                    {new Date().toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span>•</span>
                  <span>Store Operational</span>
                </p>
              </div>

              {/* Right Action Controls */}
              <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
                {/* Live Refresh Button */}
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  title="Refresh Dashboard Data"
                >
                  <RefreshCw size={14} className={isFetching ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                  <span>{isFetching ? 'Syncing...' : 'Refresh'}</span>
                </button>

                {/* Direct POS Link Button */}
                <Link
                  href="/retailer/possales"
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs hover:shadow-md active:scale-95"
                >
                  <ShoppingCart size={15} />
                  <span>Open POS Register</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Row 1: KPI Stats Cards */}
          <RetailerKPIStatsCards 
            stats={kpiStats} 
            isLoading={isInitialLoading} 
          />

          {/* Row 2: Operational Quick Actions */}
          <RetailerQuickActionsRow />

          {/* Row 3: Daily Sales Analytics & Today's POS Register Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Sales Chart (7 Cols on desktop) */}
            <div className="lg:col-span-7">
              <Suspense fallback={<WidgetPlaceholder height="h-[430px]" />}>
                <DailySalesChart 
                  data={dailySales} 
                  target={todaySummary.target || 3571.43}
                  isLoading={isInitialLoading} 
                />
              </Suspense>
            </div>

            {/* Today's Register Summary (5 Cols on desktop) */}
            <div className="lg:col-span-5">
              <Suspense fallback={<WidgetPlaceholder height="h-[430px]" />}>
                <TodaysSummary 
                  data={todaySummary} 
                  isLoading={isInitialLoading} 
                />
              </Suspense>
            </div>
          </div>

          {/* Row 4: Recent Transactions & Low Stock Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Transactions (7 Cols on desktop) */}
            <div className="lg:col-span-7">
              <Suspense fallback={<WidgetPlaceholder height="h-[420px]" />}>
                <RecentTransactions 
                  data={recentTransactions} 
                  isLoading={isInitialLoading} 
                />
              </Suspense>
            </div>

            {/* Low Stock Alerts (5 Cols on desktop) */}
            <div className="lg:col-span-5">
              <Suspense fallback={<WidgetPlaceholder height="h-[420px]" />}>
                <LowStockAlerts 
                  data={lowStockAlerts} 
                  isLoading={isInitialLoading} 
                />
              </Suspense>
            </div>
          </div>

          {/* Row 5: Procurement Reorder & Top Selling Products */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Quick Reorder (6 Cols on desktop) */}
            <div className="lg:col-span-6">
              <Suspense fallback={<WidgetPlaceholder height="h-[400px]" />}>
                <QuickReorder 
                  data={quickReorder} 
                  isLoading={isInitialLoading} 
                />
              </Suspense>
            </div>

            {/* Top Products (6 Cols on desktop) */}
            <div className="lg:col-span-6">
              <Suspense fallback={<WidgetPlaceholder height="h-[400px]" />}>
                <TopSellingProducts 
                  data={topProducts} 
                  isLoading={isInitialLoading} 
                />
              </Suspense>
            </div>
          </div>

          {/* Row 6: Customer Activity Feed */}
          <Suspense fallback={<WidgetPlaceholder height="h-[300px]" />}>
            <CustomerActivity 
              data={customerActivity} 
              isLoading={isInitialLoading} 
            />
          </Suspense>

        </div>
      </main>
    </div>
  );
}