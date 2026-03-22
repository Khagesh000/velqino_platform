"use client"

import React, { useState } from 'react'
import {
  Search,
  BookOpen,
  Video,
  HelpCircle,
  FileText,
  ChevronRight,
  MessageCircle,
  ExternalLink,
  Star,
  Clock,
  ThumbsUp,
  ThumbsDown,
  X,
  Mail,
  Phone,
  MessageSquare
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Support/HelpCenter.scss'

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [selectedFaq, setSelectedFaq] = useState(null)

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen, count: 48 },
    { id: 'getting-started', label: 'Getting Started', icon: HelpCircle, count: 12 },
    { id: 'orders', label: 'Orders & Payments', icon: FileText, count: 15 },
    { id: 'products', label: 'Products & Inventory', icon: BookOpen, count: 10 },
    { id: 'account', label: 'Account & Settings', icon: HelpCircle, count: 8 },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, count: 3 }
  ]

  const articles = [
    {
      id: 1,
      title: 'How to create your first product listing',
      category: 'getting-started',
      content: 'Learn how to add products to your catalog with images, pricing, and inventory. Follow our step-by-step guide to get your products live in minutes.',
      views: 1245,
      helpful: 89,
      date: '2024-03-15'
    },
    {
      id: 2,
      title: 'Understanding order status and fulfillment',
      category: 'orders',
      content: 'Explanation of order statuses: Pending, Processing, Shipped, Delivered, Cancelled. Learn how to manage fulfillment efficiently.',
      views: 892,
      helpful: 76,
      date: '2024-03-14'
    },
    {
      id: 3,
      title: 'How to manage inventory and stock alerts',
      category: 'products',
      content: 'Set up low stock alerts, manage inventory levels, and track stock movements across your product catalog.',
      views: 567,
      helpful: 45,
      date: '2024-03-13'
    },
    {
      id: 4,
      title: 'Setting up payment methods for payouts',
      category: 'account',
      content: 'Add bank account or UPI details to receive payouts from your sales. Learn about payout schedules and minimum withdrawal amounts.',
      views: 723,
      helpful: 68,
      date: '2024-03-12'
    },
    {
      id: 5,
      title: 'How to process refunds and returns',
      category: 'orders',
      content: 'Step-by-step guide to process customer refunds, handle returns, and manage reverse logistics.',
      views: 634,
      helpful: 52,
      date: '2024-03-11'
    },
    {
      id: 6,
      title: 'Wholesale pricing and bulk discounts',
      category: 'faq',
      content: 'Understanding wholesale pricing tiers, bulk discounts, and minimum order quantities for your products.',
      views: 1456,
      helpful: 112,
      date: '2024-03-10'
    }
  ]

  const faqs = [
    { 
      id: 1,
      question: 'How long does it take to receive payouts?', 
      answer: 'Payouts are processed within 3-5 business days after order delivery. Bank transfers may take an additional 1-2 days depending on your bank.'
    },
    { 
      id: 2,
      question: 'Can I change my store name?', 
      answer: 'Yes, you can update your store name in Settings > Profile Settings. Store name changes are reflected within 24 hours.'
    },
    { 
      id: 3,
      question: 'How do I contact support?', 
      answer: 'You can reach us via live chat (available 9 AM - 6 PM IST), email at support@veltrix.com, or raise a support ticket in the Contact Support section.'
    },
    { 
      id: 4,
      question: 'What is the minimum order quantity?', 
      answer: 'Minimum order quantity varies by product. Check individual product pages for MOQ details. Bulk orders may qualify for additional discounts.'
    },
    { 
      id: 5,
      question: 'How do I track my orders?', 
      answer: 'You can track all your orders in the Orders section. Each order has a tracking number once shipped. Click the tracking number to view real-time status.'
    }
  ]

  const videoTutorials = [
    { title: 'Getting Started with VELTRIX', duration: '5:30', level: 'Beginner' },
    { title: 'How to Add Products', duration: '8:15', level: 'Beginner' },
    { title: 'Managing Orders & Fulfillment', duration: '12:45', level: 'Intermediate' },
    { title: 'Understanding Analytics Dashboard', duration: '10:20', level: 'Intermediate' }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="help-center bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">How can we help you?</h2>
        <p className="text-sm text-white/80 mb-4">Search articles, tutorials, and FAQs</p>
        <div className="relative max-w-md mx-auto">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50 bg-white"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border-b border-gray-200 bg-gray-50/50">
        <button className="flex flex-col items-center p-3 rounded-lg hover:bg-white transition-all group">
          <BookOpen size={24} className="text-primary-500 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-gray-700">Knowledge Base</span>
        </button>
        <button className="flex flex-col items-center p-3 rounded-lg hover:bg-white transition-all group">
          <Video size={24} className="text-primary-500 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-gray-700">Video Tutorials</span>
        </button>
        <button className="flex flex-col items-center p-3 rounded-lg hover:bg-white transition-all group">
          <MessageCircle size={24} className="text-primary-500 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-gray-700">Live Chat</span>
        </button>
        <button className="flex flex-col items-center p-3 rounded-lg hover:bg-white transition-all group">
          <Mail size={24} className="text-primary-500 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-gray-700">Email Support</span>
        </button>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <Icon size={14} />
                {cat.label}
                <span className={`text-xs ${selectedCategory === cat.id ? 'text-white/80' : 'text-gray-400'}`}>
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Articles Grid */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-primary-500" />
            Knowledge Base Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.slice(0, 6).map(article => (
              <div
                key={article.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-all">
                    {article.title}
                  </h4>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{article.content}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={12} />
                    {article.helpful} helpful
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Video size={18} className="text-primary-500" />
            Video Tutorials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {videoTutorials.map((video, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer group">
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                  <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Video size={20} />
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">{video.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{video.duration}</span>
                    <span>{video.level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle size={18} className="text-primary-500" />
            Frequently Asked Questions
          </h3>
          <div className="space-y-2">
            {(searchQuery ? filteredFaqs : faqs.slice(0, 3)).map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-all"
                  onClick={() => setSelectedFaq(selectedFaq === faq.id ? null : faq.id)}
                >
                  <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                  <ChevronRight size={16} className={`text-gray-400 transition-transform ${selectedFaq === faq.id ? 'rotate-90' : ''}`} />
                </button>
                {selectedFaq === faq.id && (
                  <div className="p-3 pt-0 border-t border-gray-100">
                    <p className="text-xs text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center">
          <MessageCircle size={24} className="mx-auto text-primary-500 mb-2" />
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Still need help?</h4>
          <p className="text-xs text-gray-500 mb-3">Can't find what you're looking for? Our support team is here to help.</p>
          <button className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all">
            Contact Support
          </button>
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedArticle(null)} />
          <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedArticle.title}</h3>
              <button onClick={() => setSelectedArticle(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1"><Clock size={12} />{selectedArticle.date}</span>
              <span className="flex items-center gap-1"><Star size={12} />{selectedArticle.views} views</span>
            </div>
            <p className="text-sm text-gray-600 mb-6 whitespace-pre-line">{selectedArticle.content}</p>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Was this article helpful?</p>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-success-100 hover:text-success-700 transition-all">
                  <ThumbsUp size={14} />
                  Yes
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-error-100 hover:text-error-700 transition-all">
                  <ThumbsDown size={14} />
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}