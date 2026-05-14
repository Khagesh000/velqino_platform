import API from '../../../utils/apiConfig';

const retailerProductsAPI = {
    // ========== SINGLE PRODUCT ==========
    getProducts: (params) => API.get('catalog/retailer/products/', { params }),
    getProduct: (productId) => API.get(`catalog/retailer/products/${productId}/`),
    createProduct: (data) => {
    // If data is FormData, don't set Content-Type header
    const config = data instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
    
    return API.post('catalog/retailer/products/', data, config);
},
    updateProduct: (productId, data) => API.put(`catalog/retailer/products/${productId}/`, data),
    deleteProduct: (productId) => API.delete(`catalog/retailer/products/${productId}/`),
    
    // ========== BULK IMAGES ==========
    bulkImagesSame: (data) => {
    // ✅ If data is FormData, don't set Content-Type header
    const config = data instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
    return API.post('catalog/retailer/bulk-images/same/', data, config);
    },
    bulkImagesDifferent: (data) => API.post('catalog/retailer/bulk-images/different/', data),
    getBulkStatus: (taskId) => API.get(`catalog/retailer/bulk-status/${taskId}/`),
    
    // ========== BULK VIDEO ==========
    bulkVideo: (data) => {
    // ✅ If data is FormData, don't set Content-Type header
    const config = data instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
    return API.post('catalog/retailer/bulk-video/', data, config);
    },
    getVideoStatus: (taskId) => API.get(`catalog/retailer/bulk-video-status/${taskId}/`),
    
    // ========== BULK EDIT & DELETE ==========
    bulkEdit: (data) => API.post('catalog/retailer/products/bulk-edit/', data),
    bulkDelete: (data) => API.delete('catalog/retailer/products/bulk-delete/', { data }),

    // ========== IMPORT ==========
    importProducts: (data) => API.post('catalog/retailer/products/import/', data),

    // ========== EXPORT ==========
    exportProducts: (params) => API.get('catalog/retailer/products/export/', { params }),
};

export default retailerProductsAPI;