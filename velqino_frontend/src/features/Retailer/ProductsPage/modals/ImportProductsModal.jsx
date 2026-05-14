'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, Package, Eye } from '../../../../utils/icons';
import { useImportProductsMutation } from '@/redux/retailer/slices/retailerProductsSlice';
import { toast } from 'react-toastify';

export default function ImportProductsModal({ onClose, onImport, isOpen }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState([]);
  const [importProducts, { isLoading: isImporting }] = useImportProductsMutation();
  const [progressMessage, setProgressMessage] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setPreviewData([]);
      setShowPreview(false);
      setProgress(0);
      setErrors([]);
    }
  }, [isOpen]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    const fileExt = selectedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileExt)) {
      toast.error('Please upload Excel or CSV file');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    setErrors([]);
    
    // Simulate preview (in real app, parse the file)
    toast.success('File selected successfully');
  };

  const downloadTemplate = () => {
    const template = [
        ['name', 'price', 'cost', 'category', 'brand', 'stock', 'description', 'sizes', 'image_url'],
        ['Cotton T-Shirt', '599', '350', 'Tshirt', 'Velqino', '50', 'Comfortable cotton shirt', 'S,M,L,XL', 'https://example.com/image1.jpg'],
        ['Denim Jeans', '1299', '800', 'Jeans', 'Velqino', '30', 'Premium denim', '32,34,36,38', 'https://example.com/image2.jpg'],
        ['Leather Jacket', '3999', '2500', 'Jackets', 'Velqino', '15', 'Genuine leather', 'M,L,XL,XXL', 'https://example.com/image3.jpg']
    ];
    
    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Template downloaded');
};

  const handleSubmit = async () => {
    if (!file) {
        toast.error('Please select a file to import');
        return;
    }
    
    setUploading(true);
    setProgress(10);
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        setProgress(30);
        setProgressMessage('Processing file...');
        
        // ✅ Call the API mutation
        const response = await importProducts(formData).unwrap();
        
        setProgress(100);
        toast.success(response?.message || 'Products imported successfully');
        setTimeout(() => onClose(), 1500);
    } catch (error) {
        toast.error(error?.data?.message || 'Failed to import products');
        console.error(error);
        setErrors([error?.data?.message || 'Failed to process file. Please check the format.']);
    } finally {
        setUploading(false);
    }
};

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl pt-[56px] pb-[70px] sm:pt-20 sm:pb-16">
        <div className="h-full bg-white rounded-l-2xl shadow-xl overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <FileSpreadsheet size={20} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Import Products</h2>
                  <p className="text-sm text-gray-500">Bulk upload products from Excel/CSV</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Importing products...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className={`space-y-6 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Step 1: Download Template */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">1</div>
                  <h3 className="font-medium text-gray-900">Download Template</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3 ml-9">
                  Download our template file with correct column headers
                </p>
                <button
                  onClick={downloadTemplate}
                  className="ml-9 flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-all"
                >
                  <Download size={16} />
                  Download Template (CSV)
                </button>
              </div>

              {/* Step 2: Upload File */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">2</div>
                  <h3 className="font-medium text-gray-900">Upload File</h3>
                </div>
                
                {!file ? (
                  <div className="ml-9">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="import-file"
                    />
                    <label
                      htmlFor="import-file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-all bg-gray-50"
                    >
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Click to upload Excel/CSV file</span>
                      <span className="text-xs text-gray-400">XLSX, XLS, CSV (Max 5MB)</span>
                    </label>
                  </div>
                ) : (
                  <div className="ml-9 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet size={18} className="text-green-600" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Step 3: Preview & Import */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">3</div>
                  <h3 className="font-medium text-gray-900">Import</h3>
                </div>
                
                {/* Column Mapping Info */}
                <div className="ml-9 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-blue-500 mt-0.5" />
                      <div className="text-xs text-blue-700">
                        <p className="font-medium mb-1">Required columns:</p>
                        <p>name, price, category, stock</p>
                        <p className="mt-1 text-blue-600">Optional: cost, brand, description, sizes (comma separated), <span className="font-medium">image_url</span></p>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {errors.length > 0 && (
                  <div className="ml-9 mb-4 bg-red-50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-500 mt-0.5" />
                      <div className="text-xs text-red-700">
                        <p className="font-medium mb-1">Errors found:</p>
                        {errors.map((err, idx) => (
                          <p key={idx}>• {err}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!file}
                  className={`ml-9 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    file
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Upload size={16} />
                  Import Products
                </button>
              </div>
            </div>

            {/* Note */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={14} className="text-gray-400 mt-0.5" />
                <p className="text-xs text-gray-500">
                  Make sure your file follows the template format. First row should be column headers.
                  Products will be created with status "Draft" by default.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={uploading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}