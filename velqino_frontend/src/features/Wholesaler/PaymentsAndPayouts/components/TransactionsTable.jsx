"use client"

import React, { useState } from 'react'
import {
  ArrowUp,
  ArrowDown,
  Download,
  Printer,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Banknote,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  FileText
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/PaymentsPayouts/TransactionsTable.scss'

export default function TransactionsTable() {
  const [selectedTransactions, setSelectedTransactions] = useState([])
  const [hoveredRow, setHoveredRow] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const transactions = [
    {
      id: 'TXN-2024-001',
      date: '2024-03-20 14:30:25',
      description: 'Order #ORD-2024-001 - Wireless Headphones (50 units)',
      type: 'Credit',
      amount: 62500,
      status: 'Completed',
      balance: 1245750,
      paymentMethod: 'UPI',
      reference: 'REF-123456'
    },
    {
      id: 'TXN-2024-002',
      date: '2024-03-19 09:15:42',
      description: 'Order #ORD-2024-002 - Cotton T-Shirts (100 units)',
      type: 'Credit',
      amount: 45000,
      status: 'Completed',
      balance: 1183250,
      paymentMethod: 'Bank Transfer',
      reference: 'REF-123457'
    },
    {
      id: 'TXN-2024-003',
      date: '2024-03-18 16:45:10',
      description: 'Payout withdrawal to Bank Account',
      type: 'Debit',
      amount: 50000,
      status: 'Completed',
      balance: 1138250,
      paymentMethod: 'Bank Transfer',
      reference: 'PAYOUT-001'
    },
    {
      id: 'TXN-2024-004',
      date: '2024-03-17 11:20:33',
      description: 'Order #ORD-2024-003 - Ceramic Mugs (150 units)',
      type: 'Credit',
      amount: 44850,
      status: 'Completed',
      balance: 1188250,
      paymentMethod: 'Credit Card',
      reference: 'REF-123458'
    },
    {
      id: 'TXN-2024-005',
      date: '2024-03-16 08:30:18',
      description: 'Order #ORD-2024-004 - Yoga Mats (50 units)',
      type: 'Credit',
      amount: 44950,
      status: 'Pending',
      balance: 1143400,
      paymentMethod: 'UPI',
      reference: 'REF-123459'
    },
    {
      id: 'TXN-2024-006',
      date: '2024-03-15 13:55:47',
      description: 'Platform fees deduction',
      type: 'Debit',
      amount: 12500,
      status: 'Completed',
      balance: 1098450,
      paymentMethod: 'System',
      reference: 'FEE-001'
    },
    {
      id: 'TXN-2024-007',
      date: '2024-03-14 10:05:22',
      description: 'Order #ORD-2024-005 - Desk Lamps (30 units)',
      type: 'Credit',
      amount: 38970,
      status: 'Failed',
      balance: 1110950,
      paymentMethod: 'Credit Card',
      reference: 'REF-123460'
    },
    {
      id: 'TXN-2024-008',
      date: '2024-03-13 17:40:55',
      description: 'Order #ORD-2024-006 - Notebook Sets (200 units)',
      type: 'Credit',
      amount: 39800,
      status: 'Completed',
      balance: 1150000,
      paymentMethod: 'Bank Transfer',
      reference: 'REF-123461'
    }
  ]

  const getStatusBadge = (status) => {
    const styles = {
      Completed: 'bg-success-100 text-success-700',
      Pending: 'bg-warning-100 text-warning-700',
      Failed: 'bg-error-100 text-error-700',
      Processing: 'bg-info-100 text-info-700'
    }
    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle size={14} />
      case 'Pending': return <Clock size={14} />
      case 'Failed': return <XCircle size={14} />
      default: return <AlertCircle size={14} />
    }
  }

  const getTypeBadge = (type) => {
    return type === 'Credit' 
      ? 'bg-success-100 text-success-700' 
      : 'bg-error-100 text-error-700'
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const toggleTransactionSelection = (transactionId) => {
    if (selectedTransactions.includes(transactionId)) {
      setSelectedTransactions(selectedTransactions.filter(id => id !== transactionId))
    } else {
      setSelectedTransactions([...selectedTransactions, transactionId])
    }
  }

  const toggleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(transactions.map(t => t.id))
    }
  }

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
  })

  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="transactions-table-container bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-900">Transaction History</h3>
          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
            {transactions.length} transactions
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <Download size={16} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <Printer size={16} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px] lg:min-w-0">
          <table className="transactions-table w-full">
            <thead>
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.length === transactions.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1">Transaction ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">Date & Time {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('type')}>
                  <div className="flex items-center gap-1">Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('amount')}>
                  <div className="flex items-center gap-1">Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('balance')}>
                  <div className="flex items-center gap-1">Balance {sortConfig.key === 'balance' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                </th>
                <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={`transactions-table-row ${hoveredRow === transaction.id ? 'transactions-table-row-hover' : ''} ${
                    selectedTransactions.includes(transaction.id) ? 'bg-primary-50/30' : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(transaction.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={() => toggleTransactionSelection(transaction.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-primary-600">{transaction.id}</span>
                    <p className="text-xs text-gray-400 mt-0.5">Ref: {transaction.reference}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{formatDate(transaction.date)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <FileText size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 line-clamp-2">{transaction.description}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {transaction.type === 'Credit' ? (
                        <ArrowUp size={14} className="text-success-600" />
                      ) : (
                        <ArrowDown size={14} className="text-error-600" />
                      )}
                      <span className={`text-sm font-semibold ${transaction.type === 'Credit' ? 'text-success-600' : 'text-error-600'}`}>
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(transaction.status)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(transaction.balance)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 order-2 sm:order-1">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, transactions.length)} of {transactions.length} transactions
        </p>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <button
            className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`w-8 h-8 text-sm rounded-lg transition-all ${
                currentPage === i + 1
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}