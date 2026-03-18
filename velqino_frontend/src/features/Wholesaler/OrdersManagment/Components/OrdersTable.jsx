"use client"

import React, { useState } from 'react'
import { 
  MoreVertical, 
  Download, 
  Printer,
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/OrdersManagment/OrdersTable.scss'

export default function OrdersTable() {
  const [selectedOrders, setSelectedOrders] = useState([])
  const [hoveredRow, setHoveredRow] = useState(null)

  const orders = [
    {
      id: '#ORD-2024-001',
      customer: { name: 'Rajesh Kumar', type: 'Wholesaler', email: 'rajesh@example.com', avatar: 'RK' },
      products: [
        { name: 'Wireless Headphones', qty: 50, price: 1250 },
        { name: 'Bluetooth Speaker', qty: 25, price: 2499 }
      ],
      total: 124750,
      payment: { status: 'Paid', method: 'UPI', date: '2024-01-15' },
      fulfillment: { status: 'Shipped', tracking: 'TRK123456' },
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-18',
      priority: 'High'
    },
    {
      id: '#ORD-2024-002',
      customer: { name: 'Priya Sharma', type: 'Retailer', email: 'priya@example.com', avatar: 'PS' },
      products: [
        { name: 'Cotton T-Shirts', qty: 100, price: 450 },
        { name: 'Denim Jeans', qty: 40, price: 1299 }
      ],
      total: 96960,
      payment: { status: 'Pending', method: 'Credit', date: '2024-01-16' },
      fulfillment: { status: 'Processing', tracking: null },
      orderDate: '2024-01-16',
      deliveryDate: '2024-01-20',
      priority: 'Medium'
    },
    {
      id: '#ORD-2024-003',
      customer: { name: 'Amit Patel', type: 'Distributor', email: 'amit@example.com', avatar: 'AP' },
      products: [
        { name: 'Smart Watches', qty: 30, price: 3499 },
        { name: 'Fitness Bands', qty: 45, price: 1999 }
      ],
      total: 194955,
      payment: { status: 'Paid', method: 'Bank Transfer', date: '2024-01-14' },
      fulfillment: { status: 'Delivered', tracking: 'TRK789012' },
      orderDate: '2024-01-14',
      deliveryDate: '2024-01-17',
      priority: 'High'
    }
  ]

  const getPaymentBadge = (status) => {
    const styles = {
      Paid: 'bg-success-50 text-success-700',
      Pending: 'bg-warning-50 text-warning-700',
      Failed: 'bg-error-50 text-error-700',
      Refunded: 'bg-gray-100 text-gray-700'
    }
    return styles[status] || 'bg-gray-50 text-gray-700'
  }

  const getFulfillmentBadge = (status) => {
    const styles = {
      Delivered: 'bg-success-50 text-success-700',
      Shipped: 'bg-info-50 text-info-700',
      Processing: 'bg-warning-50 text-warning-700',
      Cancelled: 'bg-error-50 text-error-700'
    }
    return styles[status] || 'bg-gray-50 text-gray-700'
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      High: 'bg-error-50 text-error-700',
      Medium: 'bg-warning-50 text-warning-700',
      Low: 'bg-success-50 text-success-700'
    }
    return styles[priority] || 'bg-gray-50 text-gray-700'
  }

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(o => o.id))
    }
  }

  const toggleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Table Header with Actions */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Orders Table</h3>
          {selectedOrders.length > 0 && (
            <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
              {selectedOrders.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <Download size={18} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <Printer size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-10 px-4 py-3">
                <input 
                  type="checkbox"
                  checked={selectedOrders.length === orders.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fulfillment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="w-10 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr 
                key={order.id}
                className={`orders-table-row ${hoveredRow === order.id ? 'orders-table-row-hover' : ''} ${
                  selectedOrders.includes(order.id) ? 'bg-primary-50/30' : ''
                }`}
                onMouseEnter={() => setHoveredRow(order.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-4 py-3">
                  <input 
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleSelectOrder(order.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-primary-600">{order.id}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                      {order.customer.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">{order.customer.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    {order.products.slice(0, 2).map((product, i) => (
                      <p key={i} className="text-sm text-gray-700">
                        {product.name} × {product.qty}
                      </p>
                    ))}
                    {order.products.length > 2 && (
                      <p className="text-xs text-gray-500">+{order.products.length - 2} more</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{order.total.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPaymentBadge(order.payment.status)}`}>
                      {order.payment.status}
                    </span>
                    <p className="text-xs text-gray-500">{order.payment.method}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getFulfillmentBadge(order.fulfillment.status)}`}>
                      {order.fulfillment.status}
                    </span>
                    {order.fulfillment.tracking && (
                      <p className="text-xs text-gray-500">Track: {order.fulfillment.tracking}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{order.orderDate}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{order.deliveryDate}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(order.priority)}`}>
                    {order.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing 1 to {orders.length} of {orders.length} orders
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600">
            1
          </button>
          <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}