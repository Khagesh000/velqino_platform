"use client";

import React from 'react';
import { BarChart3, Grid } from '@/utils/icons';

export default function CategoryChart({ data }) {
  const categories = Array.isArray(data) ? data : [];
  
  if (categories.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3 shadow-xs">
          <Grid size={24} />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Category Breakdown Available</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
          Category revenue shares will show here as orders spanning different wholesale categories (e.g. Shirts, Pants, Sarees) are completed.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...categories.map(c => Number(c.total_revenue) || 0), 1);
  const totalRevenue = categories.reduce((sum, c) => sum + (Number(c.total_revenue) || 0), 0);
  
  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>Category Name</span>
        <span>Revenue Share</span>
      </div>

      <div className="space-y-3">
        {categories.slice(0, 6).map((cat, idx) => {
          const rev = Number(cat.total_revenue) || 0;
          const share = totalRevenue > 0 ? ((rev / totalRevenue) * 100).toFixed(1) : 0;
          const barWidth = Math.round((rev / maxValue) * 100);

          return (
            <div key={idx} className="group p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {cat.category || cat.name || 'General Category'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {share}%
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    ₹{rev.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500 group-hover:bg-blue-600"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
