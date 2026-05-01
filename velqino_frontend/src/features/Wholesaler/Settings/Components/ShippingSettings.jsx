"use client"

import React, { useState, useEffect } from 'react'
import {
  Truck,
  Package,
  Box,
  ArrowLeftRight,
  Percent,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  MapPin,
  Clock,
  FileText,
  Download
} from '../../../../utils/icons'
import { useFetchProfileQuery, useUpdateProfileMutation } from '@/redux/wholesaler/slices/wholesalerSlice'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/Settings/ShippingSettings.scss'

export default function ShippingSettings({ wholesaler, isLoading: parentLoading }) {
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showAddRateModal, setShowAddRateModal] = useState(false)
  const [showReturnPolicyModal, setShowReturnPolicyModal] = useState(false)

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  // Initialize shipping settings from backend
  const [shippingSettings, setShippingSettings] = useState({
    defaultCarrier: 'delhivery',
    carriers: [
      { id: 'delhivery', name: 'Delhivery', logo: '🚚', trackingUrl: 'https://www.delhivery.com/track/{tracking}' },
      { id: 'bluedart', name: 'Blue Dart', logo: '📦', trackingUrl: 'https://www.bluedart.com/track/{tracking}' },
      { id: 'dtdc', name: 'DTDC', logo: '📮', trackingUrl: 'https://www.dtdc.in/track/{tracking}' },
      { id: 'xpressbees', name: 'XpressBees', logo: '🐝', trackingUrl: 'https://www.xpressbees.com/track/{tracking}' }
    ],
    packagingOptions: [
      { id: 'box', name: 'Standard Box', dimensions: '30x20x15 cm', weight: '0.5 kg', cost: 50 },
      { id: 'polybag', name: 'Polybag', dimensions: '25x20 cm', weight: '0.1 kg', cost: 20 },
      { id: 'tube', name: 'Tube', dimensions: '40x10 cm', weight: '0.3 kg', cost: 35 }
    ],
    shippingRates: [],
    returnPolicy: {
      enabled: true,
      days: 7,
      conditions: 'Unused, original packaging, with invoice',
      refundMethod: 'Original Payment Method',
      customerResponsible: false,
      restockingFee: 10,
      policyText: 'Items can be returned within 7 days of delivery. Products must be unused and in original packaging. Return shipping charges may apply.'
    }
  })

  const [editedSettings, setEditedSettings] = useState(shippingSettings)
  const [newRate, setNewRate] = useState({ name: '', minWeight: '', maxWeight: '', cost: '', estimatedDays: '', zone: 'Domestic' })

  // Load shipping settings from backend when wholesaler data is available
  useEffect(() => {
    if (wholesaler?.shipping_settings) {
      const backendSettings = wholesaler.shipping_settings
      setShippingSettings({
        defaultCarrier: backendSettings.defaultCarrier || 'delhivery',
        carriers: backendSettings.carriers || shippingSettings.carriers,
        packagingOptions: backendSettings.packagingOptions || shippingSettings.packagingOptions,
        shippingRates: backendSettings.shippingRates || [],
        returnPolicy: backendSettings.returnPolicy || shippingSettings.returnPolicy
      })
      setEditedSettings({
        defaultCarrier: backendSettings.defaultCarrier || 'delhivery',
        carriers: backendSettings.carriers || shippingSettings.carriers,
        packagingOptions: backendSettings.packagingOptions || shippingSettings.packagingOptions,
        shippingRates: backendSettings.shippingRates || [],
        returnPolicy: backendSettings.returnPolicy || shippingSettings.returnPolicy
      })
    }
  }, [wholesaler])

  const handleSave = async () => {
    try {
      const formData = new FormData()
      formData.append('shipping_settings', JSON.stringify({
        defaultCarrier: editedSettings.defaultCarrier,
        carriers: editedSettings.carriers,
        packagingOptions: editedSettings.packagingOptions,
        shippingRates: editedSettings.shippingRates,
        returnPolicy: editedSettings.returnPolicy
      }))

      const userId = wholesaler?.user_id || wholesaler?.id
      await updateProfile({ userId: userId, data: formData }).unwrap()
      
      setShippingSettings(editedSettings)
      setSaveSuccess(true)
      toast.success('Shipping settings updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update shipping settings')
    }
  }

  const handleCancel = () => {
    setEditedSettings(shippingSettings)
    setIsEditing(false)
  }

  const handleAddRate = () => {
    const newId = Math.max(...shippingSettings.shippingRates.map(r => r.id), 0) + 1
    const rate = {
      id: newId,
      ...newRate,
      minWeight: parseFloat(newRate.minWeight),
      maxWeight: parseFloat(newRate.maxWeight),
      cost: parseFloat(newRate.cost)
    }
    setEditedSettings({
      ...editedSettings,
      shippingRates: [...editedSettings.shippingRates, rate]
    })
    setShowAddRateModal(false)
    setNewRate({ name: '', minWeight: '', maxWeight: '', cost: '', estimatedDays: '', zone: 'Domestic' })
  }

  const handleDeleteRate = (id) => {
    setEditedSettings({
      ...editedSettings,
      shippingRates: editedSettings.shippingRates.filter(rate => rate.id !== id)
    })
  }

  if (parentLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="shipping-settings bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Truck size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Shipping Settings</h3>
            <p className="text-xs sm:text-sm text-gray-500">Manage carriers, packaging, rates, and return policy</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all"
          >
            <Edit size={14} />
            Edit Settings
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={handleCancel} className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSave} className="px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 flex items-center gap-1">
              <Save size={14} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Default Carrier */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Truck size={16} className="text-gray-500" />
              Default Carrier
            </h4>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {shippingSettings.carriers.map(carrier => (
                <label
                  key={carrier.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    editedSettings.defaultCarrier === carrier.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="defaultCarrier"
                    value={carrier.id}
                    checked={editedSettings.defaultCarrier === carrier.id}
                    onChange={(e) => setEditedSettings({ ...editedSettings, defaultCarrier: e.target.value })}
                    disabled={!isEditing}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xl">{carrier.logo}</span>
                  <span className="text-sm font-medium text-gray-700">{carrier.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Packaging Options */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Package size={16} className="text-gray-500" />
              Packaging Options
            </h4>
          </div>
          <div className="p-4 space-y-3">
            {editedSettings.packagingOptions.map(pkg => (
              <div key={pkg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Box size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{pkg.name}</p>
                    <p className="text-xs text-gray-500">{pkg.dimensions} • {pkg.weight}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">₹{pkg.cost}</span>
                  {isEditing && (
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-gray-400 hover:text-primary-600">
                        <Edit size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-error-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isEditing && (
              <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-all flex items-center justify-center gap-2">
                <Plus size={14} />
                Add Packaging Option
              </button>
            )}
          </div>
        </div>

        {/* Shipping Rates */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <ArrowLeftRight size={16} className="text-gray-500" />
              Shipping Rates
            </h4>
            {isEditing && (
              <button
                onClick={() => setShowAddRateModal(true)}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus size={14} />
                Add Rate
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Weight Range</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cost</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Delivery Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Zone</th>
                  {isEditing && <th className="w-16 px-4 py-2"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {editedSettings.shippingRates.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No shipping rates added yet. Click "Add Rate" to create one.
                    </td>
                  </tr>
                ) : (
                  editedSettings.shippingRates.map(rate => (
                    <tr key={rate.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{rate.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{rate.minWeight} - {rate.maxWeight} kg</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">₹{rate.cost}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{rate.estimatedDays} days</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{rate.zone}</td>
                      {isEditing && (
                        <td className="px-4 py-2">
                          <button onClick={() => handleDeleteRate(rate.id)} className="p-1 text-gray-400 hover:text-error-600">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Return Policy */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              Return Policy
            </h4>
            <button
              onClick={() => setShowReturnPolicyModal(true)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Edit Policy
            </button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">Return Window: <span className="font-medium">{shippingSettings.returnPolicy.days} days</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Percent size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">Restocking Fee: <span className="font-medium">{shippingSettings.returnPolicy.restockingFee}%</span></span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">Refund Method: <span className="font-medium">{shippingSettings.returnPolicy.refundMethod}</span></span>
              </div>
            </div>
            <p className="text-sm text-gray-600">{shippingSettings.returnPolicy.policyText}</p>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="p-3 bg-success-50 rounded-lg flex items-center gap-2">
            <CheckCircle size={16} className="text-success-600" />
            <p className="text-sm text-success-600">Shipping settings updated successfully!</p>
          </div>
        )}
      </div>

      {/* Add Rate Modal */}
      {showAddRateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddRateModal(false)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Shipping Rate</h3>
              <button onClick={() => setShowAddRateModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate Name</label>
                <input
                  type="text"
                  value={newRate.name}
                  onChange={(e) => setNewRate({ ...newRate, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Weight (kg)</label>
                  <input
                    type="number"
                    value={newRate.minWeight}
                    onChange={(e) => setNewRate({ ...newRate, minWeight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Weight (kg)</label>
                  <input
                    type="number"
                    value={newRate.maxWeight}
                    onChange={(e) => setNewRate({ ...newRate, maxWeight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    value={newRate.cost}
                    onChange={(e) => setNewRate({ ...newRate, cost: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Days</label>
                  <input
                    type="text"
                    value={newRate.estimatedDays}
                    onChange={(e) => setNewRate({ ...newRate, estimatedDays: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
                <select
                  value={newRate.zone}
                  onChange={(e) => setNewRate({ ...newRate, zone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                >
                  <option>Domestic</option>
                  <option>International</option>
                </select>
              </div>
              <button
                onClick={handleAddRate}
                disabled={!newRate.name || !newRate.minWeight || !newRate.maxWeight || !newRate.cost}
                className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                Add Rate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Policy Modal */}
      {showReturnPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowReturnPolicyModal(false)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Return Policy</h3>
              <button onClick={() => setShowReturnPolicyModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Days</label>
                  <input
                    type="number"
                    value={editedSettings.returnPolicy.days}
                    onChange={(e) => setEditedSettings({ ...editedSettings, returnPolicy: { ...editedSettings.returnPolicy, days: parseInt(e.target.value) } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Restocking Fee (%)</label>
                  <input
                    type="number"
                    value={editedSettings.returnPolicy.restockingFee}
                    onChange={(e) => setEditedSettings({ ...editedSettings, returnPolicy: { ...editedSettings.returnPolicy, restockingFee: parseInt(e.target.value) } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refund Method</label>
                <select
                  value={editedSettings.returnPolicy.refundMethod}
                  onChange={(e) => setEditedSettings({ ...editedSettings, returnPolicy: { ...editedSettings.returnPolicy, refundMethod: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                >
                  <option>Original Payment Method</option>
                  <option>Store Credit</option>
                  <option>Wallet Balance</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={editedSettings.returnPolicy.customerResponsible}
                    onChange={(e) => setEditedSettings({ ...editedSettings, returnPolicy: { ...editedSettings.returnPolicy, customerResponsible: e.target.checked } })}
                    className="rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-sm text-gray-700">Customer pays return shipping</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Text</label>
                <textarea
                  rows="4"
                  value={editedSettings.returnPolicy.policyText}
                  onChange={(e) => setEditedSettings({ ...editedSettings, returnPolicy: { ...editedSettings.returnPolicy, policyText: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <button
                onClick={() => setShowReturnPolicyModal(false)}
                className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Save Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}