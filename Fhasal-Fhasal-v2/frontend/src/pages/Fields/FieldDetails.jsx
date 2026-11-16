
import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import FieldDetailsMap from './FieldDetailsMap'

import {
    ArrowLeft,
    Pencil,
    Trash2,
    Sprout,
    Map,
    Ruler,
    MapPin,
    Layers,
    X,
    AlertTriangle,
} from 'lucide-react'

import { useToast } from '../../context/ToastContext'
import { useFields } from '../../context/FieldContext'
import { useSettings } from '../../context/SettingsContext'


// --------------------------------------------------
// TRANSLATIONS
// --------------------------------------------------

const translations = {
    en: {
        back: 'Back to Fields',
        notFound: 'Field Not Found',
        notFoundDescription: 'The requested field could not be found.',
        backToFields: 'Back to Fields',
        pageTitle: 'FIELD DETAILS',
        description: 'View your registered agricultural field information.',
        edit: 'Edit Field',
        delete: 'Delete Field',
        overview: 'Farm Overview',
        registeredInfo: 'Registered field information',
        fieldName: 'Field Name',
        farmArea: 'Farm Area',
        location: 'Location',
        soilType: 'Soil Type',
        boundary: 'Field Boundary',
        boundaryDescription: 'Geographical boundary of your registered field',
        boundaryPoints: 'Boundary Points',
        coordinates: 'GPS coordinates recorded',
        deleteTitle: 'Delete Field?',
        deleteQuestion: 'Are you sure you want to delete',
        deleteWarning: 'This action cannot be undone.',
        cancel: 'Cancel',
        close: 'Close',
        deleteSuccess: 'Field deleted successfully.',
        soilMissing: 'Not specified',
        locationMissing: 'Not specified',
        unitAcre: 'Acres',
        unitHectare: 'Hectares',
        unitGuntha: 'Gunthas',
    },

    hi: {
        back: 'खेतों पर वापस जाएं',
        notFound: 'खेत नहीं मिला',
        notFoundDescription: 'अनुरोधित खेत नहीं मिल सका।',
        backToFields: 'खेतों पर वापस जाएं',
        pageTitle: 'खेत का विवरण',
        description: 'अपने पंजीकृत कृषि खेत की जानकारी देखें।',
        edit: 'खेत संपादित करें',
        delete: 'खेत हटाएं',
        overview: 'खेत का अवलोकन',
        registeredInfo: 'पंजीकृत खेत की जानकारी',
        fieldName: 'खेत का नाम',
        farmArea: 'खेत का क्षेत्रफल',
        location: 'स्थान',
        soilType: 'मिट्टी का प्रकार',
        boundary: 'खेत की सीमा',
        boundaryDescription: 'आपके पंजीकृत खेत की भौगोलिक सीमा',
        boundaryPoints: 'सीमा बिंदु',
        coordinates: 'दर्ज GPS निर्देशांक',
        deleteTitle: 'खेत हटाएं?',
        deleteQuestion: 'क्या आप इसे हटाना चाहते हैं',
        deleteWarning: 'यह कार्रवाई वापस नहीं की जा सकती।',
        cancel: 'रद्द करें',
        close: 'बंद करें',
        deleteSuccess: 'खेत सफलतापूर्वक हटाया गया।',
        soilMissing: 'निर्दिष्ट नहीं',
        locationMissing: 'निर्दिष्ट नहीं',
        unitAcre: 'एकड़',
        unitHectare: 'हेक्टेयर',
        unitGuntha: 'गुंठा',
    },

    kn: {
        back: 'ಹೊಲಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
        notFound: 'ಹೊಲ ಕಂಡುಬಂದಿಲ್ಲ',
        notFoundDescription: 'ಕೋರಿದ ಹೊಲ ಕಂಡುಬಂದಿಲ್ಲ.',
        backToFields: 'ಹೊಲಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
        pageTitle: 'ಹೊಲದ ವಿವರಗಳು',
        description: 'ನೋಂದಾಯಿತ ಕೃಷಿ ಹೊಲದ ಮಾಹಿತಿಯನ್ನು ವೀಕ್ಷಿಸಿ.',
        edit: 'ಹೊಲ ಸಂಪಾದಿಸಿ',
        delete: 'ಹೊಲ ಅಳಿಸಿ',
        overview: 'ಹೊಲದ ಅವಲೋಕನ',
        registeredInfo: 'ನೋಂದಾಯಿತ ಹೊಲದ ಮಾಹಿತಿ',
        fieldName: 'ಹೊಲದ ಹೆಸರು',
        farmArea: 'ಹೊಲದ ವಿಸ್ತೀರ್ಣ',
        location: 'ಸ್ಥಳ',
        soilType: 'ಮಣ್ಣಿನ ವಿಧ',
        boundary: 'ಹೊಲದ ಗಡಿ',
        boundaryDescription: 'ನೋಂದಾಯಿತ ಹೊಲದ ಭೌಗೋಳಿಕ ಗಡಿ',
        boundaryPoints: 'ಗಡಿ ಬಿಂದುಗಳು',
        coordinates: 'ದಾಖಲಾದ GPS ನಿರ್ದೇಶಾಂಕಗಳು',
        deleteTitle: 'ಹೊಲ ಅಳಿಸಬೇಕೆ?',
        deleteQuestion: 'ನೀವು ಅಳಿಸಲು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ',
        deleteWarning: 'ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂತಿರುಗಿಸಲಾಗುವುದಿಲ್ಲ.',
        cancel: 'ರದ್ದುಮಾಡಿ',
        close: 'ಮುಚ್ಚಿ',
        deleteSuccess: 'ಹೊಲವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ.',
        soilMissing: 'ನಿರ್ದಿಷ್ಟಪಡಿಸಿಲ್ಲ',
        locationMissing: 'ನಿರ್ದಿಷ್ಟಪಡಿಸಿಲ್ಲ',
        unitAcre: 'ಎಕರೆ',
        unitHectare: 'ಹೆಕ್ಟೇರ್',
        unitGuntha: 'ಗುಂಟೆ',
    },

    mr: {
        back: 'शेतांकडे परत जा',
        notFound: 'शेत सापडले नाही',
        notFoundDescription: 'विनंती केलेले शेत सापडले नाही.',
        backToFields: 'शेतांकडे परत जा',
        pageTitle: 'शेताची माहिती',
        description: 'नोंदणीकृत शेतीची माहिती पहा.',
        edit: 'शेत संपादित करा',
        delete: 'शेत हटवा',
        overview: 'शेताचा आढावा',
        registeredInfo: 'नोंदणीकृत शेताची माहिती',
        fieldName: 'शेताचे नाव',
        farmArea: 'शेताचे क्षेत्रफळ',
        location: 'स्थान',
        soilType: 'मातीचा प्रकार',
        boundary: 'शेताची सीमा',
        boundaryDescription: 'नोंदणीकृत शेताची भौगोलिक सीमा',
        boundaryPoints: 'सीमा बिंदू',
        coordinates: 'नोंदवलेले GPS निर्देशांक',
        deleteTitle: 'शेत हटवायचे?',
        deleteQuestion: 'तुम्हाला हटवायचे आहे का',
        deleteWarning: 'ही कृती पूर्ववत करता येणार नाही.',
        cancel: 'रद्द करा',
        close: 'बंद करा',
        deleteSuccess: 'शेत यशस्वीरित्या हटवले.',
        soilMissing: 'नमूद केलेले नाही',
        locationMissing: 'नमूद केलेले नाही',
        unitAcre: 'एकर',
        unitHectare: 'हेक्टर',
        unitGuntha: 'गुंठे',
    },

    te: {
        back: 'పొలాలకు తిరిగి వెళ్లండి',
        notFound: 'పొలం కనుగొనబడలేదు',
        notFoundDescription: 'కోరిన పొలం కనుగొనబడలేదు.',
        backToFields: 'పొలాలకు తిరిగి వెళ్లండి',
        pageTitle: 'పొలం వివరాలు',
        description: 'నమోదు చేసిన వ్యవసాయ పొలం వివరాలను చూడండి.',
        edit: 'పొలాన్ని సవరించండి',
        delete: 'పొలాన్ని తొలగించండి',
        overview: 'పొలం అవలోకనం',
        registeredInfo: 'నమోదు చేసిన పొలం సమాచారం',
        fieldName: 'పొలం పేరు',
        farmArea: 'పొలం విస్తీర్ణం',
        location: 'ప్రదేశం',
        soilType: 'నేల రకం',
        boundary: 'పొలం సరిహద్దు',
        boundaryDescription: 'నమోదు చేసిన పొలం భౌగోళిక సరిహద్దు',
        boundaryPoints: 'సరిహద్దు బిందువులు',
        coordinates: 'నమోదు చేసిన GPS కోఆర్డినేట్లు',
        deleteTitle: 'పొలాన్ని తొలగించాలా?',
        deleteQuestion: 'మీరు తొలగించాలనుకుంటున్నారా',
        deleteWarning: 'ఈ చర్యను తిరిగి మార్చలేరు.',
        cancel: 'రద్దు చేయండి',
        close: 'మూసివేయండి',
        deleteSuccess: 'పొలం విజయవంతంగా తొలగించబడింది.',
        soilMissing: 'పేర్కొనలేదు',
        locationMissing: 'పేర్కొనలేదు',
        unitAcre: 'ఎకరాలు',
        unitHectare: 'హెక్టార్లు',
        unitGuntha: 'గుంటలు',
    },

    ta: {
        back: 'வயல்களுக்குத் திரும்பு',
        notFound: 'வயல் கிடைக்கவில்லை',
        notFoundDescription: 'கோரப்பட்ட வயலைக் கண்டுபிடிக்க முடியவில்லை.',
        backToFields: 'வயல்களுக்குத் திரும்பு',
        pageTitle: 'வயல் விவரங்கள்',
        description: 'பதிவு செய்யப்பட்ட விவசாய நில விவரங்களைப் பார்க்கவும்.',
        edit: 'வயலைத் திருத்து',
        delete: 'வயலை நீக்கு',
        overview: 'வயல் கண்ணோட்டம்',
        registeredInfo: 'பதிவு செய்யப்பட்ட வயல் தகவல்',
        fieldName: 'வயல் பெயர்',
        farmArea: 'வயல் பரப்பளவு',
        location: 'இடம்',
        soilType: 'மண் வகை',
        boundary: 'வயல் எல்லை',
        boundaryDescription: 'பதிவு செய்யப்பட்ட வயலின் புவியியல் எல்லை',
        boundaryPoints: 'எல்லைப் புள்ளிகள்',
        coordinates: 'பதிவு செய்யப்பட்ட GPS ஆயத்தொலைவுகள்',
        deleteTitle: 'வயலை நீக்கவா?',
        deleteQuestion: 'நீங்கள் நீக்க விரும்புகிறீர்களா',
        deleteWarning: 'இந்தச் செயலை மாற்ற முடியாது.',
        cancel: 'ரத்துசெய்',
        close: 'மூடு',
        deleteSuccess: 'வயல் வெற்றிகரமாக நீக்கப்பட்டது.',
        soilMissing: 'குறிப்பிடப்படவில்லை',
        locationMissing: 'குறிப்பிடப்படவில்லை',
        unitAcre: 'ஏக்கர்',
        unitHectare: 'ஹெக்டேர்',
        unitGuntha: 'குண்டா',
    },

    bn: {
        back: 'ক্ষেতে ফিরে যান',
        notFound: 'ক্ষেত পাওয়া যায়নি',
        notFoundDescription: 'অনুরোধ করা ক্ষেতটি খুঁজে পাওয়া যায়নি।',
        backToFields: 'ক্ষেতে ফিরে যান',
        pageTitle: 'ক্ষেতের বিবরণ',
        description: 'নিবন্ধিত কৃষিজমির তথ্য দেখুন।',
        edit: 'ক্ষেত সম্পাদনা করুন',
        delete: 'ক্ষেত মুছুন',
        overview: 'ক্ষেতের সংক্ষিপ্ত বিবরণ',
        registeredInfo: 'নিবন্ধিত ক্ষেতের তথ্য',
        fieldName: 'ক্ষেতের নাম',
        farmArea: 'ক্ষেতের আয়তন',
        location: 'অবস্থান',
        soilType: 'মাটির ধরন',
        boundary: 'ক্ষেতের সীমানা',
        boundaryDescription: 'নিবন্ধিত ক্ষেতের ভৌগোলিক সীমানা',
        boundaryPoints: 'সীমানার বিন্দু',
        coordinates: 'রেকর্ড করা GPS স্থানাঙ্ক',
        deleteTitle: 'ক্ষেত মুছবেন?',
        deleteQuestion: 'আপনি কি মুছতে চান',
        deleteWarning: 'এই কাজটি ফিরিয়ে নেওয়া যাবে না।',
        cancel: 'বাতিল',
        close: 'বন্ধ করুন',
        deleteSuccess: 'ক্ষেত সফলভাবে মুছে ফেলা হয়েছে।',
        soilMissing: 'উল্লেখ করা হয়নি',
        locationMissing: 'উল্লেখ করা হয়নি',
        unitAcre: 'একর',
        unitHectare: 'হেক্টর',
        unitGuntha: 'গুন্টা',
    },
}

