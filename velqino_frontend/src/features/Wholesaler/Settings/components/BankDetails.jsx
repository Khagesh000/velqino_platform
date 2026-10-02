"use client"

import React, { useState, useEffect } from 'react'
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
  EyeOff,
  Shield,
  Sparkles
} from '@/utils/icons'
import { useUpdateProfileMutation } from '@/redux/wholesaler/slices/wholesalerSlice'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/Settings/BankDetails.scss'

export default function BankDetails({ wholesaler, isLoading: parentLoading }) {
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [copiedField, setCopiedField] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branch: '',
    city: '',
    upiId: '',
    accountType: 'Current'
  })

  const [editedDetails, setEditedDetails] = useState(bankDetails)

  const accountTypes = ['Current', 'Savings', 'Salary']

  // Load bank details from backend
  useEffect(() => {
    if (wholesaler?.bank_details) {
      const bankData = wholesaler.bank_details
      const initial = {
        accountHolderName: bankData.account_holder_name || '',
        accountNumber: bankData.account_number || '',
        confirmAccountNumber: bankData.account_number || '',
        ifscCode: bankData.ifsc_code || '',
        bankName: bankData.bank_name || '',
        branch: bankData.branch || '',
        city: bankData.city || '',
        upiId: bankData.upi_id || '',
        accountType: bankData.account_type || 'Current'
      }
      setBankDetails(initial)
      setEditedDetails(initial)
    }
  }, [wholesaler])

  const handleSave = async () => {
    if (editedDetails.accountNumber !== editedDetails.confirmAccountNumber) {
      setSaveError(true)
      toast.error('Account numbers do not match! Please check and confirm.')
      setTimeout(() => setSaveError(false), 3000)
      return
    }

    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('bank_details', JSON.stringify({
        account_holder_name: editedDetails.accountHolderName,
        account_number: editedDetails.accountNumber,
        ifsc_code: editedDetails.ifscCode,
        bank_name: editedDetails.bankName,
        branch: editedDetails.branch,
        city: editedDetails.city,
        upi_id: editedDetails.upiId,
        account_type: editedDetails.accountType
      }))

      const userId = wholesaler?.user_id || wholesaler?.id
      await updateProfile({ userId: userId, data: formData }).unwrap()
      
      setBankDetails(editedDetails)
      setSaveSuccess(true)
      toast.success('Settlement bank details updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update bank details')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedDetails(bankDetails)
    setIsEditing(false)
    setSaveError(false)
  }

  const handleCopy = (text, fieldName) => {
    if (text) {
      navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast.info(`Copied ${fieldName} to clipboard!`)
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  const maskAccountNumber = (number) => {
    if (!number) return ''
    if (number.length <= 4) return number
    return '•••• •••• •••• ' + number.slice(-4)
  }

  if (parentLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
        <div className="h-48 bg-slate-100 rounded-2xl mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-14 bg-slate-100 rounded-xl"></div>
          <div className="h-14 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    )
  }

  const isConfigured = Boolean(bankDetails.accountNumber || bankDetails.upiId)

  return (
    <div className="bank-details space-y-6">
      {/* Executive Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100/60 shadow-2xs">
            <Banknote size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Bank & Settlement Accounts
              </h3>
              {isConfigured ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <CheckCircle size={11} /> Verified Settlement
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                  <AlertCircle size={11} /> Setup Pending
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              Direct payout destination for wholesale order sales, weekly disbursements, and refunds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Edit size={15} />
              <span>Edit Details</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCancel}
                disabled={isSaving || isUpdating}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl shadow-xs transition-all disabled:opacity-50 active:scale-95"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || isUpdating}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50 active:scale-95"
              >
                {isSaving || isUpdating ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Visual Executive Bank Card Display */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
        {/* Subtle background ornamentation */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col justify-between min-h-[170px] space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-primary-300">
                <Banknote size={22} />
              </div>
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Primary Settlement Account</span>
                <h4 className="text-lg font-bold tracking-tight text-white">
                  {editedDetails.bankName || 'Partner Bank Account'}
                </h4>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-300 border border-white/10 backdrop-blur-md">
              <Shield size={12} /> {editedDetails.accountType || 'Current'} Account
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <p className="text-xl sm:text-2xl font-mono tracking-wider font-semibold text-slate-100">
                {editedDetails.accountNumber
                  ? showAccountNumber
                    ? editedDetails.accountNumber
                    : maskAccountNumber(editedDetails.accountNumber)
                  : '•••• •••• •••• ••••'}
              </p>
              {editedDetails.accountNumber && (
                <button
                  type="button"
                  onClick={() => setShowAccountNumber(!showAccountNumber)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  title={showAccountNumber ? 'Hide Account Number' : 'Show Account Number'}
                >
                  {showAccountNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <p className="text-2xs uppercase tracking-wider text-slate-400 font-medium">Beneficiary Name</p>
              <p className="font-bold text-white tracking-wide">
                {editedDetails.accountHolderName || 'Authorized Merchant'}
              </p>
            </div>
            <div>
              <p className="text-2xs uppercase tracking-wider text-slate-400 font-medium">IFSC Code</p>
              <p className="font-mono font-bold text-primary-300 tracking-wider">
                {editedDetails.ifscCode || 'IFSC UNSET'}
              </p>
            </div>
            <div>
              <p className="text-2xs uppercase tracking-wider text-slate-400 font-medium">Branch / City</p>
              <p className="font-medium text-slate-200">
                {editedDetails.branch ? `${editedDetails.branch}, ${editedDetails.city || ''}` : 'Location Unset'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bank Account Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
        {/* Section 1: Bank Account Details */}
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Banknote size={16} className="text-primary-600" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Account Specification
              </h4>
            </div>
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider">NEFT / RTGS / IMPS</span>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Holder Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDetails.accountHolderName}
                    onChange={(e) => setEditedDetails({ ...editedDetails, accountHolderName: e.target.value })}
                    placeholder="Exact name as in bank passbook"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-semibold text-slate-900">{bankDetails.accountHolderName || '-'}</p>
                    {bankDetails.accountHolderName && (
                      <button
                        onClick={() => handleCopy(bankDetails.accountHolderName, 'Holder Name')}
                        className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                        title="Copy Holder Name"
                      >
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Type
                </label>
                {isEditing ? (
                  <select
                    value={editedDetails.accountType}
                    onChange={(e) => setEditedDetails({ ...editedDetails, accountType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  >
                    {accountTypes.map(type => (
                      <option key={type} value={type}>{type} Account</option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-semibold text-slate-900">{bankDetails.accountType || 'Current'} Account</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Number
                </label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type={showAccountNumber ? 'text' : 'password'}
                      value={editedDetails.accountNumber}
                      onChange={(e) => setEditedDetails({ ...editedDetails, accountNumber: e.target.value })}
                      placeholder="Enter bank account number"
                      className="w-full px-3.5 py-2.5 pr-10 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showAccountNumber ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-mono font-semibold text-slate-900">
                      {bankDetails.accountNumber ? maskAccountNumber(bankDetails.accountNumber) : '-'}
                    </p>
                    {bankDetails.accountNumber && (
                      <button
                        onClick={() => handleCopy(bankDetails.accountNumber, 'Account Number')}
                        className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                        title="Copy Account Number"
                      >
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {isEditing ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Account Number
                  </label>
                  <input
                    type="password"
                    value={editedDetails.confirmAccountNumber}
                    onChange={(e) => setEditedDetails({ ...editedDetails, confirmAccountNumber: e.target.value })}
                    placeholder="Re-enter account number"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    IFSC Code
                  </label>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-mono font-semibold text-slate-900">{bankDetails.ifscCode || '-'}</p>
                    {bankDetails.ifscCode && (
                      <button
                        onClick={() => handleCopy(bankDetails.ifscCode, 'IFSC Code')}
                        className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                        title="Copy IFSC Code"
                      >
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={editedDetails.ifscCode}
                    onChange={(e) => setEditedDetails({ ...editedDetails, ifscCode: e.target.value.toUpperCase() })}
                    placeholder="HDFC0001234"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={editedDetails.bankName}
                    onChange={(e) => setEditedDetails({ ...editedDetails, bankName: e.target.value })}
                    placeholder="e.g. HDFC Bank, State Bank of India"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!isEditing && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bank Name
                  </label>
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-semibold text-slate-900">{bankDetails.bankName || '-'}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Branch Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDetails.branch}
                    onChange={(e) => setEditedDetails({ ...editedDetails, branch: e.target.value })}
                    placeholder="Branch name or code"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-semibold text-slate-900">{bankDetails.branch || '-'}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Branch City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDetails.city}
                    onChange={(e) => setEditedDetails({ ...editedDetails, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-semibold text-slate-900">{bankDetails.city || '-'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: UPI Details */}
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-primary-600" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                UPI Virtual Payment Address (VPA)
              </h4>
            </div>
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider">Instant Payouts</span>
          </div>

          <div className="p-4 sm:p-5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Unified Payments Interface (UPI ID)
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedDetails.upiId}
                onChange={(e) => setEditedDetails({ ...editedDetails, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
                placeholder="merchant@okhdfcbank or business@paytm"
              />
            ) : (
              <div className="flex items-center justify-between p-3 bg-slate-50/70 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                    UPI
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{bankDetails.upiId || 'No UPI ID registered'}</p>
                    <p className="text-2xs text-slate-400 font-medium">Eligible for real-time instant disbursements</p>
                  </div>
                </div>
                {bankDetails.upiId && (
                  <button
                    onClick={() => handleCopy(bankDetails.upiId, 'UPI ID')}
                    className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors"
                    title="Copy UPI ID"
                  >
                    <Copy size={15} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Success/Error Banners */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-emerald-800">
              Bank settlement details updated and encrypted securely.
            </p>
          </div>
        )}

        {saveError && (
          <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-xl flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-rose-800">
              Account numbers do not match. Please verify both fields before proceeding.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
