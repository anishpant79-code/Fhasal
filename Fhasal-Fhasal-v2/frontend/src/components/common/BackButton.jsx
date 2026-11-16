import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

const backTranslations = {
    en: 'Back',
    hi: 'वापस जाएं',
    kn: 'ಹಿಂದೆ',
    mr: 'मागे जा',
    te: 'వెనుకకు',
    ta: 'பின்செல்',
    bn: 'পিছনে যান',
}

const BackButton = ({ to, label, className = '' }) => {
    const navigate = useNavigate()
    const { settings } = useSettings()
    const lang = settings.languageCode || 'en'
    const defaultLabel = backTranslations[lang] || backTranslations.en

    const handleClick = () => {
        if (to) {
            navigate(to)
        } else {
            navigate(-1)
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#347052] bg-white border border-[#E0E7DC] rounded-xl hover:bg-[#F2F6F0] hover:border-[#347052]/40 shadow-xs transition-all cursor-pointer shrink-0 ${className}`}
            aria-label={label || defaultLabel}
            title={label || defaultLabel}
        >
            <ArrowLeft size={16} strokeWidth={2.3} />
            <span>{label || defaultLabel}</span>
        </button>
    )
}

export default BackButton