// --------------------------------------------------
// SOIL TRANSLATION KEYS
// --------------------------------------------------

const soilTranslationKeys = {
    'Black Soil': 'blackSoil',
    'Red Soil': 'redSoil',
    'Alluvial Soil': 'alluvialSoil',
    'Sandy Soil': 'sandySoil',
    'Sandy Loam': 'sandyLoam',
    'Clayey Soil': 'clayeySoil',
    'Loamy Soil': 'loamySoil',
    'Laterite Soil': 'lateriteSoil',
    Other: 'otherSoil',
}

// --------------------------------------------------
// LANGUAGE HELPER
// --------------------------------------------------

const normalizeLanguageCode = (settings, supportedLanguages = []) => {
    const rawLanguage =
        typeof settings?.language === 'string'
            ? settings.language
            : settings?.language?.code ||
              settings?.language?.value ||
              settings?.currentLanguage ||
              settings?.languageCode ||
              'en'

    const code = String(rawLanguage).toLowerCase().split('-')[0]

    const validCodes = Object.keys(translations)

    return validCodes.includes(code) ? code : 'en'
}

// --------------------------------------------------
// FIELD NAME HELPER
// --------------------------------------------------

const getDisplayFieldName = (name, languageCode, t) => {
    if (!name) return '—'

    const standardFieldNames = {
        'Field 1': 'Field 1',
        'Field 2': 'Field 2',
        'Field 3': 'Field 3',
    }

    return standardFieldNames[name] || name
}

