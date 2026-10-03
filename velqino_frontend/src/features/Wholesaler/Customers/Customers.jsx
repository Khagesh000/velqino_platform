"use client";

import React, { useState, useMemo, lazy, Suspense, useRef, useEffect } from 'react';
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar';
import { useGetOrdersQuery } from '@/redux/wholesaler/slices/ordersSlice';
import { useListRetailersQuery } from '@/redux/retailer/slices/retailerSlice';
import { 
  Users, 
  CheckCircle, 
  ShoppingBag, 
  DollarSign, 
  Award, 
  RefreshCw, 
  Sparkles, 
  Building,
  TrendingUp,
  ArrowUpRight
} from '@/utils/icons';

// Lazy load non-critical components
const CustomersTable = lazy(() => import('./components/CustomersTable'));
const CustomerDetailsPanel = lazy(() => import('./components/CustomerDetailsPanel'));
const CustomerFilters = lazy(() => import('./components/CustomerFilters'));
const QuickActions = lazy(() => import('./components/QuickActions'));
const ImportExport = lazy(() => import('./components/ImportExport'));
import ErrorBoundary from '@/shared/ErrorBoundary';

// Structured executive skeleton placeholders
const KPICardsPlaceholder = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-slate-200" />
          <div className="w-12 h-5 rounded-md bg-slate-100" />
        </div>
        <div className="space-y-1.5">
          <div className="w-20 h-6 rounded-md bg-slate-200" />
          <div className="w-28 h-3.5 rounded bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

const TablePlaceholder = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse shadow-xs space-y-4">
    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
      <div className="space-y-2">
        <div className="w-48 h-5 rounded bg-slate-200" />
        <div className="w-32 h-3.5 rounded bg-slate-100" />
      </div>
      <div className="w-32 h-8 rounded-lg bg-slate-100" />
    </div>
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-12 w-full rounded-xl bg-slate-100/80" />
      ))}
    </div>
  </div>
);

const DetailsPlaceholder = () => (
  <div className="w-full h-full bg-white p-6 animate-pulse space-y-6">
    <div className="w-48 h-6 rounded bg-slate-200" />
    <div className="space-y-3">
      <div className="w-full h-24 rounded-xl bg-slate-100" />
      <div className="w-full h-40 rounded-xl bg-slate-100" />
    </div>
  </div>
);

const FiltersPlaceholder = () => (
  <div className="w-full h-20 bg-white rounded-2xl border border-slate-200/80 animate-pulse shadow-2xs" />
);

const QuickActionsPlaceholder = () => (
  <div className="w-full h-20 bg-white rounded-2xl border border-slate-200/80 animate-pulse shadow-2xs" />
);

const ImportExportPlaceholder = () => (
  <div className="w-48 h-10 bg-white rounded-xl border border-slate-200 animate-pulse shadow-2xs" />
);

