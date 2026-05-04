"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Percent, Download, ChevronLeft, ChevronRight, AlertCircle, CheckCircle } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerReports/ProfitLoss.scss'

export default function ProfitLoss({ dateRange }) {
  const [mounted, setMounted] = useState(false)
  const [viewType, setViewType] = useState('summary')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const profitLossData = {
    day: {
      revenue: 28940,
      cost: 17364,
      grossProfit: 11576,
      expenses: 3450,
      netProfit: 8126,
      margin: 28.1,
      previousProfit: 7350,
      growth: 10.6
    },
    week: {
      revenue: 123900,
      cost: 74340,
      grossProfit: 49560,
      expenses: 15200,
      netProfit: 34360,
      margin: 27.7,
      previousProfit: 31200,
      growth: 10.1
    },
    month: {
      revenue: 206600,
      cost: 123960,
      grossProfit: 82640,
      expenses: 25800,
      netProfit: 56840,
      margin: 27.5,
      previousProfit: 51200,
      growth: 11.0
    },
    quarter: {
      revenue: 551600,
      cost: 330960,
      grossProfit: 220640,
      expenses: 68400,
      netProfit: 152240,
      margin: 27.6,
      previousProfit: 137500,
      growth: 10.7
    },
    year: {
      revenue: 2441600,
      cost: 1464960,
      grossProfit: 976640,
      expenses: 298000,
      netProfit: 678640,
      margin: 27.8,
      previousProfit: 612000,
      growth: 10.9
    }
  }

  const data = profitLossData[dateRange] || profitLossData.month

  const expenseBreakdown = [
    { category: 'Rent', amount: 8500, percentage: 33 },
    { category: 'Staff Salary', amount: 12000, percentage: 46 },
    { category: 'Utilities', amount: 2800, percentage: 11 },
    { category: 'Marketing', amount: 2500, percentage: 10 },
  ]

  const getGrowthClass = (growth) => {
    if (growth >= 0) return 'text-green-600'
    return 'text-red-600'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount)
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
          <div className="p-4 grid grid-cols-2 gap-3 border-b border-gray-100">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xs text-green-600 mb-1">Revenue</p>
              <p className="text-xl font-bold text-green-700">₹{formatCurrency(data.revenue)}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-xs text-red-600 mb-1">Cost of Goods</p>
              <p className="text-xl font-bold text-red-700">₹{formatCurrency(data.cost)}</p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Gross Profit</span>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">₹{formatCurrency(data.grossProfit)}</span>
                <span className="text-xs text-green-600 ml-2">({data.margin}% margin)</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Expenses</span>
              <span className="text-sm font-semibold text-red-600">-₹{formatCurrency(data.expenses)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 bg-primary-50 rounded-lg px-3 mt-2">
              <span className="text-base font-bold text-gray-900">Net Profit</span>
              <div className="text-right">
                <span className="text-xl font-bold text-primary-600">₹{formatCurrency(data.netProfit)}</span>
                <div className={`flex items-center justify-end gap-1 text-xs ${getGrowthClass(data.growth)}`}>
                  {data.growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{Math.abs(data.growth)}% vs previous</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profit Trend Indicator */}
          <div className="mx-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Profit Margin Trend</span>
              <span className="text-green-600">+2.3% this period</span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${data.margin}%` }} />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Target margin: 30%</p>
          </div>
        </>
      )}

      {/* Expenses View */}
      {viewType === 'expenses' && (
        <div className="p-4 space-y-3">
          <div className="bg-blue-50 rounded-lg p-3 mb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-700">Total Expenses</span>
              <span className="text-xl font-bold text-blue-700">₹{formatCurrency(data.expenses)}</span>
            </div>
          </div>
          
          {expenseBreakdown.map((expense, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{expense.category}</span>
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
          ))}
          
          <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-yellow-600" />
              <span className="text-xs text-yellow-700">Staff salary is your largest expense</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <CheckCircle size={10} className="text-green-500" />
            <span>Healthy profit margin</span>
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