import API from '../../../utils/apiConfig';

const wishlistAPI = {
    // Get wishlist
    getWishlist: (params) =>
        API.get('catalog/wishlist/', { params }),
    
    // Add to wishlist
    addToWishlist: (productId) =>
        API.post('catalog/wishlist/add/', { product_id: productId }),
    
    // Remove from wishlist
    removeFromWishlist: (productId) =>
        API.delete('catalog/wishlist/remove/', { data: { product_id: productId } }),
    
    // Bulk add to wishlist
    bulkAddToWishlist: (productIds) =>
        API.post('catalog/wishlist/bulk-add/', { product_ids: productIds }),
    
    // Get wishlist stats
    getWishlistStats: () =>
        API.get('catalog/wishlist/stats/'),
};

export default wishlistAPI;