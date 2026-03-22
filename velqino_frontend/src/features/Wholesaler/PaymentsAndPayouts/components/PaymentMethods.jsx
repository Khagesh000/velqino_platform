"use client"

import React, { useState } from 'react'
import {
  Banknote,
  CreditCard,
  Wallet,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  MoreVertical,
  X,
  Star,
  ChevronDown
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/PaymentsPayouts/PaymentMethods.scss'

export default function PaymentMethods() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [newMethod, setNewMethod] = useState({
    type: 'bank',
    name: '',
    details: '',
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    walletNumber: ''
  })

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'bank',
      name: 'HDFC Bank',
      details: 'XXXX1234',
      accountHolder: 'Rajesh Kumar',
      bankName: 'HDFC Bank',
      accountNumber: 'XXXX1234',
      ifscCode: 'HDFC0001234',
      isDefault: true,
      icon: Banknote
    },
    {
      id: 2,
      type: 'upi',
      name: 'Google Pay',
      details: 'rajesh@okhdfcbank',
      upiId: 'rajesh@okhdfcbank',
      isDefault: false,
      icon: CreditCard
    },
    {
      id: 3,
      type: 'wallet',
      name: 'Paytm Wallet',
      details: '+91 98765 43210',
      walletNumber: '+91 98765 43210',
      isDefault: false,
      icon: Wallet
    }
  ])

  const methodTypes = [
    { id: 'bank', label: 'Bank Account', icon: Banknote, description: 'Add bank account for withdrawals' },
    { id: 'upi', label: 'UPI ID', icon: CreditCard, description: 'Add UPI ID for instant payments' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, description: 'Add mobile wallet' }
  ]

  const handleSetDefault = (id) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    )
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(methods => methods.filter(method => method.id !== id))
    }
  }

  const handleAdd = () => {
    const newId = Math.max(...paymentMethods.map(m => m.id), 0) + 1
    const methodType = methodTypes.find(t => t.id === newMethod.type)
    
    let details = ''
    if (newMethod.type === 'bank') {
      details = `${newMethod.bankName} - ${newMethod.accountNumber}`
    } else if (newMethod.type === 'upi') {
      details = newMethod.upiId
    } else {
      details = newMethod.walletNumber
    }

    const newPaymentMethod = {
      id: newId,
      type: newMethod.type,
      name: newMethod.name,
      details: details,
      accountHolder: newMethod.accountHolder,
      bankName: newMethod.bankName,
      accountNumber: newMethod.accountNumber,
      ifscCode: newMethod.ifscCode,
      upiId: newMethod.upiId,
      walletNumber: newMethod.walletNumber,
      isDefault: paymentMethods.length === 0,
      icon: methodType.icon
    }

    setPaymentMethods([...paymentMethods, newPaymentMethod])
    setShowAddModal(false)
    setNewMethod({
      type: 'bank',
      name: '',
      details: '',
      accountHolder: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
      walletNumber: ''
    })
  }

  const handleEdit = () => {
    setPaymentMethods(methods =>
      methods.map(method => {
        if (method.id === selectedMethod.id) {
          return {
            ...method,
            name: newMethod.name,
            details: newMethod.type === 'bank' 
              ? `${newMethod.bankName} - ${newMethod.accountNumber}`
              : newMethod.type === 'upi' ? newMethod.upiId : newMethod.walletNumber,
            accountHolder: newMethod.accountHolder,
            bankName: newMethod.bankName,
            accountNumber: newMethod.accountNumber,
            ifscCode: newMethod.ifscCode,
            upiId: newMethod.upiId,
            walletNumber: newMethod.walletNumber
          }
        }
        return method
      })
    )
    setShowEditModal(false)
    setSelectedMethod(null)
  }

  const openEditModal = (method) => {
    setSelectedMethod(method)
    setNewMethod({
      type: method.type,
      name: method.name,
      details: method.details,
      accountHolder: method.accountHolder || '',
      bankName: method.bankName || '',
      accountNumber: method.accountNumber || '',
      ifscCode: method.ifscCode || '',
      upiId: method.upiId || '',
      walletNumber: method.walletNumber || ''
    })
    setShowEditModal(true)
  }

  return (
    <div className="payment-methods bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Banknote size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Methods</h3>
            <p className="text-xs sm:text-sm text-gray-500">Manage your withdrawal payment options</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-xs sm:text-sm rounded-lg hover:bg-primary-600 transition-all"
        >
          <Plus size={14} />
          Add Method
        </button>
      </div>

      {/* Methods List */}
      <div className="p-4 sm:p-6 space-y-3">
        {paymentMethods.map((method, index) => {
          const Icon = method.icon
          return (
            <div
              key={method.id}
              className={`payment-method-item p-4 rounded-xl border-2 transition-all ${
                method.isDefault ? 'border-primary-200 bg-primary-50/30' : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    method.isDefault ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{method.name}</h4>
                      {method.isDefault && (
                        <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 text-xxs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{method.details}</p>
                    {method.type === 'bank' && method.accountHolder && (
                      <p className="text-xxs text-gray-400">Holder: {method.accountHolder}</p>
                    )}
                    {method.type === 'bank' && method.ifscCode && (
                      <p className="text-xxs text-gray-400">IFSC: {method.ifscCode}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      title="Set as default"
                    >
                      <Star size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(method)}
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {paymentMethods.length === 0 && (
          <div className="text-center py-8">
            <Banknote size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No payment methods added</p>
            <p className="text-xs text-gray-400 mt-1">Add a payment method to withdraw funds</p>
          </div>
        )}
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-xl max-w-lg w-full p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Payment Method</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Method Type</label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {methodTypes.map(type => {
                    const Icon = type.icon
                    const isSelected = newMethod.type === type.id
                    return (
                      <button
                        key={type.id}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                          isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                        }`}
                        onClick={() => setNewMethod({ ...newMethod, type: type.id })}
                      >
                        <Icon size={20} className={`mx-auto mb-1 ${isSelected ? 'text-primary-600' : 'text-gray-500'}`} />
                        <p className={`text-xs font-medium ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>{type.label}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {newMethod.type === 'bank' && (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
        <input
          type="text"
          value={newMethod.bankName}
          onChange={(e) => setNewMethod({ ...newMethod, bankName: e.target.value, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
          placeholder="e.g., HDFC Bank"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
        <input
          type="text"
          value={newMethod.accountNumber}
          onChange={(e) => setNewMethod({ ...newMethod, accountNumber: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
          placeholder="XXXX XXXX XXXX 1234"
        />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
        <input
          type="text"
          value={newMethod.accountHolder}
          onChange={(e) => setNewMethod({ ...newMethod, accountHolder: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
          placeholder="As per bank account"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
        <input
          type="text"
          value={newMethod.ifscCode}
          onChange={(e) => setNewMethod({ ...newMethod, ifscCode: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
          placeholder="e.g., HDFC0001234"
        />
      </div>
    </div>
  </>
)}

              {newMethod.type === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={newMethod.upiId}
                    onChange={(e) => setNewMethod({ ...newMethod, upiId: e.target.value, name: 'UPI', details: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                    placeholder="username@okhdfcbank"
                  />
                </div>
              )}

              {newMethod.type === 'wallet' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Number</label>
                  <input
                    type="text"
                    value={newMethod.walletNumber}
                    onChange={(e) => setNewMethod({ ...newMethod, walletNumber: e.target.value, name: 'Wallet', details: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 sm:pt-4">
  <button
    onClick={() => setShowAddModal(false)}
    className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
  >
    Cancel
  </button>
  <button
    onClick={handleAdd}
    className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600"
  >
    Add Method
  </button>
</div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Method Modal */}
      {showEditModal && selectedMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-xl max-w-lg w-full p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Payment Method</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {selectedMethod.type === 'bank' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={newMethod.bankName}
                      onChange={(e) => setNewMethod({ ...newMethod, bankName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={newMethod.accountNumber}
                      onChange={(e) => setNewMethod({ ...newMethod, accountNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={newMethod.accountHolder}
                      onChange={(e) => setNewMethod({ ...newMethod, accountHolder: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={newMethod.ifscCode}
                      onChange={(e) => setNewMethod({ ...newMethod, ifscCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </>
              )}

              {selectedMethod.type === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={newMethod.upiId}
                    onChange={(e) => setNewMethod({ ...newMethod, upiId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              )}

              {selectedMethod.type === 'wallet' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Number</label>
                  <input
                    type="text"
                    value={newMethod.walletNumber}
                    onChange={(e) => setNewMethod({ ...newMethod, walletNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 sm:pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}