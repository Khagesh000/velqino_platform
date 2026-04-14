"use client"

import React, { useState, useEffect } from 'react'
import { CheckSquare, Printer, Truck, CheckCircle, XCircle, RefreshCw, Package, Download, Mail, AlertCircle, FileText, Send } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerOrders/BulkActions.scss'

export default function BulkActions({ selectedOrders = [], onComplete }) {
  const [mounted, setMounted] = useState(false)
  const [selectedAction, setSelectedAction] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [invoiceFormat, setInvoiceFormat] = useState('pdf')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const bulkActions = [
    { id: 'update_status', label: 'Update Status', icon: <RefreshCw size={14} />, color: 'blue', description: 'Change order status for selected orders' },
    { id: 'print_invoices', label: 'Print Invoices', icon: <Printer size={14} />, color: 'green', description: 'Print invoices for selected orders' },
    { id: 'download_invoices', label: 'Download Invoices', icon: <Download size={14} />, color: 'purple', description: 'Download as PDF/Excel' },
    { id: 'send_emails', label: 'Send Emails', icon: <Mail size={14} />, color: 'orange', description: 'Send order updates to customers' },
    { id: 'mark_delivered', label: 'Mark Delivered', icon: <CheckCircle size={14} />, color: 'green', description: 'Mark selected orders as delivered' },
    { id: 'bulk_cancel', label: 'Bulk Cancel', icon: <XCircle size={14} />, color: 'red', description: 'Cancel selected orders' },
  ]

  const statusOptions = [
    { value: 'processing', label: 'Processing', icon: <RefreshCw size={12} /> },
    { value: 'packed', label: 'Packed', icon: <Package size={12} /> },
    { value: 'shipped', label: 'Shipped', icon: <Truck size={12} /> },
    { value: 'delivered', label: 'Delivered', icon: <CheckCircle size={12} /> },
    { value: 'cancelled', label: 'Cancelled', icon: <XCircle size={12} /> },
  ]

  const handleBulkAction = async () => {
    if (!selectedAction) return
    
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsProcessing(false)
    setShowConfirm(false)
    setSelectedAction('')
    
    if (onComplete) onComplete()
    alert(`Bulk action "${selectedAction}" completed for ${selectedOrders.length} orders`)
  }

  const getSelectedCount = () => {
    if (selectedOrders.length > 0) return selectedOrders.length
    // If no orders selected, show demo count
    return 3
  }

  const count = getSelectedCount()

  return (
    <div className="bulk-actions bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <CheckSquare size={18} className="text-primary-500" />
          <h3 className="text-base font-semibold text-gray-900">Bulk Actions</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">Update multiple orders at once</p>
      </div>

      {/* Selection Info */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{count} orders selected</span>
          </div>
          {count > 0 && (
            <span className="text-[10px] text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              Ready for action
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        {bulkActions.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              setSelectedAction(action.id)
              if (action.id === 'update_status') {
                setShowConfirm(true)
              } else {
                handleBulkAction()
              }
            }}
            disabled={count === 0}
            className={`w-full p-3 rounded-xl border transition-all text-left flex items-start gap-3 ${
              count === 0 
                ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
            }`}
          >
            <div className={`p-2 rounded-lg bg-${action.color}-50 text-${action.color}-600`}>
              {action.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">{action.label}</h4>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions Row */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <p className="text-xs font-medium text-gray-700 mb-2">Quick Actions</p>
        <div className="flex gap-2">
          <button 
            disabled={count === 0}
            className="flex-1 py-2 text-xs font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50"
          >
            Print Selected
          </button>
          <button 
            disabled={count === 0}
            className="flex-1 py-2 text-xs font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Update Status Modal */}
      {showConfirm && selectedAction === 'update_status' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RefreshCw size={20} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Update Order Status</h3>
              </div>
              <button onClick={() => setShowConfirm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Status for {count} Orders
              </label>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <label
                    key={status.value}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedStatus === status.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={selectedStatus === status.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-sm text-gray-700">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preview of affected orders */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">Orders to update:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {['#ORD-001', '#ORD-002', '#ORD-003'].slice(0, count).map((order, idx) => (
                  <p key={idx} className="text-xs text-gray-600">{order}</p>
                ))}
                {count > 3 && <p className="text-xs text-gray-400">+{count - 3} more</p>}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAction}
                disabled={!selectedStatus}
                className={`flex-1 px-4 py-2 text-sm rounded-lg transition-all ${
                  selectedStatus
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}