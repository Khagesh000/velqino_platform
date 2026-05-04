"use client";

import React, { useState, useEffect } from 'react';
import { useGetOrderQuery } from '@/redux/wholesaler/slices/ordersSlice';
import { 
  X, Clock, User, Package, CreditCard, Truck, FileText, 
  MessageCircle, Download, Printer, Edit, ChevronRight, 
  CheckCircle, AlertCircle, MapPin, Phone, Mail, Calendar, 
  MoreVertical, Loader2
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/OrdersManagment/OrderDetailsPanel.scss';

export default function OrderDetailsPanel({ orderId, onClose }) {
  const [activeTab, setActiveTab] = useState('timeline');
  
  // ✅ Fetch real order data
  const { data: orderData, isLoading, error } = useGetOrderQuery(orderId);
  
  const order = orderData?.data;
  
  // Build timeline from order status
  const getTimeline = (order) => {
    if (!order) return [];
    
    const timeline = [
      { status: 'Order Placed', date: order.created_at, by: order.customer?.name || 'Customer', icon: Clock, completed: true },
    ];
    
    if (order.status === 'confirmed' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
      timeline.push({ status: 'Payment Confirmed', date: order.created_at, by: 'System', icon: CreditCard, completed: true });
    }
    
    if (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
      timeline.push({ status: 'Processing', date: order.updated_at, by: 'Warehouse', icon: Package, completed: true });
    }
    
    if (order.status === 'shipped' || order.status === 'delivered') {
      timeline.push({ status: 'Shipped', date: order.updated_at, by: 'Logistics', icon: Truck, completed: true });
    }
    
    if (order.status === 'delivered') {
      timeline.push({ status: 'Delivered', date: order.delivered_at || order.updated_at, by: 'Courier', icon: CheckCircle, completed: true });
    }
    
    return timeline;
  };
  
  const timeline = getTimeline(order);
  
  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'notes', label: 'Notes', icon: FileText }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white border-l border-gray-200 w-full max-w-2xl h-full flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white border-l border-gray-200 w-full max-w-2xl h-full flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
          <p className="text-gray-600">Failed to load order details</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-panel bg-white border-l border-gray-200 w-full max-w-2xl h-full flex flex-col pt-[65px] sm:pt-0">
      {/* Header */}
      <div className="order-details-header px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Package size={16} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Order Details</h3>
            <p className="text-xs sm:text-sm text-gray-500">{order.order_number}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <Printer size={14} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <Download size={14} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <button onClick={onClose} className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <X size={14} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="order-details-tabs px-4 sm:px-6 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`order-details-tab px-2 sm:px-4 py-1.5 sm:py-3 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.substring(0, 3)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="order-details-content p-3 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        
        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="timeline-container">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4 flex items-center gap-2 sticky top-0 bg-white py-2 z-10">
              <Clock size={12} className="sm:w-4 sm:h-4 text-gray-400" />
              Order Timeline
            </h4>
            <div className="timeline relative">
              {timeline.map((event, index) => (
                <div key={index} className="timeline-item mb-3 sm:mb-6 relative pl-5 sm:pl-8">
                  <div className={`timeline-dot absolute left-0 w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full border-2 ${
                    event.completed 
                      ? 'bg-success-500 border-success-200' 
                      : 'bg-gray-300 border-gray-200'
                  }`} />
                  {index < timeline.length - 1 && (
                    <div className={`timeline-line absolute left-[4px] sm:left-[7px] top-3 sm:top-4 w-0.5 h-8 sm:h-12 ${
                      event.completed ? 'bg-success-200' : 'bg-gray-200'
                    }`} />
                  )}
                  <div className="timeline-content">
                    <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-0.5 sm:gap-1">
                      <h5 className="text-xs sm:text-sm font-medium text-gray-900">{event.status}</h5>
                      <span className="text-xxs sm:text-xs text-gray-500">{formatDate(event.date)}</span>
                    </div>
                    {event.by && (
                      <p className="text-xxs sm:text-xs text-gray-500 mt-0.5">by {event.by}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="items-container">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
              <Package size={12} className="sm:w-4 sm:h-4 text-gray-400" />
              Items Purchased
            </h4>
            <div className="space-y-3 sm:space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="item-card p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-xl sm:text-2xl">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h5 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{item.product_name}</h5>
                          <p className="text-xxs sm:text-xs text-gray-500 mt-0.5">SKU: {item.product_sku}</p>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                          ₹{item.total?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 sm:mt-2">
                        <span className="text-xxs sm:text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Totals */}
              <div className="total-section pt-3 sm:pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm mt-1 sm:mt-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹{order.shipping_charge?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm mt-1 sm:mt-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{order.tax?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm sm:text-base font-semibold mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary-600">₹{order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="payment-container">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
              <CreditCard size={12} className="sm:w-4 sm:h-4 text-gray-400" />
              Payment Information
            </h4>
            <div className="payment-card p-3 sm:p-4 bg-gray-50 rounded-xl space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Status</span>
                <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xxs sm:text-xs font-medium rounded-full ${
                  order.payment_status === 'paid' ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'
                }`}>
                  {order.payment_status || 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Method</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 capitalize">{order.payment_method || 'COD'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Date</span>
                <span className="text-xs sm:text-sm text-gray-900">{formatDate(order.created_at)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div className="shipping-container space-y-4 sm:space-y-6">
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                <Truck size={12} className="sm:w-4 sm:h-4 text-gray-400" />
                Shipping Information
              </h4>
              <div className="shipping-card p-3 sm:p-4 bg-gray-50 rounded-xl space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <MapPin size={12} className="sm:w-4 sm:h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{order.shipping_address?.full_name}</p>
                    <p className="text-xxs sm:text-xs text-gray-600 mt-1">
                      {order.shipping_address?.address}<br />
                      {order.shipping_address?.city}, {order.shipping_address?.state}<br />
                      {order.shipping_address?.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Phone size={12} className="sm:w-4 sm:h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-900">{order.shipping_address?.phone}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                <Truck size={12} className="sm:w-4 sm:h-4 text-gray-400" />
                Tracking Information
              </h4>
              <div className="tracking-card p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Tracking No.</span>
                  <span className="text-xs sm:text-sm font-medium text-primary-600">{order.tracking_number || 'Not available'}</span>
                </div>
                <div className="flex items-center justify-between mt-1 sm:mt-2">
                  <span className="text-xs sm:text-sm text-gray-600">Delivery Type</span>
                  <span className="text-xs sm:text-sm text-gray-900 capitalize">{order.delivery_type || 'Standard'}</span>
                </div>
                {order.tracking_number && (
                  <button className="w-full mt-2 sm:mt-3 px-3 py-1.5 sm:py-2 bg-primary-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-primary-600 transition-all">
                    Track Package
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="notes-container">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
              <FileText size={12} className="sm:w-4 sm:h-4 text-gray-400" />
              Order Notes
            </h4>
            
            <div className="notes-list space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {order.notes ? (
                <div className="note-item p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs sm:text-sm text-gray-600">{order.notes}</p>
                  <p className="text-xxs sm:text-xs text-gray-400 mt-2">{formatDate(order.updated_at)}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">No notes available</p>
              )}
            </div>

            {/* Add Note */}
            <div className="add-note">
              <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <MessageCircle size={12} className="sm:w-4 sm:h-4 text-gray-400" />
                Add a Note
              </h5>
              <textarea 
                placeholder="Write your note here..."
                rows="2"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <button className="mt-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-primary-600 transition-all">
                Add Note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="order-details-footer px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all order-2 sm:order-1">
          <Edit size={12} className="sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
          <span className="sm:hidden">Edit</span>
          <span className="hidden sm:inline">Edit Order</span>
        </button>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <button className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-error-600 bg-error-50 rounded-lg hover:bg-error-100 transition-all">
            <span className="sm:hidden">Cancel</span>
            <span className="hidden sm:inline">Cancel Order</span>
          </button>
          <button className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all">
            <span className="sm:hidden">Update</span>
            <span className="hidden sm:inline">Update Status</span>
          </button>
        </div>
      </div>
    </div>
  );
}