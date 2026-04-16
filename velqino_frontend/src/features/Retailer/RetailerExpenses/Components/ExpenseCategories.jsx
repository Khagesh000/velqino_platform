"use client"

import React, { useState, useEffect } from 'react'
import { FolderTree, Plus, Edit, Trash2, ChevronRight, Search, Save, X, TrendingUp, AlertCircle } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerExpenses/ExpenseCategories.scss'

export default function ExpenseCategories() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({ name: '', budget: '', color: '' })
  const [hoveredCategory, setHoveredCategory] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const categories = [
    { id: 1, name: 'Rent', budget: 15000, spent: 15000, color: 'blue', icon: '🏢', expenseCount: 2 },
    { id: 2, name: 'Staff Salary', budget: 25000, spent: 25000, color: 'purple', icon: '👥', expenseCount: 1 },
    { id: 3, name: 'Electricity', budget: 4000, spent: 3500, color: 'yellow', icon: '⚡', expenseCount: 1 },
    { id: 4, name: 'Marketing', budget: 8000, spent: 5000, color: 'pink', icon: '📢', expenseCount: 1 },
    { id: 5, name: 'Supplies', budget: 5000, spent: 4000, color: 'orange', icon: '📦', expenseCount: 1 },
    { id: 6, name: 'Internet', budget: 2000, spent: 1500, color: 'green', icon: '🌐', expenseCount: 1 },
    { id: 7, name: 'Maintenance', budget: 3000, spent: 0, color: 'gray', icon: '🔧', expenseCount: 0 },
  ]

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

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const remainingBudget = totalBudget - totalSpent

  const handleAddCategory = () => {
    if (!newCategory.name) return
    // Add category logic here
    setShowAddModal(false)
    setNewCategory({ name: '', budget: '', color: '' })
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setNewCategory({ name: category.name, budget: category.budget.toString(), color: category.color })
    setShowAddModal(true)
  }

  return (
    <div className="expense-categories bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Expense Categories</h3>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null)
              setNewCategory({ name: '', budget: '', color: '' })
              setShowAddModal(true)
            }}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
          >
            <Plus size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Manage expense categories</p>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-3 gap-2 border-b border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">₹{totalBudget.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Total Budget</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-orange-600">₹{totalSpent.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Total Spent</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">₹{remainingBudget.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Remaining</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="p-4 max-h-[280px] overflow-y-auto custom-scroll">
        <div className="space-y-3">
          {filteredCategories.map((category) => {
            const colors = getColorClasses(category.color)
            const spentPercentage = (category.spent / category.budget) * 100
            const isOverBudget = category.spent > category.budget
            
            return (
              <div
                key={category.id}
                className={`category-item border rounded-lg p-3 transition-all ${colors.border} ${hoveredCategory === category.id ? 'shadow-md transform -translate-y-0.5' : ''}`}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center text-lg`}>
                      {category.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{category.name}</h4>
                      <p className="text-[10px] text-gray-500">{category.expenseCount} expenses</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-1 text-gray-400 hover:text-primary-600 rounded-lg transition-all"
                    >
                      <Edit size={12} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Budget: ₹{category.budget.toLocaleString()}</span>
                  <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-700'}`}>
                    Spent: ₹{category.spent.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colors.progress} ${spentPercentage > 100 ? 'bg-red-500' : ''}`}
                    style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                  />
                </div>

                {isOverBudget && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-red-600">
                    <AlertCircle size={10} />
                    <span>Over budget by ₹{(category.spent - category.budget).toLocaleString()}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderTree size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g., Rent, Salary, Marketing"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget (₹)</label>
                <input
                  type="number"
                  placeholder="Enter budget amount"
                  value={newCategory.budget}
                  onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Color</label>
                <div className="flex gap-2">
                  {['blue', 'purple', 'yellow', 'pink', 'orange', 'green', 'gray'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={`w-8 h-8 rounded-full transition-all ${
                        color === 'blue' ? 'bg-blue-500' :
                        color === 'purple' ? 'bg-purple-500' :
                        color === 'yellow' ? 'bg-yellow-500' :
                        color === 'pink' ? 'bg-pink-500' :
                        color === 'orange' ? 'bg-orange-500' :
                        color === 'green' ? 'bg-green-500' : 'bg-gray-500'
                      } ${newCategory.color === color ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}