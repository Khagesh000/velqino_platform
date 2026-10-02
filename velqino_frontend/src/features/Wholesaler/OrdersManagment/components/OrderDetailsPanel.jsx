"use client";

import React, { useState, useEffect } from 'react';
import { 
  useGetOrderQuery, 
  useUpdateOrderStatusMutation, 
  useUpdatePaymentStatusMutation 
} from '@/redux/wholesaler/slices/ordersSlice';
import { 
  X, 
  Clock, 
  User, 
  Package, 
  CreditCard, 
  Truck, 
  FileText, 
  MessageCircle, 
  Download, 
  Printer, 
  Edit, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Loader2, 
  ChevronDown 
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/OrdersManagment/OrderDetailsPanel.scss';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  { value: 'processing', label: 'Processing', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-700' },
  { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700' },
  { value: 'delivered', label: 'Delivered', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-700' },
  { value: 'refund', label: 'Refund', color: 'bg-pink-100 text-pink-700' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  { value: 'paid', label: 'Paid', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'failed', label: 'Failed', color: 'bg-rose-100 text-rose-700' },
  { value: 'refunded', label: 'Refunded', color: 'bg-slate-100 text-slate-700' },
];

export default function OrderDetailsPanel({ orderId, onClose }) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [failedImages, setFailedImages] = useState({});
  const [newNote, setNewNote] = useState('');
  
  const { data: orderData, isLoading, error, refetch } = useGetOrderQuery(orderId);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  
  const order = orderData?.data;

  const getOptimizedThumb = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/w_140,h_140,c_fill,q_auto,f_auto/');
    }
    return url;
  };

  useEffect(() => {
    if (order?.status) {
      setSelectedStatus(order.status);
    }
    if (order?.payment_status) {
      setSelectedPaymentStatus(order.payment_status);
    }
  }, [order]);

  const getTimeline = (order) => {
    if (!order) return [];
    
    const timeline = [
      { status: 'Order Placed', date: order.created_at, by: order.customer_name || 'Retailer', icon: Clock, completed: true },
    ];
    
    if (order.status === 'confirmed' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' || order.status === 'completed') {
      timeline.push({ status: 'Payment Confirmed', date: order.created_at, by: 'System', icon: CreditCard, completed: true });
    }
    
    if (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' || order.status === 'completed') {
      timeline.push({ status: 'Processing in Warehouse', date: order.updated_at, by: 'Operations', icon: Package, completed: true });
    }
    
    if (order.status === 'shipped' || order.status === 'delivered' || order.status === 'completed') {
      timeline.push({ status: 'Shipped with Courier', date: order.updated_at, by: 'Logistics', icon: Truck, completed: true });
    }
    
    if (order.status === 'delivered' || order.status === 'completed') {
      timeline.push({ status: 'Delivered to Buyer', date: order.delivered_date || order.delivered_at || order.updated_at, by: 'Courier', icon: CheckCircle, completed: true });
    }
    
    return timeline;
  };
  
  const timeline = getTimeline(order);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handlePaymentStatusUpdate = async () => {
    if (selectedPaymentStatus === order?.payment_status) return;
    setIsUpdating(true);
    try {
      await updatePaymentStatus({ 
        orderId: orderId, 
        paymentStatus: selectedPaymentStatus 
      }).unwrap();
      await refetch();
    } catch (err) {
      console.error('Failed to update payment status:', err);
      setSelectedPaymentStatus(order?.payment_status);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === order?.status) return;
    setIsUpdating(true);
    try {
      await updateOrderStatus({ 
        orderId: orderId, 
        status: selectedStatus 
      }).unwrap();
      await refetch();
    } catch (err) {
      console.error('Failed to update status:', err);
      setSelectedStatus(order?.status);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white w-full h-full flex items-center justify-center p-8">
        <Loader2 size={36} className="animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white w-full h-full flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle size={44} className="text-rose-500 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-900 mb-1">Failed to load order details</h4>
          <p className="text-xs text-slate-500 mb-4">Please verify the order ID and try again</p>
          <button 
            type="button"
            onClick={onClose} 
            className="px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = order.subtotal || items.reduce((sum, item) => sum + (Number(item.total) || (item.quantity * item.price) || 0), 0);
  const total = order.total_amount || order.total || subtotal;

  return (
    <div className="order-details-panel bg-white h-full flex flex-col justify-between">
      {/* Top Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-2xs flex-shrink-0">
            <Package size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">{order.order_number}</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200/80">
                ₹{Number(total).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500">Placed on {formatDate(order.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button 
            type="button"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            title="Print"
          >
            <Printer size={16} />
          </button>
          <button 
            type="button"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            title="Download"
          >
            <Download size={16} />
          </button>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Unified All-in-One Content View (No Tabs!) */}
      <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
        
        {/* SECTION 1: Ordered Items Purchased */}
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package size={16} className="text-primary-600" />
              <span>Items Purchased ({items.length})</span>
            </h4>
            <span className="text-xs text-slate-400 font-semibold">
              Total Units: {items.reduce((s, it) => s + (Number(it.quantity) || 1), 0)}
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const rawImg = Array.isArray(item.product_images) && item.product_images.length > 0 
                ? item.product_images[0] 
                : item.image || item.image_url;
              const optimizedImg = getOptimizedThumb(rawImg);
              const hasError = failedImages[item.id || index];

              return (
                <div key={item.id || index} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {optimizedImg && !hasError ? (
                      <img 
                        src={optimizedImg} 
                        alt={item.product_name} 
                        className="w-full h-full object-cover"
                        onError={() => setFailedImages(prev => ({ ...prev, [item.id || index]: true }))} 
                      />
                    ) : (
                      <Package size={22} className="text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.product_name}</h5>
                        {item.product_sku && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {item.product_sku}
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 whitespace-nowrap">
                        ₹{Number(item.total || (item.quantity * item.price) || 0).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                      <span>Qty: <strong>{item.quantity}</strong> × ₹{Number(item.price || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals Breakdown */}
          <div className="mt-4 pt-3.5 border-t border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">₹{Number(subtotal).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Shipping & Delivery</span>
              <span className="font-semibold text-slate-800">₹{Number(order.shipping_charge || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Taxes</span>
              <span className="font-semibold text-slate-800">₹{Number(order.tax || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm sm:text-base font-bold pt-2 border-t border-slate-200">
              <span className="text-slate-900">Total Order Value</span>
              <span className="text-primary-700">₹{Number(total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Customer & Shipping Information */}
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
          <h4 className="text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
            <Truck size={16} className="text-primary-600" />
            <span>Customer & Shipping Information</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Customer Details */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-semibold text-[11px]">
                <User size={13} />
                <span>Buyer Profile</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{order.retailer_name || order.customer_name || 'Retailer Buyer'}</p>
              {order.customer_email && (
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" />
                  <span>{order.customer_email}</span>
                </p>
              )}
              {order.shipping_address?.phone && (
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" />
                  <span>{order.shipping_address.phone}</span>
                </p>
              )}
            </div>

            {/* Delivery Address & Tracking */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-semibold text-[11px]">
                <MapPin size={13} />
                <span>Shipping Address</span>
              </div>
              {order.shipping_address?.address ? (
                <p className="text-slate-700 leading-relaxed">
                  {order.shipping_address.address}<br />
                  {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                </p>
              ) : (
                <p className="text-slate-500">Standard registered business address</p>
              )}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Delivery: <strong className="text-slate-700 capitalize">{order.delivery_type || 'Standard'}</strong></span>
                <span className="text-slate-400">Tracking: <strong className="text-primary-700">{order.tracking_number || 'Pending'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Payment Details */}
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
          <h4 className="text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
            <CreditCard size={16} className="text-primary-600" />
            <span>Payment Details</span>
          </h4>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Payment Status:</span>
                <div className="font-bold text-slate-800 capitalize text-sm">{order.payment_status || 'Pending'}</div>
              </div>

              {/* Status Update Dropdown */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={selectedPaymentStatus}
                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                    className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 bg-white pr-8 text-slate-700 appearance-none"
                  >
                    {PAYMENT_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                
                <button
                  type="button"
                  onClick={handlePaymentStatusUpdate}
                  disabled={isUpdating || selectedPaymentStatus === order.payment_status}
                  className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 disabled:opacity-40 transition-all shadow-2xs"
                >
                  {isUpdating ? '...' : 'Update'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Method:</span>
                <span className="font-bold text-slate-800 uppercase">{order.payment_method || 'COD'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Date Registered:</span>
                <span className="font-semibold text-slate-700">{formatDate(order.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Order Timeline */}
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
          <h4 className="text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
            <Clock size={16} className="text-primary-600" />
            <span>Order Timeline & Lifecycle</span>
          </h4>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80">
            <div className="relative pl-6 space-y-5">
              {timeline.map((event, index) => {
                const Icon = event.icon || Clock;
                return (
                  <div key={index} className="relative">
                    {/* Bullet */}
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-2xs">
                      <CheckCircle size={10} />
                    </div>
                    {/* Connecting Line */}
                    {index < timeline.length - 1 && (
                      <div className="absolute -left-4 top-4 bottom-[-18px] w-0.5 bg-emerald-200" />
                    )}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900">{event.status}</h5>
                        <span className="text-[11px] text-slate-400 font-medium">{formatDate(event.date)}</span>
                      </div>
                      {event.by && (
                        <p className="text-[11px] text-slate-500 mt-0.5">Updated by {event.by}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 5: Notes & Special Instructions */}
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
          <h4 className="text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
            <FileText size={16} className="text-primary-600" />
            <span>Order Notes & Buyer Instructions</span>
          </h4>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3">
            {order.notes ? (
              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 leading-relaxed border border-slate-100">
                {order.notes}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No buyer notes provided for this order.</p>
            )}

            {/* Quick Note Input */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MessageCircle size={13} className="text-slate-400" />
                <span>Add Internal Note:</span>
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write internal fulfillment or packaging note..."
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 font-medium text-slate-700"
              />
              <button 
                type="button"
                className="px-3.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-all shadow-2xs"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Actions with Status Dropdown */}
      <div className="px-5 sm:px-6 py-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/60">
        {/* Status Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-white pr-8 text-slate-800 appearance-none shadow-2xs"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          
          <button
            type="button"
            onClick={handleStatusUpdate}
            disabled={isUpdating || selectedStatus === order.status}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-all shadow-2xs flex items-center gap-1.5"
          >
            {isUpdating && <Loader2 size={13} className="animate-spin" />}
            <span>Update Status</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            type="button"
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Edit size={13} />
            <span>Edit Order</span>
          </button>
          <button 
            type="button"
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all shadow-2xs"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}