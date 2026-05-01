import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import wishlistAPI from '../Api/wishlistAPI';

export const wishlistApi = createApi({
    reducerPath: 'wishlistApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Wishlist', 'WishlistStats'],
    endpoints: (builder) => ({
        // Get wishlist
        getWishlist: builder.query({
            async queryFn(params = {}) {
                try {
                    const response = await wishlistAPI.getWishlist(params);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['Wishlist']
        }),
        
        // Add to wishlist
        addToWishlist: builder.mutation({
            async queryFn(productId) {
                try {
                    const response = await wishlistAPI.addToWishlist(productId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Wishlist', 'WishlistStats']
        }),
        
        // Remove from wishlist
        removeFromWishlist: builder.mutation({
            async queryFn(productId) {
                try {
                    const response = await wishlistAPI.removeFromWishlist(productId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Wishlist', 'WishlistStats']
        }),
        
        // Bulk add to wishlist
        bulkAddToWishlist: builder.mutation({
            async queryFn(productIds) {
                try {
                    const response = await wishlistAPI.bulkAddToWishlist(productIds);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Wishlist', 'WishlistStats']
        }),
        
        // Get wishlist stats
        getWishlistStats: builder.query({
            async queryFn() {
                try {
                    const response = await wishlistAPI.getWishlistStats();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['WishlistStats']
        }),
    })
});

export const {
    useGetWishlistQuery,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useBulkAddToWishlistMutation,
    useGetWishlistStatsQuery,
} = wishlistApi;