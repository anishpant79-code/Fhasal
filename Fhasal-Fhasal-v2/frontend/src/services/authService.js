import API from './api'

export const authService = {
    async register(userData) {
        const response = await API.post('/auth/register', userData)
        return response.data
    },

    async login(credentials) {
        const response = await API.post('/auth/login', credentials)
        return response.data
    },

    async getMe() {
        const response = await API.get('/auth/me')
        return response.data
    },

    async updateProfile(profileData) {
        const response = await API.put('/auth/profile', profileData)
        return response.data
    },

    async changePassword(passwordData) {
        const response = await API.put('/auth/change-password', passwordData)
        return response.data
    },

    async forgotPassword(email) {
        const response = await API.post('/auth/forgot-password', { email })
        return response.data
    },

    async resetPassword(token, password) {
        const response = await API.post('/auth/reset-password', { token, password })
        return response.data
    },
}

export default authService
