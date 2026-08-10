"use client";

import React, { useState } from 'react';

export default function RevenueChart({ data, showComparison }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  const daily = data?.daily || [];
  const values = daily.length > 0 ? daily.map(d => d.revenue) : [0];
  const labels = daily.length > 0 
    ? daily.map(d => new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }))
    : ['No data'];
  const maxValue = Math.max(...values, 1);
  const denom = values.length - 1 || 1;

  const points = values.map((v, i) => {
    const x = 40 + (i * (420 / denom));
    const y = 180 - (v / maxValue) * 140;
    return { x, y, value: v, label: labels[i] };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  const formatCurrency = (v) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="h-64 relative">
      <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
        {/* Axes */}
        <line x1="40" y1="20" x2="40" y2="180" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="40" y1="100" x2="460" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
        <line x1="40" y1="180" x2="460" y2="180" stroke="#e5e7eb" strokeWidth="1" />

        {/* Y-axis scale labels */}
        <text x="35" y="24" textAnchor="end" fontSize="9" fill="#9ca3af">{formatCurrency(maxValue)}</text>
        <text x="35" y="104" textAnchor="end" fontSize="9" fill="#9ca3af">{formatCurrency(maxValue / 2)}</text>
        <text x="35" y="184" textAnchor="end" fontSize="9" fill="#9ca3af">₹0</text>

        <polyline points={polylinePoints} fill="none" stroke="#3b82f6" strokeWidth="3" />

        {points.map((p, i) => (
          <g key={i}>
            {/* Value label above each point */}
            <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="10" fontWeight="600" fill="#1e40af">
              {formatCurrency(p.value)}
            </text>
            {/* Visible dot */}
            <circle cx={p.x} cy={p.y} r={hoverIdx === i ? 7 : 4} fill="#3b82f6" style={{ transition: 'r 0.15s' }} />
            {/* Invisible larger hit-area for hover */}
            <circle
              cx={p.x} cy={p.y} r="14" fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            />
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoverIdx !== null && (
        <div
          className="absolute bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none"
          style={{
            left: `${(points[hoverIdx].x / 500) * 100}%`,
            top: `${(points[hoverIdx].y / 200) * 100}%`,
            transform: 'translate(-50%, -140%)'
          }}
        >
          {points[hoverIdx].label}: {formatCurrency(points[hoverIdx].value)}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 text-xs text-gray-500">
        {labels.map((label, i) => <span key={i}>{label}</span>)}
      </div>
    </div>
  );
}