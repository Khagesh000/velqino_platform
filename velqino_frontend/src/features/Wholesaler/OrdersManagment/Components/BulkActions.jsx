"use client"

import React, { useState } from 'react'
import { 
  CheckCircle,
  XCircle,
  Download,
  Printer,
  Truck,
  Package,
  AlertCircle,
  ChevronDown,
  Check,
  FileText,
  Send,
  Clock,
  RefreshCw
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/OrdersManagment/BulkActions.scss'

export default function BulkActions({ selectedCount = 3, onActionComplete }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const bulkActions = [
    {
      id: 'update-status',
      label: 'Update Status',
      icon: RefreshCw,
      color: 'primary',
      options: ['Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
    {
      id: 'print-invoices',
      label: 'Print Invoices',
      icon: Printer,
      color: 'info',
      count: selectedCount
    },
    {
      id: 'export-orders',
      label: 'Export Orders',
      icon: Download,
      color: 'success',
      formats: ['CSV', 'Excel', 'PDF']
    },
    {
      id: 'cancel-selected',
      label: 'Cancel Selected',
      icon: XCircle,
      color: 'error',
      warning: 'This action cannot be undone'
    }
  ]

  const handleActionClick = (action) => {
    if (action.id === 'cancel-selected') {
      setSelectedAction(action)
      setShowConfirmModal(true)
    } else if (action.id === 'update-status') {
      setSelectedAction(action)
      setIsExpanded(true)
    } else {
      executeAction(action)
    }
  }

  const executeAction = (action) => {
    setProcessing(true)
    console.log(`Executing: ${action.label} for ${selectedCount} orders`)
    
    setTimeout(() => {
      setProcessing(false)
      setSelectedAction(null)
      setIsExpanded(false)
      if (onActionComplete) {
        onActionComplete({
          action: action.id,
          count: selectedCount,
          status: 'success'
        })
      }
    }, 1500)
  }

  const getActionColor = (color) => {
    const colors = {
      primary: 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100',
      success: 'bg-success-50 text-success-700 border-success-200 hover:bg-success-100',
      error: 'bg-error-50 text-error-700 border-error-200 hover:bg-error-100',
      info: 'bg-info-50 text-info-700 border-info-200 hover:bg-info-100',
      warning: 'bg-warning-50 text-warning-700 border-warning-200 hover:bg-warning-100'
    }
    return colors[color] || colors.primary
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
              <Package size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Bulk Actions</h3>
              <p className="text-xs sm:text-sm text-gray-500">
                <span className="font-medium text-primary-600">{selectedCount}</span> orders selected
              </p>
            </div>
          </div>
          {selectedCount > 0 && (
            <button 
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all w-full sm:w-auto"
              onClick={() => window.location.reload()}
            >
              Clear Selection
            </button>
          )}
        </div>

        {/* Actions Grid - Fixed grid with proper gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {bulkActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all ${getActionColor(action.color)} ${
                  selectedAction?.id === action.id ? 'ring-2 ring-offset-2 ring-' + action.color + '-500' : ''
                } hover:shadow-lg w-full text-left`}
                onClick={() => handleActionClick(action)}
                disabled={processing}
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon size={24} className="sm:w-7 sm:h-7" />
                  {action.count && (
                    <span className="px-2 py-1 bg-white rounded-full text-xs font-medium">
                      {action.count}
                    </span>
                  )}
                </div>
                <h4 className="text-sm sm:text-base font-semibold mb-1">{action.label}</h4>
                <p className="text-xs opacity-75 line-clamp-2">
                  {action.id === 'update-status' && 'Change order status in bulk'}
                  {action.id === 'print-invoices' && `Print ${action.count} invoices`}
                  {action.id === 'export-orders' && 'CSV, Excel, or PDF'}
                  {action.id === 'cancel-selected' && 'Cancel all selected orders'}
                </p>
              </button>
            )
          })}
        </div>

        {/* Expanded Section for Status Update */}
        {isExpanded && selectedAction?.id === 'update-status' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Select New Status</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedAction.options.map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                    statusFilter === status.toLowerCase()
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                  onClick={() => setStatusFilter(status.toLowerCase())}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 order-2 sm:order-1"
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 flex items-center justify-center gap-2 order-1 sm:order-2"
                onClick={() => executeAction(selectedAction)}
                disabled={!statusFilter || processing}
              >
                {processing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Update {selectedCount} Orders
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Cancel Action */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />
          
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center text-error-600 flex-shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cancel Orders</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel <span className="font-semibold text-error-600">{selectedCount} orders</span>? 
              This will permanently cancel these orders and notify the customers.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <button
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                onClick={() => setShowConfirmModal(false)}
              >
                No, Keep Orders
              </button>
              <button
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-error-500 rounded-lg hover:bg-error-600 transition-all flex items-center justify-center gap-2"
                onClick={() => {
                  setShowConfirmModal(false)
                  executeAction(selectedAction)
                }}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    Yes, Cancel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}