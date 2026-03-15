import API from '../../../utils/apiConfig';

const wholesalerAPI = {
    register: (data) => API.post('wholesaler/register/', data),
    getProfile: (userId) => API.get(`wholesaler/profile/${userId}/`),
    updateProfile: (userId, data) => API.put(`wholesaler/profile/${userId}/update/`, data),
    deleteProfile: (userId) => API.delete(`wholesaler/profile/${userId}/delete/`),
    getAll: (params) => API.get('wholesalers/', { params })
};

export default wholesalerAPI;