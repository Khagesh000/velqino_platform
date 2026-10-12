"use client";

import React from 'react';
import { Clock, LogIn, ShoppingBag, Heart, ShieldCheck } from '../../../utils/icons';

export default function AccountActivity() {
  const activities = [
    { 
      icon: <LogIn size={14} />, 
      title: 'Authenticated Session', 
      desc: 'Secure portal login verified', 
      time: 'Just now', 
      bubble: 'bg-emerald-50 text-emerald-600' 
    },
    { 
      icon: <ShoppingBag size={14} />, 
      title: 'Order Tracking Sync', 
      desc: 'Dispatched package tracking checked', 
      time: '2 hours ago', 
      bubble: 'bg-primary-50 text-primary-600' 
    },
    { 
      icon: <Heart size={14} />, 
      title: 'Wishlist Item Saved', 
      desc: 'Item added to personal favorites', 
      time: 'Yesterday', 
      bubble: 'bg-rose-50 text-rose-600' 
    },
  ];
  
  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
          <Clock size={16} />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-gray-900">Recent Account Activity</h3>
          <p className="text-[11px] text-gray-400">Security &amp; shopping events</p>
        </div>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 p-2.5 rounded-2xl bg-gray-50/60 border border-gray-100">
            <div className={`w-8 h-8 rounded-xl ${activity.bubble} flex items-center justify-center shrink-0 mt-0.5 shadow-2xs`}>
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{activity.title}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{activity.desc}</p>
              <span className="text-[10px] text-gray-400 font-semibold mt-1 inline-block">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
