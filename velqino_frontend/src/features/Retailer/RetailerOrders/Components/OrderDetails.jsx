"use client"

import React, { useState, useEffect } from 'react'
import { User, MapPin, CreditCard, Package, Truck, Calendar, Phone, Mail, FileText, Download, Printer } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerOrders/OrderDetails.scss'

export default function OrderDetails({ selectedOrder }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!selectedOrder) {
    return (
      <div className="order-details bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">Select an order to view details</p>
          <p className="text-xs text-gray-400 mt-1">Click on any order from the table</p>
        </div>
      </div>
    )
  }

  // Mock order details - replace with actual data from API
  const orderDetails = {
    customer: {
      name: selectedOrder.customer || 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh@example.com',
      type: 'Regular'
    },
    items: [
      { name: 'Premium Cotton T-Shirt', sku: 'CT-001', quantity: 2, price: 499, total: 998 },
      { name: 'Leather Wallet', sku: 'LW-004', quantity: 1, price: 1499, total: 1499 }
    ],
    payment: {
      method: selectedOrder.payment || 'UPI',
      status: 'Paid',
      transactionId: 'TXN' + Math.floor(Math.random() * 1000000),
      date: selectedOrder.date || '2026-04-14'
    },
    delivery: {
      address: '123, MG Road, Bangalore - 560001',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      landmark: 'Near Metro Station'
    },
    summary: {
      subtotal: selectedOrder.total || 2450,
      shipping: 0,
      tax: 189,
      discount: 0,
      total: selectedOrder.total || 2450
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="order-details bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Order Details</h3>
          </div>
          <div className="flex gap-1">
            <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
              <Printer size={14} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
              <Download size={14} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Complete order information</p>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[500px]">
        {/* Order Header */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="text-sm font-bold text-gray-900">{selectedOrder.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Order Date</p>
              <p className="text-sm font-medium text-gray-700">{formatDate(selectedOrder.date)}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <User size={12} />
            Customer Information
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <User size={12} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-900">{orderDetails.customer.name}</span>
              <span className="text-xs text-gray-500">({orderDetails.customer.type})</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={12} className="text-gray-400" />
              <span className="text-sm text-gray-700">{orderDetails.customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={12} className="text-gray-400" />
              <span className="text-sm text-gray-700">{orderDetails.customer.email}</span>
            </div>
          </div>
        </div>

        {/* Items Purchased */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Package size={12} />
            Items Purchased ({orderDetails.items.length})
          </h4>
          <div className="space-y-2">
            {orderDetails.items.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{item.total}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <CreditCard size={12} />
            Payment Details
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Method</span>
              <span className="text-sm font-medium text-gray-900">{orderDetails.payment.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className="text-sm font-medium text-green-600">{orderDetails.payment.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Transaction ID</span>
              <span className="text-sm text-gray-700">{orderDetails.payment.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Payment Date</span>
              <span className="text-sm text-gray-700">{formatDate(orderDetails.payment.date)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <MapPin size={12} />
            Delivery Address
          </h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">{orderDetails.delivery.address}</p>
            <p className="text-sm text-gray-700 mt-1">
              {orderDetails.delivery.city}, {orderDetails.delivery.state} - {orderDetails.delivery.pincode}
            </p>
            {orderDetails.delivery.landmark && (
              <p className="text-xs text-gray-500 mt-1">Landmark: {orderDetails.delivery.landmark}</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Order Summary</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-sm text-gray-900">₹{orderDetails.summary.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Shipping</span>
              <span className="text-sm text-green-600">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tax (GST)</span>
              <span className="text-sm text-gray-900">₹{orderDetails.summary.tax.toLocaleString()}</span>
            </div>
            {orderDetails.summary.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Discount</span>
                <span className="text-sm text-red-600">-₹{orderDetails.summary.discount}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-base font-bold text-primary-600">₹{orderDetails.summary.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Timeline */}
        {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-blue-600" />
              <p className="text-xs font-medium text-blue-700">Estimated Delivery</p>
            </div>
            <p className="text-sm text-blue-800 mt-1">
              {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}