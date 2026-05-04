"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, TrendingUp, Clock, Zap } from '../../../../utils/icons';
import '../../../../styles/common/HomePage/HeroBanner.scss'

const slides = [
  {
    id: 1,
    title: "Summer Sale Extravaganza",
    subtitle: "Up to 50% off on selected items",
    description: "Shop the latest summer collection with exclusive discounts. Limited time offer!",
    ctaText: "Shop Now",
    ctaLink: "/products",
    image: "/images/banner/summer-sale.jpg",
    mobileImage: "/images/banner/summer-sale-mobile.jpg",
    badge: { text: "50% OFF", color: "bg-red-500" },
    icon: <Zap size={20} />,
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Fresh from the runway",
    description: "Discover the latest trends and styles. Be the first to shop!",
    ctaText: "Explore Now",
    ctaLink: "/new-arrivals",
    image: "/images/banner/new-arrivals.jpg",
    mobileImage: "/images/banner/new-arrivals-mobile.jpg",
    badge: { text: "NEW", color: "bg-green-500" },
    icon: <TrendingUp size={20} />,
    gradient: "from-green-500 to-teal-500"
  },
  {
    id: 3,
    title: "Flash Sale",
    subtitle: "Limited time only",
    description: "Hurry up! Grab your favorites before they're gone.",
    ctaText: "Shop Sale",
    ctaLink: "/deals",
    image: "/images/banner/flash-sale.jpg",
    mobileImage: "/images/banner/flash-sale-mobile.jpg",
    badge: { text: "LIMITED", color: "bg-yellow-500" },
    icon: <Clock size={20} />,
    gradient: "from-purple-500 to-pink-500"
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div 
      className="relative w-full overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div 
        className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[400px] transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        <div className="flex w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative w-full h-full flex-shrink-0"
              style={{ width: '100%' }}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                {/* Desktop Image */}
                <picture>
                  <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
                  <source media="(min-width: 641px)" srcSet={slide.image} />
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </picture>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-xl lg:max-w-2xl">
                    {/* Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 ${slide.badge.color} rounded-full text-white text-xs font-semibold mb-3 sm:mb-4 animate-fadeInUp`}>
                      {slide.icon}
                      <span>{slide.badge.text}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 animate-fadeInUp animation-delay-100">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-2 sm:mb-3 animate-fadeInUp animation-delay-200">
                      {slide.subtitle}
                    </p>

                    {/* Description - Hide on mobile */}
                    <p className="hidden sm:block text-sm sm:text-base text-white/80 mb-4 sm:mb-6 max-w-lg animate-fadeInUp animation-delay-300">
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <Link
                      href={slide.ctaLink}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 animate-fadeInUp animation-delay-400"
                    >
                      {slide.ctaText}
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Desktop only */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all duration-300 hover:scale-110 hidden sm:block"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all duration-300 hover:scale-110 hidden sm:block"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'w-6 sm:w-8 bg-primary-500'
                : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
        <div 
          className="h-full bg-primary-500 transition-all duration-5000 linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
}