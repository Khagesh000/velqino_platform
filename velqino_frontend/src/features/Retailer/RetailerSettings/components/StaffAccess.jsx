"use client"

import React, { useState, useEffect } from 'react'
import { Shield, Lock, User, Key, Eye, EyeOff, Plus, Edit, Trash2, Save, X, CheckCircle, AlertCircle, RefreshCw, Smartphone, Mail } from '../../../../utils/icons'

export default function StaffAccess() {
  const [mounted, setMounted] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Rajesh Kumar', role: 'Store Manager', username: 'rajesh.k', email: 'rajesh@store.com', phone: '+91 98765 43210', status: 'active', lastLogin: 'Today 10:30 AM', pinSet: true },
    { id: 2, name: 'Priya Sharma', role: 'Sales Associate', username: 'priya.s', email: 'priya@store.com', phone: '+91 87654 32109', status: 'active', lastLogin: 'Today 09:45 AM', pinSet: true },
    { id: 3, name: 'Amit Singh', role: 'Cashier', username: 'amit.s', email: 'amit@store.com', phone: '+91 76543 21098', status: 'active', lastLogin: 'Yesterday 06:00 PM', pinSet: false },
    { id: 4, name: 'Sneha Reddy', role: 'Stock Clerk', username: 'sneha.r', email: 'sneha@store.com', phone: '+91 65432 10987', status: 'inactive', lastLogin: '5 days ago', pinSet: true },
  ])

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pinCode: '',
    confirmPin: '',
    twoFactorEnabled: false
  })

  const [pinData, setPinData] = useState({
    pinCode: '',
    confirmPin: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePinChange = (field, value) => {
    setPinData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddStaff = () => {
    if (!formData.name || !formData.username) return
    const newId = Math.max(0, ...staffList.map(s => s.id)) + 1
    const newStaff = {
      id: newId,
      name: formData.name,
      role: formData.role || 'Sales Associate',
      username: formData.username,
      email: formData.email || `${formData.username}@store.com`,
      phone: formData.phone || '+91 98000 00000',
      status: 'active',
      lastLogin: 'Never logged in',
      pinSet: Boolean(formData.pinCode)
    }

    setStaffList(prev => [...prev, newStaff])
    setShowAddModal(false)
    setFormData({ name: '', role: '', username: '', email: '', phone: '', password: '', confirmPassword: '', pinCode: '', confirmPin: '', twoFactorEnabled: false })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleSetPin = () => {
    if (!pinData.pinCode || pinData.pinCode !== pinData.confirmPin || !selectedStaff) return
    setStaffList(prev => prev.map(staff =>
      staff.id === selectedStaff.id ? { ...staff, pinSet: true } : staff
    ))
    setShowPinModal(false)
    setPinData({ pinCode: '', confirmPin: '' })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleToggleStatus = (id) => {
    setStaffList(prev => prev.map(staff =>
      staff.id === id ? { ...staff, status: staff.status === 'active' ? 'inactive' : 'active' } : staff
    ))
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const handleDeleteStaff = (id) => {
    if (confirm('Are you sure you want to remove this staff profile?')) {
      setStaffList(prev => prev.filter(staff => staff.id !== id))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }
  }

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Store Manager':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Sales Associate':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Cashier':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Stock Clerk':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-2xs shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Staff Credentials &amp; Access Control</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                  Role-Based Security
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Manage staff PIN codes, permissions, 2FA enforcement, and POS counter unlock authorization</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus size={14} />
            Add Staff Member
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="mx-6 mt-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-900">Access Permissions Updated</p>
            <p className="text-xs text-emerald-700">Staff security roles and counter authentication credentials synchronized.</p>
          </div>
        </div>
      )}

      {/* Staff Roster Table */}
      <div className="p-5 sm:p-6 space-y-6">
        <div className="border border-gray-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">POS Login</th>
                  <th className="py-3.5 px-4 text-center">Counter PIN</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-100/70 text-primary-800 font-bold text-xs flex items-center justify-center shrink-0 border border-primary-200">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{staff.name}</p>
                          <span className="text-2xs text-gray-400">ID: #STF-{staff.id}04</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-bold border ${getRoleBadge(staff.role)}`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Mail size={11} className="text-gray-400" />
                          <span className="truncate max-w-[150px]">{staff.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-2xs text-gray-500">
                          <Smartphone size={11} className="text-gray-400" />
                          <span>{staff.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                        {staff.username}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {staff.pinSet ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Lock size={10} /> PIN Active
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStaff(staff)
                            setShowPinModal(true)
                          }}
                          className="px-2.5 py-1 text-2xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all"
                        >
                          + Set 4-Digit PIN
                        </button>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(staff.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold transition-all border ${
                          staff.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                        {staff.status === 'active' ? 'Active' : 'Suspended'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-500">{staff.lastLogin}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStaff(staff)
                            setShowPinModal(true)
                          }}
                          className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Reset PIN"
                        >
                          <Key size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(staff.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Remove staff"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Best Practices Banner */}
        <div className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/50">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 border border-primary-200">
              <Shield size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900">Security Best Practices & Audit Trail</h4>
              <p className="text-xs text-gray-500 mt-0.5">Recommended precautions for multi-staff retail environments</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <div className="p-2.5 rounded-xl bg-white border border-gray-200/70 text-2xs text-gray-700">
                  <span className="font-bold text-gray-900 block mb-0.5">🔒 Unique PIN Codes</span>
                  Never share manager override PIN codes with cashier operators.
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-gray-200/70 text-2xs text-gray-700">
                  <span className="font-bold text-gray-900 block mb-0.5">⏱️ Auto-Session Lock</span>
                  Registers lock after 2 minutes of idle inactivity.
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-gray-200/70 text-2xs text-gray-700">
                  <span className="font-bold text-gray-900 block mb-0.5">🛡️ Cash Drawer Audits</span>
                  Manager approvals required for register drawer manual pops.
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-gray-200/70 text-2xs text-gray-700">
                  <span className="font-bold text-gray-900 block mb-0.5">📱 2FA For Managers</span>
                  Require OTP authentication for off-premises cloud logins.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-7 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900">Add Staff Operator</h3>
                  <p className="text-xs text-gray-500">Create new counter operator profile</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Anand Mahindra"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Operational Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                  >
                    <option value="">Select Role</option>
                    <option value="Store Manager">Store Manager (Admin)</option>
                    <option value="Sales Associate">Sales Associate</option>
                    <option value="Cashier">Cashier Operator</option>
                    <option value="Stock Clerk">Stock Clerk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Login Username *</label>
                  <input
                    type="text"
                    placeholder="anand.m"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="staff@store.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Portal Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter secure password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-primary-50/50 border border-primary-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Require Two-Factor Auth (2FA)</span>
                  <span className="text-2xs text-gray-500">Requires SMS OTP code during portal login</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange('twoFactorEnabled', !formData.twoFactorEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    formData.twoFactorEnabled ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      formData.twoFactorEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddStaff}
                className="flex-1 py-2.5 text-xs sm:text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-xs"
              >
                Create Staff Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set 4-Digit Quick PIN Modal */}
      {showPinModal && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Set Counter PIN</h3>
                  <p className="text-2xs text-gray-500">{selectedStaff.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-4 space-y-3.5">
              <div>
                <label className="block text-2xs font-bold text-gray-600 uppercase mb-1">Enter 4-Digit Security PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={pinData.pinCode}
                  onChange={(e) => handlePinChange('pinCode', e.target.value.replace(/\D/g, ''))}
                  className="w-full py-2.5 text-center text-2xl font-bold tracking-[0.5em] bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-gray-600 uppercase mb-1">Confirm 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={pinData.confirmPin}
                  onChange={(e) => handlePinChange('confirmPin', e.target.value.replace(/\D/g, ''))}
                  className="w-full py-2.5 text-center text-2xl font-bold tracking-[0.5em] bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-2xs">
                ⚠️ This 4-digit numeric code allows instant cashier counter unlocking and returns authorization.
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSetPin}
                className="flex-1 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-xs"
              >
                Save PIN Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
