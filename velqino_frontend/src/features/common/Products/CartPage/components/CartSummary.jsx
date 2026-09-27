"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Tag, 
  Truck, 
  ShieldCheck, 
  Loader2, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight,
  Lock,
  FileText,
  Sparkles,
  CheckCircle
} from '@/utils/icons';
import { useRouter } from 'next/navigation';

export default function CartSummary({ cartItems, summary, onApplyCoupon, onRemoveCoupon, isApplyingCoupon }) {
  const [couponCode, setCouponCode] = useState('');
  const [localCouponApplied, setLocalCouponApplied] = useState(false);
  const router = useRouter();

  // Use real data from API summary or calculate from cartItems
  const subtotal = summary?.subtotal || cartItems?.reduce((sum, item) => sum + ((item.price_at_add || item.product_detail?.price || 0) * item.quantity), 0) || 0;
  const discount = summary?.discount || 0;
  const total = summary?.total || Math.max(0, subtotal - discount);
  const savings = summary?.savings || 0;
  const itemCount = summary?.item_count || cartItems?.length || 0;

  // Calculate shipping and tax
  const shipping = subtotal > 500 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const finalTotal = total + shipping + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const success = await onApplyCoupon(couponCode);
    if (success) {
      setLocalCouponApplied(true);
    }
  };

  const handleRemoveCoupon = async () => {
    await onRemoveCoupon();
    setLocalCouponApplied(false);
    setCouponCode('');
  };

  return (
    <div className="cart-summary-card">
      
      {/* Summary Header */}
      <div className="cart-summary-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-2xs">
            <ShieldCheck size={16} />
          </div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Wholesale Summary
          </h3>
        </div>
        <span className="text-[11px] font-bold text-primary-800 bg-primary-100/90 border border-primary-200 px-2 py-0.5 rounded-full">
          {itemCount} Lots
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        
        {/* Price Breakdown */}
        <div className="space-y-3 pb-4 border-b border-gray-100 text-xs sm:text-sm">
          
          <div className="flex justify-between items-center text-gray-600">
            <span>Wholesale Subtotal</span>
            <span className="font-bold text-gray-900">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between items-center text-emerald-700">
              <span className="flex items-center gap-1.5 font-medium">
                <Tag size={13} />
                <span>Coupon Discount</span>
              </span>
              <span className="font-bold">−₹{discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-gray-600">
            <span className="flex items-center gap-1.5">
              <Truck size={13} className="text-primary-600" />
              <span>Pan-India Freight Logistics</span>
            </span>
            {shipping === 0 ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                FREE FREIGHT
              </span>
            ) : (
              <span className="font-bold text-gray-900">₹{shipping}</span>
            )}
          </div>

          <div className="flex justify-between items-center text-gray-600">
            <span className="flex items-center gap-1.5">
              <FileText size={13} className="text-gray-400" />
              <span>Estimated GST (5%)</span>
            </span>
            <span className="font-bold text-gray-900">₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

        </div>

        {/* Final Total Box */}
        <div className="p-4 bg-primary-50/50 rounded-2xl border border-primary-200/90">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-primary-900">
              Total Order Amount
            </span>
            <span className="text-2xl font-black text-primary-800">
              ₹{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 text-right">
            Includes all GST taxes & factory handling fees
          </p>
        </div>

        {/* Wholesale Savings Callout */}
        {(savings > 0 || discount > 0) && (
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-800 font-semibold shadow-2xs">
            <Sparkles size={16} className="text-emerald-600 flex-shrink-0" />
            <span>
              Total Wholesale Margin Saved:{' '}
              <strong className="font-extrabold text-emerald-900">
                ₹{(savings + discount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </span>
          </div>
        )}

        {/* B2B Coupon / Promo Pass Box */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
            Wholesale Coupon / Promo Pass
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 focus-within:border-primary-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-100 transition-all">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="e.g. WHOLESALE10"
              className="flex-1 min-w-0 px-3 py-2 bg-transparent text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none font-semibold tracking-wider uppercase"
              disabled={localCouponApplied || isApplyingCoupon}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={localCouponApplied || !couponCode.trim() || isApplyingCoupon}
              className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 flex items-center gap-1 shadow-2xs"
            >
              {isApplyingCoupon ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>Applying</span>
                </>
              ) : (
                'Apply'
              )}
            </button>
          </div>

          {localCouponApplied && (
            <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle size={13} className="text-emerald-600" />
                Coupon Applied Successfully
              </span>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-xs font-bold text-red-600 hover:text-red-700 underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Primary Checkout CTA */}
        <button
          type="button"
          onClick={() => router.push('/product/checkout')}
          className="cart-checkout-btn w-full py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
        >
          <span>Proceed to Secure Checkout</span>
          <ArrowRight size={17} />
        </button>

        {/* B2B Trust & Escrow Assurance Strip */}
        <div className="pt-3 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-primary-600 flex-shrink-0" />
            <span>256-Bit SSL Encrypted Escrow Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={12} className="text-emerald-600 flex-shrink-0" />
            <span>100% Protected Payment Until Delivery Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={12} className="text-primary-600 flex-shrink-0" />
            <span>Automated GST Tax Invoicing on Dispatch</span>
          </div>
        </div>

      </div>

    </div>
  );
}
