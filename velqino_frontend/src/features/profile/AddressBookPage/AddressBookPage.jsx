"use client";

import React, { useState } from 'react';
import { useGetUserAddressesQuery, useDeleteAddressMutation } from '../../../redux/wholesaler/slices/productsSlice';
import { MapPin, Plus, Loader2 } from '../../../utils/icons';
import AddressCard from './Components/AddressCard';
import AddressFormModal from './Components/AddressFormModal';
import { toast } from 'react-toastify';

export default function AddressBookPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  const { data, isLoading, refetch } = useGetUserAddressesQuery();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  
  const addresses = data?.data || [];
  
  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId).unwrap();
        toast.success('Address deleted successfully');
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete address');
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
    refetch();
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl h-40"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Address Book</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your saved addresses</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-all"
        >
          <Plus size={18} />
          Add New Address
        </button>
      </div>
      
      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-500 mb-4">Add your first address for faster checkout</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <Plus size={16} />
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address.id)}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
      
      {/* Add/Edit Modal */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        address={editingAddress}
      />
    </div>
  );
}