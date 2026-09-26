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
  { id: 4, icon: <Star size={24} />, value: '4.8', label: 'Average Rating', color: 'text-accent-500' },
];

const BrandLogo = ({ name }) => {
  switch (name) {
    case 'Nike':
      return (
        <svg viewBox="0 0 100 36" className="w-12 h-6 fill-current text-gray-800 group-hover:text-primary-600 transition-colors">
          <path d="M98.5 0.5C92.3 6.9 76.8 17.5 59.8 22.8C45.3 27.3 32.5 28.5 22.1 26.3C13.2 24.4 7.6 19.9 5.3 12.8C4.5 10.3 4.7 7.7 5.9 5.2C4.1 6.8 2.7 8.9 1.9 11.2C-0.9 19.3 4.2 27.5 14.7 32.1C24.3 36.3 37.9 36.5 52.8 32.7C73.4 27.4 92.5 13.9 99.8 0.6L98.5 0.5Z" />
        </svg>
      );
    case 'Apple':
      return (
        <svg viewBox="0 0 170 170" className="w-7 h-7 fill-current text-gray-800 group-hover:text-primary-600 transition-colors">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.71-11.66-14.01-6.19-9.56-11.04-20.66-14.54-33.31-3.5-12.65-5.25-24.36-5.25-35.13 0-14.36 3.49-26.3 10.46-35.82 6.98-9.51 15.82-14.38 26.54-14.6 4.8 0 10.22 1.34 16.27 4.02 6.05 2.68 9.94 4.08 11.66 4.2 1.93-.24 5.94-1.68 12.04-4.32 6.1-2.64 11.45-3.85 16.05-3.63 11.75.64 21.05 4.69 27.91 12.15-10.46 6.35-15.58 15.34-15.37 26.98.21 9.4 3.73 17.29 10.56 23.68 6.83 6.39 15.02 10.01 24.58 10.85-2.24 6.74-4.8 13.06-7.68 18.96zM119.22 33.01c0-7.39 2.65-14.44 7.96-21.14 5.3-6.7 11.89-10.99 19.75-12.87.21 1.28.32 2.45.32 3.52 0 7.39-2.77 14.5-8.31 21.34-5.54 6.83-12.21 11.03-20.02 12.59-.21-1.18-.32-2.33-.32-3.44z" />
        </svg>
      );
    case 'Adidas':
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current text-gray-800 group-hover:text-primary-600 transition-colors">
          <path d="M22.7 18.5L16.2 7.2l-3.3 1.9 5.4 9.4h4.4zm-6.2 0l-4.5-7.8-3.3 1.9 3.4 5.9h4.4zm-6.3 0L7.7 14l-3.3 1.9 1.5 2.6h4.3z" />
        </svg>
      );
    case 'Samsung':
      return (
        <span className="font-extrabold tracking-wider text-xs uppercase text-gray-800 group-hover:text-primary-600 transition-colors">
          SAMSUNG
        </span>
      );
    case 'Sony':
      return (
        <span className="font-serif font-black tracking-widest text-sm uppercase text-gray-800 group-hover:text-primary-600 transition-colors">
          SONY
        </span>
      );
    case 'LG':
      return (
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-gray-800 group-hover:text-primary-600 transition-colors">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="8" cy="9" r="1.5" fill="currentColor" />
          <path d="M8 12v3h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'Puma':
      return (
        <span className="font-black italic tracking-widest text-xs uppercase text-gray-800 group-hover:text-primary-600 transition-colors">
          PUMA
        </span>
      );
    case 'Boat':
      return (
        <div className="flex items-center gap-0.5 text-gray-800 group-hover:text-primary-600 transition-colors">
          <span className="font-bold text-xs tracking-tight">bo<span className="text-primary-500 font-extrabold">A</span>t</span>
        </div>
      );
    default:
      return <span className="font-bold text-sm text-gray-700">{name}</span>;
  }
};

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
    <section ref={sectionRef} className="top-brands-section py-5 sm:py-6 lg:py-8 bg-primary-50/50 border-y border-primary-200/70">
      <div className="container">
        
        {/* Section Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
            Top <span className="text-primary-600">Brands</span> & Partners
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto">
            Trusted by verified wholesalers & leading apparel manufacturers
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {trustIndicators.map((indicator) => (
            <div
              key={indicator.id}
              className="text-center p-3.5 bg-white border border-primary-200/80 rounded-2xl shadow-2xs hover:shadow-md hover:border-primary-400 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className={`flex justify-center mb-1.5 ${indicator.color}`}>
                {indicator.icon}
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{indicator.value}</p>
              <p className="text-xs text-gray-500">{indicator.label}</p>
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
            className={`flex gap-4 sm:gap-6 lg:gap-8 py-2 ${isInView ? 'animate-marquee' : ''}`}
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {marqueeBrands.map((brand, index) => (
              <Link
                key={`${brand.id}-${index}`}
                href={`/brand/${brand.slug}`}
                className="flex-shrink-0 w-28 sm:w-32 lg:w-36 p-3 bg-white border border-primary-200/80 rounded-2xl shadow-2xs hover:shadow-md hover:border-primary-400 transition-all duration-300 group flex flex-col items-center justify-between"
              >
                <div className="w-full aspect-[3/2] bg-primary-50/40 rounded-xl flex items-center justify-center mb-2 overflow-hidden border border-primary-100/80 group-hover:bg-primary-50 group-hover:border-primary-300 transition-all">
                  <BrandLogo name={brand.name} />
                </div>
                <h3 className="text-xs font-semibold text-gray-800 text-center group-hover:text-primary-600 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-[10px] text-gray-400 text-center">{brand.productCount} products</p>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Brands Button */}
        <div className="text-center mt-6 sm:mt-8">
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-primary-500 text-primary-600 font-bold rounded-xl hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-2xs hover:shadow-xs group"
          >
            <span>View All Brands</span>
            <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
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
