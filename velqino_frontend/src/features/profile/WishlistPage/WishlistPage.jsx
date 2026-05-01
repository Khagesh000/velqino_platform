"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetWishlistQuery, useRemoveFromWishlistMutation, useGetWishlistStatsQuery } from '../../../redux/wholesaler/slices/wishlistSlice';
import { useAddToCartMutation } from '../../../redux/wholesaler/slices/cartSlice';
import { Heart, ShoppingCart, Trash2, Loader2, ChevronLeft, ChevronRight } from '../../../utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';
import { toast } from 'react-toastify';

export default function WishlistPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const imageScrollRefs = useRef({});
  const [perPage] = useState(12);
  
  const { data, isLoading, refetch } = useGetWishlistQuery({ page, per_page: perPage });
  const { data: statsData } = useGetWishlistStatsQuery();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  
  const wishlistItems = data?.data || [];
  const pagination = data?.pagination;
  const stats = statsData?.data;

    const scrollImage = (itemId, direction) => {
    const ref = imageScrollRefs.current[itemId];
    if (ref) {
        const scrollAmount = ref.clientWidth;
        ref.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
        });
    }
    };
  
  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success('Removed from wishlist');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to remove');
    }
  };
  
  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await addToCart({
        product_id: productId,
        quantity: quantity,
        selected_size: '',
        selected_color: ''
      }).unwrap();
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add to cart');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save your favorite items here</p>
          <Link href="/product/productlistingpage" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">
            {stats?.total_items || wishlistItems.length} items saved
            {stats?.total_value && ` · Worth ₹${stats.total_value.toLocaleString()}`}
          </p>
        </div>
        <Link 
          href="/product/productlistingpage" 
          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
        >
          Continue Shopping →
        </Link>
      </div>
      
      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          
            {/* Product Images with Scroll */}
            <Link href={`/product/${item.product_slug || item.product_id}`} className="block aspect-square bg-gray-100 rounded-t-xl overflow-hidden relative group">
            {item.product_images && item.product_images.length > 1 ? (
                <div className="relative w-full h-full">
                <div 
                    ref={el => imageScrollRefs.current[item.id] = el}
                    className="flex overflow-x-auto scroll-smooth h-full snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'thin' }}
                >
                    {item.product_images.map((img, idx) => (
                    <img 
                        key={idx}
                        src={`${BASE_IMAGE_URL}${img}`}
                        alt={item.product_name}
                        className="w-full h-full object-cover flex-shrink-0 snap-start"
                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                    />
                    ))}
                </div>
                {item.product_images.length > 1 && (
                    <>
                    <button 
                        onClick={(e) => { e.preventDefault(); scrollImage(item.id, 'left'); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center hover:bg-white shadow-md z-10"
                    >
                        ‹
                    </button>
                    <button 
                        onClick={(e) => { e.preventDefault(); scrollImage(item.id, 'right'); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center hover:bg-white shadow-md z-10"
                    >
                        ›
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {item.product_images.map((_, idx) => (
                        <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                        ))}
                    </div>
                    </>
                )}
                </div>
            ) : (
                <img 
                src={item.product_primary_image ? `${BASE_IMAGE_URL}${item.product_primary_image}` : '/images/placeholder.jpg'}
                alt={item.product_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                />
            )}
            {item.product_stock === 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full z-20">
                Out of Stock
                </span>
            )}
            </Link>
            
            {/* Product Info */}
            <div className="p-3">
              <Link href={`/product/${item.product_slug || item.product_id}`}>
                <h3 className="font-medium text-gray-800 hover:text-primary-500 transition-colors line-clamp-1 text-sm">
                  {item.product_name}
                </h3>
              </Link>
              
              <div className="mt-1">
                <span className="text-lg font-bold text-primary-600">₹{item.product_price}</span>
                {item.product_compare_price && item.product_compare_price > item.product_price && (
                  <span className="text-xs text-gray-400 line-through ml-2">₹{item.product_compare_price}</span>
                )}
              </div>
              
              <p className="text-xs text-gray-400 mt-1">
                Added on {new Date(item.added_at).toLocaleDateString()}
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAddToCart(item.product_id)}
                  disabled={isAddingToCart || item.product_stock === 0}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={14} />
                  )}
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.product_id)}
                  disabled={isRemoving}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-all disabled:opacity-50"
                  title="Remove from wishlist"
                >
                  {isRemoving ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {pagination.total_pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
            disabled={page === pagination.total_pages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}