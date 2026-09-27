"use client";

import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  Check, 
  ShieldCheck, 
  Truck, 
  FileText, 
  Package, 
  RotateCcw 
} from '@/utils/icons';

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description');

  const description = product?.description || '';
  const specifications = product?.specifications || {};
  const avgRating = parseFloat(product?.avg_rating || product?.rating || 4.8);
  const totalReviews = parseInt(product?.total_reviews || product?.reviews || 24, 10);

  const tabs = [
    { id: 'description', label: 'Lot Description' },
    { id: 'specifications', label: 'Technical Specifications' },
    { id: 'trade_terms', label: 'Wholesale Trade & Logistics' },
    { id: 'reviews', label: `Buyer Reviews (${totalReviews})` },
  ];

  const specEntries = Object.entries(specifications);

  // If no backend specifications exist, format defaults from product fields
  const displaySpecs = specEntries.length > 0 
    ? specEntries 
    : [
        ['Product Category', product?.category_name || 'Apparel & Textiles'],
        ['Wholesale Lot SKU', product?.sku || 'PROD-LOT-AUTHENTIC'],
        ['Minimum Order Qty', `${product?.min_order_qty || 1} Units`],
        ['Primary Color / Pattern', `${product?.primary_color || 'Standard'} / ${product?.pattern || 'Solid'}`],
        ['Origin', 'Pan-India Certified Mills'],
        ['Dispatch Time', '24 - 48 Hours Mill Packaging'],
        ['Quality Assurance', 'Escrow Inspected Standard'],
        ['Packaging Type', 'Industrial Export Master Carton']
      ];

  return (
    <div className="bg-white rounded-3xl border-2 border-primary-100/90 shadow-2xs overflow-hidden">
      
      {/* 1. Tab Headers */}
      <div className="flex border-b border-primary-100 overflow-x-auto bg-gradient-to-r from-primary-50/70 via-white to-primary-50/40 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pdp-tab-btn relative px-5 sm:px-7 py-4 text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0
                ${isActive 
                  ? 'active text-primary-900 bg-white' 
                  : 'text-gray-500 hover:text-primary-800 hover:bg-white/60'
                }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Tab Contents */}
      <div className="p-5 sm:p-8">
        
        {/* Tab A: Description */}
        {activeTab === 'description' && (
          <div className="space-y-4 max-w-4xl">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Wholesale Lot Overview & Quality Notes
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {description || 'This wholesale lot is sourced directly from certified manufacturing mills across India. Packaged in bulk cartons with automated dispatch tracking and GST tax invoicing.'}
            </p>

            {/* Feature list */}
            {Array.isArray(product?.features) && product.features.length > 0 && (
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Material & Manufacturing Features:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 bg-primary-50/50 p-2.5 rounded-xl border border-primary-100">
                      <span className="w-4 h-4 rounded-full bg-primary-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab B: Technical Specifications */}
        {activeTab === 'specifications' && (
          <div className="space-y-4 max-w-4xl">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Technical & Packaging Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displaySpecs.map(([k, v]) => (
                <div key={k} className="p-3 bg-gray-50/70 rounded-xl border border-gray-200/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500 uppercase tracking-wide">
                    {String(k).replace(/_/g, ' ')}
                  </span>
                  <span className="font-bold text-gray-900 text-right">
                    {String(v)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab C: Wholesale Trade & Logistics Terms */}
        {activeTab === 'trade_terms' && (
          <div className="space-y-5 max-w-4xl">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Wholesale Trade Assurance & Escrow Fulfillment Policies
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <ShieldCheck size={16} className="text-emerald-700" />
                  <span>100% Escrow Trade Guarantee</span>
                </div>
                <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                  Your funds are maintained securely in escrow until delivery inspection is verified at your receiving facility.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-primary-50/80 border border-primary-200/90 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-primary-900">
                  <FileText size={16} className="text-primary-700" />
                  <span>Automated GST Tax Invoicing</span>
                </div>
                <p className="text-[11px] text-primary-800/90 leading-relaxed">
                  Official GST B2B tax invoice with HSN codes, IGST/CGST breakdowns, and digital dispatch notes are ready for download instantly on dispatch.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/90 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                  <Truck size={16} className="text-sky-700" />
                  <span>Pan-India Logistics & Tracking</span>
                </div>
                <p className="text-[11px] text-sky-800/90 leading-relaxed">
                  Direct dispatch from factory hubs with active milestone tracking (pending → confirmed → shipped → delivered).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <RotateCcw size={16} className="text-amber-700" />
                  <span>Factory Defect Protection</span>
                </div>
                <p className="text-[11px] text-amber-800/90 leading-relaxed">
                  Direct replacement or credit reimbursement for verified transit damages or manufacturing lot deviations reported within 48 hours of delivery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab D: Buyer Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="text-center sm:text-left">
                <span className="text-4xl font-black text-gray-900">{avgRating.toFixed(1)}</span>
                <div className="flex items-center gap-0.5 justify-center sm:justify-start my-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className={i < Math.floor(avgRating) ? 'fill-current' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-medium">Based on {totalReviews} wholesale ratings</span>
              </div>
            </div>

            {/* Sample review items */}
            <div className="space-y-3">
              {[
                { name: 'R. K. Textiles (Surat)', date: '3 days ago', comment: 'Excellent fabric density and consistent lot dye. Packaging in heavy-duty poly was immaculate.', rating: 5 },
                { name: 'Apex Apparel Hub (Bengaluru)', date: '1 week ago', comment: 'Direct factory rate is unmatched in the market. Dispatch took 3 days as promised.', rating: 5 }
              ].map((rev, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-100 bg-white space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900">{rev.name}</span>
                    <span className="text-gray-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} size={11} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
