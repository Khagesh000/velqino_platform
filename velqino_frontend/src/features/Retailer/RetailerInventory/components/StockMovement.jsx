"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Package, Truck, RefreshCw, AlertTriangle, CheckCircle, Clock, Search, Filter, ChevronLeft, ChevronRight } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerInventory/StockMovement.scss'

export default function StockMovement() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const itemsPerPage = 6

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const movements = [
    { id: 1, type: 'inward', product: 'Premium Cotton T-Shirt', quantity: 100, date: '2026-04-14', reference: 'PO-001', status: 'completed', supplier: 'Fashion Hub' },
    { id: 2, type: 'outward', product: 'Wireless Headphones', quantity: 25, date: '2026-04-14', reference: 'SO-045', status: 'completed', customer: 'Rajesh Kumar' },
    { id: 3, type: 'damaged', product: 'Smart Watch Pro', quantity: 2, date: '2026-04-13', reference: 'DMG-003', status: 'pending', note: 'Screen damaged' },
    { id: 4, type: 'returned', product: 'Leather Wallet', quantity: 1, date: '2026-04-13', reference: 'RET-002', status: 'completed', customer: 'Priya Sharma' },
    { id: 5, type: 'inward', product: 'Running Shoes', quantity: 50, date: '2026-04-12', reference: 'PO-002', status: 'pending', supplier: 'SportFit' },
    { id: 6, type: 'outward', product: 'Coffee Mug', quantity: 30, date: '2026-04-12', reference: 'SO-046', status: 'completed', customer: 'Amit Singh' },
    { id: 7, type: 'damaged', product: 'Leather Wallet', quantity: 1, date: '2026-04-11', reference: 'DMG-004', status: 'completed', note: 'Scratched' },
    { id: 8, type: 'returned', product: 'Wireless Headphones', quantity: 1, date: '2026-04-11', reference: 'RET-003', status: 'pending', customer: 'Sneha Reddy' },
  ]

  const getTypeConfig = (type) => {
    switch(type) {
      case 'inward':
        return { label: 'Inward', icon: <Truck size={14} />, bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
      case 'outward':
        return { label: 'Outward', icon: <Package size={14} />, bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' }
      case 'damaged':
        return { label: 'Damaged', icon: <AlertTriangle size={14} />, bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
      case 'returned':
        return { label: 'Returned', icon: <RefreshCw size={14} />, bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' }
      default:
        return { label: 'Unknown', icon: <Package size={14} />, bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

  const getStatusConfig = (status) => {
    switch(status) {
      case 'completed':
        return { label: 'Completed', icon: <CheckCircle size={10} />, bg: 'bg-green-100', text: 'text-green-700' }
      case 'pending':
        return { label: 'Pending', icon: <Clock size={10} />, bg: 'bg-yellow-100', text: 'text-yellow-700' }
      default:
        return { label: status, icon: null, bg: 'bg-gray-100', text: 'text-gray-700' }
    }
  }

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = searchQuery === '' || 
      movement.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.reference.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = activeTab === 'all' || movement.type === activeTab
    return matchesSearch && matchesType
  })

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage)
  const paginatedMovements = filteredMovements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const summary = {
    inward: movements.filter(m => m.type === 'inward').reduce((sum, m) => sum + m.quantity, 0),
    outward: movements.filter(m => m.type === 'outward').reduce((sum, m) => sum + m.quantity, 0),
    damaged: movements.filter(m => m.type === 'damaged').reduce((sum, m) => sum + m.quantity, 0),
    returned: movements.filter(m => m.type === 'returned').reduce((sum, m) => sum + m.quantity, 0),
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const tabCounts = {
    all: movements.length,
    inward: movements.filter(m => m.type === 'inward').length,
    outward: movements.filter(m => m.type === 'outward').length,
    damaged: movements.filter(m => m.type === 'damaged').length,
    returned: movements.filter(m => m.type === 'returned').length,
  }

  return (
    <div className="stock-movement bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Stock Movement</h3>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Summary Chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-lg">
            <Truck size={12} className="text-green-600" />
            <span className="text-xs font-medium text-green-700">In: {summary.inward}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-lg">
            <Package size={12} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Out: {summary.outward}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 rounded-lg">
            <AlertTriangle size={12} className="text-red-600" />
            <span className="text-xs font-medium text-red-700">Damaged: {summary.damaged}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-lg">
            <RefreshCw size={12} className="text-orange-600" />
            <span className="text-xs font-medium text-orange-700">Returned: {summary.returned}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-100">
        {['all', 'inward', 'outward', 'damaged', 'returned'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setCurrentPage(1)
            }}
            className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab 
                ? 'text-primary-600 border-b-2 border-primary-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tabCounts[tab]})
          </button>
        ))}
      </div>

      {/* Movements Table */}
      <div className="p-4 max-h-[350px] overflow-y-auto custom-scroll">
        <div className="space-y-2">
          {paginatedMovements.length === 0 ? (
            <div className="text-center py-8">
              <Package size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No stock movements found</p>
            </div>
          ) : (
            paginatedMovements.map((movement, idx) => {
              const typeConfig = getTypeConfig(movement.type)
              const statusConfig = getStatusConfig(movement.status)
              return (
                <div
                  key={movement.id}
                  className={`movement-item border rounded-lg p-3 transition-all ${
                    hoveredRow === movement.id ? 'shadow-md transform -translate-y-0.5' : ''
                  } ${typeConfig.border}`}
                  onMouseEnter={() => setHoveredRow(movement.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeConfig.bg}`}>
                        {typeConfig.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{movement.product}</p>
                        <p className="text-xs text-gray-500">Ref: {movement.reference}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        movement.type === 'inward' ? 'text-green-600' : 
                        movement.type === 'outward' ? 'text-blue-600' : 
                        movement.type === 'damaged' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {movement.type === 'inward' ? '+' : '-'}{movement.quantity} units
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{formatDate(movement.date)}</span>
                    {movement.supplier && <span>• Supplier: {movement.supplier}</span>}
                    {movement.customer && <span>• Customer: {movement.customer}</span>}
                    {movement.note && <span className="text-red-500">• {movement.note}</span>}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {filteredMovements.length} movements
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