/**
 * Date formatting utilities for Fhasal
 */

export const formatDate = (date, format = 'medium') => {
    if (!date) return ''
    const d = new Date(date)
    if (Number.isNaN(d.getTime())) return ''

    if (format === 'short') {
        return d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        })
    }

    if (format === 'iso') {
        return d.toISOString().split('T')[0]
    }

    if (format === 'long') {
        return d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    // Default medium: "14 Oct 2026"
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export const formatRelativeTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    if (Number.isNaN(d.getTime())) return ''

    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHours = Math.round(diffMin / 60)
    const diffDays = Math.round(diffHours / 24)

    if (diffSec < 60) return 'just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 30) return `${diffDays}d ago`
    return formatDate(date, 'medium')
}

export default {
    formatDate,
    formatRelativeTime,
}
