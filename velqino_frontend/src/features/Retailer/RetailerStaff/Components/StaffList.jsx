"use client"

import React, { useState, useEffect } from 'react'
import { Users, Search, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Phone, Mail, Calendar, Clock, Plus, X, Save } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerStaff/StaffList.scss'

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
    role: '',
    shift: '',
    salary: '',
    joinDate: ''
  })
  const itemsPerPage = 4

  useEffect(() => {
    setMounted(true)
  }, [])

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
      case 'Store Manager': return 'bg-purple-100 text-purple-700'
      case 'Sales Associate': return 'bg-blue-100 text-blue-700'
      case 'Cashier': return 'bg-green-100 text-green-700'
      case 'Stock Clerk': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const handleAddStaff = () => {
    if (!formData.name || !formData.role) return
    setShowAddModal(false)
    setFormData({ name: '', email: '', phone: '', role: '', shift: '', salary: '', joinDate: '' })
  }

  return (
    <div className="staff-list bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Staff List</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredStaff.length} staff
            </span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 text-xs font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1"
          >
            <Plus size={12} />
            Add Staff
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role === 'all' ? 'All Roles' : role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">Staff</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Shift</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedStaff.map((staff, index) => (
              <tr
                key={staff.id}
                className={`staff-row cursor-pointer transition-all ${selectedStaff?.id === staff.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedStaff(staff)}
                onMouseEnter={() => setHoveredRow(staff.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">{staff.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">ID: #{staff.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Mail size={10} className="text-gray-400" />
                      <span className="truncate max-w-[120px]">{staff.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone size={10} className="text-gray-400" />
                      <span>{staff.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadge(staff.role)}`}>
                    {staff.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{staff.shift}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{formatDate(staff.joinDate)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                      <Eye size={14} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                      <Edit size={14} />
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStaff.length)} of {filteredStaff.length} staff
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

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Add New Staff</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Staff name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select role</option>
                    <option>Store Manager</option>
                    <option>Sales Associate</option>
                    <option>Cashier</option>
                    <option>Stock Clerk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select shift</option>
                    <option>9 AM - 6 PM</option>
                    <option>10 AM - 7 PM</option>
                    <option>11 AM - 8 PM</option>
                    <option>8 AM - 5 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary (₹)</label>
                  <input
                    type="number"
                    placeholder="Monthly salary"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
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
                onClick={handleAddStaff}
                className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}