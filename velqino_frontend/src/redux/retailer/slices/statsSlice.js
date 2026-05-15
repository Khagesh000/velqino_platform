import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import retailerStatsAPI from '../Api/statsAPI';

export const retailerStatsApi = createApi({
    reducerPath: 'retailerStatsApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['RetailerKPI', 'RetailerSales', 'RetailerProducts', 'RetailerCustomers', 'RetailerOrders', 'RetailerAlerts'],
    
    endpoints: (builder) => ({
        // KPI Stats - Dashboard cards
        getRetailerKPIStats: builder.query({
            async queryFn() {
                try {
                    const response = await retailerStatsAPI.getKPIStats();
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['RetailerKPI']
        }),
        
        // Daily Sales Chart
        getRetailerDailySales: builder.query({
            async queryFn() {
                try {
                    const response = await retailerStatsAPI.getDailySales();
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['RetailerSales']
        }),
        
        // Top Selling Products
        getRetailerTopProducts: builder.query({
            async queryFn() {
                try {
                    const response = await retailerStatsAPI.getTopProducts();
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['RetailerProducts']
        }),
        
        // Customer Activity (with filter)
        getRetailerCustomerActivity: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerStatsAPI.getCustomerActivity(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['RetailerCustomers']
        }),
        
        // Recent Transactions (with filter)
        getRetailerRecentTransactions: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerStatsAPI.getRecentTransactions(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['RetailerOrders']
        }),
        
        // Low Stock Alerts (with filter)
        getRetailerLowStockAlerts: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerStatsAPI.getLowStockAlerts(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['RetailerAlerts']
        }),
        
        // Today's Summary
        getRetailerTodaySummary: builder.query({
            async queryFn() {
                try {
                    const response = await retailerStatsAPI.getTodaySummary();
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['RetailerOrders']
        }),
        
        // Quick Reorder Suggestions
        getRetailerQuickReorder: builder.query({
            async queryFn() {
                try {
                    const response = await retailerStatsAPI.getQuickReorder();
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['RetailerProducts']
        }),
    }),
});

// Export all hooks
export const {
    useGetRetailerKPIStatsQuery,
    useGetRetailerDailySalesQuery,
    useGetRetailerTopProductsQuery,
    useGetRetailerCustomerActivityQuery,
    useGetRetailerRecentTransactionsQuery,
    useGetRetailerLowStockAlertsQuery,
    useGetRetailerTodaySummaryQuery,
    useGetRetailerQuickReorderQuery,
} = retailerStatsApi;