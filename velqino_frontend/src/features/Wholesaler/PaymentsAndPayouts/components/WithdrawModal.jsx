"use client";

import React, { useState } from 'react';
import { 
  X, 
  Banknote, 
  CreditCard, 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ArrowUp,
  Clock,
  ShieldCheck
} from '@/utils/icons';

export default function WithdrawModal({ onClose }) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableBalance = 1245750;

  const methods = [
    { id: 'bank', name: 'Direct Bank NEFT/RTGS', icon: Banknote, details: 'HDFC Corporate ····1234', time: '1-2 days' },
    { id: 'upi', name: 'Instant UPI VPA', icon: CreditCard, details: 'rajesh@okhdfcbank', time: '< 10 mins' },
    { id: 'wallet', name: 'Merchant Wallet', icon: Wallet, details: 'Paytm Verified ····4210', time: 'Instant' }
  ];

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    if (parseFloat(amount) > availableBalance) {
      alert('Withdrawal amount exceeds your available liquid balance.');
      return;
    }
    
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    }, 1500);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="bg-white h-full flex flex-col shadow-2xl border-l border-slate-200 overflow-hidden">
      {/* Sticky Top Header */}
      <div className="px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-white sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
            <ArrowUp size={16} />
          </div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">Request Treasury Withdrawal</h2>
        </div>

        {/* Header Close Button */}
        <button 
          onClick={onClose} 
          type="button"
          aria-label="Close modal"
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200 cursor-pointer"
        >
          <X size={14} />
          <span>Close</span>
        </button>
      </div>

      {/* Body Content */}
      <form onSubmit={handleWithdraw} className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Available Balance Pill */}
        <div className="p-4 bg-gradient-to-br from-primary-50 to-slate-50 rounded-2xl border border-primary-200/60">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary-700">Available Liquid Reserve</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">{formatCurrency(availableBalance)}</p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-600" />
            Verified & Ready for instant settlement
          </p>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Withdrawal Amount (INR) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 25000"
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[10000, 25000, 50000, 100000].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val.toString())}
                className="px-2 py-1 text-xs font-bold bg-slate-100 text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg border border-slate-200/60 transition-colors cursor-pointer"
              >
                ₹{val.toLocaleString('en-IN')}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAmount(availableBalance.toString())}
              className="px-2 py-1 text-xs font-bold bg-primary-100 text-primary-800 rounded-lg border border-primary-200 hover:bg-primary-200 transition-colors cursor-pointer"
            >
              Full
            </button>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Disbursement Channel
          </label>
          <div className="space-y-2">
            {methods.map(method => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{method.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{method.details}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {method.time}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </form>

      {/* Sticky Bottom Footer */}
      <div className="p-4 border-t border-slate-200/80 bg-white sticky bottom-0 z-20 flex items-center justify-between gap-3 shadow-sm">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleWithdraw}
          disabled={!amount || processing}
          type="button"
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer active:scale-95"
        >
          {processing ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              <span>Authorizing Transfer...</span>
            </>
          ) : success ? (
            <>
              <CheckCircle size={15} />
              <span>Transfer Sent!</span>
            </>
          ) : (
            <>
              <ArrowUp size={15} />
              <span>Execute Withdrawal</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
