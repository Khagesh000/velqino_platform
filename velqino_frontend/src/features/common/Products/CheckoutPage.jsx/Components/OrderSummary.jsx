"use client";

import React from 'react';
import { Lock, Shield, Clock, Truck } from '../../../../../utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

export default function OrderSummary({ cartItems, subtotal, discount, shippingCharge, tax, total, couponCode, setCouponCode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
      
      {/* Items List */}
      <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-2">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <img 
              src={item.product_detail?.primary_image ? `${BASE_IMAGE_URL}${item.product_detail.primary_image}` : '/images/placeholder.jpg'} 
              alt={item.product_detail?.name} 
              className="w-12 h-12 rounded-lg object-cover bg-gray-100"
              onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product_detail?.name}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              {item.selected_size && <p className="text-xs text-gray-400">Size: {item.selected_size}</p>}
            </div>
            <span className="text-sm font-semibold text-gray-900">₹{(item.price_at_add || item.product_detail?.price) * item.quantity}</span>
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