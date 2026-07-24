"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Zap, Gift, Sparkles } from '../../../../utils/icons';

const promotions = [
  {
    id: 1,
    title: 'Summer Sale',
    subtitle: 'Up to 50% Off',
    description: 'On selected items. Limited time offer!',
    ctaText: 'Shop Now',
    ctaLink: '/summer-sale',
    bgClass: 'bg-primary-600',
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
    bgClass: 'bg-secondary-600',
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
    bgClass: 'bg-accent-600',
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
      className={`group relative overflow-hidden rounded-2xl border-light transition-all duration-500 ease-out ${
        isFullWidth ? 'col-span-2' : ''
      } ${isHovered ? 'shadow-2xl -translate-y-1' : 'shadow-md'}`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {!isLoaded && <div className="absolute inset-0 bg-surface-2 animate-pulse" />}
        <Image
          src={promotion.image}
          alt={promotion.title}
          fill
          sizes={isFullWidth ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
          className={`object-cover transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoadingComplete={() => setIsLoaded(true)}
        />
        <div className="absolute inset-0 bg-overlay-dark" />
      </div>

      {/* Color Overlay — replaces the Tailwind gradient */}
      <div className={`absolute inset-0 ${promotion.bgClass} transition-opacity duration-500`} style={{ opacity: isHovered ? 0.85 : 0.75 }} />

      {/* Shine sweep on hover */}
      <div className={`absolute inset-0 bg-overlay-light -translate-x-full transition-transform duration-1000 ease-out ${isHovered ? 'translate-x-full' : ''}`} />

      {/* Content */}
      <div className={`relative p-6 sm:p-8 lg:p-10 flex items-center justify-between min-h-[200px] sm:min-h-[240px] ${
        isFullWidth ? 'flex-row' : 'flex-col text-center'
      }`}>
        <div className={`${isFullWidth ? 'text-left flex-1' : 'text-center'}`}>
          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-overlay-light rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-500 ${isHovered ? 'scale-110 rotate-6' : ''}`}>
            <span className="text-white">{promotion.icon}</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-overlay-light rounded-full text-white text-[10px] sm:text-xs font-medium mb-2">
            <span className="w-1.5 h-1.5 bg-card rounded-full animate-pulse" />
            Limited Time
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-sm">
            {promotion.title}
          </h3>

          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-2" style={{ opacity: 0.9 }}>
            {promotion.subtitle}
          </p>

          <p className="text-sm text-white mb-4 max-w-md" style={{ opacity: 0.8 }}>
            {promotion.description}
          </p>

          <Link
            href={promotion.ctaLink}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-card font-semibold rounded-full transition-all duration-300 group/btn shadow-sm hover:shadow-lg"
          >
            <span>{promotion.ctaText}</span>
            <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {isFullWidth && (
          <div className="hidden md:block">
            <div className={`bg-overlay-light rounded-full px-6 py-3 text-center border-light transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}>
              <p className="text-3xl font-bold text-white">50%</p>
              <p className="text-xs text-white" style={{ opacity: 0.8 }}>OFF</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 h-1 bg-card transition-all duration-500 ease-out ${
        isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'
      }`} />
    </div>
  );
};

export default function PromotionBanners() {
  const [isInView, setIsInView] = useState(false);
  const [visiblePromotions, setVisiblePromotions] = useState([]);
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView) {
      setVisiblePromotions(promotions.slice(0, 2));
      const timer = setTimeout(() => setVisiblePromotions(promotions), 200);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const fullWidthPromo = visiblePromotions.find(p => p.layout === 'full');
  const halfWidthPromos = visiblePromotions.filter(p => p.layout === 'half');

  return (
    <section ref={sectionRef} className="promotion-banners-section py-8 sm:py-12 lg:py-16 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            Exclusive <span className="bg-primary-500" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Offers</span>
          </h2>
          <p className="text-sm max-w-2xl mx-auto">
            Don't miss out on our best deals and promotions
          </p>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
        </div>

        {fullWidthPromo && (
          <div className="mb-6 animate-[fadeInUp_0.5s_ease-out]">
            <PromotionCard promotion={fullWidthPromo} index={0} />
          </div>
        )}

        {halfWidthPromos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {halfWidthPromos.map((promo, index) => (
              <div key={promo.id} className="animate-[fadeInUp_0.5s_ease-out]" style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: 'backwards' }}>
                <PromotionCard promotion={promo} index={index + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}