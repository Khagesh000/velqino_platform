"use client";

import React from 'react';
import { 
  MapPin, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Loader2, 
  Home, 
  Building, 
  Phone, 
  User, 
  ShieldCheck 
} from '../../../../utils/icons';

export default function AddressCard({ address, onEdit, onDelete, isDeleting }) {
  const isDefault = Boolean(address?.is_default);
  const type = (address?.address_type || 'home').toLowerCase();

  const getTypeIcon = () => {
    switch (type) {
      case 'work':
      case 'office':
        return <Building size={13} className="text-blue-600" />;
      case 'other':
        return <MapPin size={13} className="text-indigo-600" />;
      case 'home':
      default:
        return <Home size={13} className="text-primary-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'work':
      case 'office':
        return 'Work / Office';
      case 'other':
        return 'Other Location';
      case 'home':
      default:
        return 'Home Address';
    }
  };

  return (
    <div 
      className={`bg-white rounded-3xl border shadow-2xs hover:shadow-xs transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between relative group ${
        isDefault 
          ? 'border-emerald-300 ring-2 ring-emerald-500/20' 
          : 'border-gray-200/80'
      }`}
    >
      {/* Top Header Strip */}
      <div>
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Address Type Pill */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-50 border border-gray-200/80 text-gray-700 shadow-2xs">
              {getTypeIcon()}
              <span>{getTypeLabel()}</span>
            </span>

            {/* Default Address Badge */}
            {isDefault && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                <CheckCircle size={12} className="text-emerald-600" />
                <span>Default Shipping</span>
              </span>
            )}
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="p-2 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer"
              title="Edit address"
            >
              <Edit size={15} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-50 cursor-pointer"
              title="Delete address"
            >
              {isDeleting ? <Loader2 size={15} className="animate-spin text-rose-600" /> : <Trash2 size={15} />}
            </button>
          </div>
        </div>

        {/* Address Body */}
        <div className="pt-3.5 space-y-2.5">
          {/* Full Name & Verification */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
              <User size={14} />
            </div>
            <h3 className="font-extrabold text-base text-gray-900 tracking-tight">
              {address?.full_name || 'Recipient'}
            </h3>
          </div>

          {/* Phone */}
          {address?.phone && (
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 pl-1">
              <Phone size={13} className="text-gray-400 shrink-0" />
              <span>+91 {address.phone}</span>
            </div>
          )}

          {/* Street Address */}
          <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 pl-1 leading-relaxed">
            <MapPin size={14} className="text-primary-600 mt-0.5 shrink-0" />
            <p className="font-medium text-gray-700">
              {address?.street}
            </p>
          </div>

          {/* Landmark */}
          {address?.landmark && (
            <div className="pl-6 text-xs text-gray-500">
              <span className="inline-block px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-[11px] font-medium">
                Near: {address.landmark}
              </span>
            </div>
          )}

          {/* City, State & PIN Code */}
          <div className="pt-2 pl-1 flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-gray-900">
              {address?.city}, {address?.state}
            </span>
            <span className="font-mono text-xs font-extrabold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-lg border border-primary-200/60 shadow-2xs">
              PIN: {address?.pincode}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2.5">
        <span className="text-[11px] text-gray-400 font-medium inline-flex items-center gap-1">
          <ShieldCheck size={12} className="text-emerald-600" />
          <span>Verified Location</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 text-gray-700 font-bold text-xs transition-all shadow-2xs cursor-pointer"
          >
            <Edit size={13} className="text-gray-500" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/60 active:scale-95 font-bold text-xs transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
