"use client";

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  ShoppingBag,
  FileText,
  Ban,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertTriangle
} from '@/utils/icons';
import '../../../../styles/Wholesaler/Customers/QuickActions.scss';

export default function QuickActions({ 
  selectedCustomer, 
  selectedCount = 0, 
  onSendEmail, 
  onCall, 
  onCreateOrder, 
  onAddNote, 
  onBlockCustomer 
}) {
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const actions = [
    {
      id: 'email',
      label: 'Bulk Dispatch',
      sublabel: 'Send Email update',
      icon: Mail,
      theme: {
        bg: 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100 hover:border-primary-300',
        iconBg: 'bg-primary-500 text-white'
      },
      onClick: () => handleSendEmail(),
      show: true
    },
    {
      id: 'order',
      label: 'Direct Order',
      sublabel: 'Create purchase order',
      icon: ShoppingBag,
      theme: {
        bg: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300',
        iconBg: 'bg-blue-500 text-white'
      },
      onClick: () => handleCreateOrder(),
      show: true
    },
    {
      id: 'call',
      label: 'Phone Contact',
      sublabel: 'Call retailer direct',
      icon: Phone,
      theme: {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300',
        iconBg: 'bg-emerald-500 text-white'
      },
      onClick: () => handleMakeCall(),
      show: !!selectedCustomer
    },
    {
      id: 'note',
      label: 'Internal Memo',
      sublabel: 'Attach customer note',
      icon: FileText,
      theme: {
        bg: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300',
        iconBg: 'bg-amber-500 text-white'
      },
      onClick: () => handleAddNote(),
      show: true
    },
    {
      id: 'block',
      label: 'Access Control',
      sublabel: 'Block buyer account',
      icon: Ban,
      theme: {
        bg: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300',
        iconBg: 'bg-rose-500 text-white'
      },
      onClick: () => setShowBlockConfirm(true),
      show: selectedCustomer || selectedCount > 0
    }
  ];

  const visibleActions = actions.filter(action => action.show);

  const handleSendEmail = async () => {
    if (!selectedCustomer && selectedCount === 0) {
      alert('Please select at least one retailer customer from the list.');
      return;
    }
    const target = selectedCustomer ? selectedCustomer.name : `${selectedCount} selected retailers`;
    const subject = prompt(`Enter email subject to send to ${target}:`, 'Special Wholesale Promotion');
    if (!subject) return;
    alert(`Email broadcast dispatched to ${target}!`);
    onSendEmail?.();
  };

  const handleMakeCall = () => {
    if (!selectedCustomer?.phone || selectedCustomer.phone === 'N/A') {
      alert('No verified phone number listed for this customer.');
      return;
    }
    window.location.href = `tel:${selectedCustomer.phone}`;
    onCall?.();
  };

  const handleCreateOrder = () => {
    if (!selectedCustomer && selectedCount === 0) {
      alert('Please select a customer to create an order.');
      return;
    }
    const name = selectedCustomer?.name || 'Selected retailer';
    alert(`Initiating new wholesale purchase order for ${name}...`);
    onCreateOrder?.();
  };

  const handleAddNote = () => {
    if (!selectedCustomer && selectedCount === 0) {
      alert('Please select a customer to add a note.');
      return;
    }
    const note = prompt('Enter internal CRM note for this retailer:');
    if (!note) return;
    alert('Note saved to retailer account.');
    onAddNote?.();
  };

  const handleBlockConfirm = () => {
    onBlockCustomer?.();
    setShowBlockConfirm(false);
    alert('Retailer account status updated.');
  };

  const targetName = selectedCustomer 
    ? selectedCustomer.name 
    : (selectedCount > 0 ? `${selectedCount} retailers selected` : 'Select a customer to activate actions');

  return (
    <div className="quick-actions bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-2xs">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">CRM Operations Hub</h4>
            <p className="text-[11px] text-slate-400 truncate max-w-[280px] sm:max-w-md">
              {targetName}
            </p>
          </div>
        </div>

        {selectedCount > 0 && (
          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
            {selectedCount} Selected
          </span>
        )}
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {visibleActions.map((action, index) => {
          const Icon = action.icon;
          const isActionDisabled = (!selectedCustomer && selectedCount === 0 && action.id !== 'email') || isLoading;

          return (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={isActionDisabled}
              className={`
                quick-action-card group flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left
                ${action.theme.bg}
                ${isActionDisabled ? 'opacity-50 cursor-not-allowed' : 'shadow-2xs hover:shadow-xs hover:-translate-y-0.5'}
              `}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className={`w-8 h-8 rounded-lg ${action.theme.iconBg} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">{action.label}</span>
                <span className="text-[10px] text-slate-500 block truncate">{action.sublabel}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Block Confirmation Modal */}
      {showBlockConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowBlockConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm Account Block</h3>
                <p className="text-xs text-slate-500">Suspend retailer order capabilities</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to block <strong>{selectedCustomer?.name || `${selectedCount} selected retailers`}</strong>? 
              They will be unable to submit new purchase orders until unblocked.
            </p>
            
            <div className="flex items-center gap-2.5">
              <button
                className="flex-1 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-2xs"
                onClick={() => setShowBlockConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs"
                onClick={handleBlockConfirm}
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
