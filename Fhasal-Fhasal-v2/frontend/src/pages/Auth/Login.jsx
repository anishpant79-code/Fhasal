
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Sprout,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Leaf,
    ShieldCheck,
    CloudSun,
    Globe,
} from 'lucide-react'

import { useSettings } from '../../context/SettingsContext'
import { useAuth } from '../../context/AuthContext'
import FhasalMark from '../../assets/logos/fhasal-mark.svg'

const loginTranslations = {
    en: {
        selectLanguage: 'Select language',
        smartFarming: 'Smart Farming Platform',
        grow: 'Grow smarter.',
        farm: 'Farm better.',
        live: 'Live greener.',
        brandingDescription: 'Make informed farming decisions with intelligent crop recommendations, satellite insights and digital farm management.',
        weather: 'Weather Insights',
        weatherDescription: 'Understand changing farm conditions.',
        decisions: 'Smarter Decisions',
        decisionsDescription: 'Manage your farm with better insights.',
        welcome: 'WELCOME BACK',
        heading: 'Sign in to your account',
        subtitle: 'Welcome back! Please enter your details.',
        email: 'Email address',
        emailPlaceholder: 'Enter your email',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        remember: 'Remember me',
        forgot: 'Forgot password?',
        signIn: 'Sign in',
        signingIn: 'Signing in...',
        noAccount: "Don't have an account?",
        createAccount: 'Create an account',
        backHome: '← Back to home',
        enterDetails: 'Please enter your email and password.',
        invalidEmail: 'Please enter a valid email address.',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        loginError: 'Login failed. Please try again.',
    },
    hi: {
        selectLanguage: 'भाषा चुनें',
        smartFarming: 'स्मार्ट कृषि प्लेटफ़ॉर्म',
        grow: 'समझदारी से उगाएँ।',
        farm: 'बेहतर खेती करें।',
        live: 'हरियाली बढ़ाएँ।',
        brandingDescription: 'स्मार्ट फसल सुझावों, उपग्रह जानकारी और डिजिटल खेत प्रबंधन के साथ बेहतर कृषि निर्णय लें।',
        weather: 'मौसम की जानकारी',
        weatherDescription: 'बदलती कृषि परिस्थितियों को समझें।',
        decisions: 'बेहतर निर्णय',
        decisionsDescription: 'बेहतर जानकारी के साथ अपने खेत का प्रबंधन करें।',
        welcome: 'वापसी पर स्वागत है',
        heading: 'अपने खाते में लॉग इन करें',
        subtitle: 'वापसी पर स्वागत है! कृपया अपना विवरण दर्ज करें।',
        email: 'ईमेल पता',
        emailPlaceholder: 'अपना ईमेल दर्ज करें',
        password: 'पासवर्ड',
        passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
        remember: 'मुझे याद रखें',
        forgot: 'पासवर्ड भूल गए?',
        signIn: 'लॉग इन करें',
        signingIn: 'लॉग इन हो रहा है...',
        noAccount: 'क्या आपका खाता नहीं है?',
        createAccount: 'खाता बनाएँ',
        backHome: '← होम पर वापस जाएँ',
        enterDetails: 'कृपया अपना ईमेल और पासवर्ड दर्ज करें।',
        invalidEmail: 'कृपया सही ईमेल पता दर्ज करें।',
        showPassword: 'पासवर्ड दिखाएँ',
        hidePassword: 'पासवर्ड छिपाएँ',
        loginError: 'लॉग इन विफल हुआ। कृपया पुनः प्रयास करें।',
    },
    kn: {
        selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        smartFarming: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ವೇದಿಕೆ',
        grow: 'ಚುರುಕಾಗಿ ಬೆಳೆಸಿ.',
        farm: 'ಉತ್ತಮ ಕೃಷಿ ಮಾಡಿ.',
        live: 'ಹಸಿರಾಗಿ ಬದುಕಿ.',
        brandingDescription: 'ಬೆಳೆ ಶಿಫಾರಸುಗಳು, ಉಪಗ್ರಹ ಮಾಹಿತಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಕೃಷಿ ನಿರ್ವಹಣೆಯೊಂದಿಗೆ ಉತ್ತಮ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.',
        weather: 'ಹವಾಮಾನ ಮಾಹಿತಿ',
        weatherDescription: 'ಬದಲಾಗುತ್ತಿರುವ ಕೃಷಿ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.',
        decisions: 'ಉತ್ತಮ ನಿರ್ಧಾರಗಳು',
        decisionsDescription: 'ಉತ್ತಮ ಮಾಹಿತಿಯೊಂದಿಗೆ ನಿಮ್ಮ ಹೊಲವನ್ನು ನಿರ್ವಹಿಸಿ.',
        welcome: 'ಮತ್ತೆ ಸ್ವಾಗತ',
        heading: 'ನಿಮ್ಮ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ',
        subtitle: 'ಮತ್ತೆ ಸ್ವಾಗತ! ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.',
        email: 'ಇಮೇಲ್ ವಿಳಾಸ',
        emailPlaceholder: 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ',
        password: 'ಪಾಸ್‌ವರ್ಡ್',
        passwordPlaceholder: 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
        remember: 'ನನ್ನನ್ನು ನೆನಪಿಡಿ',
        forgot: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರುವಿರಾ?',
        signIn: 'ಲಾಗಿನ್ ಮಾಡಿ',
        signingIn: 'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...',
        noAccount: 'ನಿಮಗೆ ಖಾತೆ ಇಲ್ಲವೇ?',
        createAccount: 'ಖಾತೆ ರಚಿಸಿ',
        backHome: '← ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
        enterDetails: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.',
        invalidEmail: 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ.',
        showPassword: 'ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ',
        hidePassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆಮಾಡಿ',
        loginError: 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    },
    mr: {
        selectLanguage: 'भाषा निवडा',
        smartFarming: 'स्मार्ट शेती प्लॅटफॉर्म',
        grow: 'स्मार्ट पद्धतीने पिकवा.',
        farm: 'उत्तम शेती करा.',
        live: 'हिरवेगार जीवन जगा.',
        brandingDescription: 'पीक शिफारसी, उपग्रह माहिती आणि डिजिटल शेत व्यवस्थापनाच्या मदतीने योग्य शेती निर्णय घ्या.',
        weather: 'हवामान माहिती',
        weatherDescription: 'बदलत्या शेती परिस्थिती समजून घ्या.',
        decisions: 'उत्तम निर्णय',
        decisionsDescription: 'चांगल्या माहितीच्या आधारे तुमच्या शेताचे व्यवस्थापन करा.',
        welcome: 'पुन्हा स्वागत आहे',
        heading: 'तुमच्या खात्यात लॉग इन करा',
        subtitle: 'पुन्हा स्वागत आहे! कृपया तुमची माहिती भरा.',
        email: 'ईमेल पत्ता',
        emailPlaceholder: 'तुमचा ईमेल टाका',
        password: 'पासवर्ड',
        passwordPlaceholder: 'तुमचा पासवर्ड टाका',
        remember: 'माझी माहिती लक्षात ठेवा',
        forgot: 'पासवर्ड विसरलात?',
        signIn: 'लॉग इन करा',
        signingIn: 'लॉग इन होत आहे...',
        noAccount: 'तुमचे खाते नाही?',
        createAccount: 'खाते तयार करा',
        backHome: '← मुख्यपृष्ठावर परत जा',
        enterDetails: 'कृपया तुमचा ईमेल आणि पासवर्ड टाका.',
        invalidEmail: 'कृपया योग्य ईमेल पत्ता टाका.',
        showPassword: 'पासवर्ड दाखवा',
        hidePassword: 'पासवर्ड लपवा',
        loginError: 'लॉग इन अयशस्वी झाले. पुन्हा प्रयत्न करा.',
    },
    te: {
        selectLanguage: 'భాషను ఎంచుకోండి',
        smartFarming: 'స్మార్ట్ వ్యవసాయ వేదిక',
        grow: 'తెలివిగా పండించండి.',
        farm: 'మెరుగైన వ్యవసాయం చేయండి.',
        live: 'పచ్చదనంతో జీవించండి.',
        brandingDescription: 'పంట సిఫార్సులు, ఉపగ్రహ సమాచారం మరియు డిజిటల్ వ్యవసాయ నిర్వహణతో మెరుగైన నిర్ణయాలు తీసుకోండి.',
        weather: 'వాతావరణ సమాచారం',
        weatherDescription: 'మారుతున్న వ్యవసాయ పరిస్థితులను అర్థం చేసుకోండి.',
        decisions: 'మెరుగైన నిర్ణయాలు',
        decisionsDescription: 'మెరుగైన సమాచారంతో మీ పొలాన్ని నిర్వహించండి.',
        welcome: 'తిరిగి స్వాగతం',
        heading: 'మీ ఖాతాలోకి లాగిన్ అవ్వండి',
        subtitle: 'తిరిగి స్వాగతం! దయచేసి మీ వివరాలను నమోదు చేయండి.',
        email: 'ఈమెయిల్ చిరునామా',
        emailPlaceholder: 'మీ ఈమెయిల్ నమోదు చేయండి',
        password: 'పాస్‌వర్డ్',
        passwordPlaceholder: 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
        remember: 'నన్ను గుర్తుంచుకోండి',
        forgot: 'పాస్‌వర్డ్ మర్చిపోయారా?',
        signIn: 'లాగిన్ అవ్వండి',
        signingIn: 'లాగిన్ అవుతోంది...',
        noAccount: 'మీకు ఖాతా లేదా?',
        createAccount: 'ఖాతా సృష్టించండి',
        backHome: '← హోమ్‌కు తిరిగి వెళ్లండి',
        enterDetails: 'దయచేసి మీ ఈమెయిల్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.',
        invalidEmail: 'దయచేసి సరైన ఈమెయిల్ చిరునామా నమోదు చేయండి.',
        showPassword: 'పాస్‌వర్డ్ చూపించు',
        hidePassword: 'పాస్‌వర్డ్ దాచు',
        loginError: 'లాగిన్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    },
    ta: {
        selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
        smartFarming: 'ஸ்மார்ட் விவசாய தளம்',
        grow: 'புத்திசாலித்தனமாக பயிரிடுங்கள்.',
        farm: 'சிறந்த விவசாயம் செய்யுங்கள்.',
        live: 'பசுமையாக வாழுங்கள்.',
        brandingDescription: 'பயிர் பரிந்துரைகள், செயற்கைக்கோள் தகவல்கள் மற்றும் டிஜிட்டல் பண்ணை மேலாண்மை மூலம் சிறந்த முடிவுகளை எடுங்கள்.',
        weather: 'வானிலை தகவல்கள்',
        weatherDescription: 'மாறிவரும் விவசாய நிலைமைகளைப் புரிந்துகொள்ளுங்கள்.',
        decisions: 'சிறந்த முடிவுகள்',
        decisionsDescription: 'சிறந்த தகவல்களுடன் உங்கள் பண்ணையை நிர்வகிக்கவும்.',
        welcome: 'மீண்டும் வரவேற்கிறோம்',
        heading: 'உங்கள் கணக்கில் உள்நுழையுங்கள்',
        subtitle: 'மீண்டும் வரவேற்கிறோம்! உங்கள் விவரங்களை உள்ளிடவும்.',
        email: 'மின்னஞ்சல் முகவரி',
        emailPlaceholder: 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
        password: 'கடவுச்சொல்',
        passwordPlaceholder: 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்',
        remember: 'என்னை நினைவில் வைத்துக்கொள்ளுங்கள்',
        forgot: 'கடவுச்சொல் மறந்துவிட்டதா?',
        signIn: 'உள்நுழையுங்கள்',
        signingIn: 'உள்நுழைகிறது...',
        noAccount: 'உங்களிடம் கணக்கு இல்லையா?',
        createAccount: 'கணக்கை உருவாக்குங்கள்',
        backHome: '← முகப்புக்குத் திரும்புங்கள்',
        enterDetails: 'உங்கள் மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.',
        invalidEmail: 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.',
        showPassword: 'கடவுச்சொல்லைக் காட்டவும்',
        hidePassword: 'கடவுச்சொல்லை மறைக்கவும்',
        loginError: 'உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
    },
    bn: {
        selectLanguage: 'ভাষা নির্বাচন করুন',
        smartFarming: 'স্মার্ট কৃষি প্ল্যাটফর্ম',
        grow: 'বুদ্ধিমত্তার সঙ্গে চাষ করুন।',
        farm: 'আরও ভালো কৃষিকাজ করুন।',
        live: 'সবুজভাবে বাঁচুন।',
        brandingDescription: 'ফসলের সুপারিশ, স্যাটেলাইট তথ্য এবং ডিজিটাল কৃষি ব্যবস্থাপনার মাধ্যমে সঠিক সিদ্ধান্ত নিন।',
        weather: 'আবহাওয়ার তথ্য',
        weatherDescription: 'পরিবর্তনশীল কৃষি পরিস্থিতি বুঝুন।',
        decisions: 'উন্নত সিদ্ধান্ত',
        decisionsDescription: 'আরও ভালো তথ্যের সাহায্যে আপনার জমি পরিচালনা করুন।',
        welcome: 'আবার স্বাগতম',
        heading: 'আপনার অ্যাকাউন্টে লগইন করুন',
        subtitle: 'আবার স্বাগতম! অনুগ্রহ করে আপনার তথ্য লিখুন।',
        email: 'ইমেল ঠিকানা',
        emailPlaceholder: 'আপনার ইমেল লিখুন',
        password: 'পাসওয়ার্ড',
        passwordPlaceholder: 'আপনার পাসওয়ার্ড লিখুন',
        remember: 'আমাকে মনে রাখুন',
        forgot: 'পাসওয়ার্ড ভুলে গেছেন?',
        signIn: 'লগইন করুন',
        signingIn: 'লগইন হচ্ছে...',
        noAccount: 'আপনার কি অ্যাকাউন্ট নেই?',
        createAccount: 'অ্যাকাউন্ট তৈরি করুন',
        backHome: '← হোমে ফিরে যান',
        enterDetails: 'অনুগ্রহ করে আপনার ইমেল এবং পাসওয়ার্ড লিখুন।',
        invalidEmail: 'অনুগ্রহ করে সঠিক ইমেল ঠিকানা লিখুন।',
        showPassword: 'পাসওয়ার্ড দেখান',
        hidePassword: 'পাসওয়ার্ড লুকান',
        loginError: 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
    },
}

const Login = () => {
    const navigate = useNavigate()

    const { settings, updateLanguage, supportedLanguages } = useSettings()
    const { login } = useAuth()

    const languageCode = settings.languageCode || 'en'
    const language = loginTranslations[languageCode] || loginTranslations.en

    const t = (key) => language[key] || loginTranslations.en[key] || key

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setFormData((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }))

        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.email.trim() || !formData.password) {
            setError(t('enterDetails'))
            return
        }

        const email = formData.email.trim().toLowerCase()
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email)) {
            setError(t('invalidEmail'))
            return
        }

        try {
            setIsLoading(true)
            setError('')

            await login(email, formData.password)

            navigate('/dashboard', { replace: true })
        } catch (error) {
            console.error('Login failed:', error)

            setError(
                error.response?.data?.message || t('loginError')
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F8F4] flex">

            {/* Left Branding Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#347052] relative overflow-hidden items-center justify-center p-12">

                <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5" />
                <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-white/5" />

                <div className="relative z-10 max-w-lg text-white">

                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-12 h-12 bg-white rounded-2xl p-2 flex items-center justify-center shadow-md">
                            <img src={FhasalMark} alt="Fhasal logo" className="w-full h-full object-contain" />
                        </div>

                        <span className="text-3xl font-bold tracking-tight">
                            Fhasal
                        </span>
                    </div>

                    <div className="mb-8">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm">
                            <Leaf size={16} />
                            {t('smartFarming')}
                        </span>
                    </div>

                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        {t('grow')}
                        <br />
                        {t('farm')}
                        <br />
                        {t('live')}
                    </h1>

                    <p className="text-white/80 text-lg leading-8 mb-12">
                        {t('brandingDescription')}
                    </p>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
                            <CloudSun size={25} className="mb-3" />
                            <h3 className="font-semibold mb-1">
                                {t('weather')}
                            </h3>
                            <p className="text-sm text-white/70">
                                {t('weatherDescription')}
                            </p>
                        </div>

                        <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
                            <ShieldCheck size={25} className="mb-3" />
                            <h3 className="font-semibold mb-1">
                                {t('decisions')}
                            </h3>
                            <p className="text-sm text-white/70">
                                {t('decisionsDescription')}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Right Login Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10 sm:px-10">

                <div className="w-full max-w-md">

                    {/* Mobile Branding */}
                    <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
                        <img src={FhasalMark} alt="Fhasal logo" className="w-10 h-10 object-contain" />

                        <span className="text-3xl font-bold text-[#347052]">
                            Fhasal
                        </span>
                    </div>

                    {/* Language Selector */}
                    <div className="flex justify-end mb-8">
                        <div className="relative">
                            <Globe
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#347052] pointer-events-none"
                            />

                            <select
                                value={languageCode}
                                onChange={(e) => updateLanguage(e.target.value)}
                                aria-label={t('selectLanguage')}
                                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-[#347052]"
                            >
                                {supportedLanguages.map((languageOption) => (
                                    <option
                                        key={languageOption.code}
                                        value={languageOption.code}
                                    >
                                        {languageOption.nativeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-sm font-semibold text-[#347052] mb-3">
                            {t('welcome')}
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                            {t('heading')}
                        </h2>

                        <p className="text-gray-500">
                            {t('subtitle')}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div
                            role="alert"
                            className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                {t('email')}
                            </label>

                            <div className="relative">
                                <Mail
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder={t('emailPlaceholder')}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white outline-none transition focus:border-[#347052] focus:ring-4 focus:ring-[#347052]/10"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                {t('password')}
                            </label>

                            <div className="relative">
                                <Lock
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder={t('passwordPlaceholder')}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white outline-none transition focus:border-[#347052] focus:ring-4 focus:ring-[#347052]/10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#347052]"
                                    aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex items-center justify-between gap-3">

                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 accent-[#347052]"
                                />
                                {t('remember')}
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-sm font-semibold text-[#347052] hover:underline"
                            >
                                {t('forgot')}
                            </Link>

                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#347052] hover:bg-[#28583F] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-[#347052]/20 transition"
                        >
                            {isLoading ? t('signingIn') : t('signIn')}

                            {!isLoading && <ArrowRight size={19} />}
                        </button>

                    </form>

                    {/* Signup Link */}
                    <p className="text-center text-sm text-gray-500 mt-8">
                        {t('noAccount')}{' '}
                        <Link
                            to="/signup"
                            className="font-bold text-[#347052] hover:underline"
                        >
                            {t('createAccount')}
                        </Link>
                    </p>

                    {/* Back to Home */}
                    <div className="text-center mt-8">
                        <Link
                            to="/"
                            className="text-sm text-gray-400 hover:text-[#347052] transition"
                        >
                            {t('backHome')}
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login
