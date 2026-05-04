"use client";

import React from 'react';

export default function OrdersPieChart({ data }) {
  const statsData = data?.data || {};
  
  const orderStatusData = [
    { label: 'Pending', value: statsData.pending_orders || 0, color: '#f59e0b' },
    { label: 'Completed', value: statsData.completed_orders || 0, color: '#10b981' }
  ];
  
  const total = orderStatusData.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">No order data available</p>
      </div>
    );
  }
  
  let currentAngle = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  
  return (
    <div className="chart-container">
      <div className="chart-body flex items-center justify-center gap-8 h-64">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="transform -rotate-90 w-40 h-40">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="15" />
            {orderStatusData.map((item, idx) => {
              if (item.value === 0) return null;
              const percent = item.value / total;
              const dashArray = percent * circumference;
              const offset = -currentAngle * circumference;
              currentAngle += percent;
              return (
                <circle
                  key={idx}
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="15"
                  strokeDasharray={`${dashArray} ${circumference}`}
                  strokeDashoffset={offset}
                  className="chart-segment transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{total}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {orderStatusData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}