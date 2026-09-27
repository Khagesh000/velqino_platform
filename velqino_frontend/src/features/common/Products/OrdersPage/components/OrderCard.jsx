"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Eye,
  Calendar,
  MapPin,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Check,
  Loader2,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Package,
  Wallet,
} from '@/utils/icons';
import { useDownloadInvoiceMutation } from '@/redux/wholesaler/slices/ordersSlice';
import { toast } from 'react-toastify';
import OrderStatusBadge from './OrderStatusBadge';

export default function OrderCard({ order }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [downloadInvoice, { isLoading: isDownloading }] = useDownloadInvoiceMutation();

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent Order';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return String(dateString);
    }
  };

  const handleCopyOrderNumber = (e) => {
    e.stopPropagation();
    if (!order?.order_number) return;
    navigator.clipboard.writeText(order.order_number);
    setIsCopied(true);
    toast.success('Order ID copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!order?.order_number) return;
    try {
      await downloadInvoice(order.order_number).unwrap();
      toast.success(`GST Invoice for ${order.order_number} downloaded!`);
    } catch (err) {
      console.error('Invoice download error:', err);
      toast.error('Failed to download invoice. Please try again.');
    }
  };

  const items = Array.isArray(order?.items) ? order.items : [];
  const displayItems = isExpanded ? items : items.slice(0, 2);
  const totalAmount = parseFloat(order?.grand_total || order?.total_amount || 0);

  const getPaymentBadge = () => {
    const method = String(order?.payment_method || '').toLowerCase();
    const isPaid = order?.payment_status === 'paid';

    if (method === 'cod') {
      return {
        label: isPaid ? 'COD (Settled)' : 'COD (Escrow on Delivery)',
        color: isPaid ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
      };
    }
    return {
      label: isPaid ? 'Prepaid (256-Bit SSL)' : 'Payment Processing',
      color: isPaid ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-primary-50 text-primary-900 border-primary-200'
    };
  };

  const paymentBadge = getPaymentBadge();
  const address = order?.shipping_full_address;

  return (
    <div className="orders-card overflow-hidden">

      {/* 1. Header Bar: Order Metadata & Status Badges */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-primary-50/70 via-white to-primary-50/40 border-b border-primary-100 flex flex-col md:flex-row md:items-center justify-between gap-3.5">

        {/* Left: Order ID & Copy */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-primary-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</span>
            <span className="font-mono font-bold text-gray-900 text-sm">{order.order_number}</span>
            <button
              type="button"
              onClick={handleCopyOrderNumber}
              className="text-gray-400 hover:text-primary-700 transition-colors p-0.5 rounded cursor-pointer"
              title="Copy Order ID"
            >
              {isCopied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            </button>
          </div>

          <OrderStatusBadge status={order.status} />

          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs flex items-center gap-1 ${paymentBadge.color}`}>
            <Wallet size={11} />
            <span>{paymentBadge.label}</span>
          </span>
        </div>

        {/* Right: Date & Dispatch Mode */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-primary-600" />
            <span>{formatDate(order.created_at)}</span>
          </div>

          <span className="hidden sm:inline text-gray-300">•</span>

          <div className="flex items-center gap-1.5 text-primary-800 font-semibold bg-primary-100/60 px-2.5 py-0.5 rounded-md text-[11px]">
            <Truck size={12} className="text-primary-600" />
            <span>{order.delivery_type === 'express' ? 'Express Freight (2-3 Days)' : 'Standard Dispatch (5-7 Days)'}</span>
          </div>
        </div>

      </div>

      {/* 2. Body: Items List */}
      <div className="p-4 sm:p-5 space-y-3.5">

        {items.length === 0 ? (
          <p className="text-xs text-gray-500 italic">Order details recorded in dispatch ledger.</p>
        ) : (
          <div className="space-y-3">
            {displayItems.map((item, idx) => {
              const imageSrc = item.product_images?.[0] || item.product_image || '/placeholder-product.png';
              const unitPrice = parseFloat(item.price || 0);
              const itemTotal = parseFloat(item.total || (unitPrice * (item.quantity || 1)));

              return (
                <div
                  key={item.id || idx}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-gray-50/70 border border-gray-100 hover:border-primary-200 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg bg-white border border-gray-200/80 overflow-hidden flex-shrink-0 relative">
                    <img
                      src={imageSrc}
                      alt={item.product_name || 'Wholesale Lot'}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate mb-1">
                      {item.product_name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                      {item.product_sku && (
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200 font-semibold text-gray-700">
                          {item.product_sku}
                        </span>
                      )}
                      <span>Lot Qty: <strong className="text-gray-900">{item.quantity}</strong></span>
                      <span className="text-gray-300">•</span>
                      <span>Unit: <strong className="text-gray-900">₹{unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs sm:text-sm font-extrabold text-primary-900">
                      ₹{itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <p className="text-[10px] text-gray-500">Lot Total</p>
                  </div>
                </div>
              );
            })}

            {/* Expand / Collapse Button if > 2 items */}
            {items.length > 2 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-1.5 text-xs font-bold text-primary-700 hover:text-primary-800 bg-primary-50/60 hover:bg-primary-100/60 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                {isExpanded ? (
                  <>
                    <span>Show Less Items</span>
                    <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    <span>+ {items.length - 2} More Wholesale Item(s) in this Order</span>
                    <ChevronDown size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Shipping Destination Strip */}
        {address && (
          <div className="flex items-center gap-2 pt-2 text-[11px] text-gray-600 border-t border-gray-100">
            <MapPin size={13} className="text-primary-600 flex-shrink-0" />
            <span className="truncate">
              Dispatched to: <strong className="text-gray-800">{address.name}</strong> ({address.city}, {address.state} - {address.pincode})
            </span>
          </div>
        )}

      </div>

      {/* 3. Footer Bar: Price Summary & Primary CTAs */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-primary-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        {/* Total Price */}
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Total Billed Amount
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-primary-900">
              ₹{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              (GST & Freight Included)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">

          {/* Download Official GST Invoice */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-primary-50 text-primary-900 hover:text-primary-950 text-xs font-bold border-2 border-primary-200 hover:border-primary-400 shadow-2xs hover:shadow-xs flex items-center gap-1.5 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download Official GST Invoice PDF"
          >
            {isDownloading ? (
              <>
                <Loader2 size={14} className="animate-spin text-primary-700" />
                <span>Preparing PDF...</span>
              </>
            ) : (
              <>
                <Download size={14} className="text-primary-700" />
                <span>GST Invoice</span>
              </>
            )}
          </button>

          {/* View Details & Tracking */}
          <Link
            href={`/product/orderconfirmation/${order.order_number}`}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 hover:from-primary-800 hover:via-primary-700 hover:to-primary-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg shadow-primary-900/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 transition-all duration-150 cursor-pointer"
          >
            <Eye size={15} />
            <span>Track & Details</span>
            <ChevronRight size={14} />
          </Link>

          {/* If delivered: Reorder CTA */}
          {order.status === 'delivered' && (
            <Link
              href="/product/productlistingpage"
              className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 shadow-2xs flex items-center gap-1.5 transition-all"
            >
              <ShoppingBag size={14} className="text-emerald-700" />
              <span>Reorder</span>
            </Link>
          )}

        </div>

      </div>

    </div>
  );
}
