"use client";

import React, { useState } from 'react';
import { 
  PlusCircle, 
  PackageCheck, 
  BarChart3, 
  Download, 
  Upload, 
  ImageIcon, 
  ArrowRight, 
  Sparkles,
  Zap
} from '../../../../utils/icons';
import { useRouter } from 'next/navigation';

export default function QuickActionsRow({ 
  products = [], 
  orders = [], 
  stats = {}, 
  onAddProduct,
  onImportImages,
  onImportVideo,
  onExport 
}) {
  const router = useRouter();

  // Calculate real stats
  const productsAddedThisWeek = (products || []).filter(p => {
    if (!p?.created_at) return false;
    const createdDate = new Date(p.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate >= weekAgo;
  }).length;

  const pendingOrders = (orders || []).filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const urgentOrders = (orders || []).filter(o => o.status === 'pending').length;
  const revenueGrowth = stats?.revenue_change || 0;

  const actionItems = [
    {
      id: 'add-product',
      label: 'Add Product',
      icon: PlusCircle,
      isHero: true,
      description: 'Create new catalog listing',
      stats: `${productsAddedThisWeek} added this week`,
      onClick: onAddProduct || (() => router.push('/wholesaler/productcatalog'))
    },
    {
      id: 'import-images',
      label: 'Bulk Images',
      icon: ImageIcon,
      isHero: false,
      description: 'Upload product photo sets',
      stats: 'AI auto-parsing',
      onClick: onImportImages || (() => router.push('/wholesaler/productcatalog'))
    },
    {
      id: 'import-video',
      label: 'Bulk Video',
      icon: Upload,
      isHero: false,
      description: 'Extract listings from MP4',
      stats: 'Fast batch import',
      onClick: onImportVideo || (() => router.push('/wholesaler/productcatalog'))
    },
    {
      id: 'process-orders',
      label: 'Process Orders',
      icon: PackageCheck,
      isHero: false,
      description: `${pendingOrders} orders awaiting`,
      badge: urgentOrders > 0 ? `${urgentOrders} urgent` : null,
      stats: `${pendingOrders} in queue`,
      onClick: () => router.push('/wholesaler/ordermanagment')
    },
    {
      id: 'export-data',
      label: 'Export Catalog',
      icon: Download,
      isHero: false,
      description: 'Download CSV & Excel',
      stats: 'Instant export',
      onClick: onExport || (() => router.push('/wholesaler/productcatalog'))
    },
    {
      id: 'view-reports',
      label: 'View Analytics',
      icon: BarChart3,
      isHero: false,
      description: 'Sales and revenue insights',
      stats: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth}% growth`,
      onClick: () => router.push('/wholesaler/analyticsreports')
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shadow-xs">
            <Zap size={16} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Operational Shortcuts</h3>
            <p className="text-xs text-slate-500">Quick product management, uploads, and order dispatch</p>
          </div>
        </div>
        <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
          Fast Actions
        </span>
      </div>

      {/* Grid of Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actionItems.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className={`group relative p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                action.isHero
                  ? 'bg-primary-50/80 border-primary-300 hover:border-primary-500 hover:bg-primary-100/70 hover:shadow-md'
                  : 'bg-white border-slate-200 hover:border-primary-300 hover:bg-primary-50/30 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      action.isHero
                        ? 'bg-primary-600 text-white shadow-xs'
                        : 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  {action.badge && (
                    <span className="px-1.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold rounded-full">
                      {action.badge}
                    </span>
                  )}
                </div>
                <h4
                  className={`text-xs sm:text-sm font-bold truncate mb-0.5 ${
                    action.isHero ? 'text-primary-950' : 'text-slate-800 group-hover:text-primary-900'
                  }`}
                >
                  {action.label}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">{action.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                <span className={`font-medium truncate ${action.isHero ? 'text-primary-700' : 'text-slate-400'}`}>
                  {action.stats}
                </span>
                <ArrowRight
                  size={12}
                  className={`transition-transform duration-200 group-hover:translate-x-0.5 ${
                    action.isHero ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-600'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
