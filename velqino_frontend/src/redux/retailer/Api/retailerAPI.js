import API from '../../../utils/apiConfig';

const retailerAPI = {
    // Retailer Registration
    registerRetailer: (data) =>
        API.post('identity/retailer/register/', data),
    
    // Retailer Login
    loginRetailer: (data) =>
        API.post('identity/retailer/login/', data),
    
    // Get Retailer Profile
    getRetailerProfile: (userId) =>
        API.get(`identity/retailer/profile/${userId}/`),
    
    // Update Retailer Profile
    updateRetailerProfile: (userId, data) =>
        API.put(`identity/retailer/profile/${userId}/update/`, data),
    
    // List all retailers (admin only)
    listRetailers: () =>
        API.get('identity/retailers/list/'),
};

export default retailerAPI;