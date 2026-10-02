"use client";

import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  Truck, 
  CreditCard, 
  ChevronRight, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Check, 
  Loader2, 
  ShoppingBag 
} from '../../../../utils/icons';

export default function OrderProductCards({ orders = [], isLoading, onSelectOrder }) {
  const [copiedId, setCopiedId] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  const getOptimizedThumb = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/w_160,h_160,c_fill,q_auto,f_auto/');
    }
    return url;
  };

  const handleCopyOrderNumber = (e, orderNumber) => {
    e.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(orderNumber);
      setCopiedId(orderNumber);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'confirmed':
        return 'bg-primary-50 text-primary-700 border-primary-200/80';
      case 'processing':
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPaymentBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'failed':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-xs">
        <Loader2 size={32} className="animate-spin text-primary-600 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading order cards...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center shadow-xs">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Package size={28} />
        </div>
        <h4 className="text-base font-bold text-slate-900 mb-1">No Orders Found</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          When retailers place orders, their products and shipment details will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {orders.map((order) => {
          const items = Array.isArray(order.items) ? order.items : [];
          const totalUnits = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
          const initial = order.customer_name ? order.customer_name.charAt(0).toUpperCase() : 'C';

          return (
            <div
              key={order.order_number || order.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectOrder?.(order.order_number || order.id)}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-primary-200/90 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div>
                {/* Card Top Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors">
                          {order.order_number}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyOrderNumber(e, order.order_number)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-colors"
                          title="Copy Order ID"
                        >
                          {copiedId === order.order_number ? (
                            <Check size={13} className="text-emerald-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mt-0.5">
                        <Clock size={12} />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>

                    {/* Total Amount Badge */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        ₹{Number(order.total_amount || 0).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Order Total</span>
                    </div>
                  </div>

                  {/* Status Badges Row */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${getStatusBadge(order.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{order.status || 'Pending'}</span>
                    </span>

                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border uppercase ${getPaymentBadge(order.payment_status)}`}>
                      <span>Payment: {order.payment_status || 'Pending'}</span>
                    </span>

                    {order.delivery_type && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                        <Truck size={11} />
                        <span>{order.delivery_type}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Details Strip */}
                <div className="px-4 sm:px-5 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {initial}
                    </div>
                    <div className="min-w-0 truncate">
                      <span className="font-semibold text-slate-800 truncate block">
                        {order.retailer_name || order.customer_name || 'Retailer Buyer'}
                      </span>
                      {order.customer_email && (
                        <span className="text-[11px] text-slate-400 truncate block">
                          {order.customer_email}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex-shrink-0">
                    {order.items_count || items.length} {order.items_count === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Ordered Products Section */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag size={13} className="text-primary-600" />
                      <span>Ordered Products ({items.length})</span>
                    </span>
                    <span>Units: {totalUnits}</span>
                  </div>

                  {items.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-50 text-center text-xs text-slate-400">
                      No item details available
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {items.map((item, idx) => {
                        const rawImg = Array.isArray(item.product_images) && item.product_images.length > 0
                          ? item.product_images[0]
                          : item.image || item.image_url;
                        const optimizedImg = getOptimizedThumb(rawImg);
                        const hasImageError = failedImages[`${order.id}-${item.id || idx}`];

                        return (
                          <div 
                            key={item.id || idx}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors"
                          >
                            {/* Product Thumbnail */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-slate-200/90 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-2xs">
                              {optimizedImg && !hasImageError ? (
                                <img
                                  src={optimizedImg}
                                  alt={item.product_name || 'Product'}
                                  className="w-full h-full object-cover"
                                  onError={() => setFailedImages(prev => ({ ...prev, [`${order.id}-${item.id || idx}`]: true }))}
                                  loading="lazy"
                                />
                              ) : (
                                <div className="text-slate-300">
                                  <Package size={22} />
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate" title={item.product_name}>
                                {item.product_name || 'Wholesale Product'}
                              </h5>
                              
                              {item.product_sku && (
                                <span className="inline-block text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200/60 mt-0.5">
                                  {item.product_sku}
                                </span>
                              )}

                              <div className="flex items-center justify-between mt-1 text-xs">
                                <span className="text-slate-500 font-medium">
                                  Qty: <strong className="text-slate-800">{item.quantity}</strong> × ₹{Number(item.price || 0).toLocaleString()}
                                </span>
                                <span className="font-bold text-primary-700">
                                  ₹{Number(item.total || (item.quantity * item.price) || 0).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="px-4 sm:px-5 py-3 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                  <CreditCard size={13} />
                  <span className="uppercase">{order.payment_method || 'COD'}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOrder?.(order.order_number || order.id);
                  }}
                  className="flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 transition-all hover:gap-1.5 group-hover:translate-x-0.5"
                >
                  <span>View Details</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
