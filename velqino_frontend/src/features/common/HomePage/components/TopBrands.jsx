"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, Shield, Users, Package, Star } from '../../../../utils/icons';

const brands = [
  { id: 1, name: 'Nike', logo: '/images/brands/nike.svg', slug: 'nike', productCount: 245 },
  { id: 2, name: 'Apple', logo: '/images/brands/apple.svg', slug: 'apple', productCount: 189 },
  { id: 3, name: 'Samsung', logo: '/images/brands/samsung.svg', slug: 'samsung', productCount: 312 },
  { id: 4, name: 'Adidas', logo: '/images/brands/adidas.svg', slug: 'adidas', productCount: 178 },
  { id: 5, name: 'Sony', logo: '/images/brands/sony.svg', slug: 'sony', productCount: 156 },
  { id: 6, name: 'LG', logo: '/images/brands/lg.svg', slug: 'lg', productCount: 134 },
  { id: 7, name: 'Puma', logo: '/images/brands/puma.svg', slug: 'puma', productCount: 98 },
  { id: 8, name: 'Boat', logo: '/images/brands/boat.svg', slug: 'boat', productCount: 87 },
];

const trustIndicators = [
  { id: 1, icon: <Users size={24} />, value: '10,000+', label: 'Happy Customers', color: 'text-primary-500' },
  { id: 2, icon: <Package size={24} />, value: '50,000+', label: 'Products Sold', color: 'text-primary-500' },
  { id: 3, icon: <Shield size={24} />, value: '100%', label: 'Secure Payments', color: 'text-primary-500' },
  { id: 4, icon: <Star size={24} />, value: '4.8', label: 'Average Rating', color: 'text-yellow-500' },
];

export default function TopBrands() {
  const [isInView, setIsInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);

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

  // Double the brands for seamless marquee
  const marqueeBrands = [...brands, ...brands];

  return (
    <section ref={sectionRef} className="top-brands-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Top <span className="text-primary-500">Brands</span> & Partners
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Trusted by leading brands worldwide. Shop from the best.
          </p>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {trustIndicators.map((indicator) => (
            <div
              key={indicator.id}
              className="text-center p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`flex justify-center mb-2 ${indicator.color}`}>
                {indicator.icon}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{indicator.value}</p>
              <p className="text-xs sm:text-sm text-gray-500">{indicator.label}</p>
            </div>
          ))}
        </div>

        {/* Brands Marquee */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={marqueeRef}
            className={`flex gap-6 sm:gap-8 lg:gap-10 py-4 ${isInView ? 'animate-marquee' : ''}`}
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {marqueeBrands.map((brand, index) => (
              <Link
                key={`${brand.id}-${index}`}
                href={`/brand/${brand.slug}`}
                className="flex-shrink-0 w-28 sm:w-32 lg:w-36 p-3 sm:p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg hover:border-primary-200 transition-all duration-300 group"
              >
                <div className="aspect-[3/2] bg-gray-100 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-sm">
                    {brand.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 text-center group-hover:text-primary-600 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-[10px] text-gray-400 text-center">{brand.productCount} products</p>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Brands Button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-primary-50 transition-all duration-300 group"
          >
            <span>View All Brands</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Marquee Animation CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          width: fit-content;
        }
      `}</style>
    </section>
  );
}