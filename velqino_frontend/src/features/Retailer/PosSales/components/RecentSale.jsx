"use client";

import React, { useState } from 'react';
import { 
  Clock, 
  Printer, 
  CheckCircle, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  User, 
  Package
} from '../../../../utils/icons';

export default function RecentSale({ lastSale = null, onReprint }) {
  const [isHovered, setIsHovered] = useState(false);

  const getPaymentIcon = (method = '') => {
    const m = (method || '').toLowerCase();
    if (m === 'cash') return <Banknote size={13} className="text-emerald-600" />;
    if (m === 'upi') return <Smartphone size={13} className="text-primary-600" />;
    return <CreditCard size={13} className="text-indigo-600" />;
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <Clock size={16} />
          </span>
          <h3 className="text-sm font-bold text-gray-900">
            Last Transaction
          </h3>
        </div>

        {lastSale && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 flex items-center gap-1">
            <CheckCircle size={10} />
            <span>Settled</span>
          </span>
        )}
      </div>

      {/* Transaction Details or Proper Empty Message */}
      {!lastSale ? (
        <div className="p-4 rounded-2xl bg-gray-50/80 border border-dashed border-gray-200 text-center">
          <Clock size={20} className="text-gray-300 mx-auto mb-1.5" />
          <p className="text-xs font-bold text-gray-700">No Sales in Current Session</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Completed checkouts will appear here for instant tax invoice reprinting.
          </p>
        </div>
      ) : (
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="p-3 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-primary-200 transition-all space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono font-bold text-xs text-primary-700 block">
                {lastSale.id}
              </span>
              <span className="text-[10px] text-gray-400">
                {lastSale.time} • {lastSale.date}
              </span>
            </div>

            <div className="text-right">
              <span className="text-sm sm:text-base font-black text-gray-900 block">
                ₹{Number(lastSale.total || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                {lastSale.items || 1} items
              </span>
            </div>
          </div>

          {/* Customer & Tender Strip */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200/70 text-gray-600">
            <div className="flex items-center gap-1.5 truncate max-w-[150px]">
              <User size={13} className="text-gray-400" />
              <span className="font-semibold text-gray-800 text-[11px] truncate">
                {lastSale.customer || 'Walk-in'}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-gray-200 text-[11px] font-bold">
              {getPaymentIcon(lastSale.payment)}
              <span>{lastSale.payment || 'CASH'}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => {
              if (onReprint) onReprint(lastSale);
              else window.print();
            }}
            className="w-full py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Printer size={13} />
            <span>Reprint Tax Invoice</span>
          </button>
        </div>
      )}
    </div>
  );
}
