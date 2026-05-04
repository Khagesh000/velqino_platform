"use client"

import React, { useState, useEffect } from 'react'
import {
  CreditCard,
  FileText,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
  TrendingUp,
  Crown,
  Star,
  Zap,
  Settings,
  X,
  Plus,
  ChevronRight
} from '../../../../utils/icons'
import { useFetchProfileQuery, useUpdateProfileMutation } from '@/redux/wholesaler/slices/wholesalerSlice'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/Settings/BillingSubscription.scss'

export default function BillingSubscription({ wholesaler, isLoading: parentLoading }) {
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const [upgradeSuccess, setUpgradeSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const [currentPlan, setCurrentPlan] = useState({
    name: 'Professional',
    price: 4999,
    billingCycle: 'monthly',
    features: [],
    nextBillingDate: '',
    status: 'Active'
  })

  const [invoices, setInvoices] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 999,
      period: 'month',
      icon: Star,
      features: ['Up to 500 products', '100 orders/month', 'Basic analytics', 'Email support'],
      color: 'gray',
      recommended: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 4999,
      period: 'month',
      icon: Crown,
      features: ['Up to 5000 products', 'Unlimited orders', 'Advanced analytics', 'API access', 'Priority support', 'Bulk import/export'],
      color: 'primary',
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 19999,
      period: 'month',
      icon: Zap,
      features: ['Unlimited products', 'Unlimited orders', 'Custom analytics', 'Dedicated support', 'SLA guarantee', 'Custom integration'],
      color: 'purple',
      recommended: false
    }
  ]

  // Load billing data from backend
  useEffect(() => {
    if (wholesaler?.billing) {
      const billingData = wholesaler.billing
      setCurrentPlan({
        name: billingData.plan_name || 'Professional',
        price: billingData.plan_price || 4999,
        billingCycle: billingData.billing_cycle || 'monthly',
        features: billingData.features || currentPlan.features,
        nextBillingDate: billingData.next_billing_date || '',
        status: billingData.status || 'Active'
      })
      setInvoices(billingData.invoices || [])
      setPaymentMethods(billingData.payment_methods || [])
    }
  }, [wholesaler])

  const handleUpgrade = async (planId) => {
    const selectedPlanData = plans.find(p => p.id === planId)
    if (selectedPlanData.name === currentPlan.name) return
    
    setUpgrading(true)
    try {
      const formData = new FormData()
      formData.append('billing', JSON.stringify({
        plan_name: selectedPlanData.name,
        plan_price: selectedPlanData.price,
        plan_id: planId,
        status: 'Active'
      }))

      const userId = wholesaler?.user_id || wholesaler?.id
      await updateProfile({ userId: userId, data: formData }).unwrap()
      
      setCurrentPlan({
        ...currentPlan,
        name: selectedPlanData.name,
        price: selectedPlanData.price,
        status: 'Active'
      })
      
      setUpgradeSuccess(true)
      toast.success(`Upgraded to ${selectedPlanData.name} plan successfully!`)
      setTimeout(() => setUpgradeSuccess(false), 3000)
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to upgrade plan')
    } finally {
      setUpgrading(false)
    }
  }

  const handleDownloadInvoice = (invoiceId) => {
    toast.info(`Downloading invoice ${invoiceId}...`)
    // Implement actual download API call
  }

  const handleAddPaymentMethod = async () => {
    toast.info('Payment method addition coming soon...')
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const getPlanColor = (color) => {
    const colors = {
      primary: 'border-primary-500 bg-primary-50',
      purple: 'border-purple-500 bg-purple-50',
      gray: 'border-gray-300 bg-gray-50'
    }
    return colors[color] || colors.gray
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
    <div className="billing-subscription bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Billing & Subscription</h3>
            <p className="text-xs sm:text-sm text-gray-500">Manage your plan, invoices, and payment methods</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-8">
        {/* Current Plan Card */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown size={20} className="text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Current Plan</span>
                <span className="px-2 py-0.5 bg-success-100 text-success-700 text-xs rounded-full">{currentPlan.status}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{formatCurrency(currentPlan.price)}/{currentPlan.billingCycle}</p>
              {currentPlan.nextBillingDate && (
                <p className="text-xs text-gray-500 mt-2">Next billing date: {currentPlan.nextBillingDate}</p>
              )}
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all text-sm"
            >
              Manage Subscription
            </button>
          </div>
        </div>

        {/* Plans Comparison */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Available Plans</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(plan => {
              const Icon = plan.icon
              const isCurrent = plan.name === currentPlan.name
              const isRecommended = plan.recommended
              const planColor = getPlanColor(plan.color)

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border-2 p-4 transition-all ${
                    isCurrent ? 'border-primary-500 bg-primary-50/30' : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {isRecommended && !isCurrent && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-warning-500 text-white text-xs rounded-full">
                      Recommended
                    </span>
                  )}
                  <div className="text-center mb-4">
                    <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 ${
                      isCurrent ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(plan.price)}</p>
                    <p className="text-xs text-gray-500">per {plan.period}</p>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className="text-success-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent || upgrading}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                      isCurrent
                        ? 'bg-gray-100 text-gray-500 cursor-default'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : upgrading ? 'Upgrading...' : 'Upgrade'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Invoice History */}
        {invoices.length > 0 && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                Invoice History
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Invoice ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map(invoice => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{invoice.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{invoice.date}</td>
                      <td className="px-4 py-2 text-sm font-semibold text-gray-900">{formatCurrency(invoice.amount)}</td>
                      <td className="px-4 py-2">
                        <span className="inline-block px-2 py-0.5 bg-success-100 text-success-700 text-xs rounded-full">
                          {invoice.status}
                        </span>
                       </td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleDownloadInvoice(invoice.id)} className="p-1 text-gray-400 hover:text-primary-600">
                          <Download size={16} />
                        </button>
                       </td>
                     </tr>
                  ))}
                </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {paymentMethods.length > 0 && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard size={16} className="text-gray-500" />
                Payment Methods
              </h4>
              <button onClick={handleAddPaymentMethod} className="text-sm text-primary-600 hover:text-primary-700">
                Add Payment Method
              </button>
            </div>
            <div className="p-4 space-y-3">
              {paymentMethods.map(method => (
                <div key={method.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {method.type === 'card' ? `${method.brand} ending in ${method.last4}` : `UPI: ${method.id}`}
                      </p>
                      {method.type === 'card' && <p className="text-xs text-gray-500">Expires {method.expiry}</p>}
                    </div>
                    {method.isDefault && (
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full ml-2">Default</span>
                    )}
                  </div>
                  {!method.isDefault && (
                    <button className="text-xs text-primary-600 hover:text-primary-700">Set as Default</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade Success Message */}
        {upgradeSuccess && (
          <div className="p-3 bg-success-50 rounded-lg flex items-center gap-2">
            <CheckCircle size={16} className="text-success-600" />
            <p className="text-sm text-success-600">Plan upgraded successfully!</p>
          </div>
        )}
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Payment Method</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input type="text" placeholder="123" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input type="text" placeholder="Name on card" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <button className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                Save Payment Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}