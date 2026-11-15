
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'

const SettingsContext = createContext(null)

export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
]

const DEFAULT_SETTINGS = {
    language: 'English',
    languageCode: 'en',
    areaUnit: 'Acre',

    preferences: {
        notifications: true,
        weatherAlerts: true,
        irrigationReminder: true,
        cropUpdate: true,
        farmingAdvisories: false,
    },
}

const STORAGE_KEY = 'fhasal-settings'

const findLanguage = (value) => {
    const normalizedValue = String(value || '')
        .trim()
        .toLowerCase()

    return SUPPORTED_LANGUAGES.find(
        (language) =>
            language.code.toLowerCase() === normalizedValue ||
            language.name.toLowerCase() === normalizedValue ||
            language.nativeName.toLowerCase() === normalizedValue
    )
}

const loadSettings = () => {
    try {
        const savedSettings = localStorage.getItem(STORAGE_KEY)

        if (!savedSettings) {
            return {
                ...DEFAULT_SETTINGS,
                preferences: {
                    ...DEFAULT_SETTINGS.preferences,
                },
            }
        }

        const parsed = JSON.parse(savedSettings)

        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error('Invalid saved settings')
        }

        const savedLanguage =
            findLanguage(parsed.languageCode) ||
            findLanguage(parsed.language) ||
            SUPPORTED_LANGUAGES[0]

        return {
            ...DEFAULT_SETTINGS,
            ...parsed,

            language: savedLanguage.name,
            languageCode: savedLanguage.code,

            areaUnit:
                typeof parsed.areaUnit === 'string' && parsed.areaUnit.trim()
                    ? parsed.areaUnit
                    : DEFAULT_SETTINGS.areaUnit,

            preferences: {
                ...DEFAULT_SETTINGS.preferences,
                ...(parsed.preferences &&
                typeof parsed.preferences === 'object'
                    ? parsed.preferences
                    : {}),
            },
        }
    } catch (error) {
        console.error('Error loading settings:', error)

        return {
            ...DEFAULT_SETTINGS,
            preferences: {
                ...DEFAULT_SETTINGS.preferences,
            },
        }
    }
}

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(loadSettings)

    useEffect(() => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(settings)
            )
        } catch (error) {
            console.error('Error saving settings:', error)
        }
    }, [settings])

    const updateSettings = (key, value) => {
        if (!key) return

        if (key === 'language' || key === 'languageCode') {
            const selectedLanguage = findLanguage(value)

            if (selectedLanguage) {
                updateLanguage(selectedLanguage.code)
            }

            return
        }

        setSettings((previous) => ({
            ...previous,
            [key]: value,
        }))
    }

    const updateLanguage = (languageCode) => {
        const selectedLanguage = findLanguage(languageCode)

        if (!selectedLanguage) {
            console.warn('Unsupported language:', languageCode)
            return
        }

        setSettings((previous) => ({
            ...previous,
            language: selectedLanguage.name,
            languageCode: selectedLanguage.code,
        }))
    }

    const updatePreference = (key, value) => {
        if (!key) return

        setSettings((previous) => ({
            ...previous,
            preferences: {
                ...previous.preferences,
                [key]: value,
            },
        }))
    }

    const resetSettings = () => {
        setSettings({
            ...DEFAULT_SETTINGS,
            preferences: {
                ...DEFAULT_SETTINGS.preferences,
            },
        })
    }

    const value = {
        settings,
        updateSettings,
        updateLanguage,
        updatePreference,
        resetSettings,
        supportedLanguages: SUPPORTED_LANGUAGES,
    }

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => {
    const context = useContext(SettingsContext)

    if (!context) {
        throw new Error(
            'useSettings must be used inside SettingsProvider'
        )
    }

    return context
}
