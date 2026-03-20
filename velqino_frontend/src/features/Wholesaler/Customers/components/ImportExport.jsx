"use client"

import React, { useState, useRef } from 'react'
import {
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  Check,
  X,
  AlertCircle,
  DownloadCloud,
  FileJson,
  FileImage,
  ChevronDown,
  RefreshCw
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Customers/ImportExport.scss'

export default function ImportExport({ selectedCount = 0, onImport, onExport }) {
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [exportFormat, setExportFormat] = useState('csv')
  const [exportColumns, setExportColumns] = useState(['all'])
  const fileInputRef = useRef(null)

  const importFormats = [
    { id: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma separated values' },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'XLSX, XLS format' },
    { id: 'json', label: 'JSON', icon: FileJson, description: 'JavaScript Object Notation' }
  ]

  const exportFormats = [
    { id: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma separated values' },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'XLSX format' },
    { id: 'pdf', label: 'PDF', icon: FileText, description: 'PDF document' }
  ]

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'company', label: 'Company' },
    { id: 'type', label: 'Customer Type' },
    { id: 'location', label: 'Location' },
    { id: 'orders', label: 'Total Orders' },
    { id: 'spent', label: 'Total Spent' },
    { id: 'status', label: 'Status' },
    { id: 'loyalty', label: 'Loyalty Tier' },
    { id: 'lastOrder', label: 'Last Order Date' }
  ]

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file) => {
    setSelectedFile(file)
    setUploadError(null)
    
    const validTypes = ['.csv', '.xlsx', '.xls', '.json']
    const fileExt = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!validTypes.includes(fileExt)) {
      setUploadError('Invalid file format. Please upload CSV, Excel, or JSON file.')
      setSelectedFile(null)
      return
    }
  }

  const handleImport = () => {
    if (!selectedFile) return
    
    setUploading(true)
    setUploadError(null)
    
    setTimeout(() => {
      setUploading(false)
      setUploadSuccess(true)
      onImport?.(selectedFile)
      
      setTimeout(() => {
        setUploadSuccess(false)
        setIsImportOpen(false)
        setSelectedFile(null)
      }, 2000)
    }, 2000)
  }

  const handleExport = () => {
    onExport?.({ format: exportFormat, columns: exportColumns })
    setIsExportOpen(false)
  }

  const toggleColumn = (columnId) => {
    if (columnId === 'all') {
      setExportColumns(['all'])
    } else {
      if (exportColumns.includes('all')) {
        setExportColumns([columnId])
      } else if (exportColumns.includes(columnId)) {
        setExportColumns(exportColumns.filter(c => c !== columnId))
      } else {
        setExportColumns([...exportColumns, columnId])
      }
    }
  }

  return (
    <div className="import-export flex items-center gap-2 sm:gap-3">
      {/* Import Button */}
      <button
        className="import-btn flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
        onClick={() => setIsImportOpen(true)}
      >
        <Upload size={14} className="sm:w-4 sm:h-4" />
        <span>Import</span>
      </button>

      {/* Export Button */}
      <button
        className="export-btn flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-600 transition-all"
        onClick={() => setIsExportOpen(true)}
      >
        <Download size={14} className="sm:w-4 sm:h-4" />
        <span>Export</span>
        {selectedCount > 0 && (
          <span className="ml-0.5 sm:ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xxs">
            {selectedCount}
          </span>
        )}
      </button>

      {/* Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsImportOpen(false)}
          />
          <div className="import-modal relative bg-white rounded-xl max-w-lg w-full p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                  <Upload size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Import Customers</h3>
                  <p className="text-xs text-gray-500">Upload customer data from file</p>
                </div>
              </div>
              <button 
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                onClick={() => setIsImportOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* File Upload Area */}
            <div
              className={`upload-area border-2 border-dashed rounded-xl p-4 sm:p-8 text-center transition-all ${
                dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {!selectedFile ? (
                <>
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Drag & drop file here</p>
                  <p className="text-xs text-gray-500 mb-3">or</p>
                  <button
                    className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </button>
                  <p className="text-xxs text-gray-400 mt-3">Supports CSV, Excel, JSON (Max 10MB)</p>
                </>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet size={24} className="text-primary-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-[200px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-xxs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-1 text-gray-400 hover:text-error-500"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Format Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">Supported formats:</p>
              <div className="flex flex-wrap gap-2">
                {importFormats.map(format => {
                  const Icon = format.icon
                  return (
                    <div key={format.id} className="flex items-center gap-1 text-xxs text-gray-500">
                      <Icon size={12} />
                      <span>{format.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="mt-3 p-2 bg-error-50 rounded-lg flex items-center gap-2">
                <AlertCircle size={14} className="text-error-500" />
                <p className="text-xs text-error-600">{uploadError}</p>
              </div>
            )}

            {/* Success Message */}
            {uploadSuccess && (
              <div className="mt-3 p-2 bg-success-50 rounded-lg flex items-center gap-2">
                <Check size={14} className="text-success-500" />
                <p className="text-xs text-success-600">File uploaded successfully!</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                onClick={() => setIsImportOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center gap-2"
                onClick={handleImport}
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    Import
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsExportOpen(false)}
          />
          <div className="export-modal relative bg-white rounded-xl max-w-lg w-full p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                  <Download size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Export Customers</h3>
                  <p className="text-xs text-gray-500">
                    {selectedCount > 0 ? `${selectedCount} customers selected` : 'Export all customers'}
                  </p>
                </div>
              </div>
              <button 
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                onClick={() => setIsExportOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Format Selection */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {exportFormats.map(format => {
                  const Icon = format.icon
                  const isActive = exportFormat === format.id
                  return (
                    <button
                      key={format.id}
                      className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                        isActive
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300 text-gray-600'
                      }`}
                      onClick={() => setExportFormat(format.id)}
                    >
                      <Icon size={20} className="mx-auto mb-1" />
                      <p className="text-xs font-medium">{format.label}</p>
                      <p className="text-xxs text-gray-500">{format.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Column Selection */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Select Columns</label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                <button
                  className={`px-2 py-1 text-xxs rounded-full transition-all ${
                    exportColumns.includes('all')
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => toggleColumn('all')}
                >
                  All Columns
                </button>
                {columns.map(col => (
                  <button
                    key={col.id}
                    className={`px-2 py-1 text-xxs rounded-full transition-all ${
                      exportColumns.includes('all') || exportColumns.includes(col.id)
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => toggleColumn(col.id)}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                onClick={() => setIsExportOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center gap-2"
                onClick={handleExport}
              >
                <Download size={14} />
                Export {selectedCount > 0 ? `(${selectedCount})` : 'All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}