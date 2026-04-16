"use client"

import React, { useState, useEffect } from 'react'
import { FileText, TrendingUp, TrendingDown, Calendar, Download, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Clock, Eye } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerReports/TaxReport.scss'

export default function TaxReport({ dateRange }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const taxData = {
    day: {
      gstCollected: 5209,
      gstPayable: 5209,
      cgst: 2604,
      sgst: 2605,
      pending: 0,
      filed: true
    },
    week: {
      gstCollected: 22302,
      gstPayable: 22302,
      cgst: 11151,
      sgst: 11151,
      pending: 0,
      filed: true
    },
    month: {
      gstCollected: 37188,
      gstPayable: 37188,
      cgst: 18594,
      sgst: 18594,
      pending: 0,
      filed: true
    },
    quarter: {
      gstCollected: 99288,
      gstPayable: 99288,
      cgst: 49644,
      sgst: 49644,
      pending: 0,
      filed: true
    },
    year: {
      gstCollected: 439488,
      gstPayable: 439488,
      cgst: 219744,
      sgst: 219744,
      pending: 0,
      filed: true
    }
  }

  const data = taxData[dateRange] || taxData.month

  const gstReturns = [
    { period: 'Jan-Mar 2026', dueDate: '2026-04-20', status: 'pending', amount: 24822, type: 'Quarterly' },
    { period: 'Oct-Dec 2025', dueDate: '2026-01-20', status: 'filed', amount: 22302, filedDate: '2026-01-15', type: 'Quarterly' },
    { period: 'Jul-Sep 2025', dueDate: '2025-10-20', status: 'filed', amount: 21078, filedDate: '2025-10-18', type: 'Quarterly' },
    { period: 'Apr-Jun 2025', dueDate: '2025-07-20', status: 'filed', amount: 19850, filedDate: '2025-07-16', type: 'Quarterly' },
  ]

  const getStatusBadge = (status) => {
    if (status === 'filed') {
      return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={10} />, label: 'Filed' }
    }
    return { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle size={10} />, label: 'Pending' }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const pendingReturns = gstReturns.filter(r => r.status === 'pending').length
  const totalTaxLiability = gstReturns.reduce((sum, r) => sum + r.amount, 0)

  const currentData = gstReturns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(gstReturns.length / itemsPerPage)

  return (
    <div className="tax-report bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Tax Report</h3>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
            <Download size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">GST compliance and tax summary</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'overview' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('returns')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'returns' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          GST Returns
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'settings' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[350px] overflow-y-auto custom-scroll">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-600 mb-1">GST Collected</p>
                <p className="text-xl font-bold text-blue-700">₹{data.gstCollected.toLocaleString()}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <p className="text-xs text-orange-600 mb-1">GST Payable</p>
                <p className="text-xl font-bold text-orange-700">₹{data.gstPayable.toLocaleString()}</p>
              </div>
            </div>

            {/* GST Breakdown */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">GST Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CGST (9%)</span>
                  <span className="font-semibold text-gray-900">₹{data.cgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SGST (9%)</span>
                  <span className="font-semibold text-gray-900">₹{data.sgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="font-medium text-gray-700">Total</span>
                  <span className="font-bold text-primary-600">₹{data.gstCollected.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Compliance Status */}
            <div className={`rounded-lg p-3 ${data.filed ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2">
                {data.filed ? <CheckCircle size={16} className="text-green-600" /> : <AlertCircle size={16} className="text-red-600" />}
                <span className="text-sm font-medium text-gray-700">Compliance Status</span>
              </div>
              <p className={`text-xs mt-1 ${data.filed ? 'text-green-700' : 'text-red-700'}`}>
                {data.filed ? 'All GST returns filed for this period' : 'Pending GST returns need attention'}
              </p>
            </div>

            {/* Tax Summary */}
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-700">Next Due Date</span>
              </div>
              <p className="text-sm font-medium text-gray-900">April 20, 2026</p>
              <p className="text-xs text-yellow-600 mt-1">Quarterly GST return filing</p>
            </div>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-3">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-green-700">{gstReturns.length - pendingReturns}</p>
                <p className="text-[10px] text-green-600">Returns Filed</p>
              </div>
              <div className="bg-red-50 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-red-700">{pendingReturns}</p>
                <p className="text-[10px] text-red-600">Pending</p>
              </div>
            </div>

            {/* Returns List */}
            {currentData.map((returnItem, idx) => {
              const status = getStatusBadge(returnItem.status)
              return (
                <div key={idx} className="border border-gray-200 rounded-lg p-3 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{returnItem.period}</h4>
                      <p className="text-xs text-gray-500">{returnItem.type} Return</p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                      {status.icon}
                      {status.label}
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className="font-medium text-gray-700">{formatDate(returnItem.dueDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-semibold text-gray-900">₹{returnItem.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {returnItem.status === 'filed' && returnItem.filedDate && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-[10px] text-green-600">Filed on {formatDate(returnItem.filedDate)}</p>
                    </div>
                  )}
                  
                  {returnItem.status === 'pending' && (
                    <button className="mt-2 w-full py-1.5 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all">
                      File Now
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">GST Configuration</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST Number</span>
                  <span className="font-medium text-gray-900">29ABCDE1234F1Z5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST Rate</span>
                  <span className="font-medium text-gray-900">18% (CGST 9% + SGST 9%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Filing Frequency</span>
                  <span className="font-medium text-gray-900">Quarterly</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={14} className="text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">Auto-filing Settings</span>
              </div>
              <label className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">Enable auto GST filing</span>
                <input type="checkbox" className="rounded text-primary-500" />
              </label>
              <label className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">Email reminders for due dates</span>
                <input type="checkbox" defaultChecked className="rounded text-primary-500" />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {activeTab === 'returns' && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {gstReturns.length} returns
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronLeft size={12} />
            </button>
            <span className="text-xs text-gray-600">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}