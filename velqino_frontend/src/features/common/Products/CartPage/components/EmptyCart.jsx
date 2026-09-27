"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  ArrowRight, 
  Package, 
  ShieldCheck, 
  Truck, 
  Store,
  ChevronRight
} from '@/utils/icons';

export default function EmptyCart() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="max-w-md w-full text-center">
        
        {/* Luxury Icon Halo */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute w-36 h-36 rounded-full bg-primary-100/60 animate-ping opacity-25 pointer-events-none" />
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary-100 via-primary-50 to-white border-2 border-primary-200/80 flex items-center justify-center shadow-lg text-primary-600 relative z-10">
            <ShoppingCart size={44} className="stroke-[1.6]" />
          </div>
        </div>

        {/* Messaging */}
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2.5 tracking-tight">
          Your Wholesale Cart is Empty
        </h2>
        
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm mx-auto mb-8 font-normal">
          You haven't selected any wholesale lots yet. Explore verified direct-from-mill denim, apparel, and seasonal collections at authentic wholesale rates.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/product/productlistingpage"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98"
          >
            <span>Explore Wholesale Catalog</span>
            <ArrowRight size={15} />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-xl text-xs sm:text-sm font-semibold border border-gray-200 hover:border-primary-300 transition-all"
          >
            <span>Go to Homepage</span>
          </Link>
        </div>

        {/* Trust Privileges Strip */}
        <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1">
            <Truck size={16} className="text-primary-600" />
            <span className="text-[10px] font-bold text-gray-700">Pan-India Freight</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck size={16} className="text-primary-600" />
            <span className="text-[10px] font-bold text-gray-700">Escrow Protected</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Store size={16} className="text-primary-600" />
            <span className="text-[10px] font-bold text-gray-700">Direct Mill Lots</span>
          </div>
        </div>

      </div>
    </div>
  );
}