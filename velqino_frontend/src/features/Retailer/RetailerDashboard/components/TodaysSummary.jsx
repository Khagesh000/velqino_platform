"use client";

import React, { useMemo } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  CreditCard, 
  Wallet, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Zap
} from '../../../../utils/icons';

export default function TodaysSummary({ data = {}, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-44 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  const revenue = Number(data?.revenue || 0);
  const target = Number(data?.target || 3571.43);
  const totalTransactions = Number(data?.totalTransactions || 0);
  const averageBill = Number(data?.averageBill || 0);
  const totalItems = Number(data?.totalItems || 0);
  const busiestHour = data?.busiestHour || '10 AM';
  const busiestHourSales = Number(data?.busiestHourSales || 0);

  const percentAchieved = target > 0 
    ? Math.min(100, Math.round((revenue / target) * 100)) 
    : 0;

  const paymentMethods = data?.paymentMethods || { upi: 0, card: 0, cash: 0, wallet: 0 };
  const paymentTotal = (paymentMethods.upi || 0) + (paymentMethods.card || 0) + (paymentMethods.cash || 0) + (paymentMethods.wallet || 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <Calendar size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Today's Register</h3>
              <p className="text-xs text-gray-500">POS summary & counter performance</p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active Register
          </span>
        </div>

        {/* Target vs Revenue Hero Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-xs mb-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs font-medium text-primary-100">Revenue Achieved</span>
            <span className="text-xs font-bold text-accent-300">{percentAchieved}% of Target</span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black tracking-tight">₹{revenue.toLocaleString('en-IN')}</span>
            <span className="text-xs text-primary-200">/ ₹{Math.round(target).toLocaleString('en-IN')}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-primary-950/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white rounded-full h-full transition-all duration-500"
              style={{ width: `${percentAchieved}%` }}
            />
          </div>
        </div>

        {/* 3 Core POS Numbers */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-400">Transactions</p>
            <p className="text-base font-extrabold text-gray-900 mt-0.5">{totalTransactions}</p>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-400">Avg. Bill</p>
            <p className="text-base font-extrabold text-gray-900 mt-0.5">₹{Math.round(averageBill)}</p>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-400">Items Sold</p>
            <p className="text-base font-extrabold text-gray-900 mt-0.5">{totalItems}</p>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Payment Mode Mix
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white">
              <span className="text-gray-600 font-medium">📱 UPI</span>
              <span className="font-bold text-gray-900">₹{(paymentMethods.upi || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white">
              <span className="text-gray-600 font-medium">💳 Card</span>
              <span className="font-bold text-gray-900">₹{(paymentMethods.card || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white">
              <span className="text-gray-600 font-medium">💵 Cash</span>
              <span className="font-bold text-gray-900">₹{(paymentMethods.cash || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white">
              <span className="text-gray-600 font-medium">👛 Wallet</span>
              <span className="font-bold text-gray-900">₹{(paymentMethods.wallet || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Peak Hour Banner */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1.5 font-medium">
          <Clock size={14} className="text-primary-600" />
          <span>Busiest Hour: <strong>{busiestHour}</strong></span>
        </span>
        <span className="font-bold text-primary-700">₹{busiestHourSales.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
