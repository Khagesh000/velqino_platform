"use client"

import React, { useState, useEffect } from 'react'
import { 
  Users, Search, Filter, ChevronLeft, ChevronRight, Eye, 
  Edit, Trash2, Phone, Mail, Calendar, Clock, Plus, X, 
  Save, ShieldCheck, Sparkles, DollarSign 
} from '../../../../utils/icons'

export default function StaffList({ selectedStaff, setSelectedStaff, refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Sales Associate',
    shift: '9 AM - 6 PM',
    salary: '',
    joinDate: ''
  })
  const itemsPerPage = 5

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, roleFilter])

  if (!mounted) return null

  const staffMembers = [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@store.com', phone: '+91 98765 43210', role: 'Store Manager', shift: '9 AM - 6 PM', salary: 35000, joinDate: '2024-01-15', status: 'active', sales: 456000, target: 500000 },
    { id: 2, name: 'Priya Sharma', email: 'priya@store.com', phone: '+91 87654 32109', role: 'Sales Associate', shift: '10 AM - 7 PM', salary: 20000, joinDate: '2024-03-10', status: 'active', sales: 389000, target: 400000 },
    { id: 3, name: 'Amit Singh', email: 'amit@store.com', phone: '+91 76543 21098', role: 'Cashier', shift: '9 AM - 6 PM', salary: 18000, joinDate: '2024-06-20', status: 'active', sales: 0, target: 0 },
    { id: 4, name: 'Sneha Reddy', email: 'sneha@store.com', phone: '+91 65432 10987', role: 'Stock Clerk', shift: '8 AM - 5 PM', salary: 15000, joinDate: '2024-02-05', status: 'active', sales: 0, target: 0 },
    { id: 5, name: 'Vikram Mehta', email: 'vikram@store.com', phone: '+91 54321 09876', role: 'Sales Associate', shift: '11 AM - 8 PM', salary: 20000, joinDate: '2023-11-10', status: 'active', sales: 512000, target: 500000 },
  ]

  const roles = ['all', 'Store Manager', 'Sales Associate', 'Cashier', 'Stock Clerk']

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = searchQuery === '' || 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone.includes(searchQuery)
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter
    return matchesSearch && matchesRole
  })

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage)
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Store Manager': 
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200' }
      case 'Sales Associate': 
        return { bg: 'bg-sky-50 text-sky-700 border-sky-200' }
      case 'Cashier': 
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
      case 'Stock Clerk': 
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200' }
      default: 
        return { bg: 'bg-gray-100 text-gray-700 border-gray-200' }
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const handleAddStaff = () => {
    if (!formData.name || !formData.role) return
    setShowAddModal(false)
    setFormData({ name: '', email: '', phone: '', role: 'Sales Associate', shift: '9 AM - 6 PM', salary: '', joinDate: '' })
  }

  const handleRowClick = (staff) => {
    if (setSelectedStaff) {
      setSelectedStaff(staff)
    }
  }

  const summary = {
    totalStaff: staffMembers.length,
    activeRoles: 4,
    monthlyBasePayroll: staffMembers.reduce((sum, s) => sum + s.salary, 0),
    avgBaseSalary: Math.round(staffMembers.reduce((sum, s) => sum + s.salary, 0) / staffMembers.length)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Staff &amp; Workforce Directory</h3>
                  <span className="text-[11px] font-bold bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-0.5 rounded-full">
                    {filteredStaff.length} team members
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Click any staff member to audit attendance, performance targets, and payroll</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 text-white shadow-xs transition-all"
            >
              <Plus size={13} />
              <span>Add Staff</span>
            </button>
          </div>

          {/* Search Bar & Role Filters */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {roles.map(role => {
                const isActive = roleFilter === role
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isActive 
                        ? 'bg-primary-600 text-white shadow-xs' 
                        : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/70'
                    }`}
                  >
                    {role === 'all' ? 'All Roles' : role}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 4 Summary Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 sm:p-4 bg-gray-50/60 border-b border-gray-100 text-center">
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Headcount</p>
            <p className="text-base font-extrabold text-gray-900 mt-0.5">{summary.totalStaff}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Active Roles</p>
            <p className="text-base font-extrabold text-purple-700 mt-0.5">{summary.activeRoles} roles</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Monthly Base</p>
            <p className="text-base font-extrabold text-emerald-800 mt-0.5">₹{summary.monthlyBasePayroll.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary-600">Avg. Base Pay</p>
            <p className="text-base font-extrabold text-primary-700 mt-0.5">₹{summary.avgBaseSalary.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Staff Table */}
        {filteredStaff.length === 0 ? (
          <div className="p-12 text-center">
            <Search size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-bold text-gray-700">No employees match your search</p>
            <p className="text-xs text-gray-400 mt-1">Try another role filter or search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/40 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role Designation</th>
                  <th className="py-3 px-4">Shift Timings</th>
                  <th className="py-3 px-4">Base Salary</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {paginatedStaff.map((staff) => {
                  const roleBadge = getRoleBadge(staff.role)
                  const isSelected = selectedStaff?.id === staff.id

                  return (
                    <tr
                      key={staff.id}
                      onClick={() => handleRowClick(staff)}
                      onMouseEnter={() => setHoveredRow(staff.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-primary-50/70 font-medium' 
                          : hoveredRow === staff.id 
                            ? 'bg-gray-50/70' 
                            : 'hover:bg-gray-50/40'
                      }`}
                    >
                      {/* Employee Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                            isSelected 
                              ? 'bg-primary-600 text-white shadow-xs' 
                              : 'bg-primary-50 text-primary-700 border border-primary-100'
                          }`}>
                            {staff.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">{staff.name}</p>
                            <span className="text-[10px] text-gray-400">EMP #{staff.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                            <Mail size={11} className="text-gray-400 shrink-0" />
                            <span className="truncate max-w-[130px]">{staff.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <Phone size={11} className="text-gray-400 shrink-0" />
                            <span>{staff.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Designation */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${roleBadge.bg}`}>
                          {staff.role}
                        </span>
                      </td>

                      {/* Shift Timings */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 font-medium">
                          <Clock size={11} className="text-gray-400" />
                          {staff.shift}
                        </span>
                      </td>

                      {/* Base Salary */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-extrabold text-gray-900">
                          ₹{staff.salary.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-gray-500">
                          {formatDate(staff.joinDate)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRowClick(staff)
                          }}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-xl transition-all ${
                            isSelected
                              ? 'bg-primary-600 text-white'
                              : 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-800">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredStaff.length)}</span> of <span className="font-bold text-gray-800">{filteredStaff.length}</span> staff members
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

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-primary-600" />
                <h3 className="text-lg font-extrabold text-gray-900">Add Team Member</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="ramesh@store.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Role Designation</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  >
                    <option value="Store Manager">Store Manager</option>
                    <option value="Sales Associate">Sales Associate</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Stock Clerk">Stock Clerk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Monthly Base Salary</label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Shift Timings</label>
                  <input
                    type="text"
                    placeholder="9 AM - 6 PM"
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddStaff}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs"
                >
                  Enroll Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
