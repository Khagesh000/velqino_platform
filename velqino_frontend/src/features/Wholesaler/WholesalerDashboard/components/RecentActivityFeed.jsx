"use client";

import React, { useState } from 'react';
import { useGetRecentActivityQuery } from '@/redux/wholesaler/slices/statsSlice';
import { Bell, Package, Wallet, MessageCircle, ShoppingBag, ChevronRight, Clock, Loader2 } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/RecentActivityFeed.scss';

export default function RecentActivityFeed() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 8;
  
  const { data: activityData, isLoading, refetch } = useGetRecentActivityQuery({ page, per_page: perPage });
  
  const activities = activityData?.data || [];
  const hasMore = activityData?.has_next || false;
  const totalCount = activityData?.count || 0;
  const currentPage = activityData?.page || 1;
  const totalPages = activityData?.total_pages || 1;

  const getActivityIcon = (activity) => {
    const color = activity.color || 'primary';
    return (
      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        color === 'primary' ? 'bg-primary-100 text-primary-600' :
        color === 'success' ? 'bg-success-100 text-success-600' :
        color === 'accent' ? 'bg-accent-100 text-accent-600' :
        'bg-warning-100 text-warning-600'
      }`}>
        {activity.type === 'order' && <Package size={16} />}
        {activity.type === 'payment' && <Wallet size={16} />}
        {activity.type === 'inquiry' && <MessageCircle size={16} />}
        {!activity.type && <Bell size={16} />}
      </div>
    );
  };

  const getStatusDot = (status) => {
    switch(status) {
      case 'pending': return 'bg-warning-500';
      case 'processing': return 'bg-primary-500';
      case 'delivered': return 'bg-success-500';
      case 'completed': return 'bg-success-500';
      case 'new': return 'bg-accent-500';
      case 'urgent': return 'bg-error-500';
      default: return 'bg-tertiary';
    }
  };

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
        <p className="text-sm text-tertiary">Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-accent-100 flex items-center justify-center text-accent-600">
            <Bell size={18} className="lg:w-5 lg:h-5" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-primary">Recent Activity</h3>
            <p className="text-xs lg:text-sm text-tertiary">Live updates from your store</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-600 rounded-full text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse" />
            <span>{totalCount} updates</span>
          </span>
        </div>
      </div>

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={32} className="text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No activities yet</h4>
          <p className="text-sm text-gray-500">When orders come in, they'll appear here</p>
        </div>
      )}

      {/* Activity Feed */}
      {activities.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`group relative flex items-start gap-3 p-3 lg:p-4 bg-surface-1 rounded-xl border border-light transition-all hover:shadow-md ${
                  hoveredItem === activity.id ? 'scale-[1.01]' : ''
                }`}
                onMouseEnter={() => setHoveredItem(activity.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Status Indicator Line */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
                  activity.color === 'primary' ? 'bg-primary-500' :
                  activity.color === 'success' ? 'bg-success-500' :
                  activity.color === 'accent' ? 'bg-accent-500' :
                  'bg-warning-500'
                }`} />

                {/* Icon */}
                <div className="relative">
                  {getActivityIcon(activity)}
                  <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${getStatusDot(activity.status)}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs lg:text-sm font-medium text-primary line-clamp-1">
                      {activity.message}
                    </p>
                    {activity.amount && (
                      <span className="text-xs lg:text-sm font-semibold text-primary whitespace-nowrap">
                        ₹{activity.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-tertiary">
                      <Clock size={12} className="lg:w-3 lg:h-3" />
                      <span className="text-xs text-tertiary">{activity.time}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-border-light" />
                    <span className={`text-xs capitalize ${
                      activity.status === 'urgent' ? 'text-error-600 font-medium' : 'text-secondary'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-white rounded-lg">
                  <ChevronRight size={16} className="text-tertiary group-hover:text-primary-600" />
                </button>

                {/* Hover Glow */}
                {hoveredItem === activity.id && (
                  <div className={`absolute inset-0 rounded-xl opacity-5 blur-lg pointer-events-none ${
                    activity.color === 'primary' ? 'bg-primary-500' :
                    activity.color === 'success' ? 'bg-success-500' :
                    activity.color === 'accent' ? 'bg-accent-500' :
                    'bg-warning-500'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalCount > perPage && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-light">
              <div className="text-xs text-tertiary">
                Showing {activities.length} of {totalCount} activities
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

          {/* View All Link */}
          <div className="flex items-center justify-between mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-light">
            <div className="flex items-center gap-3 text-xs text-tertiary">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Orders
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                Payments
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                Inquiries
              </span>
            </div>
            <button className="flex items-center gap-1 text-xs lg:text-sm text-primary-600 hover:text-primary-700 transition-all hover:gap-2">
              <span>View all</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}