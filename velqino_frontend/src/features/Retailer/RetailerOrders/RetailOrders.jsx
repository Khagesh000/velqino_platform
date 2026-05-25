'use client';

import React, { useState, lazy, Suspense, useEffect } from 'react';
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar';
import { useGetRetailerOrdersQuery, useUpdateOrderStatusMutation, useCancelOrderMutation } from '@/redux/retailer/slices/retailerOrdersSlice';
import { toast } from 'react-toastify';

// Lazy load all components
const OrdersTable = lazy(() => import('./components/OrdersTable'));
const OrderStatus = lazy(() => import('./components/OrderStatus'));
const OrderDetails = lazy(() => import('./components/OrderDetails'));
const ReturnsManagement = lazy(() => import('./components/ReturnsManagement'));
const OrderHistory = lazy(() => import('./components/OrderHistory'));
const BulkActions = lazy(() => import('./components/BulkActions'));

// Loading placeholders
const TablePlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />;
const DetailsPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />;
const SidebarPlaceholder = () => <div className="w-full h-[250px] bg-gray-100 rounded-xl animate-pulse" />;

export default function RetailerOrders() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // API calls
  const { data: ordersData, isLoading, refetch } = useGetRetailerOrdersQuery({
    page: currentPage,
    per_page: 20,
    search: searchQuery,
    status: statusFilter,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const orders = ordersData?.data || [];  // ✅ Orders are directly in data array
  const totalOrders = ordersData?.data?.length || 0;  // ✅ Length of array
  const totalPages = Math.ceil(totalOrders / 20) || 1;  // ✅ Calculate from array length

  useEffect(() => {
    if (refreshTrigger) refetch();
  }, [refreshTrigger, refetch]);

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
    if (window.confirm('Cancel this order?')) {
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
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <RetailerNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`transition-all duration-300 p-4 lg:p-6 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage all customer orders</p>
          </div>

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Orders Table */}
            <div className="lg:col-span-2">
              <div style={{ minHeight: '500px' }}>
                <Suspense fallback={<TablePlaceholder />}>
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
            </div>

            {/* Right Column - Order Details */}
            <div className="space-y-6">
              <div style={{ minHeight: '400px' }}>
                <Suspense fallback={<DetailsPlaceholder />}>
                  <OrderStatus 
                    selectedOrder={selectedOrder}
                    onStatusUpdate={handleStatusUpdate}
                    onRefresh={refetch}
                  />
                </Suspense>
              </div>
              
              <div style={{ minHeight: '250px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <OrderDetails selectedOrder={selectedOrder} />
                </Suspense>
              </div>
            </div>

          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            
            <div style={{ minHeight: '300px' }}>
              <Suspense fallback={<SidebarPlaceholder />}>
                <ReturnsManagement 
                selectedOrder={selectedOrder}
                retailerOrders={orders} />
              </Suspense>
            </div>
            
            <div className="space-y-6">
              <div style={{ minHeight: '200px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <BulkActions 
                    selectedOrders={selectedOrder ? [selectedOrder] : []}
                    onComplete={() => setRefreshTrigger(prev => prev + 1)}
                  />
                </Suspense>
              </div>
              
              <div style={{ minHeight: '250px' }}>
                <Suspense fallback={<SidebarPlaceholder />}>
                  <OrderHistory selectedOrder={selectedOrder} orders={orders} />
                </Suspense>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}