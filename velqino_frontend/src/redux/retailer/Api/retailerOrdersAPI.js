import API from '../../../utils/apiConfig';

const retailerOrdersAPI = {
    // Get all retailer orders
    getRetailerOrders: (params) => API.get('commerce/orders/retailer/list/', { params }),
    
    // Get single order details
    getOrder: (orderId) => API.get(`commerce/orders/${orderId}/`),
    
    // Update order status
    updateOrderStatus: (orderId, data) => API.put(`commerce/orders/${orderId}/status/`, data),
    
    // Cancel order
    cancelOrder: (orderId) => API.post(`commerce/orders/${orderId}/cancel/`),
    
    // Get order status history
    getOrderStatusHistory: (orderId) => API.get(`commerce/orders/${orderId}/status-history/`),
    
    // Download invoice
    downloadInvoice: (orderId) => API.get(`commerce/orders/${orderId}/invoice/`, { responseType: 'blob' }),
    
    // Get retailer customers
    getRetailerCustomers: (params) => API.get('commerce/retailer/customers/', { params }),
    
    // Bulk order actions
    bulkOrderAction: (data) => API.post('commerce/orders/bulk/', data),

     getRetailerReturns: () => API.get('commerce/retailer/returns/'),
    
    // Create return request
    createReturnRequest: (data) => API.post('commerce/returns/create/', data),
    
    // Update return status
    updateReturnStatus: (returnId, data) => API.post(`commerce/returns/${returnId}/status/`, data),
};

export default retailerOrdersAPI;