"use client";

import React, { useRef } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Clock, 
  Truck, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Tag, 
  Sparkles,
  FileText,
  CheckCircle,
  Loader2
} from '@/utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

export default function OrderSummary({ 
  cartItems = [], 
  subtotal = 0, 
  discount = 0, 
  shippingCharge = 0, 
  tax = 0, 
  total = 0, 
  couponCode = '', 
  setCouponCode,
  onApplyCoupon,
  onRemoveCoupon,
  isApplyingCoupon = false
}) {
  const scrollRefs = useRef({});

  const resolveImageUrl = (img) => {
    if (!img) return '/images/placeholder.jpg';
    if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
      return img;
    }
    return `${BASE_IMAGE_URL}${img}`;
  };

  const scrollImages = (itemId, direction) => {
    const ref = scrollRefs.current[itemId];
    if (ref) {
      const scrollAmount = ref.offsetWidth;
      ref.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="checkout-summary-card">
      
      {/* Header */}
      <div className="summary-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-2xs">
            <ShieldCheck size={16} />
          </div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Wholesale Summary
          </h3>
        </div>
        <span className="text-[11px] font-bold text-primary-800 bg-primary-100/90 border border-primary-200 px-2 py-0.5 rounded-full">
          {cartItems.length} {cartItems.length === 1 ? 'Lot' : 'Lots'}
        </span>
      </div>
      
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Selected Lots Mini Showcase */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {cartItems.map((item) => {
            const unitPrice = item.price_at_add || item.product_detail?.price || 0;
            const lineTotal = unitPrice * item.quantity;
            const images = item.product_detail?.images || [];
            const primaryImg = resolveImageUrl(
              images[0]?.image || item.product_detail?.primary_image || item.product_detail?.image
            );

            return (
              <div 
                key={item.id} 
                className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50/80 border border-gray-100"
              >
                {/* Lot Thumbnail */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                  {images.length > 1 ? (
                    <>
                      <div 
                        ref={el => scrollRefs.current[item.id] = el}
                        className="flex h-full w-full overflow-x-auto scroll-smooth hide-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {images.map((img, idx) => (
                          <img 
                            key={idx}
                            src={resolveImageUrl(img.image)}
                            alt={item.product_detail?.name || 'Lot'}
                            className="w-14 h-14 object-cover flex-shrink-0"
                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                          />
                        ))}
                      </div>
                      <div className="absolute bottom-0.5 right-0.5 bg-gray-900/80 text-white text-[8px] font-bold px-1 rounded">
                        {images.length}P
                      </div>
                    </>
                  ) : (
                    <img 
                      src={primaryImg} 
                      alt={item.product_detail?.name || 'Lot'} 
                      className="w-14 h-14 object-cover"
                      onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                    />
                  )}
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {item.product_detail?.name || 'Wholesale Lot'}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span>Qty: <strong className="text-gray-800">{item.quantity}</strong></span>
                    {item.selected_size && <span>Size: {item.selected_size}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-400">
                      ₹{unitPrice.toLocaleString()}/unit
                    </span>
                    <span className="text-xs font-black text-primary-700">
                      ₹{lineTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs sm:text-sm">
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
                <span>Wholesale Promo Discount</span>
              </span>
              <span>−₹{discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-gray-600">
            <span className="flex items-center gap-1.5">
              <Truck size={13} className="text-primary-600" />
              <span>Pan-India Freight</span>
            </span>
            {shippingCharge === 0 ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                FREE FREIGHT
              </span>
            ) : (
              <span className="font-bold text-gray-900">₹{shippingCharge.toFixed(2)}</span>
            )}
          </div>

          <div className="flex justify-between items-center text-gray-600">
            <span className="flex items-center gap-1.5">
              <FileText size={13} className="text-gray-400" />
              <span>Estimated GST (5%)</span>
            </span>
            <span className="font-bold text-gray-900">
              ₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Final Total Box */}
        <div className="p-3.5 bg-primary-50/50 rounded-2xl border border-primary-200/90">
          <div className="flex justify-between items-baseline mb-0.5">
            <span className="text-xs uppercase font-extrabold tracking-wider text-primary-900">
              Total Order Amount
            </span>
            <span className="text-xl sm:text-2xl font-black text-primary-800">
              ₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 text-right">
            Includes all GST taxes & Pan-India handling fees
          </p>
        </div>

        {/* Wholesale Coupon / Promo Pass Box */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
            Wholesale Coupon / Promo Pass
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 focus-within:border-primary-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-100 transition-all">
            <input 
              type="text" 
              placeholder="e.g. WHOLESALE10" 
              value={couponCode} 
              onChange={(e) => setCouponCode && setCouponCode(e.target.value.toUpperCase())} 
              className="flex-1 min-w-0 px-2.5 py-1.5 bg-transparent text-xs text-gray-900 placeholder-gray-400 focus:outline-none font-semibold tracking-wider uppercase"
              disabled={isApplyingCoupon}
            />
            {onApplyCoupon && (
              <button 
                type="button"
                onClick={() => onApplyCoupon(couponCode)}
                disabled={!couponCode || !couponCode.trim() || isApplyingCoupon}
                className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 flex items-center gap-1 shadow-2xs"
              >
                {isApplyingCoupon ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  'Apply'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Escrow Trust Badges */}
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
