"use client";

import React, { useState, useEffect } from 'react';
import { Heart } from '../../../../utils/icons';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '../../../../redux/wholesaler/slices/wishlistSlice';
import { toast } from 'react-toastify';

export default function WishlistButton({ productId, isWishlisted: initialIsWishlisted = false }) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();
  
  useEffect(() => {
    setIsWishlisted(initialIsWishlisted);
  }, [initialIsWishlisted]);
  
  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId).unwrap();
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(productId).unwrap();
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Please login to add to wishlist');
    }
  };
  
  return (
    <button
      onClick={handleToggle}
      disabled={isAdding || isRemoving}
      className="p-2 bg-white border border-gray-200 rounded-full hover:border-primary-300 transition-all disabled:opacity-50"
    >
      <Heart 
        size={18} 
        className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}
      />
    </button>
  );
}