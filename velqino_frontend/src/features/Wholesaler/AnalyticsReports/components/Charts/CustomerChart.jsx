"use client";

import React from 'react';

export default function CustomerChart({ data, dateRange, customDate }) {
  const statsData = data?.data || {};
  const totalCustomers = statsData.total_customers || 0;
  
  // Mock weekly customer growth data (since backend doesn't have this yet)
  // This can be replaced with real API data later
  const weeklyData = [
    { week: 'Week 1', new: Math.floor(totalCustomers * 0.2), total: Math.floor(totalCustomers * 0.2) },
    { week: 'Week 2', new: Math.floor(totalCustomers * 0.25), total: Math.floor(totalCustomers * 0.45) },
    { week: 'Week 3', new: Math.floor(totalCustomers * 0.3), total: Math.floor(totalCustomers * 0.75) },
    { week: 'Week 4', new: Math.floor(totalCustomers * 0.25), total: totalCustomers }
  ];
  
  if (totalCustomers === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">No customer data available</p>
      </div>
    );
  }
  
  const maxValue = Math.max(...weeklyData.map(w => w.total), 1);
  
  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-primary-500"></span>
            <span className="text-xs text-gray-500">Total Customers</span>
          </div>
        </div>
      </div>
      <div className="chart-body h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
          <line x1="40" y1="20" x2="40" y2="180" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="40" y1="100" x2="460" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
          <line x1="40" y1="180" x2="460" y2="180" stroke="#e5e7eb" strokeWidth="1" />
          
          {/* Area under the line */}
          <polygon
            points={weeklyData.map((w, i) => {
              const x = 40 + (i * (420 / (weeklyData.length - 1)));
              const y = 180 - (w.total / maxValue) * 140;
              return `${x},${y}`;
            }).join(' ') + " 460,180 40,180"}
            fill="#3b82f6"
            fillOpacity="0.1"
            className="chart-area"
          />
          
          {/* Line */}
          <polyline
            points={weeklyData.map((w, i) => {
              const x = 40 + (i * (420 / (weeklyData.length - 1)));
              const y = 180 - (w.total / maxValue) * 140;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            className="chart-line"
          />
          
          {/* Data points */}
          {weeklyData.map((w, i) => {
            const x = 40 + (i * (420 / (weeklyData.length - 1)));
            const y = 180 - (w.total / maxValue) * 140;
            return <circle key={i} cx={x} cy={y} r="5" fill="#3b82f6" className="chart-point" />;
          })}
        </svg>
        
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 text-xs text-gray-500">
          {weeklyData.map((w, i) => (
            <span key={i}>{w.week}</span>
          ))}
        </div>
        
        <div className="absolute top-0 right-4 mt-2">
          <div className="bg-primary-100 rounded-lg px-3 py-1">
            <span className="text-sm font-semibold text-primary-600">Total: {totalCustomers}</span>
          </div>
        </div>
      </div>
    </div>
  );
}