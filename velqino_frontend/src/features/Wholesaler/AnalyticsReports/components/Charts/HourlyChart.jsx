"use client";

import React from 'react';
import { Clock } from '@/utils/icons';

export default function HourlyChart({ data }) {
  const hourlyData = Array.isArray(data) ? data : [];
  
  if (hourlyData.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 mb-3 shadow-xs">
          <Clock size={24} />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Hourly Purchase Trends</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
          Peak buying hours and daily order rush patterns will populate here as retailer purchasing volume builds up.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...hourlyData.map(h => Number(h.total) || 0), 1);
  
  return (
    <div className="h-64 relative overflow-x-auto py-2">
      <div className="min-w-[600px] h-full flex items-end gap-2 px-4 pb-6">
        {hourlyData.map((hour, i) => {
          const total = Number(hour.total) || 0;
          const barHeight = Math.max(Math.round((total / maxValue) * 160), 4);

          return (
            <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer">
              <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                {total}
              </span>
              <div 
                className="w-full bg-pink-500 group-hover:bg-pink-600 rounded-t-md transition-all duration-300"
                style={{ height: `${barHeight}px` }}
              />
              <span className="text-[10px] font-semibold text-slate-500 mt-2 transform -rotate-45 origin-top-left">
                {hour.hour}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
