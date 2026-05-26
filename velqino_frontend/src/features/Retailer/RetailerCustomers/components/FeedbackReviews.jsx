"use client"

import React, { useState, useEffect } from 'react'
import { Star, MessageCircle, ThumbsUp, ThumbsDown, Flag, Clock, User, Calendar, Filter, Search, ChevronLeft, ChevronRight, Plus, X } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerCustomers/FeedbackReviews.scss'
import { useGetProductReviewsQuery, useMarkReviewHelpfulMutation } from '@/redux/customer/slices/reviewsSlice'

export default function FeedbackReviews({ selectedCustomer, customerOrders = [], productId = null }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('reviews')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
    product_id: null,
    order_id: ''
  })
  const itemsPerPage = 3

  

  console.log("🔍 DEBUG - productId value:", productId);  // ✅ ADD THIS LINE
  console.log("🔍 DEBUG - selectedCustomer:", selectedCustomer?.name);

  // RTK Query hooks for product reviews
  const { data: reviewsData, isLoading } = useGetProductReviewsQuery(  // ✅ Added isLoading
    { productId: productId },
    { skip: !productId }
  )

  const [markReviewHelpful] = useMarkReviewHelpfulMutation()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!selectedCustomer && !productId) {
    return (
      <div className="feedback-reviews bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <Star size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">Select a customer or product to view feedback</p>
          <p className="text-xs text-gray-400 mt-1">Click on any customer from the list</p>
        </div>
      </div>
    )
  }

  const getCustomerName = () => {
    return selectedCustomer?.full_name || selectedCustomer?.name || selectedCustomer?.user?.full_name || 'Customer'
  }

  // Get reviews from API response
  const reviews = reviewsData?.data?.reviews || []
  const summary = reviewsData?.data?.summary || {}
  
  const filteredReviews = ratingFilter === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(ratingFilter))

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
  const paginatedReviews = filteredReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const averageRating = summary.average_rating || '0.0'
  const totalReviews = summary.total || 0
  const ratingDistribution = summary.rating_distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  const positivePercentage = totalReviews > 0
    ? Math.round(((ratingDistribution[5] + ratingDistribution[4]) / totalReviews) * 100)
    : 0

  // Generate feedback from customer data (still using mock for feedback tab)
  const generateFeedbackFromCustomer = () => {
    const feedbackList = []
    const currentDate = new Date().toISOString().split('T')[0]
    
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

  const feedbacks = generateFeedbackFromCustomer()

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

  const handleMarkHelpful = async (reviewId) => {
    try {
      await markReviewHelpful(reviewId).unwrap()
      refetch()
    } catch (error) {
      console.error('Failed to mark helpful:', error)
    }
  }

  const handleSubmitReview = async () => {
    // Implementation for create review mutation
    console.log('Submit review:', reviewForm)
    setShowReviewModal(false)
  }

  if (isLoading) {
    return (
      <div className="feedback-reviews bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="feedback-reviews bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-500" />
            <h3 className="text-base font-semibold text-gray-900">Feedback & Reviews</h3>
          </div>
          {selectedCustomer && (
            <button 
              onClick={() => setShowReviewModal(true)}
              className="px-2 py-1 text-[10px] font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Write Review
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {selectedCustomer ? `Reviews from ${getCustomerName()}` : 'Customer ratings and feedback'}
        </p>
      </div>

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
              <div className="flex items-center justify-center mt-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Based on {totalReviews} reviews</p>
            </div>
            <div className="flex-1 space-y-1">
              {[5,4,3,2,1].map(rating => {
                const count = ratingDistribution[rating] || 0
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
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
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'reviews' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Reviews ({totalReviews})
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
                        <span className="text-primary-600 text-xs font-semibold">{review.customer_name?.charAt(0) || 'C'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{review.customer_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {renderStars(review.rating)}
                          <span className="text-[10px] text-gray-400">{formatDate(review.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    {review.is_verified_purchase && (
                      <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Verified</span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mt-2">{review.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{review.comment}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                    <span>Product: {review.product_name}</span>
                    <button 
                      onClick={() => handleMarkHelpful(review.id)}
                      className="flex items-center gap-1 text-gray-500 hover:text-primary-600"
                    >
                      <ThumbsUp size={10} />
                      <span>{review.helpful_count} helpful</span>
                    </button>
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
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {totalReviews > 0 && (
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

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                      className="focus:outline-none"
                    >
                      <Star size={24} className={star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="Summary of your experience"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                  placeholder="Share your experience with this product..."
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}