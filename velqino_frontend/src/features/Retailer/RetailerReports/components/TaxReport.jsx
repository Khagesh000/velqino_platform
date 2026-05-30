"use client"

import React, { useState, useEffect } from 'react'
import { FileText, TrendingUp, TrendingDown, Calendar, Download, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Clock, Eye } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerReports/TaxReport.scss'
import { useFileGSTReturnMutation } from '@/redux/retailer/slices/retailerReportsSlice'

export default function TaxReport({ dateRange, taxSummary, gstReturns = [], isLoading: propLoading, onRefresh }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [currentPage, setCurrentPage] = useState(1)
  const [filingReturnId, setFilingReturnId] = useState(null)
  const itemsPerPage = 4

  // ADD these lines
  const isLoading = propLoading
  const [fileGSTReturn, { isLoading: filingLoading }] = useFileGSTReturnMutation() 

  useEffect(() => {
    setMounted(true)
  }, [])



  if (!mounted) return null

  // Get tax data from API or use defaults
  const data = {
    gstCollected: taxSummary?.total_gst_collected || 0,
    gstPayable: taxSummary?.total_gst_collected || 0,
    cgst: taxSummary?.cgst || 0,
    sgst: taxSummary?.sgst || 0,
    pending: taxSummary?.pending_returns || 0,
    filed: (taxSummary?.total_orders || 0) > 0
  }

  const getStatusBadge = (status) => {
    if (status === 'filed') {
      return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={10} />, label: 'Filed' }
    }
    if (status === 'overdue') {
      return { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle size={10} />, label: 'Overdue' }
    }
    return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={10} />, label: 'Pending' }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount)
  }

  const pendingReturns = gstReturns?.filter(r => r.status === 'pending').length || 0
  const filedReturns = gstReturns?.filter(r => r.status === 'filed').length || 0
  const totalTaxLiability = gstReturns?.reduce((sum, r) => sum + (r.tax_amount || 0), 0) || 0

  const handleFileReturn = async (returnId) => {
    setFilingReturnId(returnId)
    try {
      await fileGSTReturn({ return_id: returnId }).unwrap()
      refetchGSTReturns()
      refetchTaxSummary()
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error('Failed to file return:', error)
      alert('Failed to file GST return. Please try again.')
    } finally {
      setFilingReturnId(null)
    }
  }

  const currentData = gstReturns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(gstReturns.length / itemsPerPage)

  const getPeriodLabel = (period) => {
    if (!period) return 'N/A'
    return period
  }

  if (isLoading && !taxSummary && gstReturns.length === 0) {
    return (
      <div className="tax-report bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading tax data...</p>
        </div>
      </div>
    )
  }

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
          GST Returns ({gstReturns.length})
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
            {data.gstCollected === 0 ? (
              <div className="text-center py-8">
                <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No tax data available</p>
                <p className="text-xs text-gray-400 mt-1">Complete orders to see tax summary</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600 mb-1">GST Collected</p>
                    <p className="text-xl font-bold text-blue-700">₹{formatCurrency(data.gstCollected)}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-orange-600 mb-1">GST Payable</p>
                    <p className="text-xl font-bold text-orange-700">₹{formatCurrency(data.gstPayable)}</p>
                  </div>
                </div>

                {/* GST Breakdown */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">GST Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">CGST (9%)</span>
                      <span className="font-semibold text-gray-900">₹{formatCurrency(data.cgst)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">SGST (9%)</span>
                      <span className="font-semibold text-gray-900">₹{formatCurrency(data.sgst)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="font-medium text-gray-700">Total</span>
                      <span className="font-bold text-primary-600">₹{formatCurrency(data.gstCollected)}</span>
                    </div>
                  </div>
                </div>

                {/* Compliance Status */}
                <div className={`rounded-lg p-3 ${data.filed ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <div className="flex items-center gap-2">
                    {data.filed ? <CheckCircle size={16} className="text-green-600" /> : <Clock size={16} className="text-yellow-600" />}
                    <span className="text-sm font-medium text-gray-700">Compliance Status</span>
                  </div>
                  <p className={`text-xs mt-1 ${data.filed ? 'text-green-700' : 'text-yellow-700'}`}>
                    {data.filed ? 'GST returns tracked for this period' : 'No GST returns filed yet'}
                  </p>
                </div>

                {/* Tax Summary */}
                {gstReturns.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={14} className="text-yellow-600" />
                      <span className="text-xs font-semibold text-yellow-700">Next Due Date</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {gstReturns.find(r => r.status === 'pending')?.due_date || 'No pending returns'}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">Quarterly GST return filing</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-3">
            {gstReturns.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No GST returns data available</p>
                <p className="text-xs text-gray-400 mt-1">Returns will appear when orders are completed</p>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-green-700">{filedReturns}</p>
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
                  const isFiling = filingReturnId === returnItem.id
                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 transition-all hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{getPeriodLabel(returnItem.period)}</h4>
                          <p className="text-xs text-gray-500">GST Return</p>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                          {status.icon}
                          {status.label}
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Due Date</p>
                          <p className="font-medium text-gray-700">{formatDate(returnItem.due_date)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Tax Amount</p>
                          <p className="font-semibold text-gray-900">₹{formatCurrency(returnItem.tax_amount)}</p>
                        </div>
                      </div>
                      
                      {returnItem.status === 'filed' && returnItem.filed_date && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-[10px] text-green-600">Filed on {formatDate(returnItem.filed_date)}</p>
                        </div>
                      )}
                      
                      {returnItem.status === 'pending' && (
                        <button 
                          onClick={() => handleFileReturn(returnItem.id)}
                          disabled={isFiling}
                          className="mt-2 w-full py-1.5 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all disabled:bg-gray-400"
                        >
                          {isFiling ? 'Filing...' : 'File Now'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">GST Configuration</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST Number</span>
                  <span className="font-medium text-gray-900">Not configured</span>
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

            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={14} className="text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-700">GST Rate Information</span>
              </div>
              <p className="text-xs text-gray-600">Current GST rate is set to 18% (9% CGST + 9% SGST) for all products. Update product-specific rates in catalog settings.</p>
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