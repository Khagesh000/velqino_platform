"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  Calendar, 
  ChevronRight, 
  Copy, 
  Check, 
  ShoppingBag, 
  Package, 
  CreditCard,
  Truck,
  MapPin,
  ShieldCheck
} from '../../../../utils/icons';
import OrderStatusBadge from './OrderStatusBadge';

export default function OrderCard({ order }) {
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  const copyOrderNumber = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const orderNum = order?.order_number || String(order?.id || '');
    if (!orderNum) return;
    navigator.clipboard.writeText(orderNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to safely extract product image from all backend formats
  const getProductImage = (item) => {
    if (!item) return null;
    // 1. Array in product_images (e.g. from backend serializer)
    if (Array.isArray(item.product_images) && item.product_images.length > 0) {
      const first = item.product_images[0];
      return typeof first === 'string' ? first : first?.image || first?.url || null;
    }
    // 2. String in product_images
    if (typeof item.product_images === 'string' && item.product_images) {
      return item.product_images;
    }
    // 3. Array in images
    if (Array.isArray(item.images) && item.images.length > 0) {
      const first = item.images[0];
      return typeof first === 'string' ? first : first?.image || first?.url || null;
    }
    // 4. Single properties
    if (item.product_image) return item.product_image;
    if (item.image) return item.image;
    if (item.product?.image) return item.product.image;
    if (Array.isArray(item.product?.product_images) && item.product.product_images.length > 0) {
      return item.product.product_images[0];
    }
    return null;
  };

  const orderNum = order?.order_number || `ORD-${order?.id}`;
  const totalAmount = Number(order?.total_amount || 0);
  const items = Array.isArray(order?.items) ? order.items : [];
  const itemsCount = order?.items_count || items.length || 1;
  const destinationCity = order?.shipping_address?.city || order?.shipping_address?.state || '';

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition-all duration-200 overflow-hidden w-full">
      
      {/* Header Banner - Fully Responsive across mobile, tablet, desktop */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50/90 via-white to-gray-50/60 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Order # & Status */}
        <div className="flex items-start sm:items-center gap-3 flex-wrap">
          <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100 shadow-2xs">
            <Package size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Order Reference</span>
              <button
                type="button"
                onClick={copyOrderNumber}
                title="Copy order number"
                className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              </button>
            </div>
            <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
              <span className="font-mono font-extrabold text-sm sm:text-base text-gray-900 tracking-tight">
                #{orderNum}
              </span>
              <OrderStatusBadge status={order?.status} />
            </div>
          </div>
        </div>

        {/* Right Side: Date Placed & Total Amount */}
        <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar size={14} className="text-gray-400 shrink-0" />
            <div>
              <span className="text-[9px] text-gray-400 uppercase font-bold block md:hidden">Placed Date</span>
              <span className="font-semibold text-gray-700">{formatDate(order?.created_at)}</span>
            </div>
          </div>

          <div className="text-right pl-3 sm:pl-5 border-l border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Amount</span>
            <span className="text-base sm:text-xl font-extrabold text-gray-900 tracking-tight">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body - Rich Items Showcase */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Ordered Items List */}
        {items.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Purchased Items ({itemsCount})
              </p>
              {order?.retailer_name && (
                <span className="text-xs text-gray-500 hidden sm:inline-block">
                  Sold by: <strong className="text-gray-800">{order.retailer_name.includes('@') ? order.retailer_name.split('@')[0] : order.retailer_name}</strong>
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {items.map((item, idx) => {
                const imgUrl = getProductImage(item);
                const itemPrice = Number(item.price || 0);
                const itemQty = Number(item.quantity || 1);
                const itemTotal = Number(item.total || (itemPrice * itemQty) || 0);

                return (
                  <div
                    key={item.id || idx}
                    className="p-3 sm:p-3.5 rounded-2xl bg-gray-50/70 hover:bg-gray-50 border border-gray-100/90 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                      {/* Product Image Thumbnail */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-gray-200/80 overflow-hidden shrink-0 shadow-2xs relative">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={item.product_name || 'Product'}
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 ${imgUrl ? 'hidden' : 'flex'}`}
                        >
                          <Package size={22} className="text-gray-400" />
                          <span className="text-[9px] font-bold text-gray-400 mt-0.5">Item</span>
                        </div>
                      </div>

                      {/* Product Text & Metadata */}
                      <div className="min-w-0 space-y-1 flex-1">
                        <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 tracking-tight leading-snug line-clamp-2">
                          {item.product_name || 'Purchased Product'}
                        </h4>
                        
                        <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
                          {item.product_sku && (
                            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-gray-600 bg-white px-2 py-0.5 rounded-md border border-gray-200/80">
                              SKU: {item.product_sku}
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-200/70 text-gray-800 font-bold text-[10px] sm:text-[11px]">
                            Qty: {itemQty}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600 font-medium text-[11px] sm:text-xs">
                            ₹{itemPrice.toLocaleString('en-IN')} each
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Item Total Price */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200/60 shrink-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider sm:block hidden">Item Total</span>
                      <span className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-xs text-gray-600 bg-gray-50/70 rounded-2xl p-3.5 border border-gray-100">
            <Package size={18} className="text-gray-400 shrink-0" />
            <span className="font-medium">
              Contains <strong className="text-gray-900 font-bold">{itemsCount}</strong> item{itemsCount > 1 ? 's' : ''} in fulfillment shipment
            </span>
          </div>
        )}

        {/* Order Details Metadata Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-600">
          {/* Payment Method & Status */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100/90 text-gray-700 font-semibold border border-gray-200/70 text-[11px]">
            <CreditCard size={12} className="text-gray-500" />
            <span>
              {order?.payment_method?.toLowerCase() === 'cod' ? 'Cash on Delivery (COD)' : order?.payment_method || 'Online Payment'}
              {' • '}
              <span className={order?.payment_status === 'pending' ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                {order?.payment_status ? String(order.payment_status).toUpperCase() : 'PENDING'}
              </span>
            </span>
          </span>

          {/* Delivery Type */}
          {order?.delivery_type && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100/90 text-gray-700 font-semibold border border-gray-200/70 text-[11px] capitalize">
              <Truck size={12} className="text-gray-500" />
              <span>{order.delivery_type} Delivery</span>
            </span>
          )}

          {/* Destination */}
          {destinationCity ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100/90 text-gray-700 font-semibold border border-gray-200/70 text-[11px]">
              <MapPin size={12} className="text-gray-500" />
              <span>Ship to: {destinationCity}</span>
            </span>
          ) : order?.customer_email ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100/90 text-gray-700 font-semibold border border-gray-200/70 text-[11px] truncate max-w-[200px]">
              <MapPin size={12} className="text-gray-500" />
              <span className="truncate">To: {order.customer_email}</span>
            </span>
          ) : null}

          {/* Fulfillment Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100/90 text-gray-700 font-semibold border border-gray-200/70 text-[11px]">
            <ShieldCheck size={12} className="text-primary-600" />
            <span>Velqino Fulfillment</span>
          </span>
        </div>

        {/* Action Footer - Responsive across all screen widths */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 font-medium">
            {itemsCount} item{itemsCount > 1 ? 's' : ''} • Ref: <span className="font-mono text-gray-700 font-bold">#{orderNum}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {order?.status === 'delivered' && (
              <Link
                href="/product/productlistingpage"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 text-gray-700 font-bold text-xs transition-all shadow-2xs"
              >
                <ShoppingBag size={14} className="text-gray-600" />
                <span>Buy Again</span>
              </Link>
            )}

            {/* View Details Button - Guaranteed white text on hover */}
            <Link
              href={`/product/orderconfirmation/${order?.order_number || order?.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white hover:!text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              style={{ color: '#ffffff' }}
            >
              <Eye size={15} className="!text-white text-white shrink-0" style={{ color: '#ffffff' }} />
              <span className="!text-white text-white font-bold" style={{ color: '#ffffff' }}>
                View Details
              </span>
              <ChevronRight size={14} className="!text-white text-white shrink-0" style={{ color: '#ffffff' }} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
