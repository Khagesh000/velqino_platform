"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetOrderQuery } from '@/redux/wholesaler/slices/ordersSlice';
import { Download, ShoppingBag, FileText, CheckCircle } from '../../../../utils/icons';
import SuccessAnimation from './Components/SuccessAnimation';
import OrderDetailsTable from './Components/OrderDetailsTable';
import ShippingCard from './Components/ShippingCard';
import PriceBreakdown from './Components/PriceBreakdown';
import toast from 'react-hot-toast';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [showAnimation, setShowAnimation] = React.useState(true);
  
  const { data, isLoading, error } = useGetOrderQuery(orderId);
  
  const handleDownloadInvoice = async () => {
    toast.success('Invoice download started');
    // Implement invoice download logic
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse max-w-5xl mx-auto">
          <div className="h-32 bg-gray-100 rounded-xl mb-6"></div>
          <div className="h-64 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }
  
  if (error || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">We couldn't find your order. Please check the order number.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  const order = data.data;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8 sm:py-12">
      <SuccessAnimation onComplete={() => setShowAnimation(false)} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500">Thank you for shopping with us. Your order has been placed successfully.</p>
        </div>
        
        {/* Order Info Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-lg font-bold text-gray-900">{order.order_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="text-gray-700">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium capitalize bg-yellow-100 text-yellow-700">
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Confirmation</p>
              <p className="text-sm text-green-600">✓ Sent to {order.customer?.email}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Section - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <OrderDetailsTable items={order.items} />
            <ShippingCard order={order} />
          </div>
          
          {/* Right Section */}
          <div className="space-y-6">
            <PriceBreakdown order={order} />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/products" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
          <Link href="/account/orders" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            <FileText size={18} />
            View All Orders
          </Link>
          <button onClick={handleDownloadInvoice} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors">
            <Download size={18} />
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}