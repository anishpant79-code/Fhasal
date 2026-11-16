import API from './api'

export const farmService = {
    async getFields() {
        const response = await API.get('/fields')
        return response.data
    },

    async getFieldById(id) {
        const response = await API.get(`/fields/${id}`)
        return response.data
    },

    async createField(fieldData) {
        const response = await API.post('/fields', fieldData)
        return response.data
    },

    async updateField(id, fieldData) {
        const response = await API.put(`/fields/${id}`, fieldData)
        return response.data
    },

    async deleteField(id) {
        const response = await API.delete(`/fields/${id}`)
        return response.data
    },
}

export default farmService
