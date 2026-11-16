
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react'

import API from '../services/api'

const FieldContext = createContext(null)

export const FieldProvider = ({ children }) => {
    const [fields, setFields] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Load fields from MongoDB
    const fetchFields = useCallback(async () => {
        const token = localStorage.getItem('fhasal-token')

        if (!token) {
            setFields([])
            setError('')
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError('')

            const response = await API.get('/fields')

            setFields(response.data.fields || [])
        } catch (error) {
            console.error('Unable to load fields:', error)

            if (error.response?.status === 401) {
                setFields([])
            }

            setError(
                error.response?.data?.message ||
                'Unable to load your fields.'
            )
        } finally {
            setLoading(false)
        }
    }, [])

    // Refresh fields when authentication changes
    useEffect(() => {
        fetchFields()

        const handleAuthChange = () => {
            fetchFields()
        }

        window.addEventListener(
            'fhasal-auth-changed',
            handleAuthChange
        )

        return () => {
            window.removeEventListener(
                'fhasal-auth-changed',
                handleAuthChange
            )
        }
    }, [fetchFields])

    // Add field
    const addField = async (fieldData) => {
        try {
            setError('')

            const response = await API.post('/fields', fieldData)

            const newField = response.data.field

            setFields((previousFields) => [
                newField,
                ...previousFields,
            ])

            return newField
        } catch (error) {
            console.error('Unable to add field:', error)

            setError(
                error.response?.data?.message ||
                'Unable to register field.'
            )

            throw error
        }
    }

    // Update field
    const updateField = async (fieldId, updatedData) => {
        try {
            setError('')

            const response = await API.put(
                `/fields/${fieldId}`,
                updatedData
            )

            const updatedField = response.data.field

            setFields((previousFields) =>
                previousFields.map((field) =>
                    String(field.id || field._id) === String(fieldId)
                        ? updatedField
                        : field
                )
            )

            return updatedField
        } catch (error) {
            console.error('Unable to update field:', error)

            setError(
                error.response?.data?.message ||
                'Unable to update field.'
            )

            throw error
        }
    }

    // Delete field
    const deleteField = async (fieldId) => {
        try {
            setError('')

            await API.delete(`/fields/${fieldId}`)

            setFields((previousFields) =>
                previousFields.filter(
                    (field) =>
                        String(field.id || field._id) !== String(fieldId)
                )
            )
        } catch (error) {
            console.error('Unable to delete field:', error)

            setError(
                error.response?.data?.message ||
                'Unable to delete field.'
            )

            throw error
        }
    }

    return (
        <FieldContext.Provider
            value={{
                fields,
                loading,
                error,
                fetchFields,
                addField,
                updateField,
                deleteField,
            }}
        >
            {children}
        </FieldContext.Provider>
    )
}

export const useFields = () => {
    const context = useContext(FieldContext)

    if (!context) {
        throw new Error(
            'useFields must be used inside FieldProvider'
        )
    }

    return context
}
