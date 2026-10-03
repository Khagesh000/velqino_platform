'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle, 
  Package, 
  Eye,
  Sparkles
} from '../../../../utils/icons';
import { useImportProductsMutation } from '@/redux/retailer/slices/retailerProductsSlice';
import { toast } from 'react-toastify';

export default function ImportProductsModal({ onClose, onImport, isOpen }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [importProducts] = useImportProductsMutation();

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setProgress(0);
      setUploading(false);
    }
  }, [isOpen]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    const fileExt = selectedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileExt)) {
      toast.error('Please upload an Excel (.xlsx/.xls) or CSV file');
      return;
    }
    
    if (selectedFile.size > 8 * 1024 * 1024) {
      toast.error('File size should be less than 8MB');
      return;
    }
    
    setFile(selectedFile);
  };

  const downloadTemplate = () => {
    const template = [
      ['name', 'price', 'cost', 'category', 'brand', 'stock', 'description', 'sizes'],
      ['Cotton Crewneck T-Shirt', '599', '350', 'Tshirt', 'Velqino', '50', 'Pure combed cotton', 'S,M,L,XL'],
      ['Slim Fit Denim Jeans', '1499', '850', 'Jeans', 'Velqino', '35', 'Comfort stretch denim', '30,32,34,36'],
      ['Leather Biker Jacket', '3999', '2400', 'Jacket', 'Velqino', '15', 'Full grain leather', 'M,L,XL']
    ];
    
    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'velqino_product_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Sample import template downloaded');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!file) {
      toast.error('Please select an Excel or CSV spreadsheet');
      return;
    }
    
    setUploading(true);
    setProgress(30);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      setProgress(60);
      if (onImport) {
        await onImport(formData);
      } else {
        await importProducts(formData).unwrap();
        toast.success('Products imported into catalog successfully');
        onClose();
      }
      setProgress(100);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to import products from file');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-200/60 shadow-2xs">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Import Products Spreadsheet</h3>
              <p className="text-xs text-gray-500">Bulk upload catalog items via CSV or Excel</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Download Sample Banner */}
          <div className="flex items-center justify-between p-3.5 bg-primary-50/60 border border-primary-200/80 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet size={18} className="text-primary-600" />
              <div>
                <p className="text-xs font-bold text-primary-950">Standard Catalog Schema</p>
                <p className="text-[11px] text-primary-800">Includes headers for price, SKU, sizes, and stock</p>
              </div>
            </div>
            <button
              type="button"
              onClick={downloadTemplate}
              className="px-3 py-1.5 bg-white text-primary-700 hover:bg-primary-100/60 text-xs font-bold rounded-xl border border-primary-200 shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Download CSV</span>
            </button>
          </div>

          {/* File Upload Dropzone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Choose Spreadsheet File <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileSelect}
                className="hidden"
                id="import-spreadsheet-input"
              />
              <label
                htmlFor="import-spreadsheet-input"
                className={`
                  flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                  ${file 
                    ? 'border-primary-400 bg-primary-50/20' 
                    : 'border-gray-200 bg-gray-50/60 hover:bg-gray-50 hover:border-primary-400'
                  }
                `}
              >
                {file ? (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                      <FileSpreadsheet size={24} />
                    </div>
                    <p className="text-xs font-bold text-gray-900">{file.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB &bull; Click to swap</p>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                      <Upload size={22} />
                    </div>
                    <p className="text-xs font-bold text-gray-800">Drop your spreadsheet here</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Supports CSV, XLSX up to 8MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Progress bar if uploading */}
          {uploading && (
            <div className="space-y-1.5 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span>Importing records...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
          <button 
            type="button"
            onClick={onClose} 
            className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={uploading || !file}
            className="px-6 py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-2xs flex items-center gap-2 disabled:opacity-40 active:scale-95"
          >
            {uploading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload size={14} />
                <span>Import Spreadsheet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}