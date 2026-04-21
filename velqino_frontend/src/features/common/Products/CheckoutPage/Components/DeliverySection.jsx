"use client";

import React from 'react';
import { Truck, Zap } from '../../../../../utils/icons';

export default function DeliverySection({ currentStep, deliveryType, setDeliveryType, onNext, onBack }) {
  if (currentStep < 2) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">2</div>
        <h2 className="font-semibold text-gray-900">Delivery Options</h2>
      </div>
      
      <div className="p-5 space-y-3">
        <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${deliveryType === 'standard' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <input type="radio" name="delivery" value="standard" checked={deliveryType === 'standard'} onChange={(e) => setDeliveryType(e.target.value)} className="text-primary-500" />
            <div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-gray-500" />
                <p className="font-medium text-gray-900">Standard Delivery</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">5-7 business days</p>
            </div>
          </div>
          <span className="font-medium text-gray-900">Free</span>
        </label>
        
        <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${deliveryType === 'express' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <input type="radio" name="delivery" value="express" checked={deliveryType === 'express'} onChange={(e) => setDeliveryType(e.target.value)} className="text-primary-500" />
            <div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-orange-500" />
                <p className="font-medium text-gray-900">Express Delivery</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">2-3 business days</p>
            </div>
          </div>
          <span className="font-medium text-primary-600">+ ₹99</span>
        </label>
      </div>
      
      <div className="p-5 pt-0 flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">Back</button>
        <button onClick={onNext} className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors">Continue to Payment</button>
      </div>
    </div>
  );
}