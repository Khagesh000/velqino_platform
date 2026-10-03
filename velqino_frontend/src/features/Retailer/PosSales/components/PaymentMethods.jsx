"use client";

import React, { useState } from 'react';
import { 
  Banknote, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  PieChart, 
  Check, 
  Lock, 
  QrCode,
  ShieldCheck
} from '../../../../utils/icons';

export default function PaymentMethods({ 
  selectedPayment = 'cash', 
  setSelectedPayment, 
  totalAmount = 0 
}) {
  const [splitCash, setSplitCash] = useState(0);
  const [splitCard, setSplitCard] = useState(0);
  const [splitUPI, setSplitUPI] = useState(0);

  const methods = [
    { 
      id: 'cash', 
      name: 'Cash', 
      icon: <Banknote size={18} />, 
      theme: {
        active: 'border-emerald-500 bg-emerald-50/70 text-emerald-800 ring-2 ring-emerald-400',
        badge: 'text-emerald-700 bg-emerald-100',
        iconBg: 'bg-emerald-100 text-emerald-700'
      },
      desc: 'Physical currency tendering' 
    },
    { 
      id: 'upi', 
      name: 'UPI / QR', 
      icon: <Smartphone size={18} />, 
      theme: {
        active: 'border-primary-500 bg-primary-50/70 text-primary-900 ring-2 ring-primary-400',
        badge: 'text-primary-700 bg-primary-100',
        iconBg: 'bg-primary-100 text-primary-700'
      },
      desc: 'GPay, PhonePe, Paytm' 
    },
    { 
      id: 'card', 
      name: 'Card POS', 
      icon: <CreditCard size={18} />, 
      theme: {
        active: 'border-indigo-500 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-400',
        badge: 'text-indigo-700 bg-indigo-100',
        iconBg: 'bg-indigo-100 text-indigo-700'
      },
      desc: 'Visa, Mastercard, RuPay' 
    },
    { 
      id: 'wallet', 
      name: 'Store Credit', 
      icon: <Wallet size={18} />, 
      theme: {
        active: 'border-amber-500 bg-amber-50/70 text-amber-900 ring-2 ring-amber-400',
        badge: 'text-amber-700 bg-amber-100',
        iconBg: 'bg-amber-100 text-amber-700'
      },
      desc: 'Deposit / advance credit' 
    },
    { 
      id: 'split', 
      name: 'Split Pay', 
      icon: <PieChart size={18} />, 
      theme: {
        active: 'border-rose-500 bg-rose-50/70 text-rose-900 ring-2 ring-rose-400',
        badge: 'text-rose-700 bg-rose-100',
        iconBg: 'bg-rose-100 text-rose-700'
      },
      desc: 'Multi-tender split' 
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
            <CreditCard size={17} />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Payment Method
            </h3>
            <p className="text-[11px] text-gray-400">Select register settlement tender</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
          <ShieldCheck size={12} />
          <span>Encrypted POS</span>
        </div>
      </div>

      {/* Payment Modes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {methods.map((method) => {
          const isSelected = selectedPayment === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedPayment(method.id)}
              className={`
                p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between
                ${isSelected 
                  ? `${method.theme.active} shadow-xs` 
                  : 'bg-white border-gray-200/90 hover:border-gray-300 hover:bg-gray-50/60'
                }
              `}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className={`p-1.5 rounded-xl ${method.theme.iconBg}`}>
                  {method.icon}
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  {method.name}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                  {method.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Drawer for UPI / QR Code preview */}
      {selectedPayment === 'upi' && (
        <div className="mt-3.5 p-3.5 rounded-2xl bg-primary-50/50 border border-primary-200 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 bg-white rounded-xl border border-primary-200 flex items-center justify-center text-primary-700 shadow-2xs font-mono font-bold text-xs">
                QR
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">UPI Instant Dynamic QR</p>
                <p className="text-[11px] text-gray-500">Scan via BHIM, GPay, PhonePe or Paytm</p>
                <p className="text-[10px] font-mono text-primary-700 font-bold mt-0.5">UPI ID: store@velqino</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-primary-800 bg-white px-2.5 py-1 rounded-xl border border-primary-100 shadow-2xs">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Drawer for Split Payment */}
      {selectedPayment === 'split' && (
        <div className="mt-3.5 p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-900">Split Bill Allocation</span>
            <span className="text-gray-500">Total: ₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-0.5">💵 Cash (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={splitCash || ''}
                onChange={(e) => setSplitCash(Number(e.target.value) || 0)}
                className="w-full px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-0.5">💳 Card (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={splitCard || ''}
                onChange={(e) => setSplitCard(Number(e.target.value) || 0)}
                className="w-full px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-0.5">📱 UPI (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={splitUPI || ''}
                onChange={(e) => setSplitUPI(Number(e.target.value) || 0)}
                className="w-full px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
