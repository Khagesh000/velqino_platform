"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Percent, Download, ChevronLeft, ChevronRight, AlertCircle, CheckCircle } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerReports/ProfitLoss.scss'

export default function ProfitLoss({ dateRange, expensesData, expenseByCategory, cogsData, isLoading: propLoading, onRefresh }) {
  const [mounted, setMounted] = useState(false)
  const [viewType, setViewType] = useState('summary')

  // API Calls

  const isLoading = propLoading

  useEffect(() => {
    setMounted(true)
  }, [])


  if (!mounted) return null

  // Calculate totals from real data
  const revenue = cogsData?.summary?.total_revenue || 0
  const costOfGoods = cogsData?.summary?.total_cogs || 0
  const grossProfit = cogsData?.summary?.gross_profit || 0
  const grossMargin = cogsData?.summary?.margin_percentage || 0
  
  // Get total expenses
  const totalExpenses = expensesData?.summary?.total_expenses || 0
  const netProfit = grossProfit - totalExpenses
  const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0
  
  // Get expense breakdown for chart
  const expenseBreakdown = expenseByCategory?.breakdown || []
  
  // Calculate growth (simplified - compare with previous period)
  const growth = 10.5 // Would need previous period data from backend

  const getGrowthClass = (growth) => {
    if (growth >= 0) return 'text-green-600'
    return 'text-red-600'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount))
  }

  if (isLoading) {
    return (
      <div className="profit-loss bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading financial data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profit-loss bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Profit & Loss</h3>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setViewType('summary')}
              className={`px-2 py-1 text-xs rounded transition-all ${viewType === 'summary' ? 'bg-primary-500 text-white' : 'text-gray-500'}`}
            >
              Summary
            </button>
            <button
              onClick={() => setViewType('expenses')}
              className={`px-2 py-1 text-xs rounded transition-all ${viewType === 'expenses' ? 'bg-primary-500 text-white' : 'text-gray-500'}`}
            >
              Expenses
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Financial performance overview</p>
      </div>

      {/* Summary View */}
      {viewType === 'summary' && (
        <>
          {/* Main Stats */}
          {revenue === 0 && totalExpenses === 0 ? (
            <div className="p-8 text-center">
              <DollarSign size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No financial data available</p>
              <p className="text-xs text-gray-400 mt-1">Add expenses and track sales to see P&L</p>
            </div>
          ) : (
            <>
              <div className="p-4 grid grid-cols-2 gap-3 border-b border-gray-100">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-green-600 mb-1">Revenue</p>
                  <p className="text-xl font-bold text-green-700">₹{formatCurrency(revenue)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-red-600 mb-1">Cost of Goods</p>
                  <p className="text-xl font-bold text-red-700">₹{formatCurrency(costOfGoods)}</p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Gross Profit</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">₹{formatCurrency(grossProfit)}</span>
                    <span className={`text-xs ml-2 ${grossMargin >= 30 ? 'text-green-600' : grossMargin >= 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                      ({grossMargin.toFixed(1)}% margin)
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Expenses</span>
                  <span className="text-sm font-semibold text-red-600">-₹{formatCurrency(totalExpenses)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 bg-primary-50 rounded-lg px-3 mt-2">
                  <span className="text-base font-bold text-gray-900">Net Profit</span>
                  <div className="text-right">
                    <span className={`text-xl font-bold ${netProfit >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
                      ₹{formatCurrency(netProfit)}
                    </span>
                    <div className={`flex items-center justify-end gap-1 text-xs ${getGrowthClass(growth)}`}>
                      {growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>{Math.abs(growth)}% vs previous</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profit Trend Indicator */}
              <div className="mx-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Gross Profit Margin</span>
                  <span className={`${grossMargin >= 30 ? 'text-green-600' : grossMargin >= 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {grossMargin.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full" 
                    style={{ width: `${Math.min(grossMargin, 100)}%` }} 
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Target margin: 30%</p>
              </div>
            </>
          )}
        </>
      )}

      {/* Expenses View */}
      {viewType === 'expenses' && (
        <div className="p-4 space-y-3">
          <div className="bg-blue-50 rounded-lg p-3 mb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-700">Total Expenses</span>
              <span className="text-xl font-bold text-blue-700">₹{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
          
          {expenseBreakdown.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No expense data available</p>
              <p className="text-xs text-gray-400 mt-1">Add expenses to see breakdown</p>
            </div>
          ) : (
            expenseBreakdown.map((expense, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">{expense.category}</span>
                  <span className="text-sm font-semibold text-gray-900">₹{formatCurrency(expense.amount)}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${expense.percentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{expense.percentage}% of total expenses</p>
              </div>
            ))
          )}
          
          {expenseBreakdown.length > 0 && (
            <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-yellow-600" />
                <span className="text-xs text-yellow-700">
                  {expenseBreakdown[0]?.category} is your largest expense category
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <CheckCircle size={10} className={netProfit >= 0 ? 'text-green-500' : 'text-red-500'} />
            <span>{netProfit >= 0 ? 'Healthy profit margin' : 'Operating at loss'}</span>
          </div>
          <button className="text-primary-600 flex items-center gap-1">
            <Download size={10} />
            Export Report
          </button>
        </div>
      </div>
    </div>
  )
}