"use client"

import React, { useState } from 'react'
import { Eye, MoreHorizontal, ChevronRight, Package, Clock, CheckCircle, XCircle } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/RecentOrdersTable.scss'

export default function RecentOrdersTable() {
  const [hoveredRow, setHoveredRow] = useState(null)

  const orders = [
    { id: '#12345', customer: 'John Doe', items: 3, amount: '₹4,500', date: '2 min ago', status: 'pending', payment: 'paid' },
    { id: '#12344', customer: 'Jane Smith', items: 2, amount: '₹2,800', date: '15 min ago', status: 'processing', payment: 'paid' },
    { id: '#12343', customer: 'Bob Wilson', items: 5, amount: '₹7,200', date: '1 hour ago', status: 'delivered', payment: 'paid' },
    { id: '#12342', customer: 'Alice Brown', items: 1, amount: '₹1,200', date: '3 hours ago', status: 'pending', payment: 'unpaid' },
    { id: '#12341', customer: 'Tom Harris', items: 4, amount: '₹6,500', date: '5 hours ago', status: 'processing', payment: 'paid' },
    { id: '#12340', customer: 'Emma Davis', items: 2, amount: '₹3,200', date: 'Yesterday', status: 'cancelled', payment: 'refunded' },
    { id: '#12339', customer: 'Chris Lee', items: 3, amount: '₹4,800', date: 'Yesterday', status: 'delivered', payment: 'paid' },
    { id: '#12338', customer: 'Sarah Miller', items: 6, amount: '₹9,500', date: 'Yesterday', status: 'processing', payment: 'paid' },
    { id: '#12337', customer: 'Mike Brown', items: 2, amount: '₹2,900', date: '2 days ago', status: 'delivered', payment: 'paid' },
    { id: '#12336', customer: 'Lisa Wang', items: 4, amount: '₹5,800', date: '2 days ago', status: 'pending', payment: 'unpaid' }
  ]

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock size={14} />
      case 'processing': return <Package size={14} />
      case 'delivered': return <CheckCircle size={14} />
      case 'cancelled': return <XCircle size={14} />
      default: return <Clock size={14} />
    }
  }

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'bg-warning-100 text-warning-600'
      case 'processing': return 'bg-primary-100 text-primary-600'
      case 'delivered': return 'bg-success-100 text-success-600'
      case 'cancelled': return 'bg-error-100 text-error-600'
      default: return 'bg-surface-2 text-tertiary'
    }
  }

  const getPaymentClass = (payment) => {
    switch(payment) {
      case 'paid': return 'bg-success-100 text-success-600'
      case 'unpaid': return 'bg-warning-100 text-warning-600'
      case 'refunded': return 'bg-error-100 text-error-600'
      default: return 'bg-surface-2 text-tertiary'
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
            <Package size={18} className="lg:w-5 lg:h-5" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-primary">Recent Orders</h3>
            <p className="text-xs lg:text-sm text-tertiary">Latest 10 orders from your store</p>
          </div>
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 lg:px-4 lg:py-2 bg-surface-1 border border-light rounded-full text-xs lg:text-sm text-secondary hover:bg-surface-2 hover:text-primary-600 transition-all hover:translate-x-0.5">
          <span>View All</span>
          <ChevronRight size={14} className="lg:w-4 lg:h-4" />
        </button>
      </div>

      {/* Desktop Table - Hidden on Mobile */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-light">
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Order ID</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Items</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Total</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Payment</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr 
                key={order.id}
                className={`border-b border-light/50 transition-colors ${hoveredRow === index ? 'bg-surface-1' : ''}`}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="py-3 px-4">
                  <span className={`text-sm font-medium transition-colors ${hoveredRow === index ? 'text-primary-600' : 'text-primary'}`}>
                    {order.id}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm font-medium text-primary">{order.customer}</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2 py-1 bg-surface-2 rounded-full text-xs text-secondary">
                    {order.items}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-primary">{order.amount}</td>
                <td className="py-3 px-4 text-xs text-tertiary">{order.date}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getPaymentClass(order.payment)}`}>
                    {order.payment}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-surface-2 rounded-lg transition-fast text-tertiary">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 hover:bg-surface-2 rounded-lg transition-fast text-tertiary">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet Cards - Hidden on Mobile & Desktop */}
<div className="hidden sm:grid lg:hidden grid-cols-2 gap-3">
  {orders.map((order, index) => (
    <div 
      key={order.id}
      className={`bg-surface-1 rounded-xl p-4 border border-light transition-all ${hoveredRow === index ? 'shadow-md' : ''}`}
      onMouseEnter={() => setHoveredRow(index)}
      onMouseLeave={() => setHoveredRow(null)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">{order.id}</span>
          <span className="text-xs text-tertiary">{order.date}</span>
        </div>
        <button className="p-1 hover:bg-surface-2 rounded-lg transition-fast">
          <MoreHorizontal size={16} className="text-tertiary" />
        </button>
      </div>
      
      <div className="mb-3">
        <p className="text-xs text-tertiary mb-0.5">Customer</p>
        <p className="text-sm font-medium text-primary">{order.customer}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-tertiary mb-0.5">Items</p>
          <p className="text-sm font-medium text-primary">{order.items}</p>
        </div>
        <div>
          <p className="text-xs text-tertiary mb-0.5">Total</p>
          <p className="text-sm font-semibold text-primary">{order.amount}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="capitalize">{order.status}</span>
          </span>
          <span className={`inline-block px-2 py-1 rounded-full text-xs ${getPaymentClass(order.payment)}`}>
            {order.payment}
          </span>
        </div>
        <button className="p-1.5 bg-white border border-light rounded-lg hover:bg-primary-50 transition-fast">
          <Eye size={14} className="text-tertiary" />
        </button>
      </div>
    </div>
  ))}
</div>

      {/* Mobile Cards - Hidden on Desktop */}
      <div className="sm:hidden space-y-3">
        {orders.map((order, index) => (
          <div 
            key={order.id}
            className={`bg-surface-1 rounded-xl p-4 border border-light transition-all ${hoveredRow === index ? 'shadow-md' : ''}`}
            onMouseEnter={() => setHoveredRow(index)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">{order.id}</span>
                <span className="text-xs text-tertiary">{order.date}</span>
              </div>
              <button className="p-1 hover:bg-surface-2 rounded-lg transition-fast">
                <MoreHorizontal size={16} className="text-tertiary" />
              </button>
            </div>
            
            <div className="mb-3">
              <p className="text-xs text-tertiary mb-0.5">Customer</p>
              <p className="text-sm font-medium text-primary">{order.customer}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-tertiary mb-0.5">Items</p>
                <p className="text-sm font-medium text-primary">{order.items}</p>
              </div>
              <div>
                <p className="text-xs text-tertiary mb-0.5">Total</p>
                <p className="text-sm font-semibold text-primary">{order.amount}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </span>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${getPaymentClass(order.payment)}`}>
                  {order.payment}
                </span>
              </div>
              <button className="p-1.5 bg-white border border-light rounded-lg hover:bg-primary-50 transition-fast">
                <Eye size={14} className="text-tertiary" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}