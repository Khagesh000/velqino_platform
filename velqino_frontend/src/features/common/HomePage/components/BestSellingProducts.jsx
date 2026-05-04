"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Star, ChevronRight, TrendingUp } from '../../../../utils/icons';

const productsData = {
  today: [
    { id: 1, name: 'Premium Cotton T-Shirt', slug: 'cotton-tshirt', price: 599, originalPrice: 1299, image: '/images/products/tshirt.jpg', rating: 4.8, reviews: 234, sold: 45, stock: 120 },
    { id: 2, name: 'Wireless Headphones', slug: 'wireless-headphones', price: 2999, originalPrice: 4999, image: '/images/products/headphones.jpg', rating: 4.9, reviews: 189, sold: 38, stock: 80 },
    { id: 3, name: 'Smart Watch Pro', slug: 'smart-watch', price: 7999, originalPrice: 12999, image: '/images/products/smartwatch.jpg', rating: 4.7, reviews: 156, sold: 28, stock: 50 },
    { id: 4, name: 'Running Shoes', slug: 'running-shoes', price: 1999, originalPrice: 3999, image: '/images/products/shoes.jpg', rating: 4.6, reviews: 98, sold: 22, stock: 60 },
    { id: 5, name: 'Leather Wallet', slug: 'leather-wallet', price: 999, originalPrice: 1999, image: '/images/products/wallet.jpg', rating: 4.5, reviews: 67, sold: 18, stock: 45 },
    { id: 6, name: 'Backpack', slug: 'backpack', price: 1499, originalPrice: 2999, image: '/images/products/backpack.jpg', rating: 4.8, reviews: 112, sold: 32, stock: 75 },
  ],
  week: [
    { id: 1, name: 'Premium Cotton T-Shirt', slug: 'cotton-tshirt', price: 599, originalPrice: 1299, image: '/images/products/tshirt.jpg', rating: 4.8, reviews: 567, sold: 245 },
    { id: 2, name: 'Wireless Headphones', slug: 'wireless-headphones', price: 2999, originalPrice: 4999, image: '/images/products/headphones.jpg', rating: 4.9, reviews: 432, sold: 189 },
    { id: 3, name: 'Smart Watch Pro', slug: 'smart-watch', price: 7999, originalPrice: 12999, image: '/images/products/smartwatch.jpg', rating: 4.7, reviews: 345, sold: 156 },
    { id: 4, name: 'Running Shoes', slug: 'running-shoes', price: 1999, originalPrice: 3999, image: '/images/products/shoes.jpg', rating: 4.6, reviews: 278, sold: 134 },
    { id: 5, name: 'Leather Wallet', slug: 'leather-wallet', price: 999, originalPrice: 1999, image: '/images/products/wallet.jpg', rating: 4.5, reviews: 189, sold: 98 },
    { id: 6, name: 'Backpack', slug: 'backpack', price: 1499, originalPrice: 2999, image: '/images/products/backpack.jpg', rating: 4.8, reviews: 234, sold: 167 },
  ],
  month: [
    { id: 1, name: 'Premium Cotton T-Shirt', slug: 'cotton-tshirt', price: 599, originalPrice: 1299, image: '/images/products/tshirt.jpg', rating: 4.8, reviews: 1234, sold: 890 },
    { id: 2, name: 'Wireless Headphones', slug: 'wireless-headphones', price: 2999, originalPrice: 4999, image: '/images/products/headphones.jpg', rating: 4.9, reviews: 987, sold: 756 },
    { id: 3, name: 'Smart Watch Pro', slug: 'smart-watch', price: 7999, originalPrice: 12999, image: '/images/products/smartwatch.jpg', rating: 4.7, reviews: 876, sold: 634 },
    { id: 4, name: 'Running Shoes', slug: 'running-shoes', price: 1999, originalPrice: 3999, image: '/images/products/shoes.jpg', rating: 4.6, reviews: 654, sold: 432 },
  ],
  alltime: [
    { id: 1, name: 'Premium Cotton T-Shirt', slug: 'cotton-tshirt', price: 599, originalPrice: 1299, image: '/images/products/tshirt.jpg', rating: 4.8, reviews: 3456, sold: 2345 },
    { id: 2, name: 'Wireless Headphones', slug: 'wireless-headphones', price: 2999, originalPrice: 4999, image: '/images/products/headphones.jpg', rating: 4.9, reviews: 2876, sold: 1987 },
    { id: 3, name: 'Smart Watch Pro', slug: 'smart-watch', price: 7999, originalPrice: 12999, image: '/images/products/smartwatch.jpg', rating: 4.7, reviews: 2345, sold: 1678 },
  ],
};

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
          <button className="bg-white text-primary-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-500 hover:text-white transition-all transform -translate-y-2 group-hover:translate-y-0">
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

export default function BestSellingProducts() {
  const [activeSort, setActiveSort] = useState('today');
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const currentProducts = productsData[activeSort];

  const sortOptions = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'alltime', label: 'All Time' },
  ];

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
      setVisibleProducts(currentProducts.slice(0, 3));
      const timer = setTimeout(() => {
        setVisibleProducts(currentProducts);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentProducts, isInView]);

  return (
    <section ref={sectionRef} className="best-selling-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={24} className="text-primary-500" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Best <span className="text-primary-500">Selling</span> Products
              </h2>
            </div>
            <p className="text-sm text-gray-500">Most popular products based on sales</p>
          </div>
          
          {/* Sort Options */}
          <div className="flex gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveSort(option.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeSort === option.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {visibleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 sm:mt-12">
  <Link
    href="/best-sellers"
    className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-primary-50 transition-all duration-300 group"
  >
    <span>View All Best Sellers</span>
    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
  </Link>
</div>
      </div>
    </section>
  );
}