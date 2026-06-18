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
   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

  {/* Tab Headers */}
  <div className="flex border-b border-gray-100 overflow-x-auto bg-gray-50/60">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`relative px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0
          ${activeTab === tab.id
            ? 'text-primary-600 bg-white'
            : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
          }`}
      >
        {tab.label}
        {activeTab === tab.id && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t-full" />
        )}
      </button>
    ))}
  </div>

  {/* Tab Content */}
  <div className="p-5 sm:p-6">

    {/* Description */}
    {activeTab === 'description' && (
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900">Product Description</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description || 'No description available.'}
        </p>
        {product?.features && product.features.length > 0 && (
          <ul className="space-y-2">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
    )}

    {/* Specifications */}
    {activeTab === 'specifications' && (
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900">Technical Specifications</h3>
        {specEntries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {specEntries.map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[90px] capitalize">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="text-sm text-gray-900 font-medium">{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No specifications available.</p>
        )}
      </div>
    )}

    {/* Reviews */}
    {activeTab === 'reviews' && (
      <div className="space-y-6">

        {/* Rating Summary */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-center flex-shrink-0">
            <span className="text-5xl font-bold text-gray-900">{avgRating}</span>
            <div className="flex items-center justify-center gap-0.5 mt-1.5">
              {renderStars(Math.floor(avgRating))}
            </div>
            <span className="text-xs text-gray-400 mt-1 block">{totalReviews} reviews</span>
          </div>
          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const percentage = ratingDistribution[star] || 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-medium w-4">{star}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write Review */}
        <button className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-md hover:shadow-primary-200 hover:-translate-y-0.5">
          Write a Review
        </button>

        {/* Reviews List */}
        {reviewsList.length > 0 ? (
          <div className="space-y-4">
            {reviewsList.map((review) => (
              <div key={review.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{review.name}</span>
                      {review.verified && (
                        <span className="text-[11px] text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full font-medium">
                          ✓ Verified
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
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600 transition-colors px-2 py-1 rounded-lg hover:bg-primary-50">
                      <ThumbsUp size={12} />
                      {review.helpful}
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50">
                      <Flag size={12} />
                    </button>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-800 text-sm mt-2.5">{review.title}</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    )}
  </div>
</div>
  );
}
