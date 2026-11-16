
import React from 'react'
import { Link } from 'react-router-dom'
import {
    Map as MapIcon,
    MapPin,
    Ruler,
    ArrowRight,
} from 'lucide-react'

import { useFields } from '../../context/FieldContext'
import { useSettings } from '../../context/SettingsContext'
import BackButton from '../../components/common/BackButton'

const AREA_CONVERSIONS = {
    acre: 4046.8564224,
    hectare: 10000,
    guntha: 101.17141056,
}

const standardFieldNames = {
    en: {
        'my farm': 'My Farm',
        'my field': 'My Field',
        'field 1': 'Field 1',
        'field 2': 'Field 2',
        'field 3': 'Field 3',
        'registered farm': 'Registered Farm',
    },
    hi: {
        'my farm': 'मेरा खेत',
        'my field': 'मेरा खेत',
        'field 1': 'खेत 1',
        'field 2': 'खेत 2',
        'field 3': 'खेत 3',
        'registered farm': 'पंजीकृत खेत',
    },
    kn: {
        'my farm': 'ನನ್ನ ಹೊಲ',
        'my field': 'ನನ್ನ ಹೊಲ',
        'field 1': 'ಹೊಲ 1',
        'field 2': 'ಹೊಲ 2',
        'field 3': 'ಹೊಲ 3',
        'registered farm': 'ನೋಂದಾಯಿತ ಹೊಲ',
    },
    te: {
        'my farm': 'నా వ్యవసాయ భూమి',
        'my field': 'నా పొలం',
        'field 1': 'పొలం 1',
        'field 2': 'పొలం 2',
        'field 3': 'పొలం 3',
        'registered farm': 'నమోదు చేసిన పొలం',
    },
    ta: {
        'my farm': 'எனது பண்ணை',
        'my field': 'எனது வயல்',
        'field 1': 'வயல் 1',
        'field 2': 'வயல் 2',
        'field 3': 'வயல் 3',
        'registered farm': 'பதிவு செய்யப்பட்ட பண்ணை',
    },
    mr: {
        'my farm': 'माझे शेत',
        'my field': 'माझे शेत',
        'field 1': 'शेत 1',
        'field 2': 'शेत 2',
        'field 3': 'शेत 3',
        'registered farm': 'नोंदणीकृत शेत',
    },
    bn: {
        'my farm': 'আমার খামার',
        'my field': 'আমার জমি',
        'field 1': 'জমি ১',
        'field 2': 'জমি ২',
        'field 3': 'জমি ৩',
        'registered farm': 'নিবন্ধিত খামার',
    },
}

