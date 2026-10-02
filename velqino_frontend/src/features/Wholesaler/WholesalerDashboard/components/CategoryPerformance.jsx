"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, TrendingUp, ChevronRight } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/CategoryPerformance.scss';

// Curated brand theme palette using Tailwind design tokens
const categoryPalette = [
  { stroke: '#c27847', bg: 'bg-primary-500', lightBg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200' },
  { stroke: '#10b981', bg: 'bg-emerald-500', lightBg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { stroke: '#f59e0b', bg: 'bg-amber-500', lightBg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { stroke: '#6366f1', bg: 'bg-indigo-500', lightBg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  { stroke: '#06b6d4', bg: 'bg-cyan-500', lightBg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  { stroke: '#ec4899', bg: 'bg-pink-500', lightBg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
];

export default function CategoryPerformance({ data, isLoading }) {
  const router = useRouter();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  const categories = Array.isArray(data) ? data : (data?.data || []);
  const totalRevenue = categories.reduce((sum, cat) => sum + (Number(cat.total_revenue) || 0), 0);
  
  const categoriesWithPercentage = categories.map((cat, idx) => ({
    ...cat,
    percentage: totalRevenue > 0 ? ((Number(cat.total_revenue) || 0) / totalRevenue) * 100 : 0,
    colorTheme: categoryPalette[idx % categoryPalette.length]
  }));

  if (isLoading && categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="w-36 h-36 rounded-full bg-slate-100 mx-auto" />
          <div className="space-y-2">
            <div className="h-10 bg-slate-100 rounded-xl" />
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
              <PieChart size={20} />
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-bold text-slate-900">Category Performance</h3>
              <p className="text-xs text-slate-500">Distribution by sales revenue</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3 text-slate-400">
              <PieChart size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">No category data yet</h4>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              Complete and dispatch orders to see category performance analytics.
            </p>
            <button
              type="button"
              onClick={() => router.push('/wholesaler/analyticsreports')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-50 text-primary-700 border border-primary-200/80 rounded-xl text-xs font-semibold hover:bg-primary-100 transition-all shadow-2xs"
            >
              <span>Full Analytics</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pre-calculate SVG donut segments reliably inside render scope
  const circumference = 2 * Math.PI * 40; // r=40
  let cumulativePercent = 0;
  const segments = categoriesWithPercentage.slice(0, 6).map((category, index) => {
    const percentage = category.percentage;
    const dashArray = (percentage / 100) * circumference;
    const offset = circumference - (cumulativePercent / 100) * circumference;
    cumulativePercent += percentage;
    return {
      category,
      index,
      percentage,
      dashArray,
      offset,
      colorTheme: category.colorTheme
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 lg:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
              <PieChart size={20} />
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-bold text-slate-900">Category Performance</h3>
              <p className="text-xs text-slate-500">Revenue contribution by category</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push('/wholesaler/analyticsreports')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-200/80 rounded-xl text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-all shadow-2xs group"
          >
            <span>Full Analytics</span>
            <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Content: Clean vertical stack for 4-col laptop view */}
        <div className="flex flex-col items-center gap-5">
          {/* Donut Chart */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex-shrink-0 my-1">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="15"
              />
              {segments.map((seg) => (
                <circle
                  key={seg.index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={seg.colorTheme.stroke}
                  strokeWidth={hoveredCategory === seg.index ? "17" : "15"}
                  strokeDasharray={`${seg.dashArray} ${circumference - seg.dashArray}`}
                  strokeDashoffset={seg.offset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(seg.index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-lg sm:text-xl font-bold text-slate-900">
                ₹{totalRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">total revenue</span>
            </div>
          </div>

          {/* Categories List: Full width, spacious breakdown without any text truncation */}
          <div className="w-full space-y-2">
            {categoriesWithPercentage.map((category, index) => {
              const theme = category.colorTheme;
              const isHovered = hoveredCategory === index;

              return (
                <div
                  key={category.category || index}
                  className={`p-2.5 rounded-xl border transition-all duration-200 ${
                    isHovered 
                      ? 'bg-slate-50 border-primary-200 shadow-2xs' 
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                  onMouseEnter={() => setHoveredCategory(index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${theme.bg}`} />
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {category.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {category.percentage.toFixed(1)}%
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${theme.lightBg} ${theme.text} ${theme.border}`}>
                        ₹{Number(category.total_revenue || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${theme.bg}`}
                      style={{ width: `${Math.max(category.percentage, 4)}%` }}
                    />
                  </div>
                  
                  {/* Units Sold Info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{category.product_count || 1} product active</span>
                    <span className="font-medium text-slate-600">
                      {category.total_sold} units sold
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-primary-600 font-semibold truncate">
          <TrendingUp size={14} className="flex-shrink-0" />
          <span className="truncate">
            Top: {categoriesWithPercentage[0]?.category || 'N/A'} ({categoriesWithPercentage[0]?.percentage.toFixed(1) || 0}%)
          </span>
        </div>
        <button
          type="button"
          onClick={() => router.push('/wholesaler/analyticsreports')}
          className="flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 transition-all hover:gap-1.5 flex-shrink-0"
        >
          <span>Category Reports</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}