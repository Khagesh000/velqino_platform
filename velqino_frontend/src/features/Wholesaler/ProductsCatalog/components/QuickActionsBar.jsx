"use client";

import React, { useState } from 'react';
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
  Filter,
  ImageIcon,
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/ProductsCatalog/QuickActionsBar.scss';

export default function QuickActionsBar({
  onAddNew,
  onImport,
  onImportImages,
  onExport,
  onBulkEdit,
  onManageCategories,
  onManageAttributes,
  selectedCount = 0
}) {
  const [showMoreActions, setShowMoreActions] = useState(false);

  const mainActions = [
    {
      id: 'add',
      label: 'Add Product',
      icon: Plus,
      isHero: true,
      onClick: onAddNew,
      description: 'Create new listing'
    },
    {
      id: 'import',
      label: 'Import Video',
      icon: Upload,
      isHero: false,
      onClick: onImport,
      description: 'Bulk import from MP4'
    },
    {
      id: 'importImages',
      label: 'Import Images',
      icon: ImageIcon,
      isHero: false,
      onClick: onImportImages,
      description: 'Bulk import from images'
    },
    {
      id: 'export',
      label: 'Export Catalog',
      icon: Download,
      isHero: false,
      onClick: onExport,
      description: 'Download CSV / Excel'
    },
    {
      id: 'bulk',
      label: 'Bulk Edit',
      icon: Edit3,
      isHero: false,
      onClick: onBulkEdit,
      description: 'Mass update items',
      badge: selectedCount > 0 ? selectedCount : null
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: FolderTree,
      isHero: false,
      onClick: onManageCategories,
      description: 'Manage categories'
    },
    {
      id: 'attributes',
      label: 'Attributes',
      icon: Settings,
      isHero: false,
      onClick: onManageAttributes || onManageCategories,
      description: 'Manage attributes'
    }
  ];

  const moreActions = [
    {
      id: 'more-cat',
      label: 'Category Restructure',
      icon: FolderTree,
      onClick: onManageCategories,
      description: 'Reorganize taxonomy'
    },
    {
      id: 'more-attr',
      label: 'Attribute Presets',
      icon: Settings,
      onClick: onManageAttributes || onManageCategories,
      description: 'Custom product properties'
    },
    {
      id: 'more-export',
      label: 'Detailed Export',
      icon: Download,
      onClick: onExport,
      description: 'Full catalog report'
    }
  ];

  return (
    <div className="quick-actions-bar bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-sm flex-shrink-0">
            <Package size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Quick Actions</h3>
            <p className="text-xs sm:text-sm text-slate-500">Manage your product listings and workflows</p>
          </div>
        </div>
        {selectedCount > 0 && (
          <div className="px-3 py-1 bg-accent-50 border border-accent-200 text-accent-800 text-xs font-semibold rounded-lg shadow-sm">
            {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {mainActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              className={`quick-action-card relative p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 group flex flex-col justify-between ${
                action.isHero
                  ? 'bg-primary-50/80 border-primary-300 hover:border-primary-500 hover:bg-primary-100/70 hover:shadow-md'
                  : 'bg-white border-slate-200 hover:border-primary-300 hover:bg-primary-50/30 hover:shadow-sm'
              }`}
              onClick={action.onClick}
            >
              <div className="flex items-start justify-between mb-3 w-full">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                    action.isHero
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white'
                  }`}
                >
                  <Icon size={19} />
                </div>
                {action.badge && (
                  <span className="px-2 py-0.5 bg-accent-100 border border-accent-300 text-accent-800 text-xs font-bold rounded-full shadow-sm">
                    {action.badge}
                  </span>
                )}
              </div>
              <div>
                <h4
                  className={`text-sm sm:text-base font-semibold mb-0.5 transition-colors ${
                    action.isHero ? 'text-primary-950' : 'text-slate-800 group-hover:text-primary-900'
                  }`}
                >
                  {action.label}
                </h4>
                <p
                  className={`text-xs truncate ${
                    action.isHero ? 'text-primary-700/80' : 'text-slate-500'
                  }`}
                >
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}

        {/* More Actions Dropdown Trigger */}
        <div className="relative col-span-2 sm:col-span-1">
          <button
            type="button"
            className="quick-action-card w-full h-full p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 text-left transition-all duration-200 group flex flex-col justify-between"
            onClick={() => setShowMoreActions(!showMoreActions)}
          >
            <div className="flex items-start justify-between mb-3 w-full">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <Grid size={19} />
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${
                  showMoreActions ? 'rotate-180 text-primary-600' : ''
                }`}
              />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-slate-800 mb-0.5">More Actions</h4>
              <p className="text-xs text-slate-500">Categories & attributes</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showMoreActions && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-20 p-1.5 animate-in fade-in zoom-in-95 duration-150">
              {moreActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    type="button"
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-primary-50 rounded-lg transition-colors group text-left"
                    onClick={() => {
                      action.onClick?.();
                      setShowMoreActions(false);
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary-900 truncate">
                        {action.label}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{action.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info / Short-cuts */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="font-medium text-slate-600">Quick Links:</span>
        <button
          type="button"
          onClick={onBulkEdit}
          className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1 font-medium"
        >
          <FileText size={13} />
          <span>Bulk Edit Catalog</span>
        </button>
        <span className="text-slate-300">|</span>
        <button
          type="button"
          onClick={onManageCategories}
          className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1 font-medium"
        >
          <Filter size={13} />
          <span>Category Manager</span>
        </button>
      </div>
    </div>
  );
}
