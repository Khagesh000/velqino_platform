"use client";

import React from 'react';
import { useCreateOrderMutation } from '@/redux/wholesaler/slices/ordersSlice';
import { CheckCircle, Lock, Loader2 } from '../../../../../utils/icons';
import { toast } from 'react-toastify';

export default function OrderConfirmation({ currentStep, selectedAddress, deliveryType, paymentMethod, onBack, onPlaceOrder, isPlacingOrder }) {
  if (currentStep !== 3) return null;

  const handlePlaceOrderClick = () => {
  const token = localStorage.getItem('access');
  const userRole = localStorage.getItem('user_role');
  
  if (!token) {
    toast.warning('⚠️ Please login to place order', {
      position: "top-center",
      autoClose: 3000,
      onClick: () => router.push('/login')
    });
    return;
  }
  
  if (userRole === 'wholesaler' || userRole === 'customer') {
    toast.error('❌ You are not authorized to place orders. Only retailers can place orders.', {
      position: "top-center",
      autoClose: 4000
    });
    return;
  }
  
  if (userRole === 'retailer') {
    onPlaceOrder();
  }
};

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
          <CheckCircle size={16} />
        </div>
        <h2 className="font-semibold text-gray-900">Confirm Order</h2>
      </div>
      
      <div className="p-5 space-y-4">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600 text-sm">Delivery to</span>
          <span className="font-medium text-gray-900 text-sm text-right">{selectedAddress?.full_name}, {selectedAddress?.city}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600 text-sm">Delivery Type</span>
          <span className="font-medium text-gray-900 text-sm capitalize">{deliveryType}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600 text-sm">Payment Method</span>
          <span className="font-medium text-gray-900 text-sm capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</span>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button onClick={onBack} className="flex-1 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">Back</button>
          <button 
            onClick={handlePlaceOrderClick}
            disabled={isPlacingOrder}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              localStorage.getItem('user_role') === 'retailer' 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isPlacingOrder ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}