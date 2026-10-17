"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import DashboardHeader from '../components/DashboardHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import { 
  useGetUserAddressesQuery, 
  useDeleteAddressMutation 
} from '../../../redux/wholesaler/slices/productsSlice';
import { 
  MapPin, 
  Plus, 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  Home, 
  Building, 
  ShieldCheck, 
  ShoppingBag, 
  ArrowRight,
  Search,
  X,
  SlidersHorizontal,
  Package
} from '../../../utils/icons';
import AddressCard from './components/AddressCard';
import AddressFormModal from './components/AddressFormModal';
import { toast } from 'react-toastify';

export default function AddressBookPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  const { data, isLoading, isFetching, error, refetch } = useGetUserAddressesQuery();
  const [deleteAddress] = useDeleteAddressMutation();
  
  const addresses = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    if (refetch) await refetch();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };
  
  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this delivery address?')) {
      setDeletingId(addressId);
      try {
        await deleteAddress(addressId).unwrap();
        toast.success('Address deleted successfully');
        if (refetch) refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete address');
      } finally {
        setDeletingId(null);
      }
    }
  };
  
  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    if (refetch) refetch();
  };

  // KPI Statistics
  const kpiStats = useMemo(() => {
    const totalCount = addresses.length;
    const defaultAddress = addresses.find((a) => a.is_default);
    const homeCount = addresses.filter((a) => (a.address_type || 'home').toLowerCase() === 'home').length;
    const workCount = addresses.filter((a) => ['work', 'office'].includes((a.address_type || '').toLowerCase())).length;

    return {
      totalCount,
      defaultCity: defaultAddress ? `${defaultAddress.city}` : 'None Set',
      hasDefault: Boolean(defaultAddress),
      homeCount,
      workCount,
    };
  }, [addresses]);

  // Tab definitions
  const filterTabs = [
    { value: 'all', label: 'All Addresses', count: addresses.length },
    { value: 'default', label: 'Default Shipping', count: addresses.filter(a => a.is_default).length },
    { value: 'home', label: 'Home Locations', count: kpiStats.homeCount },
    { value: 'work', label: 'Work & Office', count: kpiStats.workCount },
  ];

  // Filtering
  const filteredAddresses = useMemo(() => {
    let result = [...addresses];

    // Filter tab
    if (filterType === 'default') {
      result = result.filter((a) => a.is_default);
    } else if (filterType === 'home') {
      result = result.filter((a) => (a.address_type || 'home').toLowerCase() === 'home');
    } else if (filterType === 'work') {
      result = result.filter((a) => ['work', 'office'].includes((a.address_type || '').toLowerCase()));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((a) => {
        const name = String(a.full_name || '').toLowerCase();
        const city = String(a.city || '').toLowerCase();
        const state = String(a.state || '').toLowerCase();
        const street = String(a.street || '').toLowerCase();
        const pincode = String(a.pincode || '').toLowerCase();
        const phone = String(a.phone || '').toLowerCase();
        return name.includes(q) || city.includes(q) || state.includes(q) || street.includes(q) || pincode.includes(q) || phone.includes(q);
      });
    }

    return result;
  }, [addresses, filterType, searchQuery]);

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
        
        <main className="flex-1 lg:ml-64 transition-all duration-300 p-3 sm:p-5 lg:p-8 min-w-0 max-w-full overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto space-y-5 sm:space-y-6">

            {/* Executive Header Ribbon */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 border border-gray-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                    <Sparkles size={12} className="text-primary-600" />
                    Customer Shipping &amp; Billing Directory
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Secure Delivery Points
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Saved Addresses
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                  Manage doorstep delivery destinations, configure your primary shipping address, and add verified locations for express one-click checkout.
                </p>
              </div>

              {/* Header Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing || isFetching}
                  className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={14} className={isRefreshing || isFetching ? 'animate-spin text-primary-600' : 'text-gray-500'} />
                  <span>{isRefreshing || isFetching ? 'Syncing...' : 'Sync Locations'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingAddress(null);
                    setIsModalOpen(true);
                  }}
                  className="px-4.5 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white hover:!text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  style={{ color: '#ffffff' }}
                >
                  <Plus size={15} className="!text-white text-white" style={{ color: '#ffffff' }} />
                  <span className="!text-white text-white" style={{ color: '#ffffff' }}>Add New Address</span>
                </button>
              </div>
            </div>

            {/* Top KPI Metrics Ribbon (4 Cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Addresses</p>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight">
                    {kpiStats.totalCount}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-primary-600 font-semibold mt-0.5 inline-flex items-center gap-1">
                    <MapPin size={11} className="hidden sm:inline-block" />
                    <span>Configured points</span>
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Default Destination</p>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight truncate max-w-[140px] sm:max-w-[180px]">
                    {kpiStats.defaultCity}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center gap-1">
                    <CheckCircle size={11} className="hidden sm:inline-block" />
                    <span>{kpiStats.hasDefault ? 'Active priority' : 'Needs configuration'}</span>
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Home Locations</p>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight">
                    {kpiStats.homeCount}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-blue-600 font-semibold mt-0.5 inline-flex items-center gap-1">
                    <Home size={11} className="hidden sm:inline-block" />
                    <span>Residential</span>
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Home size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-3 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Office &amp; Work</p>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 tracking-tight">
                    {kpiStats.workCount}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-indigo-600 font-semibold mt-0.5 inline-flex items-center gap-1">
                    <Building size={11} className="hidden sm:inline-block" />
                    <span>Commercial spots</span>
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Building size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 w-full max-w-xl">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, city, street, or PIN code..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-gray-50/80 border border-gray-200/90 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Counter / Info */}
                <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-gray-500 font-medium shrink-0">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Doorstep delivery enabled</span>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
                {filterTabs.map((tab) => {
                  const isActive = filterType === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setFilterType(tab.value)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200/80 text-gray-700'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Section: Loading / Empty / Cards Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs animate-pulse space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-gray-200 rounded-lg w-28"></div>
                      <div className="h-5 bg-gray-100 rounded-lg w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-lg w-40"></div>
                    <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
                    <div className="h-6 bg-gray-100 rounded-lg w-32"></div>
                  </div>
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-8 sm:p-14 text-center max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto border border-primary-100 shadow-2xs">
                  <MapPin size={32} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                    No Saved Addresses Found
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                    Add your home, office, or commercial delivery destination to unlock fast one-click checkout and accurate tracking.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddress(null);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                    style={{ color: '#ffffff' }}
                  >
                    <Plus size={16} className="!text-white text-white" style={{ color: '#ffffff' }} />
                    <span className="!text-white text-white" style={{ color: '#ffffff' }}>Add First Address</span>
                  </button>
                </div>
              </div>
            ) : filteredAddresses.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto border border-primary-100 shadow-2xs">
                  <Package size={28} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                    No Matching Addresses Found
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
                    No saved addresses matched the search query "{searchQuery}" or tab filter.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('all');
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs cursor-pointer"
                  >
                    Clear Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddress(null);
                      setIsModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    style={{ color: '#ffffff' }}
                  >
                    <Plus size={14} className="!text-white text-white" style={{ color: '#ffffff' }} />
                    <span className="!text-white text-white" style={{ color: '#ffffff' }}>Add New Location</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {filteredAddresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={() => handleEdit(address)}
                    onDelete={() => handleDelete(address.id)}
                    isDeleting={deletingId === address.id}
                  />
                ))}
              </div>
            )}

            {/* Bottom Executive CTA Ribbon */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-6 bg-white rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100 shadow-2xs">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                    Ready to Place an Order?
                  </h4>
                  <p className="text-xs text-gray-500">
                    Browse top trending catalog styles, wholesale deals, and enjoy fast doorstep dispatch.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-col sm:flex-row shrink-0">
                <Link 
                  href="/customer/orderslist" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 text-gray-700 font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
                >
                  <span>View Order History</span>
                </Link>
                <Link 
                  href="/product/productlistingpage" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                  style={{ color: '#ffffff' }}
                >
                  <ShoppingBag size={16} className="!text-white text-white" style={{ color: '#ffffff' }} />
                  <span className="!text-white text-white font-bold" style={{ color: '#ffffff' }}>Continue Shopping</span>
                  <ArrowRight size={14} className="!text-white text-white" style={{ color: '#ffffff' }} />
                </Link>
              </div>
            </div>

          </div>
        </main>
      </div>
      
      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        address={editingAddress}
      />
    </div>
  );
}