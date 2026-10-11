"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Target, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, 
  Edit, Save, X, Calendar 
} from '../../../../utils/icons'

export default function BudgetTracking({ refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [editingCategory, setEditingCategory] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [showSetBudgetModal, setShowSetBudgetModal] = useState(false)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const [budgetData, setBudgetData] = useState([
    { category: 'Rent', budget: 15000, actual: 15000, icon: '🏢', color: 'indigo' },
    { category: 'Staff Salary', budget: 25000, actual: 25000, icon: '👥', color: 'purple' },
    { category: 'Electricity', budget: 4000, actual: 3500, icon: '⚡', color: 'amber' },
    { category: 'Marketing', budget: 8000, actual: 5000, icon: '📢', color: 'rose' },
    { category: 'Supplies', budget: 5000, actual: 4000, icon: '📦', color: 'blue' },
    { category: 'Internet', budget: 2000, actual: 1500, icon: '🌐', color: 'emerald' },
    { category: 'Maintenance', budget: 3000, actual: 2200, icon: '🔧', color: 'slate' },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  const colorTokens = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200/60', progress: 'bg-indigo-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200/60', progress: 'bg-purple-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/60', progress: 'bg-amber-500' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/60', progress: 'bg-rose-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/60', progress: 'bg-blue-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/60', progress: 'bg-emerald-600' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200/60', progress: 'bg-slate-600' },
  }

  const totalBudget = useMemo(() => budgetData.reduce((sum, cat) => sum + cat.budget, 0), [budgetData])
  const totalActual = useMemo(() => budgetData.reduce((sum, cat) => sum + cat.actual, 0), [budgetData])
  const variance = totalBudget - totalActual
  const overallUtilization = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0

  const handleEditBudget = (cat) => {
    setEditingCategory(cat.category)
    setEditValue(cat.budget.toString())
  }

  const handleSaveBudget = () => {
    if (editingCategory && editValue) {
      const parsedVal = Number(editValue) || 0
      setBudgetData(prev => prev.map(item => 
        item.category === editingCategory ? { ...item, budget: parsedVal } : item
      ))
      setEditingCategory(null)
      setEditValue('')
    }
  }

  if (!mounted) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs h-full flex-1 flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
              <Target size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 tracking-tight">Budget Tracking</h3>
              <p className="text-xs text-gray-500">Expenditure threshold monitor</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setShowSetBudgetModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs border border-gray-200 transition-all"
          >
            <Calendar size={13} />
            <span>Set Budget</span>
          </button>
        </div>

        {/* Month Selector Carousel */}
        <div className="flex items-center justify-between bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-100">
          <button
            type="button"
            onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-bold text-gray-800">
            {months[selectedMonth]} {selectedYear}
          </span>
          <button
            type="button"
            onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* KPI Ticker */}
      <div className="p-4 grid grid-cols-3 gap-2 border-b border-gray-100 bg-gray-50/70 text-center">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Cap</p>
          <p className="text-xs sm:text-sm font-black text-gray-900">₹{totalBudget.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Actual Spend</p>
          <p className="text-xs sm:text-sm font-black text-amber-600">₹{totalActual.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Remaining</p>
          <p className={`text-xs sm:text-sm font-black ${variance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            ₹{Math.abs(variance).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Overall Progress Gauge */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-gray-600">Overall Budget Utilization</span>
          <span className={`font-black ${
            overallUtilization > 100 
              ? 'text-rose-600' 
              : overallUtilization > 85 
              ? 'text-amber-600' 
              : 'text-emerald-600'
          }`}>
            {overallUtilization.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overallUtilization > 100 
                ? 'bg-rose-500' 
                : overallUtilization > 85 
                ? 'bg-amber-500' 
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(overallUtilization, 100)}%` }}
          />
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold">
          {variance >= 0 ? (
            <div className="flex items-center gap-1 text-emerald-600">
              <CheckCircle size={12} />
              <span>₹{variance.toLocaleString('en-IN')} within allocated monthly ceiling</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-rose-600">
              <AlertCircle size={12} />
              <span>Over threshold by ₹{Math.abs(variance).toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown Ledger */}
      <div className="p-4 flex-1 overflow-y-auto space-y-2.5 max-h-[290px]">
        {budgetData.map((category) => {
          const styles = colorTokens[category.color] || colorTokens.slate
          const utilization = category.budget > 0 ? (category.actual / category.budget) * 100 : 0
          const isOverBudget = category.actual > category.budget
          const isEditing = editingCategory === category.category

          return (
            <div key={category.category} className={`p-3 rounded-xl border transition-all ${styles.border} bg-white`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{category.icon}</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">{category.category}</h4>
                    {isEditing ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-24 px-2 py-0.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 font-bold"
                          autoFocus
                        />
                        <button 
                          onClick={handleSaveBudget} 
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          <Save size={12} />
                        </button>
                        <button 
                          onClick={() => setEditingCategory(null)} 
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-500">Cap: ₹{category.budget.toLocaleString('en-IN')}</p>
                    )}
                  </div>
                </div>

                <div className="text-right flex items-center gap-1.5">
                  <div>
                    <p className={`text-xs sm:text-sm font-black ${isOverBudget ? 'text-rose-600' : 'text-gray-900'}`}>
                      ₹{category.actual.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">{utilization.toFixed(0)}% used</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => handleEditBudget(category)}
                      className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                    >
                      <Edit size={11} />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverBudget ? 'bg-rose-500' : styles.progress
                  }`}
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Set Monthly Budget Modal */}
      {showSetBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-primary-600" />
                <h4 className="text-base font-bold text-gray-900">Configure Monthly Budget</h4>
              </div>
              <button onClick={() => setShowSetBudgetModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Month</label>
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-medium text-gray-800"
                >
                  {months.map((m, idx) => (
                    <option key={m} value={idx}>{m} {selectedYear}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-primary-50/60 border border-primary-100 rounded-xl text-xs space-y-1">
                <p className="font-bold text-primary-900">Quick Envelope Baseline</p>
                <p className="text-primary-700">Apply previous month's limit of ₹{totalBudget.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSetBudgetModal(false)}
                className="flex-1 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setShowSetBudgetModal(false)}
                className="flex-1 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs transition-all"
              >
                Apply Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
