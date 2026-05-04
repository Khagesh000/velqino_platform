"use client"

import React, { useState, useEffect } from 'react'
import { BookOpen, Video, FileText, Search, Star, Clock, Eye, ChevronRight, Download, Play, ThumbsUp, ThumbsDown, Share2, Bookmark } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSupport/KnowledgeBase.scss'

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
    { id: 'all', name: 'All', icon: '📚', count: 24 },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀', count: 6 },
    { id: 'pos', name: 'POS System', icon: '🖨️', count: 8 },
    { id: 'inventory', name: 'Inventory', icon: '📦', count: 5 },
    { id: 'reports', name: 'Reports', icon: '📊', count: 3 },
    { id: 'staff', name: 'Staff Management', icon: '👥', count: 2 },
  ]

  const articles = [
    { id: 1, title: 'Complete Guide to POS Setup', category: 'pos', type: 'article', readTime: '8 min', views: 1245, helpful: 892, date: '2026-04-01', popular: true, content: 'Step-by-step guide to set up your POS system...' },
    { id: 2, title: 'How to Manage Inventory Effectively', category: 'inventory', type: 'article', readTime: '6 min', views: 987, helpful: 756, date: '2026-03-28', popular: true, content: 'Learn best practices for inventory management...' },
    { id: 3, title: 'Understanding GST Reports', category: 'reports', type: 'article', readTime: '5 min', views: 654, helpful: 489, date: '2026-03-25', popular: false, content: 'Complete guide to GST reports and filing...' },
    { id: 4, title: 'Staff Role & Permission Setup', category: 'staff', type: 'article', readTime: '4 min', views: 432, helpful: 345, date: '2026-03-22', popular: true, content: 'How to configure staff roles and permissions...' },
    { id: 5, title: 'First Time Login Guide', category: 'getting-started', type: 'article', readTime: '3 min', views: 2100, helpful: 1890, date: '2026-03-20', popular: true, content: 'Step by step guide for first time login...' },
  ]

  const videos = [
    { id: 1, title: 'POS Tutorial - Complete Walkthrough', duration: '15:32', views: 3456, category: 'pos', thumbnail: '🎥', date: '2026-04-05' },
    { id: 2, title: 'Inventory Management Tips', duration: '08:45', views: 2345, category: 'inventory', thumbnail: '🎥', date: '2026-04-02' },
    { id: 3, title: 'GST Filing Made Easy', duration: '12:18', views: 1876, category: 'reports', thumbnail: '🎥', date: '2026-03-28' },
    { id: 4, title: 'Staff Training Video', duration: '10:22', views: 1234, category: 'staff', thumbnail: '🎥', date: '2026-03-25' },
  ]

  const guides = [
    { id: 1, title: 'Quick Start Guide', pages: 12, downloads: 890, category: 'getting-started', format: 'PDF', size: '2.4 MB' },
    { id: 2, title: 'POS User Manual', pages: 45, downloads: 567, category: 'pos', format: 'PDF', size: '5.1 MB' },
    { id: 3, title: 'Inventory Best Practices', pages: 28, downloads: 432, category: 'inventory', format: 'PDF', size: '3.2 MB' },
    { id: 4, title: 'GST Compliance Guide', pages: 35, downloads: 345, category: 'reports', format: 'PDF', size: '4.0 MB' },
  ]

  const getCategoryIcon = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId)
    return cat?.icon || '📚'
  }

  const filteredArticles = articles.filter(a => 
    (selectedCategory === 'all' || a.category === selectedCategory) &&
    (searchQuery === '' || a.title.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredVideos = videos.filter(v => 
    (selectedCategory === 'all' || v.category === selectedCategory) &&
    (searchQuery === '' || v.title.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredGuides = guides.filter(g => 
    (selectedCategory === 'all' || g.category === selectedCategory) &&
    (searchQuery === '' || g.title.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="knowledge-base bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <BookOpen size={22} className="text-primary-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Knowledge Base</h3>
            <p className="text-sm text-gray-500">Articles, videos and guides to help you</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-5 border-b border-gray-100">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles, videos, guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 pt-4 pb-2 border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${activeTab === 'articles' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          📄 Articles ({filteredArticles.length})
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${activeTab === 'videos' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          🎥 Videos ({filteredVideos.length})
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${activeTab === 'guides' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          📚 Guides ({filteredGuides.length})
        </button>
      </div>

      {/* Articles Tab */}
      {activeTab === 'articles' && (
        <div className="p-5 max-h-[450px] overflow-y-auto custom-scroll">
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <div key={article.id} className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {getCategoryIcon(article.category)} {article.category.replace('-', ' ')}
                      </span>
                      {article.popular && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">⭐ Popular</span>
                      )}
                    </div>
                    <h4 className="text-base font-semibold text-gray-900">{article.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {article.readTime} read
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={10} />
                        {article.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={10} />
                        {article.helpful} helpful
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="p-5 max-h-[450px] overflow-y-auto custom-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVideos.map((video) => (
              <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-32 flex items-center justify-center relative">
                  <span className="text-5xl">{video.thumbnail}</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                      <Play size={24} className="text-white ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-1">{formatDate(video.date)}</p>
                  <h4 className="text-sm font-semibold text-gray-900">{video.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{video.duration}</span>
                    <span className="text-xs text-gray-500">{video.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guides Tab */}
      {activeTab === 'guides' && (
        <div className="p-5 max-h-[450px] overflow-y-auto custom-scroll">
          <div className="space-y-3">
            {filteredGuides.map((guide) => (
              <div key={guide.id} className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">📘</div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">{guide.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{guide.format}</span>
                        <span>{guide.pages} pages</span>
                        <span>{guide.size}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">{guide.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1">
                    <Download size={12} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}