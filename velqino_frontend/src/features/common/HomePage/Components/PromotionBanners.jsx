"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Zap, Gift, TrendingUp, Sparkles } from '../../../../utils/icons';

const promotions = [
  {
    id: 1,
    title: 'Summer Sale',
    subtitle: 'Up to 50% Off',
    description: 'On selected items. Limited time offer!',
    ctaText: 'Shop Now',
    ctaLink: '/summer-sale',
    gradient: 'from-orange-500 to-red-500',
    icon: <Zap size={24} />,
    layout: 'full',
    image: '/images/promotions/summer-sale.jpg'
  },
  {
    id: 2,
    title: 'New Collection',
    subtitle: 'Fresh Arrivals',
    description: 'Discover the latest trends',
    ctaText: 'Explore Now',
    ctaLink: '/new-arrivals',
    gradient: 'from-green-500 to-teal-500',
    icon: <Sparkles size={24} />,
    layout: 'half',
    image: '/images/promotions/new-collection.jpg'
  },
  {
    id: 3,
    title: 'Festive Special',
    subtitle: 'Extra 20% Off',
    description: 'Use code: FESTIVE20',
    ctaText: 'Shop Festive Deals',
    ctaLink: '/festive-sale',
    gradient: 'from-purple-500 to-pink-500',
    icon: <Gift size={24} />,
    layout: 'half',
    image: '/images/promotions/festive.jpg'
  }
];

const PromotionCard = ({ promotion, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isFullWidth = promotion.layout === 'full';

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
        isFullWidth ? 'col-span-2' : ''
      } ${isHovered ? 'shadow-xl' : 'shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={promotion.image}
          alt={promotion.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setIsLoaded(true)}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${promotion.gradient} opacity-80`} />

      {/* Content */}
      <div className={`relative p-6 sm:p-8 lg:p-10 flex items-center justify-between min-h-[200px] sm:min-h-[240px] ${
        isFullWidth ? 'flex-row' : 'flex-col text-center'
      }`}>
        <div className={`${isFullWidth ? 'text-left flex-1' : 'text-center'}`}>
          {/* Icon */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <span className="text-white">{promotion.icon}</span>
          </div>
          
          {/* Badge */}
          <div className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-[10px] sm:text-xs font-medium mb-2">
            Limited Time
          </div>
          
          {/* Title */}
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
            {promotion.title}
          </h3>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-white/90 mb-2">
            {promotion.subtitle}
          </p>
          
          {/* Description */}
          <p className="text-sm text-white/80 mb-4 max-w-md">
            {promotion.description}
          </p>
          
          {/* CTA Button */}
          <Link
            href={promotion.ctaLink}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-primary-500 hover:text-primary-50 transition-all duration-300 group"
          >
            <span>{promotion.ctaText}</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Floating Offer Badge (only for full width) */}
        {isFullWidth && (
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-center border border-white/20">
              <p className="text-3xl font-bold text-white">50%</p>
              <p className="text-xs text-white/80">OFF</p>
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-primary-500 transition-all duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
};

export default function PromotionBanners() {
  const [isInView, setIsInView] = useState(false);
  const [visiblePromotions, setVisiblePromotions] = useState([]);
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
      setVisiblePromotions(promotions.slice(0, 2));
      const timer = setTimeout(() => {
        setVisiblePromotions(promotions);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Separate full width and half width promotions
  const fullWidthPromo = visiblePromotions.find(p => p.layout === 'full');
  const halfWidthPromos = visiblePromotions.filter(p => p.layout === 'half');

  return (
    <section ref={sectionRef} className="promotion-banners-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Exclusive <span className="text-primary-500">Offers</span>
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Don't miss out on our best deals and promotions
          </p>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Full Width Banner */}
        {fullWidthPromo && (
          <div className="mb-6">
            <PromotionCard promotion={fullWidthPromo} index={0} />
          </div>
        )}

        {/* Half Width Banners Grid */}
        {halfWidthPromos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {halfWidthPromos.map((promo, index) => (
              <PromotionCard key={promo.id} promotion={promo} index={index + 1} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}