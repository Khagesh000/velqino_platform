"use client"
import React, { useState, useEffect } from 'react'
import { PlusCircle, PackageCheck, BarChart3, Wallet, ArrowRight, Sparkles } from '../../../../utils/icons';
import { useRouter } from 'next/navigation';
import '../../../../styles/Wholesaler/WholesalerDashboard/QuickActions.scss'

export default function QuickActionsRow({ products, orders, stats }) {
  const [hoveredAction, setHoveredAction] = useState(null)
  const router = useRouter();

  // Calculate real stats
  const productsAddedThisWeek = products.filter(p => {
    const createdDate = new Date(p.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate >= weekAgo;
  }).length;

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const urgentOrders = orders.filter(o => o.status === 'pending').length;

  const revenueGrowth = stats?.revenue_change || 0;
  const availableBalance = stats?.total_revenue || 0;

  const actions = [
    {
      id: 'add',
      label: 'Add Product',
      icon: <PlusCircle size={22} />,
      color: 'primary',
      description: 'List new products',
      shortcut: '⌘ N',
      stats: `${productsAddedThisWeek} added this week`,
      onClick: () => router.push('/wholesaler/productcatalog')
    },
    {
      id: 'process',
      label: 'Process Orders',
      icon: <PackageCheck size={22} />,
      color: 'success',
      description: `${pendingOrders} pending orders`,
      shortcut: '⌘ O',
      stats: `${urgentOrders} urgent`,
      onClick: () => router.push('/wholesaler/ordermanagment')
    },
    {
      id: 'reports',
      label: 'View Reports',
      icon: <BarChart3 size={22} />,
      color: 'accent',
      description: 'Analytics & insights',
      shortcut: '⌘ R',
      stats: `${revenueGrowth > 0 ? '↑' : '↓'} ${Math.abs(revenueGrowth)}% growth`,
      onClick: () => router.push('/wholesaler/analyticsreports')
    },
    {
      id: 'withdraw',
      label: 'Withdraw Earnings',
      icon: <Wallet size={22} />,
      color: 'warning',
      description: `₹${availableBalance.toLocaleString()} available`,
      stats: 'Settle by payout date',
      onClick: () => router.push('/wholesaler/paymentsandpayouts')
    }
  ]

  return (
    <div className="quick-actions-container">
      {/* Section Header */}
      <div className="quick-actions-header">
        <div className="header-left">
          <div className="header-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="header-title">Quick Actions</h3>
            <p className="header-subtitle">Frequently used tasks at your fingertips</p>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`action-card action-${action.color}`}
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
            onClick={action.onClick}
          >
            {/* Background Gradient */}
            <div className="action-bg" />
            
            {/* Icon Section */}
            <div className="action-icon-wrapper">
              <div className={`action-icon action-icon-${action.color}`}>
                {action.icon}
              </div>
            </div>

            {/* Content Section */}
            <div className="action-content">
              <div className="action-header">
                <span className="action-label">{action.label}</span>
              </div>
              <p className="action-description">{action.description}</p>
              
              {/* Stats Bar */}
              <div className="action-stats">
                <span className="stats-text">{action.stats}</span>
                <div className="stats-bar">
                  <div 
                    className={`stats-progress stats-progress-${action.color}`}
                    style={{ 
                      width: action.id === 'add' ? `${Math.min(100, (productsAddedThisWeek / 20) * 100)}%` : 
                             action.id === 'process' ? `${Math.min(100, (pendingOrders / 50) * 100)}%` : 
                             action.id === 'reports' ? `${Math.min(100, Math.abs(revenueGrowth))}%` : 
                             `${Math.min(100, (availableBalance / 100000) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Arrow Indicator */}
            <div className="action-arrow">
              <ArrowRight size={18} />
            </div>

            {/* Hover Glow */}
            {hoveredAction === action.id && (
              <div className={`action-glow action-glow-${action.color}`} />
            )}
          </button>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="quick-tips">
        <div className="tip-item">
          <span className="tip-dot" />
          <span className="tip-text">Recently added: {productsAddedThisWeek} products</span>
        </div>
        <div className="tip-item">
          <span className="tip-dot" />
          <span className="tip-text">Orders processing: {urgentOrders} items</span>
        </div>
        <div className="tip-item">
          <span className="tip-dot" />
          <span className="tip-text">Revenue {revenueGrowth > 0 ? 'up' : 'down'} {Math.abs(revenueGrowth)}% this period</span>
        </div>
      </div>
    </div>
  )
}