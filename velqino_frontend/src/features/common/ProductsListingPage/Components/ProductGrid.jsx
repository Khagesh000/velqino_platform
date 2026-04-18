"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Loader2 } from '../../../../utils/icons';

// Mock products data generator
const generateProducts = (page) => {
  const baseProducts = [
    { id: 1, name: 'Premium Cotton T-Shirt', price: 599, originalPrice: 1299, rating: 4.8, reviews: 234, image: '/images/products/tshirt.jpg', isNew: true, discount: 54 },
    { id: 2, name: 'Wireless Headphones', price: 2999, originalPrice: 4999, rating: 4.9, reviews: 189, image: '/images/products/headphones.jpg', isNew: false, discount: 40 },
    { id: 3, name: 'Smart Watch Pro', price: 7999, originalPrice: 12999, rating: 4.7, reviews: 156, image: '/images/products/smartwatch.jpg', isNew: true, discount: 38 },
    { id: 4, name: 'Running Shoes', price: 1999, originalPrice: 3999, rating: 4.6, reviews: 98, image: '/images/products/shoes.jpg', isNew: false, discount: 50 },
    { id: 5, name: 'Leather Wallet', price: 999, originalPrice: 1999, rating: 4.5, reviews: 67, image: '/images/products/wallet.jpg', isNew: false, discount: 50 },
    { id: 6, name: 'Backpack', price: 1499, originalPrice: 2999, rating: 4.8, reviews: 112, image: '/images/products/backpack.jpg', isNew: true, discount: 50 },
    { id: 7, name: 'Sunglasses', price: 799, originalPrice: 1599, rating: 4.4, reviews: 45, image: '/images/products/sunglasses.jpg', isNew: false, discount: 50 },
    { id: 8, name: 'Smartphone', price: 19999, originalPrice: 29999, rating: 4.9, reviews: 234, image: '/images/products/smartphone.jpg', isNew: true, discount: 33 },
  ];
  
  // Return different products per page (simulate pagination)
  return baseProducts.map(p => ({ ...p, id: (page - 1) * 8 + p.id }));
};

const ProductCard = ({ product }) => {
  const [isWishlist, setIsWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
              -{product.discount}%
            </div>
          )}
          {product.isNew && (
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
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
        </div>
      </Link>
      <div className="p-3 pt-0">
        <button className="w-full py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2 group/btn">
          <ShoppingCart size={14} className="group-hover/btn:scale-110 transition-transform" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const loaderRef = useRef(null);
  const initialLoadDone = useRef(false);

  // Load products
  const loadProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProducts = generateProducts(page);
    
    if (page >= 3) {
      setHasMore(false);
    }
    
    setProducts(prev => [...prev, ...newProducts]);
    setPage(prev => prev + 1);
    setLoading(false);
  }, [page, loading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!initialLoadDone.current) {
      loadProducts();
      initialLoadDone.current = true;
    }
  }, [loadProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadProducts();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadProducts]);

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="flex gap-4 bg-white rounded-xl p-3 border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">{product.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-400">({product.reviews})</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-primary-600">₹{product.price}</span>
                <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
              </div>
              <button className="mt-2 px-4 py-1.5 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-all flex items-center gap-1">
                <ShoppingCart size={12} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
        
        {/* Loading indicator for list view */}
        {loading && (
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
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={28} className="animate-spin text-primary-500" />
            <span className="text-sm text-gray-500">Loading more products...</span>
          </div>
        </div>
      )}
      
      {/* Intersection Observer Target */}
      {hasMore && !loading && <div ref={loaderRef} className="h-10" />}
      
      {/* End of results */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400">You've reached the end! 🎉</p>
        </div>
      )}
    </>
  );
}