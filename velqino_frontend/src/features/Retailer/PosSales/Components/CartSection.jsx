"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Minus, Trash2, Percent, Tag, ShoppingBag, X } from '../../../../utils/icons'
import '../../../../styles/Retailer/PosSales/CartSection.scss'

export default function CartSection({ cart, setCart }) {
  const [mounted, setMounted] = useState(false)
  const [discountType, setDiscountType] = useState('percentage') // 'percentage' or 'fixed'
  const [discountValue, setDiscountValue] = useState(0)
  const [couponCode, setCouponCode] = useState('')
  const [showCoupon, setShowCoupon] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

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

  const clearCart = () => {
    if (confirm('Are you sure you want to clear the entire cart?')) {
      setCart([])
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  let discountAmount = 0
  if (discountValue > 0) {
    if (discountType === 'percentage') {
      discountAmount = (subtotal * discountValue) / 100
    } else {
      discountAmount = Math.min(discountValue, subtotal)
    }
  }
  
  const couponDiscount = couponCode === 'SAVE10' ? subtotal * 0.1 : 0
  const totalDiscount = discountAmount + couponDiscount
  const total = subtotal - totalDiscount

  return (
    <div className="cart-section bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Current Sale</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {cart.length} items
            </span>
          </div>
          {cart.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-xs text-red-500 hover:text-red-600 transition-all flex items-center gap-1"
            >
              <Trash2 size={12} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-h-[300px] overflow-y-auto custom-scroll">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-500">Cart is empty</p>
            <p className="text-xs text-gray-400 mt-1">Add products from the left panel</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cart.map((item) => (
              <div key={item.id} className="cart-item p-4 transition-all hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  {/* Product Image */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                    {item.image}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                        <p className="text-xs text-gray-500 mt-0.5">₹{item.price} each</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-semibold text-gray-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discount Section */}
      {cart.length > 0 && (
        <div className="p-4 border-t border-gray-100 space-y-3">
          {/* Discount Toggle */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowCoupon(!showCoupon)}
              className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Tag size={12} />
              <span>Add Coupon / Discount</span>
            </button>
          </div>

          {/* Discount Inputs */}
          {showCoupon && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex gap-2">
                <div className="flex-1">
                  <select 
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder={discountType === 'percentage' ? 'Discount %' : 'Discount ₹'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                />
                {couponCode && (
                  <button className="px-3 py-1.5 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all">
                    Apply
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Order Note */}
          <div className="mt-3">
            <textarea
              placeholder="Add order note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Coupon ({couponCode})</span>
                <span className="font-medium text-green-600">-₹{couponDiscount.toLocaleString()}</span>
              </div>
            )}
            
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-900">Total</span>
              <span className="text-primary-600">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}