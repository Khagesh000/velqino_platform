"use client"

import React, { useState, useEffect } from 'react'
import { Gift, Cake, Heart, Calendar,  Bell, Send, MessageCircle, Phone, Mail, Star, Users, Sparkles } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerCustomers/BirthdayAnniversary.scss'

export default function BirthdayAnniversary() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('birthday')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showSendModal, setShowSendModal] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const upcomingBirthdays = [
    { id: 1, name: 'Rajesh Kumar', date: '2026-04-20', daysLeft: 6, phone: '+91 98765 43210', email: 'rajesh@example.com', tier: 'Gold', totalSpent: 45890, lastPurchase: '2026-04-14' },
    { id: 2, name: 'Priya Sharma', date: '2026-04-25', daysLeft: 11, phone: '+91 87654 32109', email: 'priya@example.com', tier: 'Silver', totalSpent: 18900, lastPurchase: '2026-04-13' },
    { id: 3, name: 'Amit Singh', date: '2026-05-01', daysLeft: 17, phone: '+91 76543 21098', email: 'amit@example.com', tier: 'Gold', totalSpent: 56780, lastPurchase: '2026-04-12' },
    { id: 4, name: 'Sneha Reddy', date: '2026-05-05', daysLeft: 21, phone: '+91 65432 10987', email: 'sneha@example.com', tier: 'Silver', totalSpent: 8900, lastPurchase: '2026-04-11' },
  ]

  const upcomingAnniversaries = [
    { id: 1, name: 'Vikram Mehta', date: '2026-04-18', daysLeft: 4, yearsWithUs: 2, phone: '+91 54321 09876', email: 'vikram@example.com', tier: 'Platinum', totalSpent: 78200 },
    { id: 2, name: 'Neha Gupta', date: '2026-04-22', daysLeft: 8, yearsWithUs: 1, phone: '+91 43210 98765', email: 'neha@example.com', tier: 'Gold', totalSpent: 23450 },
    { id: 3, name: 'Rahul Verma', date: '2026-04-28', daysLeft: 14, yearsWithUs: 3, phone: '+91 32109 87654', email: 'rahul@example.com', tier: 'Silver', totalSpent: 3450 },
  ]

  const currentData = activeTab === 'birthday' ? upcomingBirthdays : upcomingAnniversaries

  const getTierBadge = (tier) => {
    switch(tier) {
      case 'Platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
      case 'Gold': return 'bg-yellow-500 text-white'
      case 'Silver': return 'bg-gray-400 text-white'
      default: return 'bg-gray-200 text-gray-700'
    }
  }

  const getDaysLeftClass = (days) => {
    if (days <= 3) return 'bg-red-100 text-red-600'
    if (days <= 7) return 'bg-orange-100 text-orange-600'
    return 'bg-green-100 text-green-600'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
  }

  const handleSendWishes = (customer) => {
    setSelectedCustomer(customer)
    setShowSendModal(true)
  }

  const getOfferForCustomer = (customer) => {
    if (customer.tier === 'Platinum') return '20% off + Free Gift'
    if (customer.tier === 'Gold') return '15% off'
    if (customer.tier === 'Silver') return '10% off'
    return '5% off'
  }

  return (
    <div className="birthday-anniversary bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Gift size={18} className="text-pink-500" />
          <h3 className="text-base font-semibold text-gray-900">Special Occasions</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">Upcoming birthdays & anniversaries</p>
      </div>

      {/* Stats Summary */}
      <div className="p-4 grid grid-cols-2 gap-3 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Cake size={14} className="text-pink-500" />
            <span className="text-xs font-medium text-gray-700">Birthdays</span>
          </div>
          <p className="text-2xl font-bold text-pink-600">{upcomingBirthdays.length}</p>
          <p className="text-[10px] text-gray-500">in next 30 days</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Heart size={14} className="text-red-500" />
            <span className="text-xs font-medium text-gray-700">Anniversaries</span>
          </div>
          <p className="text-2xl font-bold text-red-500">{upcomingAnniversaries.length}</p>
          <p className="text-[10px] text-gray-500">in next 30 days</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('birthday')}
          className={`flex-1 py-2 text-xs font-medium transition-all flex items-center justify-center gap-1 ${
            activeTab === 'birthday' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-500'
          }`}
        >
          <Cake size={12} />
          Birthdays
        </button>
        <button
          onClick={() => setActiveTab('anniversary')}
          className={`flex-1 py-2 text-xs font-medium transition-all flex items-center justify-center gap-1 ${
            activeTab === 'anniversary' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-500'
          }`}
        >
          <Heart size={12} />
          Anniversaries
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[320px] overflow-y-auto custom-scroll">
        {currentData.length === 0 ? (
          <div className="text-center py-8">
            <Gift size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No upcoming {activeTab}s</p>
            <p className="text-xs text-gray-400 mt-1">Check back later for special dates</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentData.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-3 transition-all cursor-pointer ${
                  selectedCustomer?.id === item.id ? 'ring-2 ring-pink-500 bg-pink-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedCustomer(item)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activeTab === 'birthday' ? 'bg-pink-100' : 'bg-red-100'
                    }`}>
                      {activeTab === 'birthday' ? (
                        <Cake size={18} className="text-pink-500" />
                      ) : (
                        <Heart size={18} className="text-red-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${getTierBadge(item.tier)}`}>
                          <Star size={8} />
                          {item.tier}
                        </span>
                        {activeTab === 'anniversary' && (
                          <span className="text-[9px] text-gray-500">{item.yearsWithUs} years</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getDaysLeftClass(item.daysLeft)}`}>
                      {item.daysLeft} days left
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{formatDate(item.date)}</p>
                  </div>
                </div>

                {/* Customer Stats */}
                <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  <span>₹{item.totalSpent.toLocaleString()} spent</span>
                  {activeTab === 'birthday' && item.lastPurchase && (
                    <>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>Last purchase: {new Date(item.lastPurchase).toLocaleDateString()}</span>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSendWishes(item)
                    }}
                    className="flex-1 py-1.5 text-xs font-medium bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all flex items-center justify-center gap-1"
                  >
                    <Send size={12} />
                    Send Wishes
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="py-1.5 px-2 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    <Phone size={12} />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="py-1.5 px-2 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    <MessageCircle size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <Bell size={10} className="text-pink-500" />
            <span>Reminders enabled</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles size={10} className="text-yellow-500" />
            <span>{activeTab === 'birthday' ? 'Birthday offers ready' : 'Anniversary rewards'}</span>
          </div>
        </div>
      </div>

      {/* Send Wishes Modal */}
      {showSendModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {activeTab === 'birthday' ? (
                  <Cake size={20} className="text-pink-500" />
                ) : (
                  <Heart size={20} className="text-red-500" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  Send {activeTab === 'birthday' ? 'Birthday' : 'Anniversary'} Wishes
                </h3>
              </div>
              <button onClick={() => setShowSendModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>

            <div className="mb-4">
              <div className="bg-pink-50 rounded-lg p-3 mb-3">
                <p className="text-sm font-medium text-gray-900">{selectedCustomer.name}</p>
                <p className="text-xs text-gray-500">{formatDate(selectedCustomer.date)}</p>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
              <textarea
                rows={4}
                defaultValue={activeTab === 'birthday' 
                  ? `Happy Birthday ${selectedCustomer.name}! 🎂\n\nWe have a special gift for you: ${getOfferForCustomer(selectedCustomer)} on your next purchase.\n\nWishing you a wonderful year ahead!\n\n- Store Team`
                  : `Happy Anniversary ${selectedCustomer.name}! ❤️\n\nThank you for being with us for ${selectedCustomer.yearsWithUs} years. Enjoy ${getOfferForCustomer(selectedCustomer)} on your next purchase.\n\n- Store Team`
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowSendModal(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSendModal(false)
                  alert('Wishes sent successfully!')
                }}
                className="flex-1 px-4 py-2 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all flex items-center justify-center gap-1"
              >
                <Send size={14} />
                Send via WhatsApp
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-3">
              Customer will receive this message on WhatsApp
            </p>
          </div>
        </div>
      )}
    </div>
  )
}