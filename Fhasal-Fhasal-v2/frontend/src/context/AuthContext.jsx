import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react'

import API from '../services/api'

const AuthContext = createContext(null)

const STORAGE_KEY = 'fhasal-auth'
const TOKEN_KEY = 'fhasal-token'

// Restore logged-in user after refreshing
const loadUser = () => {
    try {
        const savedUser = localStorage.getItem(STORAGE_KEY)
        const savedToken = localStorage.getItem(TOKEN_KEY)

        if (!savedUser || !savedToken) {
            return null
        }

        return JSON.parse(savedUser)
    } catch (error) {
        console.error('Unable to load authentication data:', error)
        return null
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(loadUser)

    // Save user information
    useEffect(() => {
        if (user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    }, [user])

    // Notify other contexts when authentication changes
    const notifyAuthChange = () => {
        window.dispatchEvent(new Event('fhasal-auth-changed'))
    }

    // Refresh profile from MongoDB
    const refreshProfile = useCallback(async () => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (!token) return null

        try {
            const response = await API.get('/auth/me')
            const freshUser = response.data?.user
            if (freshUser) {
                setUser((prev) => ({
                    ...(prev || {}),
                    ...freshUser,
                }))
                return freshUser
            }
        } catch (err) {
            console.warn('Unable to refresh user profile from server:', err.message)
        }
        return null
    }, [])

    // Refresh user profile on mount if token exists
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            refreshProfile()
        }
    }, [refreshProfile])

    // Update user state and storage
    const updateUser = (updatedFields) => {
        setUser((prev) => {
            const next = { ...(prev || {}), ...updatedFields }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
            return next
        })
        notifyAuthChange()
    }

    // LOGIN
    const login = async (email, password) => {
        const response = await API.post('/auth/login', {
            email,
            password,
        })

        const { token, user: userData } = response.data

        localStorage.setItem(TOKEN_KEY, token)
        setUser(userData)

        notifyAuthChange()

        return userData
    }

    // SIGNUP
    const signup = async (userData) => {
        const response = await API.post('/auth/register', userData)

        const { token, user: registeredUser } = response.data

        localStorage.setItem(TOKEN_KEY, token)
        setUser(registeredUser)

        notifyAuthChange()

        return registeredUser
    }

    // LOGOUT
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(STORAGE_KEY)

        setUser(null)

        notifyAuthChange()
    }

    const value = {
        user,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        updateUser,
        refreshProfile,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error(
            'useAuth must be used inside AuthProvider'
        )
    }

    return context
}
