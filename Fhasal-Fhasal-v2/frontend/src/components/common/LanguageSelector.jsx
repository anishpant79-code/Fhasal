import { Languages } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import { getTranslation } from '../../utils/translations'

const LanguageSelector = ({ className = '', showLabel = false }) => {
    const { settings, updateLanguage, supportedLanguages } = useSettings()
    const languageCode = settings?.languageCode || 'en'
    const t = (key) => getTranslation(languageCode, key)

    const handleChange = (e) => {
        updateLanguage(e.target.value)
    }

    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#E5EAE1] bg-white transition hover:border-[#347052] ${className}`}>
            <Languages size={17} className="text-[#347052] shrink-0" />
            {showLabel && (
                <span className="text-xs text-[#7A8475] hidden sm:inline">
                    {t('selectLanguage')}:
                </span>
            )}
            <select
                value={languageCode}
                onChange={handleChange}
                aria-label={t('selectLanguage')}
                className="bg-transparent text-sm font-medium text-[#263D30] outline-none cursor-pointer pr-1"
            >
                {supportedLanguages.map((language) => (
                    <option key={language.code} value={language.code}>
                        {language.nativeName}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default LanguageSelector
