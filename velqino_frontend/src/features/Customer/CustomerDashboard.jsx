"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import DashboardHeader from './components/DashboardHeader';
import DashboardSidebar from './components/DashboardSidebar';
import StatsCards from './components/StatsCards';
import RecentOrdersTable from './components/RecentOrdersTable';
import QuickActions from './components/QuickActions';
import AccountActivity from './components/AccountActivity';
import ProfileOverviewCard from './components/ProfileOverviewCard';
import { useGetOrdersQuery } from '@/redux/wholesaler/slices/ordersSlice';
import { useGetUserAddressesQuery } from '@/redux/wholesaler/slices/productsSlice';
import { useGetWishlistQuery } from '@/redux/wholesaler/slices/wishlistSlice';
import { getAuthUser } from '@/utils/cookieUtils';
import { 
  Sparkles, 
  RefreshCw, 
  ShoppingBag, 
  Headphones, 
  Phone, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from '../../utils/icons';

export default function CustomerDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initialAuth = useMemo(() => getAuthUser(), []);
  const [userName, setUserName] = useState(
    initialAuth.name && initialAuth.name !== 'undefined' ? initialAuth.name : ''
  );
  const [userEmail, setUserEmail] = useState(
    initialAuth.email && initialAuth.email !== 'undefined' ? initialAuth.email : ''
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = getAuthUser();
      if (auth.name && auth.name !== 'undefined') setUserName(auth.name);
      if (auth.email && auth.email !== 'undefined') setUserEmail(auth.email);

      const handleUpdate = (e) => {
        const detail = e?.detail || getAuthUser();
        if (detail.name && detail.name !== 'undefined') setUserName(detail.name);
        if (detail.email && detail.email !== 'undefined') setUserEmail(detail.email);
      };

      window.addEventListener('velqino:auth-user-updated', handleUpdate);
      return () => window.removeEventListener('velqino:auth-user-updated', handleUpdate);
    }
  }, []);

  const displayName = useMemo(() => {
    if (userName && userName !== 'undefined' && userName !== 'null') return userName;
    if (userEmail && userEmail !== 'undefined' && userEmail !== 'null') return userEmail.split('@')[0];
    return 'Customer';
  }, [userName, userEmail]);

  const displayEmail = useMemo(() => {
    if (userEmail && userEmail !== 'undefined' && userEmail !== 'null') return userEmail;
    return 'customer@velqino.com';
  }, [userEmail]);

  const { data: ordersData, refetch: refetchOrders } = useGetOrdersQuery();
  const { data: addressesData, refetch: refetchAddresses } = useGetUserAddressesQuery();
  const { data: wishlistData, refetch: refetchWishlist } = useGetWishlistQuery();
  
  const orders = ordersData?.data || [];
  const addresses = addressesData?.data || [];
  const wishlistItems = wishlistData?.data || [];
  
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const recentOrders = orders.slice(0, 5);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    if (refetchOrders) refetchOrders();
    if (refetchAddresses) refetchAddresses();
    if (refetchWishlist) refetchWishlist();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };
  
  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-20 lg:pb-12">
      <DashboardHeader 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      <div className="flex">
        <DashboardSidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
        />
        
        <main className="flex-1 lg:ml-64 transition-all duration-300 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            
            {/* Executive Header Ribbon */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                    <Sparkles size={12} className="text-primary-600" />
                    Customer Orders &amp; Loyalty Hub
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Account Active &amp; Verified
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Welcome back, {displayName}!
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                  Supervise your real-time order fulfillment, view tax invoices, manage registered shipping locations, and browse your personalized wishlist.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                  <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
                </button>
                <Link
                  href="/product/productlistingpage"
                  className="px-4.5 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <ShoppingBag size={14} />
                  <span>Shop Catalog</span>
                </Link>
              </div>
            </div>
            
            {/* Top KPI Metrics Ribbon (4 Cards) */}
            <StatsCards 
              totalOrders={totalOrders}
              totalSpent={totalSpent}
              pendingOrders={pendingOrders}
              deliveredOrders={deliveredOrders}
            />
            
            {/* Main Console Layout: 2/3 Content + 1/3 Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column (2/3 width): Orders Table + Quick Actions */}
              <div className="lg:col-span-2 space-y-6">
                <RecentOrdersTable orders={recentOrders} />
                <QuickActions />
              </div>

              {/* Right Column (1/3 width): Profile Card + Support Card + Activity */}
              <div className="space-y-6">
                <ProfileOverviewCard 
                  userName={displayName}
                  userEmail={displayEmail}
                  addressesCount={addresses.length}
                  wishlistCount={wishlistItems.length}
                />

                {/* Priority Customer Support Banner Card */}
                <div className="bg-gradient-to-br from-primary-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white shadow-2xs space-y-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                      <Headphones size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">24/7 Buyer Assistance</h4>
                      <p className="text-[11px] text-gray-300">Fast help with orders &amp; returns</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    Need help tracking your shipment, requesting a return exchange, or reporting billing issues? Our priority desk is here to help.
                  </p>

                  <div className="pt-1 flex items-center gap-2.5">
                    <Link
                      href="/customer/orderslist"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-primary-950 font-bold text-xs hover:bg-gray-100 transition-colors shadow-2xs"
                    >
                      <span>Track Active Shipments</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                <AccountActivity />
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
