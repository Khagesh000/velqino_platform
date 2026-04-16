"use client"

import React, { useState, useEffect } from 'react'
import { User, Phone, Mail, MapPin, CreditCard, Clock, Package, Star, Eye, Edit, Save, X, Truck, Calendar, CheckCircle } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSuppliers/SupplierDetails.scss'

export default function SupplierDetails({ selectedSupplier }) {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedSupplier, setEditedSupplier] = useState(null)
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (selectedSupplier) {
      setEditedSupplier(selectedSupplier)
      setIsEditing(false)
    }
  }, [selectedSupplier])

  if (!mounted) return null

  if (!selectedSupplier) {
    return (
      <div className="supplier-details bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <Truck size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">Select a supplier to view details</p>
          <p className="text-xs text-gray-400 mt-1">Click on any supplier from the list</p>
        </div>
      </div>
    )
  }

  // Mock order history
  const orderHistory = [
    { id: 'PO-001', date: '2026-04-10', amount: 45000, status: 'delivered', items: 3 },
    { id: 'PO-002', date: '2026-04-05', amount: 28000, status: 'delivered', items: 2 },
    { id: 'PO-003', date: '2026-03-28', amount: 62000, status: 'delivered', items: 4 },
    { id: 'PO-004', date: '2026-03-20', amount: 35000, status: 'delivered', items: 2 },
  ]

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getStatusBadge = (status) => {
    if (status === 'delivered') {
      return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={10} />, label: 'Delivered' }
    }
    return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={10} />, label: 'Pending' }
  }

  const totalSpent = orderHistory.reduce((sum, order) => sum + order.amount, 0)

  return (
    <div className="supplier-details bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Supplier Details</h3>
          </div>
          {isEditing ? (
            <div className="flex gap-1">
              <button onClick={() => setIsEditing(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                <X size={14} />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1 text-green-500 hover:bg-green-50 rounded-lg">
                <Save size={14} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
              <Edit size={14} />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Complete supplier information</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'info' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Information
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'orders' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Order History
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'products' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Products
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[400px] overflow-y-auto custom-scroll">
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{selectedSupplier.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">{selectedSupplier.name}</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} size={12} className={star <= selectedSupplier.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({selectedSupplier.totalOrders} orders)</span>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-gray-700">{selectedSupplier.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-gray-700">{selectedSupplier.email}</span>
                </div>
              </div>
            </div>

            {/* Business Terms */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Business Terms</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lead Time</span>
                  <span className="font-medium text-gray-900">{selectedSupplier.leadTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Minimum Order</span>
                  <span className="font-medium text-gray-900">{selectedSupplier.minOrder}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Terms</span>
                  <span className="font-medium text-gray-900">{selectedSupplier.paymentTerms}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">On-Time Delivery</span>
                  <span className="font-medium text-green-600">{selectedSupplier.onTime}</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Performance</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{selectedSupplier.onTime}</p>
                  <p className="text-[10px] text-gray-500">On-Time Delivery</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-2 mb-2 text-center">
              <p className="text-xs text-blue-700">Total Orders: {orderHistory.length} | Total Spent: ₹{totalSpent.toLocaleString()}</p>
            </div>
            {orderHistory.map((order) => {
              const status = getStatusBadge(order.status)
              return (
                <div key={order.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                      {status.icon}
                      {status.label}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{order.items} items</span>
                    <span className="font-bold text-gray-900">₹{order.amount.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-2">
            {selectedSupplier.products.map((product, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{product}</span>
                </div>
                <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                  <Eye size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}