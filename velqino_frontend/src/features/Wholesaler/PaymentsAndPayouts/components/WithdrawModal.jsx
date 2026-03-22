"use client"

import React, { useState } from 'react'
import { X, Banknote, CreditCard, Wallet, CheckCircle, AlertCircle, RefreshCw } from '../../../../utils/icons'

export default function WithdrawModal({ onClose }) {
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('bank')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const availableBalance = 1245750

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) return
    if (parseFloat(amount) > availableBalance) return
    
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1500)
  }

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Request Withdrawal</h2>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 p-4 bg-primary-50 rounded-xl">
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-2xl font-bold text-primary-700">₹{availableBalance.toLocaleString()}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div className="space-y-2">
            {[
              { id: 'bank', name: 'Bank Account', icon: Banknote, details: 'HDFC Bank - XXXXXX1234' },
              { id: 'upi', name: 'UPI', icon: CreditCard, details: 'rajesh@okhdfcbank' },
              { id: 'wallet', name: 'Wallet', icon: Wallet, details: 'Paytm Wallet' }
            ].map(method => {
              const Icon = method.icon
              return (
                <button
                  key={method.id}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    selectedMethod === method.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={selectedMethod === method.id ? 'text-primary-600' : 'text-gray-500'} />
                    <div>
                      <p className="text-sm font-medium">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.details}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={!amount || processing}
          className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Processing...
            </>
          ) : success ? (
            <>
              <CheckCircle size={16} />
              Request Sent!
            </>
          ) : (
            'Request Withdrawal'
          )}
        </button>
      </div>
    </div>
  )
}