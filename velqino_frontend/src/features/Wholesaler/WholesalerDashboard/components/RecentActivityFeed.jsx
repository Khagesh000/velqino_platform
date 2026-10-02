"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Package, 
  Wallet, 
  MessageCircle, 
  Clock, 
  ChevronRight,
  Loader2 
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/RecentActivityFeed.scss';

export default function RecentActivityFeed({ activities, isLoading, page, onPageChange }) {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState(null);
  const activityList = Array.isArray(activities) ? activities : (activities?.items || activities?.data || []);
  const totalCount = activityList.length;

  const getActivityIcon = (activity) => {
    switch(activity?.type?.toLowerCase()) {
      case 'order': return <Package size={15} />;
      case 'payment': return <Wallet size={15} />;
      case 'inquiry': return <MessageCircle size={15} />;
      default: return <Bell size={15} />;
    }
  };

  const getActivityColor = (activity) => {
    switch(activity?.type?.toLowerCase()) {
      case 'order': return 'bg-primary-100 text-primary-600';
      case 'payment': return 'bg-emerald-100 text-emerald-600';
      case 'inquiry': return 'bg-amber-100 text-amber-600';
      default: return 'bg-indigo-100 text-indigo-600';
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
      case 'completed': 
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'pending': 
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'processing': 
        return 'bg-primary-50 text-primary-700 border-primary-200/80';
      case 'cancelled': 
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      default: 
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleActivityClick = (activity) => {
    if (activity?.type?.toLowerCase() === 'payment') {
      router.push('/wholesaler/paymentsandpayouts');
    } else {
      router.push('/wholesaler/ordermanagment');
    }
  };

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
        <div className="flex items-center justify-between mb-4 lg:mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-bold text-slate-900">Recent Activity</h3>
              <p className="text-xs text-slate-500">Live transaction and fulfillment log</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
              <span>{totalCount} updates</span>
            </span>

            {/* Live Feed CTA */}
            <button
              type="button"
              onClick={() => router.push('/wholesaler/ordermanagment')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-200/80 rounded-xl text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-all shadow-2xs group"
            >
              <span>Live Activity</span>
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {activityList.length === 0 && (
          <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-xs flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Bell size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">No activity logged yet</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">When orders and payments are registered, updates will stream here</p>
            <button
              type="button"
              onClick={() => router.push('/wholesaler/ordermanagment')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-50 text-primary-700 border border-primary-200/80 rounded-xl text-xs font-semibold hover:bg-primary-100 transition-all shadow-2xs"
            >
              <span>Monitor Orders</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Activity Feed Grid */}
        {activityList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {activityList.map((activity) => (
              <div
                key={activity.id}
                role="button"
                tabIndex={0}
                onClick={() => handleActivityClick(activity)}
                className={`group relative flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer ${
                  hoveredItem === activity.id ? 'translate-y-[-2px] border-primary-200' : ''
                }`}
                onMouseEnter={() => setHoveredItem(activity.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Left Type Icon */}
                <div className={`w-9 h-9 rounded-xl ${getActivityColor(activity)} flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5`}>
                  {getActivityIcon(activity)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1.5 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors" title={activity.message}>
                      {activity.message}
                    </p>
                    {activity.amount !== undefined && (
                      <span className="text-xs font-bold text-slate-900 flex-shrink-0 ml-1">
                        ₹{Number(activity.amount).toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock size={11} />
                      <span className="text-[11px]">{activity.time || activity.date}</span>
                    </div>

                    {activity.status && (
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(activity.status)}`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Category Legend & View All CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary-500" />
            <span className="text-[11px] font-medium">Orders</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium">Payments</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[11px] font-medium">Inquiries</span>
          </span>
        </div>
        
        <button
          type="button"
          onClick={() => router.push('/wholesaler/ordermanagment')}
          className="flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 transition-all hover:gap-1.5 text-xs flex-shrink-0"
        >
          <span>View All Transactions</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
