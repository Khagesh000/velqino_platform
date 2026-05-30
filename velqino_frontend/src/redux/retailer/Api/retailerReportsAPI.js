import API from "@/utils/apiConfig";

const retailerReportsAPI = {
    // ========== COGS (Product Report) ==========
    getCOGS: (params) => API.get('analytics/retailer/cogs/', { params }),

    // ========== EXPENSES (Profit & Loss) ==========
    getExpenses: (params) => API.get('commerce/expenses/retailer/list/', { params }),
    createExpense: (data) => API.post('commerce/expenses/retailer/create/', data),
    updateExpense: (expenseId, data) => API.put(`commerce/expenses/retailer/${expenseId}/update/`, data),
    deleteExpense: (expenseId) => API.delete(`commerce/expenses/retailer/${expenseId}/delete/`),
    getExpenseByCategory: (params) => API.get('commerce/expenses/retailer/by-category/', { params }),

    // ========== TAX (Tax Report) ==========
    getTaxSummary: (params) => API.get('analytics/retailer/tax-summary/', { params }),
    getGSTReturns: (params) => API.get('analytics/retailer/gst-returns/', { params }),
    fileGSTReturn: (data) => API.post('analytics/retailer/gst-returns/file/', data),

    // ========== EXPORT OPTIONS ==========
    exportReport: (data) => API.post('analytics/retailer/export/', data, { responseType: 'blob' }),
    emailReport: (data) => API.post('analytics/retailer/export/email/', data),
    getScheduledReports: () => API.get('analytics/retailer/scheduled-reports/'),
    createScheduledReport: (data) => API.post('analytics/retailer/scheduled-reports/create/', data),
    updateScheduledReport: (reportId, data) => API.put(`analytics/retailer/scheduled-reports/${reportId}/update/`, data),
    deleteScheduledReport: (reportId) => API.delete(`analytics/retailer/scheduled-reports/${reportId}/delete/`),
};

export default retailerReportsAPI;