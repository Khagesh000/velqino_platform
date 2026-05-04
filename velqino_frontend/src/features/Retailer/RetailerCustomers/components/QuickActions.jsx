"use client"

import React, { useState, useEffect } from 'react'
import { Phone, MessageCircle, Mail, FileText, ShoppingCart, XCircle, Star, Send, Copy, CheckCircle, UserPlus, Tag, Bell } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerCustomers/QuickActions.scss'

export default function QuickActions({ selectedCustomer }) {
  const [mounted, setMounted] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const actions = [
    { id: 'call', label: 'Call', icon: <Phone size={16} />, color: 'green', href: `tel:${selectedCustomer?.phone}`, bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-200' },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={16} />, color: 'whatsapp', href: `https://wa.me/${selectedCustomer?.phone?.replace(/\D/g, '')}`, bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-200' },
    { id: 'email', label: 'Email', icon: <Mail size={16} />, color: 'blue', href: `mailto:${selectedCustomer?.email}`, bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-200' },
    { id: 'note', label: 'Add Note', icon: <FileText size={16} />, color: 'purple', bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-200' },
    { id: 'sale', label: 'Create Sale', icon: <ShoppingCart size={16} />, color: 'orange', bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-200' },
  ]

  const quickOffers = [
    { id: '10off', label: '10% OFF', points: 500, description: 'Minimum purchase ₹1000' },
    { id: '15off', label: '15% OFF', points: 800, description: 'Minimum purchase ₹2000' },
    { id: 'freeshipping', label: 'Free Shipping', points: 300, description: 'No minimum' },
    { id: 'gift', label: 'Free Gift', points: 1000, description: 'On orders above ₹3000' },
  ]

  const handleCopyPhone = () => {
    if (selectedCustomer?.phone) {
      navigator.clipboard.writeText(selectedCustomer.phone)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSendOffer = () => {
    if (selectedOffer) {
      alert(`Special offer sent to ${selectedCustomer?.name}`)
      setShowOfferModal(false)
      setSelectedOffer('')
    }
  }

  if (!selectedCustomer) {
    return (
      <div className="quick-actions bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-6 text-center">
          <UserPlus size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">Select a customer</p>
          <p className="text-xs text-gray-400 mt-1">Click on any customer to see actions</p>
        </div>
      </div>
    )
  }

  return (
    <div className="quick-actions bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-500" />
            <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <button 
            onClick={() => setShowOfferModal(true)}
            className="px-2 py-1 text-[10px] font-medium bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-1"
          >
            <Tag size={10} />
            Send Offer
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Engage with {selectedCustomer.name}</p>
      </div>

      {/* Customer Quick Info */}
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{selectedCustomer.name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900">{selectedCustomer.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1">
                <Phone size={10} className="text-gray-400" />
                <span className="text-xs text-gray-600">{selectedCustomer.phone}</span>
              </div>
              <button 
                onClick={handleCopyPhone}
                className="p-0.5 text-gray-400 hover:text-primary-600"
              >
                {copied ? <CheckCircle size={10} className="text-green-500" /> : <Copy size={10} />}
              </button>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Mail size={10} className="text-gray-400" />
              <span className="text-xs text-gray-500 truncate">{selectedCustomer.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4">
        <p className="text-xs font-medium text-gray-700 mb-2">Contact Customer</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {actions.slice(0, 4).map((action) => (
            <button
              key={action.id}
              onClick={() => {
                if (action.id === 'note') {
                  setShowNoteModal(true)
                } else if (action.id === 'sale') {
                  alert(`Create new sale for ${selectedCustomer.name}`)
                } else if (action.href) {
                  window.open(action.href, '_blank')
                }
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${action.bg} ${action.text} ${action.hover}`}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>

        <p className="text-xs font-medium text-gray-700 mb-2">Customer Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => alert(`View order history for ${selectedCustomer.name}`)}
            className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
          >
            <FileText size={14} />
            <span className="text-xs font-medium">Order History</span>
          </button>
          <button 
            onClick={() => alert(`View loyalty points for ${selectedCustomer.name}`)}
            className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
          >
            <Star size={14} />
            <span className="text-xs font-medium">Loyalty</span>
          </button>
        </div>
      </div>

      {/* Recent Interaction */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={10} className="text-gray-400" />
          <p className="text-[10px] font-medium text-gray-500">Last Interaction</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={12} className="text-green-500" />
            <span className="text-xs text-gray-600">WhatsApp message sent</span>
          </div>
          <span className="text-[10px] text-gray-400">2 days ago</span>
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Add Note</h3>
              </div>
              <button onClick={() => setShowNoteModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Add a note about this customer..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (noteText.trim()) {
                    alert('Note added successfully')
                    setShowNoteModal(false)
                    setNoteText('')
                  }
                }}
                className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">Send Special Offer</h3>
              </div>
              <button onClick={() => setShowOfferModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">Select an offer to send to {selectedCustomer.name}</p>
              <div className="space-y-2">
                {quickOffers.map((offer) => (
                  <label
                    key={offer.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedOffer === offer.id ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="offer"
                      value={offer.id}
                      checked={selectedOffer === offer.id}
                      onChange={(e) => setSelectedOffer(e.target.value)}
                      className="w-4 h-4 text-yellow-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">{offer.label}</span>
                        <span className="text-xs text-yellow-600">{offer.points} points</span>
                      </div>
                      <p className="text-xs text-gray-500">{offer.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOffer}
                disabled={!selectedOffer}
                className={`flex-1 px-4 py-2 text-sm rounded-lg transition-all flex items-center justify-center gap-1 ${
                  selectedOffer ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send size={14} />
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}