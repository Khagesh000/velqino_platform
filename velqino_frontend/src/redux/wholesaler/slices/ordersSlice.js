import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import ordersAPI from '../Api/ordersAPI';

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Orders', 'Order'],
    endpoints: (builder) => ({
        // Create order
        createOrder: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await ordersAPI.createOrder(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Orders', 'Cart']
        }),
        
        // Get all orders
        getOrders: builder.query({
            async queryFn() {
                try {
                    const response = await ordersAPI.getOrders();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['Orders']
        }),
        
        // Get single order
        getOrder: builder.query({
            async queryFn(orderId) {
                try {
                    const response = await ordersAPI.getOrder(orderId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: (result, error, id) => [{ type: 'Order', id }]
        }),
        
        // Cancel order
        cancelOrder: builder.mutation({
            async queryFn(orderId) {
                try {
                    const response = await ordersAPI.cancelOrder(orderId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Orders', 'Order']
        }),
        
        // Track order
        trackOrder: builder.query({
            async queryFn(orderId) {
                try {
                    const response = await ordersAPI.trackOrder(orderId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
        }),
    })
});

export const {
    useCreateOrderMutation,
    useGetOrdersQuery,
    useGetOrderQuery,
    useCancelOrderMutation,
    useTrackOrderQuery,
} = ordersApi;