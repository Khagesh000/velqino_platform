import API from '../../../utils/apiConfig';

const wholesalerAPI = {
    register: (data) => API.post('identity/wholesaler/register/', data),
    getProfile: (userId) => API.get(`identity/wholesaler/profile/${userId}/`),
    updateProfile: (userId, data) => API.put(`identity/wholesaler/profile/${userId}/update/`, data),
    deleteProfile: (userId) => API.delete(`identity/wholesaler/profile/${userId}/delete/`),
    getAll: (params) => API.get('identity/wholesalers/', { params })
};

export default wholesalerAPI;