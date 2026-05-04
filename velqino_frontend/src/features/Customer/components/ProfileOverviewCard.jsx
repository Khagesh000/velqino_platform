"use client";

import React from 'react';
import Link from 'next/link';
import { User, MapPin, Heart, Edit } from '../../../utils/icons';

export default function ProfileOverviewCard({ userName, userEmail, addressesCount, wishlistCount }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <User size={24} className="text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{userName}</h3>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>
        <Link href="/profile/profilesettings" className="text-gray-400 hover:text-primary-500">
          <Edit size={16} />
        </Link>
      </div>
      
      <div className="border-t border-gray-100 pt-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Saved Addresses</span>
          <Link href="/profile/addresses" className="text-primary-500 hover:text-primary-600">
            {addressesCount} addresses
          </Link>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Wishlist Items</span>
          <Link href="/profile/wishlist" className="text-primary-500 hover:text-primary-600">
            {wishlistCount} items
          </Link>
        </div>
      </div>
    </div>
  );
}