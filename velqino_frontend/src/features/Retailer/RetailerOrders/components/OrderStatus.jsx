"use client"

import React, { useState, useEffect } from 'react'
import { Clock, Package, Truck, CheckCircle, XCircle, RefreshCw, AlertCircle, Send } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerOrders/OrderStatus.scss'

export default function OrderStatus({ selectedOrder, onStatusUpdate }) {
  const [mounted, setMounted] = useState(false)
  const [currentStatus, setCurrentStatus] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    setMounted(true)
    if (selectedOrder) {
      setCurrentStatus(selectedOrder.status)
      setSelectedStatus(selectedOrder.status)
    }
  }, [selectedOrder])

  if (!mounted) return null

  const statusFlow = [
    { key: 'new', label: 'New', icon: <Clock size={16} />, color: 'gray', description: 'Order received' },
    { key: 'processing', label: 'Processing', icon: <Package size={16} />, color: 'blue', description: 'Verifying payment' },
    { key: 'packed', label: 'Packed', icon: <Package size={16} />, color: 'purple', description: 'Ready for pickup' },
    { key: 'shipped', label: 'Shipped', icon: <Truck size={16} />, color: 'indigo', description: 'On the way' },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircle size={16} />, color: 'green', description: 'Order completed' },
  ]

  const statusActions = [
    { key: 'cancelled', label: 'Cancel Order', icon: <XCircle size={14} />, color: 'red', requireReason: true },
    { key: 'returned', label: 'Return Order', icon: <RefreshCw size={14} />, color: 'orange', requireReason: true },
  ]

  const getStatusColor = (color) => {
    const colors = {
      gray: 'bg-gray-100 text-gray-700 border-gray-300',
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      green: 'bg-green-100 text-green-700 border-green-300',
      red: 'bg-red-100 text-red-700 border-red-300',
      orange: 'bg-orange-100 text-orange-700 border-orange-300',
    }
    return colors[color] || colors.gray
  }

  const getCurrentStepIndex = () => {
    return statusFlow.findIndex(s => s.key === currentStatus)
  }

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setCurrentStatus(newStatus)
    setSelectedStatus(newStatus)
    if (onStatusUpdate) onStatusUpdate(newStatus)
    setIsUpdating(false)
  }

  if (!selectedOrder) {
    return (
      <div className="order-status bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <Clock size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">Select an order to view status</p>
          <p className="text-xs text-gray-400 mt-1">Click on any order from the table</p>
        </div>
      </div>
    )
  }

  const currentStepIndex = getCurrentStepIndex()

  return (
    <div className="order-status bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Order Status</h3>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
            currentStatus === 'delivered' ? 'green' :
            currentStatus === 'shipped' ? 'indigo' :
            currentStatus === 'processing' ? 'blue' :
            currentStatus === 'packed' ? 'purple' : 'gray'
          )}`}>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Track your order progress</p>
      </div>

      {/* Status Timeline */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div 
            className="absolute left-5 top-0 w-0.5 bg-primary-500 transition-all duration-500"
            style={{ height: `${(currentStepIndex / (statusFlow.length - 1)) * 100}%` }}
          />

          
          {/* Status Steps */}
          <div className="space-y-6 relative">
            {statusFlow.map((status, index) => {
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              
              return (
                <div key={status.key} className="flex items-start gap-3">
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted 
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' 
                      : 'bg-gray-100 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-primary-100 scale-110' : ''}`}>
                    {isCompleted ? <CheckCircle size={18} /> : status.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {status.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full animate-pulse">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{status.description}</p>
                    {isCurrent && selectedOrder.tracking && (
                      <p className="text-[10px] text-blue-600 mt-1">Tracking: {selectedOrder.tracking}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Status Update Section (for pending orders) */}
      {currentStatus !== 'delivered' && currentStatus !== 'cancelled' && currentStatus !== 'returned' && (
        <div className="p-4 border-b border-gray-100">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Update Status</h4>
          <div className="flex flex-wrap gap-2">
            {statusFlow.slice(currentStepIndex + 1).map(status => (
              <button
                key={status.key}
                onClick={() => handleStatusUpdate(status.key)}
                disabled={isUpdating}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
                  getStatusColor(status.color)
                } hover:opacity-80`}
              >
                {status.icon}
                <span>Mark as {status.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cancel/Return Actions */}
      {(currentStatus === 'new' || currentStatus === 'processing') && (
        <div className="p-4">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Order Actions</h4>
          <div className="flex gap-2">
            {statusActions.map(action => (
              <button
                key={action.key}
                onClick={() => handleStatusUpdate(action.key)}
                disabled={isUpdating}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${getStatusColor(action.color)} hover:opacity-80`}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Info */}
      {currentStatus === 'delivered' && (
        <div className="p-4 bg-green-50 rounded-b-xl">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">Order Delivered</p>
              <p className="text-xs text-green-600 mt-0.5">Delivered on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cancelled/Returned Info */}
      {(currentStatus === 'cancelled' || currentStatus === 'returned') && (
        <div className="p-4 bg-red-50 rounded-b-xl">
          <div className="flex items-center gap-2">
            <XCircle size={16} className="text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Order {currentStatus === 'cancelled' ? 'Cancelled' : 'Returned'}
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                {currentStatus === 'cancelled' ? 'Refund initiated' : 'Return request processed'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}