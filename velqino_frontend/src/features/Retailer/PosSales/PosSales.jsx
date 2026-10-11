"use client";

import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import RetailerNavbar from '../RetailerDashboard/components/RetailerNavbar';
import { getAuthUser } from '@/utils/cookieUtils';
import { 
  ShoppingCart, 
  Store, 
  Clock, 
  Calendar, 
  Sparkles, 
  RotateCcw, 
  Archive, 
  Search,
  Tag,
  Zap
} from '../../../utils/icons';

// POS Components
import QuickSale from './components/QuickSale';
import CartSection from './components/CartSection';
import CustomerInfo from './components/CustomerInfo';
import PaymentMethods from './components/PaymentMethods';
import BillSummary from './components/BillSummary';
import RecentSale from './components/RecentSale';
import HoldCart from './components/HoldCart';

export default function PosSales() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [authProfile, setAuthProfile] = useState(() => getAuthUser());
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [applyLoyalty, setApplyLoyalty] = useState(false);
  const [discount, setDiscount] = useState({ type: 'percentage', value: 0 });
  const [orderNote, setOrderNote] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Last transaction record
  const [lastSale, setLastSale] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('velqino_pos_last_sale');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return null;
  });

  // Dynamic live clock
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen to auth profile updates
  useEffect(() => {
    setAuthProfile(getAuthUser());
    const handleAuth = (e) => {
      setAuthProfile(e?.detail || getAuthUser());
    };
    window.addEventListener('velqino:auth-user-updated', handleAuth);
    return () => window.removeEventListener('velqino:auth-user-updated', handleAuth);
  }, []);

  const displayName = useMemo(() => {
    if (authProfile.name && authProfile.name !== 'undefined') return authProfile.name;
    if (authProfile.email && authProfile.email !== 'undefined') return authProfile.email.split('@')[0];
    return 'Retail Store';
  }, [authProfile]);

  // Keyboard shortcut listener (F2: Focus search, F4: Toggle Hold modal, F9: Clear cart)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search by product name"]');
        searchInput?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        setIsHoldModalOpen((prev) => !prev);
      } else if (e.key === 'F9') {
        e.preventDefault();
        if (cart.length > 0 && window.confirm('Clear current register cart?')) {
          setCart([]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart]);

  // Cart operations
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscount({ type: 'percentage', value: 0 });
    setOrderNote('');
    setApplyLoyalty(false);
  };

  const handleLoadHeldCart = (items) => {
    setCart(items);
  };

  const handleCompleteSale = (saleRecord) => {
    setLastSale(saleRecord);
    try {
      localStorage.setItem('velqino_pos_last_sale', JSON.stringify(saleRecord));
    } catch (e) {}
    handleClearCart();
  };

  const totalCartUnits = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 lg:pb-12">
      {/* Top Navigation */}
      <RetailerNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <main className={`transition-all duration-300 p-3 sm:p-5 lg:p-7 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-[1540px] mx-auto space-y-5">
          
          {/* Top POS Header Command Strip */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-6 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Left Identity & Terminal Status */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Terminal Active • Counter 01
                  </span>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <span className="text-xs font-mono font-bold text-gray-500 hidden sm:inline">
                    {currentTime}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <span>Point of Sale Register</span>
                  <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-xl border border-primary-200">
                    Cashier: {displayName}
                  </span>
                </h1>
                
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                  <Calendar size={13} className="text-gray-400" />
                  <span>
                    {new Date().toLocaleDateString('en-IN', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span>•</span>
                  <span>Fast touch checkout & GST tax invoicing</span>
                </p>
              </div>

              {/* Right Quick Operational Shortcuts */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Hold Cart Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setIsHoldModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                  title="View Held Carts (F4)"
                >
                  <Archive size={14} className="text-primary-600" />
                  <span>Held Carts (F4)</span>
                </button>

                {/* Reset Register Cart */}
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset and clear current register session?')) {
                        handleClearCart();
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
                    title="Reset Register Cart (F9)"
                  >
                    <RotateCcw size={13} />
                    <span>Reset (F9)</span>
                  </button>
                )}

                {/* Keyboard Shortcuts Pill */}
                <div className="hidden xl:flex items-center gap-1.5 px-3 py-2 bg-gray-100/70 border border-gray-200 rounded-xl text-[11px] font-mono text-gray-600">
                  <span className="font-bold text-gray-800">Hotkeys:</span>
                  <span className="bg-white px-1.5 py-0.2 rounded border border-gray-300">F2: Search</span>
                  <span className="bg-white px-1.5 py-0.2 rounded border border-gray-300">F4: Hold</span>
                  <span className="bg-white px-1.5 py-0.2 rounded border border-gray-300">F9: Clear</span>
                </div>
              </div>

            </div>
          </div>

          {/* Main POS 2-Column Split: Catalog on Left, Billing on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start lg:items-stretch">
            
            {/* Left 7 Columns: Product Search, Category Filters & Product Grid */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col h-full min-h-0">
              <QuickSale
                cart={cart}
                onAddToCart={handleAddToCart}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>

            {/* Right 5 Columns: Customer, Active Cart, Payment, Bill Breakdown, History */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-4">
              {/* 1. Customer Information Card */}
              <CustomerInfo
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                applyLoyalty={applyLoyalty}
                setApplyLoyalty={setApplyLoyalty}
              />

              {/* 2. Active Cart Line Items Table */}
              <CartSection
                cart={cart}
                updateQuantity={handleUpdateQuantity}
                removeFromCart={handleRemoveFromCart}
                clearCart={handleClearCart}
                discount={discount}
                setDiscount={setDiscount}
                orderNote={orderNote}
                setOrderNote={setOrderNote}
              />

              {/* 3. Payment Methods Selector */}
              <PaymentMethods
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
                totalAmount={cartSubtotal}
              />

              {/* 4. Complete Bill Summary & Checkout Box */}
              <BillSummary
                cart={cart}
                discount={discount}
                selectedPayment={selectedPayment}
                selectedCustomer={selectedCustomer}
                applyLoyalty={applyLoyalty}
                orderNote={orderNote}
                onCompleteSale={handleCompleteSale}
              />

              {/* 5. Lower Stack: Last Transaction & Hold Cart Drawer Trigger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RecentSale 
                  lastSale={lastSale} 
                />

                <HoldCart
                  currentCart={cart}
                  onLoadCart={handleLoadHeldCart}
                  onClearCurrentCart={handleClearCart}
                  isOpen={isHoldModalOpen}
                  onClose={() => setIsHoldModalOpen(false)}
                />
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
