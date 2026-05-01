"use client";

import React, { useState, useMemo, lazy, Suspense, useRef, useEffect } from 'react';
import WholesaleNavbar from '../WholesalerDashboard/components/WholesaleNavbar';
import { useGetOrdersQuery } from '@/redux/wholesaler/slices/ordersSlice';
import { useListRetailersQuery } from '@/redux/retailer/slices/retailerSlice';
// Lazy load components
const CustomersTable = lazy(() => import('./components/CustomersTable'));
const CustomerDetailsPanel = lazy(() => import('./components/CustomerDetailsPanel'));
const CustomerFilters = lazy(() => import('./components/CustomerFilters'));
const QuickActions = lazy(() => import('./components/QuickActions'));
const ImportExport = lazy(() => import('./components/ImportExport'));

// Loading placeholders
const TablePlaceholder = () => <div className="w-full h-[500px] bg-gray-50 rounded-xl animate-pulse" />;
const DetailsPlaceholder = () => <div className="w-full h-full bg-gray-50 animate-pulse" />;
const FiltersPlaceholder = () => <div className="w-full h-[120px] bg-gray-50 rounded-xl animate-pulse" />;
const QuickActionsPlaceholder = () => <div className="w-full h-[100px] bg-gray-50 rounded-xl animate-pulse" />;
const ImportExportPlaceholder = () => <div className="w-full h-[80px] bg-gray-50 rounded-xl animate-pulse" />;

export default function Customers() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});
  
  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useGetOrdersQuery({ per_page: 500 });
  const [retailerParams, setRetailerParams] = useState({});

  const { data: retailersData, isLoading: retailersLoading, refetch: refetchRetailers } = useListRetailersQuery(retailerParams);

  // ✅ Extract unique locations from retailers data
  const uniqueLocations = useMemo(() => {
    const retailers = retailersData?.data || [];
    return [...new Set(retailers.map(r => r.city).filter(Boolean))];
  }, [retailersData]);

  // ✅ Process customers with filters applied locally
  const filteredCustomers = useMemo(() => {
    const orders = ordersData?.data || [];
    const retailers = retailersData?.data || [];
    
    const customerMap = new Map();
    
    retailers.forEach(retailer => {
    customerMap.set(retailer.id, {  // ← Use retailer.id
      id: retailer.id,               // ← Use retailer.id
      user_id: retailer.id,          // ← Also set user_id for consistency
      name: retailer.business_name || retailer.user?.email || 'Retailer',
      email: retailer.user?.email || '',
      phone: retailer.mobile || retailer.user?.mobile || '',
      business_name: retailer.business_name,
      city: retailer.city,
      state: retailer.state,
      orders: 0,
      total_spent: 0,
      last_order: null,
      status: retailer.is_active ? 'active' : 'inactive',
      joined_at: retailer.created_at
    });
  });
    
    orders.forEach(order => {
      const customerId = order.retailer_id;
      if (customerId && customerMap.has(customerId)) {
        const customer = customerMap.get(customerId);
        customer.orders += 1;
        customer.total_spent += order.total_amount || 0;
        if (!customer.last_order || new Date(order.created_at) > new Date(customer.last_order)) {
          customer.last_order = order.created_at;
        }
      }
    });
    
    let result = Array.from(customerMap.values());
    
    // ✅ Apply filters locally
    if (appliedFilters.status && appliedFilters.status !== '') {
      result = result.filter(c => c.status === appliedFilters.status);
    }
    
    if (appliedFilters.city && appliedFilters.city !== 'all') {
      result = result.filter(c => c.city === appliedFilters.city);
    }
    
    if (appliedFilters.min_orders) {
      result = result.filter(c => c.orders >= parseInt(appliedFilters.min_orders));
    }
    if (appliedFilters.max_orders) {
      result = result.filter(c => c.orders <= parseInt(appliedFilters.max_orders));
    }
    
    if (appliedFilters.min_spent) {
      result = result.filter(c => c.total_spent >= parseFloat(appliedFilters.min_spent));
    }
    if (appliedFilters.max_spent) {
      result = result.filter(c => c.total_spent <= parseFloat(appliedFilters.max_spent));
    }
    
    if (appliedFilters.last_order_days && appliedFilters.last_order_days !== '') {
      const days = parseInt(appliedFilters.last_order_days);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      result = result.filter(c => c.last_order && new Date(c.last_order) >= cutoffDate);
    }
    
    if (appliedFilters.search) {
      const search = appliedFilters.search.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone.includes(search)
      );
    }
    
    return result;
  }, [ordersData, retailersData, appliedFilters]);

  const isLoading = ordersLoading || retailersLoading;

  // Add this after your state declarations (around line 25)
