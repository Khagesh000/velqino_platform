"use client"

import React, { useState, useEffect } from 'react'
import { Users, TrendingUp, TrendingDown, Calendar, Clock, BarChart2, PieChart, ArrowUp, ArrowDown, UserPlus, UserCheck } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerCustomers/WalkInTracker.scss'

export default function WalkInTracker() {
  const [mounted, setMounted] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [hoveredBar, setHoveredBar] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Mock footfall data
  const dailyFootfall = {
    week: [
      { day: 'Mon', new: 12, returning: 18, total: 30 },
      { day: 'Tue', new: 15, returning: 22, total: 37 },
      { day: 'Wed', new: 18, returning: 25, total: 43 },
      { day: 'Thu', new: 20, returning: 28, total: 48 },
      { day: 'Fri', new: 25, returning: 32, total: 57 },
      { day: 'Sat', new: 30, returning: 35, total: 65 },
      { day: 'Sun', new: 22, returning: 28, total: 50 },
    ],
    month: [
      { day: 'Week 1', new: 85, returning: 120, total: 205 },
      { day: 'Week 2', new: 92, returning: 135, total: 227 },
      { day: 'Week 3', new: 78, returning: 140, total: 218 },
      { day: 'Week 4', new: 95, returning: 150, total: 245 },
    ]
  }

  const currentData = dailyFootfall[selectedPeriod]
  const totalFootfall = currentData.reduce((sum, d) => sum + d.total, 0)
  const totalNew = currentData.reduce((sum, d) => sum + d.new, 0)
  const totalReturning = currentData.reduce((sum, d) => sum + d.returning, 0)
  const newPercentage = (totalNew / totalFootfall) * 100
  const returningPercentage = (totalReturning / totalFootfall) * 100

  const hourlyData = [
    { hour: '10 AM', count: 12 },
    { hour: '11 AM', count: 18 },
    { hour: '12 PM', count: 25 },
    { hour: '1 PM', count: 22 },
    { hour: '2 PM', count: 20 },
    { hour: '3 PM', count: 28 },
    { hour: '4 PM', count: 32 },
    { hour: '5 PM', count: 35 },
    { hour: '6 PM', count: 30 },
    { hour: '7 PM', count: 24 },
  ]

  const maxHourlyCount = Math.max(...hourlyData.map(h => h.count))

  const getTrend = () => {
    const prevWeekTotal = 280
    const change = ((totalFootfall - prevWeekTotal) / prevWeekTotal) * 100
    return { value: Math.abs(change).toFixed(1), isUp: change > 0 }
  }

  const trend = getTrend()

  return (
    <div className="walkin-tracker bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Walk-in Tracker</h3>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${selectedPeriod === 'week' ? 'bg-primary-500 text-white' : 'text-gray-600'}`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${selectedPeriod === 'month' ? 'bg-primary-500 text-white' : 'text-gray-600'}`}
            >
              Month
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Track daily customer footfall</p>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-3 gap-3 border-b border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{totalFootfall}</p>
          <p className="text-[10px] text-gray-500">Total Visitors</p>
          <div className={`flex items-center justify-center gap-1 mt-1 text-xs ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
            <span>{trend.value}%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{totalNew}</p>
          <p className="text-[10px] text-gray-500">New Customers</p>
          <p className="text-[10px] text-green-600 mt-1">{newPercentage.toFixed(0)}%</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{totalReturning}</p>
          <p className="text-[10px] text-gray-500">Returning</p>
          <p className="text-[10px] text-blue-600 mt-1">{returningPercentage.toFixed(0)}%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={12} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-700">Daily Footfall Trend</span>
        </div>
        <div className="h-48 relative">
          <div className="flex h-full items-end gap-2">
            {currentData.map((item, idx) => {
              const maxTotal = Math.max(...currentData.map(d => d.total))
              const height = (item.total / maxTotal) * 100
              const newHeight = (item.new / item.total) * height
              const returningHeight = height - newHeight
              
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full relative group cursor-pointer"
                    style={{ height: `${height}%` }}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-green-500 rounded-t transition-all duration-300"
                      style={{ height: `${newHeight}%` }}
                    />
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t transition-all duration-300"
                      style={{ height: `${returningHeight}%`, top: `${newHeight}%` }}
                    />
                    
                    {/* Tooltip */}
                    {hoveredBar === idx && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-10 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <span>Total: {item.total}</span>
                          <span className="text-green-400">New: {item.new}</span>
                          <span className="text-blue-400">Return: {item.returning}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">{item.day}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-[10px] text-gray-500">New</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-[10px] text-gray-500">Returning</span>
          </div>
        </div>
      </div>

      {/* Hourly Distribution */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={12} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-700">Peak Hours</span>
        </div>
        <div className="space-y-2">
          {hourlyData.slice(0, 6).map((hour, idx) => {
            const barWidth = (hour.count / maxHourlyCount) * 100
            return (
              <div key={hour.hour} className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 w-12">{hour.hour}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 w-8">{hour.count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* New vs Returning Chart */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <PieChart size={12} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-700">Customer Composition</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Donut Chart */}
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
              <circle 
                cx="50" cy="50" r="40" fill="none" 
                stroke="#22c55e" strokeWidth="15" 
                strokeDasharray={`${newPercentage * 2.51} 251`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              <circle 
                cx="50" cy="50" r="40" fill="none" 
                stroke="#3b82f6" strokeWidth="15" 
                strokeDasharray={`${returningPercentage * 2.51} 251`}
                strokeDashoffset={-newPercentage * 2.51}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">{totalFootfall}</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-600">New</span>
              </div>
              <span className="text-xs font-semibold text-gray-900">{totalNew}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-xs text-gray-600">Returning</span>
              </div>
              <span className="text-xs font-semibold text-gray-900">{totalReturning}</span>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Conversion Rate</span>
                <span className="text-xs font-semibold text-green-600">{((totalNew / totalFootfall) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={10} />
            <span>Last updated: Today</span>
          </div>
          <div className="flex items-center gap-1">
            <UserPlus size={10} />
            <span>+{Math.floor(totalNew / 7)} avg daily new</span>
          </div>
        </div>
      </div>
    </div>
  )
}