"use client";

import React, { useState } from 'react';
import { useGetPendingTasksQuery } from '@/redux/wholesaler/slices/statsSlice';
import { ClipboardList, Package, Clock, Wallet, AlertCircle, CheckCircle, ArrowRight, Timer, Loader2 } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/PendingTasks.scss';

export default function PendingTasks() {
  const [hoveredTask, setHoveredTask] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 8;
  
  const { data: tasksData, isLoading, refetch } = useGetPendingTasksQuery({ 
    page, 
    per_page: perPage, 
    type: activeTab 
  });
  
  const displayedTasks = tasksData?.data || [];
  const hasMore = tasksData?.has_next || false;
  const totalCount = tasksData?.count || 0;
  const currentPage = tasksData?.page || 1;
  const totalPages = tasksData?.total_pages || 1;
  const stats = tasksData?.stats || { high: 0, medium: 0, low: 0, total: 0 };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <AlertCircle size={14} />;
      case 'medium': return <Timer size={14} />;
      case 'low': return <Clock size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'order': return <Package size={16} />;
      case 'product': return <ClipboardList size={16} />;
      case 'payout': return <Wallet size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'order': return 'bg-primary-100 text-primary-600';
      case 'product': return 'bg-accent-100 text-accent-600';
      case 'payout': return 'bg-success-100 text-success-600';
      default: return 'bg-surface-2 text-secondary';
    }
  };

  const getTimeColor = (time) => {
    if (time && time.includes('min')) return 'text-error-600';
    if (time && time.includes('hour')) return 'text-warning-600';
    return 'text-tertiary';
  };

  const tabs = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'orders', label: 'Orders', count: 0, icon: <Package size={14} /> },
    { id: 'products', label: 'Products', count: 0, icon: <ClipboardList size={14} /> },
    { id: 'payouts', label: 'Payouts', count: 0, icon: <Wallet size={14} /> }
  ];

  const loadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const loadPrevious = () => {
    if (currentPage > 1) {
      setPage(prev => prev - 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <div className="bg-white rounded-2xl border border-light p-6 text-center">
        <Loader2 size={32} className="animate-spin text-primary-500 mx-auto mb-3" />
        <p className="text-sm text-tertiary">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-warning-100 flex items-center justify-center text-warning-600">
            <ClipboardList size={18} className="lg:w-5 lg:h-5" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-primary">Pending Tasks</h3>
            <p className="text-xs lg:text-sm text-tertiary">{stats.total} items need attention</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-surface-1 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-tertiary hover:text-secondary'
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-surface-2 text-tertiary'
              }`}>
                {activeTab === tab.id ? totalCount : '0'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {displayedTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h4>
          <p className="text-sm text-gray-500">No pending tasks at the moment</p>
        </div>
      )}

      {/* Tasks Timeline */}
      {displayedTasks.length > 0 && (
        <>
          <div className="relative">
            <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary-200 via-accent-200 to-success-200 rounded-full" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 relative">
              {displayedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group relative flex items-start gap-3 pl-8 ${
                    hoveredTask === task.id ? 'translate-x-1' : ''
                  }`}
                  onMouseEnter={() => setHoveredTask(task.id)}
                  onMouseLeave={() => setHoveredTask(null)}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-3 w-6 h-6 rounded-full border-4 border-white ${
                    task.priority === 'high' ? 'bg-error-500' :
                    task.priority === 'medium' ? 'bg-warning-500' : 'bg-accent-500'
                  } shadow-md z-10 transition-all group-hover:scale-125`} />

                  {/* Task Card */}
                  <div className="flex-1 bg-surface-1 rounded-xl p-3 lg:p-4 border border-light transition-all hover:shadow-md">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${getTypeColor(task.type)} flex items-center justify-center flex-shrink-0`}>
                          {getTypeIcon(task.type)}
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-primary">{task.task}</h4>
                          <p className="text-xs text-secondary mt-0.5">
                            {task.customer && task.customer}
                            {task.product && `${task.product} • SKU: ${task.sku}`}
                            {task.vendor && task.vendor}
                          </p>
                        </div>
                      </div>

                      {task.amount && (
                        <span className="text-sm font-semibold text-primary bg-white px-2 py-1 rounded-lg border border-light">
                          {task.amount}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          task.priority === 'high' ? 'bg-error-100 text-error-600' :
                          task.priority === 'medium' ? 'bg-warning-100 text-warning-600' :
                          'bg-accent-100 text-accent-600'
                        }`}>
                          {getPriorityIcon(task.priority)}
                          <span className="capitalize">{task.priority}</span>
                        </span>

                        {task.time && (
                          <span className={`flex items-center gap-1 text-xs ${getTimeColor(task.time)}`}>
                            <Clock size={12} />
                            {task.time}
                          </span>
                        )}
                      </div>

                      <button className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-all hover:gap-2">
                        <span>Handle</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {hoveredTask === task.id && (
                    <div className={`absolute inset-0 rounded-xl opacity-5 blur-lg pointer-events-none ${
                      task.priority === 'high' ? 'bg-error-500' :
                      task.priority === 'medium' ? 'bg-warning-500' : 'bg-accent-500'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalCount > perPage && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-light">
              <div className="text-xs text-tertiary">
                Showing {displayedTasks.length} of {totalCount} tasks
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadPrevious}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs rounded-lg border border-light hover:bg-surface-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="text-xs text-tertiary">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={loadMore}
                  disabled={!hasMore}
                  className="px-3 py-1.5 text-xs rounded-lg border border-light hover:bg-surface-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Summary Footer */}
          <div className="grid grid-cols-3 gap-2 mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-light">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-error-600 mb-1">
                <AlertCircle size={14} />
                <span className="text-sm font-semibold">{stats.high}</span>
              </div>
              <p className="text-xs text-tertiary">High priority</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-warning-600 mb-1">
                <Timer size={14} />
                <span className="text-sm font-semibold">{stats.medium}</span>
              </div>
              <p className="text-xs text-tertiary">Medium</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-accent-600 mb-1">
                <Clock size={14} />
                <span className="text-sm font-semibold">{stats.low}</span>
              </div>
              <p className="text-xs text-tertiary">Low priority</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}