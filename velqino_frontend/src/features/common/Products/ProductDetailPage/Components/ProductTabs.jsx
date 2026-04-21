"use client";

import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag } from '../../../../../utils/icons';

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description');

  // Get data from product prop
  const description = product?.description || '';
  const specifications = product?.specifications || {};
  const reviewsList = product?.reviews || [];
  const avgRating = product?.avg_rating || 4.8;
  const totalReviews = product?.total_reviews || 234;
  const ratingDistribution = product?.rating_distribution || { 5: 70, 4: 20, 3: 5, 2: 3, 1: 2 };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${totalReviews})` },
  ];

  // Helper to render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  // Get specifications as array
  const specEntries = Object.entries(specifications);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Product Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {description || 'No description available.'}
            </p>
            {product?.features && product.features.length > 0 && (
              <ul className="space-y-2 text-gray-600">
                {product.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specifications' && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Technical Specifications</h3>
            {specEntries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specEntries.map(([key, value]) => (
                  <div key={key} className="flex py-2 border-b border-gray-100">
                    <span className="w-32 text-sm text-gray-500 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specifications available.</p>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            {/* Rating Summary */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-gray-100">
              <div className="text-center">
                <span className="text-4xl font-bold text-gray-900">{avgRating}</span>
                <div className="flex items-center gap-0.5 mt-1">
                  {renderStars(Math.floor(avgRating))}
                </div>
                <span className="text-xs text-gray-500">Based on {totalReviews} reviews</span>
              </div>
              <div className="flex-1 w-full space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const percentage = ratingDistribution[star] || 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-6">{star}★</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 rounded-full" 
                          style={{ width: `${percentage}%` }} 
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-6">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Write Review Button */}
            <button className="mb-6 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all">
              Write a Review
            </button>

            {/* Reviews List */}
            {reviewsList.length > 0 ? (
              <div className="space-y-4">
                {reviewsList.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{review.name}</span>
                          {review.verified && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <button className="text-xs text-gray-400 hover:text-primary-600 flex items-center gap-1">
                          <ThumbsUp size={12} />
                          {review.helpful}
                        </button>
                        <button className="text-xs text-gray-400 hover:text-primary-600">
                          <Flag size={12} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-800 mt-2">{review.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}