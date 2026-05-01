import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import statsAPI from '../Api/statsAPI';

export const statsApi = createApi({
    reducerPath: 'statsApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Stats', 'OrderStats', 'RevenueStats', 'ProductStats', 'SalesAnalytics',
               'CategoryPerformance', 'LowStockAlerts', 'RecentOrders', 'RecentActivity',
               'TopCustomers', 'PendingTasks', 'WithdrawalStats', 'TopProducts', 'GeoSales',
               'HourlySales'
    ],
    endpoints: (builder) => ({
        // Wholesaler Dashboard Stats
        getWholesalerStats: builder.query({
            async queryFn(params) {
                try {
                    const response = await statsAPI.getWholesalerStats(params);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['Stats']
        }),
        
        // Order Statistics
        getOrderStats: builder.query({
            async queryFn() {
                try {
                    const response = await statsAPI.getOrderStats();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['OrderStats']
        }),
        
        // Revenue Statistics
        getRevenueStats: builder.query({
            async queryFn() {
                try {
                    const response = await statsAPI.getRevenueStats();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['RevenueStats']
        }),
        
        // Product Statistics
        getProductStats: builder.query({
            async queryFn() {
                try {
                    const response = await statsAPI.getProductStats();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['ProductStats']
        }),

        getSalesAnalytics: builder.query({
            async queryFn(period = 'weekly') {
                try {
                    const response = await statsAPI.getSalesAnalytics(period);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['SalesAnalytics']
        }),

        getCategoryPerformance: builder.query({
            async queryFn() {
                try {
                    const response = await statsAPI.getCategoryPerformance();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['CategoryPerformance']
        }),

        getLowStockAlerts: builder.query({
            async queryFn(params = { page: 1, per_page: 8 }) {
                try {
                    const response = await statsAPI.getLowStockAlerts(params);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['LowStockAlerts']
        }),

        getRecentOrders: builder.query({
                async queryFn(params = { page: 1, per_page: 10 }) {
                    try {
                        const response = await statsAPI.getRecentOrders(params);
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                providesTags: ['RecentOrders']
            }),

            getRecentActivity: builder.query({
                async queryFn(params = { page: 1, per_page: 8 }) {
                    try {
                        const response = await statsAPI.getRecentActivity(params);
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                providesTags: ['RecentActivity']
            }),

            getTopCustomers: builder.query({
                async queryFn(params = { page: 1, per_page: 6 }) {
                    try {
                        const response = await statsAPI.getTopCustomers(params);
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                providesTags: ['TopCustomers']
            }),

            getPendingTasks: builder.query({
                async queryFn(params = { page: 1, per_page: 8, type: 'all' }) {
                    try {
                        const response = await statsAPI.getPendingTasks(params);
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                providesTags: ['PendingTasks']
            }),
            getWithdrawalStats: builder.query({
                async queryFn() {
                    try {
                        const response = await statsAPI.getWithdrawalStats();
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                providesTags: ['WithdrawalStats']
            }),

            getTopProducts: builder.query({
                async queryFn() {
                    try {
                        const response = await statsAPI.getTopProducts();
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                providesTags: ['TopProducts']
            }),

            getGeographicSales: builder.query({
                async queryFn() {
                    try {
                        const response = await statsAPI.getGeographicSales();
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                providesTags: ['GeoSales']
            }),

            getHourlySales: builder.query({
                async queryFn() {
                    try {
                        const response = await statsAPI.getHourlySales();
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                providesTags: ['HourlySales']
            }),

            exportReport: builder.mutation({
                async queryFn(params) {
                    try {
                        const response = await statsAPI.exportReport(params);
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
            }),


    })
});

export const {
    useGetWholesalerStatsQuery,
    useGetOrderStatsQuery,
    useGetRevenueStatsQuery,
    useGetProductStatsQuery,

    useGetSalesAnalyticsQuery,
    useGetCategoryPerformanceQuery,
    useGetLowStockAlertsQuery,
    useGetRecentOrdersQuery,
    useGetRecentActivityQuery,
    useGetTopCustomersQuery,
    useGetPendingTasksQuery,
    useGetWithdrawalStatsQuery,
    useGetTopProductsQuery,
    useGetGeographicSalesQuery,
    useGetHourlySalesQuery,

    useExportReportMutation,
} = statsApi;