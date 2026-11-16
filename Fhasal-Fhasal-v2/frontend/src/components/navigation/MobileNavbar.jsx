
import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import {
    House,
    Map,
    Lightbulb,
    RefreshCw,
    Menu,
    Satellite,
    Globe,
    SlidersHorizontal,
    Bell,
    Settings,
    ChevronRight,
} from 'lucide-react'

import { useSettings } from '../../context/SettingsContext'

const mobileTranslations = {
    en: {
        home: 'Home',
        fields: 'Fields',
        advice: 'Advice',
        rotation: 'Rotation',
        nasaData: 'NASA Data',
        digitalTwin: 'Digital Twin',
        simulation: 'Simulation',
        notifications: 'Notifications',
        settings: 'Settings',
        more: 'More',
    },
    hi: {
        home: 'होम',
        fields: 'खेत',
        advice: 'सलाह',
        rotation: 'फसल चक्र',
        nasaData: 'नासा डेटा',
        digitalTwin: 'डिजिटल ट्विन',
        simulation: 'सिमुलेशन',
        notifications: 'सूचनाएं',
        settings: 'सेटिंग्स',
        more: 'और',
    },
    kn: {
        home: 'ಮುಖಪುಟ',
        fields: 'ಹೊಲಗಳು',
        advice: 'ಸಲಹೆ',
        rotation: 'ಬೆಳೆ ಸರದಿ',
        nasaData: 'ನಾಸಾ ಡೇಟಾ',
        digitalTwin: 'ಡಿಜಿಟಲ್ ಟ್ವಿನ್',
        simulation: 'ಸಿಮ್ಯುಲೇಶನ್',
        notifications: 'ಅಧಿಸೂಚನೆಗಳು',
        settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        more: 'ಇನ್ನಷ್ಟು',
    },
    mr: {
        home: 'मुख्यपृष्ठ',
        fields: 'शेती',
        advice: 'सल्ला',
        rotation: 'पीक फेरपालट',
        nasaData: 'नासा डेटा',
        digitalTwin: 'डिजिटल ट्विन',
        simulation: 'सिम्युलेशन',
        notifications: 'सूचना',
        settings: 'सेटिंग्ज',
        more: 'अधिक',
    },
    te: {
        home: 'హోమ్',
        fields: 'పొలాలు',
        advice: 'సలహాలు',
        rotation: 'పంట మార్పిడి',
        nasaData: 'నాసా డేటా',
        digitalTwin: 'డిజిటల్ ట్విన్',
        simulation: 'సిమ్యులేషన్',
        notifications: 'నోటిఫికేషన్లు',
        settings: 'సెట్టింగ్‌లు',
        more: 'మరిన్ని',
    },
    ta: {
        home: 'முகப்பு',
        fields: 'வயல்கள்',
        advice: 'ஆலோசனை',
        rotation: 'பயிர் சுழற்சி',
        nasaData: 'நாசா தரவு',
        digitalTwin: 'டிஜிட்டல் இரட்டை',
        simulation: 'உருவகப்படுத்துதல்',
        notifications: 'அறிவிப்புகள்',
        settings: 'அமைப்புகள்',
        more: 'மேலும்',
    },
    bn: {
        home: 'হোম',
        fields: 'জমি',
        advice: 'পরামর্শ',
        rotation: 'শস্য পর্যায়ক্রম',
        nasaData: 'নাসা ডেটা',
        digitalTwin: 'ডিজিটাল টুইন',
        simulation: 'সিমুলেশন',
        notifications: 'বিজ্ঞপ্তি',
        settings: 'সেটিংস',
        more: 'আরও',
    },
}

const MobileNavbar = () => {
    const [isMoreOpen, setIsMoreOpen] = useState(false)

    const location = useLocation()
    const { settings } = useSettings()

    const languageCode = settings.languageCode || 'en'

    const t = (key) =>
        mobileTranslations[languageCode]?.[key] ||
        mobileTranslations.en[key] ||
        key

    useEffect(() => {
        setIsMoreOpen(false)
    }, [location.pathname])

    const navigationLinks = [
        {
            name: t('home'),
            path: '/dashboard',
            icon: House,
            end: true,
        },
        {
            name: t('fields'),
            path: '/fields',
            icon: Map,
        },
        {
            name: t('advice'),
            path: '/recommendations',
            icon: Lightbulb,
        },
        {
            name: t('rotation'),
            path: '/rotation-lab',
            icon: RefreshCw,
        },
    ]

    const moreLinks = [
        {
            name: t('nasaData'),
            path: '/nasa-data',
            icon: Satellite,
        },
        {
            name: t('digitalTwin'),
            path: '/digital-twin',
            icon: Globe,
        },
        {
            name: t('simulation'),
            path: '/simulation',
            icon: SlidersHorizontal,
        },
        {
            name: t('notifications'),
            path: '/notifications',
            icon: Bell,
        },
        {
            name: t('settings'),
            path: '/settings',
            icon: Settings,
        },
    ]

    const isMoreActive = moreLinks.some(
        (link) =>
            location.pathname === link.path ||
            location.pathname.startsWith(`${link.path}/`)
    )

    return (
        <nav
            className="fixed bottom-0 left-0 z-50 w-full border-t border-[#E5EAE1] bg-white md:hidden"
            aria-label="Mobile navigation"
        >
            {/* More Menu */}
            {isMoreOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close more menu"
                        className="fixed inset-0 z-40 bg-black/10"
                        onClick={() => setIsMoreOpen(false)}
                    />

                    <div className="absolute bottom-full right-2 z-50 mb-2 w-64 rounded-2xl border border-[#E5EAE1] bg-white p-2 shadow-xl">
                        {moreLinks.map((link) => {
                            const Icon = link.icon

                            return (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMoreOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
                                            isActive
                                                ? 'bg-[#E7F0E8] font-semibold text-[#174B35]'
                                                : 'text-[#647064] hover:bg-[#F5F8F4]'
                                        }`
                                    }
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon size={19} />
                                        <span>{link.name}</span>
                                    </span>

                                    <ChevronRight size={16} />
                                </NavLink>
                            )
                        })}
                    </div>
                </>
            )}

            {/* Bottom Navigation */}
            <ul className="flex items-center justify-around px-2 py-2">
                {navigationLinks.map((link) => {
                    const Icon = link.icon

                    return (
                        <li key={link.path} className="flex-1">
                            <NavLink
                                to={link.path}
                                end={link.end}
                                onClick={() => setIsMoreOpen(false)}
                                className={({ isActive }) =>
                                    `flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-colors ${
                                        isActive
                                            ? 'font-semibold text-[#174B35]'
                                            : 'text-[#7A8475] hover:text-[#286044]'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            size={22}
                                            strokeWidth={isActive ? 2.5 : 1.8}
                                        />

                                        <span className="text-xs">
                                            {link.name}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    )
                })}

                {/* More Button */}
                <li className="flex-1">
                    <button
                        type="button"
                        aria-expanded={isMoreOpen}
                        aria-label={t('more')}
                        onClick={() => setIsMoreOpen((previous) => !previous)}
                        className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl py-2 transition-colors ${
                            isMoreOpen || isMoreActive
                                ? 'font-semibold text-[#174B35]'
                                : 'text-[#7A8475] hover:text-[#286044]'
                        }`}
                    >
                        <Menu size={22} />

                        <span className="text-xs">
                            {t('more')}
                        </span>
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default MobileNavbar
