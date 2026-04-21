"use client";

import React, { useState } from 'react';
import { useGetUserAddressesQuery, useCreateAddressMutation } from '@/redux/wholesaler/slices/productsSlice';
import { Plus, CheckCircle, MapPin } from '../../../../../utils/icons';
import { toast } from 'react-toastify';


export default function AddressSection({ currentStep, selectedAddress, setSelectedAddress, onNext }) {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { data: addressesData, refetch } = useGetUserAddressesQuery();
  const [createAddress] = useCreateAddressMutation();
  
  const addresses = addressesData?.data || [];
  
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  });

  const handleAddAddress = async () => {
    if (!newAddress.full_name || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      await createAddress(newAddress).unwrap();
      toast.success('Address added successfully');
      setShowAddressForm(false);
      refetch();
      setNewAddress({ full_name: '', phone: '', street: '', city: '', state: '', pincode: '', is_default: false });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add address');
    }
  };

  if (currentStep !== 1) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <CheckCircle size={16} />
          </div>
          <h2 className="font-semibold text-gray-900">Delivery Address</h2>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">{selectedAddress?.full_name}</p>
              <p className="text-sm text-gray-600 mt-0.5">{selectedAddress?.street}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}</p>
              <p className="text-sm text-gray-500 mt-1">📞 {selectedAddress?.phone}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">1</div>
          <h2 className="font-semibold text-gray-900">Delivery Address</h2>
        </div>
        <button onClick={() => setShowAddressForm(!showAddressForm)} className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
          <Plus size={14} />
          Add New
        </button>
      </div>
      
      <div className="p-5">
        {addresses.length > 0 && (
          <div className="space-y-3 mb-4">
            {addresses.map((addr) => (
              <label key={addr.id} className={`
                flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selectedAddress?.id === addr.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'}
              `}>
                <input type="radio" name="address" checked={selectedAddress?.id === addr.id} onChange={() => setSelectedAddress(addr)} className="mt-0.5 text-primary-500" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{addr.full_name}</span>
                    {addr.is_default && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">Default</span>}
                  </div>
                  <p className="text-sm text-gray-600">{addr.street}</p>
                  <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-sm text-gray-500 mt-1">📞 {addr.phone}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {showAddressForm && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <h3 className="font-medium text-gray-900 mb-3">New Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" placeholder="Full Name*" value={newAddress.full_name} onChange={(e) => setNewAddress({...newAddress, full_name: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm" />
              <input type="tel" placeholder="Phone Number*" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm" />
              <input type="text" placeholder="Street Address*" value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm" />
              <input type="text" placeholder="City*" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm" />
              <input type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm" />
              <input type="text" placeholder="PIN Code*" value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm" />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <input type="checkbox" id="is_default" checked={newAddress.is_default} onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})} className="rounded" />
              <label htmlFor="is_default" className="text-sm text-gray-600">Set as default address</label>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddAddress} className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600">Save Address</button>
              <button onClick={() => setShowAddressForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}

        {!showAddressForm && (
          <button onClick={onNext} disabled={!selectedAddress} className="w-full mt-4 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Continue to Payment
          </button>
        )}
      </div>
    </div>
  );
}