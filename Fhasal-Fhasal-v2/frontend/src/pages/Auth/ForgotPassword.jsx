
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, ExternalLink } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import API from '../../services/api'
import FhasalMark from '../../assets/logos/fhasal-mark.svg'

const ForgotPassword = () => {
    const { languageCode = 'en' } = useSettings()

    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [resetLink, setResetLink] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const translations = {
        en: {
            title: 'Forgot Password?',
            description: 'Enter your registered email to reset your password.',
            email: 'Email Address',
            submit: 'Send Reset Link',
            back: 'Back to Login',
            success: 'If an account exists, a password reset link has been generated.',
            open: 'Open Reset Password',
            error: 'Unable to generate reset link. Please try again.',
        },
        hi: {
            title: 'पासवर्ड भूल गए?',
            description: 'पासवर्ड रीसेट करने के लिए अपना पंजीकृत ईमेल दर्ज करें।',
            email: 'ईमेल पता',
            submit: 'रीसेट लिंक भेजें',
            back: 'लॉगिन पर वापस जाएं',
            success: 'यदि खाता मौजूद है, तो पासवर्ड रीसेट लिंक बनाया गया है।',
            open: 'पासवर्ड रीसेट खोलें',
            error: 'रीसेट लिंक नहीं बन सका। दोबारा प्रयास करें।',
        },
    }

    const t = translations[languageCode] || translations.en

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setMessage('')
        setResetLink('')

        if (!email.trim()) {
            setError('Please enter your email address.')
            return
        }

        try {
            setIsSubmitting(true)

            const response = await API.post('/auth/forgot-password', {
                email: email.trim(),
            })

            setMessage(response.data?.message || t.success)
            setResetLink(response.data?.resetLink || '')
        } catch (err) {
            console.error('Forgot password error:', err)

            setError(
                err.response?.data?.message ||
                err.message ||
                t.error
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

                <div className="mb-6 flex flex-col items-center justify-center gap-2">
                    <img src={FhasalMark} alt="Fhasal logo" className="w-10 h-10 object-contain" />
                    <span className="text-xl font-bold text-[#174B35]">Fhasal</span>
                </div>

                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-green-100 p-4">
                        <Mail className="h-8 w-8 text-green-700" />
                    </div>
                </div>

                <h1 className="mb-3 text-center text-2xl font-bold text-gray-900">
                    {t.title}
                </h1>

                <p className="mb-7 text-center text-sm text-gray-500">
                    {t.description}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            {t.email}
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                    </div>

                    {message && (
                        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            {message}
                        </div>
                    )}

                    {/* Show button only; never display the raw token URL */}
                    {resetLink && (
                        <a
                            href={resetLink}
                            className="flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800"
                        >
                            {t.open}
                            <ExternalLink size={17} />
                        </a>
                    )}

                    {error && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
                    >
                        {isSubmitting ? 'Please wait...' : t.submit}
                    </button>

                </form>

                <Link
                    to="/login"
                    className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
                >
                    <ArrowLeft size={16} />
                    {t.back}
                </Link>

            </div>
        </div>
    )
}

export default ForgotPassword
