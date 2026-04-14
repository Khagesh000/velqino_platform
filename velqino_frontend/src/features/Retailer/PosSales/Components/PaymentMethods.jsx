"use client"

import React, { useState, useEffect } from 'react'
import { CreditCard, Wallet, Smartphone, Banknote, PieChart, Calendar, Check, Shield, Lock } from '../../../../utils/icons'
import '../../../../styles/Retailer/PosSales/PaymentMethods.scss'

export default function PaymentMethods({ selectedPayment, setSelectedPayment, totalAmount = 0 }) {
  const [mounted, setMounted] = useState(false)
  const [splitAmounts, setSplitAmounts] = useState({})
  const [showSplit, setShowSplit] = useState(false)
  const [selectedSplitMethod, setSelectedSplitMethod] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: <Banknote size={20} />, color: 'green', description: 'Pay with cash' },
    { id: 'card', name: 'Card', icon: <CreditCard size={20} />, color: 'blue', description: 'Credit/Debit Card' },
    { id: 'upi', name: 'UPI', icon: <Smartphone size={20} />, color: 'purple', description: 'Google Pay, PhonePe, Paytm' },
    { id: 'wallet', name: 'Wallet', icon: <Wallet size={20} />, color: 'orange', description: 'Store credit / Gift card' },
    { id: 'split', name: 'Split Payment', icon: <PieChart size={20} />, color: 'pink', description: 'Split between methods' },
    { id: 'credit', name: 'Credit', icon: <Calendar size={20} />, color: 'indigo', description: 'Buy now, pay later' },
  ]

  const getColorClasses = (color, isSelected) => {
    const colors = {
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', selected: 'ring-green-500' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', selected: 'ring-blue-500' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', selected: 'ring-purple-500' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', selected: 'ring-orange-500' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600', selected: 'ring-pink-500' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', selected: 'ring-indigo-500' },
    }
    return colors[color] || colors.blue
  }

  const handlePaymentSelect = (methodId) => {
    if (methodId === 'split') {
      setShowSplit(!showSplit)
      setSelectedPayment('split')
    } else {
      setSelectedPayment(methodId)
      setShowSplit(false)
    }
  }

  const updateSplitAmount = (methodId, amount) => {
    setSplitAmounts({ ...splitAmounts, [methodId]: parseFloat(amount) || 0 })
  }

  const totalSplitAmount = Object.values(splitAmounts).reduce((sum, amt) => sum + amt, 0)
  const remainingAmount = totalAmount - totalSplitAmount
  const isSplitComplete = Math.abs(remainingAmount) < 0.01

  return (
    <div className="payment-methods bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Payment Methods</h3>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Lock size={10} />
            <span>Secure Payment</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Select payment method for this transaction</p>
      </div>

      {/* Payment Methods Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {paymentMethods.map((method) => {
            const colors = getColorClasses(method.color, selectedPayment === method.id)
            return (
              <button
                key={method.id}
                onClick={() => handlePaymentSelect(method.id)}
                className={`payment-method-card p-3 rounded-xl border-2 transition-all text-left ${
                  selectedPayment === method.id 
                    ? `${colors.bg} ${colors.border} ring-2 ${colors.selected} ring-offset-0` 
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center mb-2`}>
                  <span className={colors.text}>{method.icon}</span>
                </div>
                <p className={`text-sm font-semibold ${selectedPayment === method.id ? colors.text : 'text-gray-900'}`}>
                  {method.name}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{method.description}</p>
                {selectedPayment === method.id && (
                  <div className="mt-2 flex items-center gap-1">
                    <Check size={12} className={colors.text} />
                    <span className={`text-[10px] ${colors.text}`}>Selected</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Split Payment Section */}
      {showSplit && (
        <div className="split-payment border-t border-gray-100 p-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PieChart size={16} className="text-pink-500" />
              <span className="text-sm font-semibold text-gray-900">Split Payment</span>
            </div>
            <span className="text-xs text-gray-500">Total: ₹{totalAmount.toLocaleString()}</span>
          </div>

          <div className="space-y-3">
            {['cash', 'card', 'upi', 'wallet'].map((method) => {
              const methodNames = { cash: 'Cash', card: 'Card', upi: 'UPI', wallet: 'Wallet' }
              return (
                <div key={method} className="flex items-center gap-3">
                  <div className="w-20">
                    <span className="text-xs font-medium text-gray-700">{methodNames[method]}</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={splitAmounts[method] || ''}
                      onChange={(e) => updateSplitAmount(method, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-xs text-gray-500">₹</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 p-3 bg-pink-50 rounded-lg">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Total Allocated</span>
              <span className="font-medium">₹{totalSplitAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining</span>
              <span className={`font-medium ${remainingAmount > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                ₹{remainingAmount.toLocaleString()}
              </span>
            </div>
            {!isSplitComplete && remainingAmount > 0 && (
              <p className="text-[10px] text-orange-500 mt-2">Please allocate remaining amount</p>
            )}
          </div>
        </div>
      )}

      {/* Security Note */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
          <Lock size={12} />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </div>
  )
}