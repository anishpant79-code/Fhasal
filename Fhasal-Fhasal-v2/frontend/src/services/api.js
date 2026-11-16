
import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Attach the login token to protected requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('fhasal-token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default API
