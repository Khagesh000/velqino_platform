"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  useGetOrderQuery, 
  useDownloadInvoiceMutation 
} from '@/redux/wholesaler/slices/ordersSlice';
import { 
  Download, 
  ShoppingBag, 
  FileText, 
  CheckCircle, 
  Loader2, 
  ShieldCheck, 
  Truck, 
  Lock, 
  ChevronRight, 
  Copy, 
  Calendar, 
  PackageCheck,
  Package,
  ArrowRight
} from '@/utils/icons';
import SuccessAnimation from './components/SuccessAnimation';
import OrderDetailsTable from './components/OrderDetailsTable';
import ShippingCard from './components/ShippingCard';
import PriceBreakdown from './components/PriceBreakdown';
import { toast } from 'react-toastify';
import '@/styles/common/OrderConfirmationPage.scss';

export default function OrderConfirmationPage({ orderId }) {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const { data, isLoading, error } = useGetOrderQuery(orderId);
  const [downloadInvoice, { isLoading: isDownloading }] = useDownloadInvoiceMutation();

  const handleDownloadInvoice = async () => {
    if (!order?.order_number) return;
    try {
      await downloadInvoice(order.order_number).unwrap();
      toast.success('GST Invoice downloaded successfully!');
    } catch (err) {
      console.error('Invoice download error:', err);
      toast.error('Failed to download invoice. Please try again.');
    }
  };

  const copyOrderNumber = () => {
    if (!order?.order_number) return;
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    toast.success('Order number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading Skeleton matching exact 2-column structure
  if (isLoading) {
    return (
      <div className="confirmation-page-wrapper py-8 sm:py-12">
        <div className="container">
          <div className="animate-pulse space-y-6 max-w-5xl mx-auto">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-44 bg-gray-200 rounded-3xl w-full"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              <div className="lg:col-span-8 space-y-5">
                <div className="h-64 bg-gray-100 rounded-2xl"></div>
                <div className="h-48 bg-gray-100 rounded-2xl"></div>
              </div>
              <div className="lg:col-span-4 space-y-5">
                <div className="h-80 bg-gray-100 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !data?.data) {
    return (
      <div className="confirmation-page-wrapper min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 border border-red-200 rounded-3xl flex items-center justify-center mx-auto mb-4 text-red-500 shadow-sm">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            We couldn't locate order reference #{orderId}. Please verify your order number in your order history.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              href="/product/orderslist" 
              className="confirmation-btn-primary px-6 py-3 text-xs sm:text-sm font-bold inline-flex items-center gap-2"
            >
              <span>View Order History</span>
              <ChevronRight size={14} />
            </Link>
            <Link 
              href="/product/productlistingpage" 
              className="confirmation-btn-secondary px-5 py-3 text-xs sm:text-sm"
            >
              <span>Wholesale Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const order = data.data;

  // Tracker Stages
  const trackerStages = [
    { id: 1, label: 'Order Registered', status: 'completed' },
    { id: 2, label: 'Mill Quality Check', status: order?.status !== 'pending' ? 'completed' : 'active' },
    { id: 3, label: 'Freight Dispatch', status: ['dispatched', 'delivered'].includes(order?.status) ? 'completed' : 'pending' },
    { id: 4, label: 'Delivery & Escrow Release', status: order?.status === 'delivered' ? 'completed' : 'pending' }
  ];

  return (
    <div className="confirmation-page-wrapper py-6 sm:py-10 lg:py-12">
      {/* Subtle celebration animation */}
      {showAnimation && <SuccessAnimation onComplete={() => setShowAnimation(false)} />}
      
      <div className="container">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-5 sm:mb-8">
          <Link href="/" className="hover:text-primary-700 transition-colors">
            Home
          </Link>
          <ChevronRight size={13} className="text-gray-400" />
          <Link href="/product/orderslist" className="hover:text-primary-700 transition-colors">
            Order History
          </Link>
          <ChevronRight size={13} className="text-gray-400" />
          <span className="text-gray-900 font-bold">Order #{order.order_number}</span>
        </div>

        {/* Hero Success Confirmation Card */}
        <div className="mb-6 sm:mb-8 bg-white rounded-3xl border border-primary-200/80 p-6 sm:p-8 shadow-sm text-center">
          
          <div className="confirmation-halo mb-4">
            <div className="halo-ping" />
            <div className="halo-icon">
              <CheckCircle size={38} className="stroke-[1.8]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Escrow Trade Guarantee Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2 tracking-tight">
            Wholesale Order Confirmed!
          </h1>
          
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed mb-6 font-normal">
            Thank you for your business. Your direct mill order has been registered and is now in production inspection. An automated GST invoice copy has been sent to <strong className="text-gray-800">{order.customer?.email}</strong>.
          </p>

          {/* Escrow Guarantee Privilege Strip */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-gray-600 font-medium">
            <span className="inline-flex items-center gap-1.5 text-primary-800 font-semibold">
              <ShieldCheck size={14} className="text-primary-600" />
              100% Escrow Trade Assurance
            </span>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Truck size={14} className="text-primary-600" />
              Direct Mill Freight Logistics
            </span>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Lock size={14} className="text-primary-600" />
              256-Bit SSL Encrypted Settlement
            </span>
          </div>

        </div>

        {/* Order Meta Ribbon */}
        <div className="mb-6 sm:mb-8 bg-white rounded-2xl border border-primary-100 p-4 sm:p-5 shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            
            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                Order Number
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm sm:text-base font-black text-gray-900">
                  {order.order_number}
                </span>
                <button 
                  type="button"
                  onClick={copyOrderNumber}
                  className="text-gray-400 hover:text-primary-600 transition-colors p-1"
                  title="Copy Order ID"
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                Order Date
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-800 mt-0.5 block">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                Order Status
              </span>
              <span className="inline-block mt-0.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full capitalize">
                {order.status}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                Total Billed
              </span>
              <span className="text-sm sm:text-base font-black text-primary-700 mt-0.5 block">
                ₹{parseFloat(order.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

          </div>
        </div>

        {/* Order Status Progress Tracker */}
        <div className="mb-8 bg-white rounded-2xl border border-primary-100 p-5 sm:p-6 shadow-2xs">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-6">
            Fulfillment & Escrow Progression
          </h3>

          <div className="order-tracker">
            <div className="tracker-line">
              <div 
                className="tracker-line-fill" 
                style={{ width: order?.status === 'delivered' ? '100%' : (['dispatched'].includes(order?.status) ? '66%' : '33%') }} 
              />
            </div>

            {trackerStages.map((stage) => {
              const isCompleted = stage.status === 'completed';
              const isActive = stage.status === 'active';

              return (
                <div key={stage.id} className="tracker-item">
                  <div className={`tracker-circle ${isCompleted ? 'completed' : (isActive ? 'active' : '')}`}>
                    {isCompleted ? <CheckCircle size={15} /> : stage.id}
                  </div>
                  <span className={`tracker-label ${isActive ? 'active' : ''}`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Items Table + Delivery Card (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            <OrderDetailsTable items={order.items || []} />
            <ShippingCard order={order} />
          </div>

          {/* Right Column: Financial Summary & Actions (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            <PriceBreakdown order={order} />

            {/* Next Actions & Invoicing Card */}
            <div className="bg-white rounded-2xl border-2 border-primary-200/90 shadow-xs p-4 sm:p-5 space-y-3.5 confirmation-card">
              <div className="flex items-center gap-2 pb-2.5 border-b border-primary-100">
                <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                  <FileText size={14} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Next Actions & Invoicing
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    Official GST invoices sealed with escrow dispatch note
                  </p>
                </div>
              </div>

              {/* Primary CTA Button: Download Official GST Invoice */}
              <button 
                type="button"
                onClick={handleDownloadInvoice} 
                disabled={isDownloading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 hover:from-primary-800 hover:via-primary-700 hover:to-primary-800 active:from-primary-900 active:to-primary-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg shadow-primary-900/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none confirmation-btn-primary"
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    <span className="tracking-wide">Generating GST Invoice...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} className="text-white" />
                    <span className="tracking-wide">Download Official GST Invoice</span>
                  </>
                )}
              </button>

              {/* Secondary CTA Button 1: View All Wholesale Orders */}
              <Link 
                href="/product/orderslist" 
                className="w-full py-3 px-4 rounded-xl bg-primary-50/80 hover:bg-primary-100/90 active:bg-primary-200/90 text-primary-900 hover:text-primary-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 border-2 border-primary-200 hover:border-primary-400 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer confirmation-btn-secondary"
              >
                <FileText size={16} className="text-primary-700" />
                <span>View All Wholesale Orders</span>
              </Link>

              {/* Secondary CTA Button 2: Continue to Wholesale Catalog */}
              <Link 
                href="/product/productlistingpage" 
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-primary-50 active:bg-primary-100 text-primary-900 hover:text-primary-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 border-2 border-primary-200/90 hover:border-primary-400 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer confirmation-btn-secondary"
              >
                <ShoppingBag size={16} className="text-primary-700" />
                <span>Continue to Wholesale Catalog</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
