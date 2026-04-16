"use client"

import React, { useState, useEffect } from 'react'
import { Search, BookOpen, Video, FileText, MessageCircle, HelpCircle, ChevronRight, Star, Clock, Eye } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSupport/HelpCenter.scss'

export default function HelpCenter() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const faqs = [
    { id: 1, question: 'How to add products to inventory?', answer: 'Go to Products > Add Product, fill in the details and save.', category: 'products', views: 245, helpful: 189 },
    { id: 2, question: 'How to process a sale on POS?', answer: 'Select products, add to cart, choose payment method and complete checkout.', category: 'pos', views: 312, helpful: 278 },
    { id: 3, question: 'How to generate GST invoice?', answer: 'After completing sale, click on Print Invoice button.', category: 'billing', views: 178, helpful: 145 },
    { id: 4, question: 'How to manage low stock alerts?', answer: 'Settings > Notifications > Enable low stock alerts.', category: 'inventory', views: 156, helpful: 128 },
    { id: 5, question: 'How to add new staff members?', answer: 'Go to Staff Management > Add Staff, enter details and set permissions.', category: 'staff', views: 134, helpful: 112 },
    { id: 6, question: 'How to configure receipt printer?', answer: 'Settings > POS Settings > Configure printer port.', category: 'hardware', views: 98, helpful: 76 },
  ]

  const tutorials = [
    { id: 1, title: 'Getting Started with POS', duration: '5 min', type: 'video', icon: '🎥', popular: true },
    { id: 2, title: 'Inventory Management Guide', duration: '8 min', type: 'video', icon: '🎥', popular: true },
    { id: 3, title: 'Customer Loyalty Program', duration: '4 min', type: 'article', icon: '📄', popular: false },
    { id: 4, title: 'GST Filing Tutorial', duration: '10 min', type: 'video', icon: '🎥', popular: true },
  ]

  const categories = ['all', 'products', 'pos', 'billing', 'inventory', 'staff', 'hardware']
  const categoryLabels = { all: 'All', products: 'Products', pos: 'POS', billing: 'Billing', inventory: 'Inventory', staff: 'Staff', hardware: 'Hardware' }

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === selectedCategory)

  const filteredTutorials = tutorials.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="help-center bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <HelpCircle size={22} className="text-primary-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Help Center</h3>
            <p className="text-sm text-gray-500">Find answers to your questions</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-5 border-b border-gray-100">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help articles, tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="px-5 pt-4 pb-2 border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Tutorials */}
      <div className="p-5 border-b border-gray-100">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Star size={16} className="text-yellow-500" />
          Popular Tutorials
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tutorials.filter(t => t.popular).map((tutorial) => (
            <div key={tutorial.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-primary-50 transition-all">
              <div className="text-2xl">{tutorial.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{tutorial.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock size={10} className="text-gray-400" />
                  <span className="text-xs text-gray-500">{tutorial.duration}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="p-5">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FileText size={16} className="text-primary-500" />
          Frequently Asked Questions
        </h4>
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-primary-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{faq.question}</p>
                  <p className="text-xs text-gray-500 mt-1">{faq.answer}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye size={10} />
                      {faq.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={10} />
                      {faq.helpful} helpful
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}