"use client"

import React, { useState, useEffect } from 'react'
import { Package, Eye, Truck, CheckCircle, Clock, XCircle, RefreshCw, Search, Filter, ChevronLeft, ChevronRight } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerOrders/OrdersTable.scss'

export default function OrdersTable({ selectedOrder, setSelectedOrder, refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [hoveredRow, setHoveredRow] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const orders = [
    { id: '#ORD-001', customer: 'Rajesh Kumar', items: 3, total: 2450, date: '2026-04-14', status: 'delivered', payment: 'UPI', tracking: 'DEL123456' },
    { id: '#ORD-002', customer: 'Priya Sharma', items: 2, total: 1890, date: '2026-04-14', status: 'shipped', payment: 'Card', tracking: 'SHP123457' },
    { id: '#ORD-003', customer: 'Amit Singh', items: 5, total: 5670, date: '2026-04-13', status: 'processing', payment: 'Cash', tracking: null },
    { id: '#ORD-004', customer: 'Sneha Reddy', items: 1, total: 899, date: '2026-04-13', status: 'delivered', payment: 'UPI', tracking: 'DEL123458' },
    { id: '#ORD-005', customer: 'Vikram Mehta', items: 4, total: 3420, date: '2026-04-12', status: 'cancelled', payment: 'Card', tracking: null },
    { id: '#ORD-006', customer: 'Neha Gupta', items: 2, total: 1560, date: '2026-04-12', status: 'delivered', payment: 'Wallet', tracking: 'DEL123459' },
    { id: '#ORD-007', customer: 'Rahul Verma', items: 6, total: 7890, date: '2026-04-11', status: 'returned', payment: 'UPI', tracking: 'RET123460' },
    { id: '#ORD-008', customer: 'Meera Joshi', items: 3, total: 2340, date: '2026-04-11', status: 'delivered', payment: 'Card', tracking: 'DEL123461' },
  ]

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle size={14} className="text-green-500" />
      case 'shipped': return <Truck size={14} className="text-blue-500" />
      case 'processing': return <Clock size={14} className="text-yellow-500" />
      case 'cancelled': return <XCircle size={14} className="text-red-500" />
      case 'returned': return <RefreshCw size={14} className="text-orange-500" />
      default: return <Package size={14} className="text-gray-400" />
    }
  }

  const getStatusClass = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'shipped': return 'bg-blue-100 text-blue-700'
      case 'processing': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      case 'returned': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const statusCounts = {
    all: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    processing: orders.filter(o => o.status === 'processing').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    returned: orders.filter(o => o.status === 'returned').length,
  }

  return (
    <div className="orders-table-container bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">All Orders</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredOrders.length} orders
            </span>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-40 focus:outline-none focus:border-primary-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="all">All ({statusCounts.all})</option>
              <option value="delivered">Delivered ({statusCounts.delivered})</option>
              <option value="shipped">Shipped ({statusCounts.shipped})</option>
              <option value="processing">Processing ({statusCounts.processing})</option>
              <option value="cancelled">Cancelled ({statusCounts.cancelled})</option>
              <option value="returned">Returned ({statusCounts.returned})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedOrders.map((order, index) => (
              <tr
                key={order.id}
                className={`order-row cursor-pointer transition-all ${selectedOrder?.id === order.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedOrder(order)}
                onMouseEnter={() => setHoveredRow(order.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                 </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-700">{order.customer}</span>
                 </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{order.items} items</span>
                 </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                 </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</span>
                 </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(order.status)}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                 </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{order.payment}</span>
                 </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
                    <Eye size={14} />
                  </button>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded-lg transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded-lg transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}