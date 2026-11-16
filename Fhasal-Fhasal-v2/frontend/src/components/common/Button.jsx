import React from 'react'

const VARIANTS = {
    primary: 'bg-[#174B35] text-white hover:bg-[#0f3424] focus:ring-[#174B35]/30',
    secondary: 'bg-[#EAF4EE] text-[#174B35] hover:bg-[#d6ebd9] focus:ring-[#174B35]/20',
    outline: 'border border-[#D4DCD2] text-[#344334] hover:bg-gray-50 focus:ring-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
    ghost: 'text-[#344334] hover:bg-gray-100 focus:ring-gray-200',
}

const SIZES = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3.5 text-base rounded-xl font-semibold',
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    className = '',
    type = 'button',
    onClick,
    ...props
}) => {
    const variantStyle = VARIANTS[variant] || VARIANTS.primary
    const sizeStyle = SIZES[size] || SIZES.md

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyle} ${sizeStyle} ${className}`}
            {...props}
        >
            {loading && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
            )}
            {!loading && Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="shrink-0" />}
            <span>{children}</span>
        </button>
    )
}

export default Button
