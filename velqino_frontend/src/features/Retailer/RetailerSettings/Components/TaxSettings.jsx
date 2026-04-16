"use client"

import React, { useState, useEffect } from 'react'
import { FileText, Percent, AlertCircle, CheckCircle, Edit, Save, X, Plus, Trash2, Calculator, Receipt } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSettings/TaxSettings.scss'

export default function TaxSettings() {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    gstNumber: '29ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    taxType: 'gst',
    taxRates: [
      { id: 1, name: 'GST - 5%', rate: 5, cgst: 2.5, sgst: 2.5, applicable: true },
      { id: 2, name: 'GST - 12%', rate: 12, cgst: 6, sgst: 6, applicable: true },
      { id: 3, name: 'GST - 18%', rate: 18, cgst: 9, sgst: 9, applicable: true },
      { id: 4, name: 'GST - 28%', rate: 28, cgst: 14, sgst: 14, applicable: false },
    ],
    taxApplicability: {
      onProducts: true,
      onShipping: true,
      onPackaging: true,
      onDiscount: false,
    },
    filingFrequency: 'quarterly',
    autoFiling: false,
    enableHsnSummary: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleRateChange = (id, field, value) => {
    setFormData({
      ...formData,
      taxRates: formData.taxRates.map(rate =>
        rate.id === id ? { ...rate, [field]: value } : rate
      )
    })
  }

  const handleToggleApplicability = (field) => {
    setFormData({
      ...formData,
      taxApplicability: {
        ...formData.taxApplicability,
        [field]: !formData.taxApplicability[field]
      }
    })
  }

  const handleToggleRate = (id) => {
    setFormData({
      ...formData,
      taxRates: formData.taxRates.map(rate =>
        rate.id === id ? { ...rate, applicable: !rate.applicable } : rate
      )
    })
  }

  const handleSave = () => {
    setIsEditing(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="tax-settings bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Percent size={22} className="text-primary-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tax Settings</h3>
              <p className="text-sm text-gray-500">Configure GST rates and tax applicability</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 flex items-center gap-2">
              <Edit size={16} />
              Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-5 mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-700">Tax settings saved successfully!</span>
        </div>
      )}

      <div className="p-5 space-y-6">
        {/* Tax Registration Numbers */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-gray-600" />
            <h4 className="text-base font-semibold text-gray-900">Tax Registration</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                  placeholder="22AAAAA0000A1Z"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-gray-900 font-mono">{formData.gstNumber}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">15-digit GST identification number</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value)}
                  placeholder="AAAAA1234A"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-gray-900 font-mono">{formData.panNumber}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">10-digit PAN number</p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Type</label>
            {isEditing ? (
              <select
                value={formData.taxType}
                onChange={(e) => handleInputChange('taxType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="gst">GST (Goods & Services Tax)</option>
                <option value="vat">VAT (Value Added Tax)</option>
                <option value="sales">Sales Tax</option>
              </select>
            ) : (
              <p className="text-gray-900">{formData.taxType.toUpperCase()}</p>
            )}
          </div>
        </div>

        {/* GST Rates */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calculator size={18} className="text-gray-600" />
            <h4 className="text-base font-semibold text-gray-900">GST Rates</h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500">
                  <th className="px-3 py-2">Tax Rate</th>
                  <th className="px-3 py-2">CGST</th>
                  <th className="px-3 py-2">SGST</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {formData.taxRates.map((rate) => (
                  <tr key={rate.id}>
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <input
                          type="number"
                          value={rate.rate}
                          onChange={(e) => handleRateChange(rate.id, 'rate', parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm"
                          step="0.5"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{rate.rate}%</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <input
                          type="number"
                          value={rate.cgst}
                          onChange={(e) => handleRateChange(rate.id, 'cgst', parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm"
                          step="0.5"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{rate.cgst}%</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <input
                          type="number"
                          value={rate.sgst}
                          onChange={(e) => handleRateChange(rate.id, 'sgst', parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm"
                          step="0.5"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{rate.sgst}%</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm font-semibold text-gray-900">{rate.rate}%</span>
                    </td>
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={rate.applicable}
                            onChange={() => handleToggleRate(rate.id)}
                            className="rounded border-gray-300 text-primary-500"
                          />
                          <span className="text-sm text-gray-600">Active</span>
                        </label>
                      ) : (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${rate.applicable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {rate.applicable ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {isEditing && (
            <button className="mt-3 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              <Plus size={14} />
              Add New Tax Rate
            </button>
          )}
        </div>

        {/* Tax Applicability */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Receipt size={18} className="text-gray-600" />
            <h4 className="text-base font-semibold text-gray-900">Tax Applicability</h4>
          </div>
          
          <div className="space-y-2">
            {isEditing ? (
              <>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Apply tax on products</span>
                  <input
                    type="checkbox"
                    checked={formData.taxApplicability.onProducts}
                    onChange={() => handleToggleApplicability('onProducts')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Apply tax on shipping charges</span>
                  <input
                    type="checkbox"
                    checked={formData.taxApplicability.onShipping}
                    onChange={() => handleToggleApplicability('onShipping')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Apply tax on packaging charges</span>
                  <input
                    type="checkbox"
                    checked={formData.taxApplicability.onPackaging}
                    onChange={() => handleToggleApplicability('onPackaging')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Apply tax on discounts</span>
                  <input
                    type="checkbox"
                    checked={formData.taxApplicability.onDiscount}
                    onChange={() => handleToggleApplicability('onDiscount')}
                    className="rounded border-gray-300 text-primary-500"
                  />
                </label>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Tax on products</span>
                  <span className="text-sm text-gray-900">{formData.taxApplicability.onProducts ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Tax on shipping</span>
                  <span className="text-sm text-gray-900">{formData.taxApplicability.onShipping ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Tax on packaging</span>
                  <span className="text-sm text-gray-900">{formData.taxApplicability.onPackaging ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Tax on discounts</span>
                  <span className="text-sm text-gray-900">{formData.taxApplicability.onDiscount ? 'Yes' : 'No'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filing Settings */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-gray-600" />
            <h4 className="text-base font-semibold text-gray-900">Filing Settings</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filing Frequency</label>
              {isEditing ? (
                <select
                  value={formData.filingFrequency}
                  onChange={(e) => handleInputChange('filingFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              ) : (
                <p className="text-gray-900 capitalize">{formData.filingFrequency}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
              <p className="text-gray-900">April 20, 2026</p>
              <p className="text-xs text-orange-600">15 days remaining</p>
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.autoFiling}
                  onChange={() => handleInputChange('autoFiling', !formData.autoFiling)}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-700">Enable auto-filing of GST returns</span>
              </label>
            </div>
          )}
          
          {!isEditing && formData.autoFiling && (
            <div className="mt-2 text-sm text-green-600">✓ Auto-filing enabled</div>
          )}
        </div>

        {/* HSN Summary */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-gray-600" />
              <h4 className="text-base font-semibold text-gray-900">HSN/SAC Summary</h4>
            </div>
            {isEditing ? (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.enableHsnSummary}
                  onChange={() => handleInputChange('enableHsnSummary', !formData.enableHsnSummary)}
                  className="rounded border-gray-300 text-primary-500"
                />
                <span className="text-sm text-gray-600">Enable</span>
              </label>
            ) : (
              <span className={`text-sm ${formData.enableHsnSummary ? 'text-green-600' : 'text-gray-400'}`}>
                {formData.enableHsnSummary ? 'Enabled' : 'Disabled'}
              </span>
            )}
          </div>
          {formData.enableHsnSummary && (
            <p className="text-xs text-gray-500 mt-2">HSN/SAC summary will be included in invoices</p>
          )}
        </div>
      </div>
    </div>
  )
}