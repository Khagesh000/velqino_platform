import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import cartAPI from '../Api/cartAPI';

export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Cart'],
    endpoints: (builder) => ({
        // Get cart
        getCart: builder.query({
            async queryFn() {
                try {
                    const response = await cartAPI.getCart();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['Cart']
        }),
        
        // Add to cart
        addToCart: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await cartAPI.addToCart(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Cart']
        }),
        
        // Update cart item quantity
        updateCartItem: builder.mutation({
            async queryFn({ itemId, quantity }) {
                try {
                    const response = await cartAPI.updateCartItem(itemId, { quantity });
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Cart']
        }),
        
        // Remove cart item
        removeCartItem: builder.mutation({
            async queryFn(itemId) {
                try {
                    const response = await cartAPI.removeCartItem(itemId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Cart']
        }),
        
        // Apply coupon
        applyCoupon: builder.mutation({
            async queryFn(couponCode) {
                try {
                    const response = await cartAPI.applyCoupon({ coupon_code: couponCode });
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Cart']
        }),
        
        // Remove coupon
        removeCoupon: builder.mutation({
            async queryFn() {
                try {
                    const response = await cartAPI.removeCoupon();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Cart']
        }),
        
        // Clear cart
        clearCart: builder.mutation({
            async queryFn() {
                try {
                    const response = await cartAPI.clearCart();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Cart']
        }),
    })
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveCartItemMutation,
    useApplyCouponMutation,
    useRemoveCouponMutation,
    useClearCartMutation,
} = cartApi;