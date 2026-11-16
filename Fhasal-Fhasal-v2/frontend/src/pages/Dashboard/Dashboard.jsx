
import React from 'react'
import { Link } from 'react-router-dom'

import RegisteredFieldsIcon from '../../assets/icons/registered-fields.svg'
import FarmingAreaIcon from '../../assets/icons/farming-area.svg'
import ActiveCropsIcon from '../../assets/icons/active-crops.svg'
import farmConditions from '../../assets/icons/farm-conditions.svg'

import { Lightbulb, Map, Plus, ArrowRight } from 'lucide-react'

import { useFields } from '../../context/FieldContext'
import { useSettings } from '../../context/SettingsContext'

// Conversion factors to square metres
const AREA_CONVERSIONS = {
    acre: 4046.8564224,
    hectare: 10000,
    guntha: 101.17141056,
}

// Dashboard translations
const dashboardTranslations = {
    en: {
        welcome: 'Welcome to Fhasal!',
        welcomeDescription: "Your smart farming companion. Let's make better decisions for your fields today.",
        overview: 'Farm Overview',
        registered: 'Registered Fields',
        totalArea: 'Total Farming Area',
        activeCrops: 'Active Crops',
        cropComingSoon: 'Crop tracking coming soon',
        yourFields: 'Your Fields',
        viewAll: 'View All',
        unnamed: 'Unnamed Field',
        locationMissing: 'Location not specified',
        fieldArea: 'Field Area',
        noFields: 'No fields added yet',
        noFieldsDescription: 'Add your farmland to start receiving crop recommendations and NASA-powered insights for your fields.',
        registerField: 'Register Your First Field',
        viewRegistered: 'View all registered fields',
        recommendations: 'Crop Recommendations',
        recommendationTitle: 'Your crop recommendations will appear here',
        recommendationDescription: "Add your fields to discover suitable crops based on your farm's environmental conditions.",
        conditions: 'Farm Conditions',
        environmental: 'Environmental conditions',
        weather: 'Farm weather insights',
        weatherDescription: 'Register your fields to explore environmental conditions affecting your farmland.',
        acres: 'acres',
        hectares: 'hectares',
        guntha: 'guntha',
        loading: 'Loading your fields...',
        loadError: 'Unable to load your fields. Please refresh the page.',
    },
    hi: {
        welcome: 'Fhasal में आपका स्वागत है!',
        welcomeDescription: 'आपका स्मार्ट खेती साथी। आइए आज अपने खेतों के लिए बेहतर निर्णय लें।',
        overview: 'खेत का विवरण',
        registered: 'पंजीकृत खेत',
        totalArea: 'कुल खेती का क्षेत्र',
        activeCrops: 'सक्रिय फसलें',
        cropComingSoon: 'फसल ट्रैकिंग जल्द उपलब्ध होगी',
        yourFields: 'आपके खेत',
        viewAll: 'सभी देखें',
        unnamed: 'बिना नाम का खेत',
        locationMissing: 'स्थान निर्दिष्ट नहीं है',
        fieldArea: 'खेत का क्षेत्रफल',
        noFields: 'अभी तक कोई खेत नहीं जोड़ा गया',
        noFieldsDescription: 'फसल सुझाव और NASA आधारित जानकारी पाने के लिए अपनी कृषि भूमि जोड़ें।',
        registerField: 'अपना पहला खेत पंजीकृत करें',
        viewRegistered: 'सभी पंजीकृत खेत देखें',
        recommendations: 'फसल सुझाव',
        recommendationTitle: 'आपके फसल सुझाव यहाँ दिखाई देंगे',
        recommendationDescription: 'अपने खेत की पर्यावरणीय स्थितियों के आधार पर उपयुक्त फसलें खोजने के लिए खेत जोड़ें।',
        conditions: 'खेत की स्थितियाँ',
        environmental: 'पर्यावरणीय स्थितियाँ',
        weather: 'खेत के मौसम की जानकारी',
        weatherDescription: 'अपने खेत को प्रभावित करने वाली पर्यावरणीय स्थितियों को जानने के लिए खेत पंजीकृत करें।',
        acres: 'एकड़',
        hectares: 'हेक्टेयर',
        guntha: 'गुंठा',
        loading: 'खेत लोड हो रहे हैं...',
        loadError: 'खेत लोड नहीं हो सके। कृपया पेज रीफ्रेश करें।',
    },
    kn: {
        welcome: 'Fhasal ಗೆ ಸ್ವಾಗತ!',
        welcomeDescription: 'ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಂಗಾತಿ. ಇಂದು ನಿಮ್ಮ ಹೊಲಗಳಿಗೆ ಉತ್ತಮ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳೋಣ.',
        overview: 'ಹೊಲದ ವಿವರ',
        registered: 'ನೋಂದಾಯಿತ ಹೊಲಗಳು',
        totalArea: 'ಒಟ್ಟು ಕೃಷಿ ಪ್ರದೇಶ',
        activeCrops: 'ಪ್ರಸ್ತುತ ಬೆಳೆಗಳು',
        cropComingSoon: 'ಬೆಳೆ ಟ್ರ್ಯಾಕಿಂಗ್ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ',
        yourFields: 'ನಿಮ್ಮ ಹೊಲಗಳು',
        viewAll: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',
        unnamed: 'ಹೆಸರಿಲ್ಲದ ಹೊಲ',
        locationMissing: 'ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿಲ್ಲ',
        fieldArea: 'ಹೊಲದ ವಿಸ್ತೀರ್ಣ',
        noFields: 'ಇನ್ನೂ ಯಾವುದೇ ಹೊಲಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ',
        noFieldsDescription: 'ಬೆಳೆ ಸಲಹೆಗಳು ಮತ್ತು NASA ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ಕೃಷಿ ಭೂಮಿಯನ್ನು ಸೇರಿಸಿ.',
        registerField: 'ನಿಮ್ಮ ಮೊದಲ ಹೊಲವನ್ನು ನೋಂದಾಯಿಸಿ',
        viewRegistered: 'ಎಲ್ಲಾ ನೋಂದಾಯಿತ ಹೊಲಗಳನ್ನು ನೋಡಿ',
        recommendations: 'ಬೆಳೆ ಸಲಹೆಗಳು',
        recommendationTitle: 'ನಿಮ್ಮ ಬೆಳೆ ಸಲಹೆಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ',
        recommendationDescription: 'ನಿಮ್ಮ ಹೊಲದ ಪರಿಸರ ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯಲು ಹೊಲಗಳನ್ನು ಸೇರಿಸಿ.',
        conditions: 'ಹೊಲದ ಪರಿಸ್ಥಿತಿಗಳು',
        environmental: 'ಪರಿಸರ ಪರಿಸ್ಥಿತಿಗಳು',
        weather: 'ಹೊಲದ ಹವಾಮಾನ ಮಾಹಿತಿ',
        weatherDescription: 'ನಿಮ್ಮ ಕೃಷಿ ಭೂಮಿಯ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುವ ಪರಿಸರ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ತಿಳಿಯಲು ಹೊಲಗಳನ್ನು ನೋಂದಾಯಿಸಿ.',
        acres: 'ಎಕರೆ',
        hectares: 'ಹೆಕ್ಟೇರ್',
        guntha: 'ಗುಂಟೆ',
        loading: 'ನಿಮ್ಮ ಹೊಲಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
        loadError: 'ಹೊಲಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
    },
    mr: {
        welcome: 'Fhasal मध्ये आपले स्वागत आहे!',
        welcomeDescription: 'तुमचा स्मार्ट शेती साथीदार. आज आपल्या शेतांसाठी चांगले निर्णय घेऊया.',
        overview: 'शेतीचा आढावा',
        registered: 'नोंदणीकृत शेते',
        totalArea: 'एकूण शेती क्षेत्र',
        activeCrops: 'सक्रिय पिके',
        cropComingSoon: 'पीक ट्रॅकिंग लवकरच उपलब्ध होईल',
        yourFields: 'तुमची शेते',
        viewAll: 'सर्व पहा',
        unnamed: 'नाव नसलेले शेत',
        locationMissing: 'स्थान नमूद केलेले नाही',
        fieldArea: 'शेताचे क्षेत्रफळ',
        noFields: 'अद्याप कोणतेही शेत जोडलेले नाही',
        noFieldsDescription: 'पीक सल्ला आणि NASA आधारित माहिती मिळवण्यासाठी तुमची शेतजमीन जोडा.',
        registerField: 'तुमचे पहिले शेत नोंदवा',
        viewRegistered: 'सर्व नोंदणीकृत शेते पहा',
        recommendations: 'पीक शिफारसी',
        recommendationTitle: 'तुमच्या पीक शिफारसी येथे दिसतील',
        recommendationDescription: 'तुमच्या शेतातील पर्यावरणीय परिस्थितीनुसार योग्य पिके शोधण्यासाठी शेते जोडा.',
        conditions: 'शेतीची परिस्थिती',
        environmental: 'पर्यावरणीय परिस्थिती',
        weather: 'शेती हवामान माहिती',
        weatherDescription: 'तुमच्या शेतजमिनीवर परिणाम करणाऱ्या पर्यावरणीय परिस्थिती जाणून घेण्यासाठी शेते नोंदवा.',
        acres: 'एकर',
        hectares: 'हेक्टर',
        guntha: 'गुंठे',
        loading: 'शेते लोड होत आहेत...',
        loadError: 'शेते लोड करता आली नाहीत.',
    },
    te: {
        welcome: 'Fhasal కు స్వాగతం!',
        welcomeDescription: 'మీ స్మార్ట్ వ్యవసాయ సహచరుడు. ఈరోజు మీ పొలాల కోసం మంచి నిర్ణయాలు తీసుకుందాం.',
        overview: 'వ్యవసాయ అవలోకనం',
        registered: 'నమోదు చేసిన పొలాలు',
        totalArea: 'మొత్తం వ్యవసాయ విస్తీర్ణం',
        activeCrops: 'ప్రస్తుత పంటలు',
        cropComingSoon: 'పంట ట్రాకింగ్ త్వరలో అందుబాటులోకి వస్తుంది',
        yourFields: 'మీ పొలాలు',
        viewAll: 'అన్నీ చూడండి',
        unnamed: 'పేరు లేని పొలం',
        locationMissing: 'ప్రాంతం పేర్కొనలేదు',
        fieldArea: 'పొలం విస్తీర్ణం',
        noFields: 'ఇంకా పొలాలు జోడించలేదు',
        noFieldsDescription: 'పంట సిఫార్సులు మరియు NASA ఆధారిత సమాచారం పొందడానికి మీ వ్యవసాయ భూమిని జోడించండి.',
        registerField: 'మీ మొదటి పొలాన్ని నమోదు చేయండి',
        viewRegistered: 'నమోదు చేసిన అన్ని పొలాలను చూడండి',
        recommendations: 'పంట సిఫార్సులు',
        recommendationTitle: 'మీ పంట సిఫార్సులు ఇక్కడ కనిపిస్తాయి',
        recommendationDescription: 'మీ పొలంలోని పర్యావరణ పరిస్థితులకు అనుగుణమైన పంటలను కనుగొనడానికి పొలాలను జోడించండి.',
        conditions: 'వ్యవసాయ పరిస్థితులు',
        environmental: 'పర్యావరణ పరిస్థితులు',
        weather: 'వ్యవసాయ వాతావరణ సమాచారం',
        weatherDescription: 'మీ వ్యవసాయ భూమిని ప్రభావితం చేసే పర్యావరణ పరిస్థితులను తెలుసుకోవడానికి పొలాలను నమోదు చేయండి.',
        acres: 'ఎకరాలు',
        hectares: 'హెక్టార్లు',
        guntha: 'గుంటలు',
        loading: 'పొలాలు లోడ్ అవుతున్నాయి...',
        loadError: 'పొలాలను లోడ్ చేయడం సాధ్యం కాలేదు.',
    },
    ta: {
        welcome: 'Fhasal-க்கு வரவேற்கிறோம்!',
        welcomeDescription: 'உங்கள் ஸ்மார்ட் விவசாயத் துணைவர். இன்று உங்கள் வயல்களுக்கு சிறந்த முடிவுகளை எடுப்போம்.',
        overview: 'வயல் கண்ணோட்டம்',
        registered: 'பதிவு செய்யப்பட்ட வயல்கள்',
        totalArea: 'மொத்த விவசாயப் பரப்பளவு',
        activeCrops: 'செயலில் உள்ள பயிர்கள்',
        cropComingSoon: 'பயிர் கண்காணிப்பு விரைவில் கிடைக்கும்',
        yourFields: 'உங்கள் வயல்கள்',
        viewAll: 'அனைத்தையும் காண்க',
        unnamed: 'பெயரிடப்படாத வயல்',
        locationMissing: 'இடம் குறிப்பிடப்படவில்லை',
        fieldArea: 'வயல் பரப்பளவு',
        noFields: 'இதுவரை வயல்கள் சேர்க்கப்படவில்லை',
        noFieldsDescription: 'பயிர் பரிந்துரைகள் மற்றும் NASA தகவல்களைப் பெற உங்கள் விவசாய நிலத்தைச் சேர்க்கவும்.',
        registerField: 'உங்கள் முதல் வயலைப் பதிவு செய்யுங்கள்',
        viewRegistered: 'பதிவு செய்யப்பட்ட அனைத்து வயல்களையும் காண்க',
        recommendations: 'பயிர் பரிந்துரைகள்',
        recommendationTitle: 'உங்கள் பயிர் பரிந்துரைகள் இங்கே தோன்றும்',
        recommendationDescription: 'உங்கள் வயலின் சுற்றுச்சூழல் நிலைமைகளுக்கு ஏற்ற பயிர்களைக் கண்டறிய வயல்களைச் சேர்க்கவும்.',
        conditions: 'வயல் நிலைமைகள்',
        environmental: 'சுற்றுச்சூழல் நிலைமைகள்',
        weather: 'வயல் வானிலைத் தகவல்கள்',
        weatherDescription: 'உங்கள் விவசாய நிலத்தைப் பாதிக்கும் சுற்றுச்சூழல் நிலைமைகளை அறிய வயல்களைப் பதிவு செய்யுங்கள்.',
        acres: 'ஏக்கர்',
        hectares: 'ஹெக்டேர்',
        guntha: 'குண்டா',
        loading: 'வயல்கள் ஏற்றப்படுகின்றன...',
        loadError: 'வயல்களை ஏற்ற முடியவில்லை.',
    },
    bn: {
        welcome: 'Fhasal-এ স্বাগতম!',
        welcomeDescription: 'আপনার স্মার্ট কৃষি সঙ্গী। আজ আপনার জমির জন্য আরও ভালো সিদ্ধান্ত নেওয়া যাক।',
        overview: 'খামারের বিবরণ',
        registered: 'নিবন্ধিত জমি',
        totalArea: 'মোট কৃষি জমির পরিমাণ',
        activeCrops: 'সক্রিয় ফসল',
        cropComingSoon: 'ফসল ট্র্যাকিং শীঘ্রই আসছে',
        yourFields: 'আপনার জমি',
        viewAll: 'সব দেখুন',
        unnamed: 'নামহীন জমি',
        locationMissing: 'অবস্থান উল্লেখ করা হয়নি',
        fieldArea: 'জমির পরিমাণ',
        noFields: 'এখনও কোনো জমি যোগ করা হয়নি',
        noFieldsDescription: 'ফসলের পরামর্শ এবং NASA-ভিত্তিক তথ্য পেতে আপনার কৃষিজমি যোগ করুন।',
        registerField: 'আপনার প্রথম জমি নিবন্ধন করুন',
        viewRegistered: 'সব নিবন্ধিত জমি দেখুন',
        recommendations: 'ফসলের সুপারিশ',
        recommendationTitle: 'আপনার ফসলের সুপারিশ এখানে দেখা যাবে',
        recommendationDescription: 'আপনার জমির পরিবেশগত অবস্থার ভিত্তিতে উপযুক্ত ফসল খুঁজতে জমি যোগ করুন।',
        conditions: 'জমির অবস্থা',
        environmental: 'পরিবেশগত অবস্থা',
        weather: 'জমির আবহাওয়ার তথ্য',
        weatherDescription: 'আপনার কৃষিজমিকে প্রভাবিত করা পরিবেশগত অবস্থা জানতে জমি নিবন্ধন করুন।',
        acres: 'একর',
        hectares: 'হেক্টর',
        guntha: 'গুন্থা',
        loading: 'জমি লোড হচ্ছে...',
        loadError: 'জমি লোড করা যায়নি।',
    },
}

