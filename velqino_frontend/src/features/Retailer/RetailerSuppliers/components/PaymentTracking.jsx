"use client"

import React, { useState, useEffect } from 'react'
import { 
  Wallet, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, 
  Eye, Download, ChevronLeft, ChevronRight, Plus, X, CreditCard, 
  ArrowUpRight
} from '../../../../utils/icons'

export default function PaymentTracking({ selectedSupplier }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('invoices')
  const [currentPage, setCurrentPage] = useState(1)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank')

  const [paymentData, setPaymentData] = useState({
    summary: {
      totalDue: 185000,
      paid: 125000,
      pending: 60000,
      overdue: 25000
    },
    invoices: [
      { id: 'INV-001', supplier: 'Fashion Hub', date: '2026-04-10', dueDate: '2026-04-25', amount: 45000, paid: 0, status: 'pending', items: 3 },
      { id: 'INV-002', supplier: 'ElectroMart', date: '2026-04-05', dueDate: '2026-05-05', amount: 28000, paid: 28000, status: 'paid', paidDate: '2026-04-12', items: 2 },
      { id: 'INV-003', supplier: 'TechGadgets', date: '2026-03-28', dueDate: '2026-04-04', amount: 62000, paid: 62000, status: 'paid', paidDate: '2026-04-02', items: 4 },
      { id: 'INV-004', supplier: 'LeatherCraft', date: '2026-03-20', dueDate: '2026-04-19', amount: 35000, paid: 0, status: 'overdue', items: 2 },
      { id: 'INV-005', supplier: 'SportFit', date: '2026-04-12', dueDate: '2026-04-27', amount: 52000, paid: 0, status: 'pending', items: 3 },
    ],
    history: [
      { id: 'TXN-9081', supplier: 'Fashion Hub', amount: 45000, date: '2026-04-10', method: 'RTGS / Bank' },
      { id: 'TXN-8842', supplier: 'ElectroMart', amount: 28000, date: '2026-04-05', method: 'Corporate Card' },
      { id: 'TXN-7619', supplier: 'TechGadgets', amount: 62000, date: '2026-03-28', method: 'UPI Merchant' },
    ]
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-80 bg-gray-100 rounded-2xl animate-pulse" />
  }

  const filteredInvoices = selectedSupplier
    ? paymentData.invoices.filter(inv => inv.supplier === selectedSupplier.name)
    : paymentData.invoices

  const totalPages = Math.ceil(filteredInvoices.length / 4) || 1
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * 4, currentPage * 4)

  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid':
        return { 
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
          icon: <CheckCircle size={11} />, 
          label: 'Settled' 
        }
      case 'pending':
        return { 
          bg: 'bg-amber-50 text-amber-700 border-amber-200', 
          icon: <Clock size={11} />, 
          label: 'Pending' 
        }
      case 'overdue':
        return { 
          bg: 'bg-rose-50 text-rose-700 border-rose-200', 
          icon: <AlertCircle size={11} />, 
          label: 'Overdue' 
        }
      default:
        return { 
          bg: 'bg-gray-50 text-gray-700 border-gray-200', 
          icon: <Wallet size={11} />, 
          label: status 
        }
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const handleMakePayment = (invoice) => {
    setSelectedPayment(invoice)
    setPaymentAmount(invoice.amount.toString())
    setShowPaymentModal(true)
  }

  const handleSubmitPayment = (e) => {
    e.preventDefault()
    const amountVal = parseInt(paymentAmount) || 0
    if (!selectedPayment) return

    // Update invoice status
    const updatedInvoices = paymentData.invoices.map(inv => {
      if (inv.id === selectedPayment.id) {
        return { ...inv, status: 'paid', paid: inv.amount, paidDate: new Date().toISOString().split('T')[0] }
      }
      return inv
    })

    const newHistory = [
      {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        supplier: selectedPayment.supplier,
        amount: amountVal,
        date: new Date().toISOString().split('T')[0],
        method: paymentMethod === 'bank' ? 'Bank Transfer' : paymentMethod === 'card' ? 'Card' : 'UPI'
      },
      ...paymentData.history
    ]

    setPaymentData({
      ...paymentData,
      summary: {
        ...paymentData.summary,
        paid: paymentData.summary.paid + amountVal,
        pending: Math.max(0, paymentData.summary.pending - amountVal)
      },
      invoices: updatedInvoices,
      history: newHistory
    })

    setShowPaymentModal(false)
    setSelectedPayment(null)
    setPaymentAmount('')
  }

  const summary = paymentData.summary

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold ring-1 ring-primary-100">
              <Wallet size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 tracking-tight">Payment Ledger</h3>
              <p className="text-xs text-gray-500">Accounts payable, pending dues & settlement records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Mini-Grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-b border-gray-100 bg-gray-50/30">
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Total Due</span>
          <p className="text-base font-bold text-gray-900 mt-0.5">₹{summary.totalDue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
          <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider block">Settled</span>
          <p className="text-base font-bold text-emerald-700 mt-0.5">₹{summary.paid.toLocaleString()}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
          <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider block">Pending</span>
          <p className="text-base font-bold text-amber-700 mt-0.5">₹{summary.pending.toLocaleString()}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
          <span className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider block">Overdue</span>
          <p className="text-base font-bold text-rose-700 mt-0.5">₹{summary.overdue.toLocaleString()}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-100 px-5 bg-white">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`py-3 text-xs font-semibold border-b-2 mr-6 transition-all ${
            activeTab === 'invoices' 
              ? 'text-primary-600 border-primary-600' 
              : 'text-gray-500 border-transparent hover:text-gray-800'
          }`}
        >
          Active Invoices ({filteredInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'history' 
              ? 'text-primary-600 border-primary-600' 
              : 'text-gray-500 border-transparent hover:text-gray-800'
          }`}
        >
          Settlement History ({paymentData.history.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 overflow-y-auto space-y-3">
        {activeTab === 'invoices' && (
          <>
            {paginatedInvoices.length === 0 ? (
              <div className="text-center py-10">
                <Wallet size={36} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs font-semibold text-gray-600">No invoices under this selection</p>
              </div>
            ) : (
              paginatedInvoices.map((invoice) => {
                const status = getStatusBadge(invoice.status)
                const isOverdue = invoice.status === 'overdue'

                return (
                  <div 
                    key={invoice.id} 
                    className="p-3.5 rounded-xl border border-gray-200/80 hover:border-primary-200 transition-all bg-white"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900 tracking-tight">{invoice.id}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs font-medium text-gray-700">{invoice.supplier}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Issued {formatDate(invoice.date)} • Due {formatDate(invoice.dueDate)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.bg}`}>
                          {status.icon}
                          {status.label}
                        </span>
                        <span className="text-xs font-bold text-gray-900">₹{invoice.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                      <span className="text-[11px] text-gray-500">
                        {invoice.status === 'paid' ? `Settled on ${formatDate(invoice.paidDate)}` : `${invoice.items} billable line items`}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {invoice.status !== 'paid' && (
                          <button
                            onClick={() => handleMakePayment(invoice)}
                            className="px-2.5 py-1 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 active:scale-95 rounded-lg shadow-2xs transition-all"
                          >
                            Pay Bill
                          </button>
                        )}
                        <button
                          onClick={() => alert(`Viewing invoice ${invoice.id}`)}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Page {currentPage} of {totalPages}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded border border-gray-200 disabled:opacity-40"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded border border-gray-200 disabled:opacity-40"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <div className="space-y-2.5">
            {paymentData.history.map((record) => (
              <div 
                key={record.id} 
                className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between hover:bg-white hover:border-gray-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ArrowUpRight size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{record.supplier}</p>
                    <p className="text-[10px] text-gray-500">{record.method} • Ref: {record.id}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-700">₹{record.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">{formatDate(record.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Processing Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Wallet size={15} />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Execute Payment</h3>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-4 space-y-3.5">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-500">Invoice Reference</span>
                  <span className="text-xs font-bold text-gray-900">{selectedPayment.id}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] font-medium text-gray-500">Beneficiary Vendor</span>
                  <span className="text-xs font-semibold text-gray-800">{selectedPayment.supplier}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Disbursement Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Settlement Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'bank'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Building2 size={14} />
                    <span>Bank / NEFT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'card'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'upi'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <QrCode size={14} />
                    <span>UPI</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-sm transition-all"
                >
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
