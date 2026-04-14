"use client"

import React, { useState, useEffect } from 'react'
import { Clock, Printer, Eye, CheckCircle, Package, User, CreditCard, TrendingUp } from '../../../../utils/icons'
import '../../../../styles/Retailer/PosSales/RecentSale.scss'

export default function RecentSale() {
  const [mounted, setMounted] = useState(false)
  const [hoveredSale, setHoveredSale] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Mock recent sale data
  const recentSale = {
    id: 'TXN20260414001',
    time: '10:30 AM',
    date: 'Today',
    customer: 'Rajesh Kumar',
    items: 3,
    total: 2450,
    payment: 'UPI',
    status: 'completed',
    itemsList: [
      { name: 'Premium Cotton T-Shirt', quantity: 2, price: 499 },
      { name: 'Leather Wallet', quantity: 1, price: 1499 }
    ]
  }

  const handleReprint = () => {
    console.log('Reprinting receipt...')
    alert('Receipt reprinted successfully!')
  }

  const handleViewDetails = () => {
    console.log('Viewing sale details...')
  }

  return (
    <div className="recent-sale bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary-500" />
          <h3 className="text-sm font-semibold text-gray-900">Last Transaction</h3>
        </div>
      </div>

      {/* Content */}
      <div 
        className="p-3 hover:bg-gray-50 transition-all cursor-pointer"
        onMouseEnter={() => setHoveredSale(true)}
        onMouseLeave={() => setHoveredSale(null)}
      >
        {/* Transaction Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-gray-700">{recentSale.id}</span>
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full flex items-center gap-0.5">
                <CheckCircle size={8} />
                <span>Completed</span>
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">{recentSale.time} • {recentSale.date}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">₹{recentSale.total.toLocaleString()}</p>
            <p className="text-[10px] text-gray-500">{recentSale.items} items</p>
          </div>
        </div>

        {/* Customer & Payment */}
        <div className="flex items-center gap-3 mb-2 text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <User size={10} />
            <span>{recentSale.customer}</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <CreditCard size={10} />
            <span>{recentSale.payment}</span>
          </div>
        </div>

        {/* Items Preview */}
        <div className="bg-gray-50 rounded-lg p-2 mb-2">
          <div className="flex items-center gap-2">
            <Package size={10} className="text-gray-400" />
            <span className="text-[10px] text-gray-600">Items:</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {recentSale.itemsList.map((item, idx) => (
              <span key={idx} className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded">
                {item.quantity}x {item.name.split(' ').slice(0, 2).join(' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleReprint}
            className="flex-1 py-1.5 text-[11px] font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-primary-100 hover:text-primary-700 transition-all flex items-center justify-center gap-1"
          >
            <Printer size={12} />
            <span>Reprint</span>
          </button>
          <button
            onClick={handleViewDetails}
            className="flex-1 py-1.5 text-[11px] font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-primary-100 hover:text-primary-700 transition-all flex items-center justify-center gap-1"
          >
            <Eye size={12} />
            <span>Details</span>
          </button>
        </div>

        {/* Hover Animation Effect */}
        {hoveredSale && (
          <div className="absolute inset-0 rounded-xl bg-primary-500/5 pointer-events-none animate-pulse-overlay" />
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-center gap-1">
          <TrendingUp size={10} className="text-green-500" />
          <span className="text-[9px] text-gray-500">+12% vs last transaction</span>
        </div>
      </div>
    </div>
  )
}