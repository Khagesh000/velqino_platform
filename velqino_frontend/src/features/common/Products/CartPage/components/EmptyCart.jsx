"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowRight } from '../../../../../utils/icons';

export default function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-sm mx-auto">

        {/* Icon with rings */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Outer pulse ring */}
          <div className="absolute w-40 h-40 rounded-full bg-primary-50 animate-ping opacity-20" />
          {/* Middle ring */}
          <div className="absolute w-36 h-36 rounded-full bg-primary-50 border border-primary-100" />
          {/* Inner ring */}
          <div className="absolute w-28 h-28 rounded-full bg-primary-50 border border-primary-100" />
          {/* Icon circle */}
          <div className="relative w-24 h-24 rounded-full bg-primary-100 border-2 border-primary-200 flex items-center justify-center z-10 shadow-lg shadow-primary-100">
            <ShoppingCart size={40} className="text-primary-500" />
          </div>

          {/* Floating dots */}
          <div className="absolute top-2 right-6 w-3 h-3 rounded-full bg-primary-300 opacity-60 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '2s' }} />
          <div className="absolute bottom-3 left-4 w-2 h-2 rounded-full bg-primary-400 opacity-50 animate-bounce" style={{ animationDelay: '400ms', animationDuration: '2.4s' }} />
          <div className="absolute top-6 left-8 w-1.5 h-1.5 rounded-full bg-primary-200 opacity-70 animate-bounce" style={{ animationDelay: '800ms', animationDuration: '1.8s' }} />
        </div>

        {/* Text */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          Your cart is empty
        </h2>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-xs mx-auto">
          Looks like you haven't added anything yet. Explore our collection and find something you love!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/product/productlistingpage"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-xl font-semibold text-sm
              transition-all duration-200 hover:shadow-lg hover:shadow-primary-200 hover:-translate-y-0.5 group w-full sm:w-auto"
          >
            Start Shopping
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-primary-200 hover:bg-primary-50 text-gray-700 hover:text-primary-600 rounded-xl font-semibold text-sm
              transition-all duration-200 w-full sm:w-auto"
          >
            Go Home
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center gap-6 flex-wrap">
          <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 text-[9px] flex items-center justify-center font-bold">✓</span>
            Free Shipping
          </span>
          <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 text-[9px] flex items-center justify-center font-bold">✓</span>
            Secure Payments
          </span>
          <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 text-[9px] flex items-center justify-center font-bold">✓</span>
            Easy Returns
          </span>
        </div>

      </div>
    </div>
  );
}