import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import retailerReportsAPI from '../Api/retailerReportsAPI';

export const retailerReportsApi = createApi({
    reducerPath: 'retailerReportsApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Expenses', 'GSTReturns', 'ScheduledReports', 'COGS'],
    endpoints: (builder) => ({

        // ========== COGS ==========
        getCOGS: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerReportsAPI.getCOGS(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['COGS']
        }),

        // ========== EXPENSES ==========
        getExpenses: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerReportsAPI.getExpenses(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['Expenses']
        }),

        createExpense: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerReportsAPI.createExpense(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['Expenses']
        }),

        updateExpense: builder.mutation({
            async queryFn({ expenseId, data }) {
                try {
                    const response = await retailerReportsAPI.updateExpense(expenseId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['Expenses']
        }),

        deleteExpense: builder.mutation({
            async queryFn(expenseId) {
                try {
                    const response = await retailerReportsAPI.deleteExpense(expenseId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['Expenses']
        }),

        getExpenseByCategory: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerReportsAPI.getExpenseByCategory(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['Expenses']
        }),

        // ========== TAX ==========
        getTaxSummary: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerReportsAPI.getTaxSummary(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['GSTReturns']
        }),

        getGSTReturns: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerReportsAPI.getGSTReturns(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['GSTReturns']
        }),

        fileGSTReturn: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerReportsAPI.fileGSTReturn(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['GSTReturns']
        }),

        // ========== EXPORT OPTIONS ==========
        exportReport: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerReportsAPI.exportReport(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
        }),

        emailReport: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerReportsAPI.emailReport(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
        }),

        getScheduledReports: builder.query({
            async queryFn() {
                try {
                    const response = await retailerReportsAPI.getScheduledReports();
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['ScheduledReports']
        }),

        createScheduledReport: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerReportsAPI.createScheduledReport(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['ScheduledReports']
        }),

        updateScheduledReport: builder.mutation({
            async queryFn({ reportId, data }) {
                try {
                    const response = await retailerReportsAPI.updateScheduledReport(reportId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['ScheduledReports']
        }),

        deleteScheduledReport: builder.mutation({
            async queryFn(reportId) {
                try {
                    const response = await retailerReportsAPI.deleteScheduledReport(reportId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['ScheduledReports']
        }),
    }),
});

// Export hooks
export const {
    // COGS
    useGetCOGSQuery,
    // Expenses
    useGetExpensesQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,
    useGetExpenseByCategoryQuery,
    // Tax
    useGetTaxSummaryQuery,
    useGetGSTReturnsQuery,
    useFileGSTReturnMutation,
    // Export
    useExportReportMutation,
    useEmailReportMutation,
    useGetScheduledReportsQuery,
    useCreateScheduledReportMutation,
    useUpdateScheduledReportMutation,
    useDeleteScheduledReportMutation,
} = retailerReportsApi;