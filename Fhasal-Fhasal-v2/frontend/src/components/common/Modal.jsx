import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-lg',
    className = '',
}) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', handleKeyDown)
        }
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div
                className="fixed inset-0"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className={`relative w-full ${maxWidth} bg-white rounded-2xl border border-[#E4E9DE] shadow-xl p-6 overflow-hidden z-10 animate-in zoom-in-95 duration-150 ${className}`}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4E9DE]">
                    {title && (
                        <h3 className="text-lg font-semibold text-[#344334]">
                            {title}
                        </h3>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Close dialog"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    )
}

export default Modal
