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

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Wallet size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Financial Overview</h3>
            <p className="text-sm text-gray-500">Your earnings and balance summary</p>
          </div>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
        >
          {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {balances.map((card, index) => {
          const Icon = card.icon;
          const bgColors = {
            primary: "bg-blue-500",
            warning: "bg-orange-500",
            success: "bg-green-500",
            info: "bg-cyan-500"
          };
          const lightBgColors = {
            primary: "bg-blue-50",
            warning: "bg-orange-50",
            success: "bg-green-50",
            info: "bg-cyan-50"
          };
          const textColors = {
            primary: "text-blue-600",
            warning: "text-orange-600",
            success: "text-green-600",
            info: "text-cyan-600"
          };
          
          return (
            <div
              key={card.id}
              className={`${lightBgColors[card.color]} rounded-xl p-5 border border-${card.color}-200 hover:shadow-lg transition-all cursor-pointer`}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${bgColors[card.color]} bg-opacity-20 flex items-center justify-center ${textColors[card.color]}`}>
                  <Icon size={20} />
                </div>
                {card.change && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    card.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {card.trend === "up" ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                    <span>{card.change}%</span>
                  </div>
                )}
              </div>
              
              <div className="mb-2">
                <p className={`text-sm ${textColors[card.color]} mb-1`}>{card.title}</p>
                <p className="text-xl font-bold text-gray-900">
                  {showBalance ? formatCurrency(card.value) : "••••••"}
                </p>
              </div>
              
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Info size={10} />
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">This Month</p>
          <p className="text-base font-semibold text-gray-900">₹2,45,000</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Last Month</p>
          <p className="text-base font-semibold text-gray-900">₹1,98,000</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Avg Monthly</p>
          <p className="text-base font-semibold text-gray-900">₹2,10,000</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Orders</p>
          <p className="text-base font-semibold text-gray-900">1,245</p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-200 flex justify-end">
        <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-all">
          <span>View detailed analytics</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}