"use client"

import React, { useState, useEffect } from 'react'
import { Receipt, Printer, Download, CheckCircle, AlertCircle, Wallet, CreditCard, Smartphone, Banknote } from '../../../../utils/icons'
import '../../../../styles/Retailer/PosSales/BillSummary.scss'

export default function BillSummary({ cart, discount, setDiscount, selectedPayment, onComplete }) {
  const [mounted, setMounted] = useState(false)
  const [amountPaid, setAmountPaid] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Calculate tax (18% GST)
  const taxRate = 0.18
  const cgst = subtotal * 0.09
  const sgst = subtotal * 0.09
  const totalTax = cgst + sgst
  
  // Calculate discount
  let discountAmount = 0
  if (discount.type === 'percentage') {
    discountAmount = (subtotal * discount.value) / 100
  } else if (discount.type === 'fixed') {
    discountAmount = Math.min(discount.value, subtotal)
  }
  
  const total = subtotal + totalTax - discountAmount
  const balance = amountPaid - total
  const isFullyPaid = amountPaid >= total && total > 0

  const handleAmountPaid = (value) => {
    const paid = parseFloat(value) || 0
    setAmountPaid(paid)
  }

  const handleQuickAmount = (percentage) => {
    const amount = (total * percentage) / 100
    setAmountPaid(Math.min(amount, total))
  }

  const handleCompletePayment = async () => {
    if (!isFullyPaid) {
      alert('Please enter valid payment amount')
      return
    }
    
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setShowSuccess(true)
      
      // Reset after success
      setTimeout(() => {
        setShowSuccess(false)
        if (onComplete) onComplete()
      }, 2000)
    }, 1500)
  }

  const getPaymentIcon = () => {
    switch(selectedPayment) {
      case 'cash': return <Banknote size={20} className="text-green-600" />
      case 'card': return <CreditCard size={20} className="text-blue-600" />
      case 'upi': return <Smartphone size={20} className="text-purple-600" />
      case 'wallet': return <Wallet size={20} className="text-orange-600" />
      default: return <Wallet size={20} className="text-gray-600" />
    }
  }

  const getPaymentName = () => {
    switch(selectedPayment) {
      case 'cash': return 'Cash'
      case 'card': return 'Card'
      case 'upi': return 'UPI'
      case 'wallet': return 'Wallet'
      default: return 'Select Payment'
    }
  }

  if (showSuccess) {
    return (
      <div className="bill-summary bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Payment Successful!</h3>
          <p className="text-sm text-gray-500">Transaction completed successfully</p>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Receipt sent to customer</p>
            <p className="text-xs text-gray-400 mt-1">Transaction ID: TXN{Date.now()}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bill-summary bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Bill Summary</h3>
          </div>
          <div className="flex gap-1">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <Printer size={14} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Amount Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">CGST (9%)</span>
            <span className="font-medium text-gray-900">₹{cgst.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">SGST (9%)</span>
            <span className="font-medium text-gray-900">₹{sgst.toLocaleString()}</span>
          </div>
          
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">-₹{discountAmount.toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-base font-bold text-primary-600">₹{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Method Display */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getPaymentIcon()}
              <span className="text-sm font-medium text-gray-700">{getPaymentName()}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {selectedPayment ? 'Selected' : 'Not selected'}
            </span>
          </div>
        </div>

        {/* Amount Paid Input */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Amount Paid</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              placeholder="0.00"
              value={amountPaid || ''}
              onChange={(e) => handleAmountPaid(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => handleQuickAmount(100)}
              className="flex-1 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              Full Amount
            </button>
            <button 
              onClick={() => handleQuickAmount(50)}
              className="flex-1 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              50%
            </button>
            <button 
              onClick={() => handleQuickAmount(25)}
              className="flex-1 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              25%
            </button>
          </div>
        </div>

        {/* Balance */}
        {amountPaid > 0 && (
          <div className={`p-3 rounded-lg ${balance >= 0 ? 'bg-green-50' : 'bg-red-50'} animate-fadeIn`}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Balance</span>
              <div className="text-right">
                <span className={`text-lg font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(balance).toLocaleString()}
                </span>
                <p className="text-[10px] text-gray-500">
                  {balance >= 0 ? 'To be returned' : 'Still due'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Complete Payment Button */}
        <button
          onClick={handleCompletePayment}
          disabled={!selectedPayment || !isFullyPaid || cart.length === 0 || isProcessing}
          className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            !selectedPayment || !isFullyPaid || cart.length === 0 || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle size={18} />
              <span>Complete Payment</span>
            </>
          )}
        </button>

        {/* Tax Info */}
        <p className="text-[10px] text-gray-400 text-center">
          *Taxes calculated as per GST rules
        </p>
      </div>
    </div>
  )
}