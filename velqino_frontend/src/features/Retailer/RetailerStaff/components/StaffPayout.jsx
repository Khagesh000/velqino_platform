"use client"

import React, { useState, useEffect } from 'react'
import { Wallet, TrendingUp, Download, Eye, ChevronLeft, ChevronRight, Calendar, CheckCircle, Clock, AlertCircle, Banknote, FileText, Send } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerStaff/StaffPayout.scss'

export default function StaffPayout({ selectedStaff }) {
  const [mounted, setMounted] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState(null)
  const itemsPerPage = 4

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const staffPayouts = [
    { id: 1, name: 'Rajesh Kumar', role: 'Store Manager', baseSalary: 35000, incentives: 5000, commission: 4500, attendanceBonus: 1000, total: 45500, paid: 45500, status: 'paid', paymentDate: '2026-04-05', accountNo: 'XXXX1234' },
    { id: 2, name: 'Priya Sharma', role: 'Sales Associate', baseSalary: 20000, incentives: 3500, commission: 3890, attendanceBonus: 500, total: 27890, paid: 27890, status: 'paid', paymentDate: '2026-04-05', accountNo: 'XXXX5678' },
    { id: 3, name: 'Vikram Mehta', role: 'Sales Associate', baseSalary: 20000, incentives: 5500, commission: 5120, attendanceBonus: 1000, total: 31620, paid: 0, status: 'pending', paymentDate: null, accountNo: 'XXXX9012' },
    { id: 4, name: 'Amit Singh', role: 'Cashier', baseSalary: 18000, incentives: 0, commission: 0, attendanceBonus: 500, total: 18500, paid: 18500, status: 'paid', paymentDate: '2026-04-05', accountNo: 'XXXX3456' },
    { id: 5, name: 'Sneha Reddy', role: 'Stock Clerk', baseSalary: 15000, incentives: 0, commission: 0, attendanceBonus: 0, total: 15000, paid: 15000, status: 'paid', paymentDate: '2026-04-05', accountNo: 'XXXX7890' },
  ]

  const filteredPayouts = selectedStaff 
    ? staffPayouts.filter(p => p.name === selectedStaff.name)
    : staffPayouts

  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage)
  const paginatedPayouts = filteredPayouts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const summary = {
    totalPayroll: staffPayouts.reduce((sum, p) => sum + p.total, 0),
    totalPaid: staffPayouts.reduce((sum, p) => sum + p.paid, 0),
    totalPending: staffPayouts.reduce((sum, p) => sum + (p.total - p.paid), 0),
    averageSalary: Math.round(staffPayouts.reduce((sum, p) => sum + p.baseSalary, 0) / staffPayouts.length)
  }

  const getStatusBadge = (status) => {
    if (status === 'paid') {
      return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={10} />, label: 'Paid' }
    }
    return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={10} />, label: 'Pending' }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const handleProcessPayout = (staff) => {
    setSelectedPayout(staff)
    setShowPayoutModal(true)
  }

  return (
    <div className="staff-payout bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Staff Payout</h3>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
            <Download size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Salary, commissions and incentives</p>
      </div>

      {/* Month Selector */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm font-semibold text-gray-700">
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

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">₹{(summary.totalPayroll / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-gray-500">Total Payroll</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">₹{(summary.totalPaid / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-gray-500">Total Paid</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-orange-600">₹{(summary.totalPending / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-gray-500">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">₹{summary.averageSalary.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Avg Salary</p>
        </div>
      </div>

      {/* Payout Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">Staff</th>
              <th className="px-4 py-3">Base Salary</th>
              <th className="px-4 py-3">Incentives</th>
              <th className="px-4 py-3">Commission</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedPayouts.map((staff, index) => {
              const status = getStatusBadge(staff.status)
              return (
                <tr
                  key={staff.id}
                  className={`payout-row transition-all ${hoveredRow === staff.id ? 'bg-gray-50' : ''}`}
                  onMouseEnter={() => setHoveredRow(staff.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">{staff.role}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">₹{staff.baseSalary.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-green-600">+₹{staff.incentives.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-blue-600">+₹{staff.commission.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-primary-600">₹{staff.total.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                      {status.icon}
                      {status.label}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                        <Eye size={14} />
                      </button>
                      {staff.status === 'pending' && (
                        <button
                          onClick={() => handleProcessPayout(staff)}
                          className="p-1 text-green-500 hover:bg-green-50 rounded-lg"
                        >
                          <Send size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {filteredPayouts.length} staff members
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

      {/* Process Payout Modal */}
      {showPayoutModal && selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Banknote size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Process Payout</h3>
              </div>
              <button onClick={() => setShowPayoutModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Staff</p>
                <p className="text-sm font-semibold">{selectedPayout.name}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Amount to Pay</p>
                <p className="text-2xl font-bold text-primary-600">₹{selectedPayout.total.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">Base Salary</p>
                  <p className="text-sm font-semibold">₹{selectedPayout.baseSalary.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">Incentives</p>
                  <p className="text-sm font-semibold text-green-600">+₹{selectedPayout.incentives.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">Commission</p>
                  <p className="text-sm font-semibold text-blue-600">+₹{selectedPayout.commission.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">Bonus</p>
                  <p className="text-sm font-semibold text-yellow-600">+₹{selectedPayout.attendanceBonus.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500">
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                </select>
              </div>

              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-xs text-blue-700">Account: {selectedPayout.accountNo}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowPayoutModal(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPayoutModal(false)
                  alert(`Payment of ₹${selectedPayout.total.toLocaleString()} processed successfully!`)
                }}
                className="flex-1 px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}