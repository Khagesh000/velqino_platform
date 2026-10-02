"use client";

import React, { useState } from 'react';
import {
  Wallet,
  ArrowUp,
  Banknote,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Calendar,
  History,
  Plus,
  Trash2,
  Edit,
  Shield,
  Sparkles
} from '@/utils/icons';
import '../../../../styles/Wholesaler/PaymentsPayouts/WithdrawalSection.scss';

export default function WithdrawalSection({ onWithdraw }) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [showHistory, setShowHistory] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const availableBalance = 1245750;

  const paymentMethods = [
    {
      id: 'bank',
      name: 'Direct Bank NEFT/RTGS',
      icon: Banknote,
      details: 'HDFC Bank · A/C Ending in 1234',
      processingTime: '1-2 business days',
      minAmount: 1000,
      maxAmount: 500000
    },
    {
      id: 'upi',
      name: 'Instant UPI VPA',
      icon: CreditCard,
      details: 'rajesh@okhdfcbank',
      processingTime: 'Realtime (Under 10 mins)',
      minAmount: 100,
      maxAmount: 100000
    },
    {
      id: 'wallet',
      name: 'Corporate Wallet',
      icon: Wallet,
      details: 'Paytm Verified · +91 98765 43210',
      processingTime: 'Instant Transfer',
      minAmount: 100,
      maxAmount: 50000
    }
  ];

  const withdrawalHistory = [
    { id: 'WDR-001', date: '2024-03-15', amount: 50000, method: 'Bank Transfer (HDFC)', status: 'Completed', reference: 'UTR-9872164' },
    { id: 'WDR-002', date: '2024-03-01', amount: 25000, method: 'UPI VPA', status: 'Completed', reference: 'UPI-4312890' },
    { id: 'WDR-003', date: '2024-02-15', amount: 100000, method: 'Bank Transfer (HDFC)', status: 'Completed', reference: 'UTR-8234190' },
    { id: 'WDR-004', date: '2024-02-01', amount: 15000, method: 'Corporate Wallet', status: 'Processing', reference: 'WLT-1102948' }
  ];

  const currentMethod = paymentMethods.find(m => m.id === selectedMethod) || paymentMethods[0];

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < currentMethod.minAmount) {
      alert(`Minimum withdrawal amount for ${currentMethod.name} is ₹${currentMethod.minAmount.toLocaleString('en-IN')}`);
      return;
    }
    if (amount > availableBalance) {
      alert('Insufficient available balance in your treasury account');
      return;
    }
    if (amount > currentMethod.maxAmount) {
      alert(`Maximum withdrawal per single transfer is ₹${currentMethod.maxAmount.toLocaleString('en-IN')}`);
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setWithdrawSuccess(true);
      setTimeout(() => {
        setWithdrawSuccess(false);
        setWithdrawAmount('');
        onWithdraw?.();
      }, 2000);
    }, 1500);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="withdrawal-section bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-2xs">
            <ArrowUp size={19} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Treasury Disbursement Request
            </h3>
            <p className="text-xs text-slate-500">
              Withdraw available merchant liquidity to verified bank accounts or instant UPI
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200/80 shadow-2xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <History size={14} className="text-primary-600" />
          <span>Disbursement Logs</span>
          <ChevronDown size={14} className={`transition-transform duration-200 text-slate-400 ${showHistory ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Available Liquidity Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-primary-500/10 via-primary-50 to-slate-50 rounded-2xl border border-primary-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Wallet size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700">Available Liquid Reserve</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {formatCurrency(availableBalance)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle size={13} className="text-emerald-600" />
              Instant Transfer Ready
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Withdrawal Amount (INR) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">₹</span>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter transfer amount (e.g. 50000)"
              className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-100 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Quick Amount Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Select:</span>
            {[5000, 10000, 25000, 50000, 100000].map(amount => (
              <button
                key={amount}
                type="button"
                onClick={() => setWithdrawAmount(amount.toString())}
                className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 border border-slate-200/80 rounded-lg transition-all cursor-pointer shadow-2xs"
              >
                ₹{amount.toLocaleString('en-IN')}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setWithdrawAmount(availableBalance.toString())}
              className="px-2.5 py-1 text-xs font-bold bg-primary-100 text-primary-800 border border-primary-200 rounded-lg hover:bg-primary-200 transition-all cursor-pointer shadow-2xs"
            >
              Full Balance
            </button>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Disbursement Destination
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {paymentMethods.map(method => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon size={16} />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-primary-600" />
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isSelected ? 'text-primary-900' : 'text-slate-800'}`}>
                      {method.name}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{method.details}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transfer Metadata Pill */}
        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock size={15} className="text-slate-400" />
            <span>Processing Schedule: <strong className="text-slate-800 font-bold">{currentMethod.processingTime}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>Min: <strong>₹{currentMethod.minAmount.toLocaleString('en-IN')}</strong></span>
            <span>·</span>
            <span>Max per Txn: <strong>₹{currentMethod.maxAmount.toLocaleString('en-IN')}</strong></span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleWithdraw}
          disabled={!withdrawAmount || processing}
          type="button"
          className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          {processing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying & Dispatching NEFT Batch...</span>
            </>
          ) : withdrawSuccess ? (
            <>
              <CheckCircle size={18} />
              <span>Disbursement Request Dispatched!</span>
            </>
          ) : (
            <>
              <ArrowUp size={18} />
              <span>Authorize & Execute Transfer</span>
            </>
          )}
        </button>
      </div>

      {/* Expandable History Table */}
      {showHistory && (
        <div className="border-t border-slate-200/80 bg-slate-50/30 p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <History size={15} className="text-primary-600" />
              Recent Disbursement History
            </h4>
            <span className="text-[11px] text-slate-500">Showing last 4 transfers</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Disbursed Amount</th>
                  <th className="px-4 py-2.5">Transfer Channel</th>
                  <th className="px-4 py-2.5">Bank Status</th>
                  <th className="px-4 py-2.5 text-right">Reference / UTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawalHistory.map(history => (
                  <tr key={history.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700">{history.date}</td>
                    <td className="px-4 py-3 font-extrabold text-slate-900">{formatCurrency(history.amount)}</td>
                    <td className="px-4 py-3 text-slate-600">{history.method}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        history.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          history.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        {history.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[11px] text-slate-500">{history.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
