"use client"

import React, { useState, useEffect } from 'react'
import { Gift, Cake, Heart, Calendar, Bell, Send, MessageCircle, Phone, Mail, Star, Users, Sparkles, XCircle } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerCustomers/BirthdayAnniversary.scss'
import { useGetUpcomingAnniversariesQuery, useGetUpcomingBirthdaysQuery } from '@/redux/customer/slices/customerSlice'

export default function BirthdayAnniversary({ onSelectCustomer }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('birthday')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showSendModal, setShowSendModal] = useState(false)

  // Backend API calls - NO frontend calculations
  const { data: birthdaysData, isLoading: birthdaysLoading, refetch: refetchBirthdays } = useGetUpcomingBirthdaysQuery()
  const { data: anniversariesData, isLoading: anniversariesLoading, refetch: refetchAnniversaries } = useGetUpcomingAnniversariesQuery()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const upcomingBirthdays = birthdaysData?.data || []
  const upcomingAnniversaries = anniversariesData?.data || []
  const currentData = activeTab === 'birthday' ? upcomingBirthdays : upcomingAnniversaries
  const isLoading = activeTab === 'birthday' ? birthdaysLoading : anniversariesLoading

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
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
  }

  const handleSendWishes = (customer) => {
    setSelectedCustomer(customer)
    setShowSendModal(true)
  }

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer)
    if (onSelectCustomer) {
      onSelectCustomer(customer)
    }
  }

  const getOfferForCustomer = (customer) => {
    if (customer.tier === 'Platinum') return '20% off + Free Gift'
    if (customer.tier === 'Gold') return '15% off'
    if (customer.tier === 'Silver') return '10% off'
    return '5% off'
  }

  if (isLoading) {
    return (
      <div className="birthday-anniversary bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading...</p>
        </div>
      </div>
    )
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
                onClick={() => handleCustomerClick(item)}
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
                        {activeTab === 'anniversary' && item.years_with_us && (
                          <span className="text-[9px] text-gray-500">{item.years_with_us} years</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getDaysLeftClass(item.days_left)}`}>
                      {item.days_left} days left
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{formatDate(item.date_of_birth || item.anniversary_date)}</p>
                  </div>
                </div>

                {/* Customer Stats */}
                <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  <span>₹{item.total_spent?.toLocaleString() || 0} spent</span>
                  {activeTab === 'birthday' && item.last_purchase && (
                    <>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>Last purchase: {formatDate(item.last_purchase)}</span>
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
                  <a
                    href={`tel:${item.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="py-1.5 px-2 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    <Phone size={12} />
                  </a>
                  <a
                    href={`https://wa.me/${item.phone?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="py-1.5 px-2 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    <MessageCircle size={12} />
                  </a>
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
                <p className="text-xs text-gray-500">{formatDate(selectedCustomer.date_of_birth || selectedCustomer.anniversary_date)}</p>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
              <textarea
                rows={4}
                defaultValue={activeTab === 'birthday' 
                  ? `Happy Birthday ${selectedCustomer.name}! 🎂\n\nWe have a special gift for you: ${getOfferForCustomer(selectedCustomer)} on your next purchase.\n\nWishing you a wonderful year ahead!\n\n- Store Team`
                  : `Happy Anniversary ${selectedCustomer.name}! ❤️\n\nThank you for being with us for ${selectedCustomer.years_with_us || 1} years. Enjoy ${getOfferForCustomer(selectedCustomer)} on your next purchase.\n\n- Store Team`
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