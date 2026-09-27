"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetOrdersQuery } from '@/redux/wholesaler/slices/ordersSlice';
import {
  ShoppingBag,
  Package,
  Search,
  Filter,
  X,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle,
  ShieldCheck,
  SlidersHorizontal,
  RotateCcw,
  Wallet,
} from '@/utils/icons';
import OrderCard from './components/OrderCard';
import '@/styles/common/OrdersPage.scss';

export default function OrdersPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const { data, isLoading, isFetching, error, refetch } = useGetOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Real orders array directly from API
  const rawOrders = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  // Status Filter Definitions
  const statusFilters = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Order Placed' },
    { value: 'confirmed', label: 'Mill Confirmed' },
    { value: 'processing', label: 'Processing Lot' },
    { value: 'shipped', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Live status counts
  const statusCounts = useMemo(() => {
    const counts = { all: rawOrders.length };
    statusFilters.forEach(f => {
      if (f.value !== 'all') {
        counts[f.value] = rawOrders.filter(o => String(o.status || '').toLowerCase() === f.value).length;
      }
    });
    return counts;
  }, [rawOrders]);

  // KPI Metrics Calculations
  const metrics = useMemo(() => {
    const totalOrders = rawOrders.length;
    const activeOrders = rawOrders.filter(o =>
      ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(String(o.status || '').toLowerCase())
    ).length;
    const deliveredOrders = rawOrders.filter(o => String(o.status || '').toLowerCase() === 'delivered').length;
    const totalSpend = rawOrders.reduce((sum, o) => sum + parseFloat(o.grand_total || o.total_amount || 0), 0);

    return { totalOrders, activeOrders, deliveredOrders, totalSpend };
  }, [rawOrders]);

  // Filtered & Sorted Orders
  const filteredOrders = useMemo(() => {
    return rawOrders
      .filter((order) => {
        // Status filter
        if (filterStatus !== 'all' && String(order.status || '').toLowerCase() !== filterStatus) {
          return false;
        }

        // Search query (Order number, recipient name, item product name or SKU)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchOrderNumber = String(order.order_number || '').toLowerCase().includes(q);
          const matchRecipient = String(order.shipping_full_address?.name || '').toLowerCase().includes(q);
          const matchCity = String(order.shipping_full_address?.city || '').toLowerCase().includes(q);
          const matchItems = Array.isArray(order.items) && order.items.some(it =>
            String(it.product_name || '').toLowerCase().includes(q) ||
            String(it.product_sku || '').toLowerCase().includes(q)
          );

          return matchOrderNumber || matchRecipient || matchCity || matchItems;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        }
        if (sortBy === 'amount_high') {
          return parseFloat(b.grand_total || b.total_amount || 0) - parseFloat(a.grand_total || a.total_amount || 0);
        }
        if (sortBy === 'amount_low') {
          return parseFloat(a.grand_total || a.total_amount || 0) - parseFloat(b.grand_total || b.total_amount || 0);
        }
        return 0;
      });
  }, [rawOrders, filterStatus, searchQuery, sortBy]);

  const clearFilters = () => {
    setFilterStatus('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="orders-page-wrapper py-6 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-6">
          <div className="h-4 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-2xl w-72 mb-6 animate-pulse"></div>

          {/* KPI Skeleton Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-primary-100 p-4 animate-pulse"></div>
            ))}
          </div>

          {/* Filter Bar Skeleton */}
          <div className="h-14 bg-white rounded-2xl border border-primary-100 p-3 animate-pulse"></div>

          {/* Card Skeletons */}
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white rounded-2xl border border-primary-100 p-5 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="orders-page-wrapper min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border-2 border-red-200 shadow-sm">
          <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Unable to Retrieve Orders</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            There was a problem syncing with the wholesale ledger. Please check your connection and retry.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="w-full sm:w-auto px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={15} />
              <span>Retry Sync</span>
            </button>
            <Link
              href="/product/productlistingpage"
              className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs sm:text-sm font-bold transition-all"
            >
              Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Zero Orders State (Global)
  if (rawOrders.length === 0) {
    return (
      <div className="orders-page-wrapper min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border-2 border-primary-200/90 shadow-sm">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-100 via-primary-50 to-white border-2 border-primary-200 flex items-center justify-center shadow-md text-primary-600">
              <Package size={44} className="stroke-[1.6]" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2">No Wholesale Orders Yet</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed">
            Your wholesale ledger is empty. Discover verified fabric rolls, garments, and factory lots directly from verified mills.
          </p>

          <Link
            href="/product/productlistingpage"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 hover:from-primary-800 hover:to-primary-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <ShoppingBag size={17} />
            <span>Explore Wholesale Catalog</span>
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page-wrapper py-5 sm:py-8 lg:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-6 sm:space-y-8">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-primary-700 transition-colors">
            Home
          </Link>
          <ChevronRight size={13} className="text-gray-400" />
          <span className="text-gray-900 font-bold">Wholesale Orders Ledger</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Wholesale Orders Ledger
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Direct mill transactions, automated GST tax invoices & live logistics dispatch tracking
            </p>
          </div>

          <Link
            href="/product/productlistingpage"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-primary-50 text-primary-900 font-bold text-xs sm:text-sm border-2 border-primary-200 hover:border-primary-400 shadow-2xs hover:shadow-xs transition-all self-start sm:self-auto cursor-pointer"
          >
            <ShoppingBag size={16} className="text-primary-600" />
            <span>New Wholesale Order</span>
          </Link>
        </div>

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">

          {/* Card 1: Total Orders */}
          <div className="bg-white p-4 rounded-2xl border-2 border-primary-100 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-700 flex-shrink-0">
              <Package size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Total Orders
              </span>
              <span className="text-lg sm:text-xl font-black text-gray-900">
                {metrics.totalOrders}
              </span>
            </div>
          </div>

          {/* Card 2: Active In Transit */}
          <div className="bg-white p-4 rounded-2xl border-2 border-sky-100 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 flex-shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                In Transit / Active
              </span>
              <span className="text-lg sm:text-xl font-black text-gray-900">
                {metrics.activeOrders}
              </span>
            </div>
          </div>

          {/* Card 3: Delivered & Verified */}
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-100 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <CheckCircle size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Delivered
              </span>
              <span className="text-lg sm:text-xl font-black text-gray-900">
                {metrics.deliveredOrders}
              </span>
            </div>
          </div>

          {/* Card 4: Total Wholesale Volume */}
          <div className="bg-white p-4 rounded-2xl border-2 border-primary-200/90 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary-100/70 border border-primary-300 flex items-center justify-center text-primary-800 flex-shrink-0">
              <Wallet size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Trade Volume
              </span>
              <span className="text-lg sm:text-xl font-black text-primary-900">
                ₹{metrics.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

        </div>

        {/* Search, Filter & Sort Controls Box */}
        <div className="bg-white rounded-2xl border-2 border-primary-100/90 shadow-2xs p-4 sm:p-5 space-y-4">

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">

            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order #, product name, lot SKU, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all focus:outline-none font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <SlidersHorizontal size={14} className="text-gray-500 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:bg-white focus:border-primary-500 focus:outline-none transition-all cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="amount_high">Sort: Amount: High to Low</option>
                <option value="amount_low">Sort: Amount: Low to High</option>
              </select>
            </div>

          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-gray-100">
            {statusFilters.map((filter) => {
              const count = statusCounts[filter.value] || 0;
              const isActive = filterStatus === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setFilterStatus(filter.value)}
                  className={`order-filter-pill px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 border transition-all ${isActive
                      ? 'active text-white border-transparent'
                      : 'bg-gray-50/80 hover:bg-primary-50/60 text-gray-700 hover:text-primary-900 border-gray-200/80'
                    }`}
                >
                  <span>{filter.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/25 text-white' : 'bg-gray-200/80 text-gray-700'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Escrow Guarantee Assurance Callout */}
        <div className="p-3.5 sm:p-4 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
            <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
            <span>100% Escrow Trade Assurance Active across all direct mill purchases & dispatch tracking.</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold hidden md:inline">
            Automated GST Tax Invoices
          </span>
        </div>

        {/* Filtered Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Search size={24} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              No matching wholesale orders found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-5 max-w-sm mx-auto">
              We couldn't find any orders matching your search or active filter status.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-900 rounded-xl text-xs font-bold border border-primary-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              <span>Clear Search & Filters</span>
            </button>
          </div>
        ) : (
          /* Active Orders List */
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 px-1">
              <span>
                Showing <strong>{filteredOrders.length}</strong> of {rawOrders.length} wholesale orders
              </span>
              {(filterStatus !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-primary-700 hover:text-primary-800 font-bold underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {filteredOrders.map((order) => (
              <OrderCard key={order.id || order.order_number} order={order} />
            ))}
          </div>
        )}

        {/* Bottom Catalog Discovery Strip */}
        <div className="p-6 bg-white rounded-2xl border-2 border-primary-100 text-center space-y-2 shadow-2xs">
          <h3 className="text-sm font-bold text-gray-900">Looking to source more bulk materials?</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Browse newly added factory batches, seasonal inventory drops, and wholesale discounts.
          </p>
          <div className="pt-2">
            <Link
              href="/product/productlistingpage"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-50 hover:bg-primary-100 text-primary-900 text-xs sm:text-sm font-bold rounded-xl border border-primary-200 transition-colors shadow-2xs"
            >
              <ShoppingBag size={15} className="text-primary-600" />
              <span>Browse Mill Catalog</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
