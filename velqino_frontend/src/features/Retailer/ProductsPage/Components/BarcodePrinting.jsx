"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Printer, Scan, Plus, Minus, Trash2, Download, RefreshCw, CheckCircle, AlertCircle, Package, Settings } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerProducts/BarcodePrinting.scss'

export default function BarcodePrinting() {
  const [mounted, setMounted] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [printQuantity, setPrintQuantity] = useState(1)
  const [labelSize, setLabelSize] = useState('medium')
  const [isPrinting, setIsPrinting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const printRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const products = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', price: 499, image: '👕', barcode: '890123456789' },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', price: 2499, image: '🎧', barcode: '890123456788' },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', price: 4999, image: '⌚', barcode: '890123456787' },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', price: 1499, image: '👛', barcode: '890123456786' },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', price: 2999, image: '👟', barcode: '890123456785' },
  ]

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleProductSelection = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id))
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId))
    } else {
      setSelectedProducts(selectedProducts.map(p =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      ))
    }
  }

  const removeFromSelection = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId))
  }

  const handlePrint = async () => {
    if (selectedProducts.length === 0) return
    
    setIsPrinting(true)
    // Simulate print generation
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsPrinting(false)
    setShowSuccess(true)
    
    // Trigger browser print
    setTimeout(() => {
      window.print()
    }, 500)
    
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  const totalLabels = selectedProducts.reduce((sum, p) => sum + p.quantity, 0)

  const getLabelSizeClass = () => {
    switch(labelSize) {
      case 'small': return 'w-24 h-16 text-[8px]'
      case 'medium': return 'w-32 h-20 text-[10px]'
      case 'large': return 'w-40 h-24 text-xs'
      default: return 'w-32 h-20 text-[10px]'
    }
  }

  if (showSuccess) {
    return (
      <div className="barcode-printing bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Labels Generated!</h3>
          <p className="text-sm text-gray-500">{totalLabels} barcode labels ready for printing</p>
          <button
            onClick={() => setShowSuccess(false)}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
          >
            Print More
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="barcode-printing bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Barcode Printing</h3>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
            <Settings size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Print barcode labels for products</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Products */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Search Products</label>
          <div className="relative">
            <Scan size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Product List */}
        {searchQuery && (
          <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto animate-fadeIn">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => toggleProductSelection(product)}
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

        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-700">Selected Products ({selectedProducts.length})</label>
              <button
                onClick={() => setSelectedProducts([])}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedProducts.map(product => (
                <div key={product.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg">
                    {product.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-[10px] text-gray-500">{product.sku}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(product.id, product.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold text-gray-900 w-6 text-center">{product.quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, product.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeFromSelection(product.id)}
                      className="p-1 text-gray-400 hover:text-red-500 ml-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Label Settings */}
        {selectedProducts.length > 0 && (
          <div className="animate-fadeIn">
            <label className="block text-xs font-medium text-gray-700 mb-1">Label Size</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLabelSize('small')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${labelSize === 'small' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Small
              </button>
              <button
                onClick={() => setLabelSize('medium')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${labelSize === 'medium' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Medium
              </button>
              <button
                onClick={() => setLabelSize('large')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${labelSize === 'large' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Large
              </button>
            </div>
          </div>
        )}

        {/* Label Preview */}
        {selectedProducts.length > 0 && (
          <div className="animate-fadeIn">
            <label className="block text-xs font-medium text-gray-700 mb-2">Preview</label>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedProducts.slice(0, 3).map(product => (
                  <div key={product.id} className={`${getLabelSizeClass()} bg-white rounded-lg shadow-sm p-2 flex flex-col items-center justify-center border border-gray-200`}>
                    <div className="text-lg">{product.image}</div>
                    <div className="font-mono font-bold mt-1">{product.barcode.slice(-8)}</div>
                    <div className="text-gray-500 truncate w-full text-center">{product.name.slice(0, 10)}</div>
                    <div className="mt-1 h-4 w-full bg-gradient-to-r from-gray-300 to-gray-400" />
                  </div>
                ))}
                {selectedProducts.length > 3 && (
                  <div className={`${getLabelSizeClass()} bg-gray-200 rounded-lg flex items-center justify-center`}>
                    <span className="text-gray-500">+{selectedProducts.length - 3} more</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Print Button */}
        {selectedProducts.length > 0 && (
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              isPrinting ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {isPrinting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Generating Labels...</span>
              </>
            ) : (
              <>
                <Printer size={16} />
                <span>Print {totalLabels} Label{totalLabels !== 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        )}

        {/* Info Note */}
        <div className="bg-blue-50 rounded-lg p-2 flex items-start gap-2">
          <AlertCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-700">
            Labels will be generated in {labelSize} size. Compatible with all standard barcode printers.
          </p>
        </div>
      </div>

      {/* Hidden Print Area */}
      <div ref={printRef} className="hidden print:block">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Barcode Labels</h2>
          <div className="flex flex-wrap gap-4">
            {selectedProducts.map(product => (
              Array(product.quantity).fill().map((_, idx) => (
                <div key={`${product.id}-${idx}`} className="w-48 h-32 border p-3 rounded flex flex-col items-center justify-center">
                  <div className="text-2xl mb-2">{product.image}</div>
                  <div className="font-mono text-lg font-bold">{product.barcode.slice(-8)}</div>
                  <div className="text-sm mt-1">{product.name}</div>
                  <div className="text-xs text-gray-500">₹{product.price}</div>
                  <div className="mt-2 h-6 w-full bg-gray-800" />
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}