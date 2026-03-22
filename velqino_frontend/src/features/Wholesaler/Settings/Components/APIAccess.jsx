"use client"

import React, { useState } from 'react'
import {
  Key,
  Webhook,
  Settings,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  Clock,
  Globe,
  Code,
  ExternalLink
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Settings/APIAccess.scss'

export default function APIAccess() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showWebhookModal, setShowWebhookModal] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '', events: [] })
  const [generatingKey, setGeneratingKey] = useState(false)
  const [generatedKey, setGeneratedKey] = useState(null)

  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Production API Key',
      key: 'vk_live_abc123def456ghi789jkl012mno345',
      created: '2024-01-15',
      lastUsed: 'Today 10:30 AM',
      status: 'Active',
      permissions: ['read', 'write']
    },
    {
      id: 2,
      name: 'Test API Key',
      key: 'vk_test_xyz789abc456def123ghi789jkl',
      created: '2024-02-20',
      lastUsed: 'Yesterday 03:45 PM',
      status: 'Active',
      permissions: ['read']
    }
  ])

  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      name: 'Order Updates',
      url: 'https://api.yourdomain.com/webhooks/orders',
      events: ['order.created', 'order.updated', 'order.cancelled'],
      status: 'Active',
      lastTriggered: '2024-03-21 09:15 AM',
      created: '2024-01-10'
    },
    {
      id: 2,
      name: 'Inventory Alerts',
      url: 'https://api.yourdomain.com/webhooks/inventory',
      events: ['stock.low', 'stock.out'],
      status: 'Active',
      lastTriggered: '2024-03-20 04:30 PM',
      created: '2024-02-05'
    }
  ])

  const availableEvents = [
    { id: 'order.created', label: 'Order Created' },
    { id: 'order.updated', label: 'Order Updated' },
    { id: 'order.cancelled', label: 'Order Cancelled' },
    { id: 'payment.received', label: 'Payment Received' },
    { id: 'payment.disbursed', label: 'Payment Disbursed' },
    { id: 'product.created', label: 'Product Created' },
    { id: 'product.updated', label: 'Product Updated' },
    { id: 'stock.low', label: 'Low Stock Alert' },
    { id: 'stock.out', label: 'Out of Stock' },
    { id: 'customer.created', label: 'New Customer' }
  ]

  const handleGenerateKey = () => {
    setGeneratingKey(true)
    setTimeout(() => {
      const newKey = {
        id: apiKeys.length + 1,
        name: newKeyName,
        key: `vk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        created: new Date().toISOString().split('T')[0],
        lastUsed: 'Never',
        status: 'Active',
        permissions: ['read', 'write']
      }
      setGeneratedKey(newKey)
      setGeneratingKey(false)
      setApiKeys([...apiKeys, newKey])
      setShowCreateModal(false)
      setNewKeyName('')
      setTimeout(() => setGeneratedKey(null), 5000)
    }, 1500)
  }

  const handleDeleteKey = (id) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(key => key.id !== id))
    }
  }

  const handleRegenerateKey = (id) => {
    if (confirm('Regenerating this key will invalidate the old one. Continue?')) {
      setApiKeys(apiKeys.map(key => 
        key.id === id 
          ? { ...key, key: `vk_live_${Math.random().toString(36).substring(2, 20)}` }
          : key
      ))
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddWebhook = () => {
    const newWebhookData = {
      id: webhooks.length + 1,
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      status: 'Active',
      lastTriggered: 'Never',
      created: new Date().toISOString().split('T')[0]
    }
    setWebhooks([...webhooks, newWebhookData])
    setShowWebhookModal(false)
    setNewWebhook({ name: '', url: '', events: [] })
  }

  const handleDeleteWebhook = (id) => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      setWebhooks(webhooks.filter(webhook => webhook.id !== id))
    }
  }

  const toggleWebhookEvent = (eventId) => {
    if (newWebhook.events.includes(eventId)) {
      setNewWebhook({ ...newWebhook, events: newWebhook.events.filter(e => e !== eventId) })
    } else {
      setNewWebhook({ ...newWebhook, events: [...newWebhook.events, eventId] })
    }
  }

  const maskApiKey = (key) => {
    if (!key) return ''
    return key.substring(0, 15) + '...' + key.substring(key.length - 8)
  }

  return (
    <div className="api-access bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Key size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">API Access</h3>
            <p className="text-xs sm:text-sm text-gray-500">Manage API keys and webhook integrations</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-8">
        {/* API Keys Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Key size={16} className="text-gray-500" />
              API Keys
            </h4>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all"
            >
              <Plus size={14} />
              Create API Key
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map(key => (
              <div key={key.id} className="border border-gray-200 rounded-xl p-4 hover:border-primary-200 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Key size={14} className="text-primary-500" />
                      <span className="text-sm font-semibold text-gray-900">{key.name}</span>
                      <span className="px-2 py-0.5 bg-success-100 text-success-700 text-xs rounded-full">{key.status}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                        {showKey ? key.key : maskApiKey(key.key)}
                      </code>
                      <button onClick={() => handleCopy(key.key)} className="p-1 text-gray-400 hover:text-primary-600">
                        <Copy size={14} />
                      </button>
                      <button onClick={() => setShowKey(!showKey)} className="p-1 text-gray-400 hover:text-primary-600">
                        {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Created: {key.created}</span>
                      <span>Last used: {key.lastUsed}</span>
                      <span>Permissions: {key.permissions.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleRegenerateKey(key.id)} className="p-1.5 text-gray-400 hover:text-warning-600 rounded-lg">
                      <RefreshCw size={14} />
                    </button>
                    <button onClick={() => handleDeleteKey(key.id)} className="p-1.5 text-gray-400 hover:text-error-600 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Webhooks Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Webhook size={16} className="text-gray-500" />
              Webhooks
            </h4>
            <button
              onClick={() => setShowWebhookModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all"
            >
              <Plus size={14} />
              Add Webhook
            </button>
          </div>

          <div className="space-y-3">
            {webhooks.map(webhook => (
              <div key={webhook.id} className="border border-gray-200 rounded-xl p-4 hover:border-primary-200 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Webhook size={14} className="text-primary-500" />
                      <span className="text-sm font-semibold text-gray-900">{webhook.name}</span>
                      <span className="px-2 py-0.5 bg-success-100 text-success-700 text-xs rounded-full">{webhook.status}</span>
                    </div>
                    <div className="mb-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{webhook.url}</code>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {webhook.events.map(event => (
                        <span key={event} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{event}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Created: {webhook.created}</span>
                      <span>Last triggered: {webhook.lastTriggered}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg">
                      <RefreshCw size={14} />
                    </button>
                    <button onClick={() => handleDeleteWebhook(webhook.id)} className="p-1.5 text-gray-400 hover:text-error-600 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Settings */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Settings size={16} className="text-gray-500" />
              Integration Settings
            </h4>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">API Rate Limit</p>
                <p className="text-xs text-gray-500">Maximum requests per minute</p>
              </div>
              <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                <option>100 requests/min</option>
                <option>500 requests/min</option>
                <option>1000 requests/min</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">API Version</p>
                <p className="text-xs text-gray-500">Current API version</p>
              </div>
              <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                <option>v1 (Latest)</option>
                <option>v1 (Stable)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">IP Whitelist</p>
                <p className="text-xs text-gray-500">Restrict API access to specific IPs</p>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700">Configure</button>
            </div>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code size={20} className="text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">API Documentation</p>
              <p className="text-xs text-gray-500">Complete API reference and integration guides</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm">
            View Docs
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create API Key</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production Key"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                    <span className="text-sm text-gray-700">Read Access</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                    <span className="text-sm text-gray-700">Write Access</span>
                  </label>
                </div>
              </div>
              <button
                onClick={handleGenerateKey}
                disabled={!newKeyName || generatingKey}
                className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generatingKey ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate API Key'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Webhook Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowWebhookModal(false)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Webhook</h3>
              <button onClick={() => setShowWebhookModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Name</label>
                <input
                  type="text"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  placeholder="e.g., Order Updates"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
                <input
                  type="url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  placeholder="https://yourdomain.com/webhook"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Events to Send</label>
                <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {availableEvents.map(event => (
                    <label key={event.id} className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        checked={newWebhook.events.includes(event.id)}
                        onChange={() => toggleWebhookEvent(event.id)}
                        className="rounded border-gray-300 text-primary-600"
                      />
                      <span className="text-sm text-gray-700">{event.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAddWebhook}
                disabled={!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0}
                className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                Add Webhook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Notification */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg animate-slide-up">
          Copied to clipboard!
        </div>
      )}
    </div>
  )
}