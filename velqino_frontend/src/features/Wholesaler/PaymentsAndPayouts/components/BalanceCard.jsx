"use client";

import React, { useState } from "react";
import {
  Wallet,
  Clock,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Info,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Building
} from "@/utils/icons";
import "../../../../styles/Wholesaler/PaymentsPayouts/BalanceCards.scss";

export default function BalanceCard() {
  const [showBalance, setShowBalance] = useState(true);

  const balances = [
    {
      id: "current",
      title: "Current Available Balance",
      value: 1245750,
      change: "+12.5%",
      trend: "up",
      icon: Wallet,
      theme: {
        bg: "bg-primary-50/70",
        border: "border-primary-200/80",
        text: "text-primary-700",
        iconBg: "bg-primary-500 text-white",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-200"
      },
      description: "Available for instant bank withdrawal",
    },
    {
      id: "pending",
      title: "Pending Escrow Clearance",
      value: 245000,
      change: "48h release",
      trend: "up",
      icon: Clock,
      theme: {
        bg: "bg-amber-50/70",
        border: "border-amber-200/80",
        text: "text-amber-800",
        iconBg: "bg-amber-500 text-white",
        badge: "bg-amber-100 text-amber-800 border-amber-200"
      },
      description: "Orders currently in transit & fulfillment",
    },
    {
      id: "lifetime",
      title: "Lifetime Gross Earnings",
      value: 8750000,
      change: "+24.3%",
      trend: "up",
      icon: TrendingUp,
      theme: {
        bg: "bg-emerald-50/70",
        border: "border-emerald-200/80",
        text: "text-emerald-800",
        iconBg: "bg-emerald-600 text-white",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-200"
      },
      description: "Total wholesale revenue settled to date",
    },
    {
      id: "nextPayout",
      title: "Scheduled Automated Payout",
      value: 324500,
      change: "Auto-disburse",
      trend: "neutral",
      icon: Calendar,
      theme: {
        bg: "bg-blue-50/70",
        border: "border-blue-200/80",
        text: "text-blue-800",
        iconBg: "bg-blue-600 text-white",
        badge: "bg-blue-100 text-blue-800 border-blue-200"
      },
      description: "Direct NEFT batch on 25th of month",
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
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-2xs">
            <Wallet size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Treasury & Liquidity Overview
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Reserve
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Available liquid balance, upcoming settlements, and earnings tracking
            </p>
          </div>
        </div>

        {/* Privacy Balance Visibility Toggle */}
        <button
          onClick={() => setShowBalance(!showBalance)}
          type="button"
          aria-label={showBalance ? "Hide balance values" : "Show balance values"}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200/80 transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          {showBalance ? <EyeOff size={15} /> : <Eye size={15} />}
          <span>{showBalance ? "Obscure Values" : "Show Values"}</span>
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {balances.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-md ${card.theme.bg} ${card.theme.border}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs ${card.theme.iconBg}`}>
                  <Icon size={19} />
                </div>
                {card.change && (
                  <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold border ${card.theme.badge}`}>
                    {card.trend === "up" && <ArrowUpRight size={12} />}
                    {card.trend === "down" && <ArrowDownRight size={12} />}
                    {card.change}
                  </span>
                )}
              </div>
              
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{card.title}</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {showBalance ? formatCurrency(card.value) : "₹ ••••••••"}
                </p>
                <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                  <Info size={12} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{card.description}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Settled Velocity Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="bg-slate-50/80 rounded-xl border border-slate-200/60 p-3 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">This Month</p>
          <p className="text-sm sm:text-base font-extrabold text-slate-900">
            {showBalance ? "₹2,45,000" : "₹ ••••••"}
          </p>
        </div>
        <div className="bg-slate-50/80 rounded-xl border border-slate-200/60 p-3 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Last Month</p>
          <p className="text-sm sm:text-base font-extrabold text-slate-900">
            {showBalance ? "₹1,98,000" : "₹ ••••••"}
          </p>
        </div>
        <div className="bg-slate-50/80 rounded-xl border border-slate-200/60 p-3 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Monthly Average</p>
          <p className="text-sm sm:text-base font-extrabold text-slate-900">
            {showBalance ? "₹2,10,000" : "₹ ••••••"}
          </p>
        </div>
        <div className="bg-slate-50/80 rounded-xl border border-slate-200/60 p-3 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Settled Orders</p>
          <p className="text-sm sm:text-base font-extrabold text-slate-900">1,245</p>
        </div>
      </div>
    </div>
  );
}
