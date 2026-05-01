"use client";

import React from 'react';

export default function CategoryChart({ data }) {
  const categories = data?.data?.categories || [];
  const maxValue = Math.max(...categories.map(c => c.revenue || 0), 1);
  
  if (categories.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">No category data available</p>
      </div>
    );
  }
  
  return (
    <div className="chart-container">
      <div className="chart-body h-64 relative">
        <div className="absolute inset-0 flex flex-col justify-around px-4">
          {categories.slice(0, 5).map((category, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="text-sm text-gray-600 w-28 truncate">{category.name}</span>
              <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-info-500 rounded-full transition-all duration-500"
                  style={{ width: `${(category.revenue / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {category.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}