const fieldsTranslations = {
    en: {
        title: 'My Fields',
        description: 'Manage and monitor your registered farmland.',
        addField: '+ Add Field',
        noFields: 'No fields added yet',
        emptyDescription: "You haven't registered any farmland yet. Add your first field to start monitoring your land and receiving personalized crop recommendations.",
        addFirst: 'Add Your First Field',
        registeredFarm: 'Registered Farm',
        totalArea: 'Total Farm Area',
        location: 'Farm Location',
        viewDetails: 'View Details',
        acre: 'Acre',
        hectare: 'Hectare',
        guntha: 'Guntha',
        unnamedField: 'Unnamed Field',
        loading: 'Loading your fields...',
        loadError: 'Unable to load your fields. Please try again.',
        retry: 'Try Again',
    },
    hi: {
        title: 'मेरे खेत',
        description: 'अपने पंजीकृत खेतों का प्रबंधन और निगरानी करें।',
        addField: '+ खेत जोड़ें',
        noFields: 'अभी तक कोई खेत नहीं जोड़ा गया',
        emptyDescription: 'आपने अभी तक कोई कृषि भूमि पंजीकृत नहीं की है। अपनी भूमि की निगरानी और व्यक्तिगत फसल सुझाव पाने के लिए अपना पहला खेत जोड़ें।',
        addFirst: 'अपना पहला खेत जोड़ें',
        registeredFarm: 'पंजीकृत खेत',
        totalArea: 'कुल खेत का क्षेत्रफल',
        location: 'खेत का स्थान',
        viewDetails: 'विवरण देखें',
        acre: 'एकड़',
        hectare: 'हेक्टेयर',
        guntha: 'गुंठा',
        unnamedField: 'बिना नाम का खेत',
        loading: 'आपके खेत लोड हो रहे हैं...',
        loadError: 'खेत लोड नहीं हो सके। कृपया पुनः प्रयास करें।',
        retry: 'फिर कोशिश करें',
    },
    kn: {
        title: 'ನನ್ನ ಹೊಲಗಳು',
        description: 'ನಿಮ್ಮ ನೋಂದಾಯಿತ ಕೃಷಿ ಭೂಮಿಯನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.',
        addField: '+ ಹೊಲ ಸೇರಿಸಿ',
        noFields: 'ಇನ್ನೂ ಯಾವುದೇ ಹೊಲಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ',
        emptyDescription: 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಕೃಷಿ ಭೂಮಿಯನ್ನು ನೋಂದಾಯಿಸಿಲ್ಲ. ನಿಮ್ಮ ಭೂಮಿಯನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಲು ಮತ್ತು ವೈಯಕ್ತಿಕ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ಮೊದಲ ಹೊಲವನ್ನು ಸೇರಿಸಿ.',
        addFirst: 'ನಿಮ್ಮ ಮೊದಲ ಹೊಲವನ್ನು ಸೇರಿಸಿ',
        registeredFarm: 'ನೋಂದಾಯಿತ ಹೊಲ',
        totalArea: 'ಒಟ್ಟು ಹೊಲದ ವಿಸ್ತೀರ್ಣ',
        location: 'ಹೊಲದ ಸ್ಥಳ',
        viewDetails: 'ವಿವರಗಳನ್ನು ನೋಡಿ',
        acre: 'ಎಕರೆ',
        hectare: 'ಹೆಕ್ಟೇರ್',
        guntha: 'ಗುಂಟೆ',
        unnamedField: 'ಹೆಸರಿಲ್ಲದ ಹೊಲ',
        loading: 'ನಿಮ್ಮ ಹೊಲಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
        loadError: 'ಹೊಲಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    },
    mr: {
        title: 'माझी शेते',
        description: 'तुमच्या नोंदणीकृत शेतांचे व्यवस्थापन आणि निरीक्षण करा.',
        addField: '+ शेत जोडा',
        noFields: 'अद्याप कोणतेही शेत जोडलेले नाही',
        emptyDescription: 'तुम्ही अद्याप कोणतीही शेतजमीन नोंदवलेली नाही. तुमच्या जमिनीचे निरीक्षण आणि वैयक्तिक पीक सल्ला मिळवण्यासाठी पहिले शेत जोडा.',
        addFirst: 'तुमचे पहिले शेत जोडा',
        registeredFarm: 'नोंदणीकृत शेत',
        totalArea: 'एकूण शेत क्षेत्र',
        location: 'शेताचे स्थान',
        viewDetails: 'तपशील पहा',
        acre: 'एकर',
        hectare: 'हेक्टर',
        guntha: 'गुंठे',
        unnamedField: 'नाव नसलेले शेत',
        loading: 'तुमची शेते लोड होत आहेत...',
        loadError: 'शेते लोड करता आली नाहीत. पुन्हा प्रयत्न करा.',
        retry: 'पुन्हा प्रयत्न करा',
    },
    te: {
        title: 'నా పొలాలు',
        description: 'మీరు నమోదు చేసిన వ్యవసాయ భూములను నిర్వహించండి మరియు పర్యవేక్షించండి.',
        addField: '+ పొలం జోడించండి',
        noFields: 'ఇంకా పొలాలు జోడించలేదు',
        emptyDescription: 'మీరు ఇంకా వ్యవసాయ భూమిని నమోదు చేయలేదు. మీ భూమిని పర్యవేక్షించడానికి మరియు వ్యక్తిగత పంట సిఫార్సులు పొందడానికి మీ మొదటి పొలాన్ని జోడించండి.',
        addFirst: 'మీ మొదటి పొలాన్ని జోడించండి',
        registeredFarm: 'నమోదు చేసిన పొలం',
        totalArea: 'మొత్తం పొలం విస్తీర్ణం',
        location: 'పొలం స్థానం',
        viewDetails: 'వివరాలు చూడండి',
        acre: 'ఎకరం',
        hectare: 'హెక్టారు',
        guntha: 'గుంటలు',
        unnamedField: 'పేరు లేని పొలం',
        loading: 'మీ పొలాలు లోడ్ అవుతున్నాయి...',
        loadError: 'పొలాలను లోడ్ చేయలేకపోయాము. మళ్లీ ప్రయత్నించండి.',
        retry: 'మళ్లీ ప్రయత్నించండి',
    },
    ta: {
        title: 'எனது வயல்கள்',
        description: 'உங்கள் பதிவு செய்யப்பட்ட விவசாய நிலங்களை நிர்வகித்து கண்காணிக்கவும்.',
        addField: '+ வயலைச் சேர்க்கவும்',
        noFields: 'இதுவரை வயல்கள் சேர்க்கப்படவில்லை',
        emptyDescription: 'நீங்கள் இன்னும் விவசாய நிலத்தைப் பதிவு செய்யவில்லை. உங்கள் நிலத்தைக் கண்காணிக்கவும் தனிப்பயனாக்கப்பட்ட பயிர் பரிந்துரைகளைப் பெறவும் முதல் வயலைச் சேர்க்கவும்.',
        addFirst: 'உங்கள் முதல் வயலைச் சேர்க்கவும்',
        registeredFarm: 'பதிவு செய்யப்பட்ட பண்ணை',
        totalArea: 'மொத்த நிலப் பரப்பளவு',
        location: 'வயல் அமைவிடம்',
        viewDetails: 'விவரங்களைக் காண்க',
        acre: 'ஏக்கர்',
        hectare: 'ஹெக்டேர்',
        guntha: 'குண்டா',
        unnamedField: 'பெயரிடப்படாத வயல்',
        loading: 'உங்கள் வயல்கள் ஏற்றப்படுகின்றன...',
        loadError: 'வயல்களை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
        retry: 'மீண்டும் முயற்சிக்கவும்',
    },
    bn: {
        title: 'আমার জমি',
        description: 'আপনার নিবন্ধিত কৃষিজমি পরিচালনা ও পর্যবেক্ষণ করুন।',
        addField: '+ জমি যোগ করুন',
        noFields: 'এখনও কোনো জমি যোগ করা হয়নি',
        emptyDescription: 'আপনি এখনও কোনো কৃষিজমি নিবন্ধন করেননি। আপনার জমি পর্যবেক্ষণ এবং ব্যক্তিগত ফসলের পরামর্শ পেতে প্রথম জমিটি যোগ করুন।',
        addFirst: 'আপনার প্রথম জমি যোগ করুন',
        registeredFarm: 'নিবন্ধিত খামার',
        totalArea: 'মোট জমির পরিমাণ',
        location: 'জমির অবস্থান',
        viewDetails: 'বিস্তারিত দেখুন',
        acre: 'একর',
        hectare: 'হেক্টর',
        guntha: 'গুন্থা',
        unnamedField: 'নামহীন জমি',
        loading: 'আপনার জমি লোড হচ্ছে...',
        loadError: 'জমি লোড করা যায়নি। আবার চেষ্টা করুন।',
        retry: 'আবার চেষ্টা করুন',
    },
}

const convertArea = (area, fromUnit, toUnit) => {
    const value = Number(area)

    if (!Number.isFinite(value) || value < 0) {
        return 0
    }

    const from = String(fromUnit || 'acre').toLowerCase().replace(/s$/, '')
    const to = String(toUnit || 'acre').toLowerCase().replace(/s$/, '')

    const fromFactor = AREA_CONVERSIONS[from]
    const toFactor = AREA_CONVERSIONS[to]

    if (!fromFactor || !toFactor) {
        return value
    }

    return (value * fromFactor) / toFactor
}

const translateFieldName = (fieldName, languageCode, t) => {
    if (!fieldName || !String(fieldName).trim()) {
        return t('unnamedField')
    }

    const originalName = String(fieldName).trim()
    const normalizedName = originalName.toLowerCase()

    return standardFieldNames[languageCode]?.[normalizedName] || originalName
}

const Fields = () => {
    const {
        fields = [],
        loading,
        error,
        fetchFields,
    } = useFields()

    const { settings } = useSettings()

    const languageCode = settings.languageCode || 'en'

    const t = (key) => (
        fieldsTranslations[languageCode]?.[key] ??
        fieldsTranslations.en[key] ??
        key
    )

    const selectedUnit = settings.areaUnit || 'Acre'

    const hasFields = fields.length > 0

    const getFieldArea = (field) => {
        const convertedArea = convertArea(
            field.fieldArea ?? field.area,
            field.areaUnit ?? field.unit,
            selectedUnit
        )

        return convertedArea.toLocaleString('en-IN', {
            maximumFractionDigits: 3,
        })
    }

    const unitLabel = t(selectedUnit.toLowerCase()) || selectedUnit

    return (
        <div className="p-4 md:p-8">
            <div className="mb-4">
                <BackButton />
            </div>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#344334]">
                        {t('title')}
                    </h1>

                    <p className="mt-2 text-[#7A8475]">
                        {t('description')}
                    </p>
                </div>

                {!loading && hasFields && (
                    <Link
                        to="/fields/add"
                        className="px-5 py-3 bg-[#347052] text-white rounded-xl font-medium hover:bg-[#286044] transition-colors"
                    >
                        {t('addField')}
                    </Link>
                )}
            </div>

            {loading && (
                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-10 text-center shadow-sm">
                    <p className="text-[#347052] font-medium">
                        {t('loading')}
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
                    <p className="text-red-600 mb-4">
                        {error || t('loadError')}
                    </p>

                    <button
                        type="button"
                       onClick={() => fetchFields().catch(console.error)}
                        className="px-5 py-3 bg-[#347052] text-white rounded-xl font-medium hover:bg-[#286044] transition-colors"
                    >
                        {t('retry')}
                    </button>
                </div>
            )}

            {!loading && !error && !hasFields && (
                <div className="bg-white rounded-2xl border border-[#E4E9DE] p-10 text-center shadow-sm">

                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-fhasal-green-light flex items-center justify-center">
                        <MapIcon
                            size={30}
                            className="text-fhasal-green"
                        />
                    </div>

                    <h2 className="text-xl font-semibold text-[#344334] mb-2">
                        {t('noFields')}
                    </h2>

                    <p className="text-sm text-[#7A8475] max-w-md mx-auto mb-6">
                        {t('emptyDescription')}
                    </p>

                    <Link
                        to="/fields/add"
                        className="inline-block px-6 py-3 bg-[#347052] text-white rounded-xl font-medium hover:bg-[#286044] transition-colors"
                    >
                        {t('addFirst')}
                    </Link>
                </div>
            )}

            {!loading && !error && hasFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {fields.map((field) => {
                        const fieldId = field.id || field._id

                        return (
                            <div
                                key={fieldId}
                                className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm hover:shadow-md transition-shadow"
                            >

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 rounded-xl bg-fhasal-green-light flex items-center justify-center">
                                        <MapIcon
                                            size={22}
                                            className="text-fhasal-green"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-[#344334]">
                                            {translateFieldName(
                                                field.fieldName,
                                                languageCode,
                                                t
                                            )}
                                        </h2>

                                        <p className="text-xs text-[#829187]">
                                            {t('registeredFarm')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-3">
                                    <Ruler
                                        size={17}
                                        className="text-[#347052]"
                                    />

                                    <div>
                                        <p className="text-xs text-[#829187]">
                                            {t('totalArea')}
                                        </p>

                                        <p className="text-sm font-medium text-[#344334]">
                                            {getFieldArea(field)} {unitLabel}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-5">
                                    <MapPin
                                        size={17}
                                        className="text-[#347052]"
                                    />

                                    <div>
                                        <p className="text-xs text-[#829187]">
                                            {t('location')}
                                        </p>

                                        <p className="text-sm font-medium text-[#344334]">
                                            {field.fieldLocation || field.location || '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#E5EAE1] flex justify-end">
                                    <Link
                                        to={`/fields/${fieldId}`}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-[#347052] hover:text-[#285C42] transition-colors"
                                    >
                                        {t('viewDetails')}
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>

                            </div>
                        )
                    })}

                </div>
            )}

        </div>
    )
}

export default Fields
