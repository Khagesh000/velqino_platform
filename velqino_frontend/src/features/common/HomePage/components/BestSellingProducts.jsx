"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Star, ChevronRight, TrendingUp } from '../../../../utils/icons';

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
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={product.image || product.primary_image || product.images?.[0]?.image || '/images/products/placeholder.jpg'}
          alt={product.name}
          loading={index < 4 ? "eager" : "lazy"}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setIsLoaded(true)}
        />
        
        <button
          onClick={() => setIsWishlist(!isWishlist)}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
        >
          <Heart size={16} className={`${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Link href={`/product/productlistingpage?product_id=${product.id}`}>
            <button className="bg-white text-primary-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-950 hover:text-primary-500 transition-all">
              Quick View
            </button>
          </Link>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.total_sold || 0} sold)</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary-600">₹{product.display_price || product.price}</span>
          {product.retail_price > product.price && (
            <span className="text-xs text-gray-400 line-through">₹{product.retail_price}</span>
          )}
        </div>

        <button className="w-full py-1.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
          <ShoppingCart size={14} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default function BestSellingProducts({ products = [], loading = false }) {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

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

  useEffect(() => {
    if (isInView && products.length > 0 && visibleProducts.length === 0) {
      setVisibleProducts(products.slice(0, 6));
      const timer = setTimeout(() => {
        setVisibleProducts(products);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isInView, products, visibleProducts.length]);

  if (loading) {
    return (
      <section className="best-selling-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="best-selling-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp size={24} className="text-primary-500" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Best <span className="text-primary-500">Selling</span> Products
              </h2>
            </div>
            <p className="text-sm text-gray-500">Most popular products based on sales</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {visibleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/product/productlistingpage?sort=-total_sold"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-950 hover:text-primary-500 transition-all duration-300 group"
          >
            <span>View All Best Sellers</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}