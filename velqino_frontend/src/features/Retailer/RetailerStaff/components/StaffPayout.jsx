"use client"

import React, { useState, useEffect } from 'react'
import { 
  Wallet, TrendingUp, Download, Eye, ChevronLeft, ChevronRight, 
  Calendar, CheckCircle, Clock, AlertCircle, Banknote, 
  FileText, Send, X, CreditCard, Sparkles 
} from '../../../../utils/icons'

export default function StaffPayout({ selectedStaff }) {
  const [mounted, setMounted] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState(null)
  const itemsPerPage = 5

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const staffPayouts = [
    { id: 1, name: 'Rajesh Kumar', role: 'Store Manager', baseSalary: 35000, incentives: 5000, commission: 4500, attendanceBonus: 1000, total: 45500, paid: 45500, status: 'paid', paymentDate: '2026-04-05', accountNo: 'HDFC •••• 1234' },
    { id: 2, name: 'Priya Sharma', role: 'Sales Associate', baseSalary: 20000, incentives: 3500, commission: 3890, attendanceBonus: 500, total: 27890, paid: 27890, status: 'paid', paymentDate: '2026-04-05', accountNo: 'ICICI •••• 5678' },
    { id: 3, name: 'Vikram Mehta', role: 'Sales Associate', baseSalary: 20000, incentives: 5500, commission: 5120, attendanceBonus: 1000, total: 31620, paid: 0, status: 'pending', paymentDate: null, accountNo: 'SBI •••• 9012' },
    { id: 4, name: 'Amit Singh', role: 'Cashier', baseSalary: 18000, incentives: 0, commission: 0, attendanceBonus: 500, total: 18500, paid: 18500, status: 'paid', paymentDate: '2026-04-05', accountNo: 'AXIS •••• 3456' },
    { id: 5, name: 'Sneha Reddy', role: 'Stock Clerk', baseSalary: 15000, incentives: 0, commission: 0, attendanceBonus: 0, total: 15000, paid: 15000, status: 'paid', paymentDate: '2026-04-05', accountNo: 'KOTAK •••• 7890' },
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
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle size={10} />, label: 'Disbursed' }
    }
    return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={10} />, label: 'Pending Payout' }
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
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs w-full overflow-hidden">
      <div>
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Wallet size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Staff Payroll &amp; Compensation Ledger</h3>
                <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  Monthly Cycles
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Base compensation, sales commission incentives, attendance rewards, and bank transfers</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Month Selector */}
            <div className="flex items-center gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-200/60">
              <button
                type="button"
                onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-white"
              >
                <ChevronLeft size={13} />
              </button>
              <span className="text-xs font-bold text-gray-700 px-2">
                {months[selectedMonth]} {selectedYear}
              </span>
              <button
                type="button"
                onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-white"
              >
                <ChevronRight size={13} />
              </button>
            </div>

            <button 
              type="button"
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl border border-gray-200/80 transition-all shadow-2xs"
              title="Export payroll sheets"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* 4 Summary Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 sm:p-4 bg-gray-50/60 border-b border-gray-100 text-center">
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Gross Payroll</p>
            <p className="text-base font-extrabold text-gray-900 mt-0.5">₹{summary.totalPayroll.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Disbursed Total</p>
            <p className="text-base font-extrabold text-emerald-800 mt-0.5">₹{summary.totalPaid.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pending Outflow</p>
            <p className="text-base font-extrabold text-amber-700 mt-0.5">₹{summary.totalPending.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary-600">Avg. Base Salary</p>
            <p className="text-base font-extrabold text-primary-700 mt-0.5">₹{summary.averageSalary.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/40 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Base Salary</th>
                <th className="py-3 px-4">Sales Commission</th>
                <th className="py-3 px-4">Performance Incentive</th>
                <th className="py-3 px-4">Attendance Bonus</th>
                <th className="py-3 px-4">Total Net Pay</th>
                <th className="py-3 px-4">Bank Account</th>
                <th className="py-3 px-4">Payout Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {paginatedPayouts.map((staff) => {
                const statusBadge = getStatusBadge(staff.status)

                return (
                  <tr
                    key={staff.id}
                    onMouseEnter={() => setHoveredRow(staff.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`transition-all ${
                      hoveredRow === staff.id ? 'bg-gray-50/70' : 'hover:bg-gray-50/40'
                    }`}
                  >
                    {/* Employee */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">{staff.name}</p>
                        <span className="text-[10px] text-gray-400">{staff.role}</span>
                      </div>
                    </td>

                    {/* Base Salary */}
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      ₹{staff.baseSalary.toLocaleString('en-IN')}
                    </td>

                    {/* Commission */}
                    <td className="py-3.5 px-4 text-emerald-700 font-semibold">
                      +₹{staff.commission.toLocaleString('en-IN')}
                    </td>

                    {/* Incentives */}
                    <td className="py-3.5 px-4 text-purple-700 font-semibold">
                      +₹{staff.incentives.toLocaleString('en-IN')}
                    </td>

                    {/* Attendance Bonus */}
                    <td className="py-3.5 px-4 text-sky-700 font-semibold">
                      +₹{staff.attendanceBonus.toLocaleString('en-IN')}
                    </td>

                    {/* Total Net */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                        ₹{staff.total.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Bank Account */}
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      {staff.accountNo}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadge.bg}`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {staff.status === 'pending' ? (
                        <button
                          type="button"
                          onClick={() => handleProcessPayout(staff)}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-xs transition-all"
                        >
                          Disburse
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="px-2.5 py-1 text-[11px] font-bold rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                        >
                          Payslip
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-800">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredPayouts.length)}</span> of <span className="font-bold text-gray-800">{filteredPayouts.length}</span> records
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 rounded-xl transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 rounded-xl transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Process Payout Modal */}
      {showPayoutModal && selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xl max-w-sm w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet size={20} className="text-primary-600" />
                <h3 className="text-base font-extrabold text-gray-900">Authorize Salary Disbursal</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/60">
                <p className="text-xs text-gray-500">Beneficiary</p>
                <h4 className="text-sm font-extrabold text-gray-900 mt-0.5">{selectedPayout.name}</h4>
                <p className="text-[11px] text-gray-400">{selectedPayout.role} · {selectedPayout.accountNo}</p>
                
                <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-xs font-extrabold">
                  <span>Net Disbursal</span>
                  <span className="text-emerald-700 text-sm">₹{selectedPayout.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    selectedPayout.status = 'paid'
                    setShowPayoutModal(false)
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs"
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
