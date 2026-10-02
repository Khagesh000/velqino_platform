"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ClipboardList, 
  Package, 
  Clock, 
  Wallet, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight,
  Timer, 
  Loader2 
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/PendingTasks.scss';

export default function PendingTasks({ tasks, isLoading, activeTab = 'all', page, onTabChange, onPageChange }) {
  const router = useRouter();
  const [hoveredTask, setHoveredTask] = useState(null);
  const taskList = Array.isArray(tasks) ? tasks : (tasks?.items || tasks?.data || []);

  const totalCount = taskList.length;
  const orderCount = taskList.filter(t => t.type === 'order').length;
  const productCount = taskList.filter(t => t.type === 'product').length;
  const payoutCount = taskList.filter(t => t.type === 'payout').length;
  const highCount = taskList.filter(t => t.priority === 'high').length;
  const mediumCount = taskList.filter(t => t.priority === 'medium').length;
  const lowCount = taskList.filter(t => t.priority === 'low').length;

  const filteredTasks = taskList.filter(task => {
    if (activeTab === 'orders') return task.type === 'order';
    if (activeTab === 'products') return task.type === 'product';
    if (activeTab === 'payouts') return task.type === 'payout';
    return true;
  });

  const getPriorityIcon = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return <AlertCircle size={13} />;
      case 'medium': return <Timer size={13} />;
      case 'low': return <Clock size={13} />;
      default: return <Clock size={13} />;
    }
  };

  const getPriorityClass = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'bg-rose-50 text-rose-600 border border-rose-200/80';
      case 'medium': return 'bg-amber-50 text-amber-700 border border-amber-200/80';
      default: return 'bg-primary-50 text-primary-700 border border-primary-200/80';
    }
  };

  const getTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'order': return <Package size={15} />;
      case 'product': return <ClipboardList size={15} />;
      case 'payout': return <Wallet size={15} />;
      default: return <Clock size={15} />;
    }
  };

  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'order': return 'bg-primary-100 text-primary-600';
      case 'product': return 'bg-indigo-100 text-indigo-600';
      case 'payout': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const handleTaskAction = (task) => {
    if (task?.type === 'product') {
      router.push('/wholesaler/productcatalog');
    } else if (task?.type === 'payout') {
      router.push('/wholesaler/paymentsandpayouts');
    } else {
      router.push('/wholesaler/ordermanagment');
    }
  };

  const tabs = [
    { id: 'all', label: 'All', count: totalCount },
    { id: 'orders', label: 'Orders', count: orderCount, icon: <Package size={13} /> },
    { id: 'products', label: 'Products', count: productCount, icon: <ClipboardList size={13} /> },
    { id: 'payouts', label: 'Payouts', count: payoutCount, icon: <Wallet size={13} /> }
  ];

  if (isLoading && page === 1) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-center py-10">
          <Loader2 size={28} className="animate-spin text-primary-600 mb-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 lg:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 lg:mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              <ClipboardList size={20} />
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-bold text-slate-900">Pending Tasks</h3>
              <p className="text-xs text-slate-500">{totalCount} operational items require attention</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl overflow-x-auto max-w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-primary-700 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  onClick={() => {
                    onTabChange?.(tab.id);
                    onPageChange?.(1);
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* View All Tasks CTA */}
            <button
              type="button"
              onClick={() => router.push('/wholesaler/ordermanagment')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-200/80 rounded-xl text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-all shadow-2xs group"
            >
              <span>Manage Tasks</span>
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-xs flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <CheckCircle size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">All caught up!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">No pending operational tasks matching this filter right now</p>
            <button
              type="button"
              onClick={() => router.push('/wholesaler/ordermanagment')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-50 text-primary-700 border border-primary-200/80 rounded-xl text-xs font-semibold hover:bg-primary-100 transition-all shadow-2xs"
            >
              <span>Go to Order Operations</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Tasks Grid */}
        {filteredTasks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group relative bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                  hoveredTask === task.id ? 'translate-y-[-2px] border-primary-200' : ''
                }`}
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                <div>
                  <div className="flex items-start gap-3 mb-2.5">
                    <div className={`w-8 h-8 rounded-lg ${getTypeColor(task.type)} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                      {getTypeIcon(task.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${getPriorityClass(task.priority)}`}>
                      {getPriorityIcon(task.priority)}
                      <span className="capitalize">{task.priority || 'Normal'}</span>
                    </span>

                    {task.due_date && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        Due: {task.due_date}
                      </span>
                    )}
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleTaskAction(task)}
                    className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-all hover:gap-1.5 flex-shrink-0"
                  >
                    <span>Handle</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-3.5 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-2 flex-1">
          <div className="text-center p-1.5 rounded-xl bg-rose-50/50">
            <div className="flex items-center justify-center gap-1 text-rose-600 mb-0.5">
              <AlertCircle size={13} />
              <span className="text-xs sm:text-sm font-bold">{highCount}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">High priority</p>
          </div>
          <div className="text-center p-1.5 rounded-xl bg-amber-50/50">
            <div className="flex items-center justify-center gap-1 text-amber-600 mb-0.5">
              <Timer size={13} />
              <span className="text-xs sm:text-sm font-bold">{mediumCount}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Medium</p>
          </div>
          <div className="text-center p-1.5 rounded-xl bg-primary-50/50">
            <div className="flex items-center justify-center gap-1 text-primary-600 mb-0.5">
              <Clock size={13} />
              <span className="text-xs sm:text-sm font-bold">{lowCount}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Low priority</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push('/wholesaler/ordermanagment')}
          className="flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 transition-all hover:gap-1.5 text-xs sm:ml-4 self-end sm:self-center flex-shrink-0"
        >
          <span>Fulfill Orders & Tasks</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
