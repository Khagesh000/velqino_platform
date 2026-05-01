"use client"

import React, { useState } from 'react'
import {
  Mail,
  Phone,
  ShoppingBag,
  FileText,
  Ban,
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Customers/QuickActions.scss'

export default function QuickActions({ selectedCustomer, selectedCount = 0, onSendEmail, onCall, onCreateOrder, onAddNote, onBlockCustomer }) {
  const [showMoreActions, setShowMoreActions] = useState(false)
  const [showBlockConfirm, setShowBlockConfirm] = useState(false)
  const [hoveredAction, setHoveredAction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const actions = [
    {
      id: 'email',
      label: 'Send Email',
      icon: Mail,
      color: 'primary',
      onClick: () => handleSendEmail(),
      description: 'Send email to customer',
      show: true
    },
    {
      id: 'call',
      label: 'Call',
      icon: Phone,
      color: 'success',
      onClick: () => handleMakeCall(),
      description: 'Call customer',
      show: true
    },
    {
      id: 'order',
      label: 'Create Order',
      icon: ShoppingBag,
      color: 'info',
      onClick: () => handleCreateOrder(),
      description: 'Create new order',
      show: true
    },
    {
      id: 'note',
      label: 'Add Note',
      icon: FileText,
      color: 'warning',
      onClick: () => handleAddNote(),
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

  // ✅ Send Email - Backend Integration
  const handleSendEmail = async () => {
    if (!selectedCustomer && selectedCount === 0) return
    
    setIsLoading(true)
    try {
      const customerIds = selectedCount > 0 
        ? selectedCustomer?.map(c => c.id) 
        : [selectedCustomer?.id]
      
      const response = await fetch('/api/identity/bulk-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          customer_ids: customerIds,
          type: selectedCount > 0 ? 'bulk' : 'single'
        })
      })
      
      if (!response.ok) throw new Error('Failed to send email')
      
      const result = await response.json()
      alert(result.message || `Email sent to ${selectedCount > 0 ? `${selectedCount} customers` : selectedCustomer?.name}`)
      onSendEmail?.()
    } catch (error) {
      alert('Failed to send email: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Make Call - Backend Integration
  const handleMakeCall = async () => {
    if (!selectedCustomer && selectedCount === 0) return
    
    setIsLoading(true)
    try {
      const phoneNumber = selectedCustomer?.phone
      if (!phoneNumber) {
        alert('No phone number available for this customer')
        return
      }
      
      // For now, just initiate call log - actual call would need Twilio/Agora
      const response = await fetch('/api/identity/initiate-call/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          customer_id: selectedCustomer?.id,
          phone: phoneNumber
        })
      })
      
      if (!response.ok) throw new Error('Failed to initiate call')
      
      const result = await response.json()
      alert(`Calling ${selectedCustomer?.name} at ${phoneNumber}`)
      onCall?.()
    } catch (error) {
      alert('Failed to initiate call: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Create Order - Backend Integration
  const handleCreateOrder = async () => {
    if (!selectedCustomer && selectedCount === 0) return
    
    setIsLoading(true)
    try {
      const customerId = selectedCustomer?.id
      if (!customerId) {
        alert('Please select a customer to create order')
        return
      }
      
      const response = await fetch('/api/commerce/orders/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          retailer_id: customerId,
          status: 'pending'
        })
      })
      
      if (!response.ok) throw new Error('Failed to create order')
      
      const result = await response.json()
      alert(`Order created successfully! Order ID: ${result.order_id}`)
      onCreateOrder?.()
    } catch (error) {
      alert('Failed to create order: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Add Note - Backend Integration
  const handleAddNote = async () => {
    if (!selectedCustomer && selectedCount === 0) return
    
    const note = prompt('Enter note for customer:')
    if (!note) return
    
    setIsLoading(true)
    try {
      const customerIds = selectedCount > 0 
        ? selectedCustomer?.map(c => c.id) 
        : [selectedCustomer?.id]
      
      const response = await fetch('/api/identity/add-customer-note/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          customer_ids: customerIds,
          note: note
        })
      })
      
      if (!response.ok) throw new Error('Failed to add note')
      
      alert(`Note added to ${selectedCount > 0 ? `${selectedCount} customers` : selectedCustomer?.name}`)
      onAddNote?.()
    } catch (error) {
      alert('Failed to add note: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Block Customer - Backend Integration
  const handleBlockConfirm = async () => {
    setIsLoading(true)
    try {
      const customerIds = selectedCount > 0 
        ? selectedCustomer?.map(c => c.id) 
        : [selectedCustomer?.id]
      
      const response = await fetch('/api/identity/block-customers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          customer_ids: customerIds,
          action: 'block'
        })
      })
      
      if (!response.ok) throw new Error('Failed to block customer')
      
      alert(`${selectedCount > 0 ? `${selectedCount} customers` : selectedCustomer?.name} has been blocked`)
      onBlockCustomer?.()
      setShowBlockConfirm(false)
    } catch (error) {
      alert('Failed to block customer: ' + error.message)
    } finally {
      setIsLoading(false)
    }
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
              {isLoading ? 'Processing...' : (selectedCustomer ? `Actions for ${selectedCustomer.name}` : selectedCount > 0 ? `${selectedCount} customers selected` : 'Select a customer to take action')}
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
                (!selectedCustomer && selectedCount === 0 && action.id !== 'block') || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={action.onClick}
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              disabled={(!selectedCustomer && selectedCount === 0 && action.id !== 'block') || isLoading}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Icon size={20} className="sm:w-6 sm:h-6 mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm font-medium">{isLoading ? '...' : action.label}</span>
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
              Are you sure you want to block {selectedCustomer?.name || (selectedCount > 0 ? `${selectedCount} customers` : 'this customer')}? 
              They will not be able to place orders or access their account.
            </p>
            
            <div className="flex items-center gap-3">
              <button
                className="flex-1 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                onClick={() => setShowBlockConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-error-500 rounded-lg hover:bg-error-600 transition-all"
                onClick={handleBlockConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Block Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}