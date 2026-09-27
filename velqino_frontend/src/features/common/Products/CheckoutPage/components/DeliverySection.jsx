"use client";

import React from 'react';
import { 
  Truck, 
  Zap, 
  CheckCircle, 
  ChevronRight, 
  ArrowLeft,
  Edit3 
} from '@/utils/icons';

export default function DeliverySection({ 
  currentStep, 
  deliveryType, 
  setDeliveryType, 
  onNext, 
  onBack,
  onEditDelivery 
}) {
  // Inactive / Step 1
  if (currentStep < 2) {
    return (
      <div className="checkout-card opacity-60">
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">
                Delivery Options
              </h3>
              <p className="text-[11px] text-gray-400">
                Complete address selection to choose delivery speed
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Completed Step (Step 3: Confirm)
  if (currentStep > 2) {
    const isExpress = deliveryType === 'express';

    return (
      <div className="checkout-card">
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 inline-block mb-1">
                Delivery Option Selected
              </span>
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {isExpress ? 'Priority Express Delivery' : 'Standard Delivery'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isExpress ? '2-3 Business Days (Express Logistics)' : '5-7 Business Days across 19,000+ PIN codes'}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onEditDelivery}
            className="checkout-btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1.5 flex-shrink-0"
          >
            <Edit3 size={13} />
            <span>Change</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Step (Step 2)
  return (
    <div className="checkout-card">
      <div className="checkout-card-header flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
          2
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Delivery Options & Speed
          </h2>
          <p className="text-[11px] text-gray-500">
            Choose your preferred delivery speed for this shipment
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-3.5">
        
        {/* Standard Delivery Option */}
        <div 
          onClick={() => setDeliveryType('standard')}
          className={`checkout-option-tile ${deliveryType === 'standard' ? 'active' : ''}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  deliveryType === 'standard' 
                    ? 'border-primary-600 bg-primary-600' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {deliveryType === 'standard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-primary-100/80 text-primary-700 flex items-center justify-center">
                    <Truck size={14} />
                  </div>
                  <span className="font-bold text-sm text-gray-900">
                    Standard Delivery
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Reliable surface delivery across 19,000+ PIN codes
                </p>
                <span className="text-[11px] text-gray-400 font-medium block mt-1">
                  Estimated Arrival: 5-7 Business Days
                </span>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex-shrink-0">
              FREE
            </span>
          </div>
        </div>

        {/* Express Delivery Option */}
        <div 
          onClick={() => setDeliveryType('express')}
          className={`checkout-option-tile ${deliveryType === 'express' ? 'active' : ''}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  deliveryType === 'express' 
                    ? 'border-primary-600 bg-primary-600' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {deliveryType === 'express' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Zap size={14} />
                  </div>
                  <span className="font-bold text-sm text-gray-900">
                    Priority Express Delivery
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Fast priority dispatch for urgent wholesale shipments
                </p>
                <span className="text-[11px] text-gray-400 font-medium block mt-1">
                  Estimated Arrival: 2-3 Business Days
                </span>
              </div>
            </div>

            <span className="text-xs font-extrabold text-primary-700 bg-primary-100 border border-primary-200 px-2.5 py-1 rounded-full flex-shrink-0">
              + ₹99.00
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
