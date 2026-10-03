"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Package, 
  Truck, 
  Calendar, 
  Phone, 
  Mail, 
  FileText, 
  Download, 
  Printer,
  Sparkles,
  CheckCircle,
  Copy
} from '../../../../utils/icons';

export default function OrderDetails({ selectedOrder }) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyOrderNumber = () => {
    const num = selectedOrder?.order_number || `#ORD-${selectedOrder?.id}`;
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!selectedOrder) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-2xs h-full flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 shadow-2xs">
          <FileText size={26} />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-gray-900">Order Inspector</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          Select any order to inspect purchased line items, buyer contact details, and billing summaries.
        </p>
      </div>
    );
  }

  const items = Array.isArray(selectedOrder.items) ? selectedOrder.items : [];
  const grandTotal = Number(selectedOrder.grand_total ?? selectedOrder.total_amount ?? 0);
  const subtotal = Number(selectedOrder.subtotal ?? grandTotal);
  const tax = Number(selectedOrder.tax_amount ?? 0);
  const discount = Number(selectedOrder.discount_amount ?? 0);
  const customerName = selectedOrder.customer_name || selectedOrder.customer?.name || 'Walk-in Customer';
  const customerPhone = selectedOrder.customer_phone || selectedOrder.customer?.phone || null;
  const customerEmail = selectedOrder.customer_email || selectedOrder.customer?.email || null;
  const shippingAddress = selectedOrder.shipping_address || selectedOrder.address || null;

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs h-full flex flex-col justify-between space-y-4">
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <FileText size={17} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Order Information
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] font-mono text-gray-500">
                  {selectedOrder.order_number || `#ORD-${selectedOrder.id}`}
                </span>
                <button
                  type="button"
                  onClick={copyOrderNumber}
                  className="text-gray-400 hover:text-primary-600 transition-colors"
                  title="Copy Order ID"
                >
                  {copied ? <CheckCircle size={11} className="text-emerald-500" /> : <Copy size={11} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              type="button"
              onClick={() => window.print()}
              className="p-2 text-gray-500 hover:text-primary-700 bg-gray-50 hover:bg-primary-50 border border-gray-200 rounded-xl transition-all"
              title="Print Order Receipt"
            >
              <Printer size={14} />
            </button>
          </div>
        </div>

        {/* Scrollable Details */}
        <div className="space-y-4 mt-4 max-h-[460px] overflow-y-auto pr-1">
          {/* Order Meta Pill */}
          <div className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100 flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Timestamp</p>
              <p className="font-bold text-gray-800">{formatDate(selectedOrder.created_at)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Payment</p>
              <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-800">
                {selectedOrder.payment_method || 'CASH'}
              </span>
            </div>
          </div>

          {/* Customer Information Card */}
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200/80 space-y-2">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <User size={12} />
              <span>Customer Details</span>
            </h4>
            <div>
              <p className="text-xs font-bold text-gray-900">{customerName}</p>
              <div className="space-y-1 mt-1.5 text-xs text-gray-600">
                {customerPhone && (
                  <p className="flex items-center gap-2">
                    <Phone size={12} className="text-gray-400" />
                    <span>{customerPhone}</span>
                  </p>
                )}
                {customerEmail && (
                  <p className="flex items-center gap-2">
                    <Mail size={12} className="text-gray-400" />
                    <span>{customerEmail}</span>
                  </p>
                )}
                {shippingAddress && (
                  <p className="flex items-start gap-2 pt-1 border-t border-gray-100">
                    <MapPin size={12} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      {typeof shippingAddress === 'string' 
                        ? shippingAddress 
                        : `${shippingAddress.address_line_1 || ''}, ${shippingAddress.city || ''} ${shippingAddress.state || ''} ${shippingAddress.postal_code || ''}`
                      }
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items Purchased */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Package size={12} />
                <span>Line Items</span>
              </span>
              <span>{items.length} {items.length === 1 ? 'Product' : 'Products'}</span>
            </h4>

            <div className="space-y-2">
              {items.length === 0 ? (
                <div className="p-3 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
                  Standard lot purchase &bull; 1 package
                </div>
              ) : (
                items.map((item, idx) => {
                  const itemPrice = Number(item.price || item.unit_price || 0);
                  const itemQty = Number(item.quantity || 1);
                  const itemTotal = Number(item.total || item.total_amount || (itemPrice * itemQty));

                  return (
                    <div key={idx} className="p-3 bg-gray-50/70 rounded-2xl border border-gray-100 flex items-start justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 truncate">
                          {item.product_name || item.name || 'Catalog Item'}
                        </p>
                        <p className="text-[10px] font-mono text-gray-400 mt-0.5">
                          SKU: {item.product_sku || item.sku || 'N/A'} {item.size ? `&bull; Size: ${item.size}` : ''}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {itemQty} &times; ₹{itemPrice.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-gray-900">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-gray-50/70 rounded-2xl p-3.5 border border-gray-100 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between text-emerald-700">
                <span>Discount applied</span>
                <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {tax > 0 && (
              <div className="flex items-center justify-between text-gray-600">
                <span>Estimated GST</span>
                <span className="font-semibold text-gray-900">+₹{tax.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between text-sm font-black text-gray-900">
              <span>Grand Total</span>
              <span className="text-base text-primary-900">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}