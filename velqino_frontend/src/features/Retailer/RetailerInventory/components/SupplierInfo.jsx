"use client";

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Package, 
  Star, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  CheckCircle
} from '../../../../utils/icons';

export default function SupplierInfo() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const suppliers = [
    { 
      id: 1, 
      name: 'Fashion Hub Wholesaler', 
      contact: '+91 98765 43210', 
      email: 'orders@fashionhub.com',
      address: 'MG Road, Bangalore',
      leadTime: '3-5 days',
      minOrder: '₹5,000',
      products: ['Cotton T-Shirts', 'Denim Jackets', 'Wallets'],
      rating: 4.8,
      totalOrders: 45,
      onTimeDelivery: '98%',
      paymentTerms: 'Net 15',
    },
    { 
      id: 2, 
      name: 'ElectroMart Supplies', 
      contact: '+91 87654 32109', 
      email: 'sales@electromart.com',
      address: 'Brigade Road, Bangalore',
      leadTime: '5-7 days',
      minOrder: '₹10,000',
      products: ['Headphones', 'Smartwatches', 'Chargers'],
      rating: 4.6,
      totalOrders: 32,
      onTimeDelivery: '95%',
      paymentTerms: 'Net 30',
    },
    { 
      id: 3, 
      name: 'SportFit Athletics', 
      contact: '+91 76543 21098', 
      email: 'support@sportfit.com',
      address: 'Commercial Street, Bangalore',
      leadTime: '4-6 days',
      minOrder: '₹7,500',
      products: ['Running Shoes', 'Tracksuits'],
      rating: 4.9,
      totalOrders: 28,
      onTimeDelivery: '99%',
      paymentTerms: 'Net 7',
    },
    { 
      id: 4, 
      name: 'LeatherCraft Artisans', 
      contact: '+91 65432 10987', 
      email: 'info@leathercraft.com',
      address: 'Indiranagar, Bangalore',
      leadTime: '3-5 days',
      minOrder: '₹3,000',
      products: ['Wallets', 'Belts', 'Handbags'],
      rating: 4.7,
      totalOrders: 52,
      onTimeDelivery: '97%',
      paymentTerms: 'Net 30',
    },
  ];

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contact.includes(searchQuery) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage) || 1;
  const paginatedSuppliers = filteredSuppliers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between h-full flex-1">
      <div>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Truck size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Verified Suppliers</h3>
              <p className="text-[11px] text-gray-400">Direct wholesaler partners & fulfillment metrics</p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary-800 bg-primary-50 border border-primary-200/70 px-2.5 py-0.5 rounded-full">
            {suppliers.length} Active
          </span>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search supplier name, contact, product..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Supplier Cards List */}
        <div className="p-4 sm:p-5 space-y-3 max-h-[300px] overflow-y-auto">
          {paginatedSuppliers.map((s) => (
            <div 
              key={s.id}
              className="p-3.5 rounded-2xl border border-gray-200/80 bg-white hover:border-primary-300 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <span>{s.name}</span>
                    <CheckCircle size={12} className="text-emerald-500" />
                  </h4>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />
                    <span>{s.address}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-amber-800 text-[11px] font-bold">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span>{s.rating}</span>
                </div>
              </div>

              {/* Specs & Performance Strip */}
              <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-gray-50 text-[10px] text-gray-600">
                <div>
                  <span className="text-gray-400 block">Lead Time</span>
                  <strong className="text-gray-900">{s.leadTime}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Min. Order</span>
                  <strong className="text-gray-900">{s.minOrder}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">On-Time</span>
                  <strong className="text-emerald-700 font-bold">{s.onTimeDelivery}</strong>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${s.contact}`}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Phone size={11} />
                  <span>Call</span>
                </a>
                <a
                  href={`mailto:${s.email}`}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Mail size={11} />
                  <span>Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-5 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs">
          <span className="text-gray-400 text-[11px]">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
