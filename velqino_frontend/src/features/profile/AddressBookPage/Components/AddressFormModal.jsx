"use client";

import React, { useState, useEffect } from 'react';
import { X, MapPin, Loader2 } from '../../../../utils/icons';
import { useCreateAddressMutation, useUpdateAddressMutation } from '../../../../redux/wholesaler/slices/productsSlice';
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
        is_default: address.is_default || false,
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
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'PIN code must be 6 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      if (address) {
        await updateAddress({ addressId: address.id, data: formData }).unwrap();
        toast.success('Address updated successfully');
      } else {
        await createAddress(formData).unwrap();
        toast.success('Address added successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save address');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-primary-500" />
              <h2 className="text-xl font-bold text-gray-900">
                {address ? 'Edit Address' : 'Add New Address'}
              </h2>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.full_name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                  }`}
                  placeholder="John Doe"
                />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                  }`}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <textarea
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.street ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                  }`}
                  placeholder="House number, building, street"
                />
                {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.city ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                  }`}
                  placeholder="City"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.state ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                  }`}
                  placeholder="State"
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.pincode ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                  }`}
                  placeholder="6-digit PIN code"
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  placeholder="Near metro station, landmark"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleChange}
                  id="is_default"
                  className="w-4 h-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="is_default" className="text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(isCreating || isUpdating) ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  address ? 'Update Address' : 'Save Address'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}