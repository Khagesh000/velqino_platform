"use client"

import React, { useState } from 'react'
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
  Eye,
  TrendingUp
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Settings/TaxInformation.scss'

export default function TaxInformation() {
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState(false)

  const [taxDetails, setTaxDetails] = useState({
    gstNumber: '27AAACV1234E1Z5',
    panNumber: 'AAACV1234E',
    gstType: 'Regular',
    taxRegime: 'Regular',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    tdsApplicable: true,
    tdsRate: 2,
    filingFrequency: 'Monthly',
    lastFiled: '2024-02-28',
    nextDueDate: '2024-03-20',
    taxCollectedYTD: 1245750,
    taxPaidYTD: 1123450,
    taxPendingYTD: 122300
  })

  const [editedDetails, setEditedDetails] = useState(taxDetails)

  const filingFrequencies = ['Monthly', 'Quarterly', 'Annually']
  const gstTypes = ['Regular', 'Composition', 'Casual Taxable']
  const taxRegimes = ['Regular', 'Presumptive', 'New Regime']

  const handleSave = () => {
    setSaveSuccess(false)
    setSaveError(false)
    
    setTimeout(() => {
      setTaxDetails(editedDetails)
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
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
    }).format(value)
  }

  return (
    <div className="tax-information-settings bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Tax Information</h3>
            <p className="text-xs sm:text-sm text-gray-500">Manage GST, PAN, and tax filing details</p>
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
        {/* Tax Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Tax Collected (YTD)</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(taxDetails.taxCollectedYTD)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Tax Paid (YTD)</p>
            <p className="text-lg font-bold text-success-600">{formatCurrency(taxDetails.taxPaidYTD)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Tax Pending (YTD)</p>
            <p className="text-lg font-bold text-warning-600">{formatCurrency(taxDetails.taxPendingYTD)}</p>
          </div>
        </div>

        {/* GST & PAN Details */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Building size={16} className="text-gray-500" />
              GST & PAN Details
            </h4>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDetails.gstNumber}
                    onChange={(e) => setEditedDetails({ ...editedDetails, gstNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 uppercase"
                  />
                ) : (
                  <p className="text-sm font-mono text-gray-900">{taxDetails.gstNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDetails.panNumber}
                    onChange={(e) => setEditedDetails({ ...editedDetails, panNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 uppercase"
                  />
                ) : (
                  <p className="text-sm font-mono text-gray-900">{taxDetails.panNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Type</label>
                {isEditing ? (
                  <select
                    value={editedDetails.gstType}
                    onChange={(e) => setEditedDetails({ ...editedDetails, gstType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    {gstTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">{taxDetails.gstType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Regime</label>
                {isEditing ? (
                  <select
                    value={editedDetails.taxRegime}
                    onChange={(e) => setEditedDetails({ ...editedDetails, taxRegime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    {taxRegimes.map(regime => (
                      <option key={regime} value={regime}>{regime}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">{taxDetails.taxRegime}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tax Rate Settings */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Percent size={16} className="text-gray-500" />
              Tax Rate Settings
            </h4>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedDetails.gstRate}
                    onChange={(e) => {
                      const rate = parseInt(e.target.value)
                      setEditedDetails({
                        ...editedDetails,
                        gstRate: rate,
                        cgstRate: rate / 2,
                        sgstRate: rate / 2
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{taxDetails.gstRate}%</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CGST Rate (%)</label>
                <p className="text-sm text-gray-600">{taxDetails.cgstRate}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SGST Rate (%)</label>
                <p className="text-sm text-gray-600">{taxDetails.sgstRate}%</p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={editedDetails.tdsApplicable}
                  onChange={(e) => setEditedDetails({ ...editedDetails, tdsApplicable: e.target.checked })}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">TDS Applicable</span>
              </label>
              {editedDetails.tdsApplicable && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">TDS Rate (%)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedDetails.tdsRate}
                      onChange={(e) => setEditedDetails({ ...editedDetails, tdsRate: parseInt(e.target.value) })}
                      className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{taxDetails.tdsRate}%</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tax Filing Details */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              Tax Filing Details
            </h4>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filing Frequency</label>
                {isEditing ? (
                  <select
                    value={editedDetails.filingFrequency}
                    onChange={(e) => setEditedDetails({ ...editedDetails, filingFrequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    {filingFrequencies.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">{taxDetails.filingFrequency}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Filed</label>
                <p className="text-sm text-gray-900">{taxDetails.lastFiled}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-warning-600">{taxDetails.nextDueDate}</p>
                  <span className="text-xs text-gray-500">(Due in 5 days)</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Download Returns</label>
                <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm">
                  <Download size={14} />
                  Download Latest Return
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Auto-file GST returns (Monthly)</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">We'll automatically file your GST returns on the due date</p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {saveSuccess && (
          <div className="p-3 bg-success-50 rounded-lg flex items-center gap-2">
            <CheckCircle size={16} className="text-success-600" />
            <p className="text-sm text-success-600">Tax information updated successfully!</p>
          </div>
        )}
        {saveError && (
          <div className="p-3 bg-error-50 rounded-lg flex items-center gap-2">
            <AlertCircle size={16} className="text-error-600" />
            <p className="text-sm text-error-600">Failed to update tax information. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  )
}