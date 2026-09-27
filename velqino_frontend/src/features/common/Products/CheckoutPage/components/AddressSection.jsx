"use client";

import React, { useState, useEffect } from 'react';
import { useGetUserAddressesQuery, useCreateAddressMutation } from '@/redux/wholesaler/slices/productsSlice';
import { 
  Plus, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Building, 
  Loader2, 
  ChevronRight,
  Edit3
} from '@/utils/icons';
import { toast } from 'react-toastify';

export default function AddressSection({ 
  currentStep, 
  selectedAddress, 
  setSelectedAddress, 
  onNext, 
  onEditAddress 
}) {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { data: addressesData, isLoading, refetch } = useGetUserAddressesQuery();
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  
  const addresses = addressesData?.data || [];
  
  // Auto-select default or first address if none selected yet
  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addresses, selectedAddress, setSelectedAddress]);

  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
    /* Future Hub Logistics Support (uncomment once backend implements hub models):
    hub_code: '',
    hub_name: '',
    hub_type: 'primary_warehouse',
    dock_number: ''
    */
  });

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.full_name || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.pincode) {
      toast.error('Please fill in all mandatory fields');
      return;
    }

    try {
      const response = await createAddress(newAddress).unwrap();
      toast.success('Delivery address saved!');
      setShowAddressForm(false);
      refetch();
      
      // Auto-select newly created address
      if (response?.data) {
        setSelectedAddress(response.data);
      }
      
      setNewAddress({
        full_name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        is_default: false
      });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save address');
    }
  };

  // Completed State (Shown when on subsequent steps: step > 1)
  if (currentStep > 1) {
    return (
      <div className="checkout-card">
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Step 1: Delivery Address
                </span>
                {/* Future Hub Badge (uncomment when backend hub API is ready):
                <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">
                  Verified Hub
                </span>
                */}
              </div>
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {selectedAddress?.full_name || 'Selected Delivery Address'}
              </h3>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {selectedAddress?.street}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}
              </p>
              {selectedAddress?.phone && (
                <p className="text-[11px] text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                  <Phone size={11} className="text-primary-600" />
                  <span>+91 {selectedAddress.phone}</span>
                </p>
              )}
            </div>
          </div>

          <button 
            type="button"
            onClick={onEditAddress}
            className="checkout-btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1.5 flex-shrink-0"
          >
            <Edit3 size={13} />
            <span>Change</span>
          </button>
        </div>
      </div>
    );
  }

  // Active State (Step 1)
  return (
    <div className="checkout-card">
      <div className="checkout-card-header flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
            1
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Delivery Address
            </h2>
            <p className="text-[11px] text-gray-500">
              Select or register the delivery address for order dispatch
            </p>
          </div>
        </div>

        {!showAddressForm && (
          <button 
            type="button"
            onClick={() => setShowAddressForm(true)} 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-800 bg-primary-100/80 hover:bg-primary-100 border border-primary-200/90 px-3 py-1.5 rounded-xl transition-all"
          >
            <Plus size={14} />
            <span>Add Address</span>
          </button>
        )}
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-6 text-gray-400 gap-2">
            <Loader2 size={16} className="animate-spin text-primary-600" />
            <span className="text-xs">Loading saved delivery addresses...</span>
          </div>
        )}

        {/* Existing Addresses List */}
        {!isLoading && addresses.length > 0 && !showAddressForm && (
          <div className="grid grid-cols-1 gap-3">
            {addresses.map((addr) => {
              const isSelected = selectedAddress?.id === addr.id;

              return (
                <div 
                  key={addr.id} 
                  onClick={() => setSelectedAddress(addr)}
                  className={`checkout-option-tile ${isSelected ? 'active' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-primary-600 bg-primary-600' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-900">
                          {addr.full_name}
                        </span>
                        {addr.is_default && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full">
                            Default Address
                          </span>
                        )}
                        {/* Future Hub Tag (uncomment once backend adds hub types):
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                          Warehouse Hub
                        </span>
                        */}
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {addr.street}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {addr.city}, {addr.state} - <strong className="text-gray-700">{addr.pincode}</strong>
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1 font-semibold text-primary-800">
                          <Phone size={12} className="text-primary-600" />
                          +91 {addr.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty Address State */}
        {!isLoading && addresses.length === 0 && !showAddressForm && (
          <div className="text-center py-6 border-2 border-dashed border-primary-200 rounded-2xl p-6 bg-primary-50/20">
            <MapPin size={32} className="text-primary-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-gray-800 mb-1">No Delivery Addresses Saved</h4>
            <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
              Please register your delivery address to proceed with order dispatch.
            </p>
            <button 
              type="button"
              onClick={() => setShowAddressForm(true)}
              className="checkout-btn-primary px-5 py-2.5 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add New Address</span>
            </button>
          </div>
        )}

        {/* Add New Address Form */}
        {showAddressForm && (
          <form onSubmit={handleAddAddress} className="bg-primary-50/30 border border-primary-200/90 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-primary-100">
              <div className="flex items-center gap-2">
                <Building size={16} className="text-primary-600" />
                <h3 className="text-sm font-bold text-gray-900">Add New Delivery Address</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Full Name / Contact Person*
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  value={newAddress.full_name} 
                  onChange={(e) => setNewAddress({...newAddress, full_name: e.target.value})} 
                  className="checkout-input"
                  required 
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Contact Phone Number*
                </label>
                <input 
                  type="tel" 
                  placeholder="10-digit mobile number" 
                  value={newAddress.phone} 
                  onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} 
                  className="checkout-input"
                  required 
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Street Address*
                </label>
                <input 
                  type="text" 
                  placeholder="Flat / House no., Street, Area" 
                  value={newAddress.street} 
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} 
                  className="checkout-input"
                  required 
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  City*
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Mumbai" 
                  value={newAddress.city} 
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} 
                  className="checkout-input"
                  required 
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  State*
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Maharashtra" 
                  value={newAddress.state} 
                  onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} 
                  className="checkout-input"
                  required 
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  PIN Code*
                </label>
                <input 
                  type="text" 
                  placeholder="6-digit PIN code" 
                  value={newAddress.pincode} 
                  onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} 
                  className="checkout-input"
                  required 
                />
              </div>

              {/* Future Hub Logistics Fields (Commented for future backend readiness):
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Hub / Warehouse Code (Optional)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. WH-BOM-01" 
                  value={newAddress.hub_code || ''} 
                  onChange={(e) => setNewAddress({...newAddress, hub_code: e.target.value})} 
                  className="checkout-input"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Dock / Loading Bay (Optional)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Bay 4" 
                  value={newAddress.dock_number || ''} 
                  onChange={(e) => setNewAddress({...newAddress, dock_number: e.target.value})} 
                  className="checkout-input"
                />
              </div>
              */}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input 
                type="checkbox" 
                id="is_default" 
                checked={newAddress.is_default} 
                onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})} 
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer" 
              />
              <label htmlFor="is_default" className="text-xs font-semibold text-gray-700 cursor-pointer">
                Set as default delivery address
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                type="submit" 
                disabled={isCreating}
                className="checkout-btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Saving Address...</span>
                  </>
                ) : (
                  <span>Save Address</span>
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => setShowAddressForm(false)} 
                className="checkout-btn-secondary px-4 py-2.5 text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Step 1 Completion CTA */}
        {!showAddressForm && addresses.length > 0 && (
          <div className="pt-2">
            <button 
              type="button"
              onClick={onNext} 
              disabled={!selectedAddress} 
              className="checkout-btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              <span>Continue to Delivery & Payment</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
