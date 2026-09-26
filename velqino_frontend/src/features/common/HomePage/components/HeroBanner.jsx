"use client";

import React, { useState, useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  CheckCircle,
  Tag
} from '../../../../utils/icons';

const mainSlides = [
  {
    id: 1,
    tag: "NEW SEASON 2026",
    title: "Premium Heavyweight",
    titleHighlight: "Denim & Streetwear",
    subtitle: "Direct Factory Wholesale Rates · Up to 50% Margins",
    description: "Curated heavy denim, oversized silhouettes, and wardrobe staples engineered for high-volume retail boutiques.",
    ctaText: "Shop Collection",
    ctaLink: "/product/productlistingpage",
    image: "https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048693/retailer/products/2026/07/RET-80409D4B_image_1",
    badge: "50% OFF",
    perks: ["⚡ 24h Factory Dispatch", "🏭 Tier-1 Mill Quality", "📦 Low MOQ"]
  },
  {
    id: 2,
    tag: "RUNWAY EDITION",
    title: "Relaxed Silhouette",
    titleHighlight: "Modern Baggy Cargo",
    subtitle: "Fresh Off Production · Rapid Sell-Through",
    description: "Multi-pocket cargo detailing and relaxed street fits crafted with durable stretch weave for fast seasonal turnover.",
    ctaText: "Explore New In",
    ctaLink: "/product/productlistingpage?new_arrivals=true",
    image: "https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048593/retailer/products/2026/07/RET-84B74D80_image_1",
    badge: "NEW IN",
    perks: ["💎 High Margin Stock", "🎨 5 Color Washes", "🛡️ Assured QC"]
  },
  {
    id: 3,
    tag: "WHOLESALE LIQUIDATION",
    title: "Curated Bulk Lots &",
    titleHighlight: "Factory Steal Deals",
    subtitle: "Guaranteed Factory Direct · Hourly Refresh",
    description: "Pre-packed wholesale cartons ready for immediate dispatch at unbeatable rate-per-piece pricing for maximum profit.",
    ctaText: "Grab Deal Lots",
    ctaLink: "/product/productlistingpage?deals=true",
    image: "https://res.cloudinary.com/dfv1k6imi/image/upload/v1785050400/products/2026/07/PROD-B834A209_image_1",
    badge: "FLASH LOT",
    perks: ["🔥 Up to 60% Savings", "🚚 Free Shipping > ₹10k", "⚡ Ready Stock"]
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });

  // Live Timer for Flash Spotlight
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % mainSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + mainSlides.length) % mainSlides.length);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 6000);
  };

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Mobile Touch Gestures
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const activeSlide = mainSlides[currentSlide];

  return (
    <section className="hero-banner-section py-2 sm:py-3 lg:py-3.5 bg-studio-50/80 border-b border-studio-200">
      <div className="container">
        
        {/* Modern Bento Hero Grid: 8 Cols Main Hero + 4 Cols Stacked Spotlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
          
          {/* Main Hero Showcase (8 Columns on Desktop) */}
          <div 
            className="lg:col-span-8 relative rounded-2xl sm:rounded-3xl border-2 border-studio-300 bg-gradient-to-br from-studio-100 via-studio-50 to-studio-200/70 overflow-hidden shadow-sm hover:border-studio-400 transition-all duration-300 flex flex-col justify-between min-h-[380px] sm:min-h-[400px] lg:min-h-[410px]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background Decorative Ambient Tints */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-100/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-studio-300/40 rounded-full blur-3xl pointer-events-none" />

            {/* Inner Content Grid */}
            <div className="relative z-10 p-5 sm:p-7 lg:p-8 flex-1 flex flex-col sm:flex-row items-center justify-between gap-5">
              
              {/* Left Column: Clean Editorial Typography */}
              <div className="flex-1 max-w-md flex flex-col justify-center">
                
                {/* Eyebrow Tag + Discount Badge */}
                <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-studio-200 text-studio-900 border border-studio-300">
                    <Sparkles size={11} className="text-primary-600" />
                    <span>{activeSlide.tag}</span>
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary-600 text-white shadow-2xs">
                    {activeSlide.badge}
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-2">
                  {activeSlide.title}{' '}
                  <span className="text-primary-600">
                    {activeSlide.titleHighlight}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm font-bold text-studio-800 mb-2">
                  {activeSlide.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-3.5 line-clamp-2 leading-relaxed">
                  {activeSlide.description}
                </p>

                {/* Perks Micro-Pills */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
                  {activeSlide.perks.map((perk, pIdx) => (
                    <span 
                      key={pIdx} 
                      className="inline-flex items-center text-[10px] sm:text-[11px] font-semibold text-gray-800 bg-white/90 border border-studio-200 px-2 py-0.5 rounded-md shadow-2xs"
                    >
                      {perk}
                    </span>
                  ))}
                </div>

                {/* Action CTAs */}
                <div className="flex items-center gap-2.5">
                  <Link
                    href={activeSlide.ctaLink}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all duration-200 group/btn"
                  >
                    <span>{activeSlide.ctaText}</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href="/product/productlistingpage"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-studio-100 text-gray-900 hover:text-primary-700 border border-studio-300 rounded-xl font-semibold text-xs sm:text-sm transition-all"
                  >
                    <ShoppingBag size={13} className="text-primary-600" />
                    <span>Catalog</span>
                  </Link>
                </div>

              </div>

              {/* Right Column: Full-Height Clean Fashion Image */}
              <div className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center">
                <div className="relative w-44 sm:w-48 md:w-56 lg:w-52 xl:w-60 aspect-[3/4] rounded-2xl overflow-hidden bg-white border-2 border-studio-300 shadow-md group/photo">
                  <img
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-105"
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-50" />
                </div>
              </div>

            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 px-5 sm:px-7 py-3 border-t border-studio-300/80 bg-white/70 backdrop-blur-xs flex items-center justify-between">
              
              {/* Slide Dots Indicator */}
              <div className="flex items-center gap-1.5">
                {mainSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'w-6 bg-primary-600'
                        : 'w-1.5 bg-studio-300 hover:bg-primary-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Arrow Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevSlide}
                  className="w-7 h-7 rounded-lg bg-white border border-studio-300 text-gray-800 hover:bg-primary-600 hover:text-white hover:border-primary-600 flex items-center justify-center transition-all duration-200 shadow-2xs"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-7 h-7 rounded-lg bg-white border border-studio-300 text-gray-800 hover:bg-primary-600 hover:text-white hover:border-primary-600 flex items-center justify-center transition-all duration-200 shadow-2xs"
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>

          </div>

          {/* Right Bento Spotlights (4 Columns on Desktop, Vertically Stacked so NEVER cut off) */}
          <div className="lg:col-span-4 flex flex-col gap-3.5 sm:grid sm:grid-cols-2 lg:flex lg:flex-col justify-between">
            
            {/* Spotlight Card 1: Trending Season Drop (Baggy Jeans Dark Wash - Tested Live 200 OK Image) */}
            <div className="flex-1 bg-gradient-to-br from-studio-50 via-white to-studio-100/90 rounded-2xl border-2 border-studio-300 p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-studio-400 transition-all duration-300 flex items-center justify-between gap-3 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-studio-200 text-studio-900 border border-studio-300">
                    <TrendingUp size={10} className="text-primary-600" />
                    <span>Trending Drop</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-primary-700 bg-primary-50 px-1.5 py-0.2 rounded border border-primary-200">
                    38% OFF
                  </span>
                </div>
                
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                  Baggy Jeans (Dark Wash)
                </h4>
                
                <div className="flex items-baseline gap-1.5 mt-0.5 mb-2">
                  <span className="text-sm sm:text-base font-extrabold text-gray-900">₹1,100</span>
                  <span className="text-xs text-gray-400 line-through">₹1,799</span>
                </div>
                
                <Link
                  href="/product/productlistingpage?product_id=88"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 group/link"
                >
                  <span>Explore Drop</span>
                  <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Product Thumbnail (Live Cloudinary 200 OK) */}
              <div className="w-20 h-24 sm:w-22 sm:h-26 flex-shrink-0 rounded-xl overflow-hidden bg-white border border-studio-300 flex items-center justify-center shadow-xs">
                <img
                  src="https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048593/retailer/products/2026/07/RET-84B74D80_image_1"
                  alt="Baggy Jeans Dark Wash"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                />
              </div>
            </div>

            {/* Spotlight Card 2: Live Flash Wholesale Deal */}
            <div className="flex-1 bg-gradient-to-br from-studio-50 via-white to-studio-100/90 rounded-2xl border-2 border-studio-300 p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-studio-400 transition-all duration-300 flex items-center justify-between gap-3 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-studio-200 text-studio-900 border border-studio-300">
                    <Zap size={10} className="text-primary-600" />
                    <span>Flash Deal</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-primary-700 bg-primary-50 px-1.5 py-0.2 rounded border border-primary-200">
                    32% OFF
                  </span>
                </div>
                
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                  Denim Sherpa Jacket
                </h4>
                
                <div className="flex items-baseline gap-1.5 mt-0.5 mb-1.5">
                  <span className="text-sm sm:text-base font-extrabold text-gray-900">₹1,700</span>
                  <span className="text-xs text-gray-400 line-through">₹2,499</span>
                </div>

                {/* Live Countdown Clock */}
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-studio-900 bg-studio-200/80 border border-studio-300 px-2 py-0.5 rounded-md mb-1.5 shadow-2xs">
                  <Clock size={11} className="text-primary-600 animate-pulse" />
                  <span className="font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
                
                <div>
                  <Link
                    href="/product/productlistingpage?product_id=89"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 group/link"
                  >
                    <span>Claim Deal</span>
                    <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Product Thumbnail (Live Cloudinary 200 OK) */}
              <div className="w-20 h-24 sm:w-22 sm:h-26 flex-shrink-0 rounded-xl overflow-hidden bg-white border border-studio-300 flex items-center justify-center shadow-xs">
                <img
                  src="https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048693/retailer/products/2026/07/RET-80409D4B_image_1"
                  alt="Sherpa Jacket"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
