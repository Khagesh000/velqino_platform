"use client"

import React, { useState, useEffect } from 'react'
import { Shield, Lock, Users, Package, Eye, Edit, Save, X, Plus, Trash2, CheckCircle, AlertCircle, Settings, BarChart3, ShoppingCart, FileText, CreditCard } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerStaff/RolesPermissions.scss'

export default function RolesPermissions() {
  const [mounted, setMounted] = useState(false)
  const [selectedRole, setSelectedRole] = useState('manager')
  const [showAddRoleModal, setShowAddRoleModal] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [editingRole, setEditingRole] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const roles = [
    { 
      id: 'manager', 
      name: 'Store Manager', 
      staffCount: 1, 
      color: 'purple',
      permissions: {
        pos: { view: true, create: true, edit: true, delete: true },
        products: { view: true, create: true, edit: true, delete: true },
        orders: { view: true, create: true, edit: true, delete: true },
        customers: { view: true, create: true, edit: true, delete: true },
        inventory: { view: true, create: true, edit: true, delete: true },
        reports: { view: true, export: true },
        settings: { view: true, edit: true },
        staff: { view: true, create: true, edit: true, delete: true },
        payments: { view: true, create: true, refund: true }
      }
    },
    { 
      id: 'sales', 
      name: 'Sales Associate', 
      staffCount: 2, 
      color: 'blue',
      permissions: {
        pos: { view: true, create: true, edit: true, delete: false },
        products: { view: true, create: false, edit: false, delete: false },
        orders: { view: true, create: true, edit: false, delete: false },
        customers: { view: true, create: true, edit: true, delete: false },
        inventory: { view: true, create: false, edit: false, delete: false },
        reports: { view: false, export: false },
        settings: { view: false, edit: false },
        staff: { view: false, create: false, edit: false, delete: false },
        payments: { view: false, create: false, refund: false }
      }
    },
    { 
      id: 'cashier', 
      name: 'Cashier', 
      staffCount: 1, 
      color: 'green',
      permissions: {
        pos: { view: true, create: true, edit: false, delete: false },
        products: { view: true, create: false, edit: false, delete: false },
        orders: { view: true, create: true, edit: false, delete: false },
        customers: { view: true, create: true, edit: false, delete: false },
        inventory: { view: false, create: false, edit: false, delete: false },
        reports: { view: false, export: false },
        settings: { view: false, edit: false },
        staff: { view: false, create: false, edit: false, delete: false },
        payments: { view: true, create: false, refund: false }
      }
    },
    { 
      id: 'stock', 
      name: 'Stock Clerk', 
      staffCount: 1, 
      color: 'orange',
      permissions: {
        pos: { view: false, create: false, edit: false, delete: false },
        products: { view: true, create: false, edit: false, delete: false },
        orders: { view: false, create: false, edit: false, delete: false },
        customers: { view: false, create: false, edit: false, delete: false },
        inventory: { view: true, create: true, edit: true, delete: false },
        reports: { view: true, export: false },
        settings: { view: false, edit: false },
        staff: { view: false, create: false, edit: false, delete: false },
        payments: { view: false, create: false, refund: false }
      }
    }
  ]

  const permissionModules = [
    { id: 'pos', label: 'Point of Sale (POS)', icon: <ShoppingCart size={14} />, actions: ['view', 'create', 'edit', 'delete'] },
    { id: 'products', label: 'Products', icon: <Package size={14} />, actions: ['view', 'create', 'edit', 'delete'] },
    { id: 'orders', label: 'Orders', icon: <FileText size={14} />, actions: ['view', 'create', 'edit', 'delete'] },
    { id: 'customers', label: 'Customers', icon: <Users size={14} />, actions: ['view', 'create', 'edit', 'delete'] },
    { id: 'inventory', label: 'Inventory', icon: <Package size={14} />, actions: ['view', 'create', 'edit', 'delete'] },
    { id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 size={14} />, actions: ['view', 'export'] },
    { id: 'settings', label: 'Settings', icon: <Settings size={14} />, actions: ['view', 'edit'] },
    { id: 'staff', label: 'Staff Management', icon: <Users size={14} />, actions: ['view', 'create', 'edit', 'delete'] },
    { id: 'payments', label: 'Payments & Refunds', icon: <CreditCard size={14} />, actions: ['view', 'create', 'refund'] },
  ]

  const currentRole = roles.find(r => r.id === selectedRole)

  const getColorClasses = (color) => {
    const colors = {
      purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', active: 'bg-purple-500' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', active: 'bg-blue-500' },
      green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', active: 'bg-green-500' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', active: 'bg-orange-500' },
    }
    return colors[color] || colors.blue
  }

  const handlePermissionToggle = (module, action) => {
    // Permission toggle logic would go here
    console.log(`Toggle ${module}.${action} for role ${selectedRole}`)
  }

  return (
    <div className="roles-permissions bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Roles & Permissions</h3>
          </div>
          <button
            onClick={() => setShowAddRoleModal(true)}
            className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all"
          >
            <Plus size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Manage access levels for staff</p>
      </div>

      {/* Role Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {roles.map((role) => {
          const colors = getColorClasses(role.color)
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-all ${
                selectedRole === role.id 
                  ? `${colors.text} border-b-2 ${colors.border}`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {role.name}
              <span className="ml-1 text-[10px] text-gray-400">({role.staffCount})</span>
            </button>
          )
        })}
      </div>

      {/* Permissions Table */}
      <div className="p-4 max-h-[400px] overflow-y-auto custom-scroll">
        <div className="space-y-4">
          {permissionModules.map((module) => {
            const permissions = currentRole?.permissions[module.id] || {}
            const colors = getColorClasses(currentRole?.color)
            
            return (
              <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className={`px-3 py-2 ${colors.bg} border-b border-gray-200`}>
                  <div className="flex items-center gap-2">
                    <span className={colors.text}>{module.icon}</span>
                    <span className={`text-sm font-medium ${colors.text}`}>{module.label}</span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {module.actions.map((action) => {
                      const hasPermission = permissions[action] || false
                      return (
                        <label
                          key={action}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                            hasPermission ? `${colors.bg} ${colors.text}` : 'bg-gray-50 text-gray-500'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={hasPermission}
                            onChange={() => handlePermissionToggle(module.id, action)}
                            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                          />
                          <span className="text-xs capitalize">{action}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <button className="w-full py-2 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
          <Save size={14} />
          Save Permissions
        </button>
      </div>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Add New Role</h3>
              </div>
              <button onClick={() => setShowAddRoleModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input
                  type="text"
                  placeholder="e.g., Supervisor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Copy Permissions From</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500">
                  <option>None (Start Fresh)</option>
                  <option>Store Manager</option>
                  <option>Sales Associate</option>
                  <option>Cashier</option>
                  <option>Stock Clerk</option>
                </select>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-700">New role will have customizable permissions</p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowAddRoleModal(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddRoleModal(false)
                  setNewRoleName('')
                }}
                className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}