"use client";

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Sparkles,
  ShoppingBag
} from '../../../../utils/icons';

export default function LoyaltyProgram({ selectedCustomer, customerTotalSpent = 0, customerOrders = [] }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('points');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!selectedCustomer) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-2xs h-full flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 shadow-2xs">
          <Star size={26} />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-gray-900">Loyalty & Rewards</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          Select a customer to view their tier privileges, earned points ledger, and redemption status.
        </p>
      </div>
    );
  }

  const customerName = selectedCustomer.full_name || selectedCustomer.name || 'Customer';
  const spent = customerTotalSpent || selectedCustomer.totalSpent || selectedCustomer.total_spent || 0;

  // Calculate points
  const totalEarnedPoints = Math.floor(spent / 10);
  const redeemedPoints = selectedCustomer.redeemed_points || selectedCustomer.redeemedPoints || Math.floor(totalEarnedPoints * 0.2);
  const availablePoints = Math.max(0, totalEarnedPoints - redeemedPoints);

  // Tier info & next tier milestone
  const getTierInfo = (amount) => {
    if (amount >= 50000) {
      return {
        name: 'Platinum',
        nextTier: null,
        pointsToNext: 0,
        progress: 100,
        benefits: ['10% bonus points on all visits', 'Free express dispatch', 'Personalized anniversary gift', 'Priority concierge checkout']
      };
    }
    if (amount >= 25000) {
      const remaining = 50000 - amount;
      return {
        name: 'Gold',
        nextTier: 'Platinum',
        pointsToNext: Math.floor(remaining / 10),
        progress: Math.min(100, Math.round(((amount - 25000) / 25000) * 100)),
        benefits: ['5% bonus points', 'Free standard shipping', 'Birthday gift coupon']
      };
    }
    if (amount >= 10000) {
      const remaining = 25000 - amount;
      return {
        name: 'Silver',
        nextTier: 'Gold',
        pointsToNext: Math.floor(remaining / 10),
        progress: Math.min(100, Math.round(((amount - 10000) / 15000) * 100)),
        benefits: ['2% bonus points', 'Early access to seasonal sales']
      };
    }
    const remaining = 10000 - amount;
    return {
      name: 'Bronze',
      nextTier: 'Silver',
      pointsToNext: Math.floor(remaining / 10),
      progress: Math.min(100, Math.round((amount / 10000) * 100)),
      benefits: ['Welcome 50 bonus points', 'Standard reward accumulation']
    };
  };

  const tierInfo = getTierInfo(spent);

  // Points history
  const orders = customerOrders.length > 0 ? customerOrders : (selectedCustomer.orders || []);
  const transactions = orders.map((order, idx) => ({
    id: idx,
    type: 'earned',
    points: Math.floor(parseFloat(order.grand_total || 0) / 10),
    description: `Purchase ${order.order_number || `#ORD-${order.id}`}`,
    date: order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : 'Recent'
  })).filter(t => t.points > 0);

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between h-full flex-1">
      <div>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Loyalty & Privileges</h3>
              <p className="text-[11px] text-gray-400">Milestone perks for {customerName}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            {tierInfo.name} Tier
          </span>
        </div>

        {/* Points Summary Ribbon */}
        <div className="p-4 sm:p-5 grid grid-cols-3 gap-2.5 border-b border-gray-100 bg-gray-50/50">
          <div className="p-3 rounded-2xl bg-white border border-gray-200/70 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Available</p>
            <p className="text-base sm:text-lg font-extrabold text-primary-600 mt-0.5">
              {availablePoints.toLocaleString('en-IN')}
            </p>
            <span className="text-[9px] text-emerald-600 font-semibold">Active pts</span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-gray-200/70 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Earned</p>
            <p className="text-base sm:text-lg font-extrabold text-gray-900 mt-0.5">
              {totalEarnedPoints.toLocaleString('en-IN')}
            </p>
            <span className="text-[9px] text-gray-400">Lifetime</span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-gray-200/70 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Redeemed</p>
            <p className="text-base sm:text-lg font-extrabold text-gray-700 mt-0.5">
              {redeemedPoints.toLocaleString('en-IN')}
            </p>
            <span className="text-[9px] text-indigo-600 font-semibold">Discounts</span>
          </div>
        </div>

        {/* Milestone Progression Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-gray-700 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" />
              <span>{tierInfo.nextTier ? `Next: ${tierInfo.nextTier}` : 'Max Tier Achieved'}</span>
            </span>
            <span className="text-[11px] text-gray-400">
              {tierInfo.nextTier ? `${tierInfo.pointsToNext} pts to upgrade` : 'VIP Prestige'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-primary-600 transition-all duration-500"
              style={{ width: `${tierInfo.progress}%` }}
            />
          </div>
        </div>

        {/* Tier Benefits */}
        <div className="p-4 sm:p-5">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
            {tierInfo.name} Tier Privileges
          </p>
          <div className="space-y-2">
            {tierInfo.benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}