"use client";

import React, { useState } from 'react';
import { TrendingUp, Calendar, AlertCircle } from '@/utils/icons';

export default function RevenueChart({ data, stats = {}, dateRange }) {
  const [granularity, setGranularity] = useState('daily');
  const [hoverIdx, setHoverIdx] = useState(null);

  const series = data?.[granularity] || [];
  const hasData = Array.isArray(series) && series.length > 0;

  const totalRevenue = Number(stats?.total_revenue) || 0;

  const formatCurrency = (v) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  if (!hasData) {
    return (
      <div className="h-72 relative flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 overflow-hidden">
        {/* Subtle background graph silhouette watermark */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-end">
          <svg className="w-full h-40" viewBox="0 0 500 100" preserveAspectRatio="none">
            <polyline
              points="0,80 50,70 100,85 150,60 200,65 250,40 300,55 350,30 400,45 450,20 500,30"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-md flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3 shadow-xs">
            <TrendingUp size={24} />
          </div>
          <h4 className="text-base font-bold text-slate-800">
            No Revenue Activity in Current Range
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {totalRevenue > 0
              ? `Your account has recorded ₹${totalRevenue.toLocaleString()} in total revenue, but no transactions occurred within the selected timeframe.`
              : 'No revenue transactions have been recorded for this period yet.'}
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <Calendar size={14} className="text-slate-400" />
            <span>Select a wider period (e.g. This Year or All Time) using the date selector above.</span>
          </div>
        </div>
      </div>
    );
  }

  const values = series.map(d => Number(d.revenue) || 0);
  const labels = series.map(d => 
    d.date ? new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : (d.label || '')
  );

  const maxValue = Math.max(...values, 100);
  const denom = values.length - 1 || 1;

  const points = values.map((v, i) => {
    const x = 50 + (i * (400 / denom));
    const y = 170 - (v / maxValue) * 130;
    return { x, y, value: v, label: labels[i] };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${points[0].x},170 ${polylinePoints} ${points[points.length - 1].x},170`;

  return (
    <div className="space-y-3">
      {/* Granularity Switcher */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">Revenue Progression</span>
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
          {['daily', 'weekly', 'monthly'].map((mode) => (
            <button
              key={mode}
              onClick={() => setGranularity(mode)}
              className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                granularity === mode
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 relative bg-slate-50/40 rounded-xl p-2 border border-slate-100">
        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="50" y1="20" x2="470" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
          <line x1="50" y1="95" x2="470" y2="95" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
          <line x1="50" y1="170" x2="470" y2="170" stroke="#e2e8f0" strokeWidth="1" />

          {/* Y-axis Labels */}
          <text x="42" y="24" textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="600">
            {formatCurrency(maxValue)}
          </text>
          <text x="42" y="99" textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="600">
            {formatCurrency(maxValue / 2)}
          </text>
          <text x="42" y="174" textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="600">
            ₹0
          </text>

          {/* Area fill */}
          <polygon points={areaPoints} fill="url(#revenueGradient)" />

          {/* Line */}
          <polyline points={polylinePoints} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoverIdx === i ? 6 : 4}
                fill={hoverIdx === i ? '#1d4ed8' : '#3b82f6'}
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all duration-150 cursor-pointer"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="16"
                fill="transparent"
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoverIdx !== null && (
          <div
            className="absolute bg-slate-900 text-white text-xs rounded-xl py-1.5 px-3 shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 z-20"
            style={{
              left: `${(points[hoverIdx].x / 500) * 100}%`,
              top: `${(points[hoverIdx].y / 200) * 100}%`
            }}
          >
            <div className="font-semibold text-slate-300">{points[hoverIdx].label}</div>
            <div className="font-bold text-white text-sm">{formatCurrency(points[hoverIdx].value)}</div>
            <div className="w-2 h-2 bg-slate-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
          </div>
        )}

        {/* X-axis Labels */}
        <div className="absolute bottom-1 left-12 right-6 flex justify-between text-[10px] font-semibold text-slate-400">
          {labels.map((label, i) => (
            <span key={i} className="truncate">{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}