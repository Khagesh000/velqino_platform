"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle } from '../../../../../utils/icons';

export default function SuccessAnimation({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeOut">
      <div className="bg-white rounded-2xl p-8 text-center animate-scaleUp shadow-2xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Order Placed!</h3>
        <p className="text-gray-500 text-sm mt-1">Thank you for your purchase</p>
      </div>
    </div>
  );
}