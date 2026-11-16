import React from 'react'

export const Card = ({
    children,
    className = '',
    onClick,
    hoverable = false,
    ...props
}) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm ${
                hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : ''
            } ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

export const CardHeader = ({ children, className = '' }) => (
    <div className={`mb-4 flex items-center justify-between ${className}`}>{children}</div>
)

export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-lg font-semibold text-[#344334] ${className}`}>{children}</h3>
)

export const CardContent = ({ children, className = '' }) => (
    <div className={`text-[#7A8475] ${className}`}>{children}</div>
)

export default Card
