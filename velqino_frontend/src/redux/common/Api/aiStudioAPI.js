import API from '@/utils/apiConfig';

const aiStudioAPI = {
  // Fetch curated AI human models with angles & skin tones
  getModels: (params) => API.get('intelligence/models/', { params }),

  // Fetch single model detail
  getModel: (slug) => API.get(`intelligence/models/${slug}/`),

  // Update model attributes or set default (PATCH)
  updateModel: (slug, data) => API.patch(`intelligence/models/${slug}/`, data),

  // Generate virtual photoshoot across multi-angles
  generateTryOn: (data) => {
    const config = data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return API.post('intelligence/generate-tryon/', data, config);
  },

  // Get session status and renders
  getSession: (sessionId) => API.get(`intelligence/sessions/${sessionId}/`),

  // Get recent photoshoot history
  getHistory: (sellerType) => API.get('intelligence/history/', { params: { seller_type: sellerType } }),

  // Attach rendered photoshoot angles to a product in catalog
  exportToProduct: (data) => API.post('intelligence/export-product/', data),

  // Fetch seller inventory products for 1-click garment testing
  getCatalogProducts: () => API.get('catalog/products/'),
};

export default aiStudioAPI;
