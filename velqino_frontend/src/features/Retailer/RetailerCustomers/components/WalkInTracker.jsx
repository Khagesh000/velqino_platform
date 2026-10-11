"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  BarChart3, 
  Calendar,
  Sparkles
} from '../../../../utils/icons';

export default function WalkInTracker({ footfall = {}, customers = [] }) {
  const [mounted, setMounted] = useState(false);
  const [selectedView, setSelectedView] = useState('weekly'); // 'weekly' | 'hourly'

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const defaultWeekly = [
    { day: 'Mon', new: 4, returning: 8, total: 12 },
    { day: 'Tue', new: 5, returning: 10, total: 15 },
    { day: 'Wed', new: 7, returning: 11, total: 18 },
    { day: 'Thu', new: 6, returning: 13, total: 19 },
    { day: 'Fri', new: 9, returning: 16, total: 25 },
    { day: 'Sat', new: 14, returning: 22, total: 36 },
    { day: 'Sun', new: 11, returning: 17, total: 28 },
  ];

  const defaultHourly = [
    { hour: '10 AM', count: 5 },
    { hour: '11 AM', count: 12 },
    { hour: '12 PM', count: 18 },
    { hour: '1 PM', count: 14 },
    { hour: '2 PM', count: 10 },
    { hour: '3 PM', count: 15 },
    { hour: '4 PM', count: 20 },
    { hour: '5 PM', count: 24 },
    { hour: '6 PM', count: 19 },
    { hour: '7 PM', count: 11 },
  ];

  const weeklyData = (footfall?.daily && footfall.daily.length > 0) ? footfall.daily : defaultWeekly;
  const hourlyData = (footfall?.hourly && footfall.hourly.length > 0) ? footfall.hourly : defaultHourly;

  const totalVisitors7d = weeklyData.reduce((sum, d) => sum + (d.total || 0), 0);
  const maxWeekly = Math.max(...weeklyData.map(d => d.total || 1), 1);
  const maxHourly = Math.max(...hourlyData.map(d => d.count || 1), 1);

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between h-full flex-1">
      <div>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Footfall & Store Activity</h3>
              <p className="text-[11px] text-gray-400">Buyer visit patterns and peak hour distribution</p>
            </div>
          </div>

          {/* Toggle pill */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setSelectedView('weekly')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedView === 'weekly' 
                  ? 'bg-white text-primary-600 shadow-2xs' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setSelectedView('hourly')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedView === 'hourly' 
                  ? 'bg-white text-primary-600 shadow-2xs' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Hourly
            </button>
          </div>
        </div>

        {/* Quick Footfall Metric */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase">Recent Store Footfall</p>
            <p className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-0.5">
              {totalVisitors7d} Visitors
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <TrendingUp size={12} /> Active Store Traffic
          </span>
        </div>

        {/* Visual Chart Bars */}
        <div className="p-4 sm:p-5">
          {selectedView === 'weekly' ? (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-4">Traffic by Day of the Week</p>
              <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4">
                {weeklyData.map((d, i) => {
                  const pct = Math.max(12, Math.round((d.total / maxWeekly) * 100));
                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.total}
                      </span>
                      <div 
                        className="w-full max-w-[28px] rounded-xl bg-gradient-to-t from-primary-600 to-primary-400 transition-all group-hover:brightness-110"
                        style={{ height: `${pct}%` }}
                      />
                      <span className="text-[11px] font-bold text-gray-500 mt-1">
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-4">Store Traffic by Hour (10 AM - 7 PM)</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {hourlyData.map((h, idx) => {
                  const pct = Math.max(8, Math.round((h.count / maxHourly) * 100));
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <span className="w-14 text-gray-500 font-mono text-[11px] shrink-0">{h.hour}</span>
                      <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-primary-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-900 w-8 text-right text-[11px]">{h.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
