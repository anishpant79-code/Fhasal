
import React, { useState } from 'react'
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Filter,
    ArrowLeft,
    Inbox,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationContext'

const Notifications = () => {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotifications()

    const [activeFilter, setActiveFilter] = useState('All')

    const filteredNotifications = notifications.filter((notification) => {
        if (activeFilter === 'Unread') return !notification.read
        if (activeFilter === 'Read') return notification.read
        return true
    })

    const totalCount = notifications.length
    const readCount = totalCount - unreadCount

    const filters = ['All', 'Unread', 'Read']

    const handleNotificationClick = (id) => {
        markAsRead(id)
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Link
                            to="/dashboard"
                            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-700"
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-green-100 p-3 text-green-700">
                                <Bell size={25} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Notifications
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Stay updated with your farming activities.
                                </p>
                            </div>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                        >
                            <CheckCheck size={17} />
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Statistics */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Total notifications</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {totalCount}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Unread</p>
                        <p className="mt-2 text-3xl font-bold text-green-700">
                            {unreadCount}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Read</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {readCount}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Filter size={17} />
                        Filter notifications
                    </div>

                    <div className="flex rounded-lg bg-gray-100 p-1">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                                    activeFilter === filter
                                        ? 'bg-white text-green-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                {filter}
                                {filter === 'Unread' && (
                                    <span className="ml-1">
                                        ({unreadCount})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notification List */}
                <div className="space-y-3">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => {
                            const Icon = notification.icon || Bell

                            return (
                                <div
                                    key={notification.id}
                                    className={`rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 ${
                                        notification.read
                                            ? 'border-gray-100'
                                            : 'border-green-200 bg-green-50/40'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`shrink-0 rounded-xl p-3 ${
                                            notification.color || 'bg-gray-100 text-gray-700'
                                        }`}>
                                            <Icon size={22} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {notification.title}
                                                    </h3>

                                                    <p className="mt-1 text-xs font-medium text-gray-500">
                                                        {notification.category}
                                                    </p>
                                                </div>

                                                <span className="text-xs text-gray-400">
                                                    {notification.time}
                                                </span>
                                            </div>

                                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                                {notification.message}
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                <span className="text-xs text-gray-400">
                                                    {notification.date}
                                                </span>

                                                <div className="flex items-center gap-3">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => handleNotificationClick(notification.id)}
                                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-900"
                                                        >
                                                            <Check size={15} />
                                                            Mark as read
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={15} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {!notification.read && (
                                            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-green-600" />
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="rounded-xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                <Inbox size={30} />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900">
                                {activeFilter === 'Unread'
                                    ? 'No unread notifications'
                                    : activeFilter === 'Read'
                                    ? 'No read notifications'
                                    : 'No notifications yet'}
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                {activeFilter === 'Unread'
                                    ? 'You are all caught up!'
                                    : 'Your farming updates will appear here.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Demo notice */}
                <p className="mt-6 text-center text-xs text-gray-400">
                    These are sample notifications stored locally on this device.
                </p>
            </div>
        </div>
    )
}

export default Notifications
