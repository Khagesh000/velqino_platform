"use client"

import React, { useState, useEffect } from 'react'
import { Star, Award, TrendingUp, Gift, CheckCircle, Clock, Zap, Medal, Crown, Gem, Rocket } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerCustomers/LoyaltyProgram.scss'

export default function LoyaltyProgram({ selectedCustomer, customerTotalSpent = 0, customerOrders = [] }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('points')
  const [selectedReward, setSelectedReward] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!selectedCustomer) {
    return (
      <div className="loyalty-program bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <Star size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">Select a customer to view loyalty</p>
          <p className="text-xs text-gray-400 mt-1">Click on any customer from the list</p>
        </div>
      </div>
    )
  }

  // Calculate loyalty data from real customer data
  const getCustomerName = () => {
    return selectedCustomer?.full_name || selectedCustomer?.name || selectedCustomer?.user?.full_name || 'Customer'
  }

  // Calculate points based on total spent (10 points = ₹1 spent)
  const totalEarnedPoints = Math.floor(customerTotalSpent / 10)
  const redeemedPoints = selectedCustomer?.redeemedPoints || Math.floor(totalEarnedPoints * 0.2) // Assume 20% redeemed
  const availablePoints = totalEarnedPoints - redeemedPoints
  const expiringPoints = Math.floor(availablePoints * 0.1) // Assume 10% expiring

  // Determine tier based on total spent
  const getTierInfo = (spent) => {
    if (spent >= 50000) return { name: 'Platinum', nextTier: null, pointsToNext: 0, benefits: ['10% extra points', 'Free express shipping', 'Exclusive offers', 'Dedicated manager'] }
    if (spent >= 25000) return { name: 'Gold', nextTier: 'Platinum', pointsToNext: Math.floor((50000 - spent) / 10), benefits: ['5% extra points', 'Free shipping', 'Birthday bonus'] }
    if (spent >= 10000) return { name: 'Silver', nextTier: 'Gold', pointsToNext: Math.floor((25000 - spent) / 10), benefits: ['2% extra points', 'Priority support'] }
    return { name: 'Bronze', nextTier: 'Silver', pointsToNext: Math.floor((10000 - spent) / 10), benefits: ['Welcome bonus 50pts', 'Basic support'] }
  }

  const tierInfo = getTierInfo(customerTotalSpent)

  // Generate points transactions from real orders
  const generateTransactions = () => {
    const transactions = []
    
    // Add earned points from orders
    customerOrders.forEach((order, index) => {
      const pointsEarned = Math.floor(parseFloat(order.grand_total || 0) / 10)
      if (pointsEarned > 0) {
        transactions.push({
          id: index * 2,
          type: 'earned',
          points: pointsEarned,
          description: `Purchase ${order.order_number}`,
          date: order.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
        })
      }
    })
    
    // Add birthday bonus if date matches
    const today = new Date()
    const dob = selectedCustomer?.date_of_birth
    if (dob) {
      const birthDate = new Date(dob)
      if (birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate()) {
        transactions.push({
          id: transactions.length,
          type: 'bonus',
          points: 100,
          description: 'Birthday bonus',
          date: today.toISOString().split('T')[0]
        })
      }
    }
    
    // Sort by date descending
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const loyaltyData = {
    points: {
      earned: totalEarnedPoints,
      redeemed: redeemedPoints,
      available: availablePoints,
      expiring: expiringPoints
    },
    tier: {
      name: tierInfo.name,
      nextTier: tierInfo.nextTier,
      pointsToNext: tierInfo.pointsToNext,
      benefits: tierInfo.benefits
    },
    transactions: generateTransactions()
  }

  const rewards = [
    { id: 1, name: '₹50 Off', points: 500, icon: <Gift size={20} />, color: 'green', popular: true },
    { id: 2, name: 'Free Shipping', points: 800, icon: <Rocket size={20} />, color: 'blue', popular: false },
    { id: 3, name: '10% Discount', points: 1000, icon: <Zap size={20} />, color: 'purple', popular: true },
    { id: 4, name: '₹100 Voucher', points: 1500, icon: <Gift size={20} />, color: 'orange', popular: false },
    { id: 5, name: 'Premium Product', points: 2500, icon: <Crown size={20} />, color: 'gold', popular: true },
  ]

  const tiers = [
    { name: 'Bronze', minPoints: 0, color: 'bronze', icon: <Medal size={16} />, benefits: ['Welcome bonus 50pts', 'Basic support'] },
    { name: 'Silver', minPoints: 500, color: 'silver', icon: <Medal size={16} />, benefits: ['2% extra points', 'Priority support'] },
    { name: 'Gold', minPoints: 1500, color: 'gold', icon: <Crown size={16} />, benefits: ['5% extra points', 'Free shipping', 'Birthday bonus'] },
    { name: 'Platinum', minPoints: 3000, color: 'platinum', icon: <Gem size={16} />, benefits: ['10% extra points', 'Free express shipping', 'Exclusive offers', 'Dedicated manager'] },
  ]

  const currentTierIndex = tiers.findIndex(t => t.name === loyaltyData.tier.name)
  const nextTier = tiers[currentTierIndex + 1]

  const getTierColor = (color) => {
    switch(color) {
      case 'bronze': return 'bg-orange-600 text-white'
      case 'silver': return 'bg-gray-400 text-white'
      case 'gold': return 'bg-yellow-500 text-white'
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
      default: return 'bg-gray-200 text-gray-700'
    }
  }

  const getRewardColor = (color) => {
    switch(color) {
      case 'green': return 'bg-green-50 border-green-200 text-green-600'
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-600'
      case 'purple': return 'bg-purple-50 border-purple-200 text-purple-600'
      case 'orange': return 'bg-orange-50 border-orange-200 text-orange-600'
      case 'gold': return 'bg-yellow-50 border-yellow-200 text-yellow-600'
      default: return 'bg-gray-50 border-gray-200 text-gray-600'
    }
  }

  const progressPercentage = nextTier ? (loyaltyData.points.available / nextTier.minPoints) * 100 : 100

  return (
    <div className="loyalty-program bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-yellow-500" />
          <h3 className="text-base font-semibold text-gray-900">Loyalty Program</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">Rewards & benefits for {getCustomerName()}</p>
      </div>

      {/* Points Summary */}
      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-700">{loyaltyData.points.earned.toLocaleString()}</p>
            <p className="text-[10px] text-yellow-600">Total Earned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-700">{loyaltyData.points.redeemed.toLocaleString()}</p>
            <p className="text-[10px] text-orange-600">Redeemed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{loyaltyData.points.available.toLocaleString()}</p>
            <p className="text-[10px] text-green-600">Available</p>
          </div>
        </div>
        {loyaltyData.points.expiring > 0 && (
          <div className="mt-2 text-center text-[10px] text-red-500 bg-red-50 rounded-lg py-1">
            {loyaltyData.points.expiring.toLocaleString()} points expiring soon
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('points')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'points' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Points History
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'rewards' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Rewards
        </button>
        <button
          onClick={() => setActiveTab('tiers')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'tiers' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Tier Benefits
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[350px] overflow-y-auto custom-scroll">
        {activeTab === 'points' && (
          <div className="space-y-3">
            {loyaltyData.transactions.length === 0 ? (
              <div className="text-center py-8">
                <Gift size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No transactions yet</p>
                <p className="text-xs text-gray-400 mt-1">Complete purchases to earn points</p>
              </div>
            ) : (
              loyaltyData.transactions.map((transaction, idx) => (
                <div key={transaction.id || idx} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'earned' ? 'bg-green-100' : transaction.type === 'redeemed' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {transaction.type === 'earned' ? <TrendingUp size={14} className="text-green-600" /> :
                       transaction.type === 'redeemed' ? <Gift size={14} className="text-red-600" /> :
                       <Star size={14} className="text-blue-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-400">{transaction.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${
                    transaction.type === 'earned' ? 'text-green-600' : 
                    transaction.type === 'redeemed' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {transaction.type === 'earned' ? '+' : transaction.type === 'redeemed' ? '-' : '+'}{transaction.points}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-2 mb-2">
              <p className="text-xs text-blue-700 text-center">You have {loyaltyData.points.available.toLocaleString()} points available</p>
            </div>
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`border rounded-lg p-3 transition-all cursor-pointer ${getRewardColor(reward.color)} ${
                  selectedReward === reward.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => setSelectedReward(reward.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      {reward.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{reward.name}</h4>
                      <p className="text-xs opacity-75">{reward.points} points</p>
                    </div>
                  </div>
                  {reward.popular && (
                    <span className="text-[10px] bg-yellow-500 text-white px-2 py-0.5 rounded-full">Popular</span>
                  )}
                </div>
                <button 
                  disabled={loyaltyData.points.available < reward.points}
                  className={`mt-2 w-full py-1.5 text-xs font-medium rounded-lg transition-all ${
                    loyaltyData.points.available >= reward.points
                      ? 'bg-white text-primary-600 hover:bg-primary-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loyaltyData.points.available >= reward.points ? 'Redeem Now' : `Need ${reward.points - loyaltyData.points.available} more points`}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tiers' && (
          <div className="space-y-4">
            {/* Current Tier Progress */}
            {nextTier && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Crown size={16} className="text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">Current Tier: {loyaltyData.tier.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{loyaltyData.points.available.toLocaleString()} / {nextTier.minPoints.toLocaleString()} points</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {loyaltyData.tier.pointsToNext.toLocaleString()} more points to reach {loyaltyData.tier.nextTier}
                </p>
              </div>
            )}

            {/* All Tiers */}
            {tiers.map((tier, idx) => (
              <div key={tier.name} className={`rounded-lg p-3 ${currentTierIndex >= idx ? getTierColor(tier.color) : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {tier.icon}
                  <span className="text-sm font-semibold">{tier.name}</span>
                  {currentTierIndex >= idx && (
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  )}
                </div>
                <div className="space-y-1">
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle size={10} className={currentTierIndex >= idx ? 'opacity-100' : 'opacity-50'} />
                      <p className={`text-xs ${currentTierIndex >= idx ? 'opacity-100' : 'opacity-70'}`}>{benefit}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] mt-2 opacity-75">{tier.minPoints.toLocaleString()}+ points required</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>1 point = ₹0.10 value</span>
          <span>Points expire in 6 months</span>
        </div>
      </div>
    </div>
  )
}