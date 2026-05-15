import API from '../../../utils/apiConfig';

const retailerStatsAPI = {
    // KPI Stats
    getKPIStats: () => API.get('analytics/retailer/kpi-stats/'),
    
    // Daily Sales Chart
    getDailySales: () => API.get('analytics/retailer/daily-sales/'),
    
    // Top Selling Products
    getTopProducts: () => API.get('analytics/retailer/top-products/'),
    
    // Customer Activity
    getCustomerActivity: (params) => API.get('analytics/retailer/customer-activity/', { params }),
    
    // Recent Transactions
    getRecentTransactions: (params) => API.get('analytics/retailer/recent-transactions/', { params }),
    
    // Low Stock Alerts
    getLowStockAlerts: (params) => API.get('analytics/retailer/low-stock-alerts/', { params }),
    
    // Today's Summary
    getTodaySummary: () => API.get('analytics/retailer/today-summary/'),
    
    // Quick Reorder
    getQuickReorder: () => API.get('analytics/retailer/quick-reorder/'),
};

export default retailerStatsAPI;