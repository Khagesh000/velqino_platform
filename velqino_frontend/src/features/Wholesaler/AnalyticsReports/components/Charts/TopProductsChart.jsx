"use client";

import React from 'react';
import { Package, TrendingUp } from '@/utils/icons';

export default function TopProductsChart({ data }) {
  const products = Array.isArray(data) ? data : [];
  
  if (products.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3 shadow-xs">
          <Package size={24} />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Product Sales Recorded</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
          Best-selling SKUs and revenue contribution will populate here automatically as retailer purchase orders are completed.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...products.map(p => Number(p.total_sold) || 0), 1);
  
  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>Product Details</span>
        <span>Units Sold</span>
      </div>

      <div className="space-y-3">
        {products.slice(0, 5).map((product, i) => {
          const sold = Number(product.total_sold) || 0;
          const revenue = Number(product.total_revenue) || 0;
          const percent = Math.round((sold / maxValue) * 100);

          return (
            <div key={i} className="group p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                    #{i + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                    {product.name || 'Unnamed Product'}
                  </span>
                  {product.sku && (
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                      {product.sku}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {revenue > 0 && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ₹{revenue.toLocaleString()}
                    </span>
                  )}
                  <span className="text-sm font-extrabold text-slate-900">
                    {sold.toLocaleString()} pcs
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500 group-hover:bg-amber-600"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}