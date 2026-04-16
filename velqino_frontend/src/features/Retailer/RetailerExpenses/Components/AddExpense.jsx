"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Plus, Upload, X, Calendar, Tag, CreditCard, FileText, AlertCircle, CheckCircle, RefreshCw } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerExpenses/AddExpense.scss'

export default function AddExpense({ onComplete }) {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    paymentMethod: 'cash',
    notes: ''
  })
  const [receiptFile, setReceiptFile] = useState(null)
  const [receiptPreview, setReceiptPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const categories = [
    { id: 1, name: 'Rent', icon: '🏢', color: 'blue' },
    { id: 2, name: 'Staff Salary', icon: '👥', color: 'purple' },
    { id: 3, name: 'Electricity', icon: '⚡', color: 'yellow' },
    { id: 4, name: 'Marketing', icon: '📢', color: 'pink' },
    { id: 5, name: 'Supplies', icon: '📦', color: 'orange' },
    { id: 6, name: 'Internet', icon: '🌐', color: 'green' },
    { id: 7, name: 'Maintenance', icon: '🔧', color: 'gray' },
  ]

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: '💵' },
    { id: 'card', label: 'Card', icon: '💳' },
    { id: 'upi', label: 'UPI', icon: '📱' },
    { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
  ]

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setReceiptFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeReceipt = () => {
    setReceiptFile(null)
    setReceiptPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!formData.category || !formData.amount) {
      alert('Please fill category and amount')
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setShowSuccess(true)
    
    setTimeout(() => {
      setShowSuccess(false)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: '',
        amount: '',
        paymentMethod: 'cash',
        notes: ''
      })
      removeReceipt()
      if (onComplete) onComplete()
    }, 2000)
  }

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: '',
      paymentMethod: 'cash',
      notes: ''
    })
    removeReceipt()
  }

  const getCategoryColor = (color) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
      purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
      yellow: 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100',
      pink: 'border-pink-200 bg-pink-50 hover:bg-pink-100',
      orange: 'border-orange-200 bg-orange-50 hover:bg-orange-100',
      green: 'border-green-200 bg-green-50 hover:bg-green-100',
      gray: 'border-gray-200 bg-gray-50 hover:bg-gray-100',
    }
    return colors[color] || colors.gray
  }

  if (showSuccess) {
    return (
      <div className="add-expense bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Expense Added!</h3>
          <p className="text-sm text-gray-500">Expense recorded successfully</p>
          <p className="text-xs text-gray-400 mt-2">₹{parseInt(formData.amount).toLocaleString()} - {categories.find(c => c.name === formData.category)?.name}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="add-expense bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Add Expense</h3>
          </div>
          <button onClick={handleReset} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
            <RefreshCw size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Quick expense entry with receipt upload</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleInputChange('category', cat.name)}
                className={`p-2 rounded-lg border text-left transition-all flex items-center gap-2 ${
                  formData.category === cat.name
                    ? `${getCategoryColor(cat.color)} border-primary-500 ring-2 ring-primary-100`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Amount (₹)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
          <div className="flex gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handleInputChange('paymentMethod', method.id)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                  formData.paymentMethod === method.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{method.icon}</span>
                <span>{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Receipt Upload */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Receipt (Optional)</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-primary-300 transition-all">
            {!receiptPreview ? (
              <>
                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">Click to upload receipt</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="receipt-upload"
                />
                <label htmlFor="receipt-upload" className="cursor-pointer inline-block mt-2 px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all">
                  Choose File
                </label>
              </>
            ) : (
              <div className="relative">
                <img src={receiptPreview} alt="Receipt preview" className="max-h-32 mx-auto rounded-lg" />
                <button
                  onClick={removeReceipt}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Notes (Optional)</label>
          <textarea
            rows={2}
            placeholder="Additional notes about this expense"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.category || !formData.amount}
          className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            isSubmitting || !formData.category || !formData.amount
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          {isSubmitting ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Adding Expense...</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Add Expense</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}