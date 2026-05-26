import API from "@/utils/apiConfig";

const reviewsAPI = {
    // Public endpoints (no auth required)
    getProductReviews: (productId, params) => 
        API.get(`commerce/reviews/${productId}/`, { params }),
    
    getProductReviewsSummary: (productId) => 
        API.get(`commerce/reviews/${productId}/summary/`),
    
    // Authenticated endpoints
    createReview: (data) => 
        API.post('commerce/reviews/create/', data),
    
    updateReview: (reviewId, data) => 
        API.put(`commerce/reviews/${reviewId}/update/`, data),
    
    deleteReview: (reviewId) => 
        API.delete(`commerce/reviews/${reviewId}/delete/`),
    
    markReviewHelpful: (reviewId) => 
        API.post(`commerce/reviews/${reviewId}/helpful/`),
};

export default reviewsAPI;