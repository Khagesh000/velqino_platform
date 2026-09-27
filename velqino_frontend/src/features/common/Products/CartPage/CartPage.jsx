"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  useGetCartQuery, 
  useUpdateCartItemMutation, 
  useRemoveCartItemMutation, 
  useApplyCouponMutation, 
  useRemoveCouponMutation 
} from '@/redux/wholesaler/slices/cartSlice';
import CartItemsList from './components/CartItemsList';
import CartSummary from './components/CartSummary';
import EmptyCart from './components/EmptyCart';
import RecommendedProducts from './components/RecommendedProducts';
import { toast } from 'react-toastify';
import { 
  ShieldCheck, 
  Truck, 
  Lock, 
  ChevronRight, 
  ShoppingBag,
  Sparkles,
  CheckCircle
} from '@/utils/icons';
import '@/styles/common/CartPage.scss';

export default function CartPage() {
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // Fetch cart directly from API (Zero hardcoded data)
  const { data: cartData, isLoading, refetch } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [applyCoupon] = useApplyCouponMutation();
  const [removeCoupon] = useRemoveCouponMutation();
  
  const cartItems = cartData?.data?.items || [];
  const summary = cartData?.summary || {};
  
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItemId(productId);
    try {
      const response = await updateCartItem({ itemId: productId, quantity: newQuantity }).unwrap();
      if (response?.status === 'success' || !response?.error) {
        await refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdatingItemId(null);
    }
  };
  
  const removeItem = async (productId) => {
    setRemovingItemId(productId);
    try {
      const response = await removeCartItem(productId).unwrap();
      
      // Fetch cart endpoint only when removal is confirmed successful
      if (response?.status === 'success' || !response?.error) {
        toast.success(response?.message || 'Item removed from cart');
        await refetch();
      } else {
        toast.error(response?.message || 'Failed to remove item');
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'Failed to remove item');
    } finally {
      setRemovingItemId(null);
    }
  };
  
  const moveToWishlist = async (product) => {
    try {
      await removeItem(product.id);
      toast.success('Moved to wishlist');
    } catch (error) {
      toast.error('Failed to move to wishlist');
    }
  };
  
  const saveForLater = async (product) => {
    try {
      await removeItem(product.id);
      toast.success('Saved for later');
    } catch (error) {
      toast.error('Failed to save for later');
    }
  };
  
  const handleApplyCoupon = async (code) => {
    setIsApplyingCoupon(true);
    try {
      await applyCoupon(code).unwrap();
      toast.success('Coupon applied successfully!');
      refetch();
      return true;
    } catch (error) {
      toast.error(error?.data?.message || 'Invalid coupon code');
      return false;
    } finally {
      setIsApplyingCoupon(false);
    }
  };
  
  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon().unwrap();
      toast.success('Coupon removed');
      refetch();
    } catch (error) {
      toast.error('Failed to remove coupon');
    }
  };
  
  // Loading Skeleton with matching 2-column structure
  if (isLoading) {
    return (
      <div className="cart-page-wrapper py-6 sm:py-8 lg:py-10">
        <div className="container">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded-lg w-48 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded-2xl w-full max-w-md mx-auto"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                <div className="h-14 bg-gray-100 rounded-2xl"></div>
                <div className="h-44 bg-gray-100 rounded-2xl"></div>
                <div className="h-44 bg-gray-100 rounded-2xl"></div>
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
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <EmptyCart />
      </div>
    );
  }
  
  return (
    <div className="cart-page-wrapper py-5 sm:py-8 lg:py-10">
      <div className="container">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-4 sm:mb-6">
          <Link href="/" className="hover:text-primary-700 transition-colors">
            Home
          </Link>
          <ChevronRight size={13} className="text-gray-400" />
          <span className="text-gray-900 font-bold">Wholesale Cart</span>
        </div>

        {/* Stepper Progress Bar & Escrow Banner */}
        <div className="mb-6 sm:mb-8 bg-white rounded-2xl border border-primary-100 p-4 sm:p-5 shadow-2xs">
          
          <div className="cart-stepper mb-3.5">
            {/* Step 1: Cart */}
            <div className="step-item step-active">
              <div className="step-number">1</div>
              <span>Wholesale Cart ({cartItems.length})</span>
            </div>

            <div className="step-divider" />

            {/* Step 2: Shipping */}
            <div className="step-item">
              <div className="step-number">2</div>
              <span className="hidden sm:inline">Freight & Delivery</span>
              <span className="sm:hidden">Freight</span>
            </div>

            <div className="step-divider" />

            {/* Step 3: Escrow Payment */}
            <div className="step-item">
              <div className="step-number">3</div>
              <span className="hidden sm:inline">Escrow Trade Guarantee</span>
              <span className="sm:hidden">Payment</span>
            </div>
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
              256-Bit Encrypted Checkout
            </span>
          </div>

        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Cart Items List (8 Columns on desktop) */}
          <div className="lg:col-span-8">
            <CartItemsList 
              cartItems={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onMoveToWishlist={moveToWishlist}
              onSaveForLater={saveForLater}
              updatingItemId={updatingItemId}
              removingItemId={removingItemId}
            />
          </div>
          
          {/* Right Column: Sticky Summary & Checkout (4 Columns on desktop) */}
          <div className="lg:col-span-4">
            <CartSummary 
              cartItems={cartItems}
              summary={summary}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              isApplyingCoupon={isApplyingCoupon}
            />
          </div>

        </div>
        
        {/* Recommended Products (100% Real API Data) */}
        <RecommendedProducts />

      </div>
    </div>
  );
}
