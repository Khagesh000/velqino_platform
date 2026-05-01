"use client";

import React from 'react';
import { MapPin, Edit, Trash2, CheckCircle, Loader2 } from '../../../../utils/icons';

export default function AddressCard({ address, onEdit, onDelete, isDeleting }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <MapPin size={20} className="text-primary-500 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900">{address.full_name}</p>
              {address.is_default && (
                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                  <CheckCircle size={10} />
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">📞 {address.phone}</p>
            <p className="text-sm text-gray-600 mt-1">{address.street}</p>
            <p className="text-sm text-gray-600">
              {address.city}, {address.state} - {address.pincode}
            </p>
            {address.landmark && (
              <p className="text-sm text-gray-400 mt-1">📍 {address.landmark}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-500 hover:text-primary-500 transition-colors"
            title="Edit address"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-1.5 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Delete address"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}