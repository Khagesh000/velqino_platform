"use client";

import React, { useState, useEffect } from 'react';
import {
  Download,
  FileText,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  PieChart,
  Calendar,
  Filter,
  ChevronDown,
  Printer,
  Mail,
  FileSpreadsheet,
  FilePieChart,
  FileBarChart,
  Check,
  AlertCircle,
  Loader2
} from '../../../../utils/icons';
import { useGetWholesalerStatsQuery, useExportReportMutation } from '@/redux/wholesaler/slices/statsSlice';
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice';
import { useGetOrdersQuery } from '@/redux/wholesaler/slices/ordersSlice';
import '../../../../styles/Wholesaler/AnalyticsReports/ReportsSection.scss';

export default function ReportsSection({ type = 'sales', dateRange, customDate }) {
  const [selectedReport, setSelectedReport] = useState(type);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(['all']);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [exportReport, { isLoading: isExporting }] = useExportReportMutation();
  const [exportSuccess, setExportSuccess] = useState(false);

  // Fetch data based on report type
  const { data: statsData } = useGetWholesalerStatsQuery();
  const { data: productsData } = useGetProductsQuery({ per_page: 100 });
  const { data: ordersData } = useGetOrdersQuery({ per_page: 100 });

  useEffect(() => {
    generateReportData();
  }, [selectedReport, dateRange, customDate, statsData, productsData, ordersData]);

  const generateReportData = () => {
    setIsLoading(true);
    let data = [];
    
    switch(selectedReport) {
      case 'sales':
        const orders = ordersData?.data || [];
        data = orders.map(order => ({
          'Date': new Date(order.created_at).toLocaleDateString(),
          'Order ID': order.order_number,
          'Amount': order.total_amount,
          'Status': order.status,
          'Payment': order.payment_status
        }));
        break;
        
      case 'inventory':
        const products = productsData?.data?.products || [];
        data = products.map(product => ({
          'SKU': product.sku,
          'Product': product.name,
          'Category': product.category_name || '-',
          'Stock': product.stock,
          'Threshold': product.threshold,
          'Status': product.stock <= product.threshold ? 'Low Stock' : 'In Stock'
        }));
        break;
        
      case 'customer':
        const customers = ordersData?.data?.reduce((acc, order) => {
          if (!acc.find(c => c.customer === order.customer_name)) {
            acc.push({ customer: order.customer_name, orders: 1 });
          }
          return acc;
        }, []) || [];
        data = customers.map(c => ({
          'Customer': c.customer,
          'Orders': c.orders,
          'Spent': ordersData?.data?.filter(o => o.customer_name === c.customer).reduce((sum, o) => sum + o.total_amount, 0)
        }));
        break;
        
      default:
        data = [];
    }
    
    setReportData(data);
    setIsLoading(false);
  };

  const reports = [
    { id: 'sales', label: 'Sales Report', icon: DollarSign, color: 'success', description: 'Revenue, orders, AOV, conversion', columns: ['Date', 'Order ID', 'Amount', 'Status', 'Payment'] },
    { id: 'inventory', label: 'Inventory Report', icon: Package, color: 'info', description: 'Stock levels, low stock, out of stock', columns: ['SKU', 'Product', 'Category', 'Stock', 'Threshold', 'Status'] },
    { id: 'customer', label: 'Customer Report', icon: Users, color: 'purple', description: 'New vs returning, top customers', columns: ['Customer', 'Orders', 'Spent'] }
  ];

  const formatOptions = [
    { id: 'pdf', label: 'PDF', icon: FileText },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet },
    { id: 'csv', label: 'CSV', icon: FileBarChart }
  ];

  const handleExport = async () => {
    const params = {
      type: selectedReport,
      format: exportFormat,
      start_date: dateRange === 'custom' ? customDate.start : undefined,
      end_date: dateRange === 'custom' ? customDate.end : undefined
    };
    
    try {
      const blob = await exportReport(params).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedReport}_report.${exportFormat === 'excel' ? 'xlsx' : exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
    setShowExportOptions(false);
  };

  const currentReport = reports.find(r => r.id === selectedReport);
  const Icon = currentReport?.icon || FileText;
  const data = reportData;

  const getStatusColor = (status) => {
    if (status === 'delivered') return 'text-green-600 bg-green-50';
    if (status === 'pending') return 'text-yellow-600 bg-yellow-50';
    if (status === 'cancelled') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="reports-section">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
            <p className="text-sm text-gray-500">Export and analyze your data</p>
          </div>
        </div>

        <div className="relative">
          <button
            className={`px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all flex items-center gap-2 ${
              isExporting ? 'opacity-75 cursor-wait' : ''
            }`}
            onClick={() => !isExporting && setShowExportOptions(!showExportOptions)}
            disabled={isExporting || data.length === 0}
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Exporting...
              </>
            ) : exportSuccess ? (
              <>
                <Check size={16} />
                Exported!
              </>
            ) : (
              <>
                <Download size={16} />
                Export Report
              </>
            )}
          </button>

          {showExportOptions && !isExporting && (
            <div className="export-dropdown absolute right-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-10">
              <div className="p-3 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">Export Format</h4>
              </div>
              <div className="p-2">
                {formatOptions.map(opt => {
                  const FormatIcon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      className={`w-full px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-all ${
                        exportFormat === opt.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() => setExportFormat(opt.id)}
                    >
                      <FormatIcon size={16} />
                      <span className="flex-1 text-left">{opt.label}</span>
                      {exportFormat === opt.id && <Check size={14} className="text-primary-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  className="w-full px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all"
                  onClick={handleExport}
                >
                  Export as {formatOptions.find(f => f.id === exportFormat)?.label}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {reports.map((report, index) => {
          const ReportIcon = report.icon;
          const isActive = selectedReport === report.id;
          const colorClasses = {
            success: 'border-success-200 bg-success-50 text-success-700',
            info: 'border-info-200 bg-info-50 text-info-700',
            purple: 'border-purple-200 bg-purple-50 text-purple-700',
            warning: 'border-warning-200 bg-warning-50 text-warning-700',
            primary: 'border-primary-200 bg-primary-50 text-primary-700',
            indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700'
          };

          return (
            <button
              key={report.id}
              className={`report-card p-4 rounded-xl border-2 transition-all text-left ${
                isActive
                  ? colorClasses[report.color]
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedReport(report.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ReportIcon size={24} className={isActive ? '' : 'text-gray-400'} />
              <h4 className={`text-sm font-semibold mt-2 ${isActive ? '' : 'text-gray-900'}`}>
                {report.label}
              </h4>
              <p className={`text-xs mt-1 ${isActive ? 'opacity-90' : 'text-gray-500'}`}>
                {report.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Report Preview */}
      <div className="report-preview bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="preview-header px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon size={18} className="text-gray-500" />
            <h4 className="font-medium text-gray-900">{currentReport?.label} Preview</h4>
            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
              {data.length} entries
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-all">
              <Printer size={16} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-all">
              <Mail size={16} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-all">
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="report-table w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {currentReport?.columns.map(col => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={currentReport?.columns.length} className="px-4 py-8 text-center">
                    <Loader2 size={24} className="animate-spin text-primary-500 mx-auto" />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={currentReport?.columns.length} className="px-4 py-8 text-center text-gray-500">
                    No data available for this report
                  </td>
                </tr>
              ) : (
                data.slice(0, 10).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {Object.values(row).map((value, j) => (
                      <td key={j} className="px-4 py-3 text-sm text-gray-700">
                        {typeof value === 'number' && (currentReport?.id === 'sales' || currentReport?.id === 'customer')
                          ? `₹${value.toLocaleString()}`
                          : currentReport?.id === 'sales' && j === 3
                          ? <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}>{value}</span>
                          : value
                        }
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="preview-footer px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>
              {dateRange === 'custom' 
                ? `${customDate.start} to ${customDate.end}`
                : dateRange?.replace(/([A-Z])/g, ' $1').toLowerCase() || 'All Time'
              }
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Showing {Math.min(data.length, 10)} of {data.length} records</span>
          </div>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        <div className="summary-card bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Total Records</p>
          <p className="text-xl font-bold text-gray-900">{data.length}</p>
        </div>
        <div className="summary-card bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Last Updated</p>
          <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="summary-card bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Export Format</p>
          <p className="text-sm font-medium text-gray-900 capitalize">{exportFormat}</p>
        </div>
        <div className="summary-card bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Report Type</p>
          <p className="text-sm font-medium text-gray-900 capitalize">{selectedReport}</p>
        </div>
      </div>
    </div>
  );
}