"use client"

import React, { useState } from 'react'
import {
  Banknote,
  CreditCard,
  Building,
  MapPin,
  Copy,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  X,
  RefreshCw,
  Eye,
  EyeOff
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Settings/BankDetails.scss'

export default function BankDetails() {
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [copied, setCopied] = useState(false)

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: 'Rajesh Kumar',
    accountNumber: '1234567890123456',
    confirmAccountNumber: '1234567890123456',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank',
    branch: 'Indiranagar Branch',
    city: 'Bangalore',
    upiId: 'rajesh@okhdfcbank',
    accountType: 'Current'
  })

  const [editedDetails, setEditedDetails] = useState(bankDetails)

  const accountTypes = ['Current', 'Savings', 'Salary']

  const handleSave = () => {
    if (editedDetails.accountNumber !== editedDetails.confirmAccountNumber) {
      setSaveError(true)
      setTimeout(() => setSaveError(false), 3000)
      return
    }

    setSaveSuccess(false)
    setTimeout(() => {
      setBankDetails(editedDetails)
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
  }

  const handleCancel = () => {
    setEditedDetails(bankDetails)
    setIsEditing(false)
    setSaveError(false)
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const maskAccountNumber = (number) => {
    if (!number) return ''
    return 'XXXX XXXX XXXX ' + number.slice(-4)
  }

  return (
    <div className="bank-details bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Banknote size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Bank Details</h3>
            <p className="text-xs sm:text-sm text-gray-500">Manage your payout bank account and UPI details</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all"
          >
            <Edit size={14} />
            Edit Details
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 flex items-center gap-1"
            >
              <Save size={14} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Bank Account Details */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Banknote size={16} className="text-gray-500" />
              Bank Account Details
            </h4>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDetails.accountHolderName}
                    onChange={(e) => setEditedDetails({ ...editedDetails, accountHolderName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-900">{bankDetails.accountHolderName}</p>
                    <button
                      onClick={() => handleCopy(bankDetails.accountHolderName)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                {isEditing ? (
                  <select
                    value={editedDetails.accountType}
                    onChange={(e) => setEditedDetails({ ...editedDetails, accountType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    {accountTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">{bankDetails.accountType}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type={showAccountNumber ? 'text' : 'password'}
                      value={editedDetails.accountNumber}
                      onChange={(e) => setEditedDetails({ ...editedDetails, accountNumber: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                    />
                    <button
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showAccountNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono text-gray-900">{maskAccountNumber(bankDetails.accountNumber)}</p>
                    <button
                      onClick={() => handleCopy(bankDetails.accountNumber)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                )}
              </div>
              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Account Number</label>
                  <input
                    type="password"
                    value={editedDetails.confirmAccountNumber}
                    onChange={(e) => setEditedDetails({ ...editedDetails, confirmAccountNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDetails.ifscCode}
                    onChange={(e) => setEditedDetails({ ...editedDetails, ifscCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 uppercase"
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono text-gray-900">{bankDetails.ifscCode}</p>
                    <button
                      onClick={() => handleCopy(bankDetails.ifscCode)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDetails.bankName}
                    onChange={(e) => setEditedDetails({ ...editedDetails, bankName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{bankDetails.bankName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDetails.branch}
                    onChange={(e) => setEditedDetails({ ...editedDetails, branch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{bankDetails.branch}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDetails.city}
                    onChange={(e) => setEditedDetails({ ...editedDetails, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{bankDetails.city}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* UPI Details */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard size={16} className="text-gray-500" />
              UPI Details
            </h4>
          </div>
          <div className="p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedDetails.upiId}
                  onChange={(e) => setEditedDetails({ ...editedDetails, upiId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  placeholder="username@okhdfcbank"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-900">{bankDetails.upiId}</p>
                  <button
                    onClick={() => handleCopy(bankDetails.upiId)}
                    className="p-1 text-gray-400 hover:text-primary-600"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {saveSuccess && (
          <div className="p-3 bg-success-50 rounded-lg flex items-center gap-2">
            <CheckCircle size={16} className="text-success-600" />
            <p className="text-sm text-success-600">Bank details updated successfully!</p>
          </div>
        )}
        {saveError && (
          <div className="p-3 bg-error-50 rounded-lg flex items-center gap-2">
            <AlertCircle size={16} className="text-error-600" />
            <p className="text-sm text-error-600">Account numbers do not match. Please check and try again.</p>
          </div>
        )}
        {copied && (
          <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg animate-slide-up">
            Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  )
}