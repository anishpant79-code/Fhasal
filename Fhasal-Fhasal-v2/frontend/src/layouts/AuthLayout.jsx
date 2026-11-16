import React from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../assets/images/fhasal-logo.svg'

export const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-[#F6F7F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link to="/" className="inline-flex items-center gap-2 mb-4">
                    <img src={BrandLogo} alt="Fhasal" className="h-10 w-auto" />
                    <span className="text-2xl font-bold text-[#174B35]">Fhasal</span>
                </Link>
                {title && (
                    <h2 className="text-2xl font-bold tracking-tight text-[#344334]">
                        {title}
                    </h2>
                )}
                {subtitle && (
                    <p className="mt-1 text-sm text-[#7A8475]">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-[#E4E9DE] sm:px-10">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
