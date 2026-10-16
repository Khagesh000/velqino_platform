"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../components/DashboardHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import { 
  useGetWishlistQuery, 
  useRemoveFromWishlistMutation, 
  useGetWishlistStatsQuery 
} from '../../../redux/wholesaler/slices/wishlistSlice';
import { useAddToCartMutation } from '../../../redux/wholesaler/slices/cartSlice';
import { 
  Heart, 
  ShoppingBag, 
  ShoppingCart, 
  Trash2, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  Wallet, 
  Tag, 
  Search, 
  X, 
  SlidersHorizontal, 
  ArrowRight,
  Package,
  AlertCircle
} from '../../../utils/icons';
import { toast } from 'react-toastify';
import WishlistCard from './components/WishlistCard';

export default function WishlistPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(16);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const { data, isLoading, isFetching, error, refetch } = useGetWishlistQuery({ page, per_page: perPage });
  const { data: statsData, refetch: refetchStats } = useGetWishlistStatsQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  // Handle data whether array or nested
  const wishlistItems = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

  const pagination = data?.pagination;
  const stats = statsData?.data || statsData;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    if (refetch) await refetch();
    if (refetchStats) await refetchStats();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success('Removed from wishlist');
      if (refetch) refetch();
      if (refetchStats) refetchStats();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to remove from wishlist');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    setAddingId(productId);
    try {
      await addToCart({
        product_id: productId,
        quantity: quantity,
        selected_size: '',
        selected_color: ''
      }).unwrap();
      toast.success('Item added to cart!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add item to cart');
    } finally {
      setAddingId(null);
    }
  };

  // KPI Statistics calculations
  const kpiStats = useMemo(() => {
    const totalCount = stats?.total_items || wishlistItems.length;
    const totalValue = Number(
      stats?.total_value || 
      wishlistItems.reduce((sum, item) => sum + (Number(item.product_price) || 0), 0)
    );
    const inStockCount = wishlistItems.filter((i) => i.product_stock !== 0).length;
    const discountedCount = wishlistItems.filter(
      (i) => Number(i.product_compare_price) > Number(i.product_price)
    ).length;
    const outOfStockCount = wishlistItems.filter((i) => i.product_stock === 0).length;

    return {
      totalCount,
      totalValue,
      inStockCount,
      discountedCount,
      outOfStockCount,
    };
  }, [wishlistItems, stats]);

  // Tab definitions with counts
  const filterTabs = [
    { value: 'all', label: 'All Items', count: kpiStats.totalCount },
    { value: 'in_stock', label: 'In Stock', count: kpiStats.inStockCount },
    { value: 'deals', label: 'Special Offers', count: kpiStats.discountedCount },
    { value: 'out_of_stock', label: 'Out of Stock', count: kpiStats.outOfStockCount },
  ];

  // Filtering & Sorting
  const filteredAndSortedItems = useMemo(() => {
    let result = [...wishlistItems];

    // Filter by tab
    if (filterTab === 'in_stock') {
      result = result.filter((i) => i.product_stock !== 0);
    } else if (filterTab === 'deals') {
      result = result.filter((i) => Number(i.product_compare_price) > Number(i.product_price));
    } else if (filterTab === 'out_of_stock') {
      result = result.filter((i) => i.product_stock === 0);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((i) => 
        String(i.product_name || '').toLowerCase().includes(q)
      );
    }

    // Sort items
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.added_at || 0) - new Date(a.added_at || 0);
      }
      if (sortBy === 'price_asc') {
        return (Number(a.product_price) || 0) - (Number(b.product_price) || 0);
      }
      if (sortBy === 'price_desc') {
        return (Number(b.product_price) || 0) - (Number(a.product_price) || 0);
      }
      if (sortBy === 'name') {
        return String(a.product_name || '').localeCompare(String(b.product_name || ''));
      }
      return 0;
    });

    return result;
  }, [wishlistItems, filterTab, searchQuery, sortBy]);

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
                    Customer Saved Wishlist &amp; Collections
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Live Inventory Sync
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  My Wishlist
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                  Saved items, special price-drop alerts, stock reservations, and one-click cart checkout.
                </p>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing || isFetching}
                  className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={14} className={isRefreshing || isFetching ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                  <span>{isRefreshing || isFetching ? 'Syncing...' : 'Sync Wishlist'}</span>
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

            {/* KPI Metrics Ribbon (4 Cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Saved Items</p>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight">
                    {kpiStats.totalCount}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-rose-600 font-semibold mt-0.5 inline-flex items-center gap-1">
                    <Heart size={11} className="hidden sm:inline-block fill-rose-500" />
                    <span>In your collection</span>
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Heart size={18} className="fill-rose-500 sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Estimated Value</p>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight">
                    ₹{kpiStats.totalValue.toLocaleString('en-IN')}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-indigo-600 font-semibold mt-0.5 inline-flex items-center gap-1">
                    <Wallet size={11} className="hidden sm:inline-block" />
                    <span>Combined price</span>
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Wallet size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">In Stock Ready</p>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight">
                    {kpiStats.inStockCount}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center gap-1">
                    <CheckCircle size={11} className="hidden sm:inline-block" />
                    <span>Available now</span>
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Deals &amp; Offers</p>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight">
                    {kpiStats.discountedCount}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-amber-600 font-semibold mt-0.5 inline-flex items-center gap-1">
                    <Tag size={11} className="hidden sm:inline-block" />
                    <span>Price drops</span>
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Tag size={18} className="sm:w-5 sm:h-5" />
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
                    placeholder="Search saved products by title..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-gray-50/80 border border-gray-200/90 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
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
                    <option value="recent">Recently Saved First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name">Product Name: A to Z</option>
                  </select>
                </div>
              </div>

              {/* Status Filter Tabs - Smooth Horizontal Scroll */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
                {filterTabs.map((tab) => {
                  const isActive = filterTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setFilterTab(tab.value)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200/80 text-gray-700'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area: Loading / Error / Empty / Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-2xs animate-pulse space-y-3">
                    <div className="aspect-square bg-gray-100 rounded-2xl w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                    <div className="h-5 bg-gray-100 rounded-lg w-1/3"></div>
                    <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
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
                    Failed to Load Saved Items
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
                    We could not retrieve your wishlist at this moment. Please check your connectivity and try again.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={handleManualRefresh}
                    className="px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs cursor-pointer"
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
            ) : wishlistItems.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-8 sm:p-14 text-center max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100 shadow-2xs">
                  <Heart size={32} className="fill-rose-500" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                    Your Wishlist is Empty
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                    You haven't saved any items yet. Explore trending products, wholesale collections, and curated catalog items right now!
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/product/productlistingpage"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white font-bold text-sm shadow-xs transition-all"
                    style={{ color: '#ffffff' }}
                  >
                    <ShoppingBag size={16} className="!text-white text-white" style={{ color: '#ffffff' }} />
                    <span className="!text-white text-white" style={{ color: '#ffffff' }}>Start Shopping Now</span>
                    <ArrowRight size={14} className="!text-white text-white" style={{ color: '#ffffff' }} />
                  </Link>
                </div>
              </div>
            ) : filteredAndSortedItems.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto border border-primary-100 shadow-2xs">
                  <Package size={28} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                    No Matching Saved Items Found
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
                    No items in your wishlist matched the search query "{searchQuery}" or tab filter.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterTab('all');
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs cursor-pointer"
                  >
                    Clear Filters
                  </button>
                  <Link
                    href="/product/productlistingpage"
                    className="px-5 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
                    style={{ color: '#ffffff' }}
                  >
                    <ShoppingBag size={14} className="!text-white text-white" style={{ color: '#ffffff' }} />
                    <span className="!text-white text-white" style={{ color: '#ffffff' }}>Browse Catalog</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {filteredAndSortedItems.map((item) => (
                  <WishlistCard
                    key={item.id || item.product_id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    onRemove={handleRemove}
                    isAdding={addingId === item.product_id}
                    isRemoving={removingId === item.product_id}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-4">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 text-gray-700 font-bold text-xs shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-extrabold text-gray-700 px-3">
                  Page {page} of {pagination.total_pages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                  disabled={page === pagination.total_pages}
                  className="px-3 py-2 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 text-gray-700 font-bold text-xs shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Bottom Executive CTA Ribbon (Button-wise Continue Shopping) */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-6 bg-white rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100 shadow-2xs">
                  <Heart size={20} className="fill-rose-500" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                    Discover More Trending Items
                  </h4>
                  <p className="text-xs text-gray-500">
                    Browse fresh catalog arrivals, top supplier deals, and save more favourites to your wishlist.
                  </p>
                </div>
              </div>

              <Link 
                href="/product/productlistingpage" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white font-bold text-xs sm:text-sm shadow-xs transition-all shrink-0 cursor-pointer"
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