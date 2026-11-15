
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'

import {
    Bell,
    CloudRain,
    Droplets,
    Sprout,
    AlertTriangle,
    CheckCircle,
} from 'lucide-react'

const NotificationContext = createContext(null)

const STORAGE_KEY = 'fhasal-notifications'

const ICONS = {
    General: Bell,
    Weather: CloudRain,
    Irrigation: Droplets,
    Crops: Sprout,
    Fields: CheckCircle,
    Advisory: AlertTriangle,
}

const initialNotifications = [
    {
        id: 1,
        title: 'Welcome to Fhasal',
        message: 'Your farming dashboard is ready. Start by registering your fields.',
        category: 'General',
        time: 'Just now',
        date: 'Today',
        color: 'bg-green-100 text-green-700',
        read: false,
    },
    {
        id: 2,
        title: 'Weather Update',
        message: 'Keep monitoring rainfall conditions before planning irrigation.',
        category: 'Weather',
        time: '2 hours ago',
        date: 'Today',
        color: 'bg-blue-100 text-blue-700',
        read: false,
    },
    {
        id: 3,
        title: 'Irrigation Reminder',
        message: 'Check soil moisture levels before your next irrigation cycle.',
        category: 'Irrigation',
        time: '5 hours ago',
        date: 'Today',
        color: 'bg-cyan-100 text-cyan-700',
        read: true,
    },
    {
        id: 4,
        title: 'Crop Planning',
        message: 'Explore crop recommendations for your upcoming growing season.',
        category: 'Crops',
        time: 'Yesterday',
        date: 'Yesterday',
        color: 'bg-lime-100 text-lime-700',
        read: false,
    },
    {
        id: 5,
        title: 'Field Management',
        message: 'Remember to keep your registered field boundaries updated.',
        category: 'Fields',
        time: 'Yesterday',
        date: 'Yesterday',
        color: 'bg-purple-100 text-purple-700',
        read: true,
    },
    {
        id: 6,
        title: 'Farming Advisory',
        message: 'Check local weather and crop conditions before making farming decisions.',
        category: 'Advisory',
        time: '2 days ago',
        date: 'Earlier',
        color: 'bg-amber-100 text-amber-700',
        read: true,
    },
]

const loadNotifications = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)

        if (saved) {
            const parsed = JSON.parse(saved)

            if (Array.isArray(parsed)) {
                return parsed.map((notification) => ({
                    ...notification,
                    icon: ICONS[notification.category] || Bell,
                }))
            }
        }
    } catch (error) {
        console.error('Could not load notifications:', error)
    }

    return initialNotifications.map((notification) => ({
        ...notification,
        icon: ICONS[notification.category] || Bell,
    }))
}

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(loadNotifications)

    useEffect(() => {
        try {
            const dataToSave = notifications.map(
                ({ icon, ...notification }) => notification
            )

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(dataToSave)
            )
        } catch (error) {
            console.error('Could not save notifications:', error)
        }
    }, [notifications])

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length

    const markAsRead = (id) => {
        setNotifications((previous) =>
            previous.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        )
    }

    const markAllAsRead = () => {
        setNotifications((previous) =>
            previous.map((notification) => ({
                ...notification,
                read: true,
            }))
        )
    }

    const deleteNotification = (id) => {
        setNotifications((previous) =>
            previous.filter((notification) => notification.id !== id)
        )
    }

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                deleteNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => {
    const context = useContext(NotificationContext)

    if (!context) {
        throw new Error(
            'useNotifications must be used inside NotificationProvider'
        )
    }

    return context
}
