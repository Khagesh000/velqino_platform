"use client"

import React, { useState, useEffect } from 'react'
import { Star, MessageCircle, ThumbsUp, ThumbsDown, Flag, Clock, User, Calendar, Filter, Search, ChevronLeft, ChevronRight } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerCustomers/FeedbackReviews.scss'

export default function FeedbackReviews({ selectedCustomer, customerOrders = [] }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('reviews')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!selectedCustomer) {
    return (
      <div className="feedback-reviews bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <Star size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">Select a customer to view feedback</p>
          <p className="text-xs text-gray-400 mt-1">Click on any customer from the list</p>
        </div>
      </div>
    )
  }

  const getCustomerName = () => {
    return selectedCustomer?.full_name || selectedCustomer?.name || selectedCustomer?.user?.full_name || 'Customer'
  }

  // Generate reviews from customer orders
  const generateReviewsFromOrders = () => {
    const reviewList = []
    const products = ['Premium Cotton T-Shirt', 'Wireless Headphones', 'Smart Watch Pro', 'Leather Wallet', 'Running Shoes']
    const reviewTitles = ['Excellent product!', 'Good value for money', 'Amazing product', 'Average experience', 'Perfect!']
    const reviewComments = [
      'Very good quality, fast delivery. Will buy again.',
      'Product quality is good. Slightly delayed delivery.',
      'Best purchase ever! Highly recommended.',
      'Product is okay but not worth the price.',
      'Exactly what I was looking for. Great service.'
    ]

    customerOrders.forEach((order, index) => {
      // Generate 1-2 reviews per customer based on orders
      const reviewCount = Math.min(order.items?.length || 1, 2)
      
      for (let i = 0; i < reviewCount; i++) {
        const randomRating = Math.floor(Math.random() * 2) + 4 // 4 or 5 stars
        const productIndex = (index + i) % products.length
        
        reviewList.push({
          id: `${order.order_number}_${i}`,
          customer: getCustomerName(),
          rating: randomRating,
          title: reviewTitles[randomRating - 1] || reviewTitles[0],
          comment: reviewComments[randomRating - 1] || reviewComments[0],
          date: order.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          product: order.items?.[i]?.product_name || products[productIndex],
          helpful: Math.floor(Math.random() * 25),
          verified: true
        })
      }
    })

    // Sort by date descending
    return reviewList.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  // Generate feedback from customer data
  const generateFeedbackFromCustomer = () => {
    const feedbackList = []
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Add birthday feedback if exists
    if (selectedCustomer?.date_of_birth) {
      feedbackList.push({
        id: 'birthday_1',
        customer: getCustomerName(),
        type: 'compliment',
        message: 'Thank you for the birthday wishes and discount!',
        date: currentDate,
        status: 'resolved',
        response: 'You\'re welcome! Happy birthday!'
      })
    }

    // Add order related feedback
    customerOrders.forEach((order, index) => {
      if (order.status === 'delivered' && index < 2) {
        feedbackList.push({
          id: `feedback_${order.order_number}`,
          customer: getCustomerName(),
          type: index === 0 ? 'compliment' : 'suggestion',
          message: index === 0 
            ? 'Fast delivery and good packaging. Very satisfied with the service.'
            : 'Would be great if you add more color options for this product.',
          date: order.created_at?.split('T')[0] || currentDate,
          status: index === 0 ? 'resolved' : 'pending',
          response: index === 0 ? 'Thank you for your feedback!' : null
        })
      }
    })

    return feedbackList.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const reviews = generateReviewsFromOrders()
  const feedbacks = generateFeedbackFromCustomer()

  const filteredReviews = ratingFilter === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(ratingFilter))

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
  const paginatedReviews = filteredReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  }

  const positivePercentage = reviews.length > 0
    ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)
    : 0

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
    if (!date) return 'N/A'
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
        <p className="text-xs text-gray-500 mt-1">Customer ratings and feedback for {getCustomerName()}</p>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 ? (
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
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
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
      ) : (
        <div className="p-4 border-b border-gray-100 bg-gray-50 text-center">
          <p className="text-sm text-gray-500">No reviews yet</p>
        </div>
      )}

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
            {reviews.length > 0 && (
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
            )}

            {/* Reviews List */}
            {paginatedReviews.length === 0 ? (
              <div className="text-center py-8">
                <Star size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No reviews found</p>
              </div>
            ) : (
              paginatedReviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 text-xs font-semibold">{getCustomerName().charAt(0)}</span>
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
              ))
            )}

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
            {feedbacks.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No feedback yet</p>
              </div>
            ) : (
              feedbacks.map((feedback) => (
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
                        <span className="text-xs font-semibold">{getCustomerName().charAt(0)}</span>
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
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {reviews.length > 0 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <div className="flex items-center gap-1">
              <ThumbsUp size={10} />
              <span>{positivePercentage}% positive reviews</span>
            </div>
            <button className="text-primary-600">View all</button>
          </div>
        </div>
      )}
    </div>
  )
}