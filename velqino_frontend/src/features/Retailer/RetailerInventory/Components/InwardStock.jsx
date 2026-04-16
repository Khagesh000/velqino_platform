"use client"

import React, { useState, useEffect } from 'react'
import { Package, Truck, Plus, Minus, Save, X, Search, Calendar, Hash, FileText, CheckCircle, RefreshCw, AlertCircle, Upload } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerInventory/InwardStock.scss'

export default function InwardStock({ onComplete }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('add')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [formData, setFormData] = useState({
    supplier: '',
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    receivedDate: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const products = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', currentStock: 45, unit: 'piece', price: 499, image: '👕' },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', currentStock: 12, unit: 'piece', price: 2499, image: '🎧' },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', currentStock: 8, unit: 'piece', price: 4999, image: '⌚' },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', currentStock: 23, unit: 'piece', price: 1499, image: '👛' },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', currentStock: 15, unit: 'piece', price: 2999, image: '👟' },
  ]

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addProductToStock = (product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, {
        ...product,
        inwardQuantity: 1,
        batchNo: '',
        expiryDate: '',
        unitPrice: product.price
      }])
    }
  }

  const updateProductQuantity = (id, quantity) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.id === id ? { ...p, inwardQuantity: Math.max(1, parseInt(quantity) || 1) } : p
    ))
  }

  const updateBatchNo = (id, batchNo) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.id === id ? { ...p, batchNo } : p
    ))
  }

  const updateExpiryDate = (id, expiryDate) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.id === id ? { ...p, expiryDate } : p
    ))
  }

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== id))
  }

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      alert('Please add at least one product')
      return
    }
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedProducts([])
      setFormData({
        supplier: '',
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        receivedDate: new Date().toISOString().split('T')[0],
        notes: ''
      })
      if (onComplete) onComplete()
    }, 2000)
  }

  const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.inwardQuantity, 0)
  const totalValue = selectedProducts.reduce((sum, p) => sum + (p.inwardQuantity * p.unitPrice), 0)

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  if (showSuccess) {
    return (
      <div className="inward-stock bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Stock Added Successfully!</h3>
          <p className="text-sm text-gray-500">{totalQuantity} units added to inventory</p>
          <p className="text-xs text-gray-400 mt-2">Total value: ₹{totalValue.toLocaleString()}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="inward-stock bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-primary-500" />
          <h3 className="text-base font-semibold text-gray-900">Inward Stock</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">Add new stock, update quantities, batch numbers</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'add' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Add Stock
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'history' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Recent Receipts
        </button>
      </div>

      <div className="p-4 max-h-[450px] overflow-y-auto custom-scroll">
        {activeTab === 'add' && (
          <div className="space-y-4">
            {/* Supplier Details */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Truck size={12} />
                Receipt Details
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={formData.supplier}
                  onChange={(e) => handleFormChange('supplier', e.target.value)}
                  className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
                <input
                  type="text"
                  placeholder="Invoice / PO Number"
                  value={formData.invoiceNo}
                  onChange={(e) => handleFormChange('invoiceNo', e.target.value)}
                  className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
                <div className="relative">
                  <Calendar size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => handleFormChange('invoiceDate', e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div className="relative">
                  <Calendar size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={formData.receivedDate}
                    onChange={(e) => handleFormChange('receivedDate', e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Product Search */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Add Products</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
              {searchQuery && filteredProducts.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => addProductToStock(product)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0 text-left"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                        {product.image}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                      <Plus size={14} className="text-primary-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-700">Products to Receive ({selectedProducts.length})</h4>
                  <button
                    onClick={() => setSelectedProducts([])}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedProducts.map(product => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                          {product.image}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                        </div>
                        <button onClick={() => removeProduct(product.id)} className="p-1 text-gray-400 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <p className="text-[10px] text-gray-500">Quantity</p>
                          <input
                            type="number"
                            value={product.inwardQuantity}
                            onChange={(e) => updateProductQuantity(product.id, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500">Batch No.</p>
                          <input
                            type="text"
                            placeholder="Batch"
                            value={product.batchNo}
                            onChange={(e) => updateBatchNo(product.id, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500">Expiry Date</p>
                          <input
                            type="date"
                            value={product.expiryDate}
                            onChange={(e) => updateExpiryDate(product.id, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500">Unit Price</p>
                          <input
                            type="number"
                            value={product.unitPrice}
                            onChange={(e) => updateProductQuantity(product.id, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {selectedProducts.length > 0 && (
              <div className="bg-primary-50 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Total Quantity</span>
                  <span className="font-semibold text-gray-900">{totalQuantity} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-bold text-primary-600">₹{totalValue.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <textarea
                placeholder="Additional notes (optional)"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            {selectedProducts.length > 0 && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Receive Stock
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">Receipt #IN-001</span>
                </div>
                <span className="text-xs text-gray-500">15 Apr 2026</span>
              </div>
              <div className="text-xs text-gray-600 mb-2">Supplier: Fashion Hub | Invoice: INV-001</div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>3 products</span>
                <span>•</span>
                <span>45 units</span>
                <span>•</span>
                <span>₹22,500</span>
              </div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">Receipt #IN-002</span>
                </div>
                <span className="text-xs text-gray-500">10 Apr 2026</span>
              </div>
              <div className="text-xs text-gray-600 mb-2">Supplier: ElectroMart | Invoice: INV-002</div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>2 products</span>
                <span>•</span>
                <span>25 units</span>
                <span>•</span>
                <span>₹62,475</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <Upload size={10} />
            <span>Upload Receipt</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle size={10} />
            <span>Verify batch numbers before receiving</span>
          </div>
        </div>
      </div>
    </div>
  )
}