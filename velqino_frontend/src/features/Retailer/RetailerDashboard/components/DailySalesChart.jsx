"use client";

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  Zap, 
  ArrowUpRight,
  BarChart3
} from '../../../../utils/icons';

export default function DailySalesChart({ data = [], target = 3571, isLoading }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeView, setActiveView] = useState('hourly'); // 'hourly' | 'summary'

  // Normalize data whether it's an Array or an Object with keys
  const chartItems = useMemo(() => {
    let rawList = [];
    if (Array.isArray(data)) {
      rawList = data;
    } else if (data && typeof data === 'object') {
      rawList = data.today || data.hourly || data.dailySales || [];
    }

    if (!rawList || rawList.length === 0) {
      // Graceful default 12-hour slots if empty
      return [
        { hour: "10 AM", amount: 0, transactions: 0 },
        { hour: "11 AM", amount: 0, transactions: 0 },
        { hour: "12 PM", amount: 0, transactions: 0 },
        { hour: "1 PM", amount: 0, transactions: 0 },
        { hour: "2 PM", amount: 0, transactions: 0 },
        { hour: "3 PM", amount: 0, transactions: 0 },
        { hour: "4 PM", amount: 0, transactions: 0 },
        { hour: "5 PM", amount: 0, transactions: 0 },
        { hour: "6 PM", amount: 0, transactions: 0 },
        { hour: "7 PM", amount: 0, transactions: 0 },
        { hour: "8 PM", amount: 0, transactions: 0 },
        { hour: "9 PM", amount: 0, transactions: 0 }
      ];
    }

    return rawList.map((item) => ({
      hour: item.hour || '',
      amount: Number(item.amount ?? item.sales ?? item.value ?? 0),
      transactions: Number(item.transactions ?? item.orders ?? 0)
    }));
  }, [data]);

  const totalSales = useMemo(() => {
    return chartItems.reduce((acc, item) => acc + item.amount, 0);
  }, [chartItems]);

  const totalTransactions = useMemo(() => {
    return chartItems.reduce((acc, item) => acc + item.transactions, 0);
  }, [chartItems]);

  const maxAmount = useMemo(() => {
    const highest = Math.max(...chartItems.map((item) => item.amount), 0);
    return Math.max(highest, 1000); // Minimum scale baseline
  }, [chartItems]);

  const peakItem = useMemo(() => {
    return chartItems.reduce((max, item) => item.amount > max.amount ? item : max, chartItems[0] || { hour: '10 AM', amount: 0 });
  }, [chartItems]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-56 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <BarChart3 size={18} />
            </span>
            <h3 className="text-base font-bold text-gray-900">
              Daily Sales Trend
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time hourly register turnover across store operating hours
          </p>
        </div>

        {/* Quick KPI Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-left">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Today's Total</span>
            <span className="text-xs sm:text-sm font-extrabold text-gray-900">
              ₹{totalSales.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-primary-50 border border-primary-100 text-left">
            <span className="text-[10px] uppercase font-bold text-primary-600 block">Peak Hour</span>
            <span className="text-xs sm:text-sm font-extrabold text-primary-800">
              {peakItem?.amount > 0 ? `${peakItem.hour} (₹${peakItem.amount.toLocaleString('en-IN')})` : 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="relative pt-6 pb-2">
        {/* Target Dashed Line */}
        {target > 0 && (
          <div 
            className="absolute left-0 right-0 border-t border-dashed border-accent-400/80 pointer-events-none z-10 flex items-center justify-end pr-2"
            style={{ top: `${Math.max(15, Math.min(85, 100 - (target / (maxAmount * 1.2)) * 100))}%` }}
          >
            <span className="text-[10px] font-bold text-accent-700 bg-accent-50/90 border border-accent-200 px-1.5 py-0.5 rounded shadow-2xs -translate-y-1/2">
              Target ₹{Math.round(target).toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Visual Chart Bars */}
        <div className="flex items-end justify-between gap-1.5 sm:gap-2.5 h-56 w-full overflow-x-auto pb-6 pt-2">
          {chartItems.map((item, index) => {
            const heightPercent = maxAmount > 0 ? Math.max(item.amount > 0 ? 8 : 3, (item.amount / maxAmount) * 100) : 3;
            const isHovered = hoveredIndex === index;
            const isPeak = item.amount > 0 && item.amount === peakItem.amount;

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center relative h-full min-w-[28px] sm:min-w-[36px] group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating Interactive Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded-xl shadow-xl p-2.5 z-30 pointer-events-none whitespace-nowrap animate-fadeIn">
                    <p className="font-bold text-gray-200">{item.hour}</p>
                    <p className="text-primary-300 font-extrabold text-sm mt-0.5">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {item.transactions} transactions
                    </p>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                )}

                {/* Bar Column */}
                <div className="w-full flex-1 flex items-end justify-center">
                  <div 
                    className={`
                      w-full max-w-[32px] rounded-t-lg transition-all duration-300 relative
                      ${item.amount > 0 
                        ? (isPeak 
                            ? 'bg-gradient-to-t from-primary-600 via-primary-500 to-accent-400 shadow-sm' 
                            : 'bg-gradient-to-t from-primary-600 to-primary-400 hover:from-primary-700 hover:to-primary-500'
                          )
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                      ${isHovered ? 'scale-105 shadow-md' : ''}
                    `}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {isPeak && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-black text-accent-700 bg-accent-100 px-1 rounded">
                        TOP
                      </span>
                    )}
                  </div>
                </div>

                {/* X-axis Label */}
                <span className={`
                  text-[10px] sm:text-[11px] font-semibold mt-2.5 whitespace-nowrap transition-colors
                  ${isHovered ? 'text-primary-700 font-bold' : 'text-gray-400'}
                `}>
                  {item.hour.replace(' ', '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
            <span className="font-medium">Hourly Sales Volume</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-500" />
            <span className="font-medium">Daily Target</span>
          </div>
        </div>

        <span className="text-[11px] text-gray-400 font-medium">
          Total checkouts today: <strong className="text-gray-700 font-bold">{totalTransactions}</strong>
        </span>
      </div>
    </div>
  );
}
