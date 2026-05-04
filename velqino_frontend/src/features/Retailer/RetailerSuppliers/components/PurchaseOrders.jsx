"use client"

import React, { useState, useEffect } from 'react'
import { FileText, Plus, Eye, Edit, Trash2, CheckCircle, Clock, Truck, Package, Calendar, Download, Search, Filter, ChevronLeft, ChevronRight, X, Save } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSuppliers/PurchaseOrders.scss'

export default function PurchaseOrders({ selectedSupplier }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [formData, setFormData] = useState({
    supplier: '',
    items: [],
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    notes: ''
  })
  const [newItem, setNewItem] = useState({ product: '', quantity: 1, price: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const purchaseOrders = [
    { id: 'PO-001', supplier: 'Fashion Hub', date: '2026-04-10', expectedDate: '2026-04-15', status: 'delivered', items: 3, total: 45000, receivedDate: '2026-04-14' },
    { id: 'PO-002', supplier: 'ElectroMart', date: '2026-04-05', expectedDate: '2026-04-12', status: 'shipped', items: 2, total: 28000, tracking: 'TRK123456' },
    { id: 'PO-003', supplier: 'TechGadgets', date: '2026-03-28', expectedDate: '2026-04-05', status: 'delivered', items: 4, total: 62000, receivedDate: '2026-04-04' },
    { id: 'PO-004', supplier: 'LeatherCraft', date: '2026-03-20', expectedDate: '2026-03-25', status: 'delivered', items: 2, total: 35000, receivedDate: '2026-03-24' },
    { id: 'PO-005', supplier: 'SportFit', date: '2026-04-12', expectedDate: '2026-04-18', status: 'pending', items: 3, total: 52000 },
  ]

  const getStatusConfig = (status) => {
    switch(status) {
      case 'delivered':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={12} />, label: 'Delivered' }
      case 'shipped':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Truck size={12} />, label: 'Shipped' }
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={12} />, label: 'Pending' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Package size={12} />, label: status }
    }
  }

  const filteredOrders = purchaseOrders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredOrders.length / 5)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * 5, currentPage * 5)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const handleAddItem = () => {
    if (newItem.product && newItem.quantity > 0) {
      setFormData({
        ...formData,
        items: [...formData.items, { ...newItem, total: newItem.quantity * newItem.price }]
      })
      setNewItem({ product: '', quantity: 1, price: 0 })
    }
  }

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const totalAmount = formData.items.reduce((sum, item) => sum + item.total, 0)

  const handleCreatePO = () => {
    if (formData.items.length === 0) {
      alert('Please add at least one item')
      return
    }
    setShowCreateModal(false)
    setFormData({ supplier: '', items: [], orderDate: new Date().toISOString().split('T')[0], expectedDate: '', notes: '' })
    alert('Purchase Order created successfully!')
  }

  const handleReceiveOrder = (orderId) => {
    alert(`Order ${orderId} marked as received`)
  }

  return (
    <div className="purchase-orders bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Purchase Orders</h3>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 text-xs font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1"
          >
            <Plus size={12} />
            Create PO
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Create and track purchase orders</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'list' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          All Orders
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'pending' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab('shipped')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'shipped' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Shipped
        </button>
        <button
          onClick={() => setActiveTab('delivered')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'delivered' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Delivered
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by PO number or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 max-h-[320px] overflow-y-auto custom-scroll">
        <div className="space-y-3">
          {paginatedOrders.map((order) => {
            const status = getStatusConfig(order.status)
            return (
              <div key={order.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.supplier}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                    {status.icon}
                    {status.label}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} className="text-gray-400" />
                    <span>Ordered: {formatDate(order.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package size={10} className="text-gray-400" />
                    <span>{order.items} items</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                  {order.expectedDate && (
                    <span className="text-[10px] text-gray-500">Expected: {formatDate(order.expectedDate)}</span>
                  )}
                </div>

                {order.status === 'shipped' && order.tracking && (
                  <div className="mb-2 text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-lg inline-block">
                    Tracking: {order.tracking}
                  </div>
                )}

                <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                  <button className="flex-1 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-1">
                    <Eye size={12} />
                    View
                  </button>
                  {order.status === 'shipped' && (
                    <button
                      onClick={() => handleReceiveOrder(order.id)}
                      className="flex-1 py-1.5 text-xs font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={12} />
                      Receive
                    </button>
                  )}
                  <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg">
                    <Download size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {filteredOrders.length} orders
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronLeft size={12} />
            </button>
            <span className="text-xs text-gray-600">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Create Purchase Order</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Supplier Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <select
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="">Select supplier</option>
                  <option>Fashion Hub</option>
                  <option>ElectroMart</option>
                  <option>TechGadgets</option>
                  <option>LeatherCraft</option>
                  <option>SportFit</option>
                </select>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                  <input
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery</label>
                  <input
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
                <div className="space-y-2">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product}</p>
                        <p className="text-xs text-gray-500">{item.quantity} × ₹{item.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">₹{item.total}</p>
                      </div>
                      <button onClick={() => handleRemoveItem(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Item Row */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Product name"
                    value={newItem.product}
                    onChange={(e) => setNewItem({ ...newItem, product: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                    className="w-20 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) || 0 })}
                    className="w-24 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                  <button onClick={handleAddItem} className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                  placeholder="Any special instructions..."
                />
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                  <span className="text-xl font-bold text-primary-600">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePO}
                  className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
                >
                  Create PO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}