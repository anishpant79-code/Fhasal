
import React from 'react'
import { Link } from 'react-router-dom'
import { Sprout, Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#F5F8F4] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#E5F0E7] flex items-center justify-center mx-auto mb-6">
                    <Sprout className="w-10 h-10 text-[#347052]" />
                </div>

                <p className="text-7xl font-bold text-[#347052] mb-4">
                    404
                </p>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Page not found
                </h1>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    Sorry, the page you are looking for doesn't exist
                    or may have been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-[#347052] hover:bg-[#28563D] text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-semibold transition"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFound
