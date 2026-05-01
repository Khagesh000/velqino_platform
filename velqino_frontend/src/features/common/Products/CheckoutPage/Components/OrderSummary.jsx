"use client";

import React, { useRef } from 'react';
import { Lock, Shield, Clock, Truck, ChevronLeft, ChevronRight } from '../../../../../utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

export default function OrderSummary({ cartItems, subtotal, discount, shippingCharge, tax, total, couponCode, setCouponCode }) {
  const scrollRefs = useRef({});

  const scrollImages = (itemId, direction) => {
    const ref = scrollRefs.current[itemId];
    if (ref) {
      const scrollAmount = 60;
      ref.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
      
      {/* Items List */}
      <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-2">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            {/* Product Images - Multiple images with scroll for bulk products */}
            <div className="flex-shrink-0">
              {item.product_detail?.images && item.product_detail.images.length > 1 ? (
                <div className="relative">
                  <div 
                    ref={el => scrollRefs.current[item.id] = el}
                    className="flex gap-1 overflow-x-auto scroll-smooth w-12 h-12 rounded-lg"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    {item.product_detail.images.slice(0, 6).map((img, idx) => (
                      <img 
                        key={idx}
                        src={img?.image ? `${BASE_IMAGE_URL}${img.image}` : '/images/placeholder.jpg'}
                        alt={item.product_detail?.name || 'Product'}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                        onError={(e) => { 
                          e.target.onerror = null;
                          e.target.src = '/images/placeholder.jpg'; 
                        }}
                      />
                    ))}
                  </div>
                  {item.product_detail.images.length > 3 && (
                    <>
                      <button 
                        onClick={() => scrollImages(item.id, 'left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 text-[10px]"
                      >
                        ‹
                      </button>
                      <button 
                        onClick={() => scrollImages(item.id, 'right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 text-[10px]"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <img 
                  src={item.product_detail?.primary_image ? `${BASE_IMAGE_URL}${item.product_detail.primary_image}` : '/images/placeholder.jpg'} 
                  alt={item.product_detail?.name} 
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                  onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                />
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product_detail?.name}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              {item.selected_size && <p className="text-xs text-gray-400">Size: {item.selected_size}</p>}
              {/* Show pack badge for bulk products */}
              {item.product_detail?.images && item.product_detail.images.length > 1 && (
                <span className="text-[10px] text-primary-500 font-medium">📦 {item.product_detail.images.length}pcs pack</span>
              )}
            </div>
            <span className="text-sm font-semibold text-gray-900">
              ₹{(item.price_at_add || item.product_detail?.price) * item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Price Details */}
      <div className="space-y-2 pt-3 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>{shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax (GST)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="flex justify-between font-bold text-gray-900 text-base sm:text-lg">
            <span>Total</span>
            <span className="text-primary-600">₹{total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
        </div>
      </div>

      {/* Coupon */}
      <div className="mt-4">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Coupon code" 
            value={couponCode} 
            onChange={(e) => setCouponCode(e.target.value)} 
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:outline-none"
          />
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-primary-500 hover:text-white transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Security Badges */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1"><Lock size={12} /> Secure</div>
          <div className="flex items-center gap-1"><Shield size={12} /> Protection</div>
          <div className="flex items-center gap-1"><Clock size={12} /> Returns</div>
        </div>
      </div>
    </div>
  );
}