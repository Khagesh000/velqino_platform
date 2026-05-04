"use client"

import React, { useState, useEffect } from 'react'
import { Package, Truck, Clock, AlertCircle, ShoppingCart, Eye, RefreshCw, ChevronRight, TrendingUp, CheckCircle } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerInventory/ReorderList.scss'

export default function ReorderList({ onReorder }) {
  const [mounted, setMounted] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [hoveredItem, setHoveredItem] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const reorderItems = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', currentStock: 8, reorderLevel: 20, requiredQty: 12, supplier: 'Fashion Hub', supplierContact: '+91 98765 43210', leadTime: '3-5 days', price: 499, status: 'critical', image: '👕' },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', currentStock: 12, reorderLevel: 25, requiredQty: 13, supplier: 'ElectroMart', supplierContact: '+91 87654 32109', leadTime: '5-7 days', price: 2499, status: 'warning', image: '🎧' },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', currentStock: 5, reorderLevel: 15, requiredQty: 10, supplier: 'TechGadgets', supplierContact: '+91 76543 21098', leadTime: '7-10 days', price: 4999, status: 'critical', image: '⌚' },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', currentStock: 15, reorderLevel: 20, requiredQty: 5, supplier: 'LeatherCraft', supplierContact: '+91 65432 10987', leadTime: '3-5 days', price: 1499, status: 'warning', image: '👛' },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', currentStock: 3, reorderLevel: 12, requiredQty: 9, supplier: 'SportFit', supplierContact: '+91 54321 09876', leadTime: '4-6 days', price: 2999, status: 'critical', image: '👟' },
  ]

  const filteredItems = filter === 'all' ? reorderItems : reorderItems.filter(item => item.status === filter)

  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(i => i.id))
    }
  }

  const handleReorder = () => {
    const itemsToReorder = reorderItems.filter(item => selectedItems.includes(item.id))
    console.log('Reordering:', itemsToReorder)
    alert(`Reorder placed for ${selectedItems.length} items`)
    if (onReorder) onReorder()
    setSelectedItems([])
  }

  const getStatusBadge = (status) => {
    if (status === 'critical') {
      return { bg: 'bg-red-500', text: 'text-white', label: 'CRITICAL', icon: <AlertCircle size={10} /> }
    }
    return { bg: 'bg-orange-500', text: 'text-white', label: 'WARNING', icon: <Clock size={10} /> }
  }

  const totalReorderCost = reorderItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.requiredQty * item.price), 0)

  const getStockPercentage = (current, reorder) => {
    return Math.min((current / reorder) * 100, 100)
  }

  return (
    <div className="reorder-list bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Reorder List</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {reorderItems.length} items
            </span>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
            <RefreshCw size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Products needing reorder with supplier details</p>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 pt-3 flex gap-2 border-b border-gray-100">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          All ({reorderItems.length})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filter === 'critical' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600'}`}
        >
          Critical ({reorderItems.filter(i => i.status === 'critical').length})
        </button>
        <button
          onClick={() => setFilter('warning')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filter === 'warning' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600'}`}
        >
          Warning ({reorderItems.filter(i => i.status === 'warning').length})
        </button>
      </div>

      {/* Selection Bar */}
      {selectedItems.length > 0 && (
        <div className="mx-4 mt-3 p-2 bg-primary-50 rounded-lg flex items-center justify-between animate-fadeIn">
          <span className="text-xs text-primary-700">
            <span className="font-semibold">{selectedItems.length}</span> items selected
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary-600">Total: ₹{totalReorderCost.toLocaleString()}</span>
            <button
              onClick={handleReorder}
              className="px-2 py-1 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
            >
              Reorder Selected
            </button>
          </div>
        </div>
      )}

      {/* Reorder List */}
      <div className="p-4 max-h-[380px] overflow-y-auto custom-scroll">
        <div className="space-y-3">
          {/* Select All */}
          {filteredItems.length > 0 && (
            <label className="flex items-center gap-2 px-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                onChange={toggleSelectAll}
                className="rounded border-gray-300 text-primary-600"
              />
              <span className="text-xs text-gray-600">Select All</span>
            </label>
          )}

          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={32} className="mx-auto text-green-300 mb-2" />
              <p className="text-sm text-gray-500">No items need reorder</p>
              <p className="text-xs text-gray-400 mt-1">All stock levels are healthy</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const stockPercent = getStockPercentage(item.currentStock, item.reorderLevel)
              const statusBadge = getStatusBadge(item.status)
              return (
                <div
                  key={item.id}
                  className={`reorder-item border rounded-lg p-3 transition-all ${selectedItems.includes(item.id) ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:shadow-md'}`}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="mt-1 rounded border-gray-300 text-primary-600"
                    />

                    {/* Product Image */}
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                      {item.image}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.icon}
                          {statusBadge.label}
                        </div>
                      </div>

                      {/* Stock Progress */}
                      <div className="mt-2">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                          <span>Stock: {item.currentStock} / {item.reorderLevel}</span>
                          <span>Need: {item.requiredQty} units</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${item.status === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}
                            style={{ width: `${stockPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Supplier Details */}
                      <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-gray-500">
                        <div className="flex items-center gap-1">
                          <Truck size={10} />
                          <span>{item.supplier}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={10} />
                          <span>Lead: {item.leadTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp size={10} />
                          <span>₹{item.price}/unit</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
                      <Eye size={14} />
                    </button>
                  </div>

                  {/* Quick Reorder Button */}
                  <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedItems([...selectedItems, item.id])
                        handleReorder()
                      }}
                      className="px-3 py-1 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1"
                    >
                      <ShoppingCart size={10} />
                      Quick Reorder
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <Truck size={10} />
            <span>Estimated cost: ₹{reorderItems.reduce((sum, i) => sum + (i.requiredQty * i.price), 0).toLocaleString()}</span>
          </div>
          <button className="text-primary-600">View All Suppliers</button>
        </div>
      </div>
    </div>
  )
}