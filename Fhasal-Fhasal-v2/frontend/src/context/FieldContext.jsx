import {
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
        } catch (err) {
            console.error('Unable to load fields:', err)

            if (err.response?.status === 401) {
                setFields([])
            }

            setError(
                err.response?.data?.message ||
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

    // Fetch single field by ID (checks cache first, then API)
    const getFieldById = useCallback(async (fieldId) => {
        if (!fieldId) return null

        const existing = fields.find(
            (f) => String(f.id || f._id) === String(fieldId)
        )
        if (existing) return existing

        try {
            const response = await API.get(`/fields/${fieldId}`)
            const fetched = response.data?.field
            if (fetched) {
                setFields((prev) => {
                    const exists = prev.some(
                        (f) => String(f.id || f._id) === String(fieldId)
                    )
                    return exists ? prev : [fetched, ...prev]
                })
                return fetched
            }
        } catch (err) {
            console.error('Unable to fetch single field:', err)
            return null
        }
        return null
    }, [fields])

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
        } catch (err) {
            console.error('Unable to add field:', err)

            setError(
                err.response?.data?.message ||
                'Unable to register field.'
            )

            throw err
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
        } catch (err) {
            console.error('Unable to update field:', err)

            setError(
                err.response?.data?.message ||
                'Unable to update field.'
            )

            throw err
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
        } catch (err) {
            console.error('Unable to delete field:', err)

            setError(
                err.response?.data?.message ||
                'Unable to delete field.'
            )

            throw err
        }
    }

    return (
        <FieldContext.Provider
            value={{
                fields,
                loading,
                error,
                fetchFields,
                getFieldById,
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
