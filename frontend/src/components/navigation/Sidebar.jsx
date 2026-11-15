
import React from 'react'
import { NavLink } from 'react-router-dom'

import {
    House,
    Map,
    Lightbulb,
    RefreshCw,
    Satellite,
    Globe,
    SlidersHorizontal,
    Settings,
    Bell,
    Leaf,
} from 'lucide-react'

import { useSettings } from '../../context/SettingsContext'

const sidebarTranslations = {
    en: {
        home: 'Home',
        fields: 'My Fields',
        advice: 'Crop Advice',
        rotation: 'Rotation Lab',
        nasa: 'NASA Data',
        satellite: 'Satellite Imagery',
        twin: 'Digital Twin',
        simulation: 'Simulation',
        notifications: 'Notifications',
        settings: 'Settings',
        subtitle: 'Smart Farming Platform',
    },
    hi: {
        home: 'होम',
        fields: 'मेरे खेत',
        advice: 'फसल सलाह',
        rotation: 'फसल चक्र प्रयोगशाला',
        nasa: 'नासा डेटा',
        satellite: 'उपग्रह चित्र',
        twin: 'डिजिटल ट्विन',
        simulation: 'सिमुलेशन',
        notifications: 'सूचनाएँ',
        settings: 'सेटिंग्स',
        subtitle: 'स्मार्ट कृषि प्लेटफ़ॉर्म',
    },
    kn: {
        home: 'ಮುಖಪುಟ',
        fields: 'ನನ್ನ ಹೊಲಗಳು',
        advice: 'ಬೆಳೆ ಸಲಹೆ',
        rotation: 'ಬೆಳೆ ಪರಿವರ್ತನೆ ಪ್ರಯೋಗಾಲಯ',
        nasa: 'ನಾಸಾ ಡೇಟಾ',
        satellite: 'ಉಪಗ್ರಹ ಚಿತ್ರಗಳು',
        twin: 'ಡಿಜಿಟಲ್ ಟ್ವಿನ್',
        simulation: 'ಸಿಮ್ಯುಲೇಶನ್',
        notifications: 'ಅಧಿಸೂಚನೆಗಳು',
        settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        subtitle: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ವೇದಿಕೆ',
    },
    mr: {
        home: 'मुख्यपृष्ठ',
        fields: 'माझी शेते',
        advice: 'पीक सल्ला',
        rotation: 'पीक फेरपालट प्रयोगशाळा',
        nasa: 'नासा डेटा',
        satellite: 'उपग्रह प्रतिमा',
        twin: 'डिजिटल ट्विन',
        simulation: 'सिम्युलेशन',
        notifications: 'सूचना',
        settings: 'सेटिंग्ज',
        subtitle: 'स्मार्ट शेती प्लॅटफॉर्म',
    },
    te: {
        home: 'హోమ్',
        fields: 'నా పొలాలు',
        advice: 'పంట సలహా',
        rotation: 'పంట మార్పిడి ల్యాబ్',
        nasa: 'నాసా డేటా',
        satellite: 'ఉపగ్రహ చిత్రాలు',
        twin: 'డిజిటల్ ట్విన్',
        simulation: 'సిమ్యులేషన్',
        notifications: 'నోటిఫికేషన్‌లు',
        settings: 'సెట్టింగ్‌లు',
        subtitle: 'స్మార్ట్ వ్యవసాయ వేదిక',
    },
    ta: {
        home: 'முகப்பு',
        fields: 'எனது வயல்கள்',
        advice: 'பயிர் ஆலோசனை',
        rotation: 'பயிர் சுழற்சி ஆய்வகம்',
        nasa: 'நாசா தரவு',
        satellite: 'செயற்கைக்கோள் படங்கள்',
        twin: 'டிஜிட்டல் இரட்டை',
        simulation: 'உருவகப்படுத்துதல்',
        notifications: 'அறிவிப்புகள்',
        settings: 'அமைப்புகள்',
        subtitle: 'ஸ்மார்ட் விவசாய தளம்',
    },
    bn: {
        home: 'হোম',
        fields: 'আমার জমি',
        advice: 'ফসলের পরামর্শ',
        rotation: 'ফসল পর্যায়ক্রম ল্যাব',
        nasa: 'নাসা ডেটা',
        satellite: 'স্যাটেলাইট ছবি',
        twin: 'ডিজিটাল টুইন',
        simulation: 'সিমুলেশন',
        notifications: 'বিজ্ঞপ্তি',
        settings: 'সেটিংস',
        subtitle: 'স্মার্ট কৃষি প্ল্যাটফর্ম',
    },
}

const Sidebar = () => {
    const { settings } = useSettings()

    const languageCode = settings.languageCode || 'en'

    const translations =
        sidebarTranslations[languageCode] || sidebarTranslations.en

    const navLinks = [
        {
            name: translations.home,
            path: '/dashboard',
            icon: House,
            end: true,
        },
        {
            name: translations.fields,
            path: '/fields',
            icon: Map,
        },
        {
            name: translations.advice,
            path: '/recommendations',
            icon: Lightbulb,
        },
        {
            name: translations.rotation,
            path: '/rotation-lab',
            icon: RefreshCw,
        },
        {
            name: translations.nasa,
            path: '/nasa-data',
            icon: Satellite,
        },
        {
            name: translations.satellite,
            path: '/satellite-imagery',
            icon: Leaf,
        },
        {
            name: translations.twin,
            path: '/digital-twin',
            icon: Globe,
        },
        {
            name: translations.simulation,
            path: '/simulation',
            icon: SlidersHorizontal,
        },
        {
            name: translations.notifications,
            path: '/notifications',
            icon: Bell,
        },
        {
            name: translations.settings,
            path: '/settings',
            icon: Settings,
        },
    ]

    return (
        <aside className="flex h-screen w-64 flex-col bg-[#347052] text-white">

            {/* Logo */}
            <div className="shrink-0 border-b border-[#548269] px-6 py-6">
                <h1 className="text-2xl font-bold tracking-wide">
                    Fhasal
                </h1>

                <p className="mt-1 text-xs text-green-100">
                    {translations.subtitle}
                </p>
            </div>

            {/* Navigation */}
            <nav
                aria-label="Main navigation"
                className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-6"
            >
                {navLinks.map((link) => {
                    const Icon = link.icon

                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.end || false}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-[#426F58] text-white shadow-sm'
                                        : 'text-green-50 hover:bg-[#3B7959]'
                                }`
                            }
                        >
                            <Icon
                                size={19}
                                strokeWidth={2}
                                className="shrink-0"
                            />

                            <span>{link.name}</span>
                        </NavLink>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="shrink-0 border-t border-[#548269] px-6 py-4">
                <p className="text-xs text-green-100">
                    © 2026 Fhasal
                </p>
            </div>

        </aside>
    )
}

export default Sidebar
