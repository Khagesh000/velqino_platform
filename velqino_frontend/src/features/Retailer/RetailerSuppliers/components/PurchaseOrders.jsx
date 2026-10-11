"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Package, Plus, Clock, CheckCircle, Truck, Eye, Download, 
  ChevronLeft, ChevronRight, X, Calendar, DollarSign, Filter,
  Building, Check, AlertCircle, ShoppingCart
} from '../../../../utils/icons'

export default function PurchaseOrders({ selectedSupplier }) {
  const [mounted, setMounted] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterBySelected, setFilterBySelected] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const [purchaseOrders, setPurchaseOrders] = useState([
    { 
      id: 'PO-2026-001', 
      supplier: 'Fashion Hub', 
      date: '2026-04-10', 
      expectedDate: '2026-04-15', 
      items: [
        { name: 'Cotton T-Shirt (M)', qty: 50, price: 350 },
        { name: 'Slim Jeans (32)', qty: 30, price: 850 }
      ], 
      total: 43000, 
      status: 'shipped', 
      notes: 'Standard priority replenishment' 
    },
    { 
      id: 'PO-2026-002', 
      supplier: 'ElectroMart', 
      date: '2026-04-08', 
      expectedDate: '2026-04-14', 
      items: [
        { name: 'Wireless Earbuds', qty: 25, price: 1200 },
        { name: 'Type-C Fast Cables', qty: 60, price: 150 }
      ], 
      total: 39000, 
      status: 'pending', 
      notes: 'Urgent restocking for weekend sale' 
    },
    { 
      id: 'PO-2026-003', 
      supplier: 'TechGadgets', 
      date: '2026-04-02', 
      expectedDate: '2026-04-09', 
      items: [
        { name: 'Smart Fitness Band', qty: 20, price: 2100 },
        { name: 'Power Bank 20000mAh', qty: 15, price: 1400 }
      ], 
      total: 63000, 
      status: 'delivered', 
      notes: 'Received in full condition' 
    },
    { 
      id: 'PO-2026-004', 
      supplier: 'LeatherCraft', 
      date: '2026-03-25', 
      expectedDate: '2026-03-30', 
      items: [
        { name: 'RFID Bifold Wallet', qty: 35, price: 650 },
        { name: 'Full Grain Leather Belt', qty: 20, price: 550 }
      ], 
      total: 33750, 
      status: 'delivered', 
      notes: 'Batch inspection passed' 
    },
    { 
      id: 'PO-2026-005', 
      supplier: 'SportFit', 
      date: '2026-03-18', 
      expectedDate: '2026-03-24', 
      items: [
        { name: 'Performance Running Shoes', qty: 15, price: 1800 },
        { name: 'Breathable Ankle Socks', qty: 50, price: 120 }
      ], 
      total: 33000, 
      status: 'delivered', 
      notes: 'Delivered on schedule' 
    },
  ])

  // New PO form state
  const [newOrder, setNewOrder] = useState({
    supplier: selectedSupplier?.name || 'Fashion Hub',
    expectedDate: '',
    notes: '',
    items: [{ name: '', qty: 10, price: 500 }]
  })

  const itemsPerPage = 4

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (selectedSupplier) {
      setNewOrder(prev => ({ ...prev, supplier: selectedSupplier.name }))
    }
  }, [selectedSupplier])

  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter(order => {
      const matchesSupplier = (!filterBySelected || !selectedSupplier) || order.supplier === selectedSupplier.name
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus
      return matchesSupplier && matchesStatus
    })
  }, [purchaseOrders, filterBySelected, selectedSupplier, filterStatus])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusBadge = (status) => {
    switch(status) {
      case 'delivered':
        return { 
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
          icon: <CheckCircle size={11} />, 
          label: 'Delivered' 
        }
      case 'shipped':
        return { 
          bg: 'bg-blue-50 text-blue-700 border-blue-200', 
          icon: <Truck size={11} />, 
          label: 'In Transit' 
        }
      case 'pending':
        return { 
          bg: 'bg-amber-50 text-amber-700 border-amber-200', 
          icon: <Clock size={11} />, 
          label: 'Pending' 
        }
      default:
        return { 
          bg: 'bg-gray-50 text-gray-700 border-gray-200', 
          icon: <Package size={11} />, 
          label: status 
        }
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const handleAddItemRow = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { name: '', qty: 10, price: 500 }]
    })
  }

  const handleRemoveItemRow = (index) => {
    if (newOrder.items.length === 1) return
    const updated = newOrder.items.filter((_, idx) => idx !== index)
    setNewOrder({ ...newOrder, items: updated })
  }

  const handleItemChange = (index, field, value) => {
    const updated = [...newOrder.items]
    updated[index][field] = field === 'name' ? value : Number(value) || 0
    setNewOrder({ ...newOrder, items: updated })
  }

  const calculatedTotal = newOrder.items.reduce((sum, it) => sum + (it.qty * it.price), 0)

  const handleCreateOrderSubmit = (e) => {
    e.preventDefault()
    const orderNumber = `PO-2026-00${purchaseOrders.length + 1}`
    const today = new Date().toISOString().split('T')[0]

    const created = {
      id: orderNumber,
      supplier: newOrder.supplier,
      date: today,
      expectedDate: newOrder.expectedDate || today,
      items: newOrder.items.filter(i => i.name.trim()),
      total: calculatedTotal,
      status: 'pending',
      notes: newOrder.notes || 'Replenishment Order'
    }

    setPurchaseOrders([created, ...purchaseOrders])
    setShowCreateModal(false)
    setNewOrder({
      supplier: selectedSupplier?.name || 'Fashion Hub',
      expectedDate: '',
      notes: '',
      items: [{ name: '', qty: 10, price: 500 }]
    })
  }

  const handleMarkReceived = (orderId) => {
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === orderId) {
        return { ...po, status: 'delivered' }
      }
      return po
    }))
  }

  if (!mounted) {
    return <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse" />
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold shadow-sm ring-1 ring-primary-100">
              <Package size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Purchase Orders</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                  {purchaseOrders.length} Orders
                </span>
              </div>
              <p className="text-xs text-gray-500">Track shipments, receipts & procurement batches</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 rounded-lg shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus size={14} />
            Create Purchase Order
          </button>
        </div>

        {/* Filter Pills and Supplier Toggle */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['all', 'pending', 'shipped', 'delivered'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  filterStatus === status
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {status === 'shipped' ? 'In Transit' : status}
              </button>
            ))}
          </div>

          {selectedSupplier && (
            <button
              onClick={() => setFilterBySelected(!filterBySelected)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                filterBySelected 
                  ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                  : 'bg-gray-100 text-gray-600 border border-transparent'
              }`}
            >
              <span>{filterBySelected ? `Filtered to: ${selectedSupplier.name}` : 'Showing all suppliers'}</span>
              <X size={12} className={filterBySelected ? 'opacity-100' : 'opacity-0'} />
            </button>
          )}
        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="p-5 flex-1 overflow-y-auto space-y-3">
        {paginatedOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-700">No purchase orders found</p>
            <p className="text-xs text-gray-400 mt-1">There are no orders matching the current filter</p>
          </div>
        ) : (
          paginatedOrders.map((order) => {
            const statusConfig = getStatusBadge(order.status)
            return (
              <div 
                key={order.id} 
                className="p-4 rounded-xl border border-gray-200/80 hover:border-primary-200 hover:shadow-sm transition-all bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 tracking-tight">{order.id}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-semibold text-gray-700">{order.supplier}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusConfig.bg}`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                    <span className="text-xs font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Items & Schedule Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2.5 text-xs text-gray-600">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-0.5">Manifest Items</span>
                    <p className="text-xs font-medium text-gray-800 line-clamp-1">
                      {order.items.map(i => `${i.name} (${i.qty})`).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-0.5">Ordered</span>
                      <span className="text-xs font-medium text-gray-700">{formatDate(order.date)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-0.5">Expected Delivery</span>
                      <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                        {formatDate(order.expectedDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 italic truncate max-w-[200px]">
                    {order.notes || 'No special notes'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {order.status !== 'delivered' && (
                      <button
                        onClick={() => handleMarkReceived(order.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all"
                      >
                        <Check size={12} />
                        Receive
                      </button>
                    )}
                    <button
                      onClick={() => alert(`Purchase Order ${order.id} invoice document generated!`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                    >
                      <Download size={12} />
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {filteredOrders.length} purchase orders total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-gray-700 px-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                  <ShoppingCart size={16} />
                </div>
                <h3 className="text-base font-bold text-gray-900">Issue Purchase Order</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Target Vendor *</label>
                  <select
                    value={newOrder.supplier}
                    onChange={(e) => setNewOrder({ ...newOrder, supplier: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Fashion Hub">Fashion Hub</option>
                    <option value="ElectroMart">ElectroMart</option>
                    <option value="TechGadgets">TechGadgets</option>
                    <option value="LeatherCraft">LeatherCraft</option>
                    <option value="SportFit">SportFit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={newOrder.expectedDate}
                    onChange={(e) => setNewOrder({ ...newOrder, expectedDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-gray-700">Order Lines</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700"
                  >
                    + Add Product Line
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {newOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Item name (e.g. Cotton T-Shirt)"
                        required
                        value={item.name}
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                        className="w-16 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                      />
                      <input
                        type="number"
                        placeholder="₹ Unit Price"
                        min="1"
                        value={item.price}
                        onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                        className="w-24 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                      />
                      {newOrder.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Procurement Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Standard wholesale delivery, ground shipping"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              {/* Total Summary */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Calculated PO Volume:</span>
                <span className="text-sm font-bold text-gray-900">₹{calculatedTotal.toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 rounded-xl shadow-sm transition-all"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
