
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react'

import {
    CheckCircle2,
    AlertCircle,
    X,
} from 'lucide-react'

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {

    const [toast, setToast] = useState(null)

    // Display a notification
    const showToast = (message, type = 'success') => {
        setToast({
            message,
            type,
            id: Date.now(),
        })
    }

    // Automatically hide notification after 3 seconds
    useEffect(() => {
        if (!toast) return

        const timer = setTimeout(() => {
            setToast(null)
        }, 3000)

        return () => clearTimeout(timer)
    }, [toast])

    return (
        <ToastContext.Provider value={{ showToast }}>

            {children}

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-5 right-5 z-[2000] w-[calc(100%-40px)] max-w-sm">

                    <div className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border bg-white animate-in slide-in-from-top-2 ${
                        toast.type === 'success'
                            ? 'border-[#CDE5D3]'
                            : 'border-red-200'
                    }`}>

                        {/* Notification Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            toast.type === 'success'
                                ? 'bg-[#E8F4EA] text-[#347052]'
                                : 'bg-red-50 text-red-600'
                        }`}>
                            {toast.type === 'success' ? (
                                <CheckCircle2 size={21} />
                            ) : (
                                <AlertCircle size={21} />
                            )}
                        </div>

                        {/* Notification Message */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#344334]">
                                {toast.type === 'success' ? 'Success' : 'Error'}
                            </p>

                            <p className="text-xs text-[#7A8475] mt-1">
                                {toast.message}
                            </p>
                        </div>

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            className="p-1 text-[#829187] hover:text-[#344334]"
                            aria-label="Close notification"
                        >
                            <X size={18} />
                        </button>

                    </div>
                </div>
            )}

        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext)
