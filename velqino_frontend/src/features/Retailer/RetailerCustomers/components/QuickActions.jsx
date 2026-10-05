"use client";

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  ShoppingCart, 
  Star, 
  Send, 
  Copy, 
  CheckCircle, 
  UserPlus, 
  Tag, 
  Sparkles,
  X
} from '../../../../utils/icons';
import { toast } from 'react-toastify';

export default function QuickActions({ selectedCustomer, onRefresh }) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const customerName = selectedCustomer?.full_name || selectedCustomer?.name || 'Customer';
  const customerPhone = selectedCustomer?.phone || selectedCustomer?.mobile || '';
  const customerEmail = selectedCustomer?.email || '';

  const handleCopyContact = () => {
    if (!customerPhone && !customerEmail) return;
    const text = `${customerName} - Phone: ${customerPhone || 'N/A'}, Email: ${customerEmail || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Contact info copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const quickOffers = [
    { id: '10off', label: '10% Discount Code', desc: 'Valid for next store visit on min. ₹1,000 spend' },
    { id: 'free_gift', label: 'VIP Welcome Perk', desc: 'Free gift redemption with next purchase' },
    { id: 'double_points', label: '2x Loyalty Points Booster', desc: 'Double points earned on all categories this week' },
  ];

  const handleSendOffer = () => {
    if (selectedOffer) {
      toast.success(`Promotional reward sent to ${customerName} via SMS & Email!`);
      setShowOfferModal(false);
      setSelectedOffer('');
      if (onRefresh) onRefresh();
    }
  };

  if (!selectedCustomer) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-2xs h-full flex flex-col items-center justify-center text-center">
        <UserPlus size={28} className="text-gray-300 mb-2" />
        <h5 className="text-xs font-bold text-gray-700">Quick Contact Actions</h5>
        <p className="text-[11px] text-gray-400 mt-0.5">Select a customer to call, message, or award offers</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 tracking-tight">Direct Engagement</h4>
              <p className="text-[11px] text-gray-400">One-click outreach for {customerName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyContact}
            className="p-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 text-[11px] font-bold inline-flex items-center gap-1 transition-all"
          >
            {copied ? <CheckCircle size={12} className="text-emerald-600" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 grid grid-cols-2 gap-2.5">
          {customerPhone ? (
            <a
              href={`tel:${customerPhone}`}
              className="p-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-800 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Phone size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold">Direct Call</p>
                <p className="text-[10px] text-emerald-700/80 truncate">{customerPhone}</p>
              </div>
            </a>
          ) : null}

          {customerPhone ? (
            <a
              href={`https://wa.me/${customerPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-800 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageCircle size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold">WhatsApp</p>
                <p className="text-[10px] text-emerald-700/80">Chat</p>
              </div>
            </a>
          ) : null}

          {customerEmail ? (
            <a
              href={`mailto:${customerEmail}`}
              className="p-2.5 rounded-2xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-800 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Mail size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold">Email</p>
                <p className="text-[10px] text-indigo-700/80 truncate">{customerEmail}</p>
              </div>
            </a>
          ) : null}

          <button
            type="button"
            onClick={() => setShowOfferModal(true)}
            className="p-2.5 rounded-2xl border border-amber-100 bg-amber-50/50 hover:bg-amber-100/60 text-amber-800 text-xs font-bold flex items-center gap-2 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Tag size={13} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold">Send Perk</p>
              <p className="text-[10px] text-amber-700/80">Coupon</p>
            </div>
          </button>
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h4 className="text-sm font-bold text-gray-900">Award Customer Perk</h4>
              <button onClick={() => setShowOfferModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {quickOffers.map(o => (
                <label 
                  key={o.id}
                  onClick={() => setSelectedOffer(o.id)}
                  className={`p-3 rounded-2xl border cursor-pointer block transition-all ${
                    selectedOffer === o.id ? 'border-primary-500 bg-primary-50/60' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="text-xs font-bold text-gray-900">{o.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{o.desc}</p>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendOffer}
                disabled={!selectedOffer}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-40"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}