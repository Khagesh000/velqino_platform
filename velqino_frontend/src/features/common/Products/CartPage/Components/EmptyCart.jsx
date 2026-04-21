"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from '../../../../../utils/icons';

export default function EmptyCart() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={64} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet</p>
        <Link 
          href="/products" 
          className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
}