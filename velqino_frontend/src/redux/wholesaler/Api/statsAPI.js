import API from '../../../utils/apiConfig';

const statsAPI = {
    // Wholesaler Dashboard Stats
    getWholesalerStats: (params) =>
    API.get('analytics/wholesaler/stats/', { params }),
    
    getOrderStats: () =>
        API.get('analytics/wholesaler/order-stats/'),
    
    getRevenueStats: () =>
        API.get('analytics/wholesaler/revenue-stats/'),
    
    getProductStats: () =>
        API.get('analytics/wholesaler/product-stats/'),

    getSalesAnalytics: (period = 'weekly') =>
        API.get(`analytics/wholesaler/sales-analytics/?period=${period}`),

    getCategoryPerformance: () =>
    API.get('analytics/wholesaler/category-performance/'),

    getLowStockAlerts: (params) =>
    API.get('analytics/wholesaler/low-stock-alerts/', { params }),

    getRecentOrders: (params) =>
    API.get('analytics/wholesaler/recent-orders/', { params }),

    getRecentActivity: (params) =>
    API.get('analytics/wholesaler/recent-activity/', { params }),

    getTopCustomers: (params) =>
    API.get('analytics/wholesaler/top-customers/', { params }),

    getPendingTasks: (params) =>
    API.get('analytics/wholesaler/pending-tasks/', { params }),

    getWithdrawalStats: () =>
    API.get('analytics/wholesaler/withdrawal-stats/'),

    getTopProducts: () =>
    API.get('analytics/wholesaler/top-products/'),

    getGeographicSales: () =>
        API.get('analytics/wholesaler/geo-sales/'),

    getHourlySales: () =>
        API.get('analytics/wholesaler/hourly-sales/'),

    exportReport: (params) =>
    API.get('analytics/wholesaler/export-report/', { 
        params,
        responseType: 'blob' 
    }),
};

export default statsAPI;