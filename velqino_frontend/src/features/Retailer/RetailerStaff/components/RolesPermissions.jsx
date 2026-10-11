"use client"

import React, { useState, useEffect } from 'react'
import { 
  Shield, Lock, Users, Package, Eye, Edit, Save, X, Plus, 
  Trash2, CheckCircle, AlertCircle, Settings, BarChart3, 
  ShoppingCart, FileText, CreditCard, Sparkles, Check 
} from '../../../../utils/icons'

export default function RolesPermissions() {
  const [mounted, setMounted] = useState(false)
  const [selectedRole, setSelectedRole] = useState('manager')
  const [showAddRoleModal, setShowAddRoleModal] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')

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
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
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
      badge: 'bg-sky-50 text-sky-700 border-sky-200',
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
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
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
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
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
    { id: 'pos', label: 'Point of Sale (POS)', icon: <ShoppingCart size={13} />, actions: ['view', 'create', 'edit', 'delete'] },
    { id: 'products', label: 'Product Catalog', icon: <Package size={13} />, actions: ['view', 'create', 'edit', 'delete'] },
    { id: 'orders', label: 'Order Processing', icon: <FileText size={13} />, actions: ['view', 'create', 'edit', 'delete'] },
    { id: 'customers', label: 'Customer CRM', icon: <Users size={13} />, actions: ['view', 'create', 'edit', 'delete'] },
    { id: 'inventory', label: 'Stock & Inventory', icon: <Package size={13} />, actions: ['view', 'create', 'edit', 'delete'] },
    { id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 size={13} />, actions: ['view', 'export'] },
    { id: 'settings', label: 'Store Settings', icon: <Settings size={13} />, actions: ['view', 'edit'] },
    { id: 'staff', label: 'Staff Management', icon: <Users size={13} />, actions: ['view', 'create', 'edit', 'delete'] },
    { id: 'payments', label: 'Payments & Refunds', icon: <CreditCard size={13} />, actions: ['view', 'create', 'refund'] },
  ]

  const activeRoleData = roles.find(r => r.id === selectedRole) || roles[0]

  const handleAddRole = () => {
    if (!newRoleName.trim()) return
    setShowAddRoleModal(false)
    setNewRoleName('')
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Shield size={18} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Security Access Control</h3>
                <p className="text-xs text-gray-500">Role permissions &amp; privilege governance</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddRoleModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95 transition-all"
            >
              <Plus size={13} />
              <span>New Role</span>
            </button>
          </div>
        </div>

        {/* Role Selector Pills */}
        <div className="p-3.5 bg-gray-50/60 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto">
          {roles.map(role => {
            const isActive = selectedRole === role.id
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-xs' 
                    : 'bg-white border border-gray-200/80 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{role.name}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {role.staffCount}
                </span>
              </button>
            )
          })}
        </div>

        {/* Permissions Module Matrix */}
        <div className="p-4 sm:p-5 max-h-[350px] overflow-y-auto space-y-2.5">
          {permissionModules.map(module => {
            const rolePerms = activeRoleData.permissions[module.id] || {}

            return (
              <div
                key={module.id}
                className="p-3 rounded-2xl border border-gray-200/70 bg-white hover:bg-gray-50/50 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{module.icon}</span>
                    <span className="text-xs font-bold text-gray-900">{module.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">
                    {module.actions.filter(act => rolePerms[act]).length} / {module.actions.length} allowed
                  </span>
                </div>

                {/* Actions Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {module.actions.map(action => {
                    const isAllowed = !!rolePerms[action]
                    return (
                      <span
                        key={action}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                          isAllowed 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-gray-50 text-gray-400 border-gray-200/60'
                        }`}
                      >
                        {isAllowed ? <Check size={9} /> : <X size={9} />}
                        {action.toUpperCase()}
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/40 text-[11px] text-gray-400 flex items-center justify-between">
        <span className="inline-flex items-center gap-1">
          <Lock size={11} className="text-gray-400" />
          End-to-End Role-Based ACL
        </span>
        <span className="font-bold text-primary-600">Active Policy</span>
      </div>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xl max-w-sm w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-primary-600" />
                <h3 className="text-base font-extrabold text-gray-900">Define Custom Role</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddRoleModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Inventory Supervisor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs"
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
