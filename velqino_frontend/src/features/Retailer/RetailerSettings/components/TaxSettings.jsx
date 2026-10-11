"use client"

import React, { useState, useEffect } from 'react'
import { FileText, Percent, AlertCircle, CheckCircle, Edit, Save, X, Plus, Trash2, Calculator, Receipt } from '../../../../utils/icons'

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
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRateChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      taxRates: prev.taxRates.map(rate =>
        rate.id === id ? { ...rate, [field]: value } : rate
      )
    }))
  }

  const handleToggleApplicability = (field) => {
    setFormData(prev => ({
      ...prev,
      taxApplicability: {
        ...prev.taxApplicability,
        [field]: !prev.taxApplicability[field]
      }
    }))
  }

  const handleToggleRate = (id) => {
    setFormData(prev => ({
      ...prev,
      taxRates: prev.taxRates.map(rate =>
        rate.id === id ? { ...rate, applicable: !rate.applicable } : rate
      )
    }))
  }

  const handleAddNewRate = () => {
    const newId = Math.max(0, ...formData.taxRates.map(r => r.id)) + 1
    const newRate = {
      id: newId,
      name: `GST - Custom ${newId}`,
      rate: 12,
      cgst: 6,
      sgst: 6,
      applicable: true
    }
    setFormData(prev => ({
      ...prev,
      taxRates: [...prev.taxRates, newRate]
    }))
  }

  const handleDeleteRate = (id) => {
    setFormData(prev => ({
      ...prev,
      taxRates: prev.taxRates.filter(r => r.id !== id)
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-2xs shrink-0">
              <Percent size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Tax &amp; GST Compliance</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  GST Verified
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Configure statutory tax numbers, GST rate slabs, and applicability rules</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs transition-all"
                >
                  <Save size={14} />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 rounded-xl shadow-2xs transition-all"
              >
                <Edit size={14} />
                Edit Tax Rules
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 animate-fadeIn">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-900">Tax Settings Updated</p>
            <p className="text-xs text-emerald-700">All statutory rates and filing schedules were synchronized with the POS register.</p>
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-6">
        {/* Section 1: Tax Registration Identifiers */}
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <FileText size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Statutory Registrations</h4>
              <p className="text-xs text-gray-500">Government issued GST identification and permanent account numbers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-gray-200/80 bg-gray-50/50">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">GST Identification Number (GSTIN)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
                  placeholder="29ABCDE1234F1Z5"
                  className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all uppercase"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                    {formData.gstNumber}
                  </span>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle size={12} /> Validated
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">15-character alphanumeric tax identifier</p>
            </div>

            <div className="p-4 rounded-2xl border border-gray-200/80 bg-gray-50/50">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">PAN Identification Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all uppercase"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                    {formData.panNumber}
                  </span>
                  <span className="text-xs font-medium text-gray-500">Corporate PAN</span>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">10-character Income Tax Department identifier</p>
            </div>

            <div className="p-4 rounded-2xl border border-gray-200/80 bg-gray-50/50">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Active Tax System</label>
              {isEditing ? (
                <select
                  value={formData.taxType}
                  onChange={(e) => handleInputChange('taxType', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                >
                  <option value="gst">GST (Goods & Services Tax - India)</option>
                  <option value="vat">VAT (Value Added Tax)</option>
                  <option value="sales">Sales Tax (Standard Direct)</option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-primary-100 text-primary-800">
                    {formData.taxType.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-600">Unified Indirect Tax System</span>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">Determines split between CGST, SGST & IGST</p>
            </div>
          </div>
        </div>

        {/* Section 2: GST Rate Slabs */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                <Calculator size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Standard GST Tax Slabs</h4>
                <p className="text-xs text-gray-500">Configured tax rates applied during checkout and catalog pricing</p>
              </div>
            </div>

            {isEditing && (
              <button
                type="button"
                onClick={handleAddNewRate}
                className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Plus size={14} />
                Add Custom Tax Slab
              </button>
            )}
          </div>

          <div className="border border-gray-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Tax Slab Name</th>
                    <th className="py-3.5 px-4">Total GST Rate</th>
                    <th className="py-3.5 px-4">CGST Split</th>
                    <th className="py-3.5 px-4">SGST Split</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    {isEditing && <th className="py-3.5 px-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {formData.taxRates.map((rate) => (
                    <tr key={rate.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={rate.name}
                            onChange={(e) => handleRateChange(rate.id, 'name', e.target.value)}
                            className="px-2.5 py-1 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 font-semibold focus:outline-none focus:border-primary-500"
                          />
                        ) : (
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            <span>{rate.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={rate.rate}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                handleRateChange(rate.id, 'rate', val)
                                handleRateChange(rate.id, 'cgst', +(val / 2).toFixed(2))
                                handleRateChange(rate.id, 'sgst', +(val / 2).toFixed(2))
                              }}
                              className="w-20 px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 font-bold focus:outline-none focus:border-primary-500"
                              step="0.5"
                            />
                            <span className="text-xs text-gray-500">%</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200">
                            {rate.rate}%
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={rate.cgst}
                              onChange={(e) => handleRateChange(rate.id, 'cgst', parseFloat(e.target.value) || 0)}
                              className="w-18 px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary-500"
                              step="0.1"
                            />
                            <span className="text-xs text-gray-500">%</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-gray-700">{rate.cgst}%</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={rate.sgst}
                              onChange={(e) => handleRateChange(rate.id, 'sgst', parseFloat(e.target.value) || 0)}
                              className="w-18 px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary-500"
                              step="0.1"
                            />
                            <span className="text-xs text-gray-500">%</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-gray-700">{rate.sgst}%</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={() => handleToggleRate(rate.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                              rate.applicable
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                            }`}
                          >
                            {rate.applicable ? 'Active' : 'Inactive'}
                          </button>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            rate.applicable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${rate.applicable ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                            {rate.applicable ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      {isEditing && (
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteRate(rate.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete rate"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 3: Tax Applicability & Rules */}
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              <Receipt size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Tax Applicability Rules</h4>
              <p className="text-xs text-gray-500">Control when and where tax calculations apply automatically</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              { key: 'onProducts', label: 'Product Catalog', desc: 'Levy GST on item prices' },
              { key: 'onShipping', label: 'Shipping & Delivery', desc: 'Levy 18% GST on logistics' },
              { key: 'onPackaging', label: 'Packaging Materials', desc: 'Levy GST on gift boxing' },
              { key: 'onDiscount', label: 'Discount Deductions', desc: 'Calculate tax after discount' },
            ].map(({ key, label, desc }) => {
              const isActive = formData.taxApplicability[key]
              return (
                <div
                  key={key}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive ? 'border-primary-200/80 bg-primary-50/20' : 'border-gray-200/80 bg-gray-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-900">{label}</span>
                    {isEditing ? (
                      <button
                        type="button"
                        onClick={() => handleToggleApplicability(key)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isActive ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            isActive ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    ) : (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold ${
                        isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isActive ? 'Applied' : 'Exempt'}
                      </span>
                    )}
                  </div>
                  <p className="text-2xs text-gray-500">{desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section 4: Filing & HSN Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filing Card */}
          <div className="p-5 rounded-2xl border border-gray-200/80 bg-white">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <AlertCircle size={16} />
                </div>
                <h4 className="text-sm font-bold text-gray-900">GST Return Schedule</h4>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                15 Days Remaining
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block mb-1 font-medium">Filing Frequency</span>
                {isEditing ? (
                  <select
                    value={formData.filingFrequency}
                    onChange={(e) => handleInputChange('filingFrequency', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-900 font-bold capitalize"
                  >
                    <option value="monthly">Monthly (GSTR-1 & 3B)</option>
                    <option value="quarterly">Quarterly (QRMP)</option>
                    <option value="annually">Annual (GSTR-9)</option>
                  </select>
                ) : (
                  <span className="font-bold text-gray-900 capitalize text-sm">{formData.filingFrequency} (QRMP)</span>
                )}
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block mb-1 font-medium">Next Due Date</span>
                <span className="font-bold text-gray-900 text-sm">April 20, 2026</span>
              </div>
            </div>

            <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <span className="text-xs font-semibold text-gray-800">Auto-GST Filing Sync</span>
                <p className="text-2xs text-gray-500">Automated submission via GST Suvidha Provider</p>
              </div>
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => handleInputChange('autoFiling', !formData.autoFiling)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    formData.autoFiling ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      formData.autoFiling ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              ) : (
                <span className={`text-xs font-bold ${formData.autoFiling ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {formData.autoFiling ? 'Enabled' : 'Disabled'}
                </span>
              )}
            </div>
          </div>

          {/* HSN Summary Card */}
          <div className="p-5 rounded-2xl border border-gray-200/80 bg-white">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center">
                  <FileText size={16} />
                </div>
                <h4 className="text-sm font-bold text-gray-900">HSN/SAC Invoice Summary</h4>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                CBIC Mandatory
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Harmonized System of Nomenclature (HSN) tables are automatically appended to customer thermal and B2B invoices in compliance with Indian GST laws.
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <span className="text-xs font-semibold text-gray-900">Append HSN Table on Invoices</span>
                <p className="text-2xs text-gray-500">Shows 4/6/8 digit code breakdown per item</p>
              </div>
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => handleInputChange('enableHsnSummary', !formData.enableHsnSummary)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    formData.enableHsnSummary ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      formData.enableHsnSummary ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
