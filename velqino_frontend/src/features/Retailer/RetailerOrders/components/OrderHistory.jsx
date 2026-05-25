"use client"

import React, { useState, useEffect } from 'react'
import { Clock, Package, Eye, TrendingUp, Calendar, Search, Filter, ChevronLeft, ChevronRight } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerOrders/OrderHistory.scss'

export default function OrderHistory({ selectedOrder, orders = [] }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const itemsPerPage = 5

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate customer data from real orders
  const getCustomerDataFromOrders = (customerName, customerEmail) => {
    // Filter orders for this customer
    const customerOrdersList = orders.filter(order => 
      order.customer_name === customerName || order.customer_email === customerEmail
    )
    
    if (customerOrdersList.length === 0) return null
    
    const totalSpent = customerOrdersList.reduce((sum, order) => sum + parseFloat(order.grand_total || 0), 0)
    const firstOrder = customerOrdersList[customerOrdersList.length - 1]
    
    return {
      customer: {
        name: customerOrdersList[0]?.customer_name || customerName,
        phone: customerOrdersList[0]?.customer_phone || 'N/A',
        email: customerOrdersList[0]?.customer_email || customerEmail,
        since: firstOrder?.created_at ? new Date(firstOrder.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A',
        totalSpent: totalSpent,
        totalOrders: customerOrdersList.length
      },
      orders: customerOrdersList.map(order => ({
        id: order.order_number,
        date: order.created_at,
        amount: parseFloat(order.grand_total),
        items: order.items?.length || 0,
        status: order.status,
        payment: order.payment_method?.toUpperCase() || 'N/A'
      }))
    }
  }

  // Determine which customer to show
  let currentCustomerData = null
  
  if (selectedOrder) {
    // Show history for selected order's customer
    currentCustomerData = getCustomerDataFromOrders(selectedOrder.customer_name, selectedOrder.customer_email)
  } else if (selectedCustomer) {
    // Show history for selected customer from top customers list
    currentCustomerData = getCustomerDataFromOrders(selectedCustomer.name, selectedCustomer.email)
  } else if (orders.length > 0) {
    // Default to first customer in orders list
    const firstOrder = orders[0]
    if (firstOrder) {
      currentCustomerData = getCustomerDataFromOrders(firstOrder.customer_name, firstOrder.customer_email)
    }
  }

  // If no orders at all
  if (!currentCustomerData && orders.length === 0) {
    return (
      <div className="order-history bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Order History</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">Customer purchase history & insights</p>
        </div>
        <div className="p-8 text-center">
          <Package size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">No orders found</p>
        </div>
      </div>
    )
  }

  const customerData = currentCustomerData
  const customer = customerData.customer
  const customerOrdersList = customerData.orders

  const filteredOrders = customerOrdersList.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusClass = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'shipped': return 'bg-purple-100 text-purple-700'
      case 'processing': return 'bg-yellow-100 text-yellow-700'
      case 'confirmed': return 'bg-blue-100 text-blue-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Calculate top customers from real orders
  const getTopCustomersFromOrders = () => {
    const customerMap = new Map()
    
    orders.forEach(order => {
      const customerKey = order.customer_email
      if (!customerMap.has(customerKey)) {
        customerMap.set(customerKey, {
          name: order.customer_name,
          phone: order.customer_phone,
          email: order.customer_email,
          totalSpent: 0,
          totalOrders: 0
        })
      }
      const customerData = customerMap.get(customerKey)
      customerData.totalSpent += parseFloat(order.grand_total || 0)
      customerData.totalOrders += 1
    })
    
    return Array.from(customerMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 3)
  }

  const topCustomers = orders.length > 0 ? getTopCustomersFromOrders() : []

  return (
    <div className="order-history bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-primary-500" />
          <h3 className="text-base font-semibold text-gray-900">Order History</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">Customer purchase history & insights</p>
      </div>

      {/* Customer Summary */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-bold text-gray-900">{customer.name}</h4>
            <p className="text-xs text-gray-500">Customer since {customer.since}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary-600">₹{customer.totalSpent.toLocaleString()}</p>
            <p className="text-[10px] text-gray-500">Total spent</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">{customer.phone}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-gray-500">{customer.email}</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{customer.totalOrders} orders</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders by ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 max-h-[300px] overflow-y-auto custom-scroll">
        {paginatedOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedOrders.map((order, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <Calendar size={10} />
                      <span>{formatDate(order.date)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{order.amount.toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Package size={10} />
                    <span>{order.items} items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Paid via {order.payment}</span>
                    <button className="p-1 text-gray-400 hover:text-primary-600">
                      <Eye size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

      {/* Top Customers Insights */}
      {topCustomers.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={12} className="text-green-500" />
            <h4 className="text-xs font-semibold text-gray-700">Top Customers</h4>
          </div>
          <div className="space-y-2">
            {topCustomers.map((customer, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between cursor-pointer hover:bg-white p-2 rounded-lg transition-all"
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">
                    {customer.name?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{customer.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500">{customer.totalOrders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}