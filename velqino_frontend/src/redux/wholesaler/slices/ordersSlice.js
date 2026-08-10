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
            invalidatesTags: ['Orders']
        }),

        updateOrderStatus: builder.mutation({
            async queryFn({ orderId, status }) {
                try {
                    const response = await ordersAPI.updateOrderStatus(orderId, status);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Orders']
        }),

        updatePaymentStatus: builder.mutation({
        async queryFn({ orderId, paymentStatus }) {
            try {
                const response = await ordersAPI.updatePaymentStatus(orderId, paymentStatus);
                return { data: response.data };
            } catch (error) {
                return { error };
            }
        },
        invalidatesTags: ['Orders']
    }),
        
        getOrders: builder.query({
    async queryFn(params) {
        try {
            console.log('📤 ordersSlice.getOrders called with params:', params);
            // ✅ Make sure we pass the params to the API
            const response = await ordersAPI.getOrders(params || {});
            return { data: response.data };
        } catch (error) {
            console.error('❌ Error:', error);
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
            providesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }]
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
        
        downloadInvoice: builder.mutation({
            async queryFn(orderId) {
                try {
                    const response = await ordersAPI.downloadInvoice(orderId);
                    // Handle blob here, never store it in Redux
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `invoice-${orderId}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                    return { data: { success: true, orderId } };
                } catch (error) {
                    return { error: { status: error.response?.status, message: error.message } };
                }
            },
        }),
        
        // Return order
        returnOrder: builder.mutation({
            async queryFn({ orderId, data }) {
                try {
                    const response = await ordersAPI.returnOrder(orderId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Orders', 'Order']
        }),
    })
});

export const {
    useCreateOrderMutation,
    useUpdateOrderStatusMutation,
    useUpdatePaymentStatusMutation,
    useGetOrdersQuery,
    useGetOrderQuery,
    useCancelOrderMutation,
    useTrackOrderQuery,
    useDownloadInvoiceMutation,
    useReturnOrderMutation,
} = ordersApi;