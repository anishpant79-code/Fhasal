import axios from 'axios'

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
})

// Attach the login token to protected requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('fhasal-token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// Central response interceptor for session expiry handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            const currentPath = window.location.pathname
            if (
                currentPath !== '/login' &&
                currentPath !== '/signup' &&
                currentPath !== '/' &&
                currentPath !== '/forgot-password' &&
                currentPath !== '/reset-password'
            ) {
                localStorage.removeItem('fhasal-token')
                localStorage.removeItem('fhasal-auth')
                window.dispatchEvent(new Event('fhasal-auth-changed'))
            }
        }
        return Promise.reject(error)
    }
)

export default API
