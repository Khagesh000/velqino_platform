"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Printer, 
  Scan, 
  Plus, 
  Minus, 
  Trash2, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  Settings,
  Sparkles,
  X
} from '../../../../utils/icons';

export default function BarcodePrinting() {
  const [mounted, setMounted] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [labelSize, setLabelSize] = useState('medium');
  const [isPrinting, setIsPrinting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const printRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const catalogSamples = [
    { id: 1, name: 'Denim Black Jacket', sku: 'RET-80409D4B', price: 1700, barcode: '890123456789' },
    { id: 2, name: 'Plain Shirts Premium', sku: 'RET-89FD97C3', price: 650, barcode: '890123456788' },
    { id: 3, name: 'Cotton Casual T-Shirt', sku: 'RET-38409012', price: 499, barcode: '890123456787' },
    { id: 4, name: 'Classic Track Pants', sku: 'RET-77409210', price: 899, barcode: '890123456786' },
  ];

  const filteredProducts = catalogSamples.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProductSelection = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    } else {
      setSelectedProducts(selectedProducts.map(p =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      ));
    }
  };

  const removeFromSelection = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handlePrint = async () => {
    if (selectedProducts.length === 0) return;
    
    setIsPrinting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsPrinting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      window.print();
    }, 400);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const totalLabels = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);

  const getLabelSizeClass = () => {
    switch(labelSize) {
      case 'small': return 'w-24 h-16 text-[8px]';
      case 'medium': return 'w-32 h-20 text-[10px]';
      case 'large': return 'w-40 h-24 text-xs';
      default: return 'w-32 h-20 text-[10px]';
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-2xs h-full flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3">
          <CheckCircle size={28} className="text-emerald-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900">Labels Dispatched!</h3>
        <p className="text-xs text-gray-500 mt-0.5">{totalLabels} barcode labels sent to printer.</p>
        <button
          type="button"
          onClick={() => setShowSuccess(false)}
          className="mt-4 px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-xl hover:bg-primary-700 shadow-2xs"
        >
          Print More
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs h-full flex flex-col justify-between space-y-4">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <Printer size={16} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Barcode Generator
              </h3>
              <p className="text-[11px] text-gray-400">Generate retail price tags & barcodes</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
            EAN-13
          </span>
        </div>

        <div className="space-y-4 mt-4">
          {/* Search Products */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Select Products</label>
            <div className="relative">
              <Scan size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search catalog by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Product Dropdown List */}
          {searchQuery && (
            <div className="border border-gray-200 rounded-2xl max-h-36 overflow-y-auto divide-y divide-gray-100 bg-white shadow-md animate-fadeIn">
              {filteredProducts.map(product => {
                const isSelected = !!selectedProducts.find(p => p.id === product.id);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProductSelection(product)}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50 text-left transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900">{product.name}</p>
                      <p className="text-[10px] font-mono text-gray-400">{product.sku} &bull; ₹{product.price}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isSelected ? 'Added' : '+ Add'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected Products List */}
          {selectedProducts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700">Print Queue ({selectedProducts.length})</span>
                <button
                  type="button"
                  onClick={() => setSelectedProducts([])}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                      <p className="text-[9px] font-mono text-gray-400">{product.sku}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                        className="w-5 h-5 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-xs font-bold text-gray-900 w-5 text-center">{product.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                        className="w-5 h-5 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        <Plus size={10} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromSelection(product.id)}
                        className="p-1 text-gray-400 hover:text-rose-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Label Size</label>
            <div className="grid grid-cols-3 gap-1.5 bg-gray-50 p-1 rounded-2xl border border-gray-200 text-xs">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setLabelSize(size)}
                  className={`py-1.5 font-bold uppercase text-[10px] rounded-xl transition-all ${
                    labelSize === size 
                      ? 'bg-white text-primary-900 shadow-2xs border border-gray-200/60' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Print Action */}
      <div className="pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={handlePrint}
          disabled={isPrinting || selectedProducts.length === 0}
          className="w-full py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPrinting ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              <span>Preparing Print...</span>
            </>
          ) : (
            <>
              <Printer size={14} />
              <span>Print {totalLabels > 0 ? `${totalLabels} Labels` : 'Labels'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
