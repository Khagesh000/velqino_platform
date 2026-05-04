"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Star, Sparkles, ChevronRight } from '../../../../utils/icons';

const newArrivalsData = [
  { id: 1, name: 'Summer Collection Shirt', slug: 'summer-shirt', price: 799, originalPrice: 1599, image: '/images/products/summer-shirt.jpg', rating: 4.9, reviews: 45, isNew: true, daysOld: 2 },
  { id: 2, name: 'Wireless Earbuds Pro', slug: 'earbuds-pro', price: 2499, originalPrice: 4999, image: '/images/products/earbuds.jpg', rating: 4.8, reviews: 38, isNew: true, daysOld: 3 },
  { id: 3, name: 'Minimalist Backpack', slug: 'minimalist-backpack', price: 1299, originalPrice: 2499, image: '/images/products/backpack.jpg', rating: 4.7, reviews: 52, isNew: true, daysOld: 1 },
  { id: 4, name: 'Smart Fitness Band', slug: 'fitness-band', price: 1999, originalPrice: 3999, image: '/images/products/fitness-band.jpg', rating: 4.8, reviews: 67, isNew: true, daysOld: 4 },
  { id: 5, name: 'Premium Hoodie', slug: 'premium-hoodie', price: 1499, originalPrice: 2999, image: '/images/products/hoodie.jpg', rating: 4.9, reviews: 89, isNew: true, daysOld: 5 },
  { id: 6, name: 'Ceramic Coffee Mug', slug: 'coffee-mug', price: 399, originalPrice: 799, image: '/images/products/mug.jpg', rating: 4.6, reviews: 34, isNew: true, daysOld: 2 },
];

const ProductCard = memo(({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
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
        
        {/* New Badge */}
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <Sparkles size={10} />
            <span>NEW</span>
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlist(!isWishlist)}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
        >
          <Heart size={16} className={`${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        
        {/* Quick View Overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button className="bg-white text-primary-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-500 hover:text-primary-50 transition-all transform -translate-y-2 group-hover:translate-y-0">
            Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary-600">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="w-full py-1.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
          <ShoppingCart size={14} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default function NewArrivals() {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for lazy loading
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

  // Progressive loading
  useEffect(() => {
    if (isInView) {
      setVisibleProducts(newArrivalsData.slice(0, 3));
      const timer = setTimeout(() => {
        setVisibleProducts(newArrivalsData);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section ref={sectionRef} className="new-arrivals-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={24} className="text-primary-500" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            New <span className="text-primary-500">Arrivals</span>
          </h2>
        </div>
        <p className="text-sm text-gray-500">Fresh from the collection. Be the first to shop!</p>
        <div className="w-20 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
      </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {visibleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Shop New Arrivals Button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/new-arrivals"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-primary-50 transition-all duration-300 group"
          >
            <span>Shop New Arrivals</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}