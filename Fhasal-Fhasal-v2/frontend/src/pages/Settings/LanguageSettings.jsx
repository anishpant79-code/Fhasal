import React from 'react'
import { Globe } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export const LanguageSettings = () => {
    const { settings, updateLanguage, supportedLanguages = [] } = useSettings()
    const languageCode = settings?.languageCode || 'en'

    return (
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <Globe className="text-[#174B35]" size={22} />
                <div>
                    <h2 className="font-semibold text-gray-800">Language Preferences</h2>
                    <p className="text-sm text-gray-500">Select your preferred application language</p>
                </div>
            </div>

            <label htmlFor="lang-select" className="mb-2 block text-sm font-medium text-gray-700">
                Application Language
            </label>

            <select
                id="lang-select"
                value={languageCode}
                onChange={(e) => updateLanguage(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#174B35] md:w-1/2"
            >
                {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                    </option>
                ))}
            </select>
        </section>
    )
}

export default LanguageSettings
