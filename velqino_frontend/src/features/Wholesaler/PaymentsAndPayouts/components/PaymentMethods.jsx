"use client";

import React, { useState } from 'react';
import {
  Banknote,
  CreditCard,
  Wallet,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  MoreVertical,
  X,
  Star,
  ChevronDown,
  Building,
  ShieldCheck,
  Sparkles
} from '@/utils/icons';
import '../../../../styles/Wholesaler/PaymentsPayouts/PaymentMethods.scss';

export default function PaymentMethods() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'bank',
    name: '',
    details: '',
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    walletNumber: ''
  });

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'bank',
      name: 'HDFC Corporate Current Account',
      details: 'A/C: ····1234 · IFSC: HDFC0001234',
      accountHolder: 'Rajesh Kumar Enterprises',
      bankName: 'HDFC Bank',
      accountNumber: '50200012345678',
      ifscCode: 'HDFC0001234',
      isDefault: true,
      icon: Banknote
    },
    {
      id: 2,
      type: 'upi',
      name: 'Corporate Google Pay UPI',
      details: 'VPA: rajesh@okhdfcbank',
      upiId: 'rajesh@okhdfcbank',
      isDefault: false,
      icon: CreditCard
    },
    {
      id: 3,
      type: 'wallet',
      name: 'Paytm Merchant Wallet',
      details: 'Registered: +91 98765 43210',
      walletNumber: '+91 98765 43210',
      isDefault: false,
      icon: Wallet
    }
  ]);

  const methodTypes = [
    { id: 'bank', label: 'Bank Account', icon: Banknote, description: 'Direct NEFT/RTGS settlement' },
    { id: 'upi', label: 'UPI VPA', icon: CreditCard, description: 'Realtime sub-10 minute transfer' },
    { id: 'wallet', label: 'Digital Wallet', icon: Wallet, description: 'Verified merchant wallet' }
  ];

  const handleSetDefault = (id) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this verified payment destination?')) {
      setPaymentMethods(methods => methods.filter(method => method.id !== id));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newId = Date.now();
    const methodType = methodTypes.find(t => t.id === newMethod.type) || methodTypes[0];
    
    let details = '';
    let name = newMethod.name || `${methodType.label}`;
    if (newMethod.type === 'bank') {
      details = `A/C: ····${(newMethod.accountNumber || '').slice(-4)} · IFSC: ${newMethod.ifscCode}`;
      name = newMethod.bankName || name;
    } else if (newMethod.type === 'upi') {
      details = `VPA: ${newMethod.upiId}`;
    } else {
      details = `Registered: ${newMethod.walletNumber}`;
    }

    const newPaymentMethod = {
      id: newId,
      type: newMethod.type,
      name,
      details,
      accountHolder: newMethod.accountHolder,
      bankName: newMethod.bankName,
      accountNumber: newMethod.accountNumber,
      ifscCode: newMethod.ifscCode,
      upiId: newMethod.upiId,
      walletNumber: newMethod.walletNumber,
      isDefault: paymentMethods.length === 0,
      icon: methodType.icon
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setShowAddModal(false);
    setNewMethod({
      type: 'bank',
      name: '',
      details: '',
      accountHolder: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
      walletNumber: ''
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between h-full">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-2xs">
            <CreditCard size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Settlement Channels
            </h3>
            <p className="text-xs text-slate-500">Verified bank accounts & payout rails</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
        >
          <Plus size={14} />
          <span>Add Channel</span>
        </button>
      </div>

      {/* Methods List */}
      <div className="p-4 sm:p-5 space-y-3 flex-1 overflow-y-auto">
        {paymentMethods.map(method => {
          const Icon = method.icon;
          return (
            <div
              key={method.id}
              className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                method.isDefault 
                  ? 'border-primary-300 bg-primary-50/40 shadow-xs' 
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  method.isDefault ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Icon size={19} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                      {method.name}
                    </p>
                    {method.isDefault && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-primary-100 text-primary-800 border border-primary-200 flex-shrink-0">
                        <Star size={10} className="fill-primary-600 text-primary-600" />
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate font-mono">{method.details}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    type="button"
                    title="Set as Primary"
                    className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-primary-700 bg-slate-100 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Set Primary
                  </button>
                )}
                <button
                  onClick={() => handleDelete(method.id)}
                  type="button"
                  title="Remove Destination"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Guarantee Strip */}
      <div className="p-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 text-[11px]">
          <ShieldCheck size={14} className="text-emerald-600" />
          PCI-DSS & RBI Escrow Compliant
        </span>
        <span className="text-[11px] font-semibold text-slate-400">256-bit Encrypted</span>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100000] overflow-hidden flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setShowAddModal(false)} 
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-extrabold text-slate-900">Add Settlement Destination</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                type="button"
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAdd} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Destination Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {methodTypes.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setNewMethod({ ...newMethod, type: type.id })}
                      className={`p-2.5 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                        newMethod.type === type.id
                          ? 'border-primary-600 bg-primary-50 text-primary-900 shadow-2xs'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {newMethod.type === 'bank' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Holder Full Name</label>
                    <input
                      type="text"
                      required
                      value={newMethod.accountHolder}
                      onChange={e => setNewMethod({ ...newMethod, accountHolder: e.target.value })}
                      placeholder="e.g. राजेश कुमार / Kumar Enterprises"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      required
                      value={newMethod.bankName}
                      onChange={e => setNewMethod({ ...newMethod, bankName: e.target.value })}
                      placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        required
                        value={newMethod.accountNumber}
                        onChange={e => setNewMethod({ ...newMethod, accountNumber: e.target.value })}
                        placeholder="e.g. 50200012345678"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        required
                        value={newMethod.ifscCode}
                        onChange={e => setNewMethod({ ...newMethod, ifscCode: e.target.value.toUpperCase() })}
                        placeholder="e.g. HDFC0001234"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs uppercase text-slate-900 focus:outline-none focus:border-primary-500 font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {newMethod.type === 'upi' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    required
                    value={newMethod.upiId}
                    onChange={e => setNewMethod({ ...newMethod, upiId: e.target.value })}
                    placeholder="e.g. username@okhdfcbank"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary-500 font-mono"
                  />
                </div>
              )}

              {newMethod.type === 'wallet' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={newMethod.walletNumber}
                    onChange={e => setNewMethod({ ...newMethod, walletNumber: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary-500 font-mono"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
