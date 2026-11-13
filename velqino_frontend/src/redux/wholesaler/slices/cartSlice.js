import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import cartAPI from '../Api/cartAPI';

const formatError = (error, defaultMsg = 'Request failed') => ({
    error: {
        status: error?.response?.status || 500,
        data: error?.response?.data || error?.message || defaultMsg,
    }
});

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
                    return formatError(error, 'Failed to fetch cart');
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
                    return formatError(error, 'Failed to add item to cart');
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
                    return formatError(error, 'Failed to update cart item');
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
                    return formatError(error, 'Failed to remove cart item');
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
                    return formatError(error, 'Failed to apply coupon');
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
                    return formatError(error, 'Failed to remove coupon');
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
                    return formatError(error, 'Failed to clear cart');
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