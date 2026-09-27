"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  useGetCartQuery, 
  useApplyCouponMutation, 
  useRemoveCouponMutation 
} from '@/redux/wholesaler/slices/cartSlice';
import { useCreateOrderMutation } from '@/redux/wholesaler/slices/ordersSlice';
import { 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Lock, 
  ShoppingCart, 
  CheckCircle,
  Package,
  Store
} from '@/utils/icons';
import CheckoutSteps from './components/CheckoutSteps';
import AddressSection from './components/AddressSection';
import DeliverySection from './components/DeliverySection';
import PaymentSection from './components/PaymentSection';
import OrderSummary from './components/OrderSummary';
import OrderConfirmation from './components/OrderConfirmation';
import { toast } from 'react-toastify';
import '@/styles/common/CheckoutPage.scss';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryType, setDeliveryType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const router = useRouter();
  const [createOrder] = useCreateOrderMutation();
  const [applyCoupon] = useApplyCouponMutation();
  const [removeCoupon] = useRemoveCouponMutation();

  // Fetch cart directly from API (Zero hardcoded data)
  const { data: cartData, isLoading: cartLoading, refetch: refetchCart } = useGetCartQuery();
  
  const cartItems = cartData?.data?.items || [];
  const summary = cartData?.summary || {};
  
  const subtotal = summary?.subtotal || cartItems.reduce((sum, item) => sum + ((item.price_at_add || item.product_detail?.price || 0) * item.quantity), 0) || 0;
  const discount = summary?.discount || 0;
  
  // Shipping calculation: Free standard above 500, +99 for express
  const shippingCharge = deliveryType === 'express' ? 99 : (subtotal > 500 ? 0 : 99);
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = Math.max(0, subtotal - discount) + shippingCharge + tax;

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedAddress) {
      toast.error('Please select or add a delivery address');
      return;
    }
    if (currentStep >= 3) return;
    setCurrentStep(prev => prev + 1);
  };

  const handleApplyCoupon = async (code) => {
    if (!code || !code.trim()) return;
    setIsApplyingCoupon(true);
    try {
      await applyCoupon(code).unwrap();
      toast.success('Coupon applied successfully!');
      refetchCart();
    } catch (error) {
      toast.error(error?.data?.message || 'Invalid coupon code');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon().unwrap();
      toast.success('Coupon removed');
      refetchCart();
    } catch (error) {
      toast.error('Failed to remove coupon');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      setCurrentStep(1);
      return;
    }
    
    setIsPlacingOrder(true);
    
    try {
      const response = await createOrder({
        address_id: selectedAddress.id,
        delivery_type: deliveryType,
        payment_method: paymentMethod
      }).unwrap();
      
      toast.success('Wholesale order placed successfully!');
      const orderId = response?.data?.order_id || response?.order_id || response?.data?.id || '';
      router.push(`/product/orderconfirmation/${orderId}`);
      
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.data?.message || 'Failed to place wholesale order');
      setIsPlacingOrder(false);
    }
  };

  // Loading Skeleton matching exact 2-column structure
  if (cartLoading) {
    return (
      <div className="checkout-page-wrapper py-6 sm:py-8 lg:py-10">
        <div className="container">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded-lg w-48 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded-2xl w-full max-w-md mx-auto"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              <div className="lg:col-span-8 space-y-4">
                <div className="h-24 bg-gray-100 rounded-2xl"></div>
                <div className="h-64 bg-gray-100 rounded-2xl"></div>
                <div className="h-32 bg-gray-100 rounded-2xl"></div>
              </div>
              <div className="lg:col-span-4">
                <div className="h-96 bg-gray-100 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page-wrapper min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute w-32 h-32 rounded-full bg-primary-100/60 animate-ping opacity-25 pointer-events-none" />
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-100 via-primary-50 to-white border-2 border-primary-200/80 flex items-center justify-center shadow-lg text-primary-600 relative z-10">
              <ShoppingCart size={40} className="stroke-[1.6]" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your Wholesale Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Please add verified wholesale lots from the catalog before proceeding to checkout.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              href="/product/productlistingpage" 
              className="checkout-btn-primary px-6 py-3 text-xs sm:text-sm font-bold inline-flex items-center gap-2"
            >
              <span>Explore Wholesale Catalog</span>
              <ChevronRight size={14} />
            </Link>
            <Link 
              href="/" 
              className="checkout-btn-secondary px-5 py-3 text-xs sm:text-sm"
            >
              <span>Back to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper py-5 sm:py-8 lg:py-10">
      <div className="container">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-4 sm:mb-6">
          <Link href="/" className="hover:text-primary-700 transition-colors">
            Home
          </Link>
          <ChevronRight size={13} className="text-gray-400" />
          <Link href="/product/cartpage" className="hover:text-primary-700 transition-colors">
            Wholesale Cart
          </Link>
          <ChevronRight size={13} className="text-gray-400" />
          <span className="text-gray-900 font-bold">Checkout</span>
        </div>

        {/* Stepper Progress Bar & Escrow Banner */}
        <div className="mb-6 sm:mb-8 bg-white rounded-2xl border border-primary-100 p-4 sm:p-5 shadow-2xs">
          
          <div className="mb-3.5">
            <CheckoutSteps 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep} 
            />
          </div>

          {/* Escrow Guarantee Privilege Strip */}
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-gray-600 font-medium">
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
              256-Bit Encrypted Escrow Protocol
            </span>
          </div>

        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Form Steps (8 Columns on desktop) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Step 1: Delivery Address */}
            <AddressSection 
              currentStep={currentStep}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              onNext={handleNextStep}
              onEditAddress={() => setCurrentStep(1)}
            />
            
            {/* Step 2: Delivery Options (Active when on Step 2, or completed summary on Step 3) */}
            <DeliverySection 
              currentStep={currentStep}
              deliveryType={deliveryType}
              setDeliveryType={setDeliveryType}
              onNext={handleNextStep}
              onBack={() => setCurrentStep(1)}
              onEditDelivery={() => setCurrentStep(2)}
            />
            
            {/* Step 2: Payment Method (Active when on Step 2, or completed summary on Step 3) */}
            <PaymentSection 
              currentStep={currentStep}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onNext={handleNextStep}
              onBack={() => setCurrentStep(1)}
              onEditPayment={() => setCurrentStep(2)}
            />
            
            {/* Step 3: Final Review & Confirmation */}
            <OrderConfirmation 
              currentStep={currentStep}
              selectedAddress={selectedAddress}
              deliveryType={deliveryType}
              paymentMethod={paymentMethod}
              onBack={() => setCurrentStep(2)}
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={isPlacingOrder}
            />

            {/* Back to Cart Strip */}
            <div className="p-4 bg-white rounded-2xl border border-primary-100 flex items-center justify-between shadow-2xs">
              <Link
                href="/product/cartpage"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Return to Wholesale Cart</span>
              </Link>
              <span className="text-xs text-gray-500 hidden sm:inline">
                Escrow protected direct-from-mill trading
              </span>
            </div>

          </div>

          {/* Right Column: Sticky Summary (4 Columns on desktop) */}
          <div className="lg:col-span-4">
            <OrderSummary 
              cartItems={cartItems}
              subtotal={subtotal}
              discount={discount}
              shippingCharge={shippingCharge}
              tax={tax}
              total={total}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              isApplyingCoupon={isApplyingCoupon}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
