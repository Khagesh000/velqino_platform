"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Loader2, 
  Home, 
  Building, 
  User, 
  Phone, 
  Check, 
  Sparkles 
} from '../../../../utils/icons';
import { 
  useCreateAddressMutation, 
  useUpdateAddressMutation 
} from '../../../../redux/wholesaler/slices/productsSlice';
import { toast } from 'react-toastify';

export default function AddressFormModal({ isOpen, onClose, address }) {
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    is_default: false,
    address_type: 'home'
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (address) {
      setFormData({
        full_name: address.full_name || '',
        phone: address.phone || '',
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
        landmark: address.landmark || '',
        is_default: Boolean(address.is_default),
        address_type: address.address_type || 'home'
      });
    } else {
      setFormData({
        full_name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        is_default: false,
        address_type: 'home'
      });
    }
    setErrors({});
  }, [address, isOpen]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, address_type: type }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Valid 10-digit mobile number required';
    }
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'PIN code must be exactly 6 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      if (address) {
        await updateAddress({ addressId: address.id, data: formData }).unwrap();
        toast.success('Address updated successfully!');
      } else {
        await createAddress(formData).unwrap();
        toast.success('New address added to directory!');
      }
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save address. Please try again.');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100 shadow-2xs">
                <MapPin size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                  {address ? 'Edit Saved Address' : 'Add New Delivery Address'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter delivery coordinates for accurate doorstep dispatches
                </p>
              </div>
            </div>

            <button 
              type="button"
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {/* Address Type Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Address Type
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: 'home', label: 'Home', icon: Home },
                  { value: 'work', label: 'Office / Work', icon: Building },
                  { value: 'other', label: 'Other', icon: MapPin },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.address_type === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleTypeSelect(type.value)}
                      className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                        isSelected
                          ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-xs'
                          : 'bg-gray-50/80 border-gray-200/80 text-gray-600 hover:bg-gray-100/80'
                      }`}
                    >
                      <Icon size={14} className={isSelected ? 'text-primary-600' : 'text-gray-400'} />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Recipient Full Name *
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-gray-50/80 border text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                      errors.full_name 
                        ? 'border-red-400 focus:ring-red-200' 
                        : 'border-gray-200/90 focus:border-primary-500 focus:ring-primary-500/20'
                    }`}
                    placeholder="e.g. John Doe"
                  />
                </div>
                {errors.full_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.full_name}</p>}
              </div>
              
              {/* Phone Number */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  10-Digit Mobile Number *
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-gray-50/80 border text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                      errors.phone 
                        ? 'border-red-400 focus:ring-red-200' 
                        : 'border-gray-200/90 focus:border-primary-500 focus:ring-primary-500/20'
                    }`}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
              </div>
              
              {/* Street Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Street Address, House / Flat No., Area *
                </label>
                <textarea
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  rows={2}
                  className={`w-full px-3.5 py-2.5 rounded-2xl bg-gray-50/80 border text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    errors.street 
                      ? 'border-red-400 focus:ring-red-200' 
                      : 'border-gray-200/90 focus:border-primary-500 focus:ring-primary-500/20'
                  }`}
                  placeholder="e.g. Flat 402, Sunshine Heights, MG Road"
                />
                {errors.street && <p className="text-red-500 text-xs mt-1 font-medium">{errors.street}</p>}
              </div>
              
              {/* City */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-2xl bg-gray-50/80 border text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    errors.city 
                      ? 'border-red-400 focus:ring-red-200' 
                      : 'border-gray-200/90 focus:border-primary-500 focus:ring-primary-500/20'
                  }`}
                  placeholder="e.g. Mumbai"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1 font-medium">{errors.city}</p>}
              </div>
              
              {/* State */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-2xl bg-gray-50/80 border text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    errors.state 
                      ? 'border-red-400 focus:ring-red-200' 
                      : 'border-gray-200/90 focus:border-primary-500 focus:ring-primary-500/20'
                  }`}
                  placeholder="e.g. Maharashtra"
                />
                {errors.state && <p className="text-red-500 text-xs mt-1 font-medium">{errors.state}</p>}
              </div>
              
              {/* PIN Code */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">6-Digit PIN Code *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  className={`w-full px-3.5 py-2.5 rounded-2xl bg-gray-50/80 border text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    errors.pincode 
                      ? 'border-red-400 focus:ring-red-200' 
                      : 'border-gray-200/90 focus:border-primary-500 focus:ring-primary-500/20'
                  }`}
                  placeholder="e.g. 400001"
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pincode}</p>}
              </div>
              
              {/* Landmark */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50/80 border border-gray-200/90 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="e.g. Opposite City Mall"
                />
              </div>

              {/* Default Address Checkbox */}
              <div className="sm:col-span-2 pt-1">
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/80 border border-gray-200/80 cursor-pointer hover:bg-gray-100/60 transition-colors">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-900 block">Set as Primary Shipping Address</span>
                    <span className="text-gray-500">Automatically select this destination during express checkout</span>
                  </div>
                </label>
              </div>

            </div>
            
            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex-1 px-5 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                style={{ color: '#ffffff' }}
              >
                {(isCreating || isUpdating) ? (
                  <>
                    <Loader2 size={15} className="animate-spin !text-white text-white" style={{ color: '#ffffff' }} />
                    <span className="!text-white text-white" style={{ color: '#ffffff' }}>Saving...</span>
                  </>
                ) : (
                  <span className="!text-white text-white" style={{ color: '#ffffff' }}>
                    {address ? 'Update Address' : 'Save Address'}
                  </span>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
