"use client"

import React, { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle, XCircle, Clock, Package, Truck, FileText, MessageCircle, Upload, Eye, AlertCircle, DollarSign } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerOrders/ReturnsManagement.scss'

export default function ReturnsManagement({ selectedOrder }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('requests')
  const [selectedReturn, setSelectedReturn] = useState(null)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnReason, setReturnReason] = useState('')
  const [returnComment, setReturnComment] = useState('')
  const [returnItems, setReturnItems] = useState([])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Mock return requests data
  const returnRequests = [
    { id: 'RET-001', orderId: 'ORD-005', customer: 'Vikram Mehta', items: ['Wireless Headphones'], reason: 'Damaged product', status: 'pending', amount: 2499, date: '2026-04-13', type: 'return' },
    { id: 'RET-002', orderId: 'ORD-007', customer: 'Rahul Verma', items: ['Smart Watch Pro'], reason: 'Wrong size', status: 'approved', amount: 4999, date: '2026-04-11', type: 'exchange' },
    { id: 'RET-003', orderId: 'ORD-002', customer: 'Priya Sharma', items: ['Premium Cotton T-Shirt'], reason: 'Defective', status: 'processing', amount: 499, date: '2026-04-14', type: 'return' },
  ]

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={12} />, label: 'Pending' }
      case 'processing': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <RefreshCw size={12} />, label: 'Processing' }
      case 'approved': return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={12} />, label: 'Approved' }
      case 'rejected': return { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={12} />, label: 'Rejected' }
      case 'completed': return { bg: 'bg-purple-100', text: 'text-purple-700', icon: <Package size={12} />, label: 'Completed' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Clock size={12} />, label: status }
    }
  }

  const getTypeBadge = (type) => {
    switch(type) {
      case 'return': return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Return' }
      case 'exchange': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Exchange' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: type }
    }
  }

  const stats = {
    pending: returnRequests.filter(r => r.status === 'pending').length,
    approved: returnRequests.filter(r => r.status === 'approved').length,
    processing: returnRequests.filter(r => r.status === 'processing').length,
    totalAmount: returnRequests.reduce((sum, r) => sum + r.amount, 0)
  }

  const handleSubmitReturn = () => {
    if (!returnReason) return
    setShowReturnModal(false)
    setReturnReason('')
    setReturnComment('')
    setReturnItems([])
    alert('Return request submitted successfully!')
  }

  return (
    <div className="returns-management bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Returns Management</h3>
          </div>
          <button 
            onClick={() => setShowReturnModal(true)}
            className="px-3 py-1.5 text-xs font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
          >
            New Request
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Manage return requests and refunds</p>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-3 gap-3 border-b border-gray-100">
        <div className="text-center p-2 bg-yellow-50 rounded-lg">
          <p className="text-lg font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-[10px] text-yellow-600">Pending</p>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <p className="text-lg font-bold text-green-700">{stats.approved}</p>
          <p className="text-[10px] text-green-600">Approved</p>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <p className="text-lg font-bold text-blue-700">{stats.processing}</p>
          <p className="text-[10px] text-blue-600">Processing</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'requests' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Return Requests
        </button>
        <button
          onClick={() => setActiveTab('refunds')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'refunds' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Refund Status
        </button>
        <button
          onClick={() => setActiveTab('exchanges')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'exchanges' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Exchanges
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[350px] overflow-y-auto custom-scroll">
        {activeTab === 'requests' && (
          <div className="space-y-3">
            {returnRequests.length === 0 ? (
              <div className="text-center py-8">
                <Package size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No return requests</p>
              </div>
            ) : (
              returnRequests.map((request) => {
                const status = getStatusBadge(request.status)
                const type = getTypeBadge(request.type)
                return (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedReturn(request)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{request.id}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${type.bg} ${type.text}`}>
                            {type.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Order: {request.orderId}</p>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                          {status.icon}
                          <span>{status.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <Package size={10} />
                      <span>{request.items.join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{request.reason}</p>
                      <p className="text-sm font-bold text-gray-900">₹{request.amount.toLocaleString()}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'refunds' && (
          <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Total Refunds Processed</span>
                </div>
                <span className="text-xl font-bold text-green-700">₹{stats.totalAmount.toLocaleString()}</span>
              </div>
              <p className="text-xs text-green-600">Last 30 days</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Refund Method</span>
                <span className="font-medium text-gray-900">Original Payment Method</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Processing Time</span>
                <span className="font-medium text-gray-900">5-7 Business Days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Refund Status</span>
                <span className="font-medium text-green-600">Processing</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exchanges' && (
          <div className="space-y-3">
            {returnRequests.filter(r => r.type === 'exchange').length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No exchange requests</p>
              </div>
            ) : (
              returnRequests.filter(r => r.type === 'exchange').map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{request.id}</p>
                      <p className="text-xs text-gray-500">Exchange for: {request.items.join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      <CheckCircle size={10} />
                      <span>Approved</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Reason: {request.reason}</p>
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <Truck size={12} />
                    <span>New item shipped on {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <RefreshCw size={20} className="text-primary-500" />
                  <h3 className="text-lg font-semibold text-gray-900">New Return Request</h3>
                </div>
                <button onClick={() => setShowReturnModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Order Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Order</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500">
                    <option value="">Select order...</option>
                    <option>ORD-005 - ₹2,499</option>
                    <option>ORD-007 - ₹4,999</option>
                  </select>
                </div>

                {/* Items to Return */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Items to Return</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">Wireless Headphones - ₹2,499</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">Smart Watch Pro - ₹4,999</span>
                    </label>
                  </div>
                </div>

                {/* Return Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Type</label>
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer">
                      <input type="radio" name="returnType" value="return" className="sr-only" />
                      <span>Return</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer">
                      <input type="radio" name="returnType" value="exchange" className="sr-only" />
                      <span>Exchange</span>
                    </label>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Return</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select reason...</option>
                    <option>Damaged product</option>
                    <option>Wrong item sent</option>
                    <option>Size/color mismatch</option>
                    <option>Defective product</option>
                    <option>Changed mind</option>
                  </select>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
                  <textarea
                    rows={3}
                    value={returnComment}
                    onChange={(e) => setReturnComment(e.target.value)}
                    placeholder="Describe the issue..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>

                {/* Upload Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Optional)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-primary-300 transition-all">
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Click or drag images here</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowReturnModal(false)}
                    className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReturn}
                    className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}