export default function Customers() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [retailerParams, setRetailerParams] = useState({});

  // Client-side cache for instantaneous zero-flicker loading
  const [cachedData, setCachedData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('velqino_wholesaler_customers_cache');
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Fetch orders and retailers data
  const { 
    data: ordersData, 
    isLoading: ordersLoading, 
    isFetching: ordersFetching,
    refetch: refetchOrders 
  } = useGetOrdersQuery({ per_page: 500 });

  const { 
    data: retailersData, 
    isLoading: retailersLoading, 
    isFetching: retailersFetching,
    refetch: refetchRetailers 
  } = useListRetailersQuery(retailerParams);

  const isFetching = ordersFetching || retailersFetching;
  const isLoading = (ordersLoading || retailersLoading) && (!cachedData || cachedData.length === 0);
  const isCacheSource = !ordersData && !retailersData && !!cachedData;

  // Extract unique locations from retailers data and orders data
  const uniqueLocations = useMemo(() => {
    const rawRetailers = retailersData?.data?.retailers || retailersData?.data || retailersData?.retailers || [];
    const retailers = Array.isArray(rawRetailers) ? rawRetailers : [];
    const rawOrders = ordersData?.data?.orders || ordersData?.data || ordersData?.orders || [];
    const orders = Array.isArray(rawOrders) ? rawOrders : [];

    const cities = new Set();
    retailers.forEach(r => {
      if (r.city) cities.add(r.city);
    });
    orders.forEach(o => {
      if (o.shipping_city) cities.add(o.shipping_city);
      if (o.city) cities.add(o.city);
    });

    return Array.from(cities).filter(Boolean).sort();
  }, [retailersData, ordersData]);

  // Consolidate unified customer directory with defensive data parsing
  const allCustomers = useMemo(() => {
    const rawRetailers = retailersData?.data?.retailers || retailersData?.data || retailersData?.retailers || [];
    const retailers = Array.isArray(rawRetailers) ? rawRetailers : [];
    const rawOrders = ordersData?.data?.orders || ordersData?.data || ordersData?.orders || [];
    const orders = Array.isArray(rawOrders) ? rawOrders : [];

    // Fallback to cached data if network payloads are empty
    if (retailers.length === 0 && orders.length === 0 && cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
      return cachedData;
    }

    const customerMap = new Map();

    // 1. Map registered retailers
    retailers.forEach(retailer => {
      const rId = retailer.id || retailer.user_id || retailer.user?.id;
      if (!rId) return;
      const email = retailer.user?.email || retailer.email || '';
      const name = retailer.business_name || retailer.store_name || retailer.user?.name || retailer.user?.email || 'Retailer';
      const phone = retailer.mobile || retailer.phone || retailer.user?.mobile || 'N/A';
      const city = retailer.city || retailer.address?.city || 'N/A';
      const state = retailer.state || retailer.address?.state || '';
      const is_active = retailer.is_active !== undefined ? retailer.is_active : true;

      customerMap.set(String(rId), {
        id: rId,
        user_id: rId,
        name,
        email,
        phone,
        business_name: retailer.business_name || name,
        city,
        state,
        orders: 0,
        total_spent: 0,
        last_order: null,
        status: is_active ? 'active' : 'inactive',
        joined_at: retailer.created_at || retailer.date_joined || null
      });
    });

    // 2. Aggregate orders
    orders.forEach(order => {
      const rId = order.retailer_id ? String(order.retailer_id) : (order.retailer ? String(order.retailer) : null);

      let customer = null;
      if (rId && customerMap.has(rId)) {
        customer = customerMap.get(rId);
      } else if (order.customer_email) {
        for (const c of customerMap.values()) {
          if (c.email && c.email.toLowerCase() === order.customer_email.toLowerCase()) {
            customer = c;
            break;
          }
        }
      }

      // If buyer not yet in retailer table, register from order records
      if (!customer && (order.customer_email || order.customer_name || rId)) {
        const syntheticId = rId || `cust_${(order.customer_email || Math.random().toString(36).substr(2, 9)).replace(/[^a-zA-Z0-9]/g, '_')}`;
        customer = {
          id: syntheticId,
          user_id: syntheticId,
          name: order.customer_name || order.retailer_name || order.customer_email || 'Retailer Buyer',
          email: order.customer_email || '',
          phone: order.customer_phone || order.phone || 'N/A',
          business_name: order.retailer_name || order.customer_name || 'Retailer Buyer',
          city: order.shipping_city || order.city || 'N/A',
          state: order.shipping_state || order.state || '',
          orders: 0,
          total_spent: 0,
          last_order: null,
          status: 'active',
          joined_at: order.created_at || null
        };
        customerMap.set(syntheticId, customer);
      }

      if (customer) {
        customer.orders += 1;
        customer.total_spent += parseFloat(order.total_amount) || 0;
        if (!customer.last_order || new Date(order.created_at) > new Date(customer.last_order)) {
          customer.last_order = order.created_at;
        }
      }
    });

    return Array.from(customerMap.values());
  }, [ordersData, retailersData, cachedData]);

  // Sync fresh response with sessionStorage cache
  useEffect(() => {
    if (allCustomers && allCustomers.length > 0) {
      setCachedData(allCustomers);
      try {
        sessionStorage.setItem('velqino_wholesaler_customers_cache', JSON.stringify(allCustomers));
      } catch (e) {}
    }
  }, [allCustomers]);

  // Filter customers locally for instantaneous UX
  const filteredCustomers = useMemo(() => {
    let result = [...allCustomers];

    if (appliedFilters.status && appliedFilters.status !== '') {
      result = result.filter(c => c.status === appliedFilters.status);
    }

    if (appliedFilters.city && appliedFilters.city !== 'all') {
      result = result.filter(c => (c.city || '').toLowerCase() === appliedFilters.city.toLowerCase());
    }

    if (appliedFilters.min_orders) {
      result = result.filter(c => c.orders >= parseInt(appliedFilters.min_orders, 10));
    }
    if (appliedFilters.max_orders) {
      result = result.filter(c => c.orders <= parseInt(appliedFilters.max_orders, 10));
    }

    if (appliedFilters.min_spent) {
      result = result.filter(c => c.total_spent >= parseFloat(appliedFilters.min_spent));
    }
    if (appliedFilters.max_spent) {
      result = result.filter(c => c.total_spent <= parseFloat(appliedFilters.max_spent));
    }

    if (appliedFilters.last_order_days && appliedFilters.last_order_days !== '') {
      const days = parseInt(appliedFilters.last_order_days, 10);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      result = result.filter(c => c.last_order && new Date(c.last_order) >= cutoffDate);
    }

    if (appliedFilters.search && appliedFilters.search.trim()) {
      const search = appliedFilters.search.toLowerCase().trim();
      result = result.filter(c => 
        (c.name || '').toLowerCase().includes(search) ||
        (c.email || '').toLowerCase().includes(search) ||
        (c.phone || '').includes(search) ||
        (c.business_name || '').toLowerCase().includes(search) ||
        (c.city || '').toLowerCase().includes(search)
      );
    }

    return result;
  }, [allCustomers, appliedFilters]);

  // Compute Executive KPI Stats
  const kpiStats = useMemo(() => {
    const totalAccounts = allCustomers.length;
    const activeAccounts = allCustomers.filter(c => c.status === 'active').length;
    const activePercent = totalAccounts > 0 ? Math.round((activeAccounts / totalAccounts) * 100) : 0;
    
    const cumulativeOrders = allCustomers.reduce((acc, c) => acc + (c.orders || 0), 0);
    const grossSpend = allCustomers.reduce((acc, c) => acc + (c.total_spent || 0), 0);
    const avgSpendPerBuyer = totalAccounts > 0 ? Math.round(grossSpend / totalAccounts) : 0;
    
    const highValueAccounts = allCustomers.filter(c => (c.total_spent || 0) >= 20000).length;

    return {
      totalAccounts,
      activeAccounts,
      activePercent,
      cumulativeOrders,
      grossSpend,
      avgSpendPerBuyer,
      highValueAccounts
    };
  }, [allCustomers]);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleFilterChange = (filters) => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    setAppliedFilters({});
    setRetailerParams({});
  };

  const handleSearch = (query) => {
    setAppliedFilters(prev => ({ ...prev, search: query }));
  };

  const handleRefresh = () => {
    refetchRetailers();
    refetchOrders();
  };

  const handleExport = ({ format, columns }) => {
    const params = new URLSearchParams();
    params.append('format', format);
    params.append('columns', columns.join(','));
    window.open(`/api/analytics/wholesaler/export-report/?${params.toString()}`, '_blank');
  };

  const handleImport = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/identity/retailers/import/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        body: formData
      });
      if (response.ok) {
        alert('Retailers imported successfully!');
        refetchRetailers();
      } else {
        alert('Import failed. Please check the file formatting and schema.');
      }
    } catch (error) {
      alert('Import failed due to network error.');
    }
  };

  const handleBulkEmail = () => {
    if (selectedCustomers.length === 0) {
      alert('Please select at least one retailer customer from the list.');
      return;
    }
    window.location.href = `/api/identity/bulk-email/?customer_ids=${selectedCustomers.join(',')}`;
  };

  const handleBulkSMS = () => {
    if (selectedCustomers.length === 0) {
      alert('Please select at least one retailer customer from the list.');
      return;
    }
    window.location.href = `/api/identity/bulk-sms/?customer_ids=${selectedCustomers.join(',')}`;
  };

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
                <Users size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Retailers & Customer Directory
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
                  Manage retail buyer accounts, monitor order volumes, and coordinate dispatch communications
                </p>
              </div>
            </div>
            
            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                title="Refresh customer accounts"
                className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all shadow-2xs disabled:opacity-50"
              >
                <RefreshCw size={17} className={isFetching ? 'animate-spin text-primary-600' : ''} />
              </button>

              <Suspense fallback={<ImportExportPlaceholder />}>
                <ImportExport 
                  selectedCount={selectedCustomers.length} 
                  onImport={handleImport} 
                  onExport={handleExport} 
                />
              </Suspense>
            </div>
          </div>

          {/* Executive KPI Stat Cards */}
          <div style={{ minHeight: '112px' }}>
            {isLoading ? (
              <KPICardsPlaceholder />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
                
                {/* 1. Total Retailers */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Accounts</span>
                    <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                      <Users size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      {kpiStats.totalAccounts}
                    </div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">
                      {kpiStats.activeAccounts} active · {kpiStats.totalAccounts - kpiStats.activeAccounts} inactive
                    </div>
                  </div>
                </div>

                {/* 2. Active Accounts */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Buyers</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      {kpiStats.activeAccounts}
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                      <TrendingUp size={11} />
                      {kpiStats.activePercent}% engagement rate
                    </div>
                  </div>
                </div>

                {/* 3. Cumulative Orders */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Orders</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <ShoppingBag size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      {kpiStats.cumulativeOrders}
                    </div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">
                      Dispatched across catalog
                    </div>
                  </div>
                </div>

                {/* 4. Gross Retailer Spend */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Spend</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black text-slate-900 tracking-tight truncate" title={formatINR(kpiStats.grossSpend)}>
                      {formatINR(kpiStats.grossSpend)}
                    </div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5 truncate">
                      Avg {formatINR(kpiStats.avgSpendPerBuyer)} / account
                    </div>
                  </div>
                </div>

                {/* 5. High Value Accounts */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">VIP / High Volume</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Award size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      {kpiStats.highValueAccounts}
                    </div>
                    <div className="text-xs font-medium text-amber-700 mt-0.5">
                      Spend ≥ ₹20k tier
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Quick Actions Ops Hub */}
          <div>
            <ErrorBoundary>
              <Suspense fallback={<QuickActionsPlaceholder />}>
                <QuickActions 
                  selectedCustomer={selectedCustomer}
                  selectedCount={selectedCustomers.length} 
                  onSendEmail={handleBulkEmail} 
                  onBulkSMS={handleBulkSMS} 
                />
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Multi-Criteria Filters Bar */}
          <div>
            <ErrorBoundary>
              <Suspense fallback={<FiltersPlaceholder />}>
                <CustomerFilters 
                  onFilterChange={handleFilterChange} 
                  onSearch={handleSearch} 
                  locations={uniqueLocations} 
                />
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Core Customers Directory Table */}
          <div>
            <ErrorBoundary>
              <Suspense fallback={<TablePlaceholder />}>
                <CustomersTable 
                  customers={filteredCustomers}
                  isLoading={isLoading}
                  onSelectCustomer={setSelectedCustomer}
                  onSelectCustomers={setSelectedCustomers}
                  onResetFilters={handleResetFilters}
                />
              </Suspense>
            </ErrorBoundary>
          </div>

        </div>
      </main>

      {/* Slide-over Customer Details Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[100000] overflow-hidden flex justify-end">
          {/* Backdrop with click to dismiss */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300" 
            onClick={() => setSelectedCustomer(null)} 
          />
          {/* Drawer container: full height, sleek, responsive on all screen sizes */}
          <div className="relative w-full sm:w-[480px] md:w-[540px] lg:w-[580px] h-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden">
            <ErrorBoundary>
              <Suspense fallback={<DetailsPlaceholder />}>
                <CustomerDetailsPanel 
                  customer={selectedCustomer} 
                  onClose={() => setSelectedCustomer(null)} 
                  onSendEmail={handleBulkEmail}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      )}
    </div>
  );
}
