"use client";

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  Truck, 
  AlertCircle, 
  DollarSign, 
  Percent, 
  Edit, 
  Save, 
  X, 
  Tag, 
  CheckCircle,
  Copy,
  Printer
} from '../../../../utils/icons';
import { useUpdateRetailerProductMutation } from '@/redux/retailer/slices/retailerProductsSlice';
import { toast } from 'react-toastify';

export default function ProductDetails({ selectedProduct, onClear, onEditProduct, onUpdate }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedSku, setCopiedSku] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct]);

  if (!selectedProduct) {
    return (
      <div 
        id="product-details-section"
        className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-2xs h-full flex flex-col items-center justify-center text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 shadow-2xs">
          <Package size={26} />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-gray-900">Product Inspector</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          Select any product from the catalog grid above to examine high-resolution images, profit margins, SKU metadata, and stock levels.
        </p>
      </div>
    );
  }

  // Extract images
  const allImages = [];
  if (selectedProduct.primary_image) allImages.push(selectedProduct.primary_image);
  if (Array.isArray(selectedProduct.images)) {
    selectedProduct.images.forEach(img => {
      const url = typeof img === 'string' ? img : img.image || img.image_url;
      if (url && !allImages.includes(url)) allImages.push(url);
    });
  }
  if (allImages.length === 0 && selectedProduct.image) allImages.push(selectedProduct.image);

  const activeImage = allImages[activeImageIndex] || allImages[0] || null;

  // Pricing & Margins
  const price = Number(selectedProduct.display_price ?? selectedProduct.price ?? 0);
  const cost = Number(selectedProduct.cost || 0);
  const margin = cost > 0 && price > 0 ? Math.round(((price - cost) / price) * 100) : 0;
  const isOutOfStock = Number(selectedProduct.stock || 0) <= 0;
  const isLowStock = Number(selectedProduct.stock || 0) <= (selectedProduct.threshold || 10);

  const copySkuToClipboard = () => {
    if (selectedProduct.sku) {
      navigator.clipboard.writeText(selectedProduct.sku);
      setCopiedSku(true);
      setTimeout(() => setCopiedSku(false), 1500);
    }
  };

  return (
    <div 
      id="product-details-section" 
      className="bg-white rounded-3xl border-2 border-primary-300/80 p-5 sm:p-6 shadow-md transition-all duration-300 relative animate-fadeIn flex flex-col justify-between"
    >
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <Package size={17} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Product Details
              </h3>
              <p className="text-[11px] text-gray-400">Inventory item inspection</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onEditProduct && (
              <button
                type="button"
                onClick={() => onEditProduct(selectedProduct)}
                className="px-2.5 py-1 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Edit size={12} />
                <span>Edit</span>
              </button>
            )}

            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Close Details"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Product Media Gallery */}
        <div className="mb-4">
          <div className="relative w-full h-48 sm:h-56 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
            {activeImage ? (
              <img 
                src={activeImage} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                }}
              />
            ) : (
              <Package size={40} className="text-gray-400" />
            )}

            {/* Stock Status Badge */}
            <span className={`
              absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs backdrop-blur-xs
              ${isOutOfStock 
                ? 'bg-rose-100/90 text-rose-800 border border-rose-200' 
                : isLowStock 
                  ? 'bg-amber-100/90 text-amber-800 border border-amber-200' 
                  : 'bg-emerald-100/90 text-emerald-800 border border-emerald-200'
              }
            `}>
              {isOutOfStock ? 'Out of Stock (0 units)' : `${selectedProduct.stock} units available`}
            </span>
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`
                    w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all
                    ${activeImageIndex === idx ? 'border-primary-600 scale-105 shadow-2xs' : 'border-gray-200 opacity-70 hover:opacity-100'}
                  `}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Identifiers */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-100 text-primary-800">
              {selectedProduct.category_name || selectedProduct.category || 'General'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              {selectedProduct.status || 'Active'}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight mt-1">
            {selectedProduct.name}
          </h2>

          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span>SKU: {selectedProduct.sku}</span>
            <button
              type="button"
              onClick={copySkuToClipboard}
              className="text-gray-400 hover:text-gray-700 p-0.5"
              title="Copy SKU"
            >
              {copiedSku ? <CheckCircle size={12} className="text-emerald-600" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        {/* Pricing & Margins Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50 border border-gray-100 mb-4 text-center">
          <div>
            <span className="text-[10px] font-bold uppercase text-gray-400 block">Selling Price</span>
            <span className="text-sm sm:text-base font-black text-gray-900 mt-0.5 block">
              ₹{price.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-gray-400 block">Unit Cost</span>
            <span className="text-sm sm:text-base font-bold text-gray-600 mt-0.5 block">
              ₹{cost > 0 ? cost.toLocaleString('en-IN') : '—'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-gray-400 block">Gross Margin</span>
            <span className={`text-sm sm:text-base font-black mt-0.5 block ${margin > 20 ? 'text-emerald-600' : 'text-primary-700'}`}>
              {margin > 0 ? `${margin}%` : 'Standard'}
            </span>
          </div>
        </div>

        {/* Stock Metrics */}
        <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
          <div className="flex justify-between items-center text-gray-600">
            <span>Inventory Stock</span>
            <span className="font-bold text-gray-900">{selectedProduct.stock || 0} pcs</span>
          </div>
          <div className="flex justify-between items-center text-gray-500">
            <span>Reorder Level</span>
            <span className="font-semibold text-gray-700">{selectedProduct.threshold || 10} pcs</span>
          </div>
          {selectedProduct.brand && (
            <div className="flex justify-between items-center text-gray-500">
              <span>Brand</span>
              <span className="font-semibold text-gray-700">{selectedProduct.brand}</span>
            </div>
          )}
          {selectedProduct.description && (
            <div className="pt-2 text-gray-500">
              <span className="font-semibold text-gray-700 block mb-0.5">Description:</span>
              <p className="text-[11px] leading-relaxed text-gray-600 line-clamp-3">
                {selectedProduct.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-gray-100 mt-4 flex items-center gap-2">
        {onEditProduct && (
          <button
            type="button"
            onClick={() => onEditProduct(selectedProduct)}
            className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Edit size={14} />
            <span>Edit Product</span>
          </button>
        )}
      </div>
    </div>
  );
}