"use client"
import React, { useState } from 'react'
import { PlusCircle, PackageCheck, BarChart3, Wallet, ArrowRight, Sparkles } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/QuickActions.scss'

export default function QuickActionsRow() {
  const [hoveredAction, setHoveredAction] = useState(null)

  const actions = [
    {
      id: 'add',
      label: 'Add Product',
      icon: <PlusCircle size={22} />,
      color: 'primary',
      description: 'List new products',
      shortcut: '⌘ N',
      stats: '12 added this week'
    },
    {
      id: 'process',
      label: 'Process Orders',
      icon: <PackageCheck size={22} />,
      color: 'success',
      description: '12 pending orders',
      shortcut: '⌘ O',
      stats: '5 urgent'
    },
    {
      id: 'reports',
      label: 'View Reports',
      icon: <BarChart3 size={22} />,
      color: 'accent',
      description: 'Analytics & insights',
      shortcut: '⌘ R',
      stats: '↑ 23% growth'
    },
    {
      id: 'withdraw',
      label: 'Withdraw Earnings',
      icon: <Wallet size={22} />,
      color: 'warning',
      description: '₹85,000 available',
      stats: 'Settle by Mar 21'
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
            onClick={() => console.log(`Navigate to ${action.id}`)}
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
                      width: action.id === 'add' ? '65%' : 
                             action.id === 'process' ? '40%' : 
                             action.id === 'reports' ? '80%' : '30%' 
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
          <span className="tip-text">Recently added: 3 products</span>
        </div>
        <div className="tip-item">
          <span className="tip-dot" />
          <span className="tip-text">Orders processing: 5 items</span>
        </div>
        <div className="tip-item">
          <span className="tip-dot" />
          <span className="tip-text">Reports ready: Monthly summary</span>
        </div>
      </div>
    </div>
  )
}