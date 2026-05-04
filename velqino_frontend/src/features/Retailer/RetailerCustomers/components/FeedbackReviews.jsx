"use client"

import React, { useState, useEffect } from 'react'
import { Star, MessageCircle, ThumbsUp, ThumbsDown, Flag, Clock, User, Calendar, Filter, Search, ChevronLeft, ChevronRight } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerCustomers/FeedbackReviews.scss'

export default function FeedbackReviews({ selectedCustomer }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('reviews')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Mock reviews data
  const reviews = [
    { id: 1, customer: 'Rajesh Kumar', rating: 5, title: 'Excellent product!', comment: 'Very good quality, fast delivery. Will buy again.', date: '2026-04-14', product: 'Premium Cotton T-Shirt', helpful: 12, verified: true },
    { id: 2, customer: 'Priya Sharma', rating: 4, title: 'Good value for money', comment: 'Product quality is good. Slightly delayed delivery.', date: '2026-04-13', product: 'Wireless Headphones', helpful: 8, verified: true },
    { id: 3, customer: 'Amit Singh', rating: 5, title: 'Amazing product', comment: 'Best purchase ever! Highly recommended.', date: '2026-04-12', product: 'Smart Watch Pro', helpful: 15, verified: true },
    { id: 4, customer: 'Sneha Reddy', rating: 3, title: 'Average experience', comment: 'Product is okay but not worth the price.', date: '2026-04-11', product: 'Leather Wallet', helpful: 3, verified: true },
    { id: 5, customer: 'Vikram Mehta', rating: 5, title: 'Perfect!', comment: 'Exactly what I was looking for. Great service.', date: '2026-04-10', product: 'Running Shoes', helpful: 22, verified: true },
  ]

  // Mock feedback data
  const feedbacks = [
    { id: 1, customer: 'Neha Gupta', type: 'complaint', message: 'Delivery was delayed by 2 days', date: '2026-04-14', status: 'resolved', response: 'We apologize for the delay' },
    { id: 2, customer: 'Rahul Verma', type: 'suggestion', message: 'Add more color options for shirts', date: '2026-04-13', status: 'pending', response: null },
    { id: 3, customer: 'Meera Joshi', type: 'compliment', message: 'Excellent customer service', date: '2026-04-12', status: 'resolved', response: 'Thank you for your feedback!' },
  ]

  const filteredReviews = ratingFilter === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(ratingFilter))

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
  const paginatedReviews = filteredReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map((star) => (
          <Star 
            key={star} 
            size={12} 
            className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
          />
        ))}
      </div>
    )
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="feedback-reviews bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-yellow-500" />
          <h3 className="text-base font-semibold text-gray-900">Feedback & Reviews</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">Customer ratings and feedback</p>
      </div>

      {/* Rating Summary */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
            <div className="flex items-center justify-center mt-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Based on {reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5,4,3,2,1].map(rating => {
              const count = ratingDistribution[rating]
              const percentage = (count / reviews.length) * 100
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-6">{rating}★</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'reviews' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'feedback' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Feedback ({feedbacks.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[350px] overflow-y-auto custom-scroll">
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {/* Rating Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setRatingFilter('all')}
                className={`px-2 py-1 text-xs rounded-full transition-all ${ratingFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                All
              </button>
              {[5,4,3,2,1].map(rating => (
                <button
                  key={rating}
                  onClick={() => setRatingFilter(rating.toString())}
                  className={`px-2 py-1 text-xs rounded-full transition-all flex items-center gap-1 ${ratingFilter === rating.toString() ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Star size={10} />
                  {rating}
                </button>
              ))}
            </div>

            {/* Reviews List */}
            {paginatedReviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 text-xs font-semibold">{review.customer.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{review.customer}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {renderStars(review.rating)}
                        <span className="text-[10px] text-gray-400">{formatDate(review.date)}</span>
                      </div>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Verified</span>
                  )}
                </div>
                <h4 className="text-sm font-medium text-gray-900 mt-2">{review.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{review.comment}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                  <span>Product: {review.product}</span>
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={10} />
                    <span>{review.helpful} helpful</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-2 pt-2 border-t border-gray-100">
                  <button className="text-[10px] text-gray-500 hover:text-primary-600 flex items-center gap-1">
                    <ThumbsUp size={10} />
                    Helpful
                  </button>
                  <button className="text-[10px] text-gray-500 hover:text-red-600 flex items-center gap-1">
                    <Flag size={10} />
                    Report
                  </button>
                  <button className="text-[10px] text-gray-500 hover:text-primary-600 flex items-center gap-1">
                    <MessageCircle size={10} />
                    Reply
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-gray-600">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-3">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className={`border rounded-lg p-3 ${
                feedback.type === 'complaint' ? 'border-red-200 bg-red-50' :
                feedback.type === 'suggestion' ? 'border-blue-200 bg-blue-50' :
                'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      feedback.type === 'complaint' ? 'bg-red-200' :
                      feedback.type === 'suggestion' ? 'bg-blue-200' : 'bg-green-200'
                    }`}>
                      <span className="text-xs font-semibold">{feedback.customer.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{feedback.customer}</p>
                      <p className="text-[10px] text-gray-500">{formatDate(feedback.date)}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    feedback.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {feedback.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <span className={`text-[10px] font-medium ${
                    feedback.type === 'complaint' ? 'text-red-600' :
                    feedback.type === 'suggestion' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {feedback.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{feedback.message}</p>
                {feedback.response && (
                  <div className="mt-2 p-2 bg-white rounded-lg text-xs text-gray-600">
                    <span className="font-medium">Response: </span>
                    {feedback.response}
                  </div>
                )}
                {!feedback.response && (
                  <button className="mt-2 text-xs text-primary-600 hover:text-primary-700">
                    Reply to customer
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <ThumbsUp size={10} />
            <span>92% positive reviews</span>
          </div>
          <button className="text-primary-600">View all</button>
        </div>
      </div>
    </div>
  )
}