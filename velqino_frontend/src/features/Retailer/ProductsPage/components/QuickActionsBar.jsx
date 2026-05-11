"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Scan, Upload, Printer, Download, Filter, Grid, List, Search, X } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerProducts/QuickActionsBar.scss'

export default function QuickActionsBar({ onAddProduct, onScanBarcode, onImport, onPrintLabels, onViewChange, currentView, onExportClick }) {
  const [mounted, setMounted] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [barcodeValue, setBarcodeValue] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleBarcodeSubmit = () => {
    if (barcodeValue && onScanBarcode) {
      onScanBarcode(barcodeValue)
      setBarcodeValue('')
      setShowScanner(false)
    }
  }

  const actions = [
  { 
    id: 'add', 
    label: 'Add Product', 
    icon: <Plus size={18} />, 
    color: 'primary', 
    onClick: () => {
      // Show dropdown with three options
      const dropdown = document.createElement('div');
      dropdown.className = 'absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[160px]';
      dropdown.innerHTML = `
        <div class="py-1">
          <button class="add-single-product w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Single Product
          </button>
          <button class="add-bulk-images w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Bulk Images
          </button>
          <button class="add-bulk-video w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            Bulk Video
          </button>
        </div>
      `;
      
      const btn = document.querySelector('.action-btn-primary');
      if (btn) {
        const rect = btn.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${rect.bottom + 5}px`;
        dropdown.style.left = `${rect.left}px`;
        document.body.appendChild(dropdown);
        
        const closeDropdown = (e) => {
          if (!dropdown.contains(e.target) && e.target !== btn) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
          }
        };
        setTimeout(() => document.addEventListener('click', closeDropdown), 0);
        
        dropdown.querySelector('.add-single-product')?.addEventListener('click', () => {
          onAddProduct?.('single');
          dropdown.remove();
        });
        dropdown.querySelector('.add-bulk-images')?.addEventListener('click', () => {
          onAddProduct?.('bulk-images');
          dropdown.remove();
        });
        dropdown.querySelector('.add-bulk-video')?.addEventListener('click', () => {
          onAddProduct?.('bulk-video');
          dropdown.remove();
        });
      }
    } 
  },
  { id: 'scan', label: 'Scan Barcode', icon: <Scan size={18} />, color: 'blue', onClick: () => setShowScanner(true) },
  { id: 'import', label: 'Import Products', icon: <Upload size={18} />, color: 'green', onClick: onImport },
  { id: 'print', label: 'Print Labels', icon: <Printer size={18} />, color: 'purple', onClick: onPrintLabels },
];




  return (
    <div className="quick-actions-bar bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`action-btn action-btn-${action.color} px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2`}
              >
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button 
          onClick={onExportClick}
          className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export</span>
        </button>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Scan size={20} className="text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Scan Barcode</h3>
              </div>
              <button onClick={() => setShowScanner(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Scanner Preview */}
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <div className="h-32 flex items-center justify-center relative">
                <div className="w-full h-0.5 bg-green-500 animate-scan" />
                <div className="absolute inset-0 border-2 border-green-500 rounded-lg opacity-50" />
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                Position barcode in front of camera
              </p>
            </div>

            {/* Manual Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or enter barcode manually
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter barcode number"
                  value={barcodeValue}
                  onChange={(e) => setBarcodeValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSubmit()}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  autoFocus
                />
                <button
                  onClick={handleBarcodeSubmit}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 text-center">
              Supported: EAN-13, UPC-A, Code 128, QR Code
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
