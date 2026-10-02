"use client";

import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  Check,
  X,
  AlertCircle,
  FileBarChart,
  Loader2
} from '@/utils/icons';
import '../../../../styles/Wholesaler/Customers/ImportExport.scss';

export default function ImportExport({ selectedCount = 0, onImport, onExport }) {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportColumns, setExportColumns] = useState(['all']);
  const fileInputRef = useRef(null);

  const importFormats = [
    { id: 'csv', label: 'CSV', icon: FileBarChart, description: 'Comma separated values' },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'XLSX, XLS sheet' }
  ];

  const exportFormats = [
    { id: 'csv', label: 'CSV', icon: FileBarChart, description: 'Spreadsheet import' },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format' },
    { id: 'pdf', label: 'PDF', icon: FileText, description: 'Printable statement' }
  ];

  const columns = [
    { id: 'name', label: 'Business Name' },
    { id: 'email', label: 'Email Address' },
    { id: 'phone', label: 'Phone Number' },
    { id: 'city', label: 'City' },
    { id: 'state', label: 'State' },
    { id: 'orders', label: 'Total Orders' },
    { id: 'spent', label: 'Gross Spent' },
    { id: 'status', label: 'Account Status' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    setUploadError(null);
    
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExt)) {
      setUploadError('Invalid file format. Please upload CSV or Excel (.xlsx/.xls) file.');
      setSelectedFile(null);
      return;
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    
    try {
      setUploadSuccess(true);
      onImport?.(selectedFile);
      setTimeout(() => {
        setUploadSuccess(false);
        setIsImportOpen(false);
        setSelectedFile(null);
      }, 1500);
    } catch (error) {
      setUploadError(error?.message || 'Import failed. Please verify format.');
    } finally {
      setUploading(false);
    }
  };

  const handleExport = () => {
    const columnsToExport = exportColumns.includes('all') 
      ? columns.map(c => c.id) 
      : exportColumns;
    onExport?.({ format: exportFormat, columns: columnsToExport });
    setIsExportOpen(false);
  };

  const toggleColumn = (columnId) => {
    if (columnId === 'all') {
      setExportColumns(['all']);
    } else {
      if (exportColumns.includes('all')) {
        setExportColumns([columnId]);
      } else if (exportColumns.includes(columnId)) {
        setExportColumns(exportColumns.filter(c => c !== columnId));
      } else {
        setExportColumns([...exportColumns, columnId]);
      }
    }
  };

  return (
    <div className="import-export flex items-center gap-2">
      {/* Import Button */}
      <button
        className="import-btn flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
        onClick={() => setIsImportOpen(true)}
      >
        <Upload size={14} className="text-slate-500" />
        <span>Import</span>
      </button>

      {/* Export Button */}
      <button
        className="export-btn flex items-center gap-1.5 px-3.5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        onClick={() => setIsExportOpen(true)}
      >
        <Download size={14} />
        <span>Export</span>
        {selectedCount > 0 && (
          <span className="ml-0.5 px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
            {selectedCount}
          </span>
        )}
      </button>

      {/* Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsImportOpen(false)}
          />
          <div className="import-modal relative bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-2xs">
                  <Upload size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Import Retailers</h3>
                  <p className="text-xs text-slate-500">Upload bulk customer accounts from CSV / Excel</p>
                </div>
              </div>
              <button 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
                onClick={() => setIsImportOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* File Upload Area */}
            <div
              className={`upload-area border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all ${
                dragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 bg-slate-50/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {!selectedFile ? (
                <>
                  <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-1">Drag and drop file here</p>
                  <p className="text-[11px] text-slate-400 mb-3">or click browse</p>
                  <button
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </button>
                  <p className="text-[10px] text-slate-400 mt-3">Supports CSV, Excel (.xlsx/.xls) up to 10MB</p>
                </>
              ) : (
                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet size={24} className="text-primary-600" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[180px] sm:max-w-[240px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-1 text-slate-400 hover:text-rose-600"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-600 flex-shrink-0" />
                <p className="text-xs font-semibold text-rose-700">{uploadError}</p>
              </div>
            )}

            {uploadSuccess && (
              <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <Check size={14} className="text-emerald-600 flex-shrink-0" />
                <p className="text-xs font-semibold text-emerald-700">File uploaded and queued for processing!</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-2xs"
                onClick={() => setIsImportOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                onClick={handleImport}
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload size={13} />
                    <span>Import File</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsExportOpen(false)}
          />
          <div className="export-modal relative bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-2xs">
                  <Download size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Export Retailers Directory</h3>
                  <p className="text-xs text-slate-500">
                    {selectedCount > 0 ? `${selectedCount} retailers selected` : 'Export all filtered customers'}
                  </p>
                </div>
              </div>
              <button 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
                onClick={() => setIsExportOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Format Selection */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-2">Export Document Format</label>
              <div className="grid grid-cols-3 gap-2">
                {exportFormats.map(format => {
                  const Icon = format.icon;
                  const isActive = exportFormat === format.id;
                  return (
                    <button
                      key={format.id}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isActive
                          ? 'border-primary-500 bg-primary-50 text-primary-800 ring-2 ring-primary-100 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                      }`}
                      onClick={() => setExportFormat(format.id)}
                    >
                      <Icon size={18} className="mx-auto mb-1 text-current" />
                      <p className="text-xs font-bold">{format.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{format.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column Selection */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Include Columns</label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
                <button
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    exportColumns.includes('all')
                      ? 'bg-primary-500 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                  onClick={() => toggleColumn('all')}
                >
                  All Columns
                </button>
                {columns.map(col => (
                  <button
                    key={col.id}
                    className={`px-2 py-1 text-xs font-medium rounded-lg transition-all ${
                      exportColumns.includes('all') || exportColumns.includes(col.id)
                        ? 'bg-primary-50 text-primary-800 border border-primary-200 font-bold'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                    onClick={() => toggleColumn(col.id)}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-2xs"
                onClick={() => setIsExportOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                onClick={handleExport}
              >
                <Download size={13} />
                <span>Export {selectedCount > 0 ? `(${selectedCount})` : 'All'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
