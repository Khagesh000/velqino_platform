import API from '../../../utils/apiConfig';

const ordersAPI = {
    // Create new order
    createOrder: (data) =>
        API.post('commerce/orders/create/', data),

    updateOrderStatus: (orderId, status) =>
        API.patch(`commerce/orders/${orderId}/status/`, { status }),

    updatePaymentStatus: (orderId, paymentStatus) =>
        API.patch(`commerce/orders/${orderId}/payment-status/`, { payment_status: paymentStatus }),
    
    // Get all user orders
    getOrders: (params) => API.get('commerce/orders/', { params }),
    
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