"use client"

import React, { useState, useEffect } from 'react'
import { Receipt, Search, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Calendar, Tag, CreditCard, FileText } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerExpenses/ExpenseList.scss'

export default function ExpenseList({ refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const itemsPerPage = 5

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const expenses = [
    { id: 1, date: '2026-04-14', category: 'Rent', amount: 15000, paymentMethod: 'Bank Transfer', notes: 'Monthly shop rent', receipt: true },
    { id: 2, date: '2026-04-14', category: 'Staff Salary', amount: 25000, paymentMethod: 'Bank Transfer', notes: 'April salary', receipt: false },
    { id: 3, date: '2026-04-13', category: 'Electricity', amount: 3500, paymentMethod: 'UPI', notes: 'Monthly bill', receipt: true },
    { id: 4, date: '2026-04-12', category: 'Marketing', amount: 5000, paymentMethod: 'Card', notes: 'Social media ads', receipt: true },
    { id: 5, date: '2026-04-10', category: 'Supplies', amount: 4000, paymentMethod: 'Cash', notes: 'Bags and packing material', receipt: false },
    { id: 6, date: '2026-04-05', category: 'Internet', amount: 1500, paymentMethod: 'UPI', notes: 'Broadband bill', receipt: true },
    { id: 7, date: '2026-04-01', category: 'Rent', amount: 15000, paymentMethod: 'Bank Transfer', notes: 'March rent', receipt: true },
  ]

  const categories = ['all', 'Rent', 'Staff Salary', 'Electricity', 'Marketing', 'Supplies', 'Internet']

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Rent': return 'bg-blue-100 text-blue-700'
      case 'Staff Salary': return 'bg-purple-100 text-purple-700'
      case 'Electricity': return 'bg-yellow-100 text-yellow-700'
      case 'Marketing': return 'bg-pink-100 text-pink-700'
      case 'Supplies': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = searchQuery === '' || 
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.notes.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="expense-list bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Expense List</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredExpenses.length} entries
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-sm font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedExpenses.map((expense, index) => (
              <tr
                key={expense.id}
                className={`expense-row transition-all ${hoveredRow === expense.id ? 'bg-gray-50' : ''}`}
                onMouseEnter={() => setHoveredRow(expense.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{formatDate(expense.date)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(expense.category)}`}>
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{expense.notes}</span>
                  {expense.receipt && (
                    <span className="ml-2 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Receipt</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <CreditCard size={10} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{expense.paymentMethod}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-gray-900">₹{expense.amount.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                      <Eye size={14} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                      <Edit size={14} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length} entries
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronLeft size={12} />
            </button>
            <span className="text-xs text-gray-600">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}