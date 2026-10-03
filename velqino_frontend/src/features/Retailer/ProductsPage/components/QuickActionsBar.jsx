"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Scan, 
  Upload, 
  Printer, 
  Download, 
  Filter, 
  Grid, 
  List, 
  Search, 
  X, 
  Image as ImageIcon, 
  Video, 
  Edit3, 
  DollarSign, 
  Sparkles,
  ChevronDown
} from '../../../../utils/icons';

export default function QuickActionsBar({ 
  onAddProduct, 
  onScanBarcode, 
  onImport, 
  onPrintLabels, 
  onBulkPriceUpdate,
  onViewChange, 
  currentView = 'grid', 
  onExportClick,
  onBulkEdit,
  selectedCount = 0
}) {
  const [showScanner, setShowScanner] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (barcodeValue && onScanBarcode) {
      onScanBarcode(barcodeValue);
      setBarcodeValue('');
      setShowScanner(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left Side: Creation & Bulk Ingestion Suite */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          
          {/* Hero Action: Add Single Product */}
          <div className="relative">
            <button
              type="button"
              onClick={() => onAddProduct?.('single')}
              className="px-4 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs hover:shadow-md active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Product</span>
            </button>
          </div>

          {/* Bulk Images Action */}
          <button
            type="button"
            onClick={() => onAddProduct?.('bulk-images')}
            className="px-3.5 py-2.5 rounded-2xl bg-primary-50 hover:bg-primary-100/80 border border-primary-200/90 text-primary-800 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
            title="Upload multiple products at once using photos"
          >
            <ImageIcon size={15} className="text-primary-600" />
            <span>Bulk Images</span>
            <span className="text-[10px] font-extrabold bg-primary-200/60 text-primary-800 px-1.5 py-0.2 rounded-md">
              Fast
            </span>
          </button>

          {/* Bulk Video Action */}
          <button
            type="button"
            onClick={() => onAddProduct?.('bulk-video')}
            className="px-3.5 py-2.5 rounded-2xl bg-accent-50 hover:bg-accent-100/80 border border-accent-200/90 text-accent-900 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
            title="Import products extracted from video frames"
          >
            <Video size={15} className="text-accent-700" />
            <span>Bulk Video</span>
          </button>

          {/* Import CSV / Excel Action */}
          <button
            type="button"
            onClick={onImport}
            className="px-3.5 py-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
            title="Import spreadsheet CSV or XLSX"
          >
            <Upload size={14} className="text-gray-500" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>

          {/* Export Catalog Action */}
          <button
            type="button"
            onClick={onExportClick}
            className="px-3.5 py-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
            title="Export full catalog to Excel"
          >
            <Download size={14} className="text-gray-500" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Right Side: Operational Tools & View Controls */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          
          {/* Bulk Edit Trigger (Highlights when products selected) */}
          <button
            type="button"
            onClick={onBulkEdit}
            className={`
              px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border
              ${selectedCount > 0 
                ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <Edit3 size={14} />
            <span>Bulk Edit</span>
            {selectedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-black">
                {selectedCount}
              </span>
            )}
          </button>

          {/* Barcode Labels Trigger */}
          <button
            type="button"
            onClick={() => {
              if (onPrintLabels) onPrintLabels();
              scrollToSection('barcode-printing-section');
            }}
            className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Print Barcode Labels"
          >
            <Printer size={14} className="text-gray-500" />
            <span className="hidden md:inline">Barcodes</span>
          </button>

          {/* Bulk Price Update Trigger */}
          <button
            type="button"
            onClick={() => {
              if (onBulkPriceUpdate) onBulkPriceUpdate();
              scrollToSection('bulk-price-section');
            }}
            className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Bulk Price Update"
          >
            <DollarSign size={14} className="text-gray-500" />
            <span className="hidden md:inline">Price Tool</span>
          </button>

          {/* Barcode Scanner Toggle */}
          <button
            type="button"
            onClick={() => setShowScanner(!showScanner)}
            className={`
              p-2 rounded-xl border transition-all text-xs font-bold flex items-center gap-1
              ${showScanner 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
              }
            `}
            title="Scan Barcode"
          >
            <Scan size={15} />
          </button>

          {/* Grid vs List View Mode Toggle */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => onViewChange?.('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                currentView === 'grid' 
                  ? 'bg-white text-gray-900 shadow-2xs' 
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              type="button"
              onClick={() => onViewChange?.('list')}
              className={`p-1.5 rounded-lg transition-all ${
                currentView === 'list' 
                  ? 'bg-white text-gray-900 shadow-2xs' 
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>

        </div>
      </div>

      {/* Optical Barcode Scanner Input Bar */}
      {showScanner && (
        <form onSubmit={handleBarcodeSubmit} className="pt-3 border-t border-gray-100 flex items-center gap-2 animate-fadeIn">
          <div className="relative flex-1">
            <Scan size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-600" />
            <input
              type="text"
              autoFocus
              placeholder="Scan or enter barcode number and press Enter..."
              value={barcodeValue}
              onChange={(e) => setBarcodeValue(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
            />
            {barcodeValue && (
              <button
                type="button"
                onClick={() => setBarcodeValue('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 shadow-2xs"
          >
            Lookup
          </button>
          <button
            type="button"
            onClick={() => setShowScanner(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl"
          >
            <X size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
