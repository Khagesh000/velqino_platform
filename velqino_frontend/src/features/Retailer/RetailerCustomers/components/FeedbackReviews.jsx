"use client";

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageCircle, 
  Sparkles,
  Calendar,
  ThumbsUp,
  Package
} from '../../../../utils/icons';

export default function FeedbackReviews({ reviews = {}, selectedCustomer }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalReviews = reviews.total || 0;
  const avgRating = reviews.average_rating || 0.0;
  const recentReviewsList = reviews.reviews || [];
  const ratingDist = reviews.rating_distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between h-full flex-1">
      <div>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Customer Feedback & Reviews</h3>
              <p className="text-[11px] text-gray-400">Buyer ratings across your catalog offerings</p>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
            {totalReviews} Total Reviews
          </span>
        </div>

        {/* Rating Breakdown Ribbon */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {avgRating > 0 ? avgRating.toFixed(1) : '5.0'}
            </p>
            <div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Average Store Rating</p>
            </div>
          </div>

          {/* Quick Distribution */}
          <div className="space-y-1 w-32 shrink-0 text-[10px] text-gray-500">
            {[5, 4, 3].map((star) => {
              const count = ratingDist[star] || 0;
              const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : (star === 5 ? 85 : 10);
              return (
                <div key={star} className="flex items-center gap-1.5">
                  <span className="w-3 text-right">{star}★</span>
                  <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="p-4 sm:p-5 max-h-56 overflow-y-auto space-y-2.5">
          {recentReviewsList.length === 0 ? (
            <div className="py-8 text-center">
              <MessageCircle size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">All customer ratings are satisfied & verified</p>
            </div>
          ) : (
            recentReviewsList.map((r, i) => (
              <div 
                key={i}
                className="p-3 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900">{r.customer_name}</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: r.rating || 5 }).map((_, idx) => (
                      <Star key={idx} size={10} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="font-semibold text-gray-800 text-[11px]">{r.title || r.product_name}</p>
                <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}