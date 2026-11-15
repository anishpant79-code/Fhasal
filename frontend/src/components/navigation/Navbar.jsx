
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Bell,
    ChevronDown,
    CircleUserRound,
    Languages,
    LogOut,
} from 'lucide-react'

import FhasalMark from '../../assets/logos/fhasal-mark.svg'
import { useNotifications } from '../../context/NotificationContext'
import { useSettings } from '../../context/SettingsContext'
import { useAuth } from '../../context/AuthContext'
import { getTranslation } from '../../utils/translations'

const navbarTranslations = {
    en: {
        user: 'User',
        farmer: 'Farmer',
        openNotifications: 'Open notifications',
        unread: 'unread',
        profile: 'Open user profile',
        logout: 'Logout',
    },
    hi: {
        user: 'उपयोगकर्ता',
        farmer: 'किसान',
        openNotifications: 'सूचनाएँ खोलें',
        unread: 'अपठित',
        profile: 'उपयोगकर्ता प्रोफ़ाइल खोलें',
        logout: 'लॉग आउट',
    },
    kn: {
        user: 'ಬಳಕೆದಾರ',
        farmer: 'ರೈತ',
        openNotifications: 'ಅಧಿಸೂಚನೆಗಳನ್ನು ತೆರೆಯಿರಿ',
        unread: 'ಓದದಿರುವ',
        profile: 'ಬಳಕೆದಾರರ ಪ್ರೊಫೈಲ್ ತೆರೆಯಿರಿ',
        logout: 'ಲಾಗ್ ಔಟ್',
    },
    mr: {
        user: 'वापरकर्ता',
        farmer: 'शेतकरी',
        openNotifications: 'सूचना उघडा',
        unread: 'न वाचलेल्या',
        profile: 'वापरकर्ता प्रोफाइल उघडा',
        logout: 'बाहेर पडा',
    },
    te: {
        user: 'వినియోగదారు',
        farmer: 'రైతు',
        openNotifications: 'నోటిఫికేషన్‌లను తెరవండి',
        unread: 'చదవని',
        profile: 'వినియోగదారు ప్రొఫైల్ తెరవండి',
        logout: 'లాగ్ అవుట్',
    },
    ta: {
        user: 'பயனர்',
        farmer: 'விவசாயி',
        openNotifications: 'அறிவிப்புகளைத் திறக்கவும்',
        unread: 'படிக்காத',
        profile: 'பயனர் சுயவிவரத்தைத் திறக்கவும்',
        logout: 'வெளியேறு',
    },
    bn: {
        user: 'ব্যবহারকারী',
        farmer: 'কৃষক',
        openNotifications: 'বিজ্ঞপ্তি খুলুন',
        unread: 'অপঠিত',
        profile: 'ব্যবহারকারীর প্রোফাইল খুলুন',
        logout: 'লগ আউট',
    },
}

const Navbar = () => {
    const navigate = useNavigate()

    const { unreadCount } = useNotifications()

    const {
        settings,
        updateLanguage,
        supportedLanguages,
    } = useSettings()

    const { user, logout } = useAuth()

    const languageCode = settings.languageCode || 'en'

    const t = (key) => getTranslation(languageCode, key)

    const navText =
        navbarTranslations[languageCode] || navbarTranslations.en

    const handleLanguageChange = (event) => {
        updateLanguage(event.target.value)
    }

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <nav className="w-full min-h-16 bg-white border-b border-[#E5EAE1] px-4 md:px-6 flex items-center justify-between gap-3">

            {/* Brand Section */}
            <Link
                to="/dashboard"
                className="flex items-center gap-2 shrink-0"
            >
                <img
                    src={FhasalMark}
                    alt="Fhasal logo"
                    className="w-9 h-9 object-contain"
                />

                <h1 className="text-xl font-bold text-[#174B35]">
                    Fhasal
                </h1>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">

                {/* Language Selector */}
                <div className="flex items-center gap-1.5 px-2 py-2 rounded-lg hover:bg-[#F5F8F4] transition-colors">
                    <Languages
                        size={18}
                        className="text-[#456354] shrink-0"
                    />

                    <select
                        value={languageCode}
                        onChange={handleLanguageChange}
                        aria-label={t('selectLanguage')}
                        className="max-w-[105px] sm:max-w-none bg-transparent text-sm font-medium text-[#456354] outline-none cursor-pointer"
                    >
                        {supportedLanguages.map((language) => (
                            <option
                                key={language.code}
                                value={language.code}
                            >
                                {language.nativeName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Notifications */}
                <Link
                    to="/notifications"
                    aria-label={`${navText.openNotifications}. ${unreadCount} ${navText.unread}`}
                    title={`${unreadCount} ${navText.unread}`}
                    className="relative p-2 rounded-full text-[#456354] hover:bg-[#F0F5F0] transition-colors"
                >
                    <Bell
                        size={21}
                        strokeWidth={1.8}
                    />

                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Link>

                {/* User Profile */}
                <Link
                    to="/profile"
                    aria-label={navText.profile}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F5F8F4] transition-colors"
                >
                    <div className="w-9 h-9 rounded-full bg-[#E7F0E8] flex items-center justify-center text-[#174B35]">
                        <CircleUserRound
                            size={22}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-[#263D30]">
                            {user?.name || navText.user}
                        </p>

                        <p className="text-xs text-[#829187]">
                            {navText.farmer}
                        </p>
                    </div>

                    <ChevronDown
                        size={16}
                        className="hidden sm:block text-[#829187]"
                    />
                </Link>

                {/* Logout */}
                <button
                    type="button"
                    onClick={handleLogout}
                    title={navText.logout}
                    aria-label={navText.logout}
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">
                        {navText.logout}
                    </span>
                </button>

            </div>
        </nav>
    )
}

export default Navbar
