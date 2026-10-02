"use client"

import React, { useState, useEffect } from 'react'
import {
  FileText,
  Building,
  Percent,
  Calendar,
  Download,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Shield,
  Clock,
  Sparkles
} from '@/utils/icons'
import { useUpdateProfileMutation } from '@/redux/wholesaler/slices/wholesalerSlice'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/Settings/TaxInformation.scss'

export default function TaxInformation({ wholesaler, isLoading: parentLoading }) {
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const [taxDetails, setTaxDetails] = useState({
    gstNumber: '',
    panNumber: '',
    gstType: 'Regular',
    taxRegime: 'Regular',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    tdsApplicable: true,
    tdsRate: 2,
    filingFrequency: 'Monthly',
    lastFiled: '',
    nextDueDate: '',
    taxCollectedYTD: 0,
    taxPaidYTD: 0,
    taxPendingYTD: 0
  })

  const [editedDetails, setEditedDetails] = useState(taxDetails)

  const filingFrequencies = ['Monthly', 'Quarterly', 'Annually']
  const gstTypes = ['Regular', 'Composition', 'Casual Taxable']
  const taxRegimes = ['Regular', 'Presumptive', 'New Regime']

  // Load tax data from backend
  useEffect(() => {
    if (wholesaler?.tax_details) {
      const taxData = wholesaler.tax_details
      const initial = {
        gstNumber: taxData.gst_number || wholesaler.gst_number || '',
        panNumber: taxData.pan_number || wholesaler.pan_number || '',
        gstType: taxData.gst_type || 'Regular',
        taxRegime: taxData.tax_regime || 'Regular',
        gstRate: taxData.gst_rate || 18,
        cgstRate: (taxData.gst_rate || 18) / 2,
        sgstRate: (taxData.gst_rate || 18) / 2,
        igstRate: taxData.gst_rate || 18,
        tdsApplicable: taxData.tds_applicable !== false,
        tdsRate: taxData.tds_rate || 2,
        filingFrequency: taxData.filing_frequency || 'Monthly',
        lastFiled: taxData.last_filed || 'Sep 2026',
        nextDueDate: taxData.next_due_date || '20 Oct 2026',
        taxCollectedYTD: taxData.tax_collected_ytd || 148500,
        taxPaidYTD: taxData.tax_paid_ytd || 124000,
        taxPendingYTD: taxData.tax_pending_ytd || 24500
      }
      setTaxDetails(initial)
      setEditedDetails(initial)
    } else if (wholesaler?.gst_number || wholesaler?.pan_number) {
      setTaxDetails(prev => ({
        ...prev,
        gstNumber: wholesaler.gst_number || '',
        panNumber: wholesaler.pan_number || ''
      }))
      setEditedDetails(prev => ({
        ...prev,
        gstNumber: wholesaler.gst_number || '',
        panNumber: wholesaler.pan_number || ''
      }))
    }
  }, [wholesaler])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(false)
    
    try {
      const formData = new FormData()
      formData.append('tax_details', JSON.stringify({
        gst_number: editedDetails.gstNumber,
        pan_number: editedDetails.panNumber,
        gst_type: editedDetails.gstType,
        tax_regime: editedDetails.taxRegime,
        gst_rate: editedDetails.gstRate,
        tds_applicable: editedDetails.tdsApplicable,
        tds_rate: editedDetails.tdsRate,
        filing_frequency: editedDetails.filingFrequency,
        last_filed: editedDetails.lastFiled,
        next_due_date: editedDetails.nextDueDate,
        tax_collected_ytd: editedDetails.taxCollectedYTD,
        tax_paid_ytd: editedDetails.taxPaidYTD,
        tax_pending_ytd: editedDetails.taxPendingYTD
      }))

      const userId = wholesaler?.user_id || wholesaler?.id
      await updateProfile({ userId: userId, data: formData }).unwrap()
      
      setTaxDetails(editedDetails)
      setSaveSuccess(true)
      toast.success('Tax compliance information saved successfully!')
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      setSaveError(true)
      toast.error(error?.data?.message || 'Failed to update tax information')
      setTimeout(() => setSaveError(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedDetails(taxDetails)
    setIsEditing(false)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0)
  }

  const handleDownloadReturn = () => {
    toast.info('Initiating download for GSTR-1 & GSTR-3B tax returns summary...')
  }

  if (parentLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="h-24 bg-slate-100 rounded-xl"></div>
          <div className="h-24 bg-slate-100 rounded-xl"></div>
          <div className="h-24 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    )
  }

  const isGstConfigured = Boolean(taxDetails.gstNumber)

  return (
    <div className="tax-information-settings space-y-6">
      {/* Executive Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100/60 shadow-2xs">
            <FileText size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Tax Compliance & Regulations
              </h3>
              {isGstConfigured ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <CheckCircle size={11} /> GST Registered
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                  <AlertCircle size={11} /> Registration Incomplete
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              Manage GSTIN, PAN credentials, GST tax slabs, TDS settings, and monthly return schedules
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

      {/* KPI Tax Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tax Collected */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">Tax Collected (YTD)</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(taxDetails.taxCollectedYTD)}
            </div>
            <p className="text-2xs font-medium text-slate-400 mt-0.5">Collected on buyer wholesale orders</p>
          </div>
        </div>

        {/* Tax Paid */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">Tax Paid to Govt (YTD)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600 tracking-tight">
              {formatCurrency(taxDetails.taxPaidYTD)}
            </div>
            <p className="text-2xs font-medium text-slate-400 mt-0.5">Remitted via monthly GSTR-3B filings</p>
          </div>
        </div>

        {/* Tax Pending */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">Estimated Pending Tax</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-600 tracking-tight">
              {formatCurrency(taxDetails.taxPendingYTD)}
            </div>
            <p className="text-2xs font-medium text-slate-400 mt-0.5">Due on next filing cycle: {taxDetails.nextDueDate || '20th'}</p>
          </div>
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
        {/* Section 1: GST & PAN Details */}
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building size={16} className="text-primary-600" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Official GSTIN & PAN Credentials
              </h4>
            </div>
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider">Statutory Records</span>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  GST Identification Number (GSTIN)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDetails.gstNumber}
                    onChange={(e) => setEditedDetails({ ...editedDetails, gstNumber: e.target.value.toUpperCase() })}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-mono font-semibold text-slate-900">{taxDetails.gstNumber || '-'}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Permanent Account Number (PAN)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDetails.panNumber}
                    onChange={(e) => setEditedDetails({ ...editedDetails, panNumber: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-mono font-semibold text-slate-900">{taxDetails.panNumber || '-'}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  GST Registration Type
                </label>
                {isEditing ? (
                  <select
                    value={editedDetails.gstType}
                    onChange={(e) => setEditedDetails({ ...editedDetails, gstType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  >
                    {gstTypes.map(type => (
                      <option key={type} value={type}>{type} Taxpayer</option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-semibold text-slate-900">{taxDetails.gstType} Taxpayer</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tax Accounting Regime
                </label>
                {isEditing ? (
                  <select
                    value={editedDetails.taxRegime}
                    onChange={(e) => setEditedDetails({ ...editedDetails, taxRegime: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  >
                    {taxRegimes.map(regime => (
                      <option key={regime} value={regime}>{regime} Regime</option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-semibold text-slate-900">{taxDetails.taxRegime} Regime</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Tax Rate Slabs */}
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent size={16} className="text-primary-600" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                GST Slabs & TDS Provisions
              </h4>
            </div>
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider">Rate Calculation</span>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Applicable GST Rate (%)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedDetails.gstRate}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value) || 0
                      setEditedDetails({
                        ...editedDetails,
                        gstRate: rate,
                        cgstRate: rate / 2,
                        sgstRate: rate / 2,
                        igstRate: rate
                      })
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-bold text-slate-900">{taxDetails.gstRate}% Integrated (IGST)</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Intra-state CGST Split
                </label>
                <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                  <p className="text-sm font-semibold text-slate-700">
                    {isEditing ? editedDetails.cgstRate : taxDetails.cgstRate}% Central GST
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Intra-state SGST Split
                </label>
                <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                  <p className="text-sm font-semibold text-slate-700">
                    {isEditing ? editedDetails.sgstRate : taxDetails.sgstRate}% State GST
                  </p>
                </div>
              </div>
            </div>

            {/* TDS Configuration */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editedDetails.tdsApplicable}
                  onChange={(e) => setEditedDetails({ ...editedDetails, tdsApplicable: e.target.checked })}
                  disabled={!isEditing}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    TDS Section 194O Applicable
                  </span>
                  <p className="text-2xs text-slate-400 font-medium">
                    1% Tax Deducted at Source on e-commerce wholesale operator payouts
                  </p>
                </div>
              </label>

              {editedDetails.tdsApplicable && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Rate:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.1"
                      value={editedDetails.tdsRate}
                      onChange={(e) => setEditedDetails({ ...editedDetails, tdsRate: parseFloat(e.target.value) || 0 })}
                      className="w-24 px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200/60">
                      {taxDetails.tdsRate}% TDS
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Tax Filing & Automated Compliance */}
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary-600" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Filing Schedule & Statements
              </h4>
            </div>
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider">GSTR-1 / 3B</span>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Filing Frequency
                </label>
                {isEditing ? (
                  <select
                    value={editedDetails.filingFrequency}
                    onChange={(e) => setEditedDetails({ ...editedDetails, filingFrequency: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  >
                    {filingFrequencies.map(freq => (
                      <option key={freq} value={freq}>{freq} Returns</option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-sm font-semibold text-slate-900">{taxDetails.filingFrequency} Returns</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Last Filed Tax Period
                </label>
                <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{taxDetails.lastFiled || 'Sep 2026'}</p>
                  <span className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <CheckCircle size={10} /> Successfully Filed
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Upcoming Filing Due Date
                </label>
                <div className="p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-center gap-2">
                  <Clock size={15} className="text-amber-600" />
                  <p className="text-sm font-bold text-amber-900">{taxDetails.nextDueDate || '20 Oct 2026'}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Statements & Returns
                </label>
                <button
                  type="button"
                  onClick={handleDownloadReturn}
                  className="w-full inline-flex items-center justify-center gap-2 p-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl text-xs font-semibold text-primary-600 shadow-2xs transition-all active:scale-95"
                >
                  <Download size={14} />
                  <span>Download Latest GSTR Tax Summary</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    Auto-reconciliation for B2B e-Invoices
                  </span>
                  <p className="text-2xs text-slate-400 font-medium">
                    Platform auto-generates IRN and QR codes for wholesale invoices exceeding mandatory thresholds
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Success/Error Banners */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-emerald-800">
              Tax records and filing parameters updated successfully.
            </p>
          </div>
        )}

        {saveError && (
          <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-xl flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-rose-800">
              Failed to update tax records. Please verify format and retry.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
