"use client";

import React, { useState } from 'react';
import DashboardHeader from './Components/DashboardHeader';
import DashboardSidebar from './Components/DashboardSidebar';
import StatsCards from './Components/StatsCards';
import RecentOrdersTable from './Components/RecentOrdersTable';
import QuickActions from './Components/QuickActions';
import AccountActivity from './Components/AccountActivity';
import ProfileOverviewCard from './Components/ProfileOverviewCard';
import { useGetOrdersQuery } from '@/redux/wholesaler/slices/ordersSlice';
import { useGetUserAddressesQuery } from '@/redux/wholesaler/slices/productsSlice';
import { useGetWishlistQuery } from '@/redux/wholesaler/slices/wishlistSlice';

export default function CustomerDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: ordersData } = useGetOrdersQuery();
  const { data: addressesData } = useGetUserAddressesQuery();
  const { data: wishlistData } = useGetWishlistQuery();
  
  const orders = ordersData?.data || [];
  const addresses = addressesData?.data || [];
  const wishlistItems = wishlistData?.data || [];
  
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const recentOrders = orders.slice(0, 5);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      <div className="flex">
        <DashboardSidebar isMobileMenuOpen={isMobileMenuOpen} />
        
        <main className="flex-1 lg:ml-64 p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back! Here's what's happening with your account.</p>
          </div>
          
          <StatsCards 
            totalOrders={totalOrders}
            totalSpent={totalSpent}
            pendingOrders={pendingOrders}
            deliveredOrders={deliveredOrders}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <RecentOrdersTable orders={recentOrders} />
              <QuickActions />
            </div>
            <div className="space-y-6">
              <ProfileOverviewCard 
                userName={localStorage.getItem('user_name') || 'Customer'}
                userEmail={localStorage.getItem('user_email') || 'customer@example.com'}
                addressesCount={addresses.length}
                wishlistCount={wishlistItems.length}
              />
              <AccountActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}