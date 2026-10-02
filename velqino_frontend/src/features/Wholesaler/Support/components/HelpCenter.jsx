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
  Sparkles,
  CheckCircle,
  Play
} from '@/utils/icons'
import {
  useGetFAQsQuery,
  useGetFAQCategoriesQuery,
  useSearchFAQsQuery,
  useMarkFAQHelpfulMutation,
  useIncrementFAQViewMutation
} from '@/redux/wholesaler/slices/supportSlice'
import { toast } from 'react-toastify'
import '../../../../styles/Wholesaler/Support/HelpCenter.scss'

export default function HelpCenter({ isActive = false }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedArticle, setSelectedArticle] = useState(null)

  const { data: categoriesData, isLoading: categoriesLoading } = useGetFAQCategoriesQuery(undefined, {
    skip: !isActive
  })
  
  const { data: faqsData, isLoading: faqsLoading, refetch: refetchFAQs } = useGetFAQsQuery({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    per_page: 50
  }, {
    skip: !isActive
  })
  
  const { data: searchResults, isLoading: searchLoading } = useSearchFAQsQuery(searchQuery, {
    skip: !isActive || !searchQuery || searchQuery.length < 2
  })

  const [markHelpful] = useMarkFAQHelpfulMutation()
  const [incrementView] = useIncrementFAQViewMutation()

  // Transform API data to component format
  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen, count: faqsData?.pagination?.total || 0 },
    ...(categoriesData?.data || []).map(cat => ({
      id: cat.slug,
      label: cat.name,
      icon: HelpCircle,
      count: cat.faqs_count || 0
    }))
  ]

  const articles = (faqsData?.data || []).map(faq => ({
    id: faq.id,
    title: faq.question,
    category: faq.category_slug || 'General Support',
    content: faq.answer,
    views: faq.views || 0,
    helpful: faq.helpful_count || 0,
    date: faq.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
  }))

  const displayedArticles = searchQuery && searchResults?.data 
    ? (searchResults.data || []).map(faq => ({
        id: faq.id,
        title: faq.question,
        category: faq.category_slug || 'General Support',
        content: faq.answer,
        views: faq.views || 0,
        helpful: faq.helpful_count || 0,
        date: faq.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
      }))
    : articles

  const filteredArticles = displayedArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesCategory
  })

  const handleArticleClick = async (article) => {
    setSelectedArticle(article)
    try {
      await incrementView(article.id).unwrap()
      if (refetchFAQs) refetchFAQs()
    } catch (error) {
      console.error('Error incrementing view:', error)
    }
  }

  const handleHelpful = async (articleId, wasHelpful) => {
    try {
      await markHelpful({ faqId: articleId, helpful: wasHelpful }).unwrap()
      toast.success(wasHelpful ? 'Thank you for your feedback!' : 'Feedback noted. We will improve this guide.')
      if (refetchFAQs) refetchFAQs()
    } catch (error) {
      toast.error('Failed to submit feedback')
    }
  }

  const videoTutorials = [
    { title: 'Velqino Merchant Portal Onboarding', duration: '5:30', level: 'Beginner', category: 'Platform Guide' },
    { title: 'Catalog Bulk Upload & Inventory Sync', duration: '8:15', level: 'Core Workflow', category: 'Catalog Management' },
    { title: 'B2B Wholesale Orders & Batch Dispatch', duration: '12:45', level: 'Operations', category: 'Fulfillment' },
    { title: 'Payout Settlement & GST Invoicing', duration: '10:20', level: 'Finance', category: 'Settlement' }
  ]

  const trendingTopics = [
    'Payout Settlement Cycle',
    'Bulk Product Import',
    'GST Tax Invoices',
    'Warehouse Dispatch',
    'Customer Credit Terms'
  ]

  const isLoading = categoriesLoading || faqsLoading || searchLoading

  if (isLoading && !faqsData) {
    return (
      <div className="help-center bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs animate-pulse space-y-6">
        <div className="h-36 bg-slate-100 rounded-xl"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-14 bg-slate-100 rounded-xl"></div>
          <div className="h-14 bg-slate-100 rounded-xl"></div>
          <div className="h-14 bg-slate-100 rounded-xl"></div>
          <div className="h-14 bg-slate-100 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-32 bg-slate-50 rounded-xl"></div>
          <div className="h-32 bg-slate-50 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="help-center space-y-6">
      {/* Search & Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200/60">
          <Sparkles size={13} className="text-primary-600" />
          <span>Knowledge Base & Merchant Documentation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          How can we help your wholesale business today?
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-xl mx-auto">
          Search instant answers, verified compliance checklists, workflow guides, and video tutorials.
        </p>

        {/* Search Input Bar */}
        <div className="relative max-w-xl mx-auto pt-2">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search guides (e.g. payouts, bulk upload, dispatch, GST)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Trending Topic Chips */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Trending:</span>
          {trendingTopics.map(topic => (
            <button
              key={topic}
              onClick={() => setSearchQuery(topic)}
              className="text-xs font-semibold px-2.5 py-1 bg-slate-100/70 hover:bg-primary-50 hover:text-primary-700 border border-slate-200/60 rounded-lg text-slate-600 transition-all active:scale-95"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookOpen size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
              Knowledge Base
            </h4>
            <p className="text-2xs font-medium text-slate-500 mt-0.5">
              Comprehensive operational & policy articles
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Video size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Video Tutorials
            </h4>
            <p className="text-2xs font-medium text-slate-500 mt-0.5">
              Step-by-step interactive screen walkthroughs
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <MessageCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Direct Help Desk
            </h4>
            <p className="text-2xs font-medium text-slate-500 mt-0.5">
              Real-time merchant support via live chat
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Mail size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Email Desk
            </h4>
            <p className="text-2xs font-medium text-slate-500 mt-0.5">
              Direct written inquiries resolved within 24h
            </p>
          </div>
        </div>
      </div>

      {/* Main Knowledge Hub Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
        {/* Category Filter Chips */}
        <div className="overflow-x-auto scrollbar-none pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map(cat => {
              const Icon = cat.icon
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-white' : 'text-slate-500'} />
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-2xs font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Articles List / Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} className="text-primary-600" />
              <span>Recommended Articles & Guides</span>
            </h3>
            <span className="text-xs font-medium text-slate-400">
              Showing {filteredArticles.length} articles
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl p-8">
              <BookOpen size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No articles matched your query</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting keywords or selecting another category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.slice(0, 8).map(article => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="rounded-xl border border-slate-200/80 p-4 sm:p-5 hover:border-primary-400 hover:shadow-xs transition-all bg-white cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-2xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/60">
                        {article.category}
                      </span>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
                      {article.content}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-2xs font-medium text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <ThumbsUp size={12} />
                      {article.helpful} found helpful
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Walkthroughs */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Video size={16} className="text-primary-600" />
              <span>Video Walkthroughs & Onboarding</span>
            </h3>
            <span className="text-xs font-semibold text-primary-600 cursor-pointer hover:underline">
              View All Tutorials →
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videoTutorials.map((video, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/80 overflow-hidden bg-white shadow-2xs hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary-600/10 group-hover:bg-primary-600/20 transition-colors"></div>
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md">
                    <Play size={18} className="ml-0.5 text-white" />
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-2xs font-mono font-semibold">
                    {video.duration}
                  </span>
                </div>
                <div className="p-3.5 space-y-1">
                  <span className="text-2xs font-bold uppercase tracking-wider text-primary-600">
                    {video.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {video.title}
                  </h4>
                  <div className="flex items-center justify-between text-2xs text-slate-400 font-medium pt-1">
                    <span>{video.level}</span>
                    <span className="text-emerald-600 font-semibold">HD Walkthrough</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Still Need Help Callout Banner */}
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-primary-50/60 via-slate-50 to-primary-50/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
              <MessageCircle size={22} />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Can't find what you're looking for?
              </h4>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Our specialized merchant desk is available 24/7 to resolve wholesale inquiries and escalated disputes.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const contactBtn = document.querySelector('[data-tab="contact"]')
              if (contactBtn) contactBtn.click()
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
          >
            <MessageCircle size={15} />
            <span>Open Support Request</span>
          </button>
        </div>
      </div>

      {/* Interactive Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedArticle(null)}
          />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200/80 z-10 space-y-5 animate-scale-up">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-2xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 border border-primary-200/60">
                  {selectedArticle.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                  {selectedArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5"><Clock size={13} /> Published: {selectedArticle.date}</span>
              <span className="flex items-center gap-1.5"><Star size={13} /> {selectedArticle.views} views</span>
            </div>

            <div className="prose prose-sm text-slate-700 max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 sm:p-5 rounded-xl border border-slate-200/70">
              {selectedArticle.content}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs font-bold text-slate-700">Was this article helpful to your business?</p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => handleHelpful(selectedArticle.id, true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  <ThumbsUp size={14} />
                  <span>Yes, helpful</span>
                </button>
                <button 
                  onClick={() => handleHelpful(selectedArticle.id, false)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  <ThumbsDown size={14} />
                  <span>Needs clarity</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
