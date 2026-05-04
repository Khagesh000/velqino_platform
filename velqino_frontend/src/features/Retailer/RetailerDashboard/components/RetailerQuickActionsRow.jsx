"use client"

import React, { useState, useEffect } from 'react'
import { Plus, ShoppingCart, Eye, Scan, TrendingUp, Users, Package, Calendar } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerDashboard/RetailerQuickActionsRow.scss'

export default function RetailerQuickActionsRow() {
  const [mounted, setMounted] = useState(false)
  const [hoveredAction, setHoveredAction] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const quickActions = [
    {
      id: 'newSale',
      title: 'New Sale',
      description: 'Start a new transaction',
      icon: <Plus size={20} />,
      color: 'primary',
      href: '/retailer/pos'
    },
    {
      id: 'checkout',
      title: 'Checkout',
      description: 'Complete current sale',
      icon: <ShoppingCart size={20} />,
      color: 'success',
      href: '/retailer/pos/checkout'
    },
    {
      id: 'viewProducts',
      title: 'View Products',
      description: 'Browse inventory',
      icon: <Eye size={20} />,
      color: 'info',
      href: '/retailer/products'
    },
    {
      id: 'scanBarcode',
      title: 'Scan Barcode',
      description: 'Quick product lookup',
      icon: <Scan size={20} />,
      color: 'warning',
      href: '/retailer/scan'
    }
  ]

  return (
    <div className="retailer-quick-actions">
      <div className="quick-actions-grid">
        {quickActions.map((action, index) => (
          <button
            key={action.id}
            className={`quick-action-card quick-action-card-${action.color} ${hoveredAction === action.id ? 'quick-action-card-hover' : ''}`}
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
            onClick={() => console.log(`Navigate to ${action.href}`)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={`quick-action-icon quick-action-icon-${action.color}`}>
              {action.icon}
            </div>
            <div className="quick-action-content">
              <h3 className="quick-action-title">{action.title}</h3>
              <p className="quick-action-description">{action.description}</p>
            </div>
            <div className="quick-action-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}