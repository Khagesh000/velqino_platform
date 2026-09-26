"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle, User, ShoppingBag } from '../../../../utils/icons';

const reviews = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    avatar: '/images/placeholder.jpg',
    rating: 5,
    date: '2026-04-15',
    review: 'Absolutely love this product! The quality is exceptional and delivery was super fast. Will definitely buy again.',
    productName: 'Premium Cotton T-Shirt',
    productSlug: 'cotton-tshirt',
    verified: true,
    location: 'Mumbai'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    avatar: '/images/placeholder.jpg',
    rating: 5,
    date: '2026-04-14',
    review: 'Best purchase decision ever! The customer service was very helpful and responsive.',
    productName: 'Wireless Headphones',
    productSlug: 'wireless-headphones',
    verified: true,
    location: 'Delhi'
  },
  {
    id: 3,
    name: 'Amit Singh',
    avatar: '/images/placeholder.jpg',
    rating: 4,
    date: '2026-04-13',
    review: 'Good product for the price. Build quality is nice. Would recommend to others.',
    productName: 'Smart Watch Pro',
    productSlug: 'smart-watch',
    verified: true,
    location: 'Bangalore'
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    avatar: '/images/placeholder.jpg',
    rating: 5,
    date: '2026-04-12',
    review: 'Excellent quality! Exceeded my expectations. The packaging was also very good.',
    productName: 'Running Shoes',
    productSlug: 'running-shoes',
    verified: true,
    location: 'Hyderabad'
  },
  {
    id: 5,
    name: 'Vikram Mehta',
    avatar: '/images/placeholder.jpg',
    rating: 5,
    date: '2026-04-11',
    review: 'Very satisfied with my purchase. The product is exactly as described.',
    productName: 'Leather Wallet',
    productSlug: 'leather-wallet',
    verified: true,
    location: 'Chennai'
  },
  {
    id: 6,
    name: 'Neha Gupta',
    avatar: '/images/placeholder.jpg',
    rating: 4,
    date: '2026-04-10',
    review: 'Good value for money. Shipping was quick. Minor issue with size but resolved quickly.',
    productName: 'Backpack',
    productSlug: 'backpack',
    verified: true,
    location: 'Pune'
  }
];

const ReviewCard = memo(({ review, isActive = true }) => {
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <div className={`relative bg-gradient-to-b from-white via-precious-50/60 to-precious-100/60 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md border-2 border-precious-200/90 hover:border-precious-400 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden ${
      isActive ? 'opacity-100 scale-100' : 'opacity-100 scale-100'
    }`}>
      {/* Delicate Top Brand Accent */}
      <div className="absolute top-0 left-5 right-5 h-0.5 bg-gradient-to-r from-precious-300 via-primary-500 to-precious-300 rounded-full opacity-80" />

      <div>
        {/* Header */}
        <div className="flex items-start gap-3 mb-3 pt-0.5">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary-200 bg-primary-50 flex items-center justify-center overflow-hidden">
              <img
                src={review.avatar}
                alt={review.name}
                onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                className="w-full h-full object-cover"
                onLoad={() => setIsLoaded(true)}
              />
            </div>
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h4 className="text-sm sm:text-base font-bold text-gray-900 truncate">{review.name}</h4>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < review.rating ? 'text-accent-500 fill-current' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="text-[10px] sm:text-xs text-gray-400">{review.date}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-semibold">
                  <CheckCircle size={8} />
                  Verified Purchase
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Review Text */}
        <div className="relative mb-3 pt-0.5">
          <Quote size={16} className="absolute -top-1 -left-1 text-primary-300 opacity-70" />
          <p className="text-xs sm:text-sm text-gray-600 pl-4 sm:pl-5 line-clamp-3 leading-relaxed">
            {review.review}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
        {/* Product Link */}
        <Link
          href={`/product/${review.productSlug}`}
          className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100/80 border border-primary-200/70 px-2.5 py-1 rounded-lg transition-colors font-medium truncate max-w-[65%]"
        >
          <ShoppingBag size={11} className="flex-shrink-0 text-primary-500" />
          <span className="truncate">{review.productName}</span>
        </Link>

        {/* Location */}
        <div className="text-[10px] sm:text-[11px] text-gray-400 flex items-center gap-1 flex-shrink-0">
          <User size={9} className="text-gray-400" />
          <span>{review.location}</span>
        </div>
      </div>
    </div>
  );
});

ReviewCard.displayName = 'ReviewCard';

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef(null);
  const autoPlayRef = useRef(null);

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const getInitialItems = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return 1;
      if (width < 1024) return 2;
    }
    return 3;
  };

  const [itemsToShow, setItemsToShow] = useState(getInitialItems);
  const totalSlides = Math.ceil(reviews.length / itemsToShow);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsToShow(1);
      else if (width < 1024) setItemsToShow(2);
      else setItemsToShow(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Bounds safety: clamp currentIndex if totalSlides changes
  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(0);
    }
  }, [totalSlides, currentIndex]);

  // Intersection Observer
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

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying && isInView) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, 5000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, isInView, totalSlides]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const visibleReviews = reviews.slice(
    currentIndex * itemsToShow,
    (currentIndex + 1) * itemsToShow
  );

  // Calculate average rating
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;

  return (
    <section ref={sectionRef} className="reviews-section py-4 sm:py-5 lg:py-6 bg-primary-50/35 border-y border-primary-100/70">
      <div className="container">
        
        {/* Section Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Quote size={20} className="text-primary-500" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              What Our <span className="text-primary-600">Customers</span> Say
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">Real feedback from verified retailers & buyers</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-7">
          {/* Average Rating - Left */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">{avgRating}</p>
              <div className="flex items-center gap-0.5 mt-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(avgRating) ? 'text-accent-500 fill-current' : 'text-gray-200'}`} />
                ))}
              </div>
            </div>
            <div className="h-10 w-px bg-primary-200 hidden sm:block" />
            <div className="sm:hidden w-full h-px bg-primary-100 my-2" />
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalReviews}+</p>
              <p className="text-xs text-gray-500">Happy Customers</p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="w-full sm:w-auto">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => r.rating === star).length;
                const percentage = (count / totalReviews) * 100;
                return (
                  <div key={star} className="flex items-center gap-2 bg-white border border-primary-100/90 px-3 py-1.5 rounded-lg shadow-2xs sm:min-w-[125px]">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 w-7">{star}★</span>
                    <div className="flex-1 w-20 sm:w-24 h-2 bg-primary-100/70 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-500 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-500 min-w-[20px] text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 w-8 h-8 bg-white border border-primary-200/80 text-gray-700 rounded-full shadow-md flex items-center justify-center hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 w-8 h-8 bg-white border border-primary-200/80 text-gray-700 rounded-full shadow-md flex items-center justify-center hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>

          {/* Slides */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="flex-shrink-0 w-full">
                  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6`}>
                    {reviews.slice(slideIndex * itemsToShow, (slideIndex + 1) * itemsToShow).map((review, idx) => (
                      <ReviewCard key={review.id} review={review} isActive={true} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'w-6 bg-primary-500'
                  : 'w-1.5 bg-gray-300 hover:bg-primary-300'
              }`}
            />
          ))}
        </div>

        {/* Write a Review Button */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-xl hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-xs">
            Write a Review
          </button>
        </div>
      </div>
    </section>
  );
}
