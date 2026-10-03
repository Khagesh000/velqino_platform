'use client';

import React, { useState } from 'react';
import { Filter, Calendar, X, Check, RotateCcw } from '../../../../../utils/icons';

export default function StockAlertsFilter({ onApply, onClose, isOpen }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [alertType, setAlertType] = useState('all');

  const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    years.push({ value: i.toString(), label: i.toString() });
  }

  const handleApply = () => {
    onApply({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      month: selectedMonth || undefined,
      year: selectedYear || undefined,
      alertType
    });
    onClose();
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedMonth('');
    setSelectedYear('');
    setAlertType('all');
    onApply({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <Filter size={16} />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">Filter Stock Alerts</h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Alert Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Alert Severity</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-gray-50 p-1 rounded-2xl border border-gray-200 text-xs">
              <button
                type="button"
                onClick={() => setAlertType('all')}
                className={`py-1.5 font-bold rounded-xl transition-all ${
                  alertType === 'all' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setAlertType('critical')}
                className={`py-1.5 font-bold rounded-xl transition-all ${
                  alertType === 'critical' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                Critical
              </button>
              <button
                type="button"
                onClick={() => setAlertType('warning')}
                className={`py-1.5 font-bold rounded-xl transition-all ${
                  alertType === 'warning' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                Warning
              </button>
              <button
                type="button"
                onClick={() => setAlertType('out')}
                className={`py-1.5 font-bold rounded-xl transition-all ${
                  alertType === 'out' ? 'bg-gray-800 text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Out
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Date Span</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">To</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Month / Year */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Month & Year Filter</label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              >
                <option value="">Any Month</option>
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              >
                <option value="">Any Year</option>
                {years.map(y => (
                  <option key={y.value} value={y.value}>{y.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2.5 p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50">
          <button 
            type="button"
            onClick={handleReset} 
            className="flex-1 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
          <button 
            type="button"
            onClick={handleApply} 
            className="flex-1 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Check size={14} />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}