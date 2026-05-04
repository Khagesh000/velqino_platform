"use client";

import React from 'react';
import { Clock, LogIn, ShoppingBag, Heart } from '../../../utils/icons';

export default function AccountActivity() {
  const activities = [
    { icon: <LogIn size={14} />, action: 'Logged in', time: '2 hours ago', color: 'text-blue-500' },
    { icon: <ShoppingBag size={14} />, action: 'Placed order #ORD-3ED5AA86', time: '1 day ago', color: 'text-green-500' },
    { icon: <Heart size={14} />, action: 'Added item to wishlist', time: '2 days ago', color: 'text-pink-500' },
  ];
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`${activity.color}`}>{activity.icon}</div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{activity.action}</p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}