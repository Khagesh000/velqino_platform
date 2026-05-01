import API from '../../../utils/apiConfig';

const customerAPI = {
    // Customer Registration
    registerCustomer: (data) =>
        API.post('identity/customer/register/', data),
    
    // Customer Login
    loginCustomer: (data) =>
        API.post('identity/customer/login/', data),
    
    // Get Customer Profile
    getCustomerProfile: (userId) =>
        API.get(`identity/customer/profile/${userId}/`),
    
    // Update Customer Profile
    updateCustomerProfile: (userId, data) =>
        API.put(`identity/customer/profile/${userId}/update/`, data),
    
    // List all customers (admin only)
    listCustomers: () =>
        API.get('identity/customers/list/'),

    changePassword: (data) =>
        API.post('identity/change-password/', data),

    getProfile: (userId, userRole) =>
        API.get(`identity/${userRole}/profile/${userId}/`),

    updateProfile: (userId, userRole, data) =>
        API.put(`identity/${userRole}/profile/${userId}/update/`, data),

    mergeCart: (sessionId) => 
    API.post('commerce/cart/merge/', {}, {
        headers: { 'X-Session-ID': sessionId }
    }),
};

export default customerAPI;