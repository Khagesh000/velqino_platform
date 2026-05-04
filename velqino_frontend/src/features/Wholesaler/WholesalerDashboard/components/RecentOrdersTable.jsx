"use client";

import React, { useState } from 'react';
import { Eye, MoreHorizontal, Package, Clock, CheckCircle, XCircle, Loader2 } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/RecentOrdersTable.scss';
import { useRouter } from 'next/navigation';
import { useCancelOrderMutation, useDownloadInvoiceMutation } from '@/redux/wholesaler/slices/ordersSlice';
import { toast } from 'react-toastify';

export default function RecentOrdersTable({ orders, isLoading, currentPage, totalPages, totalCount, onPageChange, refetch }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [activeOrderMenu, setActiveOrderMenu] = useState(null);
  const perPage = 10;
  const router = useRouter();
  const [cancelOrder] = useCancelOrderMutation();

  const hasMore = currentPage < totalPages;
  const ordersList = orders || [];
  const [downloadInvoice] = useDownloadInvoiceMutation();
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return <Clock size={14} />;
      case 'processing': return <Package size={14} />;
      case 'delivered': return <CheckCircle size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'bg-warning-100 text-warning-600';
      case 'processing': return 'bg-primary-100 text-primary-600';
      case 'delivered': return 'bg-success-100 text-success-600';
      case 'cancelled': return 'bg-error-100 text-error-600';
      default: return 'bg-surface-2 text-tertiary';
    }
  };

  const getPaymentClass = (payment) => {
    switch(payment?.toLowerCase()) {
      case 'paid': return 'bg-success-100 text-success-600';
      case 'pending': return 'bg-warning-100 text-warning-600';
      case 'refunded': return 'bg-error-100 text-error-600';
      default: return 'bg-surface-2 text-tertiary';
    }
  };

  const handleViewOrder = (orderId) => {
    router.push(`/wholesaler/ordermanagment?orderId=${orderId}`);
    setActiveOrderMenu(null);
  };

  const handleMoreActions = (orderId) => {
    setActiveOrderMenu(activeOrderMenu === orderId ? null : orderId);
  };

  const handleCancelOrder = async (orderId) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder(orderId).unwrap();
        toast.success('Order cancelled successfully');
        refetch?.();
        setActiveOrderMenu(null);
      } catch (error) {
        const message = error?.data?.message || error?.response?.data?.message || error?.message || 'Failed to cancel order';
        toast.error(message);
      }
    }
  };

  const handlePrintInvoice = async (orderId) => {
    try {
        await downloadInvoice(orderId).unwrap();
    } catch (error) {
        console.error('Invoice download failed:', error);
    }
    setActiveOrderMenu(null);
};

  const handleNextPage = () => {
    if (hasMore && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  if (isLoading && ordersList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-light p-6 text-center">
        <Loader2 size={32} className="animate-spin text-primary-500 mx-auto mb-3" />
        <p className="text-sm text-tertiary">Loading orders...</p>
      </div>
    );
  }

  return (
  <div className="bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
    {/* Header */}
    <div className="flex items-center justify-between mb-4 lg:mb-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
          <Package size={18} className="lg:w-5 lg:h-5" />
        </div>
        <div>
          <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-primary">Recent Orders</h3>
          <p className="text-xs lg:text-sm text-tertiary">Latest orders from your store</p>
        </div>
      </div>
    </div>

    {(!ordersList || ordersList.length === 0) && (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package size={32} className="text-gray-400" />
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h4>
        <p className="text-sm text-gray-500">When retailers place orders, they will appear here</p>
      </div>
    )}

    {ordersList && ordersList.length > 0 && (
      <>
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-light">
                <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Order ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Items</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Total</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Payment</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersList.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-light/50 hover:bg-surface-1 transition-colors duration-150"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary-600">
                      {order.order_number || order.id}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-primary">{order.customer}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-surface-2 rounded-full text-xs text-secondary">
                      {order.items_count || order.items}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-primary">
                    ₹{(order.total_amount || order.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-xs text-tertiary">
                    {order.date || new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getPaymentClass(order.payment_status)}`}>
                      {order.payment_status || 'pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewOrder(order.order_number || order.id)}
                        className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors duration-150 text-tertiary hover:text-primary"
                      >
                        <Eye size={15} />
                      </button>

                      {/* Desktop Dropdown */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveOrderMenu(prev => prev === order.id ? null : order.id);
                          }}
                          className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors duration-150 text-tertiary hover:text-primary"
                        >
                          <MoreHorizontal size={15} />
                        </button>

                        {activeOrderMenu === order.id && (
                          <>
                            {/* Backdrop to close on outside click */}
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setActiveOrderMenu(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-light rounded-xl shadow-lg z-50 overflow-hidden">
                              <button
                                onClick={() => {
                                  handleCancelOrder(order.order_number || order.id);
                                  setActiveOrderMenu(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 transition-colors duration-150"
                              >
                                Cancel Order
                              </button>
                              <button
                                onClick={() => {
                                  handlePrintInvoice(order.order_number || order.id);
                                  setActiveOrderMenu(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-surface-1 text-primary transition-colors duration-150"
                              >
                                Print Invoice
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Cards */}
        <div className="lg:hidden space-y-3">
          {ordersList.map((order) => (
            <div
              key={order.id}
              className="bg-surface-1 rounded-xl p-4 border border-light"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-sm font-semibold text-primary block">
                    {order.order_number || order.id}
                  </span>
                  <span className="text-xs text-tertiary">
                    {order.date || new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Mobile Dropdown — relative on this wrapper */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveOrderMenu(prev => prev === order.id ? null : order.id);
                    }}
                    className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors duration-150"
                  >
                    <MoreHorizontal size={16} className="text-tertiary" />
                  </button>

                  {activeOrderMenu === order.id && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setActiveOrderMenu(null)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-light rounded-xl shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={() => {
                            handleCancelOrder(order.order_number || order.id);
                            setActiveOrderMenu(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 transition-colors duration-150"
                        >
                          Cancel Order
                        </button>
                        <button
                          onClick={() => {
                            handlePrintInvoice(order.order_number || order.id);
                            setActiveOrderMenu(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-surface-1 text-primary transition-colors duration-150"
                        >
                          Print Invoice
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Customer */}
              <div className="mb-3">
                <p className="text-xs text-tertiary mb-0.5">Customer</p>
                <p className="text-sm font-medium text-primary">{order.customer}</p>
              </div>

              {/* Items + Total */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-tertiary mb-0.5">Items</p>
                  <p className="text-sm font-medium text-primary">{order.items_count || order.items}</p>
                </div>
                <div>
                  <p className="text-xs text-tertiary mb-0.5">Total</p>
                  <p className="text-sm font-semibold text-primary">
                    ₹{(order.total_amount || order.amount).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Status + Payment + View */}
              <div className="flex items-center justify-between pt-3 border-t border-light">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getPaymentClass(order.payment_status)}`}>
                    {order.payment_status || 'pending'}
                  </span>
                </div>
                <button
                  onClick={() => handleViewOrder(order.order_number || order.id)}
                  className="p-1.5 bg-white border border-light rounded-lg hover:bg-primary-50 hover:border-primary-200 transition-colors duration-150 flex-shrink-0"
                >
                  <Eye size={14} className="text-tertiary" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalCount > perPage && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-light">
            <div className="text-xs text-tertiary">
              Showing {ordersList.length} of {totalCount} orders
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-light hover:bg-surface-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                Previous
              </button>
              <span className="text-xs text-tertiary">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!hasMore}
                className="px-3 py-1.5 text-xs rounded-lg border border-light hover:bg-surface-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </>
    )}
  </div>
);
}
