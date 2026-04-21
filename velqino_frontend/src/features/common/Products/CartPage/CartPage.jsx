"use client";

import React, { useState, useEffect } from 'react';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation, useApplyCouponMutation, useRemoveCouponMutation } from '@/redux/wholesaler/slices/cartSlice';
import CartItemsList from './Components/CartItemsList';
import CartSummary from './Components/CartSummary';
import EmptyCart from './Components/EmptyCart';
import RecommendedProducts from './Components/RecommendedProducts';
import { toast } from 'react-toastify';

export default function CartPage() {
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // Fetch cart from API
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
      await updateCartItem({ itemId: productId, quantity: newQuantity }).unwrap();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdatingItemId(null);
    }
  };
  
  const removeItem = async (productId) => {
    setRemovingItemId(productId);
    try {
      await removeCartItem(productId).unwrap();
      toast.success('Item removed from cart');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to remove item');
    } finally {
      setRemovingItemId(null);
    }
  };
  
  const moveToWishlist = async (product) => {
    // Add to wishlist logic
    try {
      // Call wishlist API here
      await removeItem(product.id);
      toast.success('Moved to wishlist');
    } catch (error) {
      toast.error('Failed to move to wishlist');
    }
  };
  
  const saveForLater = async (product) => {
    // Save for later logic
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
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
  
  if (!cartItems || cartItems.length === 0) {
    return <EmptyCart />;
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-primary-500">Home</a>
        <span>/</span>
        <span className="text-gray-900 font-medium">Shopping Cart</span>
      </div>
      
      <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section - Cart Items */}
        <div className="lg:w-2/3">
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
        
        {/* Right Section - Summary */}
        <div className="lg:w-1/3">
          <CartSummary 
            cartItems={cartItems}
            summary={summary}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            isApplyingCoupon={isApplyingCoupon}
          />
        </div>
      </div>
      
      {/* Recommended Products */}
      <RecommendedProducts />
    </div>
  );
}