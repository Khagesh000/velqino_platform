"use client";

import React from 'react';
import { Wallet, CreditCard, Smartphone, Building } from '../../../../../utils/icons';

export default function PriceBreakdown({ order }) {
  const getPaymentIcon = (method) => {
    switch(method) {
      case 'cod': return <Wallet size={18} className="text-primary-500" />;
      case 'card': return <CreditCard size={18} className="text-primary-500" />;
      case 'upi': return <Smartphone size={18} className="text-primary-500" />;
      case 'netbanking': return <Building size={18} className="text-primary-500" />;
      default: return <CreditCard size={18} className="text-primary-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          {getPaymentIcon(order.payment_method)}
          <h2 className="font-semibold text-gray-900">Payment Method</h2>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-gray-800 capitalize">
            {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
          </p>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${
            order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {order.payment_status}
          </span>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Price Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>₹{order.subtotal?.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-₹{order.discount?.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span>{order.shipping_charge === 0 ? 'Free' : `₹${order.shipping_charge}`}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax (GST)</span>
            <span>₹{order.tax?.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 mt-3">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="text-primary-600">₹{order.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}