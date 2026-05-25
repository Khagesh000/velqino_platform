"use client"

import React, { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle, XCircle, Clock, Package, Truck, FileText, MessageCircle, Upload, Eye, AlertCircle, DollarSign } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerOrders/ReturnsManagement.scss'
import { useGetRetailerReturnsQuery, useCreateReturnRequestMutation, useUpdateReturnStatusMutation } from '@/redux/retailer/slices/retailerOrdersSlice'
export default function ReturnsManagement({ selectedOrder, retailerOrders = [] }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('requests')
  const [selectedReturn, setSelectedReturn] = useState(null)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnReason, setReturnReason] = useState('')
  const [returnComment, setReturnComment] = useState('')
  const [returnItems, setReturnItems] = useState([])
  const [returnType, setReturnType] = useState('return')
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch return requests from backend
  const { data: returnsData, isLoading, refetch } = useGetRetailerReturnsQuery()
  const [createReturnRequest, { isLoading: isCreating }] = useCreateReturnRequestMutation()
  const [updateReturnStatus, { isLoading: isUpdating }] = useUpdateReturnStatusMutation()

  useEffect(() => {
    setMounted(true)
  }, [])
  

  // USE returnsData instead of returnRequests state
  const returnRequests = returnsData?.data || []

  if (!mounted) return null

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
    totalAmount: returnRequests.reduce((sum, r) => sum + parseFloat(r.refund_amount || 0), 0)
  }

  const handleSubmitReturn = async () => {
  if (!returnReason || !selectedOrderForReturn || returnItems.length === 0) {
    alert('Please fill all required fields')
    return
  }

  try {
    const result = await createReturnRequest({
      order_id: selectedOrderForReturn,
      return_type: returnType,
      reason: returnReason,
      comments: returnComment,
      items: returnItems
    }).unwrap()

    if (result.status === 'success') {
      alert('Return request submitted successfully!')
      setShowReturnModal(false)
      setReturnReason('')
      setReturnComment('')
      setReturnItems([])
      setSelectedOrderForReturn('')
      refetch() // Refresh the list
    }
  } catch (error) {
    console.error('Submit return error:', error)
    alert(error.data?.message || 'Failed to submit return request')
  }
}

 const handleUpdateReturnStatus = async (returnId, newStatus) => {
  try {
    await updateReturnStatus({ returnId, status: newStatus }).unwrap()
    refetch() // Refresh the list
  } catch (error) {
    console.error('Update status error:', error)
    alert('Failed to update status')
  }
}

  // Get available orders for return (delivered orders only)
  const availableOrders = retailerOrders.filter(order => 
  order.status === 'delivered' && 
  !returnRequests.some(r => r.order_number === order.order_number)
)


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
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw size={24} className="mx-auto text-gray-400 animate-spin mb-2" />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
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
                    const type = getTypeBadge(request.return_type)
                    return (
                      <div
                        key={request.return_number}
                        className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setSelectedReturn(request)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900">{request.return_number}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${type.bg} ${type.text}`}>
                                {type.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">Order: {request.order?.order_number || request.order_id}</p>
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
                          <span>{request.items?.map(i => i.product_name).join(', ') || 'Items'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">{request.reason}</p>
                          <p className="text-sm font-bold text-gray-900">₹{parseFloat(request.refund_amount).toLocaleString()}</p>
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUpdateReturnStatus(request.return_number, 'approved') }}
                              className="flex-1 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUpdateReturnStatus(request.return_number, 'rejected') }}
                              className="flex-1 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        )}
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
                  <p className="text-xs text-green-600">All time</p>
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
                </div>
              </div>
            )}

            {activeTab === 'exchanges' && (
              <div className="space-y-3">
                {returnRequests.filter(r => r.return_type === 'exchange').length === 0 ? (
                  <div className="text-center py-8">
                    <RefreshCw size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">No exchange requests</p>
                  </div>
                ) : (
                  returnRequests.filter(r => r.return_type === 'exchange').map((request) => (
                    <div key={request.return_number} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{request.return_number}</p>
                          <p className="text-xs text-gray-500">Exchange for: {request.items?.map(i => i.product_name).join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          <CheckCircle size={10} />
                          <span>{request.status}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">Reason: {request.reason}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
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
                  <select 
                    value={selectedOrderForReturn}
                    onChange={(e) => setSelectedOrderForReturn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select order...</option>
                    {availableOrders.map(order => (
                      <option key={order.order_number} value={order.order_number}>
                        {order.order_number} - ₹{parseFloat(order.grand_total).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Items to Return */}
                {selectedOrderForReturn && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Items to Return</label>
                    <div className="space-y-2">
                      {retailerOrders
                        .find(o => o.order_number === selectedOrderForReturn)?.items?.map((item, idx) => (
                          <label key={idx} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setReturnItems([...returnItems, {
                                    product_name: item.product_name,
                                    product_sku: item.product_sku,
                                    quantity: item.quantity,
                                    price: item.price,
                                    total: item.total
                                  }])
                                } else {
                                  setReturnItems(returnItems.filter(i => i.product_sku !== item.product_sku))
                                }
                              }}
                            />
                            <span className="text-sm">{item.product_name} - ₹{parseFloat(item.price).toLocaleString()} x {item.quantity}</span>
                          </label>
                        ))
                      }
                    </div>
                  </div>
                )}

                {/* Return Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReturnType('return')}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-all ${returnType === 'return' ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 text-gray-600'}`}
                    >
                      Return
                    </button>
                    <button
                      onClick={() => setReturnType('exchange')}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-all ${returnType === 'exchange' ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 text-gray-600'}`}
                    >
                      Exchange
                    </button>
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