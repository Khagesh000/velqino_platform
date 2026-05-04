"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Loader2, ChevronLeft, ChevronRight } from '../../../../../utils/icons';
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice';
import { useAddToCartMutation } from '@/redux/wholesaler/slices/cartSlice';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/redux/wholesaler/slices/wishlistSlice';
import '../../../../../styles/Products/ProductsListingPage/ProductGrid.scss'
import { BASE_IMAGE_URL } from '@/utils/apiConfig';
import { toast } from 'react-toastify';

const ProductCard = ({ product, onWishlistToggle }) => {
  const [isWishlist, setIsWishlist] = useState(product?.is_wishlisted || false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] = useRemoveFromWishlistMutation();
  
  // ✅ Image scroll refs for each product
  const imageScrollRefs = useRef({});

  const discount = product.compare_price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0;
  const imageUrl = imgError ? '/images/placeholder.jpg' : `${BASE_IMAGE_URL}${product.primary_image || product.image}`;

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

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !isWishlist;
    setIsWishlist(newState);
    
    try {
      if (isWishlist) {
        await removeFromWishlist(product.id).unwrap();
        setIsWishlist(false);
        toast.success('Removed from wishlist');
        if (onWishlistToggle) onWishlistToggle(product.id, false);
      } else {
        await addToWishlist(product.id).unwrap();
        setIsWishlist(true);
        toast.success('Added to wishlist');
        if (onWishlistToggle) onWishlistToggle(product.id, true);
      }
    } catch (error) {
      setIsWishlist(!newState);
      toast.error(error?.data?.message || 'Please login to add to wishlist');
    }
  };

  // ✅ Scroll functions for image slider
  const scrollLeft = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const container = imageScrollRefs.current[productId];
    if (container) {
      container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const container = imageScrollRefs.current[productId];
    if (container) {
      container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/productdetail/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group/img">
          {product.images && product.images.length > 0 ? (
            <>
              {/* Image Slider Container */}
              <div 
                ref={el => {
                  imageScrollRefs.current[product.id] = el;
                }}
                className="flex flex-nowrap overflow-x-auto scroll-smooth h-full snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {product.images.map((img, idx) => (
                  <img 
                    key={idx}
                    src={`${BASE_IMAGE_URL}${img.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover flex-shrink-0 snap-start"
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                  />
                ))}
              </div>
              
             {product.images.length > 1 && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const container = imageScrollRefs.current[product.id];
                  if (container) container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
                }}
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover/img:opacity-100 hover:scale-110 z-30 border border-gray-200"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
              </button>
            )}

            {/* Right Scroll Button */}
            {product.images.length > 1 && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const container = imageScrollRefs.current[product.id];
                  if (container) container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
                }}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover/img:opacity-100 hover:scale-110 z-30 border border-gray-200"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
              </button>
            )}
              
              {/* Image Counter Badge */}
              {product.images.length > 1 && (
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full z-10">
                  {product.images.length}
                </div>
              )}
            </>
          ) : (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md z-10">
              -{discount}%
            </div>
          )}
          
          {/* NEW Badge */}
          {product.is_new && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md z-10">
              NEW
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            disabled={isAddingToWishlist || isRemovingFromWishlist}
            className="absolute bottom-2 right-2 z-20 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 disabled:opacity-50"
          >
            {(isAddingToWishlist || isRemovingFromWishlist) ? (
              <Loader2 size={14} className="animate-spin text-gray-500" />
            ) : (
              <Heart size={16} className={`${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
            )}
          </button>
          
          {/* Quick View Overlay */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 pointer-events-none z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <span className="px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Quick View
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < (product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.reviews || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600">₹{product.price}</span>
            {product.compare_price && (
              <span className="text-xs text-gray-400 line-through">₹{product.compare_price}</span>
            )}
          </div>
        </div>
      </Link>
      <div className="p-3 pt-0">
        <button 
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ShoppingCart size={14} className="group-hover/btn:scale-110 transition-transform" />
          )}
          <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};

export default function ProductGrid() {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const loaderRef = useRef(null);
  const initialLoadDone = useRef(false);
  const [addToCart] = useAddToCartMutation();

  const { data, isLoading, isFetching } = useGetProductsQuery({
    page: page,
    per_page: 12
  });

  const products = data?.data?.products || [];
  const totalPages = data?.data?.pagination?.total_pages || 1;

  // Append new products when data changes
  useEffect(() => {
    if (products.length > 0) {
      setAllProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newProducts = products.filter(p => !existingIds.has(p.id));
        return [...prev, ...newProducts];
      });
      setHasMore(page < totalPages);
    }
  }, [products, page, totalPages]);

  // Initial load
  useEffect(() => {
    if (!initialLoadDone.current && !isLoading && products.length === 0) {
      initialLoadDone.current = true;
    }
  }, [isLoading, products.length]);

  // Handle wishlist toggle from ProductCard
  const handleWishlistToggle = (productId, isWishlisted) => {
    setAllProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, is_wishlisted: isWishlisted } : p
    ));
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isFetching) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, isFetching]);

  // Reset allProducts when component unmounts
  useEffect(() => {
    return () => {
      setAllProducts([]);
      setPage(1);
    };
  }, []);

  // List View with horizontal scroll
  if (viewMode === 'list') {
    return (
      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => {
            const container = document.getElementById('products-scroll-container');
            if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all disabled:opacity-50"
          id="scroll-left-btn"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>

        {/* Horizontal Scroll Container */}
        <div
          id="products-scroll-container"
          className="flex flex-nowrap overflow-x-auto gap-4 pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}
          onScroll={(e) => {
            const scrollLeft = e.target.scrollLeft;
            const maxScroll = e.target.scrollWidth - e.target.clientWidth;
            const leftBtn = document.getElementById('scroll-left-btn');
            const rightBtn = document.getElementById('scroll-right-btn');
            if (leftBtn) leftBtn.style.opacity = scrollLeft > 0 ? '1' : '0.5';
            if (rightBtn) rightBtn.style.opacity = scrollLeft >= maxScroll - 10 ? '0.5' : '1';
          }}
        >
          {allProducts.map((product) => (
            <div
              key={product.id}
              className="w-64 flex-shrink-0 bg-white rounded-xl p-3 border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={`${BASE_IMAGE_URL}${product.primary_image || product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                />
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < (product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">({product.reviews || 0})</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-primary-600">₹{product.price}</span>
                  {product.compare_price && (
                    <span className="text-xs text-gray-400 line-through">₹{product.compare_price}</span>
                  )}
                </div>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await addToCart({ product_id: product.id, quantity: 1 }).unwrap();
                      toast.success(`${product.name} added to cart!`);
                    } catch (error) {
                      toast.error('Failed to add to cart');
                    }
                  }}
                  className="mt-2 w-full px-4 py-1.5 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-all flex items-center justify-center gap-1"
                >
                  <ShoppingCart size={12} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => {
            const container = document.getElementById('products-scroll-container');
            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all"
          id="scroll-right-btn"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>

        {/* Loading and Load More */}
        {(isFetching || isLoading) && (
          <div className="flex justify-center py-4">
            <Loader2 size={24} className="animate-spin text-primary-500" />
          </div>
        )}

        {hasMore && <div ref={loaderRef} className="h-10" />}
      </div>
    );
  }

  // Grid View
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {allProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            onWishlistToggle={handleWishlistToggle}
          />
        ))}
      </div>
      
      {/* Loading Indicator */}
      {(isFetching || isLoading) && allProducts.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={28} className="animate-spin text-primary-500" />
            <span className="text-sm text-gray-500">Loading more products...</span>
          </div>
        </div>
      )}
      
      {/* Initial Loading */}
      {isLoading && allProducts.length === 0 && (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={32} className="animate-spin text-primary-500" />
            <span className="text-sm text-gray-500">Loading products...</span>
          </div>
        </div>
      )}
      
      {/* Intersection Observer Target */}
      {hasMore && <div ref={loaderRef} className="h-10" />}
      
      {/* End of results */}
      {!hasMore && allProducts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400">You've reached the end! 🎉</p>
        </div>
      )}
    </>
  );
}