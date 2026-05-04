"use client"

import React, { useState, useEffect } from 'react'
import { Target, ChevronLeft,  ChevronRight, AlertCircle, CheckCircle, Edit, Save, X, Calendar, Download } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerExpenses/BudgetTracking.scss'

export default function BudgetTracking({ refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [editingBudget, setEditingBudget] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [showSetBudgetModal, setShowSetBudgetModal] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const budgetData = [
    { category: 'Rent', budget: 15000, actual: 15000, icon: '🏢', color: 'blue' },
    { category: 'Staff Salary', budget: 25000, actual: 25000, icon: '👥', color: 'purple' },
    { category: 'Electricity', budget: 4000, actual: 3500, icon: '⚡', color: 'yellow' },
    { category: 'Marketing', budget: 8000, actual: 5000, icon: '📢', color: 'pink' },
    { category: 'Supplies', budget: 5000, actual: 4000, icon: '📦', color: 'orange' },
    { category: 'Internet', budget: 2000, actual: 1500, icon: '🌐', color: 'green' },
    { category: 'Maintenance', budget: 3000, actual: 0, icon: '🔧', color: 'gray' },
  ]

  const totalBudget = budgetData.reduce((sum, cat) => sum + cat.budget, 0)
  const totalActual = budgetData.reduce((sum, cat) => sum + cat.actual, 0)
  const variance = totalBudget - totalActual
  const variancePercentage = (variance / totalBudget) * 100
  const overallUtilization = (totalActual / totalBudget) * 100

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', progress: 'bg-blue-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', progress: 'bg-purple-500' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', progress: 'bg-yellow-500' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200', progress: 'bg-pink-500' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', progress: 'bg-orange-500' },
      green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', progress: 'bg-green-500' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', progress: 'bg-gray-500' },
    }
    return colors[color] || colors.gray
  }

  const handleEditBudget = (category) => {
    setEditingBudget(category)
    setEditValue(category.budget.toString())
  }

  const handleSaveBudget = () => {
    if (editingBudget && editValue) {
      // Save budget logic here
      setEditingBudget(null)
      setEditValue('')
    }
  }

  const handleSetMonthlyBudget = () => {
    setShowSetBudgetModal(true)
  }

  return (
    <div className="budget-tracking bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Budget Tracking</h3>
          </div>
          <button onClick={handleSetMonthlyBudget} className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
            <Calendar size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Monthly budget vs actual spending</p>
      </div>

      {/* Month Selector */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm font-medium text-gray-700 flex-1 text-center">
            {months[selectedMonth]} {selectedYear}
          </span>
          <button
            onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 grid grid-cols-3 gap-2 border-b border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500">Total Budget</p>
          <p className="text-lg font-bold text-gray-900">₹{totalBudget.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Actual Spend</p>
          <p className="text-lg font-bold text-orange-600">₹{totalActual.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Remaining</p>
          <p className={`text-lg font-bold ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{Math.abs(variance).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">Overall Budget Utilization</span>
          <span className={`font-semibold ${overallUtilization > 100 ? 'text-red-600' : 'text-green-600'}`}>
            {overallUtilization.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${overallUtilization > 100 ? 'bg-red-500' : 'bg-primary-500'}`}
            style={{ width: `${Math.min(overallUtilization, 100)}%` }}
          />
        </div>
        {variancePercentage > 0 && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-green-600">
            <CheckCircle size={10} />
            <span>Under budget by {variancePercentage.toFixed(1)}%</span>
          </div>
        )}
        {variancePercentage < 0 && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-red-600">
            <AlertCircle size={10} />
            <span>Over budget by {Math.abs(variancePercentage).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* Category-wise Budget List */}
      <div className="p-4 max-h-[280px] overflow-y-auto custom-scroll">
        <div className="space-y-3">
          {budgetData.map((category) => {
            const colors = getColorClasses(category.color)
            const utilization = (category.actual / category.budget) * 100
            const isOverBudget = category.actual > category.budget
            const isEditing = editingBudget?.category === category.category

            return (
              <div key={category.category} className={`border rounded-lg p-3 ${colors.border}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center text-lg`}>
                      {category.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{category.category}</h4>
                      {isEditing ? (
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24 px-2 py-1 text-xs border border-gray-200 rounded-lg"
                            autoFocus
                          />
                          <button onClick={handleSaveBudget} className="p-1 text-green-500 hover:bg-green-50 rounded">
                            <Save size={12} />
                          </button>
                          <button onClick={() => setEditingBudget(null)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">Budget: ₹{category.budget.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                      ₹{category.actual.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleEditBudget(category)}
                      className="p-1 text-gray-400 hover:text-primary-600 rounded-lg"
                    >
                      <Edit size={10} />
                    </button>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-gray-500">Utilization</span>
                    <span className={isOverBudget ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {utilization.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : colors.progress}`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                </div>

                {isOverBudget && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-red-600">
                    <AlertCircle size={10} />
                    <span>Over budget by ₹{(category.actual - category.budget).toLocaleString()}</span>
                  </div>
                )}
                {!isOverBudget && category.budget - category.actual > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-green-600">
                    <CheckCircle size={10} />
                    <span>Under budget by ₹{(category.budget - category.actual).toLocaleString()}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Set Budget Modal */}
      {showSetBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Set Monthly Budget</h3>
              </div>
              <button onClick={() => setShowSetBudgetModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  {months.map((month, idx) => (
                    <option key={month} value={idx}>{month} {selectedYear}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Type</label>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 text-sm font-medium bg-primary-500 text-white rounded-lg">Copy Last Month</button>
                  <button className="flex-1 py-2 text-sm font-medium border border-gray-200 rounded-lg">Set Custom</button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-700">Last month total budget: ₹{totalBudget.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowSetBudgetModal(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSetBudgetModal(false)
                  alert('Budget set successfully')
                }}
                className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
              >
                Set Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}