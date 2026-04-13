// api/categoriesAPI.js
import API from '../../../utils/apiConfig';

const categoriesAPI = {

    // ===============================
    // 🗂️ CATEGORIES
    // ===============================
    getCategories: () =>
        API.get('catalog/categories/'),

    getCategory: (categoryId) =>
        API.get(`catalog/categories/${categoryId}/`),

    createCategory: (data) =>
        API.post('catalog/categories/', data),

    updateCategory: (categoryId, data) =>
        API.put(`catalog/categories/${categoryId}/`, data),

    deleteCategory: (categoryId) =>
        API.delete(`catalog/categories/${categoryId}/`),

    reorderCategories: (data) =>
        API.post('catalog/categories/reorder/', data),
};

export default categoriesAPI;