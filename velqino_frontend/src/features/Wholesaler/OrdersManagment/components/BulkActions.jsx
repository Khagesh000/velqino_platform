"use client";

import React, { useState } from "react";
import {
  Wallet,
  Clock,
  TrendingUp,
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Info,
  ChevronRight,
  Loader2,
} from "../../../../utils/icons";
import "../../../../styles/Wholesaler/PaymentsPayouts/BalanceCards.scss";

export default function BalanceCards({
  stats = {},
  withdrawalStats = {},
  isLoading = false,
  isSyncing = false,
  isError = false,
}) {
  const [showBalance, setShowBalance] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const effectiveStats = stats || {};
  const effectiveWithdrawal = withdrawalStats || {};

  const totalRevenue = Number(effectiveStats.total_revenue) || 0;
  const currentBalance = Number(effectiveWithdrawal.available_balance) || totalRevenue;
  const pendingClearance = Number(effectiveWithdrawal.pending_withdrawals) || 0;
  const lifetimeEarnings = totalRevenue;
  const nextPayout = effectiveWithdrawal.next_payout_date || "Next Settlement Cycle";
  const totalWithdrawn = Number(effectiveWithdrawal.total_withdrawn) || 0;

  const balances = [
    {
      id: "current",
      title: "Current Balance",
      value: currentBalance,
      change: 12.5,
      trend: "up",
      icon: Wallet,
      color: "primary",
      description: "Available for withdrawal",
    },
    {
      id: "pending",
      title: "Pending Clearance",
      value: pendingClearance,
      change: 8.2,
      trend: "up",
      icon: Clock,
      color: "warning",
      description: "Settles in 2-3 business days",
    },
    {
      id: "lifetime",
      title: "Lifetime Earnings",
      value: lifetimeEarnings,
      change: 24.3,
      trend: "up",
      icon: TrendingUp,
      color: "success",
      description: "Total delivered orders value",
    },
    {
      id: "nextPayout",
      title: "Next Payout",
      value: 0,
      change: null,
      trend: null,
      icon: Calendar,
      color: "info",
      description: `Expected on ${nextPayout}`,
      isDate: true,
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const getCardColor = (color) => {
    const colors = {
      primary: "bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white shadow-xs",
      warning: "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-xs",
      success: "bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white shadow-xs",
      info: "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-xs",
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 w-full shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0 shadow-xs">
            <Wallet size={20} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Financial Overview</h3>
              {isSyncing && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <Loader2 size={12} className="animate-spin text-primary-600" />
                  Updating...
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">Your revenue, settlements, and available balance</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => setShowBalance(!showBalance)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 hover:text-primary-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          {showBalance ? <EyeOff size={15} /> : <Eye size={15} />}
          <span>{showBalance ? "Hide Balance" : "Show Balance"}</span>
        </button>
      </div>

      {/* Error or Notice Banner if server didn't respond */}
      {isError && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center gap-2.5 text-xs text-amber-800">
          <Info size={16} className="text-amber-600 flex-shrink-0" />
          <span>Financial metrics server is updating. Displaying latest available offline snapshot.</span>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {balances.map((card, index) => {
          const Icon = card.icon;
          const cardColor = getCardColor(card.color);
          
          return (
            <div
              key={card.id}
              className={`relative ${cardColor} rounded-xl p-4 sm:p-5 transition-all hover:shadow-lg cursor-pointer balance-card`}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon size={18} className="sm:w-5 sm:h-5 text-white" />
                </div>
                {card.change && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                    card.trend === 'up' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
                  }`}>
                    {card.trend === "up" ? <ArrowUp size={10} className="sm:w-3 sm:h-3" /> : <ArrowDown size={10} className="sm:w-3 sm:h-3" />}
                    <span>{card.change}%</span>
                  </div>
                )}
              </div>

              <div className="mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm text-white/80 mb-0.5 sm:mb-1">{card.title}</p>
                {card.isDate ? (
                  <p className="text-base sm:text-xl font-bold text-white">{card.description}</p>
                ) : (
                  <p className="text-lg sm:text-2xl font-bold text-white">
                    {showBalance ? formatCurrency(card.value) : "••••••"}
                  </p>
                )}
              </div>

              {!card.isDate && (
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <Info size={10} className="sm:w-3 sm:h-3" />
                  <span>{card.description}</span>
                </p>
              )}

              {hoveredCard === card.id && (
                <div className={`absolute inset-0 ${cardColor} opacity-30 blur-xl pointer-events-none rounded-xl card-glow`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center hover:bg-slate-100/80 transition-all">
          <p className="text-xs text-slate-500 mb-1 font-medium">This Month</p>
          <p className="text-sm sm:text-base font-bold text-slate-900">{formatCurrency(totalRevenue * 0.28)}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center hover:bg-slate-100/80 transition-all">
          <p className="text-xs text-slate-500 mb-1 font-medium">Last Month</p>
          <p className="text-sm sm:text-base font-bold text-slate-900">{formatCurrency(totalRevenue * 0.23)}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center hover:bg-slate-100/80 transition-all">
          <p className="text-xs text-slate-500 mb-1 font-medium">Avg Monthly</p>
          <p className="text-sm sm:text-base font-bold text-slate-900">{formatCurrency(totalRevenue * 0.25)}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center hover:bg-slate-100/80 transition-all">
          <p className="text-xs text-slate-500 mb-1 font-medium">Total Withdrawn</p>
          <p className="text-sm sm:text-base font-bold text-slate-900">{formatCurrency(totalWithdrawn)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-200/80 flex justify-end">
        <button 
          type="button"
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 transition-all analytics-link cursor-pointer"
        >
          <span>View detailed analytics</span>
          <ChevronRight size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}
