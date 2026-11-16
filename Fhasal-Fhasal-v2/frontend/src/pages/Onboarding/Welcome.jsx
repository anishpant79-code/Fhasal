import React from 'react'
import { Link } from 'react-router-dom'
import { Sprout, Satellite, ShieldCheck, ArrowRight } from 'lucide-react'

export const Welcome = ({ onNext }) => {
    return (
        <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EAF4EE] text-[#174B35] flex items-center justify-center">
                <Sprout size={32} />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-[#344334]">Welcome to Fhasal</h2>
                <p className="text-sm text-[#7A8475] mt-2 max-w-sm mx-auto">
                    Smart precision agriculture powered by NASA satellite observations and localized crop science.
                </p>
            </div>

            <div className="space-y-3 text-left max-w-sm mx-auto text-xs text-[#7A8475]">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Satellite size={18} className="text-[#174B35] shrink-0" />
                    <span>Free daily satellite weather & soil moisture monitoring</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <ShieldCheck size={18} className="text-[#174B35] shrink-0" />
                    <span>Personalized crop suitability & rotation guidance</span>
                </div>
            </div>

            {onNext ? (
                <button
                    type="button"
                    onClick={onNext}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#174B35] text-white text-sm font-semibold hover:bg-[#0f3424] transition-colors"
                >
                    Get Started
                    <ArrowRight size={16} />
                </button>
            ) : (
                <Link
                    to="/dashboard"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#174B35] text-white text-sm font-semibold hover:bg-[#0f3424] transition-colors"
                >
                    Go to Dashboard
                    <ArrowRight size={16} />
                </Link>
            )}
        </div>
    )
}

export default Welcome
