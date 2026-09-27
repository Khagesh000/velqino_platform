"use client";

import React from 'react';
import Link from 'next/link';
import { Package, Tag } from '@/utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

export default function OrderDetailsTable({ items = [] }) {
  const resolveImageUrl = (img) => {
    if (!img) return '/images/placeholder.jpg';
    if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
      return img;
    }
    return `${BASE_IMAGE_URL}${img}`;
  };

  return (
    <div className="confirmation-card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
            <Package size={15} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Wholesale Order Lots
            </h2>
            <p className="text-[11px] text-gray-500">
              Verified mill specifications and lot quantities
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-primary-800 bg-primary-100/90 border border-primary-200 px-2.5 py-0.5 rounded-full">
          {items.length} {items.length === 1 ? 'Lot' : 'Lots'}
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {items.map((item) => {
          const imgSrc = resolveImageUrl(item.product_image);
          const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);
          const totalNum = typeof item.total === 'number' ? item.total : parseFloat(item.total || 0);

          return (
            <div 
              key={item.id} 
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-primary-50/20 transition-colors"
            >
              {/* Product Info */}
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-primary-50/50 border border-primary-100 flex-shrink-0">
                  <img 
                    src={imgSrc}
                    alt={item.product_name || 'Wholesale Lot'}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                  />
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider block mb-0.5">
                    Direct Mill Lot
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                    {item.product_name}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {item.product_sku && (
                      <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        SKU: {item.product_sku}
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400">
                      ₹{priceNum.toLocaleString()} / unit
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity & Line Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <div className="text-left sm:text-center">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                    Quantity
                  </span>
                  <span className="inline-block text-xs font-bold text-primary-800 bg-primary-50 border border-primary-200 px-2.5 py-0.5 rounded-lg mt-0.5">
                    {item.quantity} units
                  </span>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                    Lot Total
                  </span>
                  <span className="text-base sm:text-lg font-black text-primary-700">
                    ₹{totalNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