// Convert an area from one unit to another
const convertArea = (area, fromUnit, toUnit) => {
    const numericArea = Number(area) || 0

    const normalizedFrom = String(fromUnit || 'acre').toLowerCase()
    const normalizedTo = String(toUnit || 'acre').toLowerCase()

    const squareMetres = numericArea * (
        AREA_CONVERSIONS[normalizedFrom] || AREA_CONVERSIONS.acre
    )

    return squareMetres / (
        AREA_CONVERSIONS[normalizedTo] || AREA_CONVERSIONS.acre
    )
}

const Dashboard = () => {
    const { fields = [], loading, error } = useFields()
    const { settings } = useSettings()

    const languageCode = settings?.languageCode || 'en'

    const t = (key) => (
        dashboardTranslations[languageCode]?.[key] ??
        dashboardTranslations.en[key] ??
        key
    )

    const selectedUnit = String(settings?.areaUnit || 'acre')
        .toLowerCase()

    const unitLabel = {
        acre: t('acres'),
        acres: t('acres'),
        hectare: t('hectares'),
        hectares: t('hectares'),
        guntha: t('guntha'),
        gunthas: t('guntha'),
    }[selectedUnit] || t('acres')

    // Calculate total farming area from backend fields
    const totalArea = fields.reduce((total, field) => {
        return total + convertArea(
            field.fieldArea ?? field.area ?? 0,
            field.areaUnit ?? field.unit ?? 'acre',
            selectedUnit
        )
    }, 0)

    const formattedArea = totalArea.toFixed(2)

    // Calculate active crops from registered fields
    const activeCropsList = fields.filter(
        (f) => f.currentCrop && String(f.currentCrop).trim() !== ''
    )
    const uniqueCrops = [
        ...new Set(activeCropsList.map((f) => String(f.currentCrop).trim())),
    ]

    return (
        <div className="p-4 md:p-8">

            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#344334]">
                    {t('welcome')}
                </h1>

                <p className="mt-2 text-[#7A8475]">
                    {t('welcomeDescription')}
                </p>
            </div>

            {/* Loading and Error Messages */}
            {loading && (
                <div className="mb-6 p-4 bg-white rounded-xl border border-[#E4E9DE] text-sm text-[#7A8475]">
                    {t('loading')}
                </div>
            )}

            {!loading && error && (
                <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {t('loadError')}
                </div>
            )}

            {/* Farm Overview */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-[#344334] mb-4">
                    {t('overview')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Registered Fields */}
                    <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-fhasal-green-light flex items-center justify-center shrink-0">
                                <img
                                    src={RegisteredFieldsIcon}
                                    className="w-12 h-12 object-contain"
                                    alt={t('registered')}
                                />
                            </div>

                            <div>
                                <p className="text-sm text-[#7A8475]">
                                    {t('registered')}
                                </p>
                                <h3 className="text-2xl font-bold text-[#344334]">
                                    {loading ? '—' : fields.length}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Total Farming Area */}
                    <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-fhasal-wheat flex items-center justify-center shrink-0">
                                <img
                                    src={FarmingAreaIcon}
                                    alt={t('totalArea')}
                                    className="w-12 h-12 object-contain"
                                />
                            </div>

                            <div>
                                <p className="text-sm text-[#7A8475]">
                                    {t('totalArea')}
                                </p>

                                <h3 className="text-2xl font-bold text-[#344334]">
                                    {loading ? '—' : formattedArea}{' '}
                                    <span className="text-sm font-medium text-[#7A8475]">
                                        {unitLabel}
                                    </span>
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Active Crops */}
                    <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-fhasal-green-light flex items-center justify-center shrink-0">
                                <img
                                    src={ActiveCropsIcon}
                                    className="w-12 h-12 object-contain"
                                    alt={t('activeCrops')}
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm text-[#7A8475]">
                                    {t('activeCrops')}
                                </p>
                                <h3 className="text-2xl font-bold text-[#344334]">
                                    {loading ? '—' : uniqueCrops.length}
                                </h3>
                                <p className="text-xs text-[#7A8475] mt-1 truncate">
                                    {uniqueCrops.length > 0
                                        ? uniqueCrops.slice(0, 2).join(', ') +
                                          (uniqueCrops.length > 2
                                              ? ` +${uniqueCrops.length - 2}`
                                              : '')
                                        : fields.length > 0
                                          ? 'No crops assigned to fields'
                                          : t('cropComingSoon')}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Your Fields */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#344334]">
                        {t('yourFields')}
                    </h2>

                    <Link
                        to="/fields"
                        className="text-sm text-fhasal-green font-medium hover:underline flex items-center gap-1"
                    >
                        {t('viewAll')}
                        <ArrowRight size={15} />
                    </Link>
                </div>

                {loading ? (
                    <div className="bg-white rounded-2xl border border-[#E4E9DE] p-8 text-center text-sm text-[#7A8475]">
                        {t('loading')}
                    </div>
                ) : fields.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {fields.slice(0, 4).map((field) => {
                            const fieldId = field.id || field._id

                            const fieldArea = convertArea(
                                field.fieldArea ?? field.area ?? 0,
                                field.areaUnit ?? field.unit ?? 'acre',
                                selectedUnit
                            )

                            return (
                                <Link
                                    key={fieldId}
                                    to={`/fields/${fieldId}`}
                                    className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-3">

                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-11 h-11 rounded-xl bg-fhasal-green-light flex items-center justify-center shrink-0">
                                                <Map
                                                    size={22}
                                                    className="text-fhasal-green"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-[#344334] truncate">
                                                    {field.fieldName || t('unnamed')}
                                                </h3>

                                                <p className="text-sm text-[#7A8475] truncate">
                                                    {field.fieldLocation || field.location || t('locationMissing')}
                                                </p>
                                            </div>
                                        </div>

                                        <ArrowRight
                                            size={18}
                                            className="text-[#829187] shrink-0"
                                        />
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-[#E4E9DE]">
                                        <p className="text-xs text-[#7A8475]">
                                            {t('fieldArea')}
                                        </p>

                                        <p className="text-lg font-semibold text-[#344334] mt-1">
                                            {fieldArea.toFixed(2)}{' '}
                                            <span className="text-sm font-medium text-[#7A8475]">
                                                {unitLabel}
                                            </span>
                                        </p>
                                    </div>
                                </Link>
                            )
                        })}

                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-[#E4E9DE] p-8 shadow-sm text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-fhasal-green-light flex items-center justify-center">
                            <Map size={30} className="text-fhasal-green" />
                        </div>

                        <h3 className="text-lg font-semibold text-[#465746] mb-2">
                            {t('noFields')}
                        </h3>

                        <p className="text-sm text-[#7A8475] max-w-sm mx-auto">
                            {t('noFieldsDescription')}
                        </p>

                        <Link
                            to="/fields/add"
                            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-lg bg-[#347052] text-white text-sm font-medium hover:bg-[#285C42] transition-colors"
                        >
                            <Plus size={17} />
                            {t('registerField')}
                        </Link>
                    </div>
                )}

                {fields.length > 4 && !loading && (
                    <div className="text-center mt-4">
                        <Link
                            to="/fields"
                            className="text-sm text-fhasal-green font-medium hover:underline"
                        >
                            {t('viewRegistered')} ({fields.length})
                        </Link>
                    </div>
                )}
            </section>

            {/* Crop Recommendations */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#344334]">
                        {t('recommendations')}
                    </h2>
                    <Link
                        to="/recommendations"
                        className="text-sm text-fhasal-green font-medium hover:underline flex items-center gap-1"
                    >
                        {t('viewAll')}
                        <ArrowRight size={15} />
                    </Link>
                </div>

                <Link
                    to="/recommendations"
                    className="block bg-white rounded-2xl border border-[#E4E9DE] p-6 shadow-sm hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-fhasal-wheat flex items-center justify-center shrink-0">
                                <Lightbulb size={25} className="text-[#94712F]" />
                            </div>

                            <div>
                                <h3 className="text-base font-semibold text-[#465746] mb-1 group-hover:text-fhasal-green transition-colors">
                                    {fields.length > 0 ? 'Smart Crop Recommendations Ready' : t('recommendationTitle')}
                                </h3>

                                <p className="text-sm text-[#7A8475]">
                                    {fields.length > 0
                                        ? 'View tailored agronomic suitability scores, seasonal timelines, and water requirements for your fields.'
                                        : t('recommendationDescription')}
                                </p>
                            </div>
                        </div>

                        <ArrowRight
                            size={18}
                            className="text-[#829187] group-hover:text-fhasal-green group-hover:translate-x-1 transition-all shrink-0 mt-1"
                        />
                    </div>
                </Link>
            </section>

            {/* Farm Conditions */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#344334]">
                        {t('conditions')}
                    </h2>
                    <Link
                        to="/nasa-data"
                        className="text-sm text-fhasal-green font-medium hover:underline flex items-center gap-1"
                    >
                        View NASA Insights
                        <ArrowRight size={15} />
                    </Link>
                </div>

                <Link
                    to="/nasa-data"
                    className="block bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-center gap-4">

                        <div className="shrink-0">
                            <img
                                src={farmConditions}
                                alt={t('weather')}
                                className="w-24 h-24 object-contain"
                            />
                        </div>

                        <div className="w-px h-20 bg-[#E4E9DE] hidden sm:block"></div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#7A8475] mb-1">
                                {t('environmental')}
                            </p>

                            <h3 className="text-base font-semibold text-[#465746] mb-2 group-hover:text-fhasal-green transition-colors flex items-center justify-between">
                                <span>{t('weather')}</span>
                                <ArrowRight
                                    size={18}
                                    className="text-[#829187] group-hover:text-fhasal-green group-hover:translate-x-1 transition-all shrink-0"
                                />
                            </h3>

                            <p className="text-xs text-[#7A8475] leading-relaxed">
                                {t('weatherDescription')}
                            </p>
                        </div>

                    </div>
                </Link>
            </section>

        </div>
    )
}

export default Dashboard
