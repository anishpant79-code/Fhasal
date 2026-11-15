
import { useSettings } from '../context/SettingsContext'
import translations from '../utils/translations'

const useTranslation = () => {
    const { settings, updateSettings } = useSettings()

    const language = settings.language || 'English'

    const t = (key) => {
        return (
            translations[language]?.[key] ??
            translations.English?.[key] ??
            key
        )
    }

    const changeLanguage = (newLanguage) => {
        if (translations[newLanguage]) {
            updateSettings('language', newLanguage)
        }
    }

    return {
        language,
        t,
        changeLanguage,
    }
}

export default useTranslation
