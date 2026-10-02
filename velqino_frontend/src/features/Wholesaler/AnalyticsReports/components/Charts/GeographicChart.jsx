"use client";

import React from 'react';
import { MapPin } from '@/utils/icons';

export default function GeographicChart({ data }) {
  const cities = Array.isArray(data) ? data : [];
  
  if (cities.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 shadow-xs">
          <MapPin size={24} />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Regional Sales Data</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
          Geographic sales by shipping city will appear here as orders with designated delivery destinations are processed.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...cities.map(c => Number(c.total) || 0), 1);
  
  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>Delivery City / Region</span>
        <span>Sales Total</span>
      </div>

      <div className="space-y-3">
        {cities.slice(0, 6).map((city, i) => {
          const total = Number(city.total) || 0;
          const percent = Math.round((total / maxValue) * 100);

          return (
            <div key={i} className="group p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-indigo-500" />
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {city.shipping_city || 'City Unknown'}
                  </span>
                </div>
                
                <span className="text-sm font-extrabold text-slate-900">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500 group-hover:bg-indigo-600"
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
