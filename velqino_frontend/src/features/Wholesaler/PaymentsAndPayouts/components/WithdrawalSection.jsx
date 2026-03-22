"use client"

import React, { useState } from 'react'
import {
  Wallet,
  ArrowUp,
  Banknote,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Calendar,
  History,
  Plus,
  Trash2,
  Edit
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/PaymentsPayouts/WithdrawalSection.scss'

export default function WithdrawalSection({ onWithdraw }) {
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('bank')
  const [showHistory, setShowHistory] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)

  const availableBalance = 1245750

  const paymentMethods = [
    {
      id: 'bank',
      name: 'Bank Account',
      icon: Banknote,
      details: 'HDFC Bank - XXXXXX1234',
      processingTime: '1-3 business days',
      minAmount: 1000,
      maxAmount: 500000
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: CreditCard,
      details: 'rajesh@okhdfcbank',
      processingTime: 'Instant - 24 hours',
      minAmount: 100,
      maxAmount: 100000
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: Wallet,
      details: 'Paytm Wallet - +91 98765 43210',
      processingTime: 'Instant',
      minAmount: 100,
      maxAmount: 50000
    }
  ]

  const withdrawalHistory = [
    { id: 'WDR-001', date: '2024-03-15', amount: 50000, method: 'Bank Account', status: 'Completed', reference: 'PAYOUT-001' },
    { id: 'WDR-002', date: '2024-03-01', amount: 25000, method: 'UPI', status: 'Completed', reference: 'PAYOUT-002' },
    { id: 'WDR-003', date: '2024-02-15', amount: 100000, method: 'Bank Account', status: 'Completed', reference: 'PAYOUT-003' },
    { id: 'WDR-004', date: '2024-02-01', amount: 15000, method: 'Wallet', status: 'Processing', reference: 'PAYOUT-004' }
  ]

  const currentMethod = paymentMethods.find(m => m.id === selectedMethod)

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount < currentMethod.minAmount) {
      alert(`Minimum withdrawal amount is ₹${currentMethod.minAmount}`)
      return
    }
    if (amount > availableBalance) {
      alert('Insufficient balance')
      return
    }
    if (amount > currentMethod.maxAmount) {
      alert(`Maximum withdrawal amount is ₹${currentMethod.maxAmount}`)
      return
    }

    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setWithdrawSuccess(true)
      setTimeout(() => {
        setWithdrawSuccess(false)
        setWithdrawAmount('')
        onWithdraw?.()
      }, 2000)
    }, 2000)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="withdrawal-section bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <ArrowUp size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Request Withdrawal</h3>
              <p className="text-xs sm:text-sm text-gray-500">Withdraw your earnings to your preferred payment method</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-all"
          >
            <History size={14} />
            <span className="hidden sm:inline">Withdrawal History</span>
            <ChevronDown size={14} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="p-4 sm:p-6">
        {/* Available Balance */}
        <div className="mb-6 p-4 bg-primary-50 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet size={24} className="text-primary-600" />
            <div>
              <p className="text-xs text-primary-600">Available Balance</p>
              <p className="text-2xl font-bold text-primary-700">{formatCurrency(availableBalance)}</p>
            </div>
          </div>
          <button className="text-xs text-primary-600 hover:text-primary-700">
            View Details
          </button>
        </div>

        {/* Withdrawal Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Withdrawal Amount <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[1000, 5000, 10000, 25000, 50000].map(amount => (
              <button
                key={amount}
                onClick={() => setWithdrawAmount(amount.toString())}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-primary-100 hover:text-primary-700 transition-all"
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {paymentMethods.map(method => {
              const Icon = method.icon
              const isSelected = selectedMethod === method.id
              return (
                <button
                  key={method.id}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} className={isSelected ? 'text-primary-600' : 'text-gray-500'} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                      {method.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{method.details}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Processing Time Info */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <p className="text-xs text-gray-600">
            Processing Time: <span className="font-medium">{currentMethod?.processingTime}</span>
          </p>
        </div>

        {/* Min/Max Amount Info */}
        <div className="mb-6 text-xs text-gray-500 flex items-center gap-4">
          <span>Min: ₹{currentMethod?.minAmount}</span>
          <span>Max: ₹{currentMethod?.maxAmount}</span>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          disabled={!withdrawAmount || processing}
          className="w-full py-3 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : withdrawSuccess ? (
            <>
              <CheckCircle size={18} />
              Withdrawal Requested!
            </>
          ) : (
            <>
              <ArrowUp size={18} />
              Request Withdrawal
            </>
          )}
        </button>
      </div>

      {/* Withdrawal History */}
      {showHistory && (
        <div className="border-t border-gray-200">
          <div className="p-4 sm:p-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <History size={16} />
              Withdrawal History
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Method</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {withdrawalHistory.map(history => (
                    <tr key={history.id} className="hover:bg-gray-50 transition-all">
                      <td className="px-3 py-2 text-xs text-gray-600">{history.date}</td>
                      <td className="px-3 py-2 text-xs font-medium text-gray-900">{formatCurrency(history.amount)}</td>
                      <td className="px-3 py-2 text-xs text-gray-600">{history.method}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          history.status === 'Completed' 
                            ? 'bg-success-100 text-success-700' 
                            : 'bg-warning-100 text-warning-700'
                        }`}>
                          {history.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-500">{history.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-3 text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}