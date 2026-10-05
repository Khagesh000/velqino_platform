"use client";

import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Calendar, 
  Send, 
  MessageCircle, 
  Phone, 
  Mail, 
  Star, 
  Users, 
  Sparkles, 
  X,
  CheckCircle
} from '../../../../utils/icons';
import { toast } from 'react-toastify';

export default function BirthdayAnniversary({ 
  upcomingBirthdays = [], 
  upcomingAnniversaries = [], 
  onSelectCustomer 
}) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('birthday');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [customWish, setCustomWish] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentList = activeTab === 'birthday' ? upcomingBirthdays : upcomingAnniversaries;

  const handleSendWishClick = (cust) => {
    setSelectedRecipient(cust);
    const msg = activeTab === 'birthday'
      ? `Dear ${cust.name}, wishing you a joyful Birthday from our store team! Enjoy an exclusive 15% discount on your next visit with code BDAY15.`
      : `Dear ${cust.name}, happy Anniversary! Thank you for your continued patronage. Here is an exclusive 15% celebratory privilege with code ANNI15.`;
    setCustomWish(msg);
    setShowSendModal(true);
  };

  const handleDispatchGreeting = () => {
    toast.success(`Greeting and discount dispatched to ${selectedRecipient?.name}!`);
    setShowSendModal(false);
    setSelectedRecipient(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Gift size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Special Milestones</h3>
              <p className="text-[11px] text-gray-400">Occasions arriving in the next 30 days</p>
            </div>
          </div>

          {/* Toggle pill */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('birthday')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'birthday' 
                  ? 'bg-white text-pink-600 shadow-2xs' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Birthdays ({upcomingBirthdays.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('anniversary')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'anniversary' 
                  ? 'bg-white text-pink-600 shadow-2xs' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Anniversaries ({upcomingAnniversaries.length})
            </button>
          </div>
        </div>

        {/* List of Milestones */}
        <div className="p-4 sm:p-5 max-h-56 overflow-y-auto space-y-2">
          {currentList.length === 0 ? (
            <div className="py-8 text-center">
              <Gift size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">
                No upcoming {activeTab === 'birthday' ? 'birthdays' : 'anniversaries'} in the next 30 days
              </p>
            </div>
          ) : (
            currentList.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl border border-gray-200/80 bg-white hover:border-pink-300 transition-all flex items-center justify-between gap-3"
              >
                <div 
                  className="min-w-0 cursor-pointer"
                  onClick={() => onSelectCustomer && onSelectCustomer(item)}
                >
                  <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      <span>{item.date_of_birth || item.anniversary_date}</span>
                    </span>
                    <span>•</span>
                    <span className="font-bold text-pink-600">
                      {item.days_left === 0 ? 'Today!' : `in ${item.days_left} days`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSendWishClick(item)}
                  className="px-2.5 py-1 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 text-xs font-bold border border-pink-200 shrink-0 flex items-center gap-1 transition-all active:scale-95"
                >
                  <Send size={11} />
                  <span>Wish</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Greeting Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-gray-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <Gift size={16} className="text-pink-600" />
                <h4 className="text-sm font-bold text-gray-900">Send Milestone Greeting</h4>
              </div>
              <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-2">
              Personalized celebration message for <span className="font-bold text-gray-900">{selectedRecipient?.name}</span>:
            </p>

            <textarea
              value={customWish}
              onChange={(e) => setCustomWish(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-pink-500 mb-4"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowSendModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDispatchGreeting}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-pink-600 hover:bg-pink-700"
              >
                Dispatch Wish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}