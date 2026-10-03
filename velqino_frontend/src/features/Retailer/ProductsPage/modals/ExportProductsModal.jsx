'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Calendar, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  Filter,
  Sparkles
} from '../../../../utils/icons';
import { useExportProductsMutation } from '@/redux/retailer/slices/retailerProductsSlice';
import { toast } from 'react-toastify';

export default function ExportProductsModal({ onClose, onExport, isOpen, totalProducts = 0 }) {
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [exportProducts] = useExportProductsMutation();

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
    sizes: true
  });

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

  const handleExport = async (e) => {
    e?.preventDefault();
    setExporting(true);
    try {
      const params = {
        format: exportFormat,
        ...getDateFilterParams(),
        fields: Object.keys(includeFields).filter(field => includeFields[field]).join(',')
      };

      if (onExport) {
        await onExport(params);
        onClose();
      } else {
        await exportProducts(params).unwrap();
        toast.success(`Catalog exported in ${exportFormat.toUpperCase()} format`);
        onClose();
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to export catalog');
    } finally {
      setExporting(false);
    }
  };

  const toggleField = (field) => {
    setIncludeFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-200/60 shadow-2xs">
              <Download size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">Export Catalog Data</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                  {totalProducts} Items
                </span>
              </div>
              <p className="text-xs text-gray-500">Generate spreadsheet reports for accounting or audit</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Format Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Export Format</label>
            <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-200 text-xs">
              {[
                { id: 'csv', label: 'CSV Spreadsheet' },
                { id: 'xlsx', label: 'Excel (.xlsx)' },
                { id: 'pdf', label: 'PDF Report' }
              ].map(fmt => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setExportFormat(fmt.id)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    exportFormat === fmt.id 
                      ? 'bg-white text-primary-900 shadow-2xs border border-gray-200/60' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
            >
              <option value="all">Entire Catalog (All Time)</option>
              <option value="today">Today Only</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="custom">Custom Date Range</option>
              <option value="month_year">Specific Month & Year</option>
            </select>
          </div>

          {/* Custom Date Inputs */}
          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3 animate-fadeIn">
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
          )}

          {/* Month / Year Inputs */}
          {dateRange === 'month_year' && (
            <div className="grid grid-cols-2 gap-3 animate-fadeIn">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              >
                <option value="">Month...</option>
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              >
                <option value="">Year...</option>
                {years.map(y => (
                  <option key={y.value} value={y.value}>{y.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Export Columns Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Include Columns</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-gray-50/70 border border-gray-100 rounded-2xl">
              {Object.keys(includeFields).map(field => (
                <label key={field} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={includeFields[field]}
                    onChange={() => toggleField(field)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="capitalize">{field.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
          <button 
            type="button"
            onClick={onClose} 
            className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="px-6 py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-2xs flex items-center gap-2 disabled:opacity-40 active:scale-95"
          >
            {exporting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Export...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Export {exportFormat.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}