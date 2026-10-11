"use client"

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  MessageCircle, 
  HelpCircle, 
  ChevronRight, 
  Star, 
  Clock, 
  Eye, 
  Sparkles,
  ChevronDown,
  CheckCircle,
  ThumbsUp
} from '../../../../utils/icons'

export default function HelpCenter() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFaq, setExpandedFaq] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const faqs = [
    { 
      id: 1, 
      question: 'How to add products to inventory?', 
      answer: 'Navigate to Products > Add Product, enter the product SKU, barcode, unit pricing, tax rates, and click Save. Stock quantities will reflect immediately in POS.', 
      category: 'products', 
      views: 245, 
      helpful: 189 
    },
    { 
      id: 2, 
      question: 'How to process a sale on POS checkout?', 
      answer: 'Scan or select items on the POS terminal, review the bill amount, choose payment mode (Cash, UPI, Card), and click Complete Order to trigger instant print receipt.', 
      category: 'pos', 
      views: 312, 
      helpful: 278 
    },
    { 
      id: 3, 
      question: 'How to generate and print GST invoice?', 
      answer: 'Ensure buyer GSTIN is inputted if B2B. Upon order settlement, choose Print Tax Invoice. The invoice includes complete CGST, SGST, and HSN breakdown.', 
      category: 'billing', 
      views: 178, 
      helpful: 145 
    },
    { 
      id: 4, 
      question: 'How to manage low stock alerts and minimum thresholds?', 
      answer: 'Head over to Settings > Notifications or Inventory Items. Set low stock quantity threshold for automatic email and sound alerts when stock drops below safety levels.', 
      category: 'inventory', 
      views: 156, 
      helpful: 128 
    },
    { 
      id: 5, 
      question: 'How to add new staff members and configure PIN access?', 
      answer: 'Go to Settings > Staff Access or Staff Management, select Add Staff Member, assign their role (Cashier, Manager, Clerk), and set their unique 4-digit POS unlock PIN.', 
      category: 'staff', 
      views: 134, 
      helpful: 112 
    },
    { 
      id: 6, 
      question: 'How to configure thermal receipt printer port?', 
      answer: 'Visit Settings > POS Settings. Select your connected USB/COM printer driver, choose 58mm or 80mm roll width, and hit Test Print to calibrate ESC/POS output.', 
      category: 'hardware', 
      views: 98, 
      helpful: 76 
    },
  ]

  const tutorials = [
    { id: 1, title: 'Getting Started with POS Counter', duration: '5 min', type: 'video', popular: true },
    { id: 2, title: 'Inventory Inwarding & Barcode Setup', duration: '8 min', type: 'video', popular: true },
    { id: 3, title: 'Customer Loyalty & VIP Tier Programs', duration: '4 min', type: 'article', popular: false },
    { id: 4, title: 'GST Filing & Monthly Summary Reports', duration: '10 min', type: 'video', popular: true },
  ]

  const categories = ['all', 'products', 'pos', 'billing', 'inventory', 'staff', 'hardware']
  const categoryLabels = { 
    all: 'All Topics', 
    products: 'Products', 
    pos: 'POS Billing', 
    billing: 'GST & Invoicing', 
    inventory: 'Inventory', 
    staff: 'Staff Access', 
    hardware: 'Hardware & Printers' 
  }

  const filteredFaqs = faqs.filter(f => {
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const filteredTutorials = tutorials.filter(t => 
    searchQuery === '' || t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-2xs shrink-0">
              <HelpCircle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Help Center &amp; Self-Service</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                  Instant Answers
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Explore frequently asked questions, configuration walk-throughs, and video tutorials</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <span>{filteredFaqs.length} Answers Found</span>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions, POS errors, thermal printing, GST filing..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200/80 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Filter by Topic</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Popular Tutorials Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-primary-600" />
            <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">Recommended Interactive Walkthroughs</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTutorials.map((tutorial) => (
              <div 
                key={tutorial.id} 
                className="flex items-center gap-3 p-3.5 bg-gray-50/60 rounded-2xl border border-gray-200/70 hover:border-primary-300 hover:bg-primary-50/30 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-primary-600 border border-gray-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {tutorial.type === 'video' ? <Video size={18} /> : <FileText size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-primary-700 transition-colors">
                    {tutorial.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock size={11} className="text-gray-400" />
                    <span className="text-[11px] text-gray-500">{tutorial.duration} guide</span>
                    {tutorial.popular && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-primary-600" />
            <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">Frequently Asked Questions</h4>
          </div>
          
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-gray-50/60 rounded-2xl border border-gray-200/70">
              <p className="text-xs font-bold text-gray-500">No matching help articles found.</p>
              <p className="text-[11px] text-gray-400 mt-1">Try another keyword or raise a ticket with our support engineering team.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id
                return (
                  <div 
                    key={faq.id} 
                    onClick={() => toggleFaq(faq.id)}
                    className="border border-gray-200/80 rounded-2xl p-4 cursor-pointer hover:border-primary-300 transition-all bg-white hover:shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                            {categoryLabels[faq.category] || faq.category}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Eye size={10} />
                            {faq.views} views
                          </span>
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-gray-900 mt-1.5 tracking-tight">
                          {faq.question}
                        </h5>
                        <p className={`text-xs text-gray-600 mt-2 leading-relaxed transition-all ${isExpanded ? 'block' : 'line-clamp-2 text-gray-500'}`}>
                          {faq.answer}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <ThumbsUp size={11} />
                            {faq.helpful} found helpful
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-primary-600 font-bold hover:underline">
                            {isExpanded ? 'Show less' : 'Read complete answer'}
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-400 pt-1 shrink-0">
                        <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-primary-600' : ''}`} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