const isFirstRender = useRef(true);

useEffect(() => {
    // Skip first render (initial load already happened)
    if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
    }
    
    console.log('🔄 [USE_EFFECT] Filters changed, refetching with:', appliedFilters);
    
    const params = {};
    if (appliedFilters.min_orders) params.min_orders = appliedFilters.min_orders;
    if (appliedFilters.max_orders) params.max_orders = appliedFilters.max_orders;
    if (appliedFilters.min_spent) params.min_spent = appliedFilters.min_spent;
    if (appliedFilters.max_spent) params.max_spent = appliedFilters.max_spent;
    if (appliedFilters.status && appliedFilters.status !== '') params.status = appliedFilters.status;
    if (appliedFilters.city && appliedFilters.city !== 'all') params.city = appliedFilters.city;
    if (appliedFilters.last_order_days && appliedFilters.last_order_days !== '') params.last_order_days = appliedFilters.last_order_days;
    
    console.log('🔄 [USE_EFFECT] Calling refetchOrders with:', params);
    refetchOrders(params);
    
}, [appliedFilters]);

  const handleFilterChange = (filters) => {
    console.log('📊 Applying filters:', filters);
    setAppliedFilters(filters);
    
    const params = {};
    if (filters.min_orders) params.min_orders = filters.min_orders;
    if (filters.max_orders) params.max_orders = filters.max_orders;
    if (filters.min_spent) params.min_spent = filters.min_spent;
    if (filters.max_spent) params.max_spent = filters.max_spent;
    if (filters.status && filters.status !== '') params.status = filters.status;
    if (filters.city && filters.city !== 'all') params.city = filters.city;
    
    console.log('🔄 Setting retailerParams to:', params);
    setRetailerParams(params);
};

  const handleSearch = (query) => {
    setAppliedFilters(prev => ({ ...prev, search: query }));
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
      if (response.ok) alert('Import successful!');
      else alert('Import failed');
    } catch (error) {
      alert('Import failed');
    }
  };

  const handleBulkEmail = () => {
    window.location.href = `/api/identity/bulk-email/?customer_ids=${selectedCustomers.join(',')}`;
  };

  const handleBulkSMS = () => {
    window.location.href = `/api/identity/bulk-sms/?customer_ids=${selectedCustomers.join(',')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <WholesaleNavbar isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
      
      <main className={`transition-all duration-300 p-3 sm:p-4 lg:p-6 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-sm text-gray-500">Manage your retail customers</p>
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <Suspense fallback={<ImportExportPlaceholder />}>
                <ImportExport selectedCount={selectedCustomers.length} onImport={handleImport} onExport={handleExport} />
              </Suspense>
            </div>
          </div>

          <div className="mb-6">
            <Suspense fallback={<QuickActionsPlaceholder />}>
              <QuickActions selectedCount={selectedCustomers.length} onBulkEmail={handleBulkEmail} onBulkSMS={handleBulkSMS} />
            </Suspense>
          </div>

          <div className="mb-6">
            <Suspense fallback={<FiltersPlaceholder />}>
              <CustomerFilters onFilterChange={handleFilterChange} onSearch={handleSearch} locations={uniqueLocations} />
            </Suspense>
          </div>

          <div className="mt-6">
            <Suspense fallback={<TablePlaceholder />}>
              <CustomersTable 
                customers={filteredCustomers}
                isLoading={isLoading}
                onSelectCustomer={setSelectedCustomer}
                onSelectCustomers={setSelectedCustomers}
              />
            </Suspense>
          </div>
        </div>
      </main>

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />
          <div className="absolute inset-y-0 right-0 w-full sm:w-[480px] md:w-[560px] lg:w-[640px]">
            <Suspense fallback={<DetailsPlaceholder />}>
              <CustomerDetailsPanel customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}