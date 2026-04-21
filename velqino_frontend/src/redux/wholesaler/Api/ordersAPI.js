import API from '../../../utils/apiConfig';

const ordersAPI = {
    // Create new order
    createOrder: (data) =>
        API.post('commerce/orders/create/', data),
    
    // Get all user orders
    getOrders: () =>
        API.get('commerce/orders/'),
    
    // Get single order by ID or order number
    getOrder: (orderId) =>
        API.get(`commerce/orders/${orderId}/`),
    
    // Cancel order
    cancelOrder: (orderId) =>
        API.post(`commerce/orders/${orderId}/cancel/`),
    
    // Track order
    trackOrder: (orderId) =>
        API.get(`commerce/orders/${orderId}/track/`),
    
    // Download invoice
    downloadInvoice: (orderId) =>
        API.get(`commerce/orders/${orderId}/invoice/`, {
            responseType: 'blob'
        }),
    
    // Return order
    returnOrder: (orderId, data) =>
        API.post(`commerce/orders/${orderId}/return/`, data),
};

export default ordersAPI;