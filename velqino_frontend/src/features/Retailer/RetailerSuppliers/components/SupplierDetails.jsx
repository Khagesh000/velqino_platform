"use client"

import React, { useState, useEffect } from 'react'
import { 
  User, Phone, Mail, MapPin, CreditCard, Clock, Package, Star, 
  Eye, Edit, Save, X, Truck, Calendar, CheckCircle, ShieldCheck, 
  ArrowUpRight, Building, Award, RefreshCw
} from '../../../../utils/icons'

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
      setEditedSupplier({ ...selectedSupplier })
      setIsEditing(false)
    }
  }, [selectedSupplier])

  if (!mounted) {
    return <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse" />
  }

  if (!selectedSupplier) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-8 text-center flex flex-col items-center justify-center h-full min-h-[420px]">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
          <Truck size={32} />
        </div>
        <h4 className="text-base font-bold text-gray-800">No Supplier Selected</h4>
        <p className="text-xs text-gray-400 max-w-xs mt-1.5 leading-relaxed">
          Select any vendor from the suppliers directory to view their complete dossier, order history, and business terms.
        </p>
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
      return { 
        bg: 'bg-emerald-50 border border-emerald-200', 
        text: 'text-emerald-700', 
        icon: <CheckCircle size={11} />, 
        label: 'Delivered' 
      }
    }
    return { 
      bg: 'bg-amber-50 border border-amber-200', 
      text: 'text-amber-700', 
      icon: <Clock size={11} />, 
      label: 'Pending' 
    }
  }

  const totalSpent = orderHistory.reduce((sum, order) => sum + order.amount, 0)

  const handleSaveEdit = () => {
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden flex flex-col h-full">
      {/* Dossier Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/40">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-xl flex items-center justify-center shadow-sm shadow-primary-500/20 ring-4 ring-primary-100">
              {editedSupplier?.name ? editedSupplier.name.charAt(0) : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 tracking-tight leading-tight">
                  {editedSupplier?.name}
                </h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={10} />
                  Verified
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {editedSupplier?.category || 'Wholesale Supplier'} • {editedSupplier?.location || 'India'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-all"
                  title="Save"
                >
                  <Save size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-all"
                title="Edit Dossier"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Contact Bar */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <a
            href={`tel:${editedSupplier?.contact}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          >
            <Phone size={12} className="text-primary-600" />
            <span>Call Partner</span>
          </a>
          <a
            href={`mailto:${editedSupplier?.email}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          >
            <Mail size={12} className="text-primary-600" />
            <span>Send Email</span>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50/50 p-1">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'info'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Dossier
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'orders'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Orders ({orderHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'products'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Catalog ({editedSupplier?.products?.length || 0})
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Lifetime Spend</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">₹{totalSpent.toLocaleString()}</p>
                <span className="text-[10px] text-emerald-600 font-medium">4 Orders Fulfill</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">On-Time Rate</p>
                <p className="text-base font-bold text-emerald-600 mt-0.5">{editedSupplier?.onTime}</p>
                <div className="flex items-center justify-center gap-0.5 mt-0.5">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] text-gray-500 font-medium">{editedSupplier?.rating} / 5.0</span>
                </div>
              </div>
            </div>

            {/* Commercial Terms */}
            <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider text-[10px]">Commercial Terms</span>
                <span className="text-[10px] text-primary-600 font-semibold bg-primary-50 px-2 py-0.5 rounded">Standard Contract</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Lead Time Window</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSupplier.leadTime}
                    onChange={(e) => setEditedSupplier({ ...editedSupplier, leadTime: e.target.value })}
                    className="w-28 px-2 py-1 text-xs border rounded focus:border-primary-500"
                  />
                ) : (
                  <span className="font-semibold text-gray-900">{editedSupplier?.leadTime}</span>
                )}
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Minimum Order Value</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSupplier.minOrder}
                    onChange={(e) => setEditedSupplier({ ...editedSupplier, minOrder: e.target.value })}
                    className="w-28 px-2 py-1 text-xs border rounded focus:border-primary-500"
                  />
                ) : (
                  <span className="font-semibold text-gray-900">{editedSupplier?.minOrder}</span>
                )}
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Payment Terms</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSupplier.paymentTerms}
                    onChange={(e) => setEditedSupplier({ ...editedSupplier, paymentTerms: e.target.value })}
                    className="w-28 px-2 py-1 text-xs border rounded focus:border-primary-500"
                  />
                ) : (
                  <span className="font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded text-[11px]">
                    {editedSupplier?.paymentTerms}
                  </span>
                )}
              </div>
            </div>

            {/* Direct Contacts */}
            <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-2 text-xs">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider text-[10px] block mb-1">
                Communication Coordinates
              </span>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={13} className="text-gray-400" />
                <span>{editedSupplier?.contact}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={13} className="text-gray-400" />
                <span className="truncate">{editedSupplier?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={13} className="text-gray-400" />
                <span>{editedSupplier?.location || 'Central Logistics Hub, India'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-between text-xs">
              <span className="text-primary-800 font-medium">Delivered Volume</span>
              <span className="font-bold text-primary-900">₹{totalSpent.toLocaleString()}</span>
            </div>

            {orderHistory.map((order) => {
              const status = getStatusBadge(order.status)
              return (
                <div key={order.id} className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all bg-white hover:shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-900">{order.id}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.bg} ${status.text}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(order.date)} • {order.items} items</span>
                    <span className="font-bold text-gray-900">₹{order.amount.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-2">
            {editedSupplier?.products?.map((product, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-primary-600 shadow-xs">
                    <Package size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{product}</p>
                    <p className="text-[10px] text-gray-400">Regular Wholesale Stock</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
                  Contract Item
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
