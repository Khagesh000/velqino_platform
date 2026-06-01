import axios from 'axios';

//const BASE_URL = 'http://localhost:8000/api/';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/` : 'http://localhost:8000/api/';
//const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
const BASE_IMAGE_URL = '';
// ✅ Generate or get persistent session_id
const getSessionId = () => {
    if (typeof window === 'undefined') return null;
    
    let sessionId = localStorage.getItem('guest_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('guest_session_id', sessionId);  
    } else {
    }
    return sessionId;
};

const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Request interceptor - Add session_id to EVERY request
API.interceptors.request.use(
    (config) => {
        
        // ✅ ALWAYS add session_id for EVERY request (no conditions)
        const sessionId = getSessionId();
        if (sessionId) {
            config.headers['X-Session-ID'] = sessionId;
        } else {
            console.log('❌ [ERROR] No session_id available');
        }
        
        // Add auth token if user is logged in
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ✅ Response interceptor
API.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        
        const originalRequest = error.config;

        // Handle token refresh on 401 error
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh');
                if (refreshToken) {
                    const response = await axios.post(`${BASE_URL}token/refresh/`, {
                        refresh: refreshToken
                    });
                    
                    if (response.data.access) {
                        localStorage.setItem('access', response.data.access);
                        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                       
                        return API(originalRequest);
                    }
                }
            } catch (refreshError) {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }
                return Promise.reject(refreshError);
            }
        }
        
        // Handle CORS errors
        if (error.message === 'Network Error') {
            console.error('🌐 [CORS ERROR] Check if backend allows X-Session-ID header');
            console.error('   Add to Django settings.py: CORS_ALLOW_HEADERS = [..., "x-session-id"]');
        }
        
        return Promise.reject(error);
    }
);

export { BASE_IMAGE_URL };
export default API;