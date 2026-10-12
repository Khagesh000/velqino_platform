"use client";

import React from 'react';
import Link from 'next/link';
import { User, MapPin, Heart, Edit, ShieldCheck, ChevronRight } from '../../../utils/icons';

export default function ProfileOverviewCard({ userName, userEmail, addressesCount = 0, wishlistCount = 0 }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
      {/* Top Profile Summary */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-extrabold flex items-center justify-center text-lg shadow-xs shrink-0">
          {userName ? userName.charAt(0).toUpperCase() : 'C'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm sm:text-base font-extrabold text-gray-900 truncate">{userName}</h4>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          </div>
          <p className="text-xs text-gray-400 truncate">{userEmail}</p>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full mt-1 border border-primary-100">
            <ShieldCheck size={10} /> Verified Customer
          </span>
        </div>
        <Link 
          href="/customer/profilesettings" 
          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
          title="Edit Profile"
        >
          <Edit size={16} />
        </Link>
      </div>
      
      {/* Quick Numbers */}
      <div className="space-y-2.5 text-xs">
        <Link 
          href="/customer/addresses" 
          className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 border border-gray-200/60 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin size={15} />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-primary-700 transition-colors">Saved Addresses</span>
          </div>
          <div className="flex items-center gap-1 text-primary-600 font-bold">
            <span>{addressesCount} Active</span>
            <ChevronRight size={13} />
          </div>
        </Link>

        <Link 
          href="/customer/wishlist" 
          className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 border border-gray-200/60 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Heart size={15} />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-primary-700 transition-colors">Saved Wishlist</span>
          </div>
          <div className="flex items-center gap-1 text-primary-600 font-bold">
            <span>{wishlistCount} Items</span>
            <ChevronRight size={13} />
          </div>
        </Link>
      </div>

      <div className="pt-1">
        <Link 
          href="/customer/profilesettings"
          className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>Manage Personal Profile</span>
          <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}
