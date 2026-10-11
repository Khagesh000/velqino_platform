"use client"

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, Target, Award, Star, 
  Calendar, Eye, Download, ChevronLeft, ChevronRight, 
  Gift, Trophy, Zap, Sparkles 
} from '../../../../utils/icons'

export default function StaffPerformance({ selectedStaff }) {
  const [mounted, setMounted] = useState(false)
  const [period, setPeriod] = useState('month')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const itemsPerPage = 3

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const staffPerformance = [
    { id: 1, name: 'Rajesh Kumar', role: 'Store Manager', sales: 456000, target: 500000, achievement: 91, orders: 128, avgValue: 3562, incentives: 5000, commission: 4500, rating: 4.8 },
    { id: 2, name: 'Priya Sharma', role: 'Sales Associate', sales: 389000, target: 400000, achievement: 97, orders: 112, avgValue: 3473, incentives: 3500, commission: 3890, rating: 4.9 },
    { id: 3, name: 'Vikram Mehta', role: 'Sales Associate', sales: 512000, target: 500000, achievement: 102, orders: 145, avgValue: 3531, incentives: 5500, commission: 5120, rating: 5.0 },
    { id: 4, name: 'Amit Singh', role: 'Cashier', sales: 0, target: 0, achievement: 0, orders: 156, avgValue: 0, incentives: 0, commission: 0, rating: 4.5 },
    { id: 5, name: 'Sneha Reddy', role: 'Stock Clerk', sales: 0, target: 0, achievement: 0, orders: 0, avgValue: 0, incentives: 0, commission: 0, rating: 4.7 },
  ]

  const filteredPerformance = selectedStaff 
    ? staffPerformance.filter(s => s.id === selectedStaff.id)
    : staffPerformance

  const totalPages = Math.ceil(filteredPerformance.length / itemsPerPage)
  const paginatedPerformance = filteredPerformance.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const summary = {
    totalSales: staffPerformance.reduce((sum, s) => sum + s.sales, 0),
    avgAchievement: (staffPerformance.filter(s => s.achievement > 0).reduce((sum, s) => sum + s.achievement, 0) / (staffPerformance.filter(s => s.achievement > 0).length || 1)).toFixed(1),
    topPerformer: staffPerformance.reduce((max, s) => s.sales > max.sales ? s : max, staffPerformance[0]),
    totalIncentives: staffPerformance.reduce((sum, s) => sum + s.incentives + s.commission, 0)
  }

  const getAchievementBadge = (achievement) => {
    if (achievement >= 100) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (achievement >= 85) return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-rose-50 text-rose-700 border-rose-200'
  }

  const getRankBadge = (index) => {
    if (index === 0) return { icon: <Trophy size={13} className="text-amber-500 fill-amber-500" />, label: 'Rank #1' }
    if (index === 1) return { icon: <Award size={13} className="text-slate-500" />, label: 'Rank #2' }
    if (index === 2) return { icon: <Star size={13} className="text-amber-600" />, label: 'Rank #3' }
    return null
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Sales Quota &amp; Efficiency</h3>
                  {selectedStaff && (
                    <span className="text-[11px] font-bold bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-0.5 rounded-full">
                      {selectedStaff.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Individual revenue output, quota paces, and commission rewards</p>
              </div>
            </div>

            {/* Period Selector Pills */}
            <div className="flex bg-gray-100 p-0.5 rounded-xl text-[11px] font-bold">
              {[
                { id: 'week', label: 'Week' },
                { id: 'month', label: 'Month' },
                { id: 'quarter', label: 'Quarter' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriod(p.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    period === p.id 
                      ? 'bg-white text-gray-900 shadow-2xs' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 KPI Summary Ribbon */}
        <div className="grid grid-cols-4 gap-2.5 p-3.5 bg-gray-50/60 border-b border-gray-100 text-center">
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-emerald-700">Team Volume</p>
            <p className="text-base font-extrabold text-emerald-800 mt-0.5">₹{(summary.totalSales / 100000).toFixed(1)}L</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-indigo-600">Quota Pace</p>
            <p className="text-base font-extrabold text-indigo-700 mt-0.5">{summary.avgAchievement}%</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-amber-600">Top Rep</p>
            <p className="text-base font-extrabold text-amber-700 mt-0.5 truncate">{summary.topPerformer?.name?.split(' ')[0]}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-purple-600">Incentives</p>
            <p className="text-base font-extrabold text-purple-700 mt-0.5">₹{summary.totalIncentives.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Performance Cards List */}
        <div className="p-4 sm:p-5 max-h-[350px] overflow-y-auto space-y-3">
          {paginatedPerformance.map((staff, idx) => {
            const rank = getRankBadge(idx)
            const achievementBadge = getAchievementBadge(staff.achievement)
            const progress = staff.target > 0 ? Math.min((staff.sales / staff.target) * 100, 100) : 0

            return (
              <div
                key={staff.id}
                onMouseEnter={() => setHoveredRow(staff.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  hoveredRow === staff.id 
                    ? 'border-primary-300 bg-gray-50/60 shadow-xs' 
                    : 'border-gray-200/80 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0 border border-indigo-100">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">{staff.name}</h4>
                        {rank && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
                            {rank.icon}
                            {rank.label}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400">{staff.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${achievementBadge}`}>
                      {staff.achievement > 0 ? `${staff.achievement}% of Target` : 'Non-Sales Role'}
                    </span>
                    <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                      ₹{staff.sales.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                {staff.target > 0 && (
                  <div className="space-y-1 mb-2">
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>Quota target: ₹{staff.target.toLocaleString('en-IN')}</span>
                      <span className="font-bold text-gray-700">{progress.toFixed(0)}% reached</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          staff.achievement >= 100 ? 'bg-emerald-500' : 'bg-primary-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submetrics row */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                  <span>{staff.orders} bills billed</span>
                  <span>Incentives: <strong className="text-emerald-700">₹{(staff.incentives + staff.commission).toLocaleString('en-IN')}</strong></span>
                  <span className="inline-flex items-center gap-0.5 font-bold text-amber-700">
                    <Star size={10} className="fill-amber-500 text-amber-500" />
                    {staff.rating} / 5.0
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3.5 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-xs text-gray-400">
            {filteredPerformance.length} team quotas
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-40 rounded-xl"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-40 rounded-xl"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
