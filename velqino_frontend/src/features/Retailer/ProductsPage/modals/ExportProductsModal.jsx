'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Calendar, FileSpreadsheet, FileText, CheckCircle, AlertCircle, Package, Filter } from '../../../../utils/icons';
import { toast } from 'react-toastify';

export default function ExportProductsModal({ onClose, onExport, isOpen, totalProducts = 0 }) {
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [includeFields, setIncludeFields] = useState({
    id: true,
    name: true,
    sku: true,
    price: true,
    cost: true,
    stock: true,
    category: true,
    brand: true,
    description: false,
    created_at: true,
    updated_at: false,
    image_url: true,
    sizes: true
  });

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    years.push({ value: i.toString(), label: i.toString() });
  }

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setExportFormat('csv');
      setDateRange('all');
      setStartDate('');
      setEndDate('');
      setSelectedMonth('');
      setSelectedYear('');
      setExporting(false);
    }
  }, [isOpen]);

  const getDateFilterParams = () => {
    if (dateRange === 'all') return {};
    if (dateRange === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return { start_date: today, end_date: today };
    }
    if (dateRange === 'this_week') {
      const now = new Date();
      const start = new Date(now.setDate(now.getDate() - now.getDay()));
      const end = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      return { start_date: start.toISOString().split('T')[0], end_date: end.toISOString().split('T')[0] };
    }
    if (dateRange === 'this_month') {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start_date: start.toISOString().split('T')[0], end_date: end.toISOString().split('T')[0] };
    }
    if (dateRange === 'custom' && startDate && endDate) {
      return { start_date: startDate, end_date: endDate };
    }
    if (dateRange === 'month_year' && selectedMonth && selectedYear) {
      return { month: selectedMonth, year: selectedYear };
    }
    return {};
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = {
        format: exportFormat,
        ...getDateFilterParams(),
        fields: Object.keys(includeFields).filter(field => includeFields[field]).join(',')
      };
      
      if (onExport) {
        await onExport(params);
      }
      
      toast.success(`Products exported successfully as ${exportFormat.toUpperCase()}`);
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      toast.error('Failed to export products');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 w-full max-w-md pt-[56px] pb-[70px] sm:pt-20 sm:pb-16">
        <div className="h-full bg-white rounded-l-2xl shadow-xl overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Download size={20} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Export Products</h2>
                  <p className="text-sm text-gray-500">Download your product data</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Total Products Info */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Products:</span>
                <span className="text-lg font-bold text-primary-600">{totalProducts}</span>
              </div>
            </div>

            {/* Export Format */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setExportFormat('csv')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    exportFormat === 'csv'
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-primary-400'
                  }`}
                >
                  <FileSpreadsheet size={16} />
                  CSV
                </button>
                <button
                  onClick={() => setExportFormat('excel')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    exportFormat === 'excel'
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-primary-400'
                  }`}
                >
                  <FileText size={16} />
                  Excel
                </button>
              </div>
            </div>

            {/* Date Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  Date Filter
                </div>
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 mb-3"
              >
                <option value="all">All Products (No date filter)</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="custom">Custom Range</option>
                <option value="month_year">Specific Month/Year</option>
              </select>

              {/* Custom Date Range */}
              {dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              )}

              {/* Month/Year Filter */}
              {dateRange === 'month_year' && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    >
                      <option value="">Select Month</option>
                      {months.map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    >
                      <option value="">Select Year</option>
                      {years.map(year => (
                        <option key={year.value} value={year.value}>{year.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Fields to Include */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fields to Include
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields.id}
                    onChange={(e) => setIncludeFields({...includeFields, id: e.target.checked})}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Product ID
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields.name}
                    onChange={(e) => setIncludeFields({...includeFields, name: e.target.checked})}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Name
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields.sku}
                    onChange={(e) => setIncludeFields({...includeFields, sku: e.target.checked})}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  SKU
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields.price}
                    onChange={(e) => setIncludeFields({...includeFields, price: e.target.checked})}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Price
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields.cost}
                    onChange={(e) => setIncludeFields({...includeFields, cost: e.target.checked})}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Cost
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields.stock}
                    onChange={(e) => setIncludeFields({...includeFields, stock: e.target.checked})}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Stock
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields.category}
                    onChange={(e) => setIncludeFields({...includeFields, category: e.target.checked})}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Category
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields.brand}
                    onChange={(e) => setIncludeFields({...includeFields, brand: e.target.checked})}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Brand
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields.image_url}
                    onChange={(e) => setIncludeFields({...includeFields, image_url: e.target.checked})}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Image URL
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields.sizes}
                    onChange={(e) => setIncludeFields({...includeFields, sizes: e.target.checked})}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Sizes
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields.created_at}
                    onChange={(e) => setIncludeFields({...includeFields, created_at: e.target.checked})}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Created Date
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields.description}
                    onChange={(e) => setIncludeFields({...includeFields, description: e.target.checked})}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Description
                </label>
              </div>
            </div>

            {/* Note */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={14} className="text-gray-400 mt-0.5" />
                <p className="text-xs text-gray-500">
                  Export will include only products matching your date filter. Maximum 10,000 products per export.
                </p>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={exporting || (dateRange === 'custom' && (!startDate || !endDate)) || (dateRange === 'month_year' && (!selectedMonth || !selectedYear))}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Export Products
                </>
              )}
            </button>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}