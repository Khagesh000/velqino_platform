"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, Zap, Gift, Sparkles, Tag, ArrowRight } from '../../../../utils/icons';

export default function PromotionBanners() {
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="promotion-banners-section py-4 sm:py-5 lg:py-6 bg-white border-b border-gray-100">
      <div className="container">

        {/* Section Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Tag size={16} className="text-primary-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600">
              Bulk Deals & Offers
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 text-gray-900">
            Exclusive <span className="text-primary-600">Offers</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto">
            Limited time wholesale promotions and volume discount bundles
          </p>
        </div>

        {/* Big Top Promotion Banner (Bright Brand Terracotta Gradient) */}
        <div className="mb-4 sm:mb-5">
          <div className="relative overflow-hidden rounded-3xl border border-primary-500/50 bg-gradient-to-r from-primary-600 via-primary-600 to-primary-700 text-white p-6 sm:p-8 lg:p-10 shadow-lg">
            
            {/* Background Glow */}
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full text-[11px] font-extrabold mb-3 shadow-xs backdrop-blur-xs">
                  <Zap size={12} className="fill-current text-accent-200" />
                  <span>LIMITED TIME PROMO</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 leading-tight tracking-tight">
                  Summer Wardrobe <span className="text-accent-200">Clearance</span>
                </h3>

                <p className="text-xs sm:text-sm text-primary-100 mb-5 leading-relaxed">
                  Save up to 50% on wholesale track pants, kurtas, jackets & bulk seasonal collections. Verified suppliers with instant door-step delivery.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/product/productlistingpage?season=summer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-primary-50 text-primary-700 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-98"
                  >
                    <span>Shop Clearance</span>
                    <ChevronRight size={15} />
                  </Link>
                  <span className="text-xs font-semibold text-primary-100">
                    Use Code: <span className="text-white font-mono font-bold bg-black/25 px-2.5 py-1 rounded-lg border border-white/25">SUMMER50</span>
                  </span>
                </div>
              </div>

              {/* 50% OFF Circular Badge */}
              <div className="flex-shrink-0 self-start md:self-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 flex flex-col items-center justify-center p-3 text-center shadow-lg transform md:rotate-2 hover:rotate-0 transition-transform">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-100">UP TO</span>
                  <span className="text-3xl sm:text-4xl font-black text-white leading-none my-1">50%</span>
                  <span className="text-[11px] font-black text-primary-800 bg-white px-3 py-0.5 rounded-full shadow-xs">OFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Half-Width Sub Banners with Bright Contrasting Global Brand Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          
          {/* Card 1: Fresh Arrivals - Deep Charcoal Slate (from global secondary palette) */}
          <div className="relative overflow-hidden rounded-2xl border border-secondary-700/60 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="p-1.5 bg-white/10 text-accent-300 rounded-lg">
                  <Sparkles size={14} />
                </span>
                <span className="text-[11px] font-bold text-accent-200 uppercase tracking-wider">
                  Fresh Inventory
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-white mb-1.5">
                New Collection Fresh Arrivals
              </h4>
              <p className="text-xs text-secondary-300 mb-4 leading-relaxed">
                Explore freshly cataloged trending dresses, baggy pants & designer ethnic wear directly from mills.
              </p>
            </div>

            <div>
              <Link
                href="/product/productlistingpage?season=new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-secondary-100 text-secondary-900 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98"
              >
                <span>Explore Lookbook</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Card 2: Festive Special - Rich Warm Gold Accent (from global accent palette) */}
          <div className="relative overflow-hidden rounded-2xl border border-accent-500/60 bg-gradient-to-br from-accent-600 via-accent-600 to-accent-700 text-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="p-1.5 bg-white/20 text-white rounded-lg">
                  <Gift size={14} />
                </span>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Special Festive Offer
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-white mb-1.5">
                Festive Season Wholesale Deals
              </h4>
              <p className="text-xs text-accent-100 mb-4 leading-relaxed">
                Extra 20% off on festive bulk bundles. Use code <span className="bg-black/25 text-white font-mono font-bold px-2 py-0.5 rounded border border-white/25">FESTIVE20</span> at checkout.
              </p>
            </div>

            <div>
              <Link
                href="/product/productlistingpage?season=festive"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-accent-50 text-accent-800 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98"
              >
                <span>Shop Festive Specials</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}