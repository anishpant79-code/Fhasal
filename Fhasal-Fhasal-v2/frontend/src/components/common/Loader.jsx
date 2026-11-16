import React from 'react'

export const Loader = ({
    size = 'md',
    label = 'Loading...',
    fullScreen = false,
    className = '',
}) => {
    const sizeMap = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    }

    const spinner = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <div
                className={`${sizeMap[size] || sizeMap.md} border-[#174B35] border-t-transparent rounded-full animate-spin`}
            />
            {label && (
                <p className="text-sm font-medium text-[#718071]">{label}</p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xs">
                {spinner}
            </div>
        )
    }

    return spinner
}

export const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-[#EAF0E8] rounded-xl ${className}`} />
)

export default Loader
