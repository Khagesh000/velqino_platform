"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Search, Menu, X, LogOut } from '../../../utils/icons';
import { toast } from 'react-toastify';

export default function DashboardHeader({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);
  
  const notifications = [
    { id: 1, type: 'order', message: 'Your order has been confirmed', time: '2 hours ago', read: false },
    { id: 2, type: 'delivery', message: 'Your order is out for delivery', time: '1 day ago', read: true },
  ];
  const unreadCount = notifications.filter(n => !n.read).length;
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    toast.success('Logged out successfully');
    router.push('/');
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/">
              <span className="text-xl font-bold text-primary-600">VELTRIX</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-600 hover:text-primary-600 rounded-lg"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-900">Notifications</span>
                  </div>
                  {notifications.map((notif) => (
                    <div key={notif.id} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-700">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-500 rounded-lg"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}