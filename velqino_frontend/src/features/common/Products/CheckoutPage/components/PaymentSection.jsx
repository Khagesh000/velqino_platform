"use client";

import React from 'react';
import { 
  Wallet, 
  CreditCard, 
  Smartphone, 
  Building, 
  CheckCircle, 
  ChevronRight, 
  ArrowLeft,
  Lock,
  ShieldCheck,
  Edit3
} from '@/utils/icons';

export default function PaymentSection({ 
  currentStep, 
  paymentMethod, 
  setPaymentMethod, 
  onNext, 
  onBack,
  onEditPayment 
}) {
  const paymentMethods = [
    { 
      id: 'cod', 
      name: 'Cash on Delivery', 
      subtitle: 'Pay after delivery verification at your doorstep',
      badge: 'Protected COD',
      icon: Wallet 
    },
    { 
      id: 'upi', 
      name: 'Instant UPI Payment', 
      subtitle: 'Google Pay, PhonePe, Paytm, BHIM, and UPI ID',
      badge: 'Fast & Secure',
      icon: Smartphone 
    },
    { 
      id: 'card', 
      name: 'Credit / Debit Card', 
      subtitle: 'Visa, MasterCard, RuPay, and Business Cards',
      badge: '256-Bit SSL',
      icon: CreditCard 
    },
    { 
      id: 'netbanking', 
      name: 'Net Banking', 
      subtitle: 'All major Indian commercial & public sector banks',
      badge: 'Direct Banking',
      icon: Building 
    },
  ];

  // Inactive / Step 1
  if (currentStep < 2) {
    return (
      <div className="checkout-card opacity-60">
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">
                Payment Method
              </h3>
              <p className="text-[11px] text-gray-400">
                Complete address selection before choosing payment method
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Completed Step (Step 3: Confirm)
  if (currentStep > 2) {
    const selected = paymentMethods.find(m => m.id === paymentMethod) || paymentMethods[0];

    return (
      <div className="checkout-card">
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 inline-block mb-1">
                Payment Method Selected
              </span>
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {selected.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {selected.subtitle}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onEditPayment}
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
          3
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Select Payment Method
          </h2>
          <p className="text-[11px] text-gray-500">
            All payments are 100% secure and encrypted
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-3">
        
        {paymentMethods.map((method) => {
          const isSelected = paymentMethod === method.id;
          const Icon = method.icon;

          return (
            <div 
              key={method.id} 
              onClick={() => setPaymentMethod(method.id)}
              className={`checkout-option-tile ${isSelected ? 'active' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'border-primary-600 bg-primary-600' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-lg bg-primary-100/80 text-primary-700 flex items-center justify-center">
                        <Icon size={14} />
                      </div>
                      <span className="font-bold text-sm text-gray-900">
                        {method.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {method.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-primary-800 bg-primary-100/80 border border-primary-200 px-2 py-0.5 rounded-full flex-shrink-0">
                  {method.badge}
                </span>
              </div>
            </div>
          );
        })}

        {/* Security Notice */}
        <div className="bg-primary-50/60 border border-primary-200/90 rounded-xl p-3 flex items-start gap-2.5 text-xs text-primary-900">
          <ShieldCheck size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Security Guarantee:</strong> Your transaction is encrypted with 256-bit SSL protection. We never store raw card credentials.
          </p>
        </div>

        {/* Step 2 Action Buttons */}
        <div className="pt-3 flex items-center gap-3">
          <button 
            type="button"
            onClick={onBack} 
            className="checkout-btn-secondary px-4 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
          
          <button 
            type="button"
            onClick={onNext} 
            className="checkout-btn-primary flex-1 py-3 text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <span>Review Wholesale Order</span>
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
