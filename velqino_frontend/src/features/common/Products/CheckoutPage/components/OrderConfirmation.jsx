"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  Lock, 
  Loader2, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Wallet, 
  ArrowLeft,
  FileText
} from '@/utils/icons';
import { toast } from 'react-toastify';

export default function OrderConfirmation({ 
  currentStep, 
  selectedAddress, 
  deliveryType, 
  paymentMethod, 
  onBack, 
  onPlaceOrder, 
  isPlacingOrder 
}) {
  const router = useRouter();

  // Active only on Step 3
  if (currentStep !== 3) return null;

  const handlePlaceOrderClick = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
    const userRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
    
    if (!token) {
      toast.warning('Please sign in to place your wholesale order', {
        position: "top-center",
        autoClose: 3000,
        onClick: () => router.push('/login')
      });
      router.push('/login');
      return;
    }
    
    // Only block wholesalers if rule applies
    if (userRole === 'wholesaler') {
      toast.error('Wholesaler accounts cannot place orders. Only registered retailers and business buyers can place orders.', {
        position: "top-center",
        autoClose: 4000
      });
      return;
    }
    
    onPlaceOrder();
  };

  const paymentLabels = {
    cod: 'Cash on Delivery',
    upi: 'Instant UPI Payment',
    card: 'Credit / Debit Card',
    netbanking: 'Net Banking'
  };

  return (
    <div className="checkout-card">
      <div className="checkout-card-header flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
          3
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Review & Place Order
          </h2>
          <p className="text-[11px] text-gray-500">
            Please verify all order specifications before placing your order
          </p>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 space-y-4">
        
        {/* Verification Summary Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Destination Address */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              <MapPin size={13} className="text-primary-600" />
              <span>Delivery Address</span>
            </div>
            <p className="text-sm font-bold text-gray-900 truncate">
              {selectedAddress?.full_name}
            </p>
            <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
              {selectedAddress?.street}, {selectedAddress?.city} - {selectedAddress?.pincode}
            </p>
          </div>

          {/* Delivery Option */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              <Truck size={13} className="text-primary-600" />
              <span>Delivery Option</span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {deliveryType === 'express' ? 'Priority Express Delivery' : 'Standard Delivery'}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {deliveryType === 'express' ? '2-3 Business Days (+ ₹99.00)' : '5-7 Business Days (FREE)'}
            </p>
          </div>

          {/* Payment Method */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 sm:col-span-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              <Wallet size={13} className="text-primary-600" />
              <span>Payment Method</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">
                {paymentLabels[paymentMethod] || paymentMethod}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Verified Payment
              </span>
            </div>
          </div>

        </div>

        {/* Security / Escrow Callout */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl flex items-start gap-3">
          <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 space-y-1">
            <h4 className="font-bold">100% Escrow Trade Assurance Active</h4>
            <p className="text-emerald-800/90 leading-relaxed">
              Your wholesale payment is protected until verified delivery. Includes automated GST tax invoice dispatch upon fulfillment.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
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
            onClick={handlePlaceOrderClick}
            disabled={isPlacingOrder}
            className="checkout-btn-primary flex-1 py-3.5 text-sm sm:text-base flex items-center justify-center gap-2"
          >
            {isPlacingOrder ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Securing Order...</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>Place Wholesale Order</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
