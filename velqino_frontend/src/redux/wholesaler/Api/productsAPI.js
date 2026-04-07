import API from '../../../utils/apiConfig';

const productsAPI = {

    // ===============================
    // 📦 PRODUCTS (Basic CRUD)
    // ===============================
    getProducts: (params) =>
        API.get('catalog/products/', { params }),

    getProduct: (productId) =>
        API.get(`catalog/products/${productId}/`),

    createProduct: (data) =>
  API.post('catalog/products/', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

    updateProduct: (productId, data) =>
        API.put(`catalog/products/${productId}/`, data),

    deleteProduct: (productId) =>
        API.delete(`catalog/products/${productId}/`),

    // ===============================
    // 📊 SPECIAL
    // ===============================
    getLowStockProducts: () =>
        API.get('catalog/products/low-stock/'),

    bulkAction: (data) =>
    API.post('catalog/products/bulk/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // ===============================
    // 🗂️ CATEGORIES
    // ===============================
    getCategories: () =>
        API.get('catalog/categories/'),

    // ===============================
    // 🖼️ BULK IMAGE UPLOAD
    // ===============================
    bulkImageUpload: (formData) =>
  API.post('catalog/products/bulk-upload-images/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

    // ===============================
    // 🎥 BULK VIDEO UPLOAD (MAIN FEATURE)
    // ===============================
    bulkVideoUpload: (formData) =>
  API.post('catalog/products/bulk-upload-video/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  exportProducts: (data) =>
    API.post('catalog/products/export/', data, {
        responseType: 'blob'
    }),

};

export default productsAPI;