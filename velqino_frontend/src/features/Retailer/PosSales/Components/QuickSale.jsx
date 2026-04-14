"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Search, Scan, Plus, Minus, X, ShoppingCart, Trash2, Edit, Tag, Percent } from '../../../../utils/icons'
import '../../../../styles/Retailer/PosSales/QuickSale.scss'

export default function QuickSale() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [showScanner, setShowScanner] = useState(false)
  const searchInputRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    searchInputRef.current?.focus()
  }, [])

  if (!mounted) return null

  // Mock products data
  const products = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', price: 499, stock: 45, image: '👕', barcode: '890123456789' },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', price: 2499, stock: 12, image: '🎧', barcode: '890123456788' },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', price: 4999, stock: 8, image: '⌚', barcode: '890123456787' },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', price: 1499, stock: 23, image: '👛', barcode: '890123456786' },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', price: 2999, stock: 15, image: '👟', barcode: '890123456785' },
  ]

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode.includes(searchQuery)
  )

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    setSearchQuery('')
    searchInputRef.current?.focus()
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id)
      return
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.18
  const total = subtotal + tax

  return (
    <div className="quick-sale bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">Quick Sale</h3>
        <p className="text-xs text-gray-500 mt-0.5">Fast checkout with barcode scanner</p>
      </div>

      {/* Search Section */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name, SKU or scan barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button 
            onClick={() => setShowScanner(!showScanner)}
            className="p-3 bg-gray-100 hover:bg-primary-100 rounded-xl transition-all"
          >
            <Scan size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Scanner Mock */}
        {showScanner && (
          <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Barcode Scanner</span>
              <button onClick={() => setShowScanner(false)} className="p-1">
                <X size={14} className="text-gray-400" />
              </button>
            </div>
            <div className="h-24 bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="w-full h-0.5 bg-green-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-gray-500 text-center mt-2">Position barcode in front of camera</p>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && filteredProducts.length > 0 && (
          <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden animate-fadeIn">
            {filteredProducts.slice(0, 5).map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="w-full flex items-center gap-3 p-3 hover:bg-primary-50 transition-all border-b border-gray-100 last:border-0 text-left"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                  {product.image}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">₹{product.price}</p>
                  <p className="text-xs text-green-600">Stock: {product.stock}</p>
                </div>
                <Plus size={16} className="text-primary-500" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Results */}
      {searchQuery && filteredProducts.length === 0 && (
        <div className="p-8 text-center">
          <Search size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">No products found</p>
        </div>
      )}

      {/* Cart Section */}
      <div className="flex-1 overflow-y-auto p-5">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-500">Cart is empty</p>
            <p className="text-xs text-gray-400 mt-1">Search and add products to start sale</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">₹{item.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-gray-400 hover:text-primary-600"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-gray-400 hover:text-primary-600"
                  >
                    <Plus size={14} />
                  </button>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-gray-400 hover:text-red-600 ml-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bill Summary */}
      {cart.length > 0 && (
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (18% GST)</span>
              <span className="font-medium text-gray-900">₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-900">Total</span>
              <span className="text-primary-600">₹{total.toLocaleString()}</span>
            </div>
          </div>
          <button className="w-full py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
            <ShoppingCart size={18} />
            <span>Proceed to Checkout</span>
          </button>
        </div>
      )}
    </div>
  )
}