"use client"

import React, { useState, useEffect } from 'react'
import { Wallet, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Eye, Download, ChevronLeft, ChevronRight, Plus, X, Save, CreditCard, Banknote } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSuppliers/PaymentTracking.scss'

export default function PaymentTracking({ selectedSupplier }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [currentPage, setCurrentPage] = useState(1)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const paymentData = {
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
    ]
  }

  const filteredInvoices = selectedSupplier
    ? paymentData.invoices.filter(inv => inv.supplier === selectedSupplier.name)
    : paymentData.invoices

  const totalPages = Math.ceil(filteredInvoices.length / 4)
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * 4, currentPage * 4)

  const getStatusConfig = (status) => {
    switch(status) {
      case 'paid':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={12} />, label: 'Paid' }
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={12} />, label: 'Pending' }
      case 'overdue':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle size={12} />, label: 'Overdue' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Wallet size={12} />, label: status }
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const handleMakePayment = (invoice) => {
    setSelectedPayment(invoice)
    setPaymentAmount(invoice.amount.toString())
    setShowPaymentModal(true)
  }

  const handleSubmitPayment = () => {
    alert(`Payment of ₹${parseInt(paymentAmount).toLocaleString()} processed successfully!`)
    setShowPaymentModal(false)
    setSelectedPayment(null)
    setPaymentAmount('')
  }

  const summary = paymentData.summary

  return (
    <div className="payment-tracking bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-primary-500" />
          <h3 className="text-base font-semibold text-gray-900">Payment Tracking</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">Track supplier payments and dues</p>
      </div>

      {/* Summary Cards */}
      <div className="p-4 grid grid-cols-2 gap-2 border-b border-gray-100">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs text-blue-600">Total Due</p>
          <p className="text-xl font-bold text-blue-700">₹{summary.totalDue.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xs text-green-600">Total Paid</p>
          <p className="text-xl font-bold text-green-700">₹{summary.paid.toLocaleString()}</p>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-2 border-b border-gray-100">
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-xs text-yellow-600">Pending</p>
          <p className="text-xl font-bold text-yellow-700">₹{summary.pending.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <p className="text-xs text-red-600">Overdue</p>
          <p className="text-xl font-bold text-red-700">₹{summary.overdue.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'invoices' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Invoices
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'history' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Payment History
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[300px] overflow-y-auto custom-scroll">
        {activeTab === 'invoices' && (
          <div className="space-y-3">
            {paginatedInvoices.length === 0 ? (
              <div className="text-center py-8">
                <Wallet size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No invoices found</p>
              </div>
            ) : (
              paginatedInvoices.map((invoice, idx) => {
                const status = getStatusConfig(invoice.status)
                const isOverdue = invoice.status === 'overdue'
                return (
                  <div key={invoice.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{invoice.id}</p>
                        <p className="text-xs text-gray-500">{invoice.supplier}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                        {status.icon}
                        {status.label}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                      <div>Date: {formatDate(invoice.date)}</div>
                      <div>Due: {formatDate(invoice.dueDate)}</div>
                      <div>{invoice.items} items</div>
                      <div className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                        {invoice.status === 'paid' ? `Paid: ${formatDate(invoice.paidDate)}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-sm font-bold text-gray-900">₹{invoice.amount.toLocaleString()}</span>
                      <div className="flex gap-1">
                        {invoice.status !== 'paid' && (
                          <button
                            onClick={() => handleMakePayment(invoice)}
                            className="px-3 py-1 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
                          >
                            Pay Now
                          </button>
                        )}
                        <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote size={14} className="text-green-600" />
                <span className="text-sm font-medium">Payment to Fashion Hub</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">₹45,000</p>
                <p className="text-[10px] text-gray-500">10 Apr 2026</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote size={14} className="text-green-600" />
                <span className="text-sm font-medium">Payment to ElectroMart</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">₹28,000</p>
                <p className="text-[10px] text-gray-500">5 Apr 2026</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote size={14} className="text-green-600" />
                <span className="text-sm font-medium">Payment to TechGadgets</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">₹62,000</p>
                <p className="text-[10px] text-gray-500">28 Mar 2026</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {activeTab === 'invoices' && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {filteredInvoices.length} invoices
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

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Make Payment</h3>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Invoice</p>
                <p className="text-sm font-semibold">{selectedPayment.id} - {selectedPayment.supplier}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex-1 py-2 text-sm rounded-lg border transition-all ${paymentMethod === 'bank' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'}`}
                  >
                    Bank Transfer
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-2 text-sm rounded-lg border transition-all ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'}`}
                  >
                    Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-2 text-sm rounded-lg border transition-all ${paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'}`}
                  >
                    UPI
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs text-yellow-700">Payment will be processed within 24 hours</p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPayment}
                className="flex-1 px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}