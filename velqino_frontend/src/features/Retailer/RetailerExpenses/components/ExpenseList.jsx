"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Receipt, Search, Filter, ChevronLeft, ChevronRight, Eye, 
  Trash2, Calendar, CreditCard, FileText, X, AlertCircle, RefreshCw
} from '../../../../utils/icons'
import { 
  useGetExpensesQuery, 
  useDeleteExpenseMutation 
} from '@/redux/retailer/slices/retailerReportsSlice'

export default function ExpenseList({ refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [expenseToDelete, setExpenseToDelete] = useState(null)
  const itemsPerPage = 6

  // API Call with automatic caching and refetch on trigger
  const { 
    data: apiResponse, 
    isLoading, 
    isFetching, 
    refetch 
  } = useGetExpensesQuery({ period: 'month' })

  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (refreshTrigger) {
      refetch()
    }
  }, [refreshTrigger, refetch])

  // Fallback seed expenses if user has no expenses in DB yet
  const defaultExpenses = useMemo(() => [
    { id: 'def-1', date: '2026-04-14', category: 'Rent', amount: 15000, paymentMethod: 'Bank Transfer', notes: 'Monthly shop premises lease', receipt: true },
    { id: 'def-2', date: '2026-04-14', category: 'Staff Salary', amount: 25000, paymentMethod: 'Bank Transfer', notes: 'April staff payroll disbursal', receipt: false },
    { id: 'def-3', date: '2026-04-13', category: 'Electricity', amount: 3500, paymentMethod: 'UPI', notes: 'Commercial electricity utility bill', receipt: true },
    { id: 'def-4', date: '2026-04-12', category: 'Marketing', amount: 5000, paymentMethod: 'Card', notes: 'Targeted hyper-local social ads', receipt: true },
    { id: 'def-5', date: '2026-04-10', category: 'Supplies', amount: 4000, paymentMethod: 'Cash', notes: 'Packaging materials and carry bags', receipt: false },
    { id: 'def-6', date: '2026-04-05', category: 'Internet', amount: 1500, paymentMethod: 'UPI', notes: 'High-speed business broadband connection', receipt: true },
    { id: 'def-7', date: '2026-04-01', category: 'Maintenance', amount: 2200, paymentMethod: 'Cash', notes: 'AC service and POS printer repair', receipt: false },
  ], [])

  // Harmonize API data format with frontend table
  const allExpenses = useMemo(() => {
    const rawList = apiResponse?.data?.expenses || apiResponse?.data || []
    if (Array.isArray(rawList) && rawList.length > 0) {
      return rawList.map(item => ({
        id: item.id,
        date: item.date || item.expense_date || new Date().toISOString().split('T')[0],
        category: item.category || 'General',
        amount: Number(item.amount || 0),
        paymentMethod: item.payment_method || item.paymentMethod || 'Cash',
        notes: item.description || item.notes || 'Expense record',
        receipt: Boolean(item.receipt_url || item.receipt)
      }))
    }
    return defaultExpenses
  }, [apiResponse, defaultExpenses])

  const categories = useMemo(() => {
    const set = new Set(allExpenses.map(e => e.category))
    return ['all', ...Array.from(set)]
  }, [allExpenses])

  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'rent':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
      case 'staff salary':
      case 'salary':
        return 'bg-purple-50 text-purple-700 border-purple-200/60'
      case 'electricity':
      case 'utilities':
        return 'bg-amber-50 text-amber-700 border-amber-200/60'
      case 'marketing':
        return 'bg-rose-50 text-rose-700 border-rose-200/60'
      case 'supplies':
        return 'bg-blue-50 text-blue-700 border-blue-200/60'
      case 'internet':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
      case 'maintenance':
        return 'bg-slate-100 text-slate-700 border-slate-200/60'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200/60'
    }
  }

  const filteredExpenses = useMemo(() => {
    return allExpenses.filter(expense => {
      const matchesSearch = searchQuery === '' || 
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.notes.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [allExpenses, searchQuery, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / itemsPerPage))
  const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return
    try {
      if (typeof expenseToDelete.id === 'number') {
        await deleteExpense(expenseToDelete.id).unwrap()
      }
      setExpenseToDelete(null)
      refetch()
    } catch (err) {
      console.error('Failed to delete expense:', err)
      setExpenseToDelete(null)
    }
  }

  if (!mounted) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold">
              <Receipt size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Expense Ledger</h3>
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {filteredExpenses.length} entries
                </span>
                {isFetching && (
                  <RefreshCw size={12} className="animate-spin text-primary-600" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Audit-ready record of business expenditures</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-100 self-start sm:self-auto">
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Filtered Total</p>
              <p className="text-sm sm:text-base font-black text-gray-900">
                ₹{totalAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <button 
              onClick={() => refetch()} 
              title="Refresh ledger"
              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all"
            >
              <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by category, remarks, or notes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-800 placeholder-gray-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-700 font-medium"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Description & Notes</th>
              <th className="px-5 py-3">Payment Method</th>
              <th className="px-5 py-3 text-right">Amount (₹)</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="max-w-xs mx-auto space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                      <Receipt size={18} />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">No expenses found</p>
                    <p className="text-xs text-gray-500">Try adjusting your search criteria or category filter</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className={`transition-colors text-xs sm:text-sm ${
                    hoveredRow === expense.id ? 'bg-gray-50/70' : 'hover:bg-gray-50/40'
                  }`}
                  onMouseEnter={() => setHoveredRow(expense.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Date */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Calendar size={13} className="text-gray-400 flex-shrink-0" />
                      <span className="font-medium">{formatDate(expense.date)}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${getCategoryBadgeClass(expense.category)}`}>
                      {expense.category}
                    </span>
                  </td>

                  {/* Description / Notes */}
                  <td className="px-5 py-3.5 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-normal truncate block" title={expense.notes}>
                        {expense.notes}
                      </span>
                      {expense.receipt && (
                        <span className="flex-shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-md">
                          Receipt
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Payment Method */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <CreditCard size={13} className="text-gray-400 flex-shrink-0" />
                      <span className="capitalize">{expense.paymentMethod}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <span className="font-black text-gray-900 tracking-tight">
                      ₹{expense.amount.toLocaleString('en-IN')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedExpense(expense)}
                        title="View details"
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setExpenseToDelete(expense)}
                        title="Delete expense"
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-gray-50/50">
        <p>
          Showing <span className="font-semibold text-gray-700">{filteredExpenses.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
          <span className="font-semibold text-gray-700">{Math.min(currentPage * itemsPerPage, filteredExpenses.length)}</span> of{' '}
          <span className="font-semibold text-gray-700">{filteredExpenses.length}</span> entries
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2.5 py-1 text-xs font-bold text-gray-800 bg-white border border-gray-200 rounded-lg">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Receipt size={18} className="text-primary-600" />
                <h4 className="text-base font-bold text-gray-900">Expense Details</h4>
              </div>
              <button 
                onClick={() => setSelectedExpense(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Category</span>
                <span className={`font-semibold px-2 py-0.5 rounded ${getCategoryBadgeClass(selectedExpense.category)}`}>
                  {selectedExpense.category}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Amount</span>
                <span className="font-black text-gray-900 text-sm">₹{selectedExpense.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Date</span>
                <span className="font-medium text-gray-700">{formatDate(selectedExpense.date)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Payment Mode</span>
                <span className="font-medium text-gray-700 capitalize">{selectedExpense.paymentMethod}</span>
              </div>
              <div className="py-1">
                <span className="text-gray-400 block mb-1">Remarks</span>
                <p className="text-gray-800 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {selectedExpense.notes || 'No remarks provided'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedExpense(null)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-gray-900">Delete Expense?</h4>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete this ₹{expenseToDelete.amount.toLocaleString('en-IN')} ({expenseToDelete.category}) entry? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setExpenseToDelete(null)}
                className="flex-1 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
