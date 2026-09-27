"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, ShieldCheck, Sparkles } from '@/utils/icons';

export default function SuccessAnimation({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs transition-opacity duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 text-center max-w-sm w-full mx-4 border border-primary-200/80 shadow-2xl animate-scaleUp">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle size={36} className="text-emerald-600 animate-pulse" />
        </div>
        
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-2.5 py-0.5 rounded-full mb-2">
          <ShieldCheck size={12} className="text-primary-600" />
          <span>Escrow Protected</span>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
          Order Registered!
        </h3>
        
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
          Your wholesale order has been securely lodged and dispatched for mill verification.
        </p>
      </div>
    </div>
  );
}
