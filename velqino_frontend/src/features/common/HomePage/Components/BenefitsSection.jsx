"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Truck, RefreshCw, Headphones, Shield, Award, Package, CheckCircle, Clock, CreditCard } from '../../../../utils/icons';
import '../../../../styles/common/HomePage/BenefitsSection.scss'

const benefits = [
  {
    id: 1,
    title: 'Free Shipping',
    description: 'On orders above ₹999',
    icon: <Truck size={24} />,
    color: 'primary',
    bgGradient: 'from-primary-50 to-primary-100'
  },
  {
    id: 2,
    title: '30-Day Returns',
    description: 'Easy returns & exchanges',
    icon: <RefreshCw size={24} />,
    color: 'secondary',
    bgGradient: 'from-secondary-50 to-secondary-100'
  },
  {
    id: 3,
    title: '24/7 Support',
    description: 'Always here to help you',
    icon: <Headphones size={24} />,
    color: 'accent',
    bgGradient: 'from-accent-50 to-accent-100'
  },
  {
    id: 4,
    title: 'Secure Payments',
    description: '100% secure transactions',
    icon: <Shield size={24} />,
    color: 'primary',
    bgGradient: 'from-primary-50 to-primary-100'
  },
  {
    id: 5,
    title: 'Quality Guarantee',
    description: 'Best quality products',
    icon: <Award size={24} />,
    color: 'secondary',
    bgGradient: 'from-secondary-50 to-secondary-100'
  },
  {
    id: 6,
    title: 'Easy Returns',
    description: 'Hassle-free return policy',
    icon: <Package size={24} />,
    color: 'accent',
    bgGradient: 'from-accent-50 to-accent-100'
  }
];

const BenefitCard = ({ benefit, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);

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

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`benefit-card text-center p-4 sm:p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 ${
        isInView ? 'animate-fadeInUp' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon Container */}
      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${benefit.bgGradient} flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300 ${
        isHovered ? 'scale-110' : 'scale-100'
      }`}>
        <span className="text-primary-600">{benefit.icon}</span>
      </div>
      
      {/* Title */}
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
        {benefit.title}
      </h3>
      
      {/* Description */}
      <p className="text-xs text-gray-500">
        {benefit.description}
      </p>
    </div>
  );
};

export default function BenefitsSection() {
  const [isInView, setIsInView] = useState(false);
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="benefits-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle size={24} className="text-primary-500" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Why Choose <span className="text-primary-500">Us</span>
            </h2>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            We provide the best shopping experience with these amazing benefits
          </p>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.id} benefit={benefit} index={index} />
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-50 rounded-full">
            <Shield size={16} className="text-primary-600" />
            <span className="text-xs sm:text-sm text-gray-600">
              Trusted by 10,000+ businesses
            </span>
            <Clock size={16} className="text-primary-600" />
            <span className="text-xs sm:text-sm text-gray-600">
              5+ years of excellence
            </span>
          </div>
        </div>
      </div>

      
    </section>
  );
}