"use client"

import React, { useState, useEffect } from 'react'
import { Download, Edit, FileText, FileSpreadsheet, Mail, Printer, CheckCircle, AlertCircle, Calendar, Filter, RefreshCw, X } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerReports/ExportOptions.scss'

export default function ExportOptions() {
  const [mounted, setMounted] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [selectedReport, setSelectedReport] = useState('sales')
  const [emailAddress, setEmailAddress] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [isExporting, setIsExporting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Set default date range (last 30 days)
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    })
  }, [])

  if (!mounted) return null

  const reportTypes = [
    { id: 'sales', label: 'Sales Report', icon: <FileText size={16} />, description: 'Daily/Weekly/Monthly sales data' },
    { id: 'products', label: 'Product Report', icon: <FileText size={16} />, description: 'Best sellers, inventory status' },
    { id: 'customers', label: 'Customer Report', icon: <FileText size={16} />, description: 'Customer insights and analytics' },
    { id: 'tax', label: 'Tax Report', icon: <FileText size={16} />, description: 'GST summary and returns' },
    { id: 'staff', label: 'Staff Performance', icon: <FileText size={16} />, description: 'Staff sales and targets' },
  ]

  const exportFormats = [
    { id: 'pdf', label: 'PDF', icon: <FileText size={18} />, color: 'red', description: 'Download as PDF document' },
    { id: 'excel', label: 'Excel', icon: <FileSpreadsheet size={18} />, color: 'green', description: 'Export to Excel/CSV' },
    { id: 'email', label: 'Email', icon: <Mail size={18} />, color: 'blue', description: 'Send report via email' },
  ]

  const handleExport = async () => {
    setIsExporting(true)
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsExporting(false)
    
    if (selectedFormat === 'email') {
      setShowEmailModal(true)
    } else {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const handleSendEmail = async () => {
    if (!emailAddress) return
    setIsExporting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsExporting(false)
    setShowEmailModal(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    setEmailAddress('')
  }

  const scheduledReports = [
    { id: 1, name: 'Daily Sales Summary', frequency: 'Daily', time: '9:00 AM', recipients: 'admin@store.com', active: true },
    { id: 2, name: 'Weekly Performance', frequency: 'Weekly (Mon)', time: '10:00 AM', recipients: 'manager@store.com', active: true },
    { id: 3, name: 'Monthly Tax Report', frequency: 'Monthly (1st)', time: '8:00 AM', recipients: 'accounts@store.com', active: false },
  ]

  return (
    <div className="export-options bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Download size={18} className="text-primary-500" />
          <h3 className="text-base font-semibold text-gray-900">Export Options</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">Export reports in multiple formats</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-4 mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-700">Report exported successfully!</span>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Report Type Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Select Report</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {reportTypes.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  selectedReport === report.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={selectedReport === report.id ? 'text-primary-600' : 'text-gray-400'}>
                    {report.icon}
                  </span>
                  <span className="text-xs font-medium text-gray-700">{report.label}</span>
                </div>
                <p className="text-[10px] text-gray-500">{report.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Date Range</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>
            <span className="text-gray-400 self-center">to</span>
            <div className="flex-1 relative">
              <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Export Format */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Export Format</label>
          <div className="grid grid-cols-3 gap-2">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  selectedFormat === format.id
                    ? `border-${format.color}-500 bg-${format.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`flex justify-center mb-1 ${selectedFormat === format.id ? `text-${format.color}-600` : 'text-gray-400'}`}>
                  {format.icon}
                </div>
                <span className={`text-xs font-medium ${selectedFormat === format.id ? `text-${format.color}-700` : 'text-gray-700'}`}>
                  {format.label}
                </span>
                <p className="text-[9px] text-gray-500 mt-0.5">{format.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            isExporting ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          {isExporting ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Export Report</span>
            </>
          )}
        </button>
      </div>

      {/* Scheduled Reports Section */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-gray-700">Scheduled Reports</h4>
          <button className="text-[10px] text-primary-600">+ Add Schedule</button>
        </div>
        <div className="space-y-2">
          {scheduledReports.map((schedule) => (
            <div key={schedule.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
              <div>
                <p className="text-xs font-medium text-gray-900">{schedule.name}</p>
                <p className="text-[10px] text-gray-500">{schedule.frequency} • {schedule.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${schedule.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Edit size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Send Report via Email</h3>
              </div>
              <button onClick={() => setShowEmailModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="recipient@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
              <p className="text-[10px] text-gray-400 mt-1">Report will be sent as {selectedFormat.toUpperCase()} attachment</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={!emailAddress}
                className={`flex-1 px-4 py-2 text-sm rounded-lg transition-all ${
                  emailAddress ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Send Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}