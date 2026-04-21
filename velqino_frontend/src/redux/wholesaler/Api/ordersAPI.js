import API from '../../../utils/apiConfig';

const ordersAPI = {
    // Create new order
    createOrder: (data) =>
        API.post('commerce/orders/create/', data),
    
    // Get user orders
    getOrders: () =>
        API.get('commerce/orders/'),
    
    // Get single order details
    getOrder: (orderId) =>
        API.get(`commerce/orders/${orderId}/`),
    
    // Cancel order
    cancelOrder: (orderId) =>
        API.post(`commerce/orders/${orderId}/cancel/`),
    
    // Track order
    trackOrder: (orderId) =>
        API.get(`commerce/orders/${orderId}/track/`),
};

export default ordersAPI;