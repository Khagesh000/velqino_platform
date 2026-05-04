"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Star, Clock, Trash2, ChevronLeft, ChevronRight } from '../../../../utils/icons';

// Mock recently viewed products (will be replaced by localStorage data)
const defaultRecentlyViewed = [
  { id: 1, name: 'Premium Cotton T-Shirt', slug: 'cotton-tshirt', price: 599, originalPrice: 1299, image: '/images/products/tshirt.jpg', rating: 4.8, viewedAt: Date.now() },
  { id: 2, name: 'Wireless Headphones', slug: 'wireless-headphones', price: 2999, originalPrice: 4999, image: '/images/products/headphones.jpg', rating: 4.9, viewedAt: Date.now() - 3600000 },
  { id: 3, name: 'Smart Watch Pro', slug: 'smart-watch', price: 7999, originalPrice: 12999, image: '/images/products/smartwatch.jpg', rating: 4.7, viewedAt: Date.now() - 7200000 },
  { id: 4, name: 'Running Shoes', slug: 'running-shoes', price: 1999, originalPrice: 3999, image: '/images/products/shoes.jpg', rating: 4.6, viewedAt: Date.now() - 10800000 },
  { id: 5, name: 'Leather Wallet', slug: 'leather-wallet', price: 999, originalPrice: 1999, image: '/images/products/wallet.jpg', rating: 4.5, viewedAt: Date.now() - 14400000 },
  { id: 6, name: 'Backpack', slug: 'backpack', price: 1499, originalPrice: 2999, image: '/images/products/backpack.jpg', rating: 4.8, viewedAt: Date.now() - 18000000 },
];

const ProductCard = memo(({ product, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  // Format time ago
  const getTimeAgo = (timestamp) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div
      className="group flex-shrink-0 w-[160px] sm:w-[180px] lg:w-[200px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Viewed Time Badge */}
        <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5">
          <span className="text-[8px] text-white">{getTimeAgo(product.viewedAt)}</span>
        </div>

        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(product.id);
          }}
          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-red-50 transition-all"
        >
          <Trash2 size={10} className="text-gray-400 hover:text-red-500" />
        </button>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlist(!isWishlist);
          }}
          className="absolute top-1 left-1 p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <Heart size={10} className={`${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1 mb-0.5">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-0.5 mb-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-[8px] text-gray-400">{product.rating}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs sm:text-sm font-bold text-primary-600">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-[8px] text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="w-full py-1 bg-primary-500 text-white rounded text-[10px] sm:text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-1">
          <ShoppingCart size={10} />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const autoScrollRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentProducts(parsed.slice(0, 10));
      } catch (e) {
        setRecentProducts(defaultRecentlyViewed);
      }
    } else {
      setRecentProducts(defaultRecentlyViewed);
    }
  }, []);

  // Save to localStorage when products change
  useEffect(() => {
    if (recentProducts.length > 0) {
      localStorage.setItem('recentlyViewed', JSON.stringify(recentProducts));
    }
  }, [recentProducts]);

  // Auto-scroll
  useEffect(() => {
    if (isInView && recentProducts.length > 4 && !isHovered) {
      autoScrollRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
          }
        }
      }, 3000);
    }
    return () => clearInterval(autoScrollRef.current);
  }, [isInView, recentProducts.length, isHovered]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleRemoveProduct = (productId) => {
    setRecentProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleClearAll = () => {
    if (confirm('Clear all recently viewed products?')) {
      setRecentProducts([]);
      localStorage.removeItem('recentlyViewed');
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="recently-viewed-section py-8 sm:py-12 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-primary-500" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Recently Viewed
            </h2>
            <span className="text-xs text-gray-400">({recentProducts.length})</span>
          </div>
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-red-500 transition-all flex items-center gap-1"
          >
            <Trash2 size={12} />
            <span>Clear History</span>
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Arrow */}
          {recentProducts.length > 4 && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Scrollable Products */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 hide-scrollbar scroll-smooth"
          >
            {recentProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onRemove={handleRemoveProduct}
              />
            ))}
          </div>

          {/* Right Arrow */}
          {recentProducts.length > 4 && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}