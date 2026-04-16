"use client"

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, AlertCircle, Bell, Settings, Eye, ShoppingCart, CheckCircle, Filter, ChevronLeft, ChevronRight } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerInventory/ExpiryTracking.scss'

export default function ExpiryTracking() {
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState('all')
  const [alertDays, setAlertDays] = useState(30)
  const [showSettings, setShowSettings] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const expiringProducts = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', batch: 'BATCH-001', expiryDate: '2026-05-15', daysLeft: 30, quantity: 45, location: 'A-12', status: 'warning', image: '👕' },
    { id: 2, name: 'Leather Wallet', sku: 'LW-004', batch: 'BATCH-002', expiryDate: '2026-05-20', daysLeft: 35, quantity: 23, location: 'D-03', status: 'warning', image: '👛' },
    { id: 3, name: 'Coffee Mug', sku: 'CM-006', batch: 'BATCH-003', expiryDate: '2026-04-25', daysLeft: 10, quantity: 15, location: 'F-02', status: 'critical', image: '☕' },
    { id: 4, name: 'Running Shoes', sku: 'RS-005', batch: 'BATCH-004', expiryDate: '2026-05-05', daysLeft: 20, quantity: 8, location: 'E-07', status: 'critical', image: '👟' },
    { id: 5, name: 'Wireless Headphones', sku: 'WH-002', batch: 'BATCH-005', expiryDate: '2026-06-01', daysLeft: 47, quantity: 12, location: 'B-05', status: 'healthy', image: '🎧' },
  ]

  const filteredProducts = expiringProducts.filter(product => {
    if (filter === 'all') return true
    if (filter === 'critical') return product.daysLeft <= 30
    if (filter === 'warning') return product.daysLeft > 30 && product.daysLeft <= 60
    if (filter === 'healthy') return product.daysLeft > 60
    return true
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusConfig = (daysLeft) => {
    if (daysLeft <= 15) return { label: 'Critical', color: 'red', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: <AlertCircle size={12} /> }
    if (daysLeft <= 30) return { label: 'Expiring Soon', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: <Clock size={12} /> }
    if (daysLeft <= 60) return { label: 'Warning', color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: <AlertCircle size={12} /> }
    return { label: 'Healthy', color: 'green', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: <CheckCircle size={12} /> }
  }

  const getDaysClass = (daysLeft) => {
    if (daysLeft <= 15) return 'text-red-600 font-bold'
    if (daysLeft <= 30) return 'text-orange-600 font-semibold'
    if (daysLeft <= 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const criticalCount = expiringProducts.filter(p => p.daysLeft <= 30).length
  const warningCount = expiringProducts.filter(p => p.daysLeft > 30 && p.daysLeft <= 60).length
  const healthyCount = expiringProducts.filter(p => p.daysLeft > 60).length

  return (
    <div className="expiry-tracking bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Expiry Tracking</h3>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
          >
            <Settings size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Products expiring soon</p>
      </div>

      {/* Alert Settings Panel */}
      {showSettings && (
        <div className="mx-4 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Alert Settings</span>
            <Bell size={12} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600">Notify before</span>
            <select
              value={alertDays}
              onChange={(e) => setAlertDays(parseInt(e.target.value))}
              className="px-2 py-1 text-xs border border-gray-200 rounded-lg"
            >
              <option value={15}>15 days</option>
              <option value={30}>30 days</option>
              <option value={45}>45 days</option>
              <option value={60}>60 days</option>
            </select>
            <span className="text-xs text-gray-600">of expiry</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="emailAlert" defaultChecked className="rounded" />
              <label htmlFor="emailAlert" className="text-xs text-gray-600">Email notifications</label>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-3 gap-2 border-b border-gray-100">
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <p className="text-lg font-bold text-red-700">{criticalCount}</p>
          <p className="text-[10px] text-red-600">Critical</p>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded-lg">
          <p className="text-lg font-bold text-orange-700">{warningCount}</p>
          <p className="text-[10px] text-orange-600">Expiring Soon</p>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <p className="text-lg font-bold text-green-700">{healthyCount}</p>
          <p className="text-[10px] text-green-600">Healthy</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${filter === 'all' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          All ({expiringProducts.length})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${filter === 'critical' ? 'text-red-600 border-b-2 border-red-500' : 'text-gray-500'}`}
        >
          Critical ({criticalCount})
        </button>
        <button
          onClick={() => setFilter('warning')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${filter === 'warning' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-gray-500'}`}
        >
          Warning ({warningCount})
        </button>
      </div>

      {/* Expiry List */}
      <div className="p-4 max-h-[280px] overflow-y-auto custom-scroll">
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle size={32} className="mx-auto text-green-300 mb-2" />
            <p className="text-sm text-gray-500">No expiring products</p>
            <p className="text-xs text-gray-400 mt-1">All products are within healthy range</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedProducts.map((product, index) => {
              const status = getStatusConfig(product.daysLeft)
              return (
                <div
                  key={product.id}
                  className={`border rounded-lg p-3 transition-all ${status.border} ${status.bg}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                      {product.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-xs text-gray-500">SKU: {product.sku} | Batch: {product.batch}</p>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                          {status.icon}
                          {status.label}
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Expiry Date</p>
                          <p className={`font-medium ${getDaysClass(product.daysLeft)}`}>
                            {formatDate(product.expiryDate)} ({product.daysLeft} days)
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Quantity/Location</p>
                          <p className="font-medium text-gray-700">{product.quantity} units • {product.location}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              product.daysLeft <= 15 ? 'bg-red-500' : 
                              product.daysLeft <= 30 ? 'bg-orange-500' : 
                              product.daysLeft <= 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((product.daysLeft / 90) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 py-1.5 text-xs font-medium bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-1">
                      <Eye size={12} />
                      View Details
                    </button>
                    <button className="flex-1 py-1.5 text-xs font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-1">
                      <ShoppingCart size={12} />
                      Quick Action
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {filteredProducts.length} products
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
    </div>
  )
}