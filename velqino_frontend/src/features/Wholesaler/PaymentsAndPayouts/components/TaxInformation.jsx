"use client"

import React, { useState } from 'react'
import {
  FileText,
  Download,
  Upload,
  Eye,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Calendar,
  DollarSign,
  Building,
  FileCheck,
  Receipt,
  TrendingUp,
  Shield
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/PaymentsPayouts/TaxInformation.scss'

export default function TaxInformation() {
  const [activeTab, setActiveTab] = useState('details')
  const [showEditGST, setShowEditGST] = useState(false)
  const [showEditPAN, setShowEditPAN] = useState(false)
  const [taxSettings, setTaxSettings] = useState({
    gstNumber: '27AAACV1234E1Z5',
    gstType: 'Regular',
    panNumber: 'AAACV1234E',
    businessType: 'Private Limited Company',
    businessName: 'Veltrix Wholesale Pvt Ltd',
    address: '123, MG Road, Bangalore - 560001',
    taxRegime: 'Regular',
    gstRate: 18,
    tdsApplicable: true,
    tdsRate: 2,
    gstReturnsFiled: 12,
    lastReturnFiled: '2024-02-28',
    nextReturnDue: '2024-03-20',
    taxCollected: 1245750,
    taxPaid: 1123450,
    taxPending: 122300
  })

  const [editForm, setEditForm] = useState({ ...taxSettings })

  const taxDocuments = [
    { id: 1, name: 'GST Registration Certificate.pdf', type: 'GST', date: '2024-01-15', size: '1.2 MB', status: 'Verified' },
    { id: 2, name: 'PAN Card.pdf', type: 'PAN', date: '2024-01-15', size: '0.8 MB', status: 'Verified' },
    { id: 3, name: 'Tax Returns Q3 2023.pdf', type: 'Tax Return', date: '2024-01-10', size: '2.1 MB', status: 'Verified' },
    { id: 4, name: 'GST Returns Dec 2023.pdf', type: 'GST Return', date: '2024-01-05', size: '1.5 MB', status: 'Pending' }
  ]

  const taxCollectedHistory = [
    { month: 'Jan 2024', sales: 1250000, taxCollected: 225000, taxPaid: 225000, status: 'Paid' },
    { month: 'Dec 2023', sales: 1100000, taxCollected: 198000, taxPaid: 198000, status: 'Paid' },
    { month: 'Nov 2023', sales: 980000, taxCollected: 176400, taxPaid: 176400, status: 'Paid' },
    { month: 'Oct 2023', sales: 1020000, taxCollected: 183600, taxPaid: 183600, status: 'Paid' },
    { month: 'Sep 2023', sales: 890000, taxCollected: 160200, taxPaid: 150000, status: 'Pending' }
  ]

  const handleSaveGST = () => {
    setTaxSettings({ ...taxSettings, gstNumber: editForm.gstNumber, gstType: editForm.gstType })
    setShowEditGST(false)
  }

  const handleSavePAN = () => {
    setTaxSettings({ ...taxSettings, panNumber: editForm.panNumber })
    setShowEditPAN(false)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const tabs = [
    { id: 'details', label: 'Tax Details', icon: FileText },
    { id: 'collected', label: 'Tax Collected', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileCheck },
    { id: 'settings', label: 'Settings', icon: Shield }
  ]

  return (
    <div className="tax-information bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Tax Information</h3>
            <p className="text-xs sm:text-sm text-gray-500">Manage GST/PAN, tax collected, and compliance documents</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={`px-3 sm:px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Tax Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* GST Details */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building size={18} className="text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900">GST Details</h4>
                </div>
                <button
                  onClick={() => setShowEditGST(true)}
                  className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <Edit size={16} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">GST Number</span>
                  <span className="text-sm font-medium text-gray-900">{taxSettings.gstNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">GST Type</span>
                  <span className="text-sm font-medium text-gray-900">{taxSettings.gstType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Business Name</span>
                  <span className="text-sm font-medium text-gray-900">{taxSettings.businessName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Business Type</span>
                  <span className="text-sm font-medium text-gray-900">{taxSettings.businessType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Business Address</span>
                  <span className="text-sm text-gray-900 text-right max-w-[200px]">{taxSettings.address}</span>
                </div>
              </div>
            </div>

            {/* PAN Details */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck size={18} className="text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900">PAN Details</h4>
                </div>
                <button
                  onClick={() => setShowEditPAN(true)}
                  className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <Edit size={16} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">PAN Number</span>
                  <span className="text-sm font-medium text-gray-900">{taxSettings.panNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Tax Regime</span>
                  <span className="text-sm font-medium text-gray-900">{taxSettings.taxRegime}</span>
                </div>
              </div>
            </div>

            {/* Tax Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">GST Returns Filed</p>
                <p className="text-xl font-bold text-gray-900">{taxSettings.gstReturnsFiled}</p>
                <p className="text-xxs text-gray-400 mt-1">Last: {taxSettings.lastReturnFiled}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Next Return Due</p>
                <p className="text-xl font-bold text-gray-900">{taxSettings.nextReturnDue}</p>
                <p className="text-xxs text-warning-600 mt-1">Due in 5 days</p>
              </div>
            </div>
          </div>
        )}

        {/* Tax Collected Tab */}
        {activeTab === 'collected' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Total Tax Collected</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(taxSettings.taxCollected)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Tax Paid</p>
                <p className="text-lg font-bold text-success-600">{formatCurrency(taxSettings.taxPaid)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Tax Pending</p>
                <p className="text-lg font-bold text-warning-600">{formatCurrency(taxSettings.taxPending)}</p>
              </div>
            </div>

            {/* Tax Collected Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Month</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Sales</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Tax Collected</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Tax Paid</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {taxCollectedHistory.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-all">
                      <td className="px-3 py-2 text-xs text-gray-600">{item.month}</td>
                      <td className="px-3 py-2 text-xs text-gray-900">{formatCurrency(item.sales)}</td>
                      <td className="px-3 py-2 text-xs text-gray-900">{formatCurrency(item.taxCollected)}</td>
                      <td className="px-3 py-2 text-xs text-gray-900">{formatCurrency(item.taxPaid)}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          item.status === 'Paid' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
              <Download size={12} /> Download Tax Report
            </button>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary-300 transition-all">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Drag & drop tax documents here</p>
              <p className="text-xs text-gray-500 mb-2">or</p>
              <button className="px-4 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600">
                Browse Files
              </button>
            </div>

            <div className="space-y-2">
              {taxDocuments.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xxs text-gray-500">{doc.date} • {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xxs rounded-full ${
                      doc.status === 'Verified' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                    }`}>
                      {doc.status}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-primary-600">
                      <Eye size={14} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-primary-600">
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Tax Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
                  <select
                    value={taxSettings.gstRate}
                    onChange={(e) => setTaxSettings({ ...taxSettings, gstRate: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={taxSettings.tdsApplicable}
                      onChange={(e) => setTaxSettings({ ...taxSettings, tdsApplicable: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600"
                    />
                    <span className="text-sm text-gray-700">TDS Applicable</span>
                  </label>
                  {taxSettings.tdsApplicable && (
                    <div className="ml-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">TDS Rate (%)</label>
                      <input
                        type="number"
                        value={taxSettings.tdsRate}
                        onChange={(e) => setTaxSettings({ ...taxSettings, tdsRate: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Auto Tax Filing</h4>
              <p className="text-xs text-gray-500 mb-3">Enable automatic GST return filing</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Auto-file GST returns</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-500 transition-all">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-all" />
                </button>
              </div>
            </div>

            <button className="w-full py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all">
              Save Tax Settings
            </button>
          </div>
        )}
      </div>

      {/* Edit GST Modal */}
      {showEditGST && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditGST(false)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit GST Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input
                  type="text"
                  value={editForm.gstNumber}
                  onChange={(e) => setEditForm({ ...editForm, gstNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Type</label>
                <select
                  value={editForm.gstType}
                  onChange={(e) => setEditForm({ ...editForm, gstType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option>Regular</option>
                  <option>Composition</option>
                  <option>Casual Taxable</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button onClick={() => setShowEditGST(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSaveGST} className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit PAN Modal */}
      {showEditPAN && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditPAN(false)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit PAN Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
              <input
                type="text"
                value={editForm.panNumber}
                onChange={(e) => setEditForm({ ...editForm, panNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button onClick={() => setShowEditPAN(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSavePAN} className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}