"use client";

import React, { useState, lazy, Suspense } from 'react';
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar';
import { 
  Package, 
  TrendingUp, 
  Truck, 
  RefreshCw, 
  Sparkles, 
  ClipboardList, 
  ShoppingCart,
  Calendar,
  AlertCircle
} from '../../../utils/icons';
import { toast } from 'react-toastify';

// Lazy load all components
const StockOverview = lazy(() => import('./components/StockOverview'));
const StockMovement = lazy(() => import('./components/StockMovement'));
const ReorderList = lazy(() => import('./components/ReorderList'));
const SupplierInfo = lazy(() => import('./components/SupplierInfo'));
const StockTake = lazy(() => import('./components/StockTake'));
const ExpiryTracking = lazy(() => import('./components/ExpiryTracking'));
const InwardStock = lazy(() => import('./components/InwardStock'));

// Sleek loading placeholders matching card geometry
const CardPlaceholder = ({ height = '350px' }) => (
  <div 
    style={{ minHeight: height }} 
    className="w-full bg-white rounded-3xl border border-gray-200/80 p-6 shadow-2xs flex flex-col justify-between animate-pulse"
  >
    <div className="flex items-center justify-between">
      <div className="h-6 w-36 bg-gray-200 rounded-xl" />
      <div className="h-6 w-16 bg-gray-100 rounded-lg" />
    </div>
    <div className="space-y-3 my-4">
      <div className="h-4 w-full bg-gray-100 rounded-lg" />
      <div className="h-4 w-5/6 bg-gray-100 rounded-lg" />
      <div className="h-4 w-4/6 bg-gray-100 rounded-lg" />
    </div>
    <div className="h-9 w-full bg-gray-100 rounded-xl" />
  </div>
);

export default function RetailerInventory() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 600));
    setRefreshTrigger(prev => prev + 1);
    setIsSyncing(false);
    toast.success('Inventory ledger synchronized with store checkout balances!');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-20 lg:pb-12">
      <RetailerNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`transition-all duration-300 p-4 sm:p-6 lg:p-8 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* Executive Header Ribbon */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                  <Sparkles size={11} className="text-primary-500" />
                  Warehouse & Stock Operations
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Live Sync
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Inventory & Stock Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
                Supervise real-time SKU movements, automate low-stock procurement triggers, reconcile physical floor counts, and track batch shelf-life across store locations.
              </p>
            </div>

            {/* Quick Actions / Refresh */}
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isSyncing ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Stock'}</span>
              </button>
            </div>
          </div>

          {/* Top KPI Metrics Ribbon */}
          <Suspense fallback={<CardPlaceholder height="120px" />}>
            <StockOverview refreshTrigger={refreshTrigger} />
          </Suspense>

          {/* Primary Operations Grid: Stock Movement Ledger (2 Cols) + Reorder Queue (1 Col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Stock Movement Ledger */}
            <div className="lg:col-span-2">
              <Suspense fallback={<CardPlaceholder height="450px" />}>
                <StockMovement />
              </Suspense>
            </div>

            {/* Right 1 Column: Automated Reorder Queue */}
            <div>
              <Suspense fallback={<CardPlaceholder height="450px" />}>
                <ReorderList onReorder={() => setRefreshTrigger(prev => prev + 1)} />
              </Suspense>
            </div>

          </div>

          {/* Row 2: Receive Inward Stock + Batch Expiry Control (Side-by-Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col h-full min-h-0">
              <Suspense fallback={<CardPlaceholder height="400px" />}>
                <InwardStock onComplete={() => setRefreshTrigger(prev => prev + 1)} />
              </Suspense>
            </div>

            <div className="flex flex-col h-full min-h-0">
              <Suspense fallback={<CardPlaceholder height="400px" />}>
                <ExpiryTracking />
              </Suspense>
            </div>
          </div>

          {/* Row 3: Physical Stock Audit + Verified Suppliers (Side-by-Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col h-full min-h-0">
              <Suspense fallback={<CardPlaceholder height="400px" />}>
                <StockTake onComplete={() => setRefreshTrigger(prev => prev + 1)} />
              </Suspense>
            </div>

            <div className="flex flex-col h-full min-h-0">
              <Suspense fallback={<CardPlaceholder height="400px" />}>
                <SupplierInfo />
              </Suspense>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
