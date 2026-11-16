import { useSettings } from '../SettingsContext'
import { getTranslation, getTranslations } from '../../utils/translations'

const useTranslation = () => {
    const { settings, updateLanguage, supportedLanguages } = useSettings()

    const languageCode = settings?.languageCode || 'en'
    const languageName = settings?.language || 'English'

    const t = (key) => {
        return getTranslation(languageCode, key)
    }

    const changeLanguage = (newCodeOrName) => {
        updateLanguage(newCodeOrName)
    }

    const allTranslations = getTranslations(languageCode)

    return {
        language: languageName,
        languageCode,
        supportedLanguages,
        t,
        changeLanguage,
        translations: allTranslations,
    }
}

export default useTranslation
export { useTranslation }
