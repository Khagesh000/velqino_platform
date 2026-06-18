"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, Truck, ShieldCheck, Loader2, ChevronRight, ChevronLeft } from '../../../../../utils/icons';
import { useRouter } from 'next/navigation';

export default function CartSummary({ cartItems, summary, onApplyCoupon, onRemoveCoupon, isApplyingCoupon }) {
  const [couponCode, setCouponCode] = useState('');
  const [localCouponApplied, setLocalCouponApplied] = useState(false);
  
  // Use real data from API summary or calculate from cartItems
  const subtotal = summary?.subtotal || cartItems?.reduce((sum, item) => sum + ((item.price_at_add || item.product_detail?.price || 0) * item.quantity), 0) || 0;
  const discount = summary?.discount || 0;
  const total = summary?.total || subtotal - discount;
  const savings = summary?.savings || 0;
  const itemCount = summary?.item_count || cartItems?.length || 0;
  const router = useRouter();

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
   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">

  {/* Header */}
  <div className="px-5 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center gap-2">
    <div className="w-1 h-5 bg-primary-500 rounded-full" />
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Price Summary</h3>
  </div>

  <div className="p-5">

    {/* Price Rows */}
    <div className="space-y-3 mb-5">
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Subtotal <span className="text-gray-400 text-xs">({itemCount} items)</span></span>
        <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 text-[10px] flex items-center justify-center font-bold">%</span>
            Coupon Discount
          </span>
          <span className="font-semibold text-green-600">−₹{discount.toFixed(2)}</span>
        </div>
      )}

      {savings > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Savings</span>
          <span className="font-semibold text-green-600">₹{savings.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Shipping</span>
        {shipping === 0
          ? <span className="font-semibold text-green-600 bg-green-50 border border-green-100 text-xs px-2 py-0.5 rounded-full">FREE</span>
          : <span className="font-semibold text-gray-800">₹{shipping}</span>
        }
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Tax (GST)</span>
        <span className="font-semibold text-gray-800">₹{tax.toFixed(2)}</span>
      </div>

      {/* Total */}
      <div className="border-t border-dashed border-gray-200 pt-3.5 mt-1">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900 text-base">Total</span>
          <span className="font-bold text-primary-600 text-lg">₹{finalTotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
      </div>

      {/* Savings highlight */}
      {(savings > 0 || discount > 0) && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
          <span className="text-xs text-green-700 font-medium">You're saving total</span>
          <span className="text-sm font-bold text-green-700">₹{(savings + discount).toFixed(2)}</span>
        </div>
      )}
    </div>

    {/* Coupon Code */}
    <div className="mb-5">
      <label className="text-xs font-semibold text-gray-700 mb-2 block uppercase tracking-wide">Apply Coupon</label>
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 focus-within:bg-white transition-all duration-200">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 min-w-0 px-3.5 py-2.5 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-medium tracking-wide"
          disabled={localCouponApplied || isApplyingCoupon}
        />
        <button
          onClick={handleApplyCoupon}
          disabled={localCouponApplied || !couponCode.trim() || isApplyingCoupon}
          className="flex-shrink-0 m-1.5 px-4 py-1.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isApplyingCoupon ? <Loader2 size={13} className="animate-spin" /> : 'Apply'}
        </button>
      </div>
      {localCouponApplied && (
        <div className="flex items-center justify-between mt-2 bg-green-50 border border-green-100 rounded-lg px-3 py-1.5">
          <p className="text-xs text-green-700 font-semibold flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-green-500 text-white text-[9px] flex items-center justify-center">✓</span>
            Coupon applied!
          </p>
          <button
            onClick={handleRemoveCoupon}
            className="text-xs text-red-500 hover:text-red-600 font-semibold transition-colors"
          >
            Remove
          </button>
        </div>
      )}
    </div>

    {/* Trust Badges */}
    <div className="space-y-2 mb-5 bg-gray-50 rounded-xl p-3.5 border border-gray-100">
      <div className="flex items-center gap-2.5 text-xs text-gray-600">
        <div className="w-7 h-7 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
          <Truck size={13} className="text-primary-600" />
        </div>
        <span className="font-medium">Free shipping on orders above ₹500</span>
      </div>
      <div className="flex items-center gap-2.5 text-xs text-gray-600">
        <div className="w-7 h-7 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={13} className="text-primary-600" />
        </div>
        <span className="font-medium">Secure & safe payment guaranteed</span>
      </div>
    </div>

    {/* Checkout Button */}
    <button
      onClick={() => router.push('/product/checkout')}
      className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white py-3 rounded-xl font-bold text-sm tracking-wide
        transition-all duration-200 hover:shadow-lg hover:shadow-primary-200 flex items-center justify-center gap-2 group mb-3"
    >
      Proceed to Checkout
      <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
    </button>

    <Link
      href="/product/productlistingpage"
      className="flex items-center justify-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group"
    >
      <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
      Continue Shopping
    </Link>
  </div>
</div>
  );
}
