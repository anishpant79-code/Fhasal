import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Bell,
    ChevronDown,
    CircleUserRound,
    LogOut,
    Menu,
    User,
    Map,
    Settings as SettingsIcon,
} from 'lucide-react'

import FhasalMark from '../../assets/logos/fhasal-mark.svg'
import LanguageSelector from '../common/LanguageSelector'
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
        myProfile: 'My Profile',
        myFields: 'My Fields',
        accountSettings: 'Settings',
        notifications: 'Notifications',
        account: 'Farmer Account',
    },
    hi: {
        user: 'उपयोगकर्ता',
        farmer: 'किसान',
        openNotifications: 'सूचनाएँ खोलें',
        unread: 'अपठित',
        profile: 'उपयोगकर्ता प्रोफ़ाइल खोलें',
        logout: 'लॉग आउट',
        myProfile: 'मेरी प्रोफ़ाइल',
        myFields: 'मेरे खेत',
        accountSettings: 'सेटिंग्स',
        notifications: 'सूचनाएँ',
        account: 'किसान खाता',
    },
    kn: {
        user: 'ಬಳಕೆದಾರ',
        farmer: 'ರೈತ',
        openNotifications: 'ಅಧಿಸೂಚನೆಗಳನ್ನು ತೆರೆಯಿರಿ',
        unread: 'ಓದದಿರುವ',
        profile: 'ಬಳಕೆದಾರರ ಪ್ರೊಫೈಲ್ ತೆರೆಯಿರಿ',
        logout: 'ಲಾಗ್ ಔಟ್',
        myProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
        myFields: 'ನನ್ನ ಹೊಲಗಳು',
        accountSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        notifications: 'ಅಧಿಸೂಚನೆಗಳು',
        account: 'ರೈತ ಖಾತೆ',
    },
    mr: {
        user: 'वापरकर्ता',
        farmer: 'शेतकरी',
        openNotifications: 'सूचना उघडा',
        unread: 'न वाचलेल्या',
        profile: 'वापरकर्ता प्रोफाइल उघडा',
        logout: 'बाहेर पडा',
        myProfile: 'माझे प्रोफाइल',
        myFields: 'माझी शेते',
        accountSettings: 'सेटिंग्ज',
        notifications: 'सूचना',
        account: 'शेतकरी खाते',
    },
    te: {
        user: 'వినియోగదారు',
        farmer: 'రైతు',
        openNotifications: 'నోటిఫికేషన్‌లను తెరవండి',
        unread: 'చదవని',
        profile: 'వినియోగదారు ప్రొఫైల్ తెరవండి',
        logout: 'లాగ్ అవుట్',
        myProfile: 'నా ప్రొఫైల్',
        myFields: 'నా పొలాలు',
        accountSettings: 'సెట్టింగ్‌లు',
        notifications: 'నోటిఫికేషన్‌లు',
        account: 'రైతు ఖాతా',
    },
    ta: {
        user: 'பயனர்',
        farmer: 'விவசாயி',
        openNotifications: 'அறிவிப்புகளைத் திறக்கவும்',
        unread: 'படிக்காத',
        profile: 'பயனர் சுயவிவரத்தைத் திறக்கவும்',
        logout: 'வெளியேறு',
        myProfile: 'எனது சுயவிவரம்',
        myFields: 'எனது வயல்கள்',
        accountSettings: 'அமைப்புகள்',
        notifications: 'அறிவிப்புகள்',
        account: 'விவசாயி கணக்கு',
    },
    bn: {
        user: 'ব্যবহারকারী',
        farmer: 'কৃষক',
        openNotifications: 'বিজ্ঞপ্তি খুলুন',
        unread: 'অপঠিত',
        profile: 'ব্যবহারকারীর প্রোফাইল খুলুন',
        logout: 'লগ আউট',
        myProfile: 'আমার প্রোফাইল',
        myFields: 'আমার জমি',
        accountSettings: 'সেটিংস',
        notifications: 'বিজ্ঞপ্তি',
        account: 'কৃষক অ্যাকাউন্ট',
    },
}

