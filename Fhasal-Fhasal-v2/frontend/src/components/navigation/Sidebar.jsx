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
    ChevronLeft,
    ChevronRight,
    X,
    Sprout,
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
        collapse: 'Collapse',
        expand: 'Expand',
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
        collapse: 'संक्षिप्त करें',
        expand: 'विस्तार करें',
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
        collapse: 'ಕುಗ್ಗಿಸಿ',
        expand: 'ವಿಸ್ತರಿಸಿ',
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
        collapse: 'संक्षिप्त करा',
        expand: 'विस्तृत करा',
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
        collapse: 'కుదించు',
        expand: 'విస్తరించు',
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
        collapse: 'சுருக்கு',
        expand: 'விரிவாக்கு',
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
        collapse: 'ছোট করুন',
        expand: 'বড় করুন',
    },
}

const Sidebar = ({
    isCollapsed = false,
    onToggleCollapse,
    isMobileOpen = false,
    onCloseMobile,
}) => {
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
        <aside
            className={`flex h-screen sticky top-0 flex-col bg-[#347052] text-white transition-all duration-300 ease-in-out shadow-lg z-30 select-none ${
                isCollapsed ? 'w-20' : 'w-64'
            }`}
        >
            {/* Header / Brand */}
            <div className={`shrink-0 border-b border-[#548269]/70 flex items-center justify-between transition-all ${
                isCollapsed ? 'py-4 px-2 justify-center' : 'py-4 px-5'
            }`}>
                <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 transition flex items-center justify-center shrink-0">
                        <Sprout size={24} className="text-green-300" />
                    </div>

                    {!isCollapsed && (
                        <div className="min-w-0">
                            <h1 className="text-xl font-bold tracking-wide leading-tight truncate">
                                Fhasal
                            </h1>
                            <p className="text-[11px] text-green-100/80 truncate">
                                {translations.subtitle}
                            </p>
                        </div>
                    )}
                </div>

                {/* Close button for mobile drawer */}
                {isMobileOpen && (
                    <button
                        type="button"
                        onClick={onCloseMobile}
                        aria-label="Close navigation"
                        className="p-1.5 rounded-lg text-green-100 hover:text-white hover:bg-white/10 transition md:hidden cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Navigation Links */}
            <nav
                aria-label="Main navigation"
                className="sidebar-scroll min-h-0 flex-1 space-y-1 overflow-y-auto px-2.5 py-3"
            >
                {navLinks.map((link) => {
                    const Icon = link.icon

                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.end || false}
                            onClick={() => {
                                if (isMobileOpen && onCloseMobile) {
                                    onCloseMobile()
                                }
                            }}
                            title={isCollapsed ? link.name : undefined}
                            className={({ isActive }) =>
                                `group relative flex items-center rounded-xl transition-all duration-200 ${
                                    isCollapsed
                                        ? 'justify-center h-11 w-11 mx-auto my-1'
                                        : 'gap-3 px-3.5 py-2.5 text-sm font-medium'
                                } ${
                                    isActive
                                        ? 'bg-[#25523B] text-white shadow-sm ring-1 ring-white/15 font-semibold'
                                        : 'text-green-50/90 hover:bg-[#3B7959] hover:text-white'
                                }`
                            }
                        >
                            <Icon
                                size={20}
                                strokeWidth={2}
                                className="shrink-0"
                            />

                            {!isCollapsed ? (
                                <span className="truncate">{link.name}</span>
                            ) : (
                                /* Tooltip popup for collapsed state */
                                <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 bg-[#1B3E2D] text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-white/10">
                                    {link.name}
                                </span>
                            )}
                        </NavLink>
                    )
                })}
            </nav>

            {/* Footer & Collapse Toggle */}
            <div className={`shrink-0 border-t border-[#548269]/70 transition-all ${
                isCollapsed ? 'py-3 px-2 flex flex-col items-center gap-2' : 'py-3 px-4 flex items-center justify-between'
            }`}>
                {!isCollapsed && (
                    <p className="text-[11px] text-green-200/70 truncate">
                        © 2026 Fhasal
                    </p>
                )}

                {/* Desktop Collapse Button */}
                {onToggleCollapse && (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        title={isCollapsed ? translations.expand : translations.collapse}
                        aria-label={isCollapsed ? translations.expand : translations.collapse}
                        className={`hidden md:flex items-center gap-2 rounded-xl text-green-100 hover:text-white hover:bg-white/10 transition cursor-pointer ${
                            isCollapsed
                                ? 'p-2.5 justify-center w-11 h-11'
                                : 'px-3 py-1.5 text-xs font-medium'
                        }`}
                    >
                        {isCollapsed ? (
                            <ChevronRight size={18} />
                        ) : (
                            <>
                                <ChevronLeft size={16} />
                                <span>{translations.collapse}</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </aside>
    )
}

export default Sidebar
