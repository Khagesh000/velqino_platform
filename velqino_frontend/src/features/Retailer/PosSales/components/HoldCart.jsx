"use client"

import React, { useState, useEffect } from 'react'
import { Archive, Plus, Clock, ShoppingBag, Trash2, Eye, RefreshCw, X } from '../../../../utils/icons'
import '../../../../styles/Retailer/PosSales/HoldCart.scss'

export default function HoldCart({ currentCart, onLoadCart, onClearCurrentCart }) {
  const [mounted, setMounted] = useState(false)
  const [heldCarts, setHeldCarts] = useState([])
  const [showHoldModal, setShowHoldModal] = useState(false)
  const [cartName, setCartName] = useState('')
  const [showHeldCartsList, setShowHeldCartsList] = useState(false)
  const [selectedHold, setSelectedHold] = useState(null)

  useEffect(() => {
    setMounted(true)
    // Load held carts from localStorage
    const saved = localStorage.getItem('heldCarts')
    if (saved) {
      setHeldCarts(JSON.parse(saved))
    }
  }, [])

  if (!mounted) return null

  // Save held carts to localStorage
  const saveToLocalStorage = (carts) => {
    localStorage.setItem('heldCarts', JSON.stringify(carts))
    setHeldCarts(carts)
  }

  // Hold current cart
  const handleHoldCart = () => {
    if (!currentCart || currentCart.length === 0) {
      alert('Cart is empty. Add items before holding.')
      return
    }

    if (!cartName.trim()) {
      alert('Please enter a name for this cart')
      return
    }

    const newHeldCart = {
      id: Date.now(),
      name: cartName,
      items: [...currentCart],
      subtotal: currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      itemCount: currentCart.length,
      createdAt: new Date().toISOString(),
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    }

    const updatedCarts = [...heldCarts, newHeldCart]
    saveToLocalStorage(updatedCarts)
    
    // Clear current cart
    if (onClearCurrentCart) onClearCurrentCart()
    
    setCartName('')
    setShowHoldModal(false)
    alert('Cart saved successfully!')
  }

  // Load held cart
  const handleLoadCart = (cart) => {
    if (onLoadCart) {
      onLoadCart(cart.items)
    }
    setShowHeldCartsList(false)
    alert(`Loaded cart: ${cart.name}`)
  }

  // Delete held cart
  const handleDeleteCart = (cartId, e) => {
    e.stopPropagation()
    const updatedCarts = heldCarts.filter(c => c.id !== cartId)
    saveToLocalStorage(updatedCarts)
    if (selectedHold === cartId) setSelectedHold(null)
  }

  // Clear all held carts
  const handleClearAll = () => {
    if (confirm('Delete all held carts?')) {
      saveToLocalStorage([])
      setShowHeldCartsList(false)
    }
  }

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return `${Math.floor(diffMins / 1440)} days ago`
  }

  return (
    <div className="hold-cart bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Archive size={16} className="text-primary-500" />
            <h3 className="text-sm font-semibold text-gray-900">Hold Cart</h3>
          </div>
          {heldCarts.length > 0 && (
            <button 
              onClick={() => setShowHeldCartsList(!showHeldCartsList)}
              className="text-[10px] text-primary-600 hover:text-primary-700"
            >
              View All ({heldCarts.length})
            </button>
          )}
        </div>
      </div>

      {/* Main Actions */}
      <div className="p-3">
        <button
          onClick={() => setShowHoldModal(true)}
          className="w-full py-2.5 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Hold Current Cart</span>
        </button>

        {heldCarts.length > 0 && (
          <button
            onClick={() => setShowHeldCartsList(true)}
            className="w-full mt-2 py-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <Clock size={14} />
            <span>Retrieve Held Cart</span>
          </button>
        )}
      </div>

      {/* Recent Held Cart Preview */}
      {heldCarts.length > 0 && !showHeldCartsList && (
        <div className="border-t border-gray-100 p-3">
          <p className="text-[10px] text-gray-500 mb-2">Recently saved</p>
          <div className="space-y-2">
            {heldCarts.slice(-2).reverse().map(cart => (
              <div 
                key={cart.id}
                className="bg-gray-50 rounded-lg p-2 cursor-pointer hover:bg-primary-50 transition-all"
                onClick={() => handleLoadCart(cart)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700 truncate max-w-[100px]">
                    {cart.name}
                  </span>
                  <span className="text-[10px] text-gray-400">{getTimeAgo(cart.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>{cart.itemCount} items</span>
                  <span className="font-medium text-gray-700">₹{cart.subtotal.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Held Carts List Modal */}
      {showHeldCartsList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Held Carts</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {heldCarts.length}
                </span>
              </div>
              <button 
                onClick={() => setShowHeldCartsList(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {heldCarts.length === 0 ? (
                <div className="text-center py-8">
                  <Archive size={48} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-sm text-gray-500">No held carts</p>
                  <p className="text-xs text-gray-400 mt-1">Save carts to retrieve later</p>
                </div>
              ) : (
                heldCarts.map(cart => (
                  <div 
                    key={cart.id}
                    className={`border rounded-xl p-3 transition-all cursor-pointer ${
                      selectedHold === cart.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'
                    }`}
                    onMouseEnter={() => setSelectedHold(cart.id)}
                    onMouseLeave={() => setSelectedHold(null)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">{cart.name}</h4>
                          <span className="text-[10px] text-gray-400">{getTimeAgo(cart.createdAt)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {cart.itemCount} items • ₹{cart.subtotal.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Saved: {cart.date} at {cart.time}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleLoadCart(cart)}
                          className="p-1.5 text-primary-600 hover:bg-primary-100 rounded-lg transition-all"
                          title="Load Cart"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteCart(cart.id, e)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Items Preview */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {cart.items.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {item.quantity}x {item.name.split(' ').slice(0, 2).join(' ')}
                        </span>
                      ))}
                      {cart.items.length > 3 && (
                        <span className="text-[9px] text-gray-400">+{cart.items.length - 3} more</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            {heldCarts.length > 0 && (
              <div className="p-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowHeldCartsList(false)}
                  className="flex-1 py-2 text-xs font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hold Cart Modal */}
      {showHoldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Archive size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Hold Current Cart</h3>
              </div>
              <button onClick={() => setShowHoldModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cart Name
              </label>
              <input
                type="text"
                placeholder="e.g., Walk-in Customer, Order #123"
                value={cartName}
                onChange={(e) => setCartName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                autoFocus
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Give a name to easily identify this cart later
              </p>
            </div>

            {currentCart && currentCart.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs font-medium text-gray-700 mb-1">Cart Summary</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{currentCart.length} items</span>
                  <span className="font-semibold text-gray-900">
                    ₹{currentCart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowHoldModal(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleHoldCart}
                className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
              >
                Save Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}