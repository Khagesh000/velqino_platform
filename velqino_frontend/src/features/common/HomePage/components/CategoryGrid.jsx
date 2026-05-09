"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, TrendingUp, Package, Star } from '../../../../utils/icons';
import '../../../../styles/common/HomePage/CategoryGrid.scss'


const CategoryCard = React.memo(({ category, index }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/category/${category.slug}`}
      className="category-card group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-500 ${
        isHovered ? 'shadow-xl -translate-y-1' : ''
      }`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-700 ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
            onLoad={() => setIsLoaded(true)}
            width={400}
            height={400}
          />
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-80'
          }`} />
          
          {/* Category Icon */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg sm:text-xl">
            {category.icon}
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-0.5 sm:mb-1 truncate">
            {category.name}
          </h3>
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-white/80">
            <Package size={12} className="sm:w-3 sm:h-3" />
            <span>{category.productCount.toLocaleString()} products</span>
          </div>
        </div>

        {/* Hover Arrow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
          <ChevronRight size={20} className="text-white" />
        </div>
      </div>
    </Link>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default function CategoryGrid({ categories = [], productsData = {}, loading = false }) {
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = React.useRef(null);

  // Helper function to get icon based on category name
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'shirt': '👕', 'pant': '👖', 'tshirt': '👕', 'track pants': '🏃',
      'sarees': '🥻', 'dresses': '👗', 'jackets': '🧥', 'shorts': '🩳',
      'electronics': '📱', 'mobiles': '📱', 'laptops': '💻',
      'home': '🏠', 'furniture': '🛋️', 'beauty': '💄',
      'sports': '⚽', 'fitness': '💪', 'toys': '🎮',
      'books': '📚', 'food': '🍕', 'default': '📁'
    };
    const lowerName = categoryName?.toLowerCase() || '';
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) return icon;
    }
    return iconMap.default;
  };

  const formattedCategories = React.useMemo(() => {
  if (!categories || categories.length === 0) return [];
  const categoryList = categories.data || categories.results || categories;
  if (!Array.isArray(categoryList)) return [];
  
  // Get products from correct path - now productsData has { products, pagination }
  const products = productsData?.products || [];
  
  return categoryList.slice(0, 12).map((category) => {
    // Find a product that belongs to THIS specific category
    const categoryProduct = products.find(p => p.category_id === category.id || p.category_name === category.name);
    
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: categoryProduct?.primary_image || 
             categoryProduct?.images?.[0]?.image ||
             '/images/categories/placeholder.jpg',
      productCount: products.filter(p => p.category_id === category.id).length,
      icon: getCategoryIcon(category.name),
      color: 'from-blue-500 to-cyan-500'
    };
  });
}, [categories, productsData]);
  console.log('Image object:', productsData?.products?.[0]?.images?.[0]);
  console.log('productsData received:', productsData);
console.log('Products array:', productsData?.products);

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

    // Progressive loading of categories - Load immediately without waiting for isInView
    useEffect(() => {
  if (formattedCategories.length > 0 && visibleCategories.length === 0) {
    // Load first 4
    setVisibleCategories(formattedCategories.slice(0, 4));
    
    // Load remaining after delay
    const timer = setTimeout(() => {
      setVisibleCategories(formattedCategories);
    }, 500); // Increased from 100ms to 500ms
    
    return () => clearTimeout(timer);
  }
}, [formattedCategories]);

  // Loading state
  if (loading) {
    return (
      <div className="category-grid container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (formattedCategories.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="category-grid-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section Header */}
    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
        Shop by <span className="text-primary-500">Category</span>
      </h2>
      <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
        Explore our wide range of products across different categories
      </p>
      <div className="w-20 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
    </div>

    {/* Categories Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
      {visibleCategories.map((category, index) => (
        <div
          key={category.id}
          className="category-grid-item"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CategoryCard category={category} index={index} />
        </div>
      ))}
    </div>

    {/* View All Categories Button */}
    <div className="text-center mt-8 sm:mt-12">
  <Link
    href="/product/productlistingpage"
    className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-950 hover:text-primary-500 transition-all duration-300 group"
  >
    <span>View All Categories</span>
    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
  </Link>
</div>
  </div>
</section>
  );
}
