"use client"

import React, { useState } from 'react'
import {
  Mail,
  Phone,
  ShoppingBag,
  FileText,
  Ban,
  ChevronDown,
  MoreVertical,
  Check,
  X
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Customers/QuickActions.scss'

export default function QuickActions({ selectedCustomer, selectedCount = 0, onSendEmail, onCall, onCreateOrder, onAddNote, onBlockCustomer }) {
  const [showMoreActions, setShowMoreActions] = useState(false)
  const [showBlockConfirm, setShowBlockConfirm] = useState(false)
  const [hoveredAction, setHoveredAction] = useState(null)

  const actions = [
    {
      id: 'email',
      label: 'Send Email',
      icon: Mail,
      color: 'primary',
      onClick: onSendEmail,
      description: 'Send email to customer',
      show: true
    },
    {
      id: 'call',
      label: 'Call',
      icon: Phone,
      color: 'success',
      onClick: onCall,
      description: 'Call customer',
      show: true
    },
    {
      id: 'order',
      label: 'Create Order',
      icon: ShoppingBag,
      color: 'info',
      onClick: onCreateOrder,
      description: 'Create new order',
      show: true
    },
    {
      id: 'note',
      label: 'Add Note',
      icon: FileText,
      color: 'warning',
      onClick: onAddNote,
      description: 'Add customer note',
      show: true
    },
    {
      id: 'block',
      label: 'Block Customer',
      icon: Ban,
      color: 'error',
      onClick: () => setShowBlockConfirm(true),
      description: 'Block customer access',
      show: selectedCustomer || selectedCount > 0
    }
  ]

  const visibleActions = actions.filter(action => action.show)

  const getActionColor = (color) => {
    const colors = {
      primary: 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100',
      success: 'bg-success-50 text-success-700 border-success-200 hover:bg-success-100',
      info: 'bg-info-50 text-info-700 border-info-200 hover:bg-info-100',
      warning: 'bg-warning-50 text-warning-700 border-warning-200 hover:bg-warning-100',
      error: 'bg-error-50 text-error-700 border-error-200 hover:bg-error-100'
    }
    return colors[color] || colors.primary
  }

  const handleBlockConfirm = () => {
    onBlockCustomer?.()
    setShowBlockConfirm(false)
  }

  return (
    <div className="quick-actions bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-xs text-gray-500">
              {selectedCustomer ? `Actions for ${selectedCustomer.name}` : selectedCount > 0 ? `${selectedCount} customers selected` : 'Select a customer to take action'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {visibleActions.map((action, index) => {
          const Icon = action.icon
          const colors = getActionColor(action.color)
          
          return (
            <button
              key={action.id}
              className={`quick-action-card flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all ${colors} ${
                !selectedCustomer && selectedCount === 0 && action.id !== 'block' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={action.onClick}
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              disabled={!selectedCustomer && selectedCount === 0 && action.id !== 'block'}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Icon size={20} className="sm:w-6 sm:h-6 mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm font-medium">{action.label}</span>
              <span className="text-xxs sm:text-xs text-gray-500 mt-0.5 hidden sm:block">{action.description}</span>
            </button>
          )
        })}
      </div>

      {/* Block Customer Confirmation Modal */}
      {showBlockConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBlockConfirm(false)}
          />
          <div className="relative bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-error-100 flex items-center justify-center text-error-600">
                <Ban size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Block Customer</h3>
                <p className="text-xs sm:text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to block {selectedCustomer?.name || 'this customer'}? 
              They will not be able to place orders or access their account.
            </p>
            
            <div className="flex items-center gap-3">
              <button
                className="flex-1 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                onClick={() => setShowBlockConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-error-500 rounded-lg hover:bg-error-600 transition-all"
                onClick={handleBlockConfirm}
              >
                Block Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}