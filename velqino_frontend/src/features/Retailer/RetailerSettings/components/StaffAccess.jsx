"use client"

import React, { useState, useEffect } from 'react'
import { Shield, Lock, User, Key, Eye, EyeOff, Plus, Edit, Trash2, Save, X, CheckCircle, AlertCircle, RefreshCw, Smartphone, Mail } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSettings/StaffAccess.scss'

export default function StaffAccess() {
  const [mounted, setMounted] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Rajesh Kumar', role: 'Store Manager', username: 'rajesh.k', email: 'rajesh@store.com', phone: '+91 98765 43210', status: 'active', lastLogin: '2026-04-15 10:30 AM', pinSet: true },
    { id: 2, name: 'Priya Sharma', role: 'Sales Associate', username: 'priya.s', email: 'priya@store.com', phone: '+91 87654 32109', status: 'active', lastLogin: '2026-04-15 09:45 AM', pinSet: true },
    { id: 3, name: 'Amit Singh', role: 'Cashier', username: 'amit.s', email: 'amit@store.com', phone: '+91 76543 21098', status: 'active', lastLogin: '2026-04-14 06:00 PM', pinSet: false },
    { id: 4, name: 'Sneha Reddy', role: 'Stock Clerk', username: 'sneha.r', email: 'sneha@store.com', phone: '+91 65432 10987', status: 'inactive', lastLogin: '2026-04-10 05:30 PM', pinSet: true },
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
    setFormData({ ...formData, [field]: value })
  }

  const handlePinChange = (field, value) => {
    setPinData({ ...pinData, [field]: value })
  }

  const handleAddStaff = () => {
    if (!formData.name || !formData.username || !formData.password) return
    setShowAddModal(false)
    setFormData({ name: '', role: '', username: '', email: '', phone: '', password: '', confirmPassword: '', pinCode: '', confirmPin: '', twoFactorEnabled: false })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleSetPin = () => {
    if (!pinData.pinCode || pinData.pinCode !== pinData.confirmPin) return
    setShowPinModal(false)
    setPinData({ pinCode: '', confirmPin: '' })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleToggleStatus = (id) => {
    setStaffList(staffList.map(staff =>
      staff.id === id ? { ...staff, status: staff.status === 'active' ? 'inactive' : 'active' } : staff
    ))
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const handleDeleteStaff = (id) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      setStaffList(staffList.filter(staff => staff.id !== id))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }
  }

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Store Manager': return 'bg-purple-100 text-purple-700'
      case 'Sales Associate': return 'bg-blue-100 text-blue-700'
      case 'Cashier': return 'bg-green-100 text-green-700'
      case 'Stock Clerk': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="staff-access bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={22} className="text-primary-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Staff Access</h3>
              <p className="text-sm text-gray-500">Manage staff PIN codes and login credentials</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Staff
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-5 mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-700">Staff access updated successfully!</span>
        </div>
      )}

      {/* Staff List Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-5 py-3">Staff</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Username</th>
              <th className="px-5 py-3">PIN Status</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Last Login</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staffList.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50 transition-all">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">{staff.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{staff.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadge(staff.role)}`}>
                    {staff.role}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Mail size={10} className="text-gray-400" />
                      <span>{staff.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Smartphone size={10} className="text-gray-400" />
                      <span>{staff.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-sm text-gray-700">{staff.username}</span>
                </td>
                <td className="px-5 py-3">
                  {staff.pinSet ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Set</span>
                  ) : (
                    <button 
                      onClick={() => {
                        setSelectedStaff(staff)
                        setShowPinModal(true)
                      }}
                      className="text-xs text-orange-600 hover:text-orange-700"
                    >
                      Set PIN
                    </button>
                  )}
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => handleToggleStatus(staff.id)}
                    className={`text-xs px-2 py-0.5 rounded-full ${staff.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {staff.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs text-gray-500">{staff.lastLogin}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDeleteStaff(staff.id)} className="p-1 text-gray-400 hover:text-red-600 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Security Tips */}
      <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-primary-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Security Best Practices</h4>
            <ul className="text-xs text-gray-600 mt-1 space-y-1">
              <li>• Use strong passwords with at least 8 characters</li>
              <li>• Enable two-factor authentication for admin accounts</li>
              <li>• Never share PIN codes with others</li>
              <li>• Review staff access regularly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Add New Staff</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Staff name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="">Select role</option>
                  <option>Store Manager</option>
                  <option>Sales Associate</option>
                  <option>Cashier</option>
                  <option>Stock Clerk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.twoFactorEnabled}
                    onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500"
                  />
                  <span className="text-sm text-gray-700">Enable Two-Factor Authentication</span>
                </label>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex gap-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleAddStaff} className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set PIN Modal */}
      {showPinModal && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Set PIN for {selectedStaff.name}</h3>
              </div>
              <button onClick={() => setShowPinModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">4-Digit PIN Code</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Enter 4-digit PIN"
                  value={pinData.pinCode}
                  onChange={(e) => handlePinChange('pinCode', e.target.value)}
                  className="w-full px-3 py-2 text-center text-xl tracking-widest border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Confirm PIN"
                  value={pinData.confirmPin}
                  onChange={(e) => handlePinChange('confirmPin', e.target.value)}
                  className="w-full px-3 py-2 text-center text-xl tracking-widest border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs text-yellow-700">⚠️ PIN will be used for POS login and approvals</p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowPinModal(false)} className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSetPin} className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                Set PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}