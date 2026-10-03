"use client";

import React, { useState, lazy, Suspense, useEffect } from 'react';
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar';
import { useGetWholesalerOrdersOverviewQuery } from '@/redux/wholesaler/slices/ordersSlice';
import { 
  Sparkles, 
  RefreshCw, 
  Grid, 
  List, 
  Package, 
  Download, 
  Loader2 
} from '@/utils/icons';

// Lazy load order components
const OrdersFilters = lazy(() => import('./components/OrdersFilters'));
const OrdersTable = lazy(() => import('./components/OrdersTable'));
const OrderProductCards = lazy(() => import('./components/OrderProductCards'));
const OrderDetailsPanel = lazy(() => import('./components/OrderDetailsPanel'));
const BulkActions = lazy(() => import('./components/BulkActions'));

export default function Management() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Build query params from filters
  const queryParams = {
    page: currentPage,
    per_page: pageSize,
    ...(activeFilters.status && activeFilters.status !== 'all' && { status: activeFilters.status }),
    ...(activeFilters.payment && activeFilters.payment !== 'all' && { payment_status: activeFilters.payment }),
    ...(activeFilters.searchQuery && { search: activeFilters.searchQuery }),
    ...(activeFilters.dateRange && activeFilters.dateRange !== '30' && { days: activeFilters.dateRange }),
    ...(activeFilters.amountRange?.min && { min_amount: activeFilters.amountRange.min }),
    ...(activeFilters.amountRange?.max && { max_amount: activeFilters.amountRange.max }),
  };

  // Single consolidated query (replaces 4 separate endpoints)
  const { 
    data: liveOrdersData, 
    isLoading: ordersLoading, 
    isFetching: ordersFetching, 
    isError: ordersError,
    refetch: refetchOrders 
  } = useGetWholesalerOrdersOverviewQuery(queryParams);

  // Resilient cache to guarantee Frame 1 instant render with 0 blank flash
  const [cachedOrdersData, setCachedOrdersData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('velqino_wholesaler_orders_overview_cache') || sessionStorage.getItem('velqino_wholesaler_orders_cache');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse orders cache:', e);
      }
    }
    return null;
  });

  // Keep cache synchronized
  useEffect(() => {
    if (liveOrdersData && liveOrdersData.data) {
      setCachedOrdersData(liveOrdersData);
      try {
        sessionStorage.setItem('velqino_wholesaler_orders_overview_cache', JSON.stringify(liveOrdersData));
      } catch (e) {}
    }
  }, [liveOrdersData]);

  // Extract consolidated data safely (supports composite payload and legacy arrays)
  const effectiveData = liveOrdersData || cachedOrdersData;
  const compositeData = (effectiveData?.data && !Array.isArray(effectiveData.data)) ? effectiveData.data : null;

  const orders = Array.isArray(compositeData?.orders)
    ? compositeData.orders
    : Array.isArray(effectiveData?.data)
      ? effectiveData.data
      : Array.isArray(effectiveData)
        ? effectiveData
        : [];

  const pagination = compositeData?.pagination || effectiveData?.pagination || {};
  const totalOrders = pagination.total ?? orders.length;
  const totalPages = pagination.total_pages || Math.max(1, Math.ceil(totalOrders / pageSize));

  const stats = compositeData?.stats || null;
  const withdrawalStats = compositeData?.withdrawal_stats || null;
  const categories = compositeData?.categories || [];

  const isLoading = ordersLoading && orders.length === 0;

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      {/* Main content with dynamic margin based on sidebar state */}
      <main className={`
        transition-all duration-300 p-3 sm:p-5 lg:p-6
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
          
          {/* Executive Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-xs flex-shrink-0">
                <Package size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">Orders Management</h1>
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100 rounded-full">
                    {totalOrders} Orders
                  </span>
                  {ordersFetching && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Loader2 size={12} className="animate-spin text-primary-600" />
                      Syncing...
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Track buyer purchase orders, fulfillment pipelines, and dispatch statuses
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Refresh CTA */}
              <button
                type="button"
                onClick={() => refetchOrders()}
                disabled={ordersFetching}
                className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-primary-600 shadow-2xs transition-all flex items-center gap-1.5"
                title="Refresh orders"
              >
                <RefreshCw size={14} className={ordersFetching ? "animate-spin text-primary-600" : ""} />
                <span className="hidden sm:inline">Refresh Data</span>
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div>
            <Suspense fallback={<div className="w-full h-24 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />}>
              <OrdersFilters 
                onFilterChange={handleFilterChange}
                totalOrders={totalOrders}
                categories={categories}
              />
            </Suspense>
          </div>

          {/* Financial Overview / Balance Cards */}
          <div>
            <Suspense fallback={<div className="w-full h-40 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />}>
              <BulkActions 
                stats={stats}
                withdrawalStats={withdrawalStats}
                isLoading={isLoading}
                isSyncing={ordersFetching}
                isError={ordersError}
              />
            </Suspense>
          </div>

          {/* Orders Table Section */}
          <div>
            <Suspense fallback={<div className="w-full h-96 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />}>
              <OrdersTable 
                orders={orders}
                isLoading={isLoading}
                totalOrders={totalOrders}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                onSelectOrder={(orderId) => setSelectedOrder(orderId)}
              />
            </Suspense>
          </div>

          {/* Order Product Cards Section (Directly Below Orders Table) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-2xs flex-shrink-0">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Order Product Cards</h3>
                  <p className="text-xs text-slate-500">Visual product breakdowns with images, SKUs, quantities, and pricing</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full border border-slate-200/80">
                {orders.length} Cards
              </span>
            </div>

            <Suspense fallback={<div className="w-full h-64 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />}>
              <OrderProductCards 
                orders={orders}
                isLoading={isLoading}
                onSelectOrder={(orderId) => setSelectedOrder(orderId)}
              />
            </Suspense>
          </div>

        </div>
      </main>

      {/* Order Details Panel - Right Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedOrder(null)} 
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-4xl pt-[56px] pb-[70px] sm:pt-[70px] sm:pb-[56px] shadow-2xl">
            <div className="h-full bg-white sm:rounded-l-2xl overflow-hidden shadow-2xl">
              <Suspense fallback={<div className="w-full h-full bg-white flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary-600" /></div>}>
                <OrderDetailsPanel 
                  orderId={selectedOrder} 
                  onClose={() => setSelectedOrder(null)}
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
