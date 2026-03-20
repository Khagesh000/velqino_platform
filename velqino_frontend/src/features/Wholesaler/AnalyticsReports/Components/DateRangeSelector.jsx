"use client"

import React, { useState, useEffect, useRef } from 'react'
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  RefreshCw
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/AnalyticsReports/DateRangeSelector.scss'

export default function DateRangeSelector({ 
  value = 'last30days', 
  onChange,
  customDate = { start: '', end: '' },
  onCustomDateChange,
  showCompare = false,
  onCompareChange
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('presets')
  const [tempCustomDate, setTempCustomDate] = useState(customDate)
  const [selectedPreset, setSelectedPreset] = useState(value)
  const [compareMode, setCompareMode] = useState(false)
  const [compareValue, setCompareValue] = useState('previous')
  const dropdownRef = useRef(null)

  const presets = [
    { id: 'today', label: 'Today', icon: Clock },
    { id: 'yesterday', label: 'Yesterday', icon: Clock },
    { id: 'last7days', label: 'Last 7 days', icon: Calendar },
    { id: 'last30days', label: 'Last 30 days', icon: Calendar },
    { id: 'thisMonth', label: 'This Month', icon: Calendar },
    { id: 'lastMonth', label: 'Last Month', icon: Calendar },
    { id: 'thisQuarter', label: 'This Quarter', icon: Calendar },
    { id: 'lastQuarter', label: 'Last Quarter', icon: Calendar },
    { id: 'thisYear', label: 'This Year', icon: Calendar },
    { id: 'lastYear', label: 'Last Year', icon: Calendar }
  ]

  const compareOptions = [
    { id: 'previous', label: 'Previous period' },
    { id: 'lastYear', label: 'Same period last year' },
    { id: 'custom', label: 'Custom comparison' }
  ]

  const getDisplayLabel = () => {
    if (value === 'custom') {
      if (customDate.start && customDate.end) {
        return `${formatDate(customDate.start)} - ${formatDate(customDate.end)}`
      }
      return 'Select date range'
    }
    return presets.find(p => p.id === value)?.label || 'Select range'
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handlePresetSelect = (presetId) => {
    setSelectedPreset(presetId)
    onChange(presetId)
    
    // Set actual dates based on preset
    const today = new Date()
    let start = new Date()
    let end = new Date()

    switch(presetId) {
      case 'today':
        start = today
        end = today
        break
      case 'yesterday':
        start = new Date(today.setDate(today.getDate() - 1))
        end = new Date(today.setDate(today.getDate() - 1))
        break
      case 'last7days':
        end = new Date()
        start = new Date(today.setDate(today.getDate() - 7))
        break
      case 'last30days':
        end = new Date()
        start = new Date(today.setDate(today.getDate() - 30))
        break
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        break
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        end = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      case 'thisQuarter':
        const quarter = Math.floor(today.getMonth() / 3)
        start = new Date(today.getFullYear(), quarter * 3, 1)
        end = new Date(today.getFullYear(), (quarter + 1) * 3, 0)
        break
      case 'lastQuarter':
        const lastQuarter = Math.floor(today.getMonth() / 3) - 1
        start = new Date(today.getFullYear(), lastQuarter * 3, 1)
        end = new Date(today.getFullYear(), (lastQuarter + 1) * 3, 0)
        break
      case 'thisYear':
        start = new Date(today.getFullYear(), 0, 1)
        end = new Date(today.getFullYear(), 11, 31)
        break
      case 'lastYear':
        start = new Date(today.getFullYear() - 1, 0, 1)
        end = new Date(today.getFullYear() - 1, 11, 31)
        break
    }

    if (onCustomDateChange) {
      onCustomDateChange({
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      })
    }

    setIsOpen(false)
  }

  const handleCustomApply = () => {
    if (tempCustomDate.start && tempCustomDate.end) {
      onChange('custom')
      onCustomDateChange(tempCustomDate)
      setIsOpen(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedPresetObj = presets.find(p => p.id === selectedPreset)
  const PresetIcon = selectedPresetObj?.icon || Calendar

  return (
    <div className="date-range-selector relative" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        className={`selector-button flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium transition-all hover:border-primary-300 hover:shadow-sm ${
          isOpen ? 'border-primary-500 ring-2 ring-primary-100' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <PresetIcon size={18} className="text-gray-500" />
        <span className="text-gray-700">{getDisplayLabel()}</span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-300 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Comparison Toggle (Optional) */}
      {showCompare && (
        <button
          className={`ml-2 px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium transition-all ${
            compareMode 
              ? 'bg-primary-50 border-primary-200 text-primary-600'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => setCompareMode(!compareMode)}
        >
          <RefreshCw size={16} className="inline mr-1" />
          Compare
        </button>
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="dropdown-panel absolute right-0 mt-2 w-[600px] sm:w-[600px] max-w-[90vw] bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-20">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium text-gray-900">Select Date Range</h3>
            <button
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === 'presets'
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('presets')}
            >
              Presets
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === 'custom'
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('custom')}
            >
              Custom Range
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {activeTab === 'presets' ? (
              /* Presets Grid */
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset, index) => {
                  const Icon = preset.icon
                  return (
                    <button
                      key={preset.id}
                      className={`preset-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        selectedPreset === preset.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                      }`}
                      onClick={() => handlePresetSelect(preset.id)}
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <Icon size={16} className={selectedPreset === preset.id ? 'text-primary-500' : 'text-gray-400'} />
                      <span className="flex-1 text-left">{preset.label}</span>
                      {selectedPreset === preset.id && (
                        <Check size={14} className="text-primary-500" />
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              /* Custom Range Picker */
              <div className="custom-range space-y-4">
                {/* Start Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={tempCustomDate.start}
                    onChange={(e) => setTempCustomDate({ ...tempCustomDate, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={tempCustomDate.end}
                    onChange={(e) => setTempCustomDate({ ...tempCustomDate, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                {/* Quick Selects */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs text-gray-500">Quick:</span>
                  {['Last 7', 'Last 30', 'This Month'].map((quick) => (
                    <button
                      key={quick}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                      onClick={() => {
                        const today = new Date()
                        let start = new Date()
                        
                        if (quick === 'Last 7') {
                          start.setDate(today.getDate() - 7)
                        } else if (quick === 'Last 30') {
                          start.setDate(today.getDate() - 30)
                        } else if (quick === 'This Month') {
                          start = new Date(today.getFullYear(), today.getMonth(), 1)
                        }
                        
                        setTempCustomDate({
                          start: start.toISOString().split('T')[0],
                          end: today.toISOString().split('T')[0]
                        })
                      }}
                    >
                      {quick}
                    </button>
                  ))}
                </div>

                {/* Apply Button */}
                <button
                  className="w-full mt-4 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCustomApply}
                  disabled={!tempCustomDate.start || !tempCustomDate.end}
                >
                  Apply Range
                </button>
              </div>
            )}
          </div>

          {/* Comparison Section (if enabled) */}
          {compareMode && (
            <div className="comparison-section p-4 border-t border-gray-200 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Compare with</h4>
              <div className="flex items-center gap-3">
                {compareOptions.map(opt => (
                  <button
                    key={opt.id}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
                      compareValue === opt.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => setCompareValue(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {compareValue === 'custom' && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input type="date" className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg" />
                  <input type="date" className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg" />
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500">
              {value === 'custom' && customDate.start && customDate.end ? (
                <span>{formatDate(customDate.start)} - {formatDate(customDate.end)}</span>
              ) : (
                <span>{presets.find(p => p.id === value)?.description || 'Select a range'}</span>
              )}
            </div>
            <button
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => {
                setTempCustomDate(customDate)
                setActiveTab('presets')
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Range Display (for mobile) */}
      <div className="mt-1 text-xs text-gray-500 sm:hidden">
        {getDisplayLabel()}
      </div>
    </div>
  )
}