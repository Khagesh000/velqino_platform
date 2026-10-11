"use client"

import React, { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownRight } from '../../../../utils/icons'

export default function ProfitLoss({ 
  dateRange = 'month', 
  expensesData, 
  expenseByCategory, 
  cogsData, 
  kpisData, 
  isLoading, 
  onRefresh 
}) {
  const [mounted, setMounted] = useState(false)
  const [viewType, setViewType] = useState('statement')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate or extract financial figures from consolidated data
  const revenue = kpisData?.gross_sales ?? cogsData?.summary?.total_revenue ?? 0
  const costOfGoods = kpisData?.total_cogs ?? cogsData?.summary?.total_cogs ?? 0
  const grossProfit = kpisData?.gross_profit ?? cogsData?.summary?.gross_profit ?? (revenue - costOfGoods)
  const grossMargin = kpisData?.gross_margin_pct ?? cogsData?.summary?.margin_percentage ?? (revenue > 0 ? (grossProfit / revenue) * 100 : 0)

  const totalExpenses = kpisData?.total_expenses ?? expensesData?.summary?.total_expenses ?? expensesData?.total_expenses ?? 0
  const netProfit = kpisData?.net_profit ?? (grossProfit - totalExpenses)
  const netMargin = kpisData?.net_margin_pct ?? (revenue > 0 ? (netProfit / revenue) * 100 : 0)

  // Breakdown by category
  const expenseBreakdown = expenseByCategory?.breakdown || expensesData?.by_category?.breakdown || []

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount || 0))
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[380px]">
        <div className="animate-spin rounded-full h-9 w-9 border-2 border-primary-500 border-t-transparent" />
        <p className="text-xs font-medium text-gray-500 mt-3">Loading financial ledger...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 flex flex-col h-full overflow-hidden transition-all duration-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <DollarSign size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Profit & Loss Statement</h3>
            <p className="text-xs text-gray-400 mt-0.5">Comprehensive income, operating costs & net margin</p>
          </div>
        </div>
        <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setViewType('statement')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewType === 'statement' 
                ? 'bg-white text-gray-900 shadow-xs' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Statement
          </button>
          <button
            onClick={() => setViewType('expenses')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewType === 'expenses' 
                ? 'bg-white text-gray-900 shadow-xs' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Expenses ({expenseBreakdown.length})
          </button>
        </div>
      </div>

      {/* Net Profit Banner */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Net Operating Profit</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <p className={`text-2xl font-black tracking-tight ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ₹{formatCurrency(netProfit)}
            </p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              netProfit >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {netMargin.toFixed(1)}% Net Margin
            </span>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            {netProfit >= 0 ? (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle size={14} /> Profitable Period
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-600 font-medium">
                <AlertCircle size={14} /> Net Loss
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Based on active ledger</p>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 overflow-y-auto max-h-[300px]">
        {viewType === 'statement' ? (
          <div className="space-y-3 text-xs sm:text-sm">
            {/* 1. Gross Revenue */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">1. Gross Revenue (Total Sales)</span>
              <span className="font-bold text-gray-900">₹{formatCurrency(revenue)}</span>
            </div>

            {/* 2. COGS */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100 text-rose-600">
              <span className="font-medium">2. Less: Cost of Goods Sold (COGS)</span>
              <span className="font-semibold">-₹{formatCurrency(costOfGoods)}</span>
            </div>

            {/* 3. Gross Profit */}
            <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
              <div>
                <span className="font-bold text-gray-900 block">Gross Profit</span>
                <span className="text-[11px] text-gray-400">Gross Margin: {Number(grossMargin).toFixed(1)}%</span>
              </div>
              <span className="text-base font-bold text-gray-900">₹{formatCurrency(grossProfit)}</span>
            </div>

            {/* 4. Operating Expenses */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100 text-rose-600">
              <span className="font-medium">4. Less: Operating Expenses</span>
              <span className="font-semibold">-₹{formatCurrency(totalExpenses)}</span>
            </div>

            {/* 5. Net Profit Highlight */}
            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
              netProfit >= 0 
                ? 'bg-emerald-50/60 border-emerald-100 text-emerald-950' 
                : 'bg-rose-50/60 border-rose-100 text-rose-950'
            }`}>
              <span className="font-bold text-sm">Bottom Line: Net Profit</span>
              <span className={`text-lg font-black ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ₹{formatCurrency(netProfit)}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {expenseBreakdown.length === 0 ? (
              <div className="text-center py-10">
                <DollarSign size={28} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs font-medium text-gray-500">No categorized expenses recorded in this period</p>
              </div>
            ) : (
              expenseBreakdown.map((exp, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800 capitalize">{exp.category}</span>
                    <span className="font-bold text-gray-900">₹{formatCurrency(exp.amount)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, exp.percentage || 0)}%` }} 
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>{exp.percentage}% of operating expenses</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer Info Ribbon */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-[11px] text-gray-500">
        <span>Operating Health Status</span>
        <span className={`font-semibold ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {netProfit >= 0 ? '✓ Operations Generating Positive Net Return' : '⚠ Expenses Exceed Gross Profit Margin'}
        </span>
      </div>
    </div>
  )
}