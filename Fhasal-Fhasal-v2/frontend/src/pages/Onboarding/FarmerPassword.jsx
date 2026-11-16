import React, { useState } from 'react'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

export const FarmerPassword = ({ onComplete }) => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        if (onComplete) onComplete(password)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#EAF4EE] text-[#174B35] flex items-center justify-center mb-2">
                    <Lock size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#344334]">Secure Your Account</h3>
                <p className="text-xs text-[#7A8475]">Set a strong password for your farm records</p>
            </div>

            {error && (
                <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-xs font-semibold text-[#344334] mb-1">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm pr-10 focus:outline-none focus:border-[#174B35]"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-[#7A8475]"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-[#344334] mb-1">Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DCD2] text-sm focus:outline-none focus:border-[#174B35]"
                />
            </div>

            <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#174B35] text-white text-sm font-semibold hover:bg-[#0f3424] transition-colors"
            >
                Continue
            </button>
        </form>
    )
}

export default FarmerPassword
