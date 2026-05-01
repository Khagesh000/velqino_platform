import API from '../../../utils/apiConfig';

const retailerAPI = {
    registerRetailer: (data) => API.post('identity/retailer/register/', data),
    
    loginRetailer: (data) => API.post('identity/retailer/login/', data),
    
    getRetailerProfile: (userId) => API.get(`identity/retailer/profile/${userId}/`),
    
    updateRetailerProfile: (userId, data) => API.put(`identity/retailer/profile/${userId}/update/`, data),

    blockRetailer: (userId) => API.post(`identity/retailer/profile/${userId}/block/`),

    unblockRetailer: (userId) => API.post(`identity/retailer/profile/${userId}/unblock/`),
    
    // ✅ FIXED - Accepts params and builds query string
    listRetailers: (params = {}) => {
        console.log('📤 listRetailers called with params:', params);
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `identity/retailers/list/?${queryString}` : 'identity/retailers/list/';
        console.log('📍 Final URL:', url);
        return API.get(url);
    },
};

export default retailerAPI;