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
} from "../../../../utils/icons";
import "../../../../styles/Wholesaler/PaymentsPayouts/BalanceCards.scss";

export default function BalanceCards() {
  const [showBalance, setShowBalance] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const balances = [
    {
      id: "current",
      title: "Current Balance",
      value: 1245750,
      change: 12.5,
      trend: "up",
      icon: Wallet,
      color: "primary",
      description: "Available for withdrawal",
    },
    {
      id: "pending",
      title: "Pending Clearance",
      value: 245000,
      change: 8.2,
      trend: "up",
      icon: Clock,
      color: "warning",
      description: "Will clear in 3-5 days",
    },
    {
      id: "lifetime",
      title: "Lifetime Earnings",
      value: 8750000,
      change: 24.3,
      trend: "up",
      icon: TrendingUp,
      color: "success",
      description: "Total earnings to date",
    },
    {
      id: "nextPayout",
      title: "Next Payout",
      value: 324500,
      change: null,
      trend: null,
      icon: Calendar,
      color: "info",
      description: "Expected on Mar 25, 2024",
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getCardColor = (color) => {
    const colors = {
      primary: "bg-primary-500",
      warning: "bg-warning-500",
      success: "bg-success-500",
      info: "bg-info-500",
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
            <Wallet size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Financial Overview</h3>
            <p className="text-xs sm:text-sm text-gray-500">Your earnings and balance summary</p>
          </div>
        </div>
        <button 
          onClick={() => setShowBalance(!showBalance)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
        >
          {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>{showBalance ? "Hide Balance" : "Show Balance"}</span>
        </button>
      </div>

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
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {showBalance ? formatCurrency(card.value) : "••••••"}
                </p>
              </div>

              <p className="text-xs text-white/70 flex items-center gap-1">
                <Info size={10} className="sm:w-3 sm:h-3" />
                <span>{card.description}</span>
              </p>

              {hoveredCard === card.id && (
                <div className={`absolute inset-0 ${cardColor} opacity-30 blur-xl pointer-events-none rounded-xl card-glow`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-all">
          <p className="text-xs text-gray-500 mb-1">This Month</p>
          <p className="text-sm sm:text-base font-semibold text-gray-900">₹2,45,000</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-all">
          <p className="text-xs text-gray-500 mb-1">Last Month</p>
          <p className="text-sm sm:text-base font-semibold text-gray-900">₹1,98,000</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-all">
          <p className="text-xs text-gray-500 mb-1">Avg Monthly</p>
          <p className="text-sm sm:text-base font-semibold text-gray-900">₹2,10,000</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-all">
          <p className="text-xs text-gray-500 mb-1">Total Orders</p>
          <p className="text-sm sm:text-base font-semibold text-gray-900">1,245</p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-200 flex justify-end">
        <button className="flex items-center gap-1 text-xs sm:text-sm text-primary-600 hover:text-primary-700 transition-all analytics-link">
          <span>View detailed analytics</span>
          <ChevronRight size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}