const Navbar = ({ onToggleSidebar, isSidebarCollapsed }) => {
    const navigate = useNavigate()
    const { unreadCount } = useNotifications()
    const { settings } = useSettings()
    const { user, logout } = useAuth()

    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const profileDropdownRef = useRef(null)

    const languageCode = settings?.languageCode || 'en'
    const navText =
        navbarTranslations[languageCode] || navbarTranslations.en

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setProfileMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        setProfileMenuOpen(false)
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <nav className="w-full min-h-16 bg-white border-b border-[#E5EAE1] px-3 sm:px-6 flex items-center justify-between gap-3 relative z-30">

            {/* Left Section: Sidebar Toggle & Brand */}
            <div className="flex items-center gap-2 sm:gap-3">
                {onToggleSidebar && (
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-label="Toggle navigation menu"
                        className="p-2 rounded-xl text-[#347052] hover:bg-[#E8F0DF] transition-colors flex items-center justify-center cursor-pointer"
                    >
                        <Menu size={22} strokeWidth={2.2} />
                    </button>
                )}

                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 shrink-0"
                >
                    <img
                        src={FhasalMark}
                        alt="Fhasal logo"
                        className="w-8 h-8 object-contain"
                    />

                    <h1 className="text-xl font-bold text-[#174B35]">
                        Fhasal
                    </h1>
                </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">

                {/* Enhanced Language Selector Dropdown */}
                <LanguageSelector />

                {/* Notifications Bell */}
                <Link
                    to="/notifications"
                    aria-label={`${navText.openNotifications}. ${unreadCount} ${navText.unread}`}
                    title={`${unreadCount} ${navText.unread}`}
                    className="relative p-2 rounded-xl text-[#456354] hover:bg-[#F0F5F0] transition-colors"
                >
                    <Bell
                        size={20}
                        strokeWidth={1.8}
                    />

                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Link>

                {/* Interactive User Profile Dropdown */}
                <div ref={profileDropdownRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        aria-label={navText.profile}
                        aria-expanded={profileMenuOpen}
                        className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl transition-all cursor-pointer ${
                            profileMenuOpen
                                ? 'bg-[#F0F5F0] ring-1 ring-[#347052]/30'
                                : 'hover:bg-[#F5F8F4]'
                        }`}
                    >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E7F0E8] flex items-center justify-center text-[#174B35] font-bold text-sm shadow-xs shrink-0">
                            {user?.name ? user.name.charAt(0).toUpperCase() : <CircleUserRound size={20} strokeWidth={1.8} />}
                        </div>

                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold text-[#263D30] leading-tight max-w-[120px] truncate">
                                {user?.name || navText.user}
                            </p>

                            <p className="text-[11px] text-[#829187]">
                                {navText.farmer}
                            </p>
                        </div>

                        <ChevronDown
                            size={15}
                            className={`hidden sm:block text-[#829187] transition-transform duration-200 ${
                                profileMenuOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {/* Popover Card */}
                    {profileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-[#E0E7DC] py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[min(540px,85vh)] overflow-y-auto dropdown-scroll overscroll-contain">
                            <div className="px-4 py-3 border-b border-[#F0F4EE]">
                                <p className="text-sm font-bold text-[#174B35] truncate">
                                    {user?.name || 'Farmer'}
                                </p>
                                <p className="text-xs text-[#7A8475] truncate mt-0.5">
                                    {user?.email || 'farmer@fhasal.com'}
                                </p>
                                <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F4EA] text-[#347052]">
                                    🌱 {navText.account}
                                </span>
                            </div>

                            <div className="py-1">
                                <Link
                                    to="/profile"
                                    onClick={() => setProfileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#344334] hover:bg-[#F7F9F5] hover:text-[#174B35] transition-colors"
                                >
                                    <User size={16} className="text-[#347052]" />
                                    <span>{navText.myProfile}</span>
                                </Link>

                                <Link
                                    to="/fields"
                                    onClick={() => setProfileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#344334] hover:bg-[#F7F9F5] hover:text-[#174B35] transition-colors"
                                >
                                    <Map size={16} className="text-[#347052]" />
                                    <span>{navText.myFields}</span>
                                </Link>

                                <Link
                                    to="/settings"
                                    onClick={() => setProfileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#344334] hover:bg-[#F7F9F5] hover:text-[#174B35] transition-colors"
                                >
                                    <SettingsIcon size={16} className="text-[#347052]" />
                                    <span>{navText.accountSettings}</span>
                                </Link>

                                <Link
                                    to="/notifications"
                                    onClick={() => setProfileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#344334] hover:bg-[#F7F9F5] hover:text-[#174B35] transition-colors"
                                >
                                    <Bell size={16} className="text-[#347052]" />
                                    <span>{navText.notifications}</span>
                                </Link>
                            </div>

                            <div className="border-t border-[#F0F4EE] pt-1 mt-1">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                                >
                                    <LogOut size={16} />
                                    <span>{navText.logout}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Standalone Quick Logout Button */}
                <button
                    type="button"
                    onClick={handleLogout}
                    title={navText.logout}
                    aria-label={navText.logout}
                    className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all cursor-pointer"
                >
                    <LogOut size={16} />
                    <span>{navText.logout}</span>
                </button>

            </div>
        </nav>
    )
}

export default Navbar
