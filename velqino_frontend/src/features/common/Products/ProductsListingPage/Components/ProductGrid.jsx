"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Loader2 } from '../../../../../utils/icons';
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice';
import { useAddToCartMutation } from '@/redux/wholesaler/slices/cartSlice';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const [isWishlist, setIsWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const discount = product.compare_price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0;
  const imageUrl = imgError ? '/images/placeholder.jpg' : `${BASE_IMAGE_URL}${product.primary_image || product.image}`;

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    
    try {
      await addToCart({
        product_id: product.id,
        quantity: 1,
        selected_size: '',
        selected_color: ''
      }).unwrap();
      
      toast.success(`${product.name} added to cart!`, {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add to cart', {
        duration: 2000,
        position: 'bottom-right'
      });
    }
  };

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/productlistingpage/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
              -{discount}%
            </div>
          )}
          {product.is_new && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
              NEW
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setIsWishlist(!isWishlist); }}
            className="absolute bottom-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110"
          >
            <Heart size={16} className={`${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          </button>
          
          {/* Quick View Overlay */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
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
      // Get existing IDs to avoid duplicates
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

  // In your ProductGrid component, add these console logs:

useEffect(() => {
  console.log('🟢 Setting up observer. hasMore:', hasMore, 'isLoading:', isLoading);
  
  const observer = new IntersectionObserver(
    (entries) => {
      console.log('🔵 Observer triggered. entries:', entries[0].isIntersecting);
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        console.log('🟡 Loading next page...');
        setPage(prev => prev + 1);
      }
    },
    { threshold: 0.1, rootMargin: '100px' }
  );

  if (loaderRef.current) {
    console.log('🟢 Observer attached to loader element');
    observer.observe(loaderRef.current);
  } else {
    console.log('🔴 loaderRef.current is NULL');
  }

  return () => observer.disconnect();
}, [hasMore, isLoading]);

// Reset allProducts when component unmounts or page changes to 1
useEffect(() => {
  return () => {
    setAllProducts([]);
    setPage(1);
  };
}, []);


console.log('hasMore:', hasMore, 'totalPages:', totalPages, 'currentPage:', page);
console.log('Total products:', data?.data?.pagination?.total);
console.log('Total pages:', totalPages);
console.log('Current page:', page);

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {allProducts.map((product) => (
          <div key={product.id} className="flex gap-4 bg-white rounded-xl p-3 border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={`${BASE_IMAGE_URL}${product.primary_image || product.image}`}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">{product.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-400">(0 reviews)</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-primary-600">₹{product.price}</span>
                {product.compare_price && (
                  <span className="text-xs text-gray-400 line-through">₹{product.compare_price}</span>
                )}
              </div>
              <button className="mt-2 px-4 py-1.5 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-all flex items-center gap-1">
                <ShoppingCart size={12} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
        
        {/* Loading indicator for list view */}
        {(isFetching || isLoading) && (
          <div className="flex justify-center py-4">
            <Loader2 size={24} className="animate-spin text-primary-500" />
          </div>
        )}
        
        {hasMore && <div ref={loaderRef} className="h-10" />}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {allProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              compare_price: product.compare_price,
              primary_image: product.primary_image,
              image: product.image,
              rating: product.rating || 4,
              reviews: product.reviews || 0,
              is_new: product.is_new || false
            }} 
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