"use client"

import React, { useState } from 'react'
import {
  Plus,
  Upload,
  Download,
  Edit3,
  FolderTree,
  Settings,
  ChevronDown,
  Package,
  FileText,
  Grid,
  List,
  Filter
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/ProductsCatalog/QuickActionsBar.scss'

export default function QuickActionsBar({
  onAddNew,
  onImport,
  onExport,
  onBulkEdit,
  onManageCategories,
  onManageAttributes,
  selectedCount = 0
}) {
  const [showMoreActions, setShowMoreActions] = useState(false)
  const [hoveredAction, setHoveredAction] = useState(null)

  const mainActions = [
  {
    id: 'add',
    label: 'Add New',
    icon: Plus,
    color: 'primary',
    onClick: onAddNew,
    description: 'Create new product'
  },
  {
    id: 'import',
    label: 'Import',
    icon: Upload,
    color: 'info',
    onClick: onImport,
    description: 'Bulk import from CSV/Excel'
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
    color: 'success',
    onClick: onExport,
    description: 'Export products list'
  },
  {
    id: 'bulk',
    label: 'Bulk Edit',
    icon: Edit3,
    color: 'warning',
    onClick: onBulkEdit,
    description: 'Mass update products',
    badge: selectedCount > 0 ? selectedCount : null
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: FolderTree,
    color: 'purple',
    onClick: onManageCategories,
    description: 'Manage categories'
  },
  {
    id: 'attributes',
    label: 'Attributes',
    icon: Settings,
    color: 'indigo',
    onClick: onManageAttributes,
    description: 'Manage attributes'
  }
]

  const getActionColorClasses = (color, isHovered) => {
    const colors = {
      primary: {
        bg: 'bg-primary-50',
        text: 'text-primary-700',
        border: 'border-primary-200',
        hover: 'hover:bg-primary-100 hover:border-primary-300',
        icon: 'text-primary-500'
      },
      info: {
        bg: 'bg-info-50',
        text: 'text-info-700',
        border: 'border-info-200',
        hover: 'hover:bg-info-100 hover:border-info-300',
        icon: 'text-info-500'
      },
      success: {
        bg: 'bg-success-50',
        text: 'text-success-700',
        border: 'border-success-200',
        hover: 'hover:bg-success-100 hover:border-success-300',
        icon: 'text-success-500'
      },
      warning: {
        bg: 'bg-warning-50',
        text: 'text-warning-700',
        border: 'border-warning-200',
        hover: 'hover:bg-warning-100 hover:border-warning-300',
        icon: 'text-warning-500'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-100 hover:border-purple-300',
        icon: 'text-purple-500'
      },
      indigo: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        hover: 'hover:bg-indigo-100 hover:border-indigo-300',
        icon: 'text-indigo-500'
      }
    }
    return colors[color] || colors.primary
  }

  return (
    <div className="quick-actions-bar">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Package size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500">Manage your products efficiently</p>
          </div>
        </div>
        {selectedCount > 0 && (
          <div className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg">
            {selectedCount} product{selectedCount > 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
  {mainActions.map((action) => {
    const Icon = action.icon
    const colors = getActionColorClasses(action.color, hoveredAction === action.id)
    
    return (
      <button
        key={action.id}
        className={`quick-action-card relative p-4 rounded-xl border-2 transition-all ${colors.bg} ${colors.border} ${colors.hover} group`}
        onClick={action.onClick}
        onMouseEnter={() => setHoveredAction(action.id)}
        onMouseLeave={() => setHoveredAction(null)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.icon}`}>
            <Icon size={20} />
          </div>
          {action.badge && (
            <span className="quick-action-badge px-2 py-1 bg-white text-primary-600 text-xs font-medium rounded-full shadow-sm">
              {action.badge}
            </span>
          )}
        </div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">{action.label}</h4>
        <p className="text-xs text-gray-500">{action.description}</p>

        {/* Hover Glow Effect */}
        {hoveredAction === action.id && (
          <div className={`absolute inset-0 rounded-xl opacity-10 blur-xl pointer-events-none ${colors.bg}`} />
        )}
      </button>
    )
  })}

        {/* More Actions Dropdown Trigger */}
        <div className="relative col-span-2 sm:col-span-1">
          <button
            className={`quick-action-card w-full p-4 rounded-xl border-2 transition-all bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 group`}
            onClick={() => setShowMoreActions(!showMoreActions)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600">
                <Grid size={20} />
              </div>
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform duration-300 ${
                  showMoreActions ? 'rotate-180' : ''
                }`} 
              />
            </div>
            <h4 className="text-base font-semibold text-gray-900 mb-1">More Actions</h4>
            <p className="text-xs text-gray-500">Categories & Attributes</p>
          </button>

          {/* Dropdown Menu */}
          {showMoreActions && (
            <div className="quick-actions-dropdown absolute top-full right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-10">
              {moreActions.map((action) => {
                const Icon = action.icon
                const colors = getActionColorClasses(action.color)
                
                return (
                  <button
                    key={action.id}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-all group"
                    onClick={() => {
                      action.onClick()
                      setShowMoreActions(false)
                    }}
                  >
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center ${colors.icon}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Actions Bar (Optional) */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4 text-sm">
        <span className="text-gray-500">Recent:</span>
        <button className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1">
          <FileText size={14} />
          <span>Electronics Bulk Update</span>
        </button>
        <span className="text-gray-300">|</span>
        <button className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1">
          <Filter size={14} />
          <span>Category Restructure</span>
        </button>
      </div>
    </div>
  )
}