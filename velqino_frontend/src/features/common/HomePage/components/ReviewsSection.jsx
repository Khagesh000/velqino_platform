"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle, User, ShoppingBag } from '../../../../utils/icons';

const reviews = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    avatar: '/images/avatars/avatar1.jpg',
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
    avatar: '/images/avatars/avatar2.jpg',
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
    avatar: '/images/avatars/avatar3.jpg',
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
    avatar: '/images/avatars/avatar4.jpg',
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
    avatar: '/images/avatars/avatar5.jpg',
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
    avatar: '/images/avatars/avatar6.jpg',
    rating: 4,
    date: '2026-04-10',
    review: 'Good value for money. Shipping was quick. Minor issue with size but resolved quickly.',
    productName: 'Backpack',
    productSlug: 'backpack',
    verified: true,
    location: 'Pune'
  }
];

const ReviewCard = memo(({ review, isActive }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 transition-all duration-300 ${
      isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    }`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden">
            {!isLoaded && (
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            )}
            <img
              src={review.avatar}
              alt={review.name}
              loading="lazy"
              className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(true)}
            />
          </div>
        </div>
        
        {/* Info */}
        <div className="flex-1">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    <h4 className="text-sm sm:text-base font-semibold text-gray-900">{review.name}</h4>
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
      ))}
    </div>
  </div>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="text-[10px] sm:text-xs text-gray-400">{review.date}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                <CheckCircle size={8} />
                Verified Purchase
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Review Text */}
      <div className="relative mb-3">
        <Quote size={16} className="absolute -top-1 -left-1 text-primary-200 opacity-50" />
        <p className="text-xs sm:text-sm text-gray-600 pl-4 sm:pl-5 line-clamp-3">{review.review}</p>
      </div>

      {/* Product Link */}
      <Link
        href={`/product/${review.productSlug}`}
        className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-primary-600 hover:text-primary-700 transition-colors"
      >
        <ShoppingBag size={10} />
        <span>{review.productName}</span>
      </Link>

      {/* Location */}
      <div className="mt-2 text-[9px] sm:text-[10px] text-gray-400 flex items-center gap-1">
        <User size={8} />
        <span>{review.location}</span>
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

  const [itemsToShow, setItemsToShow] = useState(3);
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
    <section ref={sectionRef} className="reviews-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Quote size={24} className="text-primary-500" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              What Our <span className="text-primary-500">Customers</span> Say
            </h2>
          </div>
          <p className="text-sm text-gray-500">Real reviews from verified buyers</p>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
  {/* Average Rating - Left */}
  <div className="flex items-center gap-3">
    <div className="text-center">
      <p className="text-3xl sm:text-4xl font-bold text-gray-900">{avgRating}</p>
      <div className="flex items-center gap-0.5 mt-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < Math.floor(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
      </div>
    </div>
    <div className="h-10 w-px bg-gray-200 hidden sm:block" />
    <div className="sm:hidden w-full h-px bg-gray-200 my-2" />
    <div>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalReviews}+</p>
      <p className="text-xs text-gray-500">Happy Customers</p>
    </div>
  </div>

  {/* Rating Distribution - Vertical on Mobile, Horizontal on Desktop */}
  <div className="w-full sm:w-auto">
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter(r => r.rating === star).length;
        const percentage = (count / totalReviews) * 100;
        return (
          <div key={star} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg sm:min-w-[140px]">
            <span className="text-sm font-semibold text-gray-700 w-8">{star}★</span>
            <div className="flex-1 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
            </div>
            <span className="text-xs font-medium text-gray-500 min-w-[30px] text-right">{count}</span>
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300"
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
          <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-primary-50 transition-all duration-300">
            Write a Review
          </button>
        </div>
      </div>
    </section>
  );
}