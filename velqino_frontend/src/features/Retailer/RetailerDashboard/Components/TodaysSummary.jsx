"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Clock, Package, Users, CreditCard, Wallet, Calendar, ArrowUpRight, ArrowDownRight } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerDashboard/TodaysSummary.scss'

export default function TodaysSummary() {
  const [mounted, setMounted] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const summaryData = {
    totalTransactions: 24,
    averageBill: 1037,
    busiestHour: '6:00 PM - 7:00 PM',
    busiestHourSales: 7200,
    totalItems: 86,
    uniqueCustomers: 18,
    peakHourCustomers: 12,
    revenue: 24890,
    target: 25000,
    paymentMethods: {
      upi: 12,
      card: 7,
      cash: 3,
      wallet: 2
    },
    hourlyBreakdown: [
      { hour: '10 AM', transactions: 2, amount: 1250 },
      { hour: '11 AM', transactions: 3, amount: 2100 },
      { hour: '12 PM', transactions: 4, amount: 3100 },
      { hour: '1 PM', transactions: 3, amount: 2850 },
      { hour: '2 PM', transactions: 2, amount: 1750 },
      { hour: '3 PM', transactions: 3, amount: 2450 },
      { hour: '4 PM', transactions: 4, amount: 3980 },
      { hour: '5 PM', transactions: 5, amount: 4520 },
      { hour: '6 PM', transactions: 6, amount: 5240 },
      { hour: '7 PM', transactions: 4, amount: 3680 },
    ]
  }

  const revenuePercent = (summaryData.revenue / summaryData.target) * 100
  const peakHourIndex = summaryData.hourlyBreakdown.reduce((max, h, i) => h.amount > summaryData.hourlyBreakdown[max].amount ? i : max, 0)
  const peakHour = summaryData.hourlyBreakdown[peakHourIndex]

  return (
    <div className="todays-summary bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Calendar size={18} className="text-primary-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Today's Summary</h3>
            <p className="text-xs text-gray-500 mt-0.5">Daily performance overview</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            Updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div 
          className="stat-card bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-3 text-white transition-all hover:shadow-lg"
          onMouseEnter={() => setHoveredCard('revenue')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <p className="text-[11px] text-primary-100 mb-1">Total Revenue</p>
          <p className="text-xl font-bold">₹{summaryData.revenue.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight size={12} className="text-primary-200" />
            <span className="text-[10px] text-primary-200">+8.2% vs yesterday</span>
          </div>
          <div className="mt-2 h-1 bg-primary-400 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${revenuePercent}%` }} />
          </div>
          <p className="text-[10px] text-primary-200 mt-1">Target: ₹{summaryData.target.toLocaleString()}</p>
        </div>

        <div 
          className="bg-green-50 rounded-xl p-3 transition-all hover:shadow-md hover:-translate-y-0.5"
          onMouseEnter={() => setHoveredCard('transactions')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <p className="text-[11px] text-green-600 font-medium mb-1">Transactions</p>
          <p className="text-xl font-bold text-green-700">{summaryData.totalTransactions}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} className="text-green-500" />
            <span className="text-[10px] text-green-600">+3 vs yesterday</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-2">Peak: {peakHour.hour}</p>
        </div>

        <div 
          className="bg-blue-50 rounded-xl p-3 transition-all hover:shadow-md hover:-translate-y-0.5"
          onMouseEnter={() => setHoveredCard('average')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <p className="text-[11px] text-blue-600 font-medium mb-1">Avg. Bill Value</p>
          <p className="text-xl font-bold text-blue-700">₹{summaryData.averageBill.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} className="text-blue-500" />
            <span className="text-[10px] text-blue-600">+5.2% increase</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-2">Higher than avg</p>
        </div>

        <div 
          className="bg-purple-50 rounded-xl p-3 transition-all hover:shadow-md hover:-translate-y-0.5"
          onMouseEnter={() => setHoveredCard('customers')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <p className="text-[11px] text-purple-600 font-medium mb-1">Unique Customers</p>
          <p className="text-xl font-bold text-purple-700">{summaryData.uniqueCustomers}</p>
          <div className="flex items-center gap-1 mt-1">
            <Users size={12} className="text-purple-500" />
            <span className="text-[10px] text-purple-600">{summaryData.peakHourCustomers} at peak hour</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-2">Total items: {summaryData.totalItems}</p>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="mb-5">
        <p className="text-xs font-medium text-gray-700 mb-2">Payment Methods</p>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-gray-50 rounded-lg transition-all hover:bg-primary-50">
            <CreditCard size={16} className="mx-auto text-gray-500 mb-1" />
            <p className="text-sm font-bold text-gray-700">{summaryData.paymentMethods.upi}</p>
            <p className="text-[10px] text-gray-500">UPI</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg transition-all hover:bg-primary-50">
            <CreditCard size={16} className="mx-auto text-gray-500 mb-1" />
            <p className="text-sm font-bold text-gray-700">{summaryData.paymentMethods.card}</p>
            <p className="text-[10px] text-gray-500">Card</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg transition-all hover:bg-primary-50">
            <Wallet size={16} className="mx-auto text-gray-500 mb-1" />
            <p className="text-sm font-bold text-gray-700">{summaryData.paymentMethods.cash}</p>
            <p className="text-[10px] text-gray-500">Cash</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg transition-all hover:bg-primary-50">
            <CreditCard size={16} className="mx-auto text-gray-500 mb-1" />
            <p className="text-sm font-bold text-gray-700">{summaryData.paymentMethods.wallet}</p>
            <p className="text-[10px] text-gray-500">Wallet</p>
          </div>
        </div>
      </div>

      {/* Hourly Peak Indicator */}
      <div className="bg-amber-50 rounded-xl p-3 mb-5 border border-amber-100">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={14} className="text-amber-600" />
          <span className="text-xs font-semibold text-amber-700">Busiest Hour</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-amber-800">{summaryData.busiestHour}</p>
            <p className="text-[10px] text-amber-600 mt-0.5">Peak sales period</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-amber-800">₹{summaryData.busiestHourSales.toLocaleString()}</p>
            <p className="text-[10px] text-amber-600">Revenue in peak hour</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }} />
          </div>
          <span className="text-[10px] text-amber-600">65% of daily target</span>
        </div>
      </div>

      {/* Top Performing Hour */}
      <div className="bg-green-50 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={14} className="text-green-600" />
          <span className="text-xs font-semibold text-green-700">Top Performing Hour</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-green-800">{peakHour.hour}</p>
            <p className="text-[10px] text-green-600 mt-0.5">{peakHour.transactions} transactions</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-green-800">₹{peakHour.amount.toLocaleString()}</p>
            <p className="text-[10px] text-green-600">Highest revenue</p>
          </div>
        </div>
      </div>
    </div>
  )
}