"use client";

import React from 'react';
import { 
  Wallet, 
  CreditCard, 
  Smartphone, 
  Building, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Tag,
  Lock,
  CheckCircle 
} from '@/utils/icons';

export default function PriceBreakdown({ order }) {
  const getPaymentDetails = (method) => {
    switch (method) {
      case 'cod':
        return { label: 'Cash on Delivery', icon: Wallet, badge: 'Escrow COD' };
      case 'upi':
        return { label: 'Instant UPI Settlement', icon: Smartphone, badge: 'Verified UPI' };
      case 'card':
        return { label: 'Credit / Debit Card', icon: CreditCard, badge: '256-Bit SSL' };
      case 'netbanking':
        return { label: 'Commercial Net Banking', icon: Building, badge: 'Protected' };
      default:
        return { label: method || 'Standard Payment', icon: CreditCard, badge: 'Secured' };
    }
  };

  const payment = getPaymentDetails(order?.payment_method);
  const PaymentIcon = payment.icon;
  const isPaid = order?.payment_status === 'paid';

  const subtotal = typeof order?.subtotal === 'number' ? order.subtotal : parseFloat(order?.subtotal || 0);
  const discount = typeof order?.discount === 'number' ? order.discount : parseFloat(order?.discount || 0);
  const shippingCharge = typeof order?.shipping_charge === 'number' ? order.shipping_charge : parseFloat(order?.shipping_charge || 0);
  const tax = typeof order?.tax === 'number' ? order.tax : parseFloat(order?.tax || 0);
  const total = typeof order?.total === 'number' ? order.total : parseFloat(order?.total || 0);

  return (
    <div className="space-y-5">
      
      {/* Payment Method Status Card */}
      <div className="confirmation-card">
        <div className="card-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              <PaymentIcon size={14} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Payment Protocol
            </h3>
          </div>
          <span className="text-[10px] font-bold text-primary-800 bg-primary-100/90 border border-primary-200 px-2 py-0.5 rounded-full">
            {payment.badge}
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">
              {payment.label}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize border ${
              isPaid 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <CheckCircle size={11} />
              <span>{order?.payment_status || 'Pending'}</span>
            </span>
          </div>

          <div className="p-3 bg-primary-50/50 rounded-xl border border-primary-100/90 flex items-start gap-2 text-xs text-primary-900">
            <ShieldCheck size={15} className="text-primary-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Payment is safeguarded under Velqino Escrow Guarantee until delivery inspection.
            </p>
          </div>
        </div>
      </div>

      {/* Price Summary Card */}
      <div className="confirmation-card">
        <div className="card-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              <FileText size={14} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Wholesale Invoice Summary
            </h3>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center text-gray-600">
              <span>Wholesale Subtotal</span>
              <span className="font-bold text-gray-900">
                ₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between items-center text-emerald-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Tag size={13} />
                  <span>Wholesale Discount</span>
                </span>
                <span>−₹{discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-gray-600">
              <span>Pan-India Freight Logistics</span>
              {shippingCharge === 0 ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  FREE FREIGHT
                </span>
              ) : (
                <span className="font-bold text-gray-900">₹{shippingCharge.toFixed(2)}</span>
              )}
            </div>

            <div className="flex justify-between items-center text-gray-600">
              <span>GST Tax (5%)</span>
              <span className="font-bold text-gray-900">
                ₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Grand Total Box */}
          <div className="p-3.5 bg-primary-50/50 rounded-2xl border border-primary-200/90">
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-xs uppercase font-extrabold tracking-wider text-primary-900">
                Total Paid / Billed
              </span>
              <span className="text-xl font-black text-primary-800">
                ₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 text-right">
              All taxes, handling & mill charges included
            </p>
          </div>

          {/* Savings Callout */}
          {discount > 0 && (
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
              <Sparkles size={14} className="text-emerald-600 flex-shrink-0" />
              <span>Wholesale margin saved: <strong>₹{discount.toLocaleString()}</strong></span>
            </div>
          )}

          {/* GST Invoicing Badge */}
          <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
            <FileText size={13} className="text-primary-600 flex-shrink-0" />
            <span>Official GST tax invoice ready for download</span>
          </div>

        </div>
      </div>

    </div>
  );
}