// --------------------------------------------------
// FIELD DETAILS COMPONENT
// --------------------------------------------------

const FieldDetails = () => {
    const { showToast } = useToast()
    const { id } = useParams()
    const navigate = useNavigate()

    const {
        fields = [],
        deleteField,
        loading,
        getFieldById,
    } = useFields()

    const {
        settings,
        supportedLanguages = [],
    } = useSettings()

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState('')
    const [fetchedField, setFetchedField] = useState(null)
    const [fetchLoading, setFetchLoading] = useState(false)

    const languageCode = normalizeLanguageCode(
        settings,
        supportedLanguages
    )

    const language = translations[languageCode] || translations.en

    const t = (key) =>
        language[key] || translations.en[key] || key

    const field = fields.find(
        (item) => String(item.id || item._id) === String(id)
    ) || fetchedField

    // Fetch field directly if not in context cache
    useEffect(() => {
        let isCancelled = false
        if (!field && id) {
            setFetchLoading(true)
            getFieldById(id)
                .then((res) => {
                    if (!isCancelled && res) {
                        setFetchedField(res)
                    }
                })
                .finally(() => {
                    if (!isCancelled) setFetchLoading(false)
                })
        }
        return () => {
            isCancelled = true
        }
    }, [id, field, getFieldById])

    const areaUnit = field?.areaUnit || 'acre'

    const unitLabels = {
        acre: t('unitAcre'),
        acres: t('unitAcre'),
        hectare: t('unitHectare'),
        hectares: t('unitHectare'),
        guntha: t('unitGuntha'),
        gunthas: t('unitGuntha'),
    }

    const displayAreaUnit =
        unitLabels[String(areaUnit).toLowerCase()] || areaUnit

    const normalizedSoil = String(field?.soilType || '').trim()

    const displaySoil = normalizedSoil || t('soilMissing')

    const displayFieldName = field?.fieldName || field?.name || '—'

    // OPEN DELETE MODAL
    const openDeleteModal = () => {
        setDeleteError('')
        setShowDeleteModal(true)
    }

    // CLOSE DELETE MODAL
    const closeDeleteModal = () => {
        if (isDeleting) return

        setDeleteError('')
        setShowDeleteModal(false)
    }

    // DELETE FIELD FROM MONGODB
    const handleDeleteField = async () => {
        if (isDeleting) return

        try {
            setIsDeleting(true)
            setDeleteError('')

            await deleteField(id)

            showToast(t('deleteSuccess'), 'success')

            setShowDeleteModal(false)
            navigate('/fields')
        } catch (error) {
            console.error('Unable to delete field:', error)

            setDeleteError(
                error.response?.data?.message ||
                error.message ||
                'Unable to delete this field. Please try again.'
            )
        } finally {
            setIsDeleting(false)
        }
    }

    // LOADING STATE
    if ((loading || fetchLoading) && !field) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-[#174B35] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-[#718071]">Loading field details...</p>
                </div>
            </div>
        )
    }

    // FIELD NOT FOUND
    if (!field) {
        return (
            <div className="p-4 md:p-8">
                <Link
                    to="/fields"
                    className="inline-flex items-center gap-2 text-sm text-[#718071] hover:text-[#174B35] mb-6"
                >
                    <ArrowLeft size={17} />
                    {t('back')}
                </Link>

                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-10 text-center shadow-sm">
                    <h2 className="text-xl font-semibold text-[#344334] mb-2">
                        {t('notFound')}
                    </h2>

                    <p className="text-sm text-[#7A8475] mb-6">
                        {t('notFoundDescription')}
                    </p>

                    <Link
                        to="/fields"
                        className="inline-block px-6 py-3 bg-[#347052] text-white rounded-xl font-medium hover:bg-[#286044] transition-colors"
                    >
                        {t('backToFields')}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8">

            {/* Back Navigation */}
            <Link
                to="/fields"
                className="inline-flex items-center gap-2 text-sm text-[#718071] hover:text-[#174B35] mb-6 transition-colors"
            >
                <ArrowLeft size={17} />
                {t('back')}
            </Link>

            {/* Page Header */}
            <div className="mb-8">
                <p className="text-xs font-semibold tracking-wider text-[#347052] mb-2">
                    {t('pageTitle')}
                </p>

                <h1 className="text-2xl md:text-3xl font-bold text-[#344334]">
                    {displayFieldName}
                </h1>

                <div className="flex justify-between items-center flex-wrap gap-4">
                    <p className="mt-2 text-[#7A8475]">
                        {t('description')}
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                        <Link
                            to={`/fields/${field.id || field._id}/edit`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#347052] text-white text-sm font-medium hover:bg-[#285C42] transition-colors"
                        >
                            <Pencil size={16} />
                            {t('edit')}
                        </Link>

                        <button
                            type="button"
                            onClick={openDeleteModal}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                            <Trash2 size={16} />
                            {t('delete')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Farm Overview */}
            <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 md:p-7 shadow-sm">

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-fhasal-green-light flex items-center justify-center">
                        <Sprout size={25} className="text-fhasal-green" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-[#344334]">
                            {t('overview')}
                        </h2>

                        <p className="text-xs text-[#829187]">
                            {t('registeredInfo')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Field Name */}
                    <div className="p-4 rounded-xl bg-[#F7F9F6]">
                        <div className="flex items-center gap-2 mb-2">
                            <Map size={17} className="text-[#347052]" />
                            <p className="text-xs text-[#829187]">
                                {t('fieldName')}
                            </p>
                        </div>

                        <p className="text-base font-semibold text-[#344334]">
                            {displayFieldName}
                        </p>
                    </div>

                    {/* Farm Area */}
                    <div className="p-4 rounded-xl bg-[#F7F9F6]">
                        <div className="flex items-center gap-2 mb-2">
                            <Ruler size={17} className="text-[#347052]" />
                            <p className="text-xs text-[#829187]">
                                {t('farmArea')}
                            </p>
                        </div>

                        <p className="text-base font-semibold text-[#344334]">
                            {field.fieldArea ?? '—'} {displayAreaUnit}
                        </p>
                    </div>

                    {/* Farm Location */}
                    <div className="p-4 rounded-xl bg-[#F7F9F6]">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={17} className="text-[#347052]" />
                            <p className="text-xs text-[#829187]">
                                {t('location')}
                            </p>
                        </div>

                        <p className="text-base font-semibold text-[#344334]">
                            {field.fieldLocation || t('locationMissing')}
                        </p>
                    </div>

                    {/* Soil Type */}
                    <div className="p-4 rounded-xl bg-[#F7F9F6]">
                        <div className="flex items-center gap-2 mb-2">
                            <Layers size={17} className="text-[#347052]" />
                            <p className="text-xs text-[#829187]">
                                {t('soilType')}
                            </p>
                        </div>

                        <p className="text-base font-semibold text-[#344334]">
                            {displaySoil}
                        </p>
                    </div>

                </div>
            </div>

            {/* Boundary Information */}
            <div className="mt-6 bg-white rounded-2xl border border-[#E4E9DE] p-5 md:p-7 shadow-sm">

                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-fhasal-green-light flex items-center justify-center">
                        <Map size={21} className="text-fhasal-green" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-[#344334]">
                            {t('boundary')}
                        </h2>

                        <p className="text-xs text-[#829187]">
                            {t('boundaryDescription')}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <FieldDetailsMap boundary={field.boundary || []} />

                    <div className="p-4 rounded-xl bg-[#F7F9F6]">
                        <p className="text-sm text-[#344334] font-medium">
                            {t('boundaryPoints')}
                        </p>

                        <p className="text-2xl font-bold text-[#347052] mt-1">
                            {field.boundary?.length || 0}
                        </p>

                        <p className="text-xs text-[#829187] mt-1">
                            {t('coordinates')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8"
                    >
                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            disabled={isDeleting}
                            className="absolute top-4 right-4 p-2 rounded-lg text-[#829187] hover:bg-[#F3F6F1] transition-colors disabled:opacity-50"
                            aria-label={t('close')}
                        >
                            <X size={20} />
                        </button>

                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
                            <AlertTriangle
                                size={27}
                                className="text-red-500"
                            />
                        </div>

                        <h2
                            id="delete-modal-title"
                            className="text-xl font-bold text-[#344334] mb-2"
                        >
                            {t('deleteTitle')}
                        </h2>

                        <p className="text-sm text-[#7A8475] leading-6 mb-2">
                            {t('deleteQuestion')}{' '}
                            <span className="font-semibold text-[#344334]">
                                {displayFieldName}
                            </span>
                            ?
                        </p>

                        <p className="text-xs text-red-500 mb-5">
                            {t('deleteWarning')}
                        </p>

                        {/* Delete Error */}
                        {deleteError && (
                            <div
                                role="alert"
                                className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600"
                            >
                                {deleteError}
                            </div>
                        )}

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                disabled={isDeleting}
                                className="px-5 py-3 rounded-xl border border-[#DCE5DA] text-[#526252] text-sm font-medium hover:bg-[#F3F6F1] disabled:opacity-50 transition-colors"
                            >
                                {t('cancel')}
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteField}
                                disabled={isDeleting}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                <Trash2 size={16} />
                                {isDeleting ? 'Deleting...' : t('delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default FieldDetails
