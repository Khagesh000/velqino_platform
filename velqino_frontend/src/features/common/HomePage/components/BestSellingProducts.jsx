"use client";

import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, TrendingUp, ChevronRight, Star } from '../../../../utils/icons';
import { useAddToCartMutation } from '@/redux/wholesaler/slices/cartSlice';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/redux/wholesaler/slices/wishlistSlice';
import { toast } from 'react-toastify';

const rankBadges = [
  { rank: '#1', label: 'Top Seller', badgeColor: 'bg-amber-500 text-white' },
  { rank: '#2', label: 'Trending', badgeColor: 'bg-primary-600 text-white' },
  { rank: '#3', label: 'Popular', badgeColor: 'bg-orange-500 text-white' },
  { rank: '#4', label: 'Hot Pick', badgeColor: 'bg-red-500 text-white' },
  { rank: '#5', label: 'Rising', badgeColor: 'bg-emerald-600 text-white' },
  { rank: '#6', label: 'Featured', badgeColor: 'bg-indigo-600 text-white' },
];

const BestsellerCard = memo(({ product, index, wishlistIds = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [isWishlist, setIsWishlist] = useState(false);

  useEffect(() => {
    setIsWishlist(wishlistIds?.includes(Number(product?.id)) || false);
  }, [wishlistIds, product?.id]);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isWishlist;
    setIsWishlist(newState);
    try {
      if (isWishlist) {
        await removeFromWishlist(product.id).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (error) {
      setIsWishlist(!newState);
      toast.error('Please login to update wishlist');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart({
        product_id: product.id,
        quantity: 1,
        selected_size: '',
        selected_color: ''
      }).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add to cart');
    }
  };

  const rankInfo = rankBadges[index] || { rank: `#${index + 1}`, label: 'Bestseller', badgeColor: 'bg-gray-700 text-white' };

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-200/80 p-3 hover:shadow-xl hover:border-primary-400 transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Image Container with Rank Badge */}
        <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-xl overflow-hidden bg-gray-50 mb-2.5 border border-gray-100 flex items-center justify-center">
          <Link href={`/product/productlistingpage?product_id=${product.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.image || product.primary_image || '/images/products/placeholder.jpg'}
              alt={product.name}
              loading="lazy"
              onError={(e) => { e.target.src = '/images/products/placeholder.jpg'; }}
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
            />
          </Link>

          {/* Rank Badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 shadow-xs">
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${rankInfo.badgeColor}`}>
              {rankInfo.rank}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all z-10"
            aria-label="Save to wishlist"
          >
            <Heart size={14} className={isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
          </button>
        </div>

        {/* Content */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-0.5">
            {rankInfo.label}
          </span>

          <Link href={`/product/productlistingpage?product_id=${product.id}`}>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1 hover:text-primary-600 transition-colors">
              {product.name}
            </h4>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 mb-1.5">
            <div className="flex items-center text-amber-400">
              <Star size={12} className="fill-current" />
            </div>
            <span className="text-[11px] font-bold text-gray-700">{product.rating || '4.8'}</span>
            <span className="text-[10px] text-gray-400">({product.reviews_count || '120+'})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <span className="text-base font-bold text-gray-900">
              ₹{product.display_price || product.price}
            </span>
            {product.retail_price > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.retail_price}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add To Cart */}
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className="w-full py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-semibold active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-xs"
      >
        <ShoppingCart size={13} />
        <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
      </button>
    </div>
  );
});

BestsellerCard.displayName = 'BestsellerCard';

export default function BestSellingProducts({ products = [], loading = false, wishlistIds = [] }) {
  const sectionRef = useRef(null);

  const visibleProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.slice(0, 6);
  }, [products]);

  if (loading) {
    return (
      <div className="container py-4 sm:py-5">
        <div className="h-80 bg-white rounded-2xl border border-gray-100 animate-pulse" />
      </div>
    );
  }

  if (visibleProducts.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-4 sm:py-5 lg:py-6 bg-white border-b border-gray-100">
      <div className="container">
        
        {/* Amazon-Style Best Sellers Leaderboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 sm:mb-5 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Customer Top Picks
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              Best Selling Products
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Highest rated wholesale garments & sarees based on repeat buyer orders
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/product/productlistingpage?sort=bestselling"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 group"
            >
              <span>View Leaderboard</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 6-Column Leaderboard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {visibleProducts.map((product, index) => (
            <BestsellerCard
              key={product.id}
              product={product}
              index={index}
              wishlistIds={wishlistIds}
            />
          ))}
        </div>

      </div>
    </section>
  );
}