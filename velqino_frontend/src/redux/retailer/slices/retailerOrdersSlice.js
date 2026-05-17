import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import retailerOrdersAPI from '../Api/retailerOrdersAPI';

export const retailerOrdersApi = createApi({
    reducerPath: 'retailerOrdersApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['RetailerOrders', 'RetailerOrder', 'RetailerCustomers'],
    
    endpoints: (builder) => ({
        // Get all retailer orders
        getRetailerOrders: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerOrdersAPI.getRetailerOrders(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: (result) => 
                result?.data?.orders 
                    ? [...result.data.orders.map(o => ({ type: 'RetailerOrders', id: o.id })), { type: 'RetailerOrders', id: 'LIST' }]
                    : [{ type: 'RetailerOrders', id: 'LIST' }],
        }),
        
        // Get single order
        getRetailerOrder: builder.query({
            async queryFn(orderId) {
                try {
                    const response = await retailerOrdersAPI.getOrder(orderId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: (result, error, orderId) => [{ type: 'RetailerOrder', id: orderId }],
        }),
        
        // Update order status
        updateOrderStatus: builder.mutation({
            async queryFn({ orderId, data }) {
                try {
                    const response = await retailerOrdersAPI.updateOrderStatus(orderId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: (result, error, { orderId }) => [
                { type: 'RetailerOrders', id: 'LIST' },
                { type: 'RetailerOrder', id: orderId },
            ],
        }),
        
        // Cancel order
        cancelOrder: builder.mutation({
            async queryFn(orderId) {
                try {
                    const response = await retailerOrdersAPI.cancelOrder(orderId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: (result, error, orderId) => [
                { type: 'RetailerOrders', id: 'LIST' },
                { type: 'RetailerOrder', id: orderId },
            ],
        }),
        
        // Get order status history
        getOrderStatusHistory: builder.query({
            async queryFn(orderId) {
                try {
                    const response = await retailerOrdersAPI.getOrderStatusHistory(orderId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
        }),
        
        // Download invoice
        downloadInvoice: builder.mutation({
            async queryFn(orderId) {
                try {
                    const response = await retailerOrdersAPI.downloadInvoice(orderId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
        }),
        
        // Get retailer customers
        getRetailerCustomers: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerOrdersAPI.getRetailerCustomers(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['RetailerCustomers'],
        }),
        
        // Bulk order action
        bulkOrderAction: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerOrdersAPI.bulkOrderAction(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: [{ type: 'RetailerOrders', id: 'LIST' }],
        }),
    }),
});

// Export hooks
export const {
    useGetRetailerOrdersQuery,
    useGetRetailerOrderQuery,
    useUpdateOrderStatusMutation,
    useCancelOrderMutation,
    useGetOrderStatusHistoryQuery,
    useDownloadInvoiceMutation,
    useGetRetailerCustomersQuery,
    useBulkOrderActionMutation,
} = retailerOrdersApi;