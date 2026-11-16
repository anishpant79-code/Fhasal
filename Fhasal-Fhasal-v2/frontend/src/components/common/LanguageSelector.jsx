import React, { useState, useRef, useEffect } from 'react'
import { Languages, ChevronDown, Check } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import { getTranslation } from '../../utils/translations'

const LanguageSelector = ({ className = '', showLabel = false }) => {
    const { settings, updateLanguage, supportedLanguages } = useSettings()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const languageCode = settings?.languageCode || 'en'
    const t = (key) => getTranslation(languageCode, key)

    const currentLang =
        supportedLanguages.find((l) => l.code === languageCode) ||
        supportedLanguages[0] ||
        { code: 'en', name: 'English', nativeName: 'English' }

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (code) => {
        updateLanguage(code)
        setIsOpen(false)
    }

    return (
        <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E0E7DC] bg-white hover:border-[#347052]/50 hover:bg-[#F2F6F0] text-[#347052] font-semibold text-sm transition-all shadow-xs cursor-pointer"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <Languages size={17} className="text-[#347052] shrink-0" />
                {showLabel && (
                    <span className="text-xs text-[#7A8475] hidden sm:inline font-normal">
                        {t('selectLanguage')}:
                    </span>
                )}
                <span className="hidden sm:inline text-[#263D30]">
                    {currentLang.nativeName}
                </span>
                <span className="sm:hidden text-[#263D30] uppercase text-xs">
                    {currentLang.code}
                </span>
                <ChevronDown
                    size={14}
                    className={`text-[#456354] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-[#E0E7DC] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-1.5 border-b border-[#F0F4EE] text-[11px] font-bold uppercase tracking-wider text-[#7A8475]">
                        {t('selectLanguage')}
                    </div>

                    {/* Sized so all 7 languages fit completely without cutoff, with smooth dropdown scrolling if screen height is constrained */}
                    <div className="max-h-[min(520px,85vh)] overflow-y-auto dropdown-scroll py-1 overscroll-contain">
                        {supportedLanguages.map((lang) => {
                            const isSelected = lang.code === languageCode
                            return (
                                <button
                                    key={lang.code}
                                    type="button"
                                    onClick={() => handleSelect(lang.code)}
                                    className={`w-[calc(100%-8px)] mx-1 rounded-xl flex items-center justify-between px-3 py-1.5 text-sm text-left transition-colors cursor-pointer ${
                                        isSelected
                                            ? 'bg-[#E8F4EA] text-[#174B35] font-semibold'
                                            : 'text-[#344334] hover:bg-[#F2F6F0]'
                                    }`}
                                >
                                    <div>
                                        <p className="leading-tight font-medium text-sm">{lang.nativeName}</p>
                                        <p className="text-[11px] text-[#7A8475]">{lang.name}</p>
                                    </div>
                                    {isSelected && <Check size={16} className="text-[#347052] shrink-0" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LanguageSelector
