"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, Truck, ShieldCheck, Loader2 } from '../../../../../utils/icons';
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
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 sticky top-24">
  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Price Summary</h3>
  
  <div className="space-y-2 sm:space-y-3 mb-4">
    <div className="flex justify-between text-gray-600 text-sm sm:text-base">
      <span>Subtotal ({itemCount} items)</span>
      <span>₹{subtotal.toFixed(2)}</span>
    </div>
    
    {discount > 0 && (
      <div className="flex justify-between text-green-600 text-sm sm:text-base">
        <span>Coupon Discount</span>
        <span>-₹{discount.toFixed(2)}</span>
      </div>
    )}
    
    {savings > 0 && (
      <div className="flex justify-between text-green-600 text-sm sm:text-base">
        <span>Total Savings</span>
        <span>₹{savings.toFixed(2)}</span>
      </div>
    )}
    
    <div className="flex justify-between text-gray-600 text-sm sm:text-base">
      <span>Shipping</span>
      <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
    </div>
    
    <div className="flex justify-between text-gray-600 text-sm sm:text-base">
      <span>Tax (GST)</span>
      <span>₹{tax.toFixed(2)}</span>
    </div>
    
    <div className="border-t border-gray-100 pt-3 mt-3">
      <div className="flex justify-between font-bold text-gray-900 text-base sm:text-lg">
        <span>Total</span>
        <span className="text-primary-600">₹{finalTotal.toFixed(2)}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
    </div>
  </div>
  
  {/* Coupon Code */}
  <div className="mb-4">
    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Apply Coupon</label>
    <div className="flex gap-2">
      <input 
        type="text" 
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        placeholder="Enter coupon code"
        className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
        disabled={localCouponApplied || isApplyingCoupon}
      />
      <button 
        onClick={handleApplyCoupon}
        disabled={localCouponApplied || !couponCode.trim() || isApplyingCoupon}
        className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
      >
        {isApplyingCoupon ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
      </button>
    </div>
    {localCouponApplied && (
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-green-600">Coupon applied successfully!</p>
        <button 
          onClick={handleRemoveCoupon}
          className="text-xs text-red-500 hover:text-red-600"
        >
          Remove
        </button>
      </div>
    )}
  </div>
  
  {/* Delivery Info */}
  <div className="space-y-2 mb-4">
    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
      <Truck size={14} className="sm:w-4 sm:h-4" />
      <span>Free shipping on orders above ₹500</span>
    </div>
    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
      <ShieldCheck size={14} className="sm:w-4 sm:h-4" />
      <span>Secure & safe payment</span>
    </div>
  </div>
  
  {/* Buttons */}
  <button 
    onClick={() => router.push('/product/checkout')}
    className="w-full bg-primary-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors mb-3 text-sm sm:text-base"
  >
    Proceed to Checkout
  </button>
    
  <Link href="/products" className="block text-center text-primary-500 hover:text-primary-600 font-medium text-sm sm:text-base">
    Continue Shopping
  </Link>
</div>
  );
}