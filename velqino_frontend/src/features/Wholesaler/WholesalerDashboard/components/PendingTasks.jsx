"use client"

import React, { useState } from 'react'
import { ClipboardList, Package, Clock, Wallet, AlertCircle, CheckCircle, ArrowRight, Timer } from '../../../../utils/icons'
import '../../../../styles/Wholesaler/WholesalerDashboard/PendingTasks.scss'

export default function PendingTasks() {
  const [hoveredTask, setHoveredTask] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  const tasks = {
    orders: [
      { id: 1, type: 'order', task: 'Process order #12345', time: '10 min ago', priority: 'high', amount: '₹4,500', customer: 'John Doe' },
      { id: 2, type: 'order', task: 'Ship order #12342', time: '1 hour ago', priority: 'medium', amount: '₹1,200', customer: 'Alice Brown' },
      { id: 3, type: 'order', task: 'Verify payment #12340', time: '3 hours ago', priority: 'low', amount: '₹3,200', customer: 'Emma Davis' }
    ],
    products: [
      { id: 4, type: 'product', task: 'Approve new listing', time: '30 min ago', priority: 'high', product: 'Wireless Headphones', sku: 'WH-001' },
      { id: 5, type: 'product', task: 'Update inventory', time: '2 hours ago', priority: 'medium', product: 'Cotton T-Shirt', sku: 'CT-045' },
      { id: 6, type: 'product', task: 'Review price change', time: '5 hours ago', priority: 'low', product: 'Ceramic Mug', sku: 'CM-112' }
    ],
    payouts: [
      { id: 7, type: 'payout', task: 'Process withdrawal', time: '1 day ago', priority: 'high', amount: '₹15,000', vendor: 'ABC Retail' },
      { id: 8, type: 'payout', task: 'Verify bank details', time: '2 days ago', priority: 'medium', amount: '₹8,500', vendor: 'XYZ Enterprises' }
    ]
  }

  const allTasks = [...tasks.orders, ...tasks.products, ...tasks.payouts]

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <AlertCircle size={14} />
      case 'medium': return <Timer size={14} />
      case 'low': return <Clock size={14} />
      default: return <Clock size={14} />
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'priority-high'
      case 'medium': return 'priority-medium'
      case 'low': return 'priority-low'
      default: return ''
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'order': return <Package size={16} />
      case 'product': return <ClipboardList size={16} />
      case 'payout': return <Wallet size={16} />
      default: return <Clock size={16} />
    }
  }

  const getTypeColor = (type) => {
    switch(type) {
      case 'order': return 'bg-primary-100 text-primary-600'
      case 'product': return 'bg-accent-100 text-accent-600'
      case 'payout': return 'bg-success-100 text-success-600'
      default: return 'bg-surface-2 text-secondary'
    }
  }

  const getTimeColor = (time) => {
    if (time.includes('min')) return 'text-error-600'
    if (time.includes('hour')) return 'text-warning-600'
    return 'text-tertiary'
  }

  const tabs = [
    { id: 'all', label: 'All', count: allTasks.length },
    { id: 'orders', label: 'Orders', count: tasks.orders.length, icon: <Package size={14} /> },
    { id: 'products', label: 'Products', count: tasks.products.length, icon: <ClipboardList size={14} /> },
    { id: 'payouts', label: 'Payouts', count: tasks.payouts.length, icon: <Wallet size={14} /> }
  ]

  const displayedTasks = activeTab === 'all' ? allTasks : tasks[activeTab]

  return (
    <div className="bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-warning-100 flex items-center justify-center text-warning-600">
            <ClipboardList size={18} className="lg:w-5 lg:h-5" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-primary">Pending Tasks</h3>
            <p className="text-xs lg:text-sm text-tertiary">{allTasks.length} items need attention</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-surface-1 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-tertiary hover:text-secondary'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-surface-2 text-tertiary'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary-200 via-accent-200 to-success-200 rounded-full" />

        {/* Tasks */}
        {/* Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 relative">
          {displayedTasks.map((task, index) => (
            <div
              key={task.id}
              className={`group relative flex items-start gap-3 pl-8 ${
                hoveredTask === task.id ? 'translate-x-1' : ''
              }`}
              onMouseEnter={() => setHoveredTask(task.id)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              {/* Timeline Dot */}
              <div className={`absolute left-0 top-3 w-6 h-6 rounded-full border-4 border-white ${
                task.priority === 'high' ? 'bg-error-500' :
                task.priority === 'medium' ? 'bg-warning-500' : 'bg-accent-500'
              } shadow-md z-10 transition-all group-hover:scale-125`} />

              {/* Task Card */}
              <div className="flex-1 bg-surface-1 rounded-xl p-3 lg:p-4 border border-light transition-all hover:shadow-md">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3">
                    {/* Type Icon */}
                    <div className={`w-8 h-8 rounded-lg ${getTypeColor(task.type)} flex items-center justify-center flex-shrink-0`}>
                      {getTypeIcon(task.type)}
                    </div>
                    
                    {/* Task Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-primary">{task.task}</h4>
                      <p className="text-xs text-secondary mt-0.5">
                        {task.customer && task.customer}
                        {task.product && `${task.product} • SKU: ${task.sku}`}
                        {task.vendor && task.vendor}
                      </p>
                    </div>
                  </div>

                  {/* Amount if exists */}
                  {task.amount && (
                    <span className="text-sm font-semibold text-primary bg-white px-2 py-1 rounded-lg border border-light">
                      {task.amount}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3">
                    {/* Priority Badge */}
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      task.priority === 'high' ? 'bg-error-100 text-error-600' :
                      task.priority === 'medium' ? 'bg-warning-100 text-warning-600' :
                      'bg-accent-100 text-accent-600'
                    }`}>
                      {getPriorityIcon(task.priority)}
                      <span className="capitalize">{task.priority}</span>
                    </span>

                    {/* Time */}
                    <span className={`flex items-center gap-1 text-xs ${getTimeColor(task.time)}`}>
                      <Clock size={12} />
                      {task.time}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-all hover:gap-2">
                    <span>Handle</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* Progress Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Hover Glow */}
              {hoveredTask === task.id && (
                <div className={`absolute inset-0 rounded-xl opacity-5 blur-lg pointer-events-none ${
                  task.priority === 'high' ? 'bg-error-500' :
                  task.priority === 'medium' ? 'bg-warning-500' : 'bg-accent-500'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-3 gap-2 mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-light">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-error-600 mb-1">
            <AlertCircle size={14} />
            <span className="text-sm font-semibold">3</span>
          </div>
          <p className="text-xs text-tertiary">High priority</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-warning-600 mb-1">
            <Timer size={14} />
            <span className="text-sm font-semibold">4</span>
          </div>
          <p className="text-xs text-tertiary">Medium</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-accent-600 mb-1">
            <Clock size={14} />
            <span className="text-sm font-semibold">4</span>
          </div>
          <p className="text-xs text-tertiary">Low priority</p>
        </div>
      </div>
    </div>
  )
}