"use client"

import React, { useState, useEffect } from 'react'
import { Package, TrendingUp, Truck, MapPin, AlertCircle, DollarSign, Percent, RefreshCw, Edit, Save, X } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerProducts/ProductDetails.scss'

export default function ProductDetails({ selectedProduct, onUpdate }) {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProduct, setEditedProduct] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (selectedProduct) {
      setEditedProduct(selectedProduct)
      setIsEditing(false)
    }
  }, [selectedProduct])

  if (!mounted) return null

  if (!selectedProduct) {
    return (
      <div className="product-details bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <Package size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">Select a product to view details</p>
          <p className="text-xs text-gray-400 mt-1">Click on any product from the grid</p>
        </div>
      </div>
    )
  }

  const margin = ((selectedProduct.price - selectedProduct.cost) / selectedProduct.price) * 100
  const reorderNeeded = selectedProduct.reorderLevel - selectedProduct.stock
  const isLowStock = selectedProduct.stock <= selectedProduct.threshold

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    if (onUpdate) onUpdate(editedProduct)
    setIsSaving(false)
    setIsEditing(false)
  }

  const InfoRow = ({ label, value, icon, highlight }) => (
    <div className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-0 ${highlight ? 'bg-red-50 -mx-2 px-2 rounded-lg' : ''}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      {isEditing && (label === 'Price' || label === 'Cost' || label === 'Reorder Level' || label === 'Location') ? (
        <input
          type="number"
          value={editedProduct?.[label.toLowerCase().replace(' ', '')]}
          onChange={(e) => setEditedProduct({ ...editedProduct, [label.toLowerCase().replace(' ', '')]: parseFloat(e.target.value) })}
          className="w-24 px-2 py-1 text-sm border border-gray-200 rounded-lg text-right focus:outline-none focus:border-primary-500"
        />
      ) : (
        <span className={`text-sm font-medium ${highlight ? 'text-red-600' : 'text-gray-900'}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      )}
    </div>
  )

  return (
    <div className="product-details bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Product Details</h3>
          </div>
          <div className="flex gap-1">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all"
                >
                  <X size={14} />
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                >
                  {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                <Edit size={14} />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Complete product information</p>
      </div>

      {/* Product Basic Info */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm">
            {selectedProduct.image}
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-gray-900">{selectedProduct.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">SKU: {selectedProduct.sku}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-500">Barcode: {selectedProduct.barcode?.slice(-8)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="p-4 border-b border-gray-100">
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <DollarSign size={12} />
          Pricing
        </h5>
        <div className="space-y-1">
          <InfoRow label="Price" value={`₹${selectedProduct.price}`} icon={<DollarSign size={12} className="text-gray-400" />} />
          <InfoRow label="Cost" value={`₹${selectedProduct.cost}`} icon={<DollarSign size={12} className="text-gray-400" />} />
          <InfoRow 
            label="Margin" 
            value={`${margin.toFixed(1)}%`} 
            icon={<Percent size={12} className="text-gray-400" />}
            highlight={margin < 25}
          />
        </div>
      </div>

      {/* Inventory Section */}
      <div className="p-4 border-b border-gray-100">
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Package size={12} />
          Inventory
        </h5>
        <div className="space-y-1">
          <InfoRow 
            label="Current Stock" 
            value={`${selectedProduct.stock} units`} 
            icon={<Package size={12} className="text-gray-400" />}
            highlight={isLowStock}
          />
          <InfoRow label="Reorder Level" value={`${selectedProduct.reorderLevel} units`} icon={<AlertCircle size={12} className="text-gray-400" />} />
          <InfoRow label="Threshold" value={`${selectedProduct.threshold} units`} icon={<AlertCircle size={12} className="text-gray-400" />} />
          
          {reorderNeeded > 0 && (
            <div className="mt-2 p-2 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-orange-700">
                <AlertCircle size={12} />
                <span>Reorder recommended: {reorderNeeded} units</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supplier & Location */}
      <div className="p-4 border-b border-gray-100">
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Truck size={12} />
          Supplier & Location
        </h5>
        <div className="space-y-1">
          <InfoRow label="Supplier" value={selectedProduct.supplier || 'Not specified'} icon={<Truck size={12} className="text-gray-400" />} />
          <InfoRow label="Location" value={selectedProduct.location || 'Not specified'} icon={<MapPin size={12} className="text-gray-400" />} />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="p-4">
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp size={12} />
          Performance
        </h5>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-500">Monthly Sales</p>
            <p className="text-sm font-bold text-gray-900">145 units</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-500">Turnover Rate</p>
            <p className="text-sm font-bold text-gray-900">2.8x/month</p>
          </div>
        </div>
      </div>
    </div>
  )
}