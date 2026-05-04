"use client";

import React from 'react';
import { Wallet, CreditCard, Smartphone, Building } from '../../../../../utils/icons';

export default function PaymentSection({ currentStep, paymentMethod, setPaymentMethod, onNext, onBack }) {
  if (currentStep < 2) return null;

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: Wallet },
    { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: Smartphone },
    { id: 'netbanking', name: 'Net Banking', icon: Building },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">3</div>
        <h2 className="font-semibold text-gray-900">Payment Method</h2>
      </div>
      
      <div className="p-5 space-y-3">
        {paymentMethods.map((method) => (
          <label key={method.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
            <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={(e) => setPaymentMethod(e.target.value)} className="text-primary-500" />
            <method.icon size={18} className="text-gray-500" />
            <span className="text-sm font-medium">{method.name}</span>
          </label>
        ))}
      </div>
      
      <div className="p-5 pt-0 flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">Back</button>
        <button onClick={onNext} className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors">Review Order</button>
      </div>
    </div>
  );
}