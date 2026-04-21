import API from '../../../utils/apiConfig';

const cartAPI = {
    // Get cart
    getCart: () =>
        API.get('commerce/cart/'),
    
    // Add to cart
    addToCart: (data) =>
        API.post('commerce/cart/add/', data),
    
    // Update cart item
    updateCartItem: (itemId, data) =>
        API.put(`commerce/cart/item/${itemId}/`, data),
    
    // Remove cart item
    removeCartItem: (itemId) =>
        API.delete(`commerce/cart/item/${itemId}/remove/`),
    
    // Apply coupon
    applyCoupon: (data) =>
        API.post('commerce/cart/coupon/apply/', data),
    
    // Remove coupon
    removeCoupon: () =>
        API.delete('commerce/cart/coupon/remove/'),
    
    // Clear cart
    clearCart: () =>
        API.delete('commerce/cart/clear/'),
};

export default cartAPI;