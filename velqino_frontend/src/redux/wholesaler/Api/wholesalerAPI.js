import API from '../../../utils/apiConfig';

const wholesalerAPI = {
    register: (data) => API.post('identity/wholesaler/register/', data),
    login: (data) => API.post('identity/wholesaler/login/', data),
    getProfile: (userId) => API.get(`identity/wholesaler/profile/${userId}/`),
    updateProfile: (userId, data) => API.put(`identity/wholesaler/profile/${userId}/update/`, data),
    deleteProfile: (userId) => API.delete(`identity/wholesaler/profile/${userId}/delete/`),
    getAll: (params) => API.get('identity/wholesalers/', { params }),
    changePassword: (data) => API.post('identity/change-password/', data),
};

export default wholesalerAPI;