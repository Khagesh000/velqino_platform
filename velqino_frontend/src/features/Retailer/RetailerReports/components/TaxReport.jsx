"use client"

import React, { useState, useEffect } from 'react'
import { FileText, CheckCircle, AlertCircle, Clock, ChevronLeft, ChevronRight } from '../../../../utils/icons'
import { useFileGSTReturnMutation } from '@/redux/retailer/slices/retailerReportsSlice'

export default function TaxReport({ 
  dateRange = 'month', 
  taxSummary, 
  gstReturns = [], 
  isLoading, 
  onRefresh 
}) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [currentPage, setCurrentPage] = useState(1)
  const [filingReturnId, setFilingReturnId] = useState(null)
  const itemsPerPage = 4

  const [fileGSTReturn] = useFileGSTReturnMutation()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Support both nested summary and top-level fields
  const totalGst = taxSummary?.total_gst_collected ?? taxSummary?.summary?.total_gst_collected ?? 0
  const taxableAmount = taxSummary?.total_taxable_amount ?? taxSummary?.summary?.total_taxable_amount ?? 0
  const cgst = taxSummary?.cgst ?? taxSummary?.summary?.cgst ?? (totalGst / 2)
  const sgst = taxSummary?.sgst ?? taxSummary?.summary?.sgst ?? (totalGst / 2)
  const totalOrders = taxSummary?.total_orders ?? taxSummary?.summary?.total_orders ?? 0

  const returnsList = Array.isArray(gstReturns) ? gstReturns : (gstReturns?.returns || [])
  const filedReturns = returnsList.filter(r => r.status === 'filed').length
  const pendingReturns = returnsList.filter(r => r.status === 'pending').length

  const totalPages = Math.max(1, Math.ceil(returnsList.length / itemsPerPage))
  const paginatedReturns = returnsList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount || 0))
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const handleFileReturn = async (returnId) => {
    setFilingReturnId(returnId)
    try {
      await fileGSTReturn({ return_id: returnId }).unwrap()
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error('Failed to file return:', error)
      alert('Failed to file GST return. Please try again.')
    } finally {
      setFilingReturnId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[380px]">
        <div className="animate-spin rounded-full h-9 w-9 border-2 border-primary-500 border-t-transparent" />
        <p className="text-xs font-medium text-gray-500 mt-3">Loading tax & GST compliance...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 flex flex-col h-full overflow-hidden transition-all duration-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Tax & GST Compliance</h3>
            <p className="text-xs text-gray-400 mt-0.5">Automated tax collection & return filing</p>
          </div>
        </div>
        <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
          {returnsList.length} Filings
        </span>
      </div>

      {/* Summary KPI Strip */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-b border-gray-100 bg-gray-50/50">
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Total Tax Collected</p>
          <p className="text-base font-bold text-gray-900 mt-0.5">₹{formatCurrency(totalGst)}</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Taxable Sales</p>
          <p className="text-base font-bold text-primary-600 mt-0.5">₹{formatCurrency(taxableAmount)}</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Filed Returns</p>
          <p className="text-base font-bold text-emerald-600 mt-0.5">{filedReturns}</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Pending Returns</p>
          <p className={`text-base font-bold mt-0.5 ${pendingReturns > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
            {pendingReturns}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-3 bg-white">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'overview' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Tax Breakdown
        </button>
        <button
          onClick={() => { setActiveTab('returns'); setCurrentPage(1); }}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'returns' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          GST Returns ({returnsList.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[300px]">
        {activeTab === 'overview' ? (
          <div className="space-y-3.5">
            {/* Split cards for CGST and SGST */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] font-medium text-gray-400 block">CGST (9%)</span>
                <p className="text-base font-bold text-gray-900 mt-1">₹{formatCurrency(cgst)}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Central GST share</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] font-medium text-gray-400 block">SGST (9%)</span>
                <p className="text-base font-bold text-gray-900 mt-1">₹{formatCurrency(sgst)}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">State GST share</p>
              </div>
            </div>

            {/* Compliance Badge */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2.5">
              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-emerald-950">Automated Tax Accrual Active</p>
                <p className="text-emerald-700 mt-0.5">
                  18% unified GST is automatically captured across {totalOrders} orders processed in this reporting cycle.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {returnsList.length === 0 ? (
              <div className="text-center py-10">
                <FileText size={28} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs font-medium text-gray-500">No GST returns in this period</p>
              </div>
            ) : (
              paginatedReturns.map((ret) => {
                const isFiled = ret.status === 'filed'
                const isFilingThis = filingReturnId === ret.id
                return (
                  <div 
                    key={ret.id} 
                    className="p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900">{ret.period}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isFiled ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {isFiled ? 'Filed' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Due: {formatDate(ret.due_date)} {isFiled && ret.filed_date ? `• Filed: ${formatDate(ret.filed_date)}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-bold text-gray-900">₹{formatCurrency(ret.tax_amount)}</p>
                        <p className="text-[10px] text-gray-400">Tax Liability</p>
                      </div>
                      {!isFiled && (
                        <button
                          onClick={() => handleFileReturn(ret.id)}
                          disabled={isFilingThis}
                          className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                        >
                          {isFilingThis ? 'Filing...' : 'File Return'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {activeTab === 'returns' && totalPages > 1 && (
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}