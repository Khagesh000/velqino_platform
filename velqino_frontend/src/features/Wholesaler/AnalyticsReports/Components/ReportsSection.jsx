"use client"

import React, { useState } from 'react'
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
  AlertCircle
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/AnalyticsReports/ReportsSection.scss'

export default function ReportsSection({ type = 'sales', dateRange, customDate }) {
  const [selectedReport, setSelectedReport] = useState(type)
  const [exportFormat, setExportFormat] = useState('pdf')
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState(['all'])
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const reports = [
    {
      id: 'sales',
      label: 'Sales Report',
      icon: DollarSign,
      color: 'success',
      description: 'Revenue, orders, AOV, conversion',
      columns: ['Date', 'Orders', 'Revenue', 'AOV', 'Conversion', 'Refunds']
    },
    {
      id: 'inventory',
      label: 'Inventory Report',
      icon: Package,
      color: 'info',
      description: 'Stock levels, low stock, out of stock',
      columns: ['SKU', 'Product', 'Category', 'Stock', 'Threshold', 'Status', 'Last Restock']
    },
    {
      id: 'customer',
      label: 'Customer Report',
      icon: Users,
      color: 'purple',
      description: 'New vs returning, top customers',
      columns: ['Customer', 'Orders', 'Spent', 'Avg Order', 'Last Order', 'Type']
    },
    {
      id: 'tax',
      label: 'Tax Report',
      icon: FilePieChart,
      color: 'warning',
      description: 'Tax collected, by region',
      columns: ['Period', 'Taxable Sales', 'Tax Rate', 'Tax Collected', 'Region']
    },
    {
      id: 'payout',
      label: 'Payout Report',
      icon: DollarSign,
      color: 'primary',
      description: 'Vendor payouts, commissions',
      columns: ['Vendor', 'Orders', 'Sales', 'Commission', 'Payout', 'Status']
    },
    {
      id: 'product',
      label: 'Product Performance',
      icon: TrendingUp,
      color: 'indigo',
      description: 'Best sellers, revenue by product',
      columns: ['Product', 'SKU', 'Sales', 'Revenue', 'Stock', 'Views', 'Conversion']
    }
  ]

  const formatOptions = [
    { id: 'pdf', label: 'PDF', icon: FileText },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet },
    { id: 'csv', label: 'CSV', icon: FileBarChart }
  ]

  // Mock data for different reports
  const getReportData = () => {
    switch(selectedReport) {
      case 'sales':
        return [
          { date: '2024-03-01', orders: 45, revenue: 125000, aov: 2778, conversion: 3.2, refunds: 2 },
          { date: '2024-03-02', orders: 52, revenue: 148000, aov: 2846, conversion: 3.5, refunds: 1 },
          { date: '2024-03-03', orders: 48, revenue: 132000, aov: 2750, conversion: 3.3, refunds: 0 },
          { date: '2024-03-04', orders: 61, revenue: 178000, aov: 2918, conversion: 3.8, refunds: 3 },
          { date: '2024-03-05', orders: 58, revenue: 165000, aov: 2845, conversion: 3.6, refunds: 1 }
        ]
      case 'inventory':
        return [
          { sku: 'WH-001', product: 'Wireless Headphones', category: 'Electronics', stock: 45, threshold: 10, status: 'In Stock', lastRestock: '2024-02-28' },
          { sku: 'CT-045', product: 'Cotton T-Shirt', category: 'Clothing', stock: 120, threshold: 20, status: 'In Stock', lastRestock: '2024-03-01' },
          { sku: 'CM-112', product: 'Ceramic Mug', category: 'Home Decor', stock: 8, threshold: 15, status: 'Low Stock', lastRestock: '2024-02-15' },
          { sku: 'YM-078', product: 'Yoga Mat', category: 'Fitness', stock: 34, threshold: 12, status: 'In Stock', lastRestock: '2024-02-20' },
          { sku: 'DL-234', product: 'Desk Lamp', category: 'Home Decor', stock: 18, threshold: 8, status: 'In Stock', lastRestock: '2024-02-25' }
        ]
      default:
        return []
    }
  }

  const handleExport = () => {
    setIsExporting(true)
    setExportSuccess(false)
    
    // Simulate export
    setTimeout(() => {
      setIsExporting(false)
      setExportSuccess(true)
      
      setTimeout(() => {
        setExportSuccess(false)
      }, 3000)
    }, 2000)
  }

  const toggleColumn = (column) => {
    if (column === 'all') {
      setSelectedColumns(['all'])
    } else {
      if (selectedColumns.includes('all')) {
        setSelectedColumns([column])
      } else if (selectedColumns.includes(column)) {
        setSelectedColumns(selectedColumns.filter(c => c !== column))
      } else {
        setSelectedColumns([...selectedColumns, column])
      }
    }
  }

  const currentReport = reports.find(r => r.id === selectedReport)
  const Icon = currentReport?.icon || FileText
  const data = getReportData()

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

        {/* Export Button with Options */}
        <div className="relative">
          <button
            className={`px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all flex items-center gap-2 ${
              isExporting ? 'opacity-75 cursor-wait' : ''
            }`}
            onClick={() => !isExporting && setShowExportOptions(!showExportOptions)}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

          {/* Export Options Dropdown */}
          {showExportOptions && !isExporting && (
            <div className="export-dropdown absolute right-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-10">
              <div className="p-3 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">Export Format</h4>
              </div>
              <div className="p-2">
                {formatOptions.map(opt => {
                  const FormatIcon = opt.icon
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
                      {exportFormat === opt.id && (
                        <Check size={14} className="text-primary-600" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  className="w-full px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all"
                  onClick={() => {
                    handleExport()
                    setShowExportOptions(false)
                  }}
                >
                  Export as {formatOptions.find(f => f.id === exportFormat)?.label}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {reports.map((report, index) => {
          const ReportIcon = report.icon
          const isActive = selectedReport === report.id
          const colorClasses = {
            success: 'border-success-200 bg-success-50 text-success-700',
            info: 'border-info-200 bg-info-50 text-info-700',
            purple: 'border-purple-200 bg-purple-50 text-purple-700',
            warning: 'border-warning-200 bg-warning-50 text-warning-700',
            primary: 'border-primary-200 bg-primary-50 text-primary-700',
            indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700'
          }

          return (
            <button
              key={report.id}
              className={`report-card p-4 rounded-xl border-2 transition-all ${
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
          )
        })}
      </div>

      {/* Report Preview */}
      <div className="report-preview bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Preview Header */}
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

        {/* Column Selector */}
        <div className="column-selector px-4 py-2 border-b border-gray-200 flex items-center gap-4 overflow-x-auto">
          <span className="text-xs font-medium text-gray-500">Columns:</span>
          <button
            className={`px-2 py-1 text-xs rounded-full transition-all ${
              selectedColumns.includes('all')
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => toggleColumn('all')}
          >
            All
          </button>
          {currentReport?.columns.map(col => (
            <button
              key={col}
              className={`px-2 py-1 text-xs rounded-full whitespace-nowrap transition-all ${
                selectedColumns.includes('all') || selectedColumns.includes(col)
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => toggleColumn(col)}
            >
              {col}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="report-table w-full">
            <thead>
              <tr>
                {currentReport?.columns.map(col => (
                  (selectedColumns.includes('all') || selectedColumns.includes(col)) && (
                    <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {col}
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, i) => (
                <tr key={i} className="report-row hover:bg-gray-50">
                  {Object.values(row).map((value, j) => (
                    (selectedColumns.includes('all') || selectedColumns.includes(currentReport?.columns[j])) && (
                      <td key={j} className="px-4 py-3 text-sm text-gray-700">
                        {typeof value === 'number' && value > 1000 
                          ? `₹${value.toLocaleString()}`
                          : value
                        }
                      </td>
                    )
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Preview Footer */}
        <div className="preview-footer px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>
              {dateRange === 'custom' 
                ? `${customDate.start} to ${customDate.end}`
                : dateRange?.replace(/([A-Z])/g, ' $1').toLowerCase()
              }
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Total Records: {data.length}</span>
            <button className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View Full Report
              <ChevronDown size={14} className="rotate-270" />
            </button>
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
          <p className="text-sm font-medium text-gray-900">Today 10:30 AM</p>
        </div>
        <div className="summary-card bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Report Size</p>
          <p className="text-sm font-medium text-gray-900">245 KB</p>
        </div>
        <div className="summary-card bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Export Format</p>
          <p className="text-sm font-medium text-gray-900 capitalize">{exportFormat}</p>
        </div>
      </div>

      {/* Export History (Optional) */}
      <div className="export-history mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Exports</h4>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-gray-400" />
            <span className="text-gray-600">Sales_Report_Mar2024.pdf</span>
            <span className="text-gray-400">2 min ago</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={14} className="text-gray-400" />
            <span className="text-gray-600">Inventory_Report_Mar2024.xlsx</span>
            <span className="text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}