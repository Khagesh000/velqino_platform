"use client";

import React, { useState } from 'react';
import { PieChart as PieIcon, CheckCircle, Clock, AlertCircle, Truck, Package } from '@/utils/icons';

export default function OrdersPieChart({ data }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const statusList = Array.isArray(data) ? data : [];

  const statusConfig = {
    delivered: { label: 'Delivered', color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
    pending: { label: 'Pending', color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
    processing: { label: 'Processing', color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-700', icon: Package },
    shipped: { label: 'Shipped', color: '#8b5cf6', bg: 'bg-purple-50', text: 'text-purple-700', icon: Truck },
    cancelled: { label: 'Cancelled', color: '#f43f5e', bg: 'bg-rose-50', text: 'text-rose-700', icon: AlertCircle }
  };

  const orderStatusData = statusList.map(item => {
    const key = (item.status || '').toLowerCase();
    const config = statusConfig[key] || {
      label: item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Unknown',
      color: '#64748b',
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      icon: Package
    };
    return {
      status: key,
      label: config.label,
      value: Number(item.count) || 0,
      color: config.color,
      bg: config.bg,
      text: config.text,
      icon: config.icon
    };
  }).filter(item => item.value > 0);

  const total = orderStatusData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-3">
          <PieIcon size={24} />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Orders in Distribution</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          No order status records were found for this selected period. New customer purchases will reflect here immediately.
        </p>
      </div>
    );
  }

  let currentAngle = 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="chart-container py-2">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 min-h-[260px]">
        {/* Donut Visualizer */}
        <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="transform -rotate-90 w-48 h-48 filter drop-shadow-xs">
            {/* Background track circle */}
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="12" />
            
            {orderStatusData.map((item, idx) => {
              const percent = item.value / total;
              const dashArray = percent * circumference;
              const offset = -currentAngle * circumference;
              currentAngle += percent;
              const isHovered = activeIdx === idx;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={isHovered ? 15 : 12}
                  strokeDasharray={`${dashArray} ${circumference}`}
                  strokeDashoffset={offset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseLeave={() => setActiveIdx(null)}
                />
              );
            })}
          </svg>
          
          {/* Donut Center Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeIdx !== null ? orderStatusData[activeIdx].value : total}
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              {activeIdx !== null ? orderStatusData[activeIdx].label : 'Total Orders'}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {activeIdx !== null 
                ? `${((orderStatusData[activeIdx].value / total) * 100).toFixed(0)}% of total` 
                : '100% tracked'}
            </span>
          </div>
        </div>

        {/* Legend Cards */}
        <div className="flex-1 w-full max-w-sm space-y-2.5">
          {orderStatusData.map((item, idx) => {
            const Icon = item.icon;
            const percent = ((item.value / total) * 100).toFixed(1);
            const isHovered = activeIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                className={`
                  flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer
                  ${isHovered 
                    ? 'border-slate-400 bg-slate-50/80 shadow-xs translate-x-1' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span 
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-xs" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} className={item.text} />
                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {percent}%
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 min-w-[20px] text-right">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}