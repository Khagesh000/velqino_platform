"use client";

import React, { useState, useEffect, memo, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Sparkles, ChevronRight } from '../../../../utils/icons';
import { useAddToCartMutation } from '@/redux/wholesaler/slices/cartSlice';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/redux/wholesaler/slices/wishlistSlice';
import { toast } from 'react-toastify';

const FashionCard = memo(({ product, wishlistIds = [] }) => {
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

  const discountPercent = product.retail_price && product.price && product.retail_price > product.price
    ? Math.round(((product.retail_price - product.price) / product.retail_price) * 100)
    : 0;

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:shadow-xl hover:border-primary-400 transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Tall Portrait Fashion Image Container (aspect-[3/4]) */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 border-b border-gray-100 flex items-center justify-center">
          <Link href={`/product/productlistingpage?product_id=${product.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.image || product.primary_image || '/images/products/placeholder.jpg'}
              alt={product.name}
              loading="lazy"
              onError={(e) => { e.target.src = '/images/products/placeholder.jpg'; }}
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
            />
          </Link>

          {/* New In Pill */}
          <div className="absolute top-2.5 left-2.5 bg-gray-900/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs shadow-xs">
            <Sparkles size={9} className="text-amber-400" />
            <span>NEW IN</span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all z-10"
            aria-label="Save to wishlist"
          >
            <Heart size={14} className={isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
          </button>

          {/* Hover Quick View Pill */}
          <div className={`absolute inset-x-2.5 bottom-2.5 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <Link href={`/product/productlistingpage?product_id=${product.id}`}>
              <div className="w-full py-1.5 bg-white/95 backdrop-blur-xs text-gray-900 rounded-xl text-xs font-semibold text-center shadow-md hover:bg-primary-500 hover:text-white transition-colors">
                Quick View
              </div>
            </Link>
          </div>
        </div>

        {/* Fashion Card Info */}
        <div className="p-3 sm:p-3.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary-600 truncate block mb-0.5">
            {product.category || 'Apparel & Fashion'}
          </span>

          <Link href={`/product/productlistingpage?product_id=${product.id}`}>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1 hover:text-primary-600 transition-colors">
              {product.name}
            </h4>
          </Link>

          {/* Price & Discount */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-bold text-gray-900">
              ₹{product.display_price || product.price}
            </span>
            {product.retail_price > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.retail_price}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Unified Global Brand Add to Bag Button */}
      <div className="px-3 pb-3 sm:px-3.5 sm:pb-3.5 pt-1">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-semibold active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <ShoppingCart size={13} />
          <span>{isAddingToCart ? 'Adding...' : 'Add to Bag'}</span>
        </button>
      </div>
    </div>
  );
});

FashionCard.displayName = 'FashionCard';

export default function NewArrivals({ products = [], loading = false, wishlistIds = [] }) {
  const formattedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.slice(0, 12);
  }, [products]);

  if (loading) {
    return (
      <div className="container py-4 sm:py-5">
        <div className="h-80 bg-white rounded-2xl border border-gray-100 animate-pulse" />
      </div>
    );
  }

  if (formattedProducts.length === 0) return null;

  return (
    <section className="py-4 sm:py-5 lg:py-6 bg-gradient-to-b from-primary-50/35 via-white to-primary-50/20 border-b border-primary-100/60">
      <div className="container">
        
        {/* Fashion Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 sm:mb-5 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600">
                Fresh Lookbook
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              New Dresses & Clothing Trends
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Handpicked kurtas, shirts, track pants & seasonal dresses
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/product/productlistingpage?season=new"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 group"
            >
              <span>Explore All Styles</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Fashion Grid with Tall Portrait Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {formattedProducts.slice(0, 6).map((product) => (
            <FashionCard key={product.id} product={product} wishlistIds={wishlistIds} />
          ))}
        </div>

      </div>
    </section>
  );
}