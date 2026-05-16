'use client';

import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, Truck, MapPin, AlertCircle, DollarSign, Percent, RefreshCw, Edit, Save, X } from '../../../../utils/icons';
import { useUpdateRetailerProductMutation } from '@/redux/retailer/slices/retailerProductsSlice';
import { toast } from 'react-toastify';

export default function ProductDetails({ selectedProduct, onUpdate }) {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [updateProduct] = useUpdateRetailerProductMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setEditedProduct(selectedProduct);
      setIsEditing(false);
    }
  }, [selectedProduct]);

  if (!mounted) return null;

  if (!selectedProduct) {
    return (
      <div className="product-details bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <Package size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">Select a product to view details</p>
          <p className="text-xs text-gray-400 mt-1">Click on any product from the grid</p>
        </div>
      </div>
    );
  }

  // Get image URL
  const getImageUrl = () => {
    return selectedProduct?.primary_image || selectedProduct?.images?.[0]?.image || null;
  };

  // Calculate margin
  const price = parseFloat(selectedProduct?.display_price || selectedProduct?.price || 0);
  const cost = parseFloat(selectedProduct?.cost || 0);
  const margin = cost > 0 ? ((price - cost) / price) * 100 : 0;
  const isLowStock = selectedProduct?.stock <= selectedProduct?.threshold;

  const handleSave = async () => {
    if (!editedProduct) return;
    
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('price', editedProduct.price);
      formData.append('cost', editedProduct.cost || 0);
      formData.append('stock', editedProduct.stock);
      formData.append('threshold', editedProduct.threshold);
      formData.append('brand', editedProduct.brand || '');
      formData.append('description', editedProduct.description || '');
      
      await updateProduct({ productId: editedProduct.id, data: formData }).unwrap();
      toast.success('Product updated successfully');
      if (onUpdate) onUpdate(editedProduct);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update product');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProduct(selectedProduct);
    setIsEditing(false);
  };

  const InfoRow = ({ label, value, icon, highlight, fieldName }) => (
    <div className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-0 ${highlight ? 'bg-red-50 -mx-2 px-2 rounded-lg' : ''}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      {isEditing && fieldName ? (
        <input
          type="number"
          value={editedProduct?.[fieldName] || ''}
          onChange={(e) => setEditedProduct({ ...editedProduct, [fieldName]: parseFloat(e.target.value) || 0 })}
          className="w-24 px-2 py-1 text-sm border border-gray-200 rounded-lg text-right focus:outline-none focus:border-primary-500"
        />
      ) : (
        <span className={`text-sm font-medium ${highlight ? 'text-red-600' : 'text-gray-900'}`}>
          {value}
        </span>
      )}
    </div>
  );

  return (
    <div className="product-details bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Product Details</h3>
          </div>
          <div className="flex gap-1">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
                  <X size={14} />
                </button>
                <button onClick={handleSave} disabled={isSaving} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-all">
                  {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                <Edit size={14} />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Complete product information</p>
      </div>

      {/* Product Basic Info */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
            {getImageUrl() ? (
              <img src={getImageUrl()} alt={selectedProduct.name} className="w-full h-full object-cover" />
            ) : (
              <Package size={24} className="text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-gray-900">{selectedProduct.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">SKU: {selectedProduct.sku}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="p-4 border-b border-gray-100">
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <DollarSign size={12} />
          Pricing
        </h5>
        <div className="space-y-1">
          <InfoRow label="Price" value={`₹${price.toLocaleString()}`} icon={<DollarSign size={12} className="text-gray-400" />} fieldName="price" />
          <InfoRow label="Cost" value={`₹${cost.toLocaleString()}`} icon={<DollarSign size={12} className="text-gray-400" />} fieldName="cost" />
          <InfoRow 
            label="Margin" 
            value={`${margin.toFixed(1)}%`} 
            icon={<Percent size={12} className="text-gray-400" />}
            highlight={margin < 25}
          />
        </div>
      </div>

      {/* Inventory Section */}
      <div className="p-4 border-b border-gray-100">
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Package size={12} />
          Inventory
        </h5>
        <div className="space-y-1">
          <InfoRow 
            label="Current Stock" 
            value={`${selectedProduct.stock} units`} 
            icon={<Package size={12} className="text-gray-400" />}
            highlight={isLowStock}
            fieldName="stock"
          />
          <InfoRow label="Reorder Level" value={`${selectedProduct.threshold || 10} units`} icon={<AlertCircle size={12} className="text-gray-400" />} fieldName="threshold" />
          
          {selectedProduct.stock <= (selectedProduct.threshold || 10) && (
            <div className="mt-2 p-2 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-orange-700">
                <AlertCircle size={12} />
                <span>Reorder recommended: {(selectedProduct.threshold || 10) - selectedProduct.stock} units</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supplier & Location */}
      <div className="p-4 border-b border-gray-100">
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Truck size={12} />
          Supplier & Location
        </h5>
        <div className="space-y-1">
          <InfoRow label="Supplier" value={selectedProduct.brand || 'Not specified'} icon={<Truck size={12} className="text-gray-400" />} />
          <InfoRow label="Category" value={selectedProduct.category_name || 'Not specified'} icon={<MapPin size={12} className="text-gray-400" />} />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="p-4">
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp size={12} />
          Performance
        </h5>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-500">Total Stock</p>
            <p className="text-sm font-bold text-gray-900">{selectedProduct.stock} units</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-500">Min Order Qty</p>
            <p className="text-sm font-bold text-gray-900">{selectedProduct.min_order_qty || 1} units</p>
          </div>
        </div>
      </div>
    </div>
  );
}