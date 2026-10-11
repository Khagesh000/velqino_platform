"use client"

import React, { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Video, 
  FileText, 
  Search, 
  Star, 
  Clock, 
  Eye, 
  ChevronRight, 
  Download, 
  Play, 
  ThumbsUp, 
  Sparkles,
  FileCheck,
  CheckCircle,
  X
} from '../../../../utils/icons'

export default function KnowledgeBase() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [activeTab, setActiveTab] = useState('articles')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const categories = [
    { id: 'all', name: 'All Categories', count: 24 },
    { id: 'getting-started', name: 'Getting Started', count: 6 },
    { id: 'pos', name: 'POS System', count: 8 },
    { id: 'inventory', name: 'Inventory & Stock', count: 5 },
    { id: 'reports', name: 'Reports & GST', count: 3 },
    { id: 'staff', name: 'Staff Access', count: 2 },
  ]

  const articles = [
    { 
      id: 1, 
      title: 'Complete Guide to POS Checkout & Peripherals Setup', 
      category: 'pos', 
      type: 'article', 
      readTime: '8 min', 
      views: 1245, 
      helpful: 892, 
      date: '2026-04-01', 
      popular: true, 
      content: 'This comprehensive manual covers USB & Bluetooth thermal receipt printer installation, barcode reader serial communication setup, electronic cash drawer kick pulse triggers, and offline transaction buffering mechanisms.' 
    },
    { 
      id: 2, 
      title: 'How to Manage Multi-Location Inventory Effectively', 
      category: 'inventory', 
      type: 'article', 
      readTime: '6 min', 
      views: 987, 
      helpful: 756, 
      date: '2026-03-28', 
      popular: true, 
      content: 'Learn industry best practices for conducting cyclical stock audits, tracking batch serial numbers, automating low-stock replenishment reorders, and reconciling purchase orders with inward supplier challans.' 
    },
    { 
      id: 3, 
      title: 'Understanding Indian GST Return Reports (GSTR-1 & B2B/B2C)', 
      category: 'reports', 
      type: 'article', 
      readTime: '5 min', 
      views: 654, 
      helpful: 489, 
      date: '2026-03-25', 
      popular: false, 
      content: 'Full breakdown of GST invoices generated in Velqino. Understand CGST/SGST intrastate split vs IGST interstate transactions, HSN summary calculations, and 1-click JSON report exports for your chartered accountant.' 
    },
    { 
      id: 4, 
      title: 'Configuring Cashier Permissions & Supervisor PIN Overrides', 
      category: 'staff', 
      type: 'article', 
      readTime: '4 min', 
      views: 432, 
      helpful: 345, 
      date: '2026-03-22', 
      popular: true, 
      content: 'Protect your bottom line by configuring role-based ACLs. Prevent unauthorized manual cart discounts, restrict invoice voids to store managers, and enforce daily cash-drawer float reconciliation upon shift handover.' 
    },
    { 
      id: 5, 
      title: 'First-Time Merchant Store Profile & Business Credentials', 
      category: 'getting-started', 
      type: 'article', 
      readTime: '3 min', 
      views: 2100, 
      helpful: 1890, 
      date: '2026-03-20', 
      popular: true, 
      content: 'Step-by-step onboarding walkthrough for setting up your store legal identity, uploading custom brand logos for thermal print headers, adding contact information, and configuring payment gateway API keys.' 
    },
  ]

  const videos = [
    { id: 1, title: 'POS Billing Counter - Full Cashier Walkthrough', duration: '15:32', views: 3456, category: 'pos', date: '2026-04-05' },
    { id: 2, title: 'Inventory Batch Tracking & Barcode Inwarding', duration: '08:45', views: 2345, category: 'inventory', date: '2026-04-02' },
    { id: 3, title: 'GST Filing & Monthly Summary Export in 2 Minutes', duration: '12:18', views: 1876, category: 'reports', date: '2026-03-28' },
    { id: 4, title: 'Staff Role Management & Multi-Terminal Setup', duration: '10:22', views: 1234, category: 'staff', date: '2026-03-25' },
  ]

  const guides = [
    { id: 1, title: 'Merchant Quick Start Field Manual', pages: 12, downloads: 890, category: 'getting-started', format: 'PDF', size: '2.4 MB' },
    { id: 2, title: 'Hardware POS Peripherals Engineering Guide', pages: 45, downloads: 567, category: 'pos', format: 'PDF', size: '5.1 MB' },
    { id: 3, title: 'Retail Inventory Audit & Stock Taking Procedures', pages: 28, downloads: 432, category: 'inventory', format: 'PDF', size: '3.2 MB' },
    { id: 4, title: 'Statutory GST Compliance & Tax Invoicing Standards', pages: 35, downloads: 345, category: 'reports', format: 'PDF', size: '4.0 MB' },
  ]

  const filteredArticles = articles.filter(a => 
    (selectedCategory === 'all' || a.category === selectedCategory) &&
    (searchQuery === '' || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredVideos = videos.filter(v => 
    (selectedCategory === 'all' || v.category === selectedCategory) &&
    (searchQuery === '' || v.title.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredGuides = guides.filter(g => 
    (selectedCategory === 'all' || g.category === selectedCategory) &&
    (searchQuery === '' || g.title.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-2xs shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Knowledge Base &amp; Documentation</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                  Updated Weekly
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Explore comprehensive operating manuals, video demonstrations, and downloadable PDF manuals</p>
            </div>
          </div>

          {/* Sub Navigation Tab Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-2xl border border-gray-200/60 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('articles')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'articles' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText size={13} />
              <span>Articles ({filteredArticles.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'videos' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Video size={13} />
              <span>Videos ({filteredVideos.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guides')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'guides' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Download size={13} />
              <span>Guides ({filteredGuides.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search manuals, tutorials, PDF guides..."
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

        {/* Category Filter Chips */}
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Category Filter</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-primary-700 text-white' : 'bg-gray-200/70 text-gray-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <div 
                key={article.id} 
                onClick={() => setSelectedArticle(article)}
                className="border border-gray-200/80 rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-primary-300 hover:shadow-2xs transition-all bg-white group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                        {article.category.replace('-', ' ')}
                      </span>
                      {article.popular && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                          <Star size={10} className="fill-amber-500 text-amber-500" /> Popular
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">• {article.date}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {article.content}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock size={11} />
                        {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {article.views} views
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <ThumbsUp size={11} />
                        {article.helpful} helpful
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredVideos.map((video) => (
              <div 
                key={video.id} 
                className="border border-gray-200/80 rounded-2xl overflow-hidden cursor-pointer hover:border-primary-300 hover:shadow-2xs transition-all bg-white group"
              >
                <div className="bg-gradient-to-br from-gray-900 via-primary-950 to-indigo-950 h-36 flex items-center justify-center relative overflow-hidden">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-xs group-hover:scale-110 group-hover:bg-primary-600 transition-all shadow-md">
                    <Play size={20} className="ml-0.5" />
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span className="uppercase font-bold text-primary-600">{video.category}</span>
                    <span>{video.date}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2.5 text-[11px] text-gray-500">
                    <Eye size={11} />
                    <span>{video.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Guides Tab */}
        {activeTab === 'guides' && (
          <div className="space-y-3">
            {filteredGuides.map((guide) => (
              <div 
                key={guide.id} 
                className="border border-gray-200/80 rounded-2xl p-4 sm:p-5 hover:border-primary-300 hover:shadow-2xs transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center shrink-0">
                    <FileCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">{guide.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="font-bold text-primary-700 bg-primary-50 px-2 py-0.2 rounded-md">{guide.format}</span>
                      <span>{guide.pages} pages</span>
                      <span>•</span>
                      <span>{guide.size}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">{guide.downloads} downloads</span>
                    </div>
                  </div>
                </div>

                <button 
                  type="button"
                  className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto shrink-0"
                >
                  <Download size={14} />
                  <span>Download Guide</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Article Detail Modal View */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                  {selectedArticle.category.replace('-', ' ')}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mt-2">
                  {selectedArticle.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>{selectedArticle.date}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                  <span>•</span>
                  <span>{selectedArticle.views} views</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-3">
              <p>{selectedArticle.content}</p>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
                <p className="font-bold text-gray-900 text-xs">Standard Operational Tip:</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Before applying major configuration changes during high-traffic billing hours, perform a test receipt print on terminal 1 to confirm serial and baud rate stability.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <ThumbsUp size={13} />
                {selectedArticle.helpful} merchants found this helpful
              </span>
              <button 
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
