"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../components/DashboardHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import { useGetOrdersQuery } from '@/redux/wholesaler/slices/ordersSlice';
import { 
  ShoppingBag, 
  Package, 
  Filter, 
  X, 
  Search, 
  RefreshCw, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Truck, 
  ArrowRight, 
  AlertCircle, 
  Wallet,
  SlidersHorizontal
} from '../../../utils/icons';
import OrderCard from './components/OrderCard';

export default function OrdersPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, isFetching, error, refetch } = useGetOrdersQuery();
  const orders = useMemo(() => data?.data || [], [data]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (refetch) {
      await refetch();
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const statusFilters = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Counts for each status tab
  const statusCounts = useMemo(() => {
    const counts = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((o) => {
      const st = (o.status || '').toLowerCase();
      if (counts[st] !== undefined) {
        counts[st] += 1;
      }
    });
    return counts;
  }, [orders]);

  // Overall KPI statistics
  const kpiStats = useMemo(() => {
    const totalCount = orders.length;
    const inFulfillment = orders.filter((o) => {
      const st = (o.status || '').toLowerCase();
      return ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(st);
    }).length;
    const deliveredCount = orders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length;
    const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

    return {
      totalCount,
      inFulfillment,
      deliveredCount,
      totalSpent,
    };
  }, [orders]);

  // Filtering and sorting
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter((o) => (o.status || '').toLowerCase() === filterStatus.toLowerCase());
    }

    // Search query filter (Order number, items)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((o) => {
        const orderNum = String(o.order_number || o.id || '').toLowerCase();
        const city = String(o.shipping_address?.city || '').toLowerCase();
        const hasItemMatch = Array.isArray(o.items) && o.items.some(
          (item) => String(item.product_name || item.name || '').toLowerCase().includes(q)
        );
        return orderNum.includes(q) || city.includes(q) || hasItemMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      }
      if (sortBy === 'amount_high') {
        return (Number(b.total_amount) || 0) - (Number(a.total_amount) || 0);
      }
      if (sortBy === 'amount_low') {
        return (Number(a.total_amount) || 0) - (Number(b.total_amount) || 0);
      }
      return 0;
    });

    return result;
  }, [orders, filterStatus, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-20 lg:pb-12">
      <DashboardHeader 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      <div className="flex">
        <DashboardSidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
        
        <main className="flex-1 lg:ml-64 transition-all duration-300 p-3 sm:p-5 lg:p-8 min-w-0 max-w-full overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto space-y-5 sm:space-y-6">

            {/* Executive Header Ribbon */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 border border-gray-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                    <Sparkles size={12} className="text-primary-600" />
                    Customer Orders &amp; Fulfillment Console
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Real-time Sync Active
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  My Orders
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                  Track and manage all your placed orders, monitor delivery dispatches, inspect item receipts, and download tax invoices.
                </p>
              </div>

              {/* Action Buttons in Header - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing || isFetching}
                  className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isRefreshing || isFetching ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                  <span>{isRefreshing || isFetching ? 'Syncing...' : 'Sync Data'}</span>
                </button>

                {/* Prominent Continue Shopping Button in Header */}
                <Link
                  href="/product/productlistingpage"
                  className="px-4.5 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white hover:!text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                  style={{ color: '#ffffff' }}
                >
                  <ShoppingBag size={14} className="!text-white text-white" style={{ color: '#ffffff' }} />
                  <span className="!text-white text-white" style={{ color: '#ffffff' }}>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* KPI Metrics Ribbon (4 Cards) - 2x2 on Mobile, 4 Cols on Desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight">
                    {kpiStats.totalCount}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-primary-600 font-semibold mt-0.5 inline-flex items-center gap-1">
                    <Package size={11} className="hidden sm:inline-block" />
                    <span>Lifetime history</span>
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <Package size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">In Fulfillment</p>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight">
                    {kpiStats.inFulfillment}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-amber-600 font-semibold mt-0.5 inline-flex items-center gap-1">
                    <Clock size={11} className="hidden sm:inline-block" />
                    <span>Active transit</span>
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Delivered</p>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight">
                    {kpiStats.deliveredCount}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center gap-1">
                    <CheckCircle size={11} className="hidden sm:inline-block" />
                    <span>Completed</span>
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Purchases</p>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight">
                    ₹{kpiStats.totalSpent.toLocaleString('en-IN')}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-indigo-600 font-semibold mt-0.5 inline-flex items-center gap-1">
                    <Wallet size={11} className="hidden sm:inline-block" />
                    <span>Net invoices</span>
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Wallet size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>

            {/* Filter, Search & Sort Panel */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 w-full max-w-xl">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Order # or item name..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-gray-50/80 border border-gray-200/90 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-500">Sort:</span>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 sm:flex-initial px-3 py-2 rounded-2xl bg-gray-50/80 border border-gray-200/90 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
                  >
                    <option value="newest">Newest Date First</option>
                    <option value="oldest">Oldest Date First</option>
                    <option value="amount_high">Highest Amount First</option>
                    <option value="amount_low">Lowest Amount First</option>
                  </select>
                </div>
              </div>

              {/* Status Filter Tabs - Smooth Horizontal Scroll */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
                {statusFilters.map((filter) => {
                  const count = statusCounts[filter.value] || 0;
                  const isActive = filterStatus === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setFilterStatus(filter.value)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                      }`}
                    >
                      <span>{filter.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200/80 text-gray-700'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area: Loading / Error / Empty / List */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs animate-pulse space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-200 rounded-xl w-48"></div>
                      <div className="h-6 bg-gray-200 rounded-xl w-24"></div>
                    </div>
                    <div className="h-16 bg-gray-100 rounded-2xl w-full"></div>
                    <div className="flex justify-end gap-2">
                      <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-3xl border border-rose-200/80 shadow-2xs p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-2xs">
                  <AlertCircle size={30} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                    Failed to Synchronize Orders
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
                    We could not retrieve your orders at this time. Please check your internet connectivity or try again.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs"
                  >
                    Try Again
                  </button>
                  <Link
                    href="/product/productlistingpage"
                    className="px-6 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                    style={{ color: '#ffffff' }}
                  >
                    <ShoppingBag size={14} className="!text-white text-white" style={{ color: '#ffffff' }} />
                    <span className="!text-white text-white" style={{ color: '#ffffff' }}>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            ) : filteredAndSortedOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto border border-primary-100 shadow-2xs">
                  <Package size={30} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                    {orders.length === 0 ? 'No Orders Placed Yet' : 'No Matching Orders Found'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
                    {orders.length === 0
                      ? 'You have not placed any orders yet. Discover trending products, wholesale catalogs, and top deals right now!'
                      : `No orders matched the filter "${filterStatus}" or query "${searchQuery}". Reset filters to see all orders.`}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                  {orders.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilterStatus('all');
                        setSearchQuery('');
                      }}
                      className="px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs"
                    >
                      Clear Filters
                    </button>
                  )}
                  {/* Button-wise prominent Continue Shopping */}
                  <Link
                    href="/product/productlistingpage"
                    className="px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2"
                    style={{ color: '#ffffff' }}
                  >
                    <ShoppingBag size={15} className="!text-white text-white" style={{ color: '#ffffff' }} />
                    <span className="!text-white text-white" style={{ color: '#ffffff' }}>Continue Shopping</span>
                    <ArrowRight size={14} className="!text-white text-white" style={{ color: '#ffffff' }} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedOrders.map((order) => (
                  <OrderCard key={order.id || order.order_number} order={order} />
                ))}
              </div>
            )}

            {/* Bottom Executive CTA Ribbon (Button-wise Continue Shopping) */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100/70 shadow-2xs">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                    Looking for more products?
                  </h4>
                  <p className="text-xs text-gray-500">
                    Explore exclusive catalog prices, high-margin items, and curated product collections.
                  </p>
                </div>
              </div>

              <Link 
                href="/product/productlistingpage" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white font-bold text-xs sm:text-sm shadow-xs transition-all shrink-0"
                style={{ color: '#ffffff' }}
              >
                <ShoppingBag size={16} className="!text-white text-white" style={{ color: '#ffffff' }} />
                <span className="!text-white text-white font-bold" style={{ color: '#ffffff' }}>Continue Shopping</span>
                <ArrowRight size={14} className="!text-white text-white" style={{ color: '#ffffff' }} />
              </Link>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}