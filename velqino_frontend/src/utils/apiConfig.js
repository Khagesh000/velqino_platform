import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/';
const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

// ✅ Generate or get persistent session_id
const getSessionId = () => {
    if (typeof window === 'undefined') return null;
    
    let sessionId = localStorage.getItem('guest_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('guest_session_id', sessionId);
        console.log('🆕 [SESSION] Created NEW session_id:', sessionId);
    } else {
        console.log('♻️ [SESSION] Using EXISTING session_id:', sessionId);
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
        console.log(`🚀 [REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
        
        // ✅ ALWAYS add session_id for EVERY request (no conditions)
        const sessionId = getSessionId();
        if (sessionId) {
            config.headers['X-Session-ID'] = sessionId;
            console.log(`✅ [HEADER] X-Session-ID: ${sessionId}`);
        } else {
            console.log('❌ [ERROR] No session_id available');
        }
        
        // Add auth token if user is logged in
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`✅ [HEADER] Authorization: Bearer ${token.substring(0, 20)}...`);
        }
        
        console.log(`📡 [FINAL] Headers:`, config.headers);
        return config;
    },
    (error) => {
        console.error('❌ [REQUEST ERROR]', error);
        return Promise.reject(error);
    }
);

// ✅ Response interceptor
API.interceptors.response.use(
    (response) => {
        console.log(`✅ [RESPONSE] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
        return response;
    },
    async (error) => {
        console.error(`❌ [RESPONSE ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${error.response?.status}`);
        
        const originalRequest = error.config;

        // Handle token refresh on 401 error
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('🔄 [REFRESH] Attempting to refresh token...');
            
            try {
                const refreshToken = localStorage.getItem('refresh');
                if (refreshToken) {
                    const response = await axios.post(`${BASE_URL}token/refresh/`, {
                        refresh: refreshToken
                    });
                    
                    if (response.data.access) {
                        localStorage.setItem('access', response.data.access);
                        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                        console.log('✅ [REFRESH] Token refreshed successfully');
                        return API(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('❌ [REFRESH] Failed to refresh token');
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