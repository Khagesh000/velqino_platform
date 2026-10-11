"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { 
  FolderTree, Plus, Edit, Trash2, Search, X, AlertCircle, CheckCircle 
} from '../../../../utils/icons'

export default function ExpenseCategories() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({ name: '', budget: '', color: 'indigo' })
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const [categories, setCategories] = useState([
    { id: 1, name: 'Rent', budget: 15000, spent: 15000, color: 'indigo', icon: '🏢', expenseCount: 2 },
    { id: 2, name: 'Staff Salary', budget: 25000, spent: 25000, color: 'purple', icon: '👥', expenseCount: 1 },
    { id: 3, name: 'Electricity', budget: 4000, spent: 3500, color: 'amber', icon: '⚡', expenseCount: 1 },
    { id: 4, name: 'Marketing', budget: 8000, spent: 5000, color: 'rose', icon: '📢', expenseCount: 1 },
    { id: 5, name: 'Supplies', budget: 5000, spent: 4000, color: 'blue', icon: '📦', expenseCount: 1 },
    { id: 6, name: 'Internet', budget: 2000, spent: 1500, color: 'emerald', icon: '🌐', expenseCount: 1 },
    { id: 7, name: 'Maintenance', budget: 3000, spent: 2200, color: 'slate', icon: '🔧', expenseCount: 1 },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  const colorTokens = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200/60', progress: 'bg-indigo-600', dot: 'bg-indigo-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200/60', progress: 'bg-purple-600', dot: 'bg-purple-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/60', progress: 'bg-amber-500', dot: 'bg-amber-500' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/60', progress: 'bg-rose-500', dot: 'bg-rose-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/60', progress: 'bg-blue-600', dot: 'bg-blue-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/60', progress: 'bg-emerald-600', dot: 'bg-emerald-500' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200/60', progress: 'bg-slate-600', dot: 'bg-slate-500' },
  }

  const filteredCategories = useMemo(() => {
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [categories, searchQuery])

  const totalBudget = useMemo(() => categories.reduce((sum, cat) => sum + cat.budget, 0), [categories])
  const totalSpent = useMemo(() => categories.reduce((sum, cat) => sum + cat.spent, 0), [categories])
  const remainingBudget = totalBudget - totalSpent

  const handleSaveCategory = () => {
    if (!newCategory.name.trim()) return
    const budgetVal = Number(newCategory.budget) || 0

    if (editingCategory) {
      setCategories(prev => prev.map(c => 
        c.id === editingCategory.id ? { ...c, name: newCategory.name, budget: budgetVal, color: newCategory.color } : c
      ))
    } else {
      setCategories(prev => [
        ...prev,
        {
          id: Date.now(),
          name: newCategory.name,
          budget: budgetVal,
          spent: 0,
          color: newCategory.color || 'indigo',
          icon: '🏷️',
          expenseCount: 0
        }
      ])
    }
    setShowAddModal(false)
    setEditingCategory(null)
    setNewCategory({ name: '', budget: '', color: 'indigo' })
  }

  const handleEditClick = (cat) => {
    setEditingCategory(cat)
    setNewCategory({ name: cat.name, budget: cat.budget.toString(), color: cat.color || 'indigo' })
    setShowAddModal(true)
  }

  const handleDeleteCategory = (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId))
  }

  if (!mounted) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
              <FolderTree size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 tracking-tight">Expense Categories</h3>
              <p className="text-xs text-gray-500">Cap limits and envelope allocations</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null)
              setNewCategory({ name: '', budget: '', color: 'indigo' })
              setShowAddModal(true)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold rounded-xl text-xs transition-all"
          >
            <Plus size={13} />
            <span>New</span>
          </button>
        </div>

        {/* Envelope Stats Banner & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-3">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 flex-1 p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 text-center">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Cap</p>
              <p className="text-xs sm:text-sm font-black text-gray-900">₹{totalBudget.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Spent</p>
              <p className="text-xs sm:text-sm font-black text-amber-600">₹{totalSpent.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Remaining</p>
              <p className={`text-xs sm:text-sm font-black ${remainingBudget >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ₹{remainingBudget.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative sm:w-72">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400">
            No category matching "{searchQuery}"
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredCategories.map((cat) => {
              const styles = colorTokens[cat.color] || colorTokens.slate
              const utilization = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0
              const isOverBudget = cat.spent > cat.budget

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${styles.border} ${
                    hoveredCategory === cat.id ? 'bg-gray-50/60 shadow-xs' : 'bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{cat.icon}</span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900">{cat.name}</h4>
                          <p className="text-[10px] text-gray-400">{cat.expenseCount} entries recorded</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditClick(cat)}
                          className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Edit category"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete category"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Numbers */}
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500">Cap: ₹{cat.budget.toLocaleString('en-IN')}</span>
                      <span className={`font-bold ${isOverBudget ? 'text-rose-600' : 'text-gray-800'}`}>
                        ₹{cat.spent.toLocaleString('en-IN')} ({utilization.toFixed(0)}%)
                      </span>
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

                  {isOverBudget && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-rose-600">
                      <AlertCircle size={10} />
                      <span>Over envelope limit by ₹{(cat.spent - cat.budget).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FolderTree size={16} className="text-primary-600" />
                <h4 className="text-base font-bold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h4>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Legal Fees, Packaging"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Monthly Budget Allocation (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={newCategory.budget}
                  onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Color Palette</label>
                <div className="flex items-center gap-2 pt-1">
                  {Object.keys(colorTokens).map((cKey) => (
                    <button
                      key={cKey}
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, color: cKey })}
                      className={`w-6 h-6 rounded-full transition-all ${colorTokens[cKey].dot} ${
                        newCategory.color === cKey ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                className="flex-1 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs transition-all"
              >
                {editingCategory ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
