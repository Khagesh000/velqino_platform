'use client';

import React, { useState, lazy, Suspense, useEffect, useMemo } from 'react';
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar';
import { 
  useGetRetailerOrdersQuery, 
  useUpdateOrderStatusMutation, 
  useCancelOrderMutation 
} from '@/redux/retailer/slices/retailerOrdersSlice';
import { toast } from 'react-toastify';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  DollarSign, 
  RefreshCw, 
  Sparkles, 
  TrendingUp,
  AlertCircle,
  FileText,
  SlidersHorizontal
} from '../../../utils/icons';

// Lazy load all components for peak performance
const OrdersTable = lazy(() => import('./components/OrdersTable'));
const OrderStatus = lazy(() => import('./components/OrderStatus'));
const OrderDetails = lazy(() => import('./components/OrderDetails'));
const ReturnsManagement = lazy(() => import('./components/ReturnsManagement'));
const OrderHistory = lazy(() => import('./components/OrderHistory'));
const BulkActions = lazy(() => import('./components/BulkActions'));

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

export default function RetailerOrders() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeInspectorTab, setActiveInspectorTab] = useState('tracker'); // 'tracker' | 'details'

  // API query
  const { data: ordersData, isLoading, isFetching, refetch } = useGetRetailerOrdersQuery({
    page: currentPage,
    per_page: 20,
    search: searchQuery,
    status: statusFilter,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const orders = ordersData?.data || [];
  const totalOrders = orders.length || 0;
  const totalPages = Math.ceil(totalOrders / 20) || 1;

  // Auto-select first order if none is selected
  useEffect(() => {
    if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
    }
  }, [orders, selectedOrder]);

  useEffect(() => {
    if (refreshTrigger) refetch();
  }, [refreshTrigger, refetch]);

  // Aggregate KPI Statistics
  const stats = useMemo(() => {
    const total = orders.length;
    let pendingCount = 0;
    let shippedCount = 0;
    let deliveredCount = 0;
    let grossRevenue = 0;

    orders.forEach(ord => {
      const s = ord.status?.toLowerCase() || '';
      if (['pending', 'processing', 'confirmed'].includes(s)) pendingCount++;
      else if (['shipped', 'out_for_delivery'].includes(s)) shippedCount++;
      else if (s === 'delivered') deliveredCount++;

      grossRevenue += parseFloat(ord.grand_total || 0);
    });

    return {
      total,
      pendingCount,
      shippedCount,
      deliveredCount,
      grossRevenue
    };
  }, [orders]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus({ orderId, data: { status } }).unwrap();
      toast.success(`Order status updated to ${status}`);
      refetch();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder(orderId).unwrap();
        toast.success('Order cancelled successfully');
        refetch();
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        toast.error('Failed to cancel order');
      }
    }
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
                  Store Fulfillment Center
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Live Sync
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Retailer Orders & Logistics
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
                Supervise customer order pipelines, coordinate consignment dispatches, manage reverse logistics, and inspect real-time billing breakdowns.
              </p>
            </div>

            {/* Quick Actions / Refresh */}
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => {
                  refetch();
                  toast.info('Refreshing order records...');
                }}
                disabled={isFetching}
                className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isFetching ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                <span>{isFetching ? 'Syncing...' : 'Sync Orders'}</span>
              </button>
            </div>
          </div>

          {/* Top KPI Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Total Orders */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
                  {stats.total}
                </h3>
                <span className="text-[10px] text-gray-400 mt-0.5 block">Recorded consignments</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Package size={20} />
              </div>
            </div>

            {/* Pending & Processing */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Queue / Processing</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-amber-800 mt-1 tracking-tight">
                  {stats.pendingCount}
                </h3>
                <span className="text-[10px] text-amber-700/80 mt-0.5 block">Awaiting dispatch</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
            </div>

            {/* Shipped */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">In Transit</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-indigo-700 mt-1 tracking-tight">
                  {stats.shippedCount}
                </h3>
                <span className="text-[10px] text-indigo-600/80 mt-0.5 block">With courier partners</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
            </div>

            {/* Delivered */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Completed</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-1 tracking-tight">
                  {stats.deliveredCount}
                </h3>
                <span className="text-[10px] text-emerald-700/80 mt-0.5 block">Delivered successfully</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle size={20} />
              </div>
            </div>

            {/* Gross Revenue */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1 bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-primary-700 uppercase tracking-wider">Order Value (GMV)</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
                  ₹{stats.grossRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </h3>
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5 inline-flex items-center gap-0.5">
                  <TrendingUp size={10} /> Active volume
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <DollarSign size={20} />
              </div>
            </div>
          </div>

          {/* Primary Workspace: Orders Master Grid (Left 2 Col) + Inspector Panel (Right 1 Col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Orders Table */}
            <div className="lg:col-span-2">
              <Suspense fallback={<CardPlaceholder height="550px" />}>
                <OrdersTable 
                  orders={orders}
                  totalOrders={totalOrders}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  isLoading={isLoading}
                  selectedOrder={selectedOrder}
                  setSelectedOrder={setSelectedOrder}
                  onPageChange={setCurrentPage}
                  onSearch={setSearchQuery}
                  onStatusFilter={setStatusFilter}
                  refreshTrigger={refreshTrigger}
                />
              </Suspense>
            </div>

            {/* Right Column: Interactive Order Inspector (Switcher between Tracker & Invoice Details) */}
            <div className="space-y-4">
              {/* Tab Selector Pill */}
              <div className="bg-white rounded-2xl p-1.5 border border-gray-200/80 shadow-2xs flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('tracker')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeInspectorTab === 'tracker'
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Truck size={14} />
                  <span>Fulfillment Tracker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('details')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeInspectorTab === 'details'
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <FileText size={14} />
                  <span>Items & Billing</span>
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="transition-all duration-200">
                {activeInspectorTab === 'tracker' ? (
                  <Suspense fallback={<CardPlaceholder height="400px" />}>
                    <OrderStatus 
                      selectedOrder={selectedOrder}
                      onStatusUpdate={handleStatusUpdate}
                      onCancelOrder={handleCancelOrder}
                      onRefresh={refetch}
                    />
                  </Suspense>
                ) : (
                  <Suspense fallback={<CardPlaceholder height="400px" />}>
                    <OrderDetails selectedOrder={selectedOrder} />
                  </Suspense>
                )}
              </div>
            </div>

          </div>

          {/* Secondary Workspace: Returns Management (Left 1.5 Col) + Bulk Actions & Customer History (Right 1.5 Col) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            
            {/* Left Column: Returns & Reverse Logistics */}
            <div>
              <Suspense fallback={<CardPlaceholder height="460px" />}>
                <ReturnsManagement 
                  selectedOrder={selectedOrder}
                  retailerOrders={orders} 
                />
              </Suspense>
            </div>
            
            {/* Right Column: Bulk Operations & Customer History Stack */}
            <div className="space-y-6">
              <Suspense fallback={<CardPlaceholder height="240px" />}>
                <BulkActions 
                  selectedOrders={selectedOrder ? [selectedOrder] : orders.slice(0, 5)}
                  onComplete={() => setRefreshTrigger(prev => prev + 1)}
                />
              </Suspense>
              
              <Suspense fallback={<CardPlaceholder height="320px" />}>
                <OrderHistory 
                  selectedOrder={selectedOrder} 
                  orders={orders} 
                />
              </Suspense>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}