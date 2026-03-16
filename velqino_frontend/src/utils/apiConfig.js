import axios from 'axios';

const BASE_URL =  'http://localhost:8000/api/';

const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
API.interceptors.request.use(
    (config) => {
        // Get token from localStorage (or cookies based on your auth setup)
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle token refresh on 401 error
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${BASE_URL}token/refresh/`, {
                        refresh: refreshToken
                    });
                    
                    if (response.data.access) {
                        localStorage.setItem('accessToken', response.data.access);
                        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                        return API(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Redirect to login if refresh fails
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default API;