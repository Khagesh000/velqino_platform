'use client';

import React, { useState } from 'react';
import { Filter, Calendar, X, Check } from '../../../../../utils/icons';

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
      startDate,
      endDate,
      month: selectedMonth,
      year: selectedYear,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Filter Stock Alerts</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-all">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Alert Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Alert Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setAlertType('all')}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${alertType === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                All
              </button>
              <button
                onClick={() => setAlertType('critical')}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${alertType === 'critical' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Critical
              </button>
              <button
                onClick={() => setAlertType('warning')}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${alertType === 'warning' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Warning
              </button>
              <button
                onClick={() => setAlertType('out')}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${alertType === 'out' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Out of Stock
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-500">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Month & Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="">All Months</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-gray-100">
          <button
            onClick={handleReset}
            className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-3 py-2 text-xs font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-1"
          >
            <Check size={14} />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}