"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Facebook, Instagram, Twitter, Youtube, Linkedin } from '../../../../utils/icons';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const socialLinks = [
    { name: 'Instagram', icon: <Instagram size={20} />, url: 'https://instagram.com', color: 'hover:bg-pink-600' },
    { name: 'Facebook', icon: <Facebook size={20} />, url: 'https://facebook.com', color: 'hover:bg-blue-700' },
    { name: 'Twitter', icon: <Twitter size={20} />, url: 'https://twitter.com', color: 'hover:bg-sky-500' },
    { name: 'Youtube', icon: <Youtube size={20} />, url: 'https://youtube.com', color: 'hover:bg-red-600' },
    { name: 'Linkedin', icon: <Linkedin size={20} />, url: 'https://linkedin.com', color: 'hover:bg-blue-800' },
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail('');
    
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <section ref={sectionRef} className="newsletter-section py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary-800 to-primary-900">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto text-center">
      
      {/* Section Header */}
      <div className={`mb-6 sm:mb-8 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-700 rounded-full mb-4">
          <Mail size={24} className="text-primary-100" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-50 mb-2">
          Subscribe to Our <span className="text-primary-300">Newsletter</span>
        </h2>
        <p className="text-primary-100 text-sm sm:text-base max-w-lg mx-auto">
          Get the latest updates on new products and exclusive offers
        </p>
      </div>

      {/* Offer Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 bg-primary-800/50 backdrop-blur-sm rounded-full mb-6 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <span className="text-primary-200 text-sm">🎁</span>
        <span className="text-primary-100 text-xs sm:text-sm font-medium">Get 10% off on your first order</span>
      </div>

      {/* Subscription Form */}
      <form onSubmit={handleSubmit} className={`max-w-md mx-auto mb-8 transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full pl-10 pr-4 py-3 bg-primary-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle size={18} />
                <span>Subscribed!</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Subscribe</span>
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mt-2 text-center text-error-400 text-xs flex items-center justify-center gap-1">
            <AlertCircle size={12} />
            <span>{error}</span>
          </div>
        )}
        
        {isSuccess && (
          <div className="mt-2 text-center text-success-400 text-xs flex items-center justify-center gap-1">
            <CheckCircle size={12} />
            <span>Thanks for subscribing! Check your email for confirmation.</span>
          </div>
        )}
      </form>

      {/* Benefits Text */}
      <div className={`flex flex-wrap justify-center gap-4 mb-8 transition-all duration-700 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex items-center gap-1 text-primary-200 text-xs">
          <CheckCircle size={12} className="text-success-500" />
          <span>Exclusive offers</span>
        </div>
        <div className="flex items-center gap-1 text-primary-200 text-xs">
          <CheckCircle size={12} className="text-success-500" />
          <span>New arrivals</span>
        </div>
        <div className="flex items-center gap-1 text-primary-200 text-xs">
          <CheckCircle size={12} className="text-success-500" />
          <span>Discount coupons</span>
        </div>
        <div className="flex items-center gap-1 text-primary-200 text-xs">
          <CheckCircle size={12} className="text-success-500" />
          <span>Unsubscribe anytime</span>
        </div>
      </div>

      {/* Social Media Links */}
      <div className={`flex justify-center gap-3 transition-all duration-700 delay-400 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center text-primary-200 hover:bg-primary-600 hover:text-white hover:scale-110 transition-all duration-300"
            aria-label={social.name}
          >
            {social.icon}
          </a>
        ))}
      </div>

      {/* Trust Text */}
      <p className="text-primary-400 text-[10px] mt-6 transition-all duration-700 delay-500">
        We respect your privacy. No spam, ever.
      </p>
    </div>
  </div>
</section>
  );
}