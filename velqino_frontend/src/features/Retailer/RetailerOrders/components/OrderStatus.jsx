"use client"

import React, { useState, useEffect } from 'react'
import { Clock, Package, Truck, CheckCircle, XCircle, RefreshCw, AlertCircle, Send } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerOrders/OrderStatus.scss'

export default function OrderStatus({ selectedOrder, onStatusUpdate, onRefresh }) {
  const [mounted, setMounted] = useState(false)
  const [currentStatus, setCurrentStatus] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    setMounted(true)
    if (selectedOrder) {
      setCurrentStatus(selectedOrder.status)
      setSelectedStatus(selectedOrder.status)
      setError(null)
    }
  }, [selectedOrder])

  if (!mounted) return null

  const statusFlow = [
    { key: 'pending', label: 'Pending', icon: <Clock size={16} />, color: 'gray', description: 'Order received, awaiting confirmation' },
    { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle size={16} />, color: 'blue', description: 'Order confirmed' },
    { key: 'processing', label: 'Processing', icon: <Package size={16} />, color: 'purple', description: 'Preparing for shipment' },
    { key: 'shipped', label: 'Shipped', icon: <Truck size={16} />, color: 'indigo', description: 'On the way' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck size={16} />, color: 'indigo', description: 'Out for delivery' },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircle size={16} />, color: 'green', description: 'Order completed' },
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
    const index = statusFlow.findIndex(s => s.key === currentStatus)
    return index >= 0 ? index : 0
  }

  // Real API call to update order status
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedOrder) return
    
    setIsUpdating(true)
    setError(null)
    
    try {
      // Call your backend API
      const response = await fetch(`/api/commerce/orders/${selectedOrder.order_number}/status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update status')
      }
      
      const data = await response.json()
      
      // Update local state
      setCurrentStatus(newStatus)
      setSelectedStatus(newStatus)
      
      // Notify parent component
      if (onStatusUpdate) onStatusUpdate(newStatus)
      
      // Refresh orders list to get updated data from backend
      if (onRefresh) onRefresh()
      
    } catch (err) {
      console.error('Status update error:', err)
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  // Real API call to cancel order
  const handleCancelOrder = async () => {
    if (!selectedOrder) return
    
    setIsUpdating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/commerce/orders/${selectedOrder.order_number}/cancel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to cancel order')
      }
      
      const data = await response.json()
      
      setCurrentStatus('cancelled')
      setSelectedStatus('cancelled')
      
      if (onStatusUpdate) onStatusUpdate('cancelled')
      if (onRefresh) onRefresh()
      
    } catch (err) {
      console.error('Cancel order error:', err)
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
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
            currentStatus === 'shipped' || currentStatus === 'out_for_delivery' ? 'indigo' :
            currentStatus === 'processing' ? 'purple' :
            currentStatus === 'confirmed' ? 'blue' :
            currentStatus === 'cancelled' ? 'red' : 'gray'
          )}`}>
            {currentStatus?.charAt(0).toUpperCase() + currentStatus?.slice(1).replace(/_/g, ' ') || 'Pending'}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Track your order progress</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Status Timeline */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div 
            className="absolute left-5 top-0 w-0.5 bg-primary-500 transition-all duration-500"
            style={{ height: `${(currentStepIndex / (statusFlow.length - 1)) * 100}%` }}
          />

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
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Status Update Section */}
      {currentStatus !== 'delivered' && currentStatus !== 'cancelled' && currentStatus !== 'refunded' && (
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
                } hover:opacity-80 disabled:opacity-50`}
              >
                {status.icon}
                <span>Mark as {status.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Action */}
      {(currentStatus === 'pending' || currentStatus === 'confirmed') && (
        <div className="p-4">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Order Actions</h4>
          <div className="flex gap-2">
            <button
              onClick={handleCancelOrder}
              disabled={isUpdating}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${getStatusColor('red')} hover:opacity-80 disabled:opacity-50`}
            >
              <XCircle size={14} />
              <span>Cancel Order</span>
            </button>
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
              <p className="text-xs text-green-600 mt-0.5">Order completed successfully</p>
            </div>
          </div>
        </div>
      )}

      {/* Cancelled Info */}
      {currentStatus === 'cancelled' && (
        <div className="p-4 bg-red-50 rounded-b-xl">
          <div className="flex items-center gap-2">
            <XCircle size={16} className="text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-800">Order Cancelled</p>
              <p className="text-xs text-red-600 mt-0.5">Order has been cancelled</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}