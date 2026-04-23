"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetCartQuery } from '@/redux/wholesaler/slices/cartSlice';
import { useCreateOrderMutation } from '@/redux/wholesaler/slices/ordersSlice';
import { ArrowLeft, ShoppingCart } from '../../../../utils/icons';
import CheckoutSteps from './Components/CheckoutSteps';
import AddressSection from './Components/AddressSection';
import DeliverySection from './Components/DeliverySection';
import PaymentSection from './Components/PaymentSection';
import OrderSummary from './Components/OrderSummary';
import OrderConfirmation from './Components/OrderConfirmation';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryType, setDeliveryType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const router = useRouter();
  const [createOrder] = useCreateOrderMutation();

  const { data: cartData, isLoading: cartLoading } = useGetCartQuery();
  
  const cartItems = cartData?.data?.items || [];
  const summary = cartData?.summary || {};
  
  const subtotal = summary?.subtotal || 0;
  const discount = summary?.discount || 0;
  const shippingCharge = deliveryType === 'express' ? 99 : 0;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + shippingCharge + tax;

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-gray-100 rounded-xl h-96"></div>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-gray-100 rounded-xl h-80"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add items to proceed with checkout</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    if (currentStep >= 3) return;
    setCurrentStep(currentStep + 1);
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
      
      toast.success('Order placed successfully!');
      router.push(`orderconfirmation/${response.data.order_id}`);
      
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.data?.message || 'Failed to place order');
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-500 mb-4 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Cart</span>
        </Link>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
      </div>

      {/* Steps */}
      <CheckoutSteps currentStep={currentStep} setCurrentStep={setCurrentStep} />

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        
        {/* LEFT SECTION - Forms */}
        <div className="lg:w-2/3 space-y-6">
          <AddressSection 
            currentStep={currentStep}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            onNext={handleNextStep}
          />
          
          <DeliverySection 
            currentStep={currentStep}
            deliveryType={deliveryType}
            setDeliveryType={setDeliveryType}
            onNext={handleNextStep}
            onBack={() => setCurrentStep(1)}
          />
          
          <PaymentSection 
            currentStep={currentStep}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onNext={handleNextStep}
            onBack={() => setCurrentStep(2)}
          />
          
          {/* ✅ Order Summary - Mobile: Shows BEFORE Place Order button */}
          <div className="block lg:hidden">
            <OrderSummary 
              cartItems={cartItems}
              subtotal={subtotal}
              discount={discount}
              shippingCharge={shippingCharge}
              tax={tax}
              total={total}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
            />
          </div>
          
          {/* Order Confirmation with Place Order button */}
          <OrderConfirmation 
            currentStep={currentStep}
            selectedAddress={selectedAddress}
            deliveryType={deliveryType}
            paymentMethod={paymentMethod}
            onBack={() => setCurrentStep(2)}
            onPlaceOrder={handlePlaceOrder}
            isPlacingOrder={isPlacingOrder}
          />
        </div>

        {/* RIGHT SECTION - Order Summary (Desktop only) */}
        <div className="hidden lg:block lg:w-1/3">
          <OrderSummary 
            cartItems={cartItems}
            subtotal={subtotal}
            discount={discount}
            shippingCharge={shippingCharge}
            tax={tax}
            total={total}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
          />
        </div>
        
      </div>
    </div>
  );
}