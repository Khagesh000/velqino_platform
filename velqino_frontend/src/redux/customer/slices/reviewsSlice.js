import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import reviewsAPI from '../Api/reviewsAPI';

export const reviewsApi = createApi({
    reducerPath: 'reviewsApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Reviews', 'ReviewSummary'],
    endpoints: (builder) => ({
        // Get product reviews (public)
        getProductReviews: builder.query({
            async queryFn({ productId, page = 1, per_page = 10 }) {
                try {
                    const response = await reviewsAPI.getProductReviews(productId, { page, per_page });
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: (result, error, { productId }) => [{ type: 'Reviews', id: productId }]
        }),
        
        // Get product review summary (public)
        getProductReviewsSummary: builder.query({
            async queryFn(productId) {
                try {
                    const response = await reviewsAPI.getProductReviewsSummary(productId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: (result, error, productId) => [{ type: 'ReviewSummary', id: productId }]
        }),
        
        // Create review (authenticated)
        createReview: builder.mutation({
            async queryFn(reviewData) {
                try {
                    const response = await reviewsAPI.createReview(reviewData);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: (result, error, { product_id }) => [
                { type: 'Reviews', id: product_id },
                { type: 'ReviewSummary', id: product_id }
            ]
        }),
        
        // Update review (authenticated)
        updateReview: builder.mutation({
            async queryFn({ reviewId, data }) {
                try {
                    const response = await reviewsAPI.updateReview(reviewId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: (result, error, { product_id }) => [
                { type: 'Reviews', id: product_id },
                { type: 'ReviewSummary', id: product_id }
            ]
        }),
        
        // Delete review (authenticated)
        deleteReview: builder.mutation({
            async queryFn({ reviewId, productId }) {
                try {
                    const response = await reviewsAPI.deleteReview(reviewId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: (result, error, { productId }) => [
                { type: 'Reviews', id: productId },
                { type: 'ReviewSummary', id: productId }
            ]
        }),
        
        // Mark review as helpful (authenticated)
        markReviewHelpful: builder.mutation({
            async queryFn(reviewId) {
                try {
                    const response = await reviewsAPI.markReviewHelpful(reviewId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['Reviews']
        }),
    }),
});

export const {
    useGetProductReviewsQuery,
    useGetProductReviewsSummaryQuery,
    useCreateReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
    useMarkReviewHelpfulMutation,
} = reviewsApi;