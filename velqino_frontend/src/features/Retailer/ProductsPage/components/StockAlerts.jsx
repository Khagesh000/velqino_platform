"use client"

import React, { useState, useEffect } from 'react'
import { AlertCircle, Package, TrendingUp, Clock, RefreshCw, ShoppingCart, Eye, Bell } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerProducts/StockAlerts.scss'

export default function StockAlerts() {
  const [mounted, setMounted] = useState(false)
  const [hoveredAlert, setHoveredAlert] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const alerts = [
    { id: 1, type: 'low', name: 'Premium Cotton T-Shirt', sku: 'CT-001', currentStock: 8, reorderLevel: 20, supplier: 'Fashion Hub', status: 'warning', image: '👕' },
    { id: 2, type: 'critical', name: 'Smart Watch Pro', sku: 'SW-003', currentStock: 3, reorderLevel: 15, supplier: 'TechGadgets', status: 'critical', image: '⌚' },
    { id: 3, type: 'out', name: 'Wireless Headphones', sku: 'WH-002', currentStock: 0, reorderLevel: 25, supplier: 'ElectroMart', status: 'out', image: '🎧' },
    { id: 4, type: 'expiring', name: 'Leather Wallet', sku: 'LW-004', currentStock: 23, expiryDate: '2026-05-15', daysLeft: 30, status: 'expiring', image: '👛' },
    { id: 5, type: 'low', name: 'Running Shoes', sku: 'RS-005', currentStock: 12, reorderLevel: 12, supplier: 'SportFit', status: 'warning', image: '👟' },
  ]

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.type === filter)

  const getAlertStyle = (status) => {
    switch(status) {
      case 'critical': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500', badge: 'bg-red-500' }
      case 'warning': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-500', badge: 'bg-orange-500' }
      case 'out': return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700', icon: 'text-gray-500', badge: 'bg-gray-500' }
      case 'expiring': return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-500', badge: 'bg-yellow-500' }
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-400', badge: 'bg-gray-400' }
    }
  }

  const getAlertMessage = (alert) => {
    switch(alert.type) {
      case 'critical': return `Only ${alert.currentStock} units left! Below reorder level (${alert.reorderLevel})`
      case 'low': return `Low stock: ${alert.currentStock} units remaining. Reorder level is ${alert.reorderLevel}`
      case 'out': return `Out of stock! Need immediate restock`
      case 'expiring': return `Expires in ${alert.daysLeft} days (${alert.expiryDate})`
      default: return 'Stock alert'
    }
  }

  const alertCounts = {
    critical: alerts.filter(a => a.type === 'critical').length,
    low: alerts.filter(a => a.type === 'low').length,
    out: alerts.filter(a => a.type === 'out').length,
    expiring: alerts.filter(a => a.type === 'expiring').length,
  }

  return (
    <div className="stock-alerts bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Stock Alerts</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {alerts.length} alerts
            </span>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Alert Filters */}
      <div className="px-4 pt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${filter === 'critical' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
        >
          Critical ({alertCounts.critical})
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${filter === 'low' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
        >
          Low Stock ({alertCounts.low})
        </button>
        <button
          onClick={() => setFilter('out')}
          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${filter === 'out' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Out of Stock ({alertCounts.out})
        </button>
        <button
          onClick={() => setFilter('expiring')}
          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${filter === 'expiring' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'}`}
        >
          Expiring ({alertCounts.expiring})
        </button>
      </div>

      {/* Alerts List */}
      <div className="p-4 space-y-3 max-h-[280px] overflow-y-auto custom-scroll">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto text-green-300 mb-3" />
            <p className="text-sm text-gray-500">No stock alerts</p>
            <p className="text-xs text-gray-400 mt-1">All products are at healthy levels</p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => {
            const style = getAlertStyle(alert.status)
            return (
              <div
                key={alert.id}
                className={`alert-item p-3 rounded-xl border ${style.bg} ${style.border} transition-all ${
                  hoveredAlert === alert.id ? 'shadow-md transform -translate-y-0.5' : ''
                }`}
                onMouseEnter={() => setHoveredAlert(alert.id)}
                onMouseLeave={() => setHoveredAlert(null)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0`}>
                    {alert.type === 'expiring' ? (
                      <Clock size={20} className={style.icon} />
                    ) : (
                      <Package size={20} className={style.icon} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{alert.image}</span>
                        <h4 className="text-sm font-semibold text-gray-900">{alert.name}</h4>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge} text-white inline-block w-fit`}>
                        {alert.type === 'critical' ? 'CRITICAL' : alert.type === 'low' ? 'LOW STOCK' : alert.type === 'out' ? 'OUT OF STOCK' : 'EXPIRING'}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">{getAlertMessage(alert)}</p>
                    
                    <div className="flex items-center gap-3 text-[11px] text-gray-500">
                      <span>SKU: {alert.sku}</span>
                      {alert.supplier && <span>• Supplier: {alert.supplier}</span>}
                      {alert.expiryDate && <span>• Expires: {alert.expiryDate}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all" title="View Product">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all" title="Reorder">
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar for Low Stock */}
                {alert.type === 'low' && alert.currentStock && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                      <span>Stock Level</span>
                      <span>{alert.currentStock} / {alert.reorderLevel}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${(alert.currentStock / alert.reorderLevel) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Progress Bar for Expiry */}
                {alert.type === 'expiring' && alert.daysLeft && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                      <span>Days until expiry</span>
                      <span>{alert.daysLeft} days left</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                        style={{ width: `${(alert.daysLeft / 90) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <TrendingUp size={10} className="text-green-500" />
            <span>Restock suggestions available for {alertCounts.low + alertCounts.critical} products</span>
          </div>
          <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
      </div>
    </div>
  )
}