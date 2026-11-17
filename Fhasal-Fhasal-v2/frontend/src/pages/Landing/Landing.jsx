
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Sprout,
    ArrowRight,
    Leaf,
    Satellite,
    TrendingUp,
    ShieldCheck,
    Menu,
    X,
    CloudSun,
    BarChart3,
    FlaskConical,
    Mail,
    Phone,
    MessageCircle,
    Languages,
    ExternalLink,
} from 'lucide-react'

import { useSettings } from '../../context/SettingsContext'
import { getTranslation } from '../../utils/translations'
import LanguageSelector from '../../components/common/LanguageSelector'
import FhasalMark from '../../assets/logos/fhasal-mark.svg'

const NavLinks = ({ links, onNavigate }) => (
    <>
        {links.map(([name, href]) => (
            <a
                key={href}
                href={href}
                onClick={onNavigate}
                className="text-gray-600 hover:text-[#347052] font-medium transition"
            >
                {name}
            </a>
        ))}
    </>
)

const SVG_FALLBACK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="100%" height="100%" fill="%23e8f5e9"/><g fill="%232e7d32" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"><circle cx="400" cy="260" r="48" fill="%23c8e6c9"/><text x="400" y="270" font-size="32">🌱</text><text x="400" y="340" font-size="24" font-weight="bold">Fhasal Smart Agriculture</text><text x="400" y="375" font-size="14" fill="%234caf50">Sustainable Precision Farming</text></g></svg>'

const photos = {
    hero: 'https://images.pexels.com/photos/31096711/pexels-photo-31096711/free-photo-of-rural-indian-farmer-in-lush-green-field-at-sunrise.jpeg?auto=compress&dpr=1&h=750&w=1260',
    field: 'https://vulplex.com/images/featured/Indian-Female-Farmer-in-Sari-Tending-Green-Crops-in-Rural-Field-Wallpaper-69bfd33918af5.jpg',
    satellite: 'https://cdn.sanity.io/images/hvd5n54p/blog/1f19e32aee83ae6f3187b56d40a838883e9fe0e1-2200x1320.jpg',
    crops: 'https://images.unsplash.com/photo-1741874299706-2b8e16839aaa?auto=format&fit=crop&w=1000&q=85',
    weather: 'https://img.khetivyapar.com/images/news/1727941054-monsoon-is-still-active-in-bihar-and-drizzle-in-many-districts-today-4047.jpg',
    tractor: 'https://stories.cpre.org.uk/saveoursoils/assets/hgVcNoUE0l/tractor-ploughing-2560x1707.jpeg',
    sensor: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85',
    irrigation: 'https://images.unsplash.com/photo-1777063012816-35f5bcbe4e09?auto=format&fit=crop&w=1000&q=85',
    drone: 'https://flm.topagrar.com/flm/upload/w_1080%2Cg_North%2Cq_60/https%3A/www.topagrar.com/imgs/4/0/9/1/4/6/1/stock.adobe.comAndrus_Ciprian_preview-41a097a9e37de88f.jpg',
    cta: 'https://images.pexels.com/photos/10826786/pexels-photo-10826786.jpeg?auto=compress&dpr=1&h=750&w=1260',
}

const Landing = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Get the selected language and language update function
    const { settings, updateLanguage, supportedLanguages } = useSettings()

    // Always use language codes: en, hi, kn, te, ta, mr, bn
    const languageCode = settings.languageCode || 'en'

    // Translation function
    const t = (key) => getTranslation(languageCode, key)

    const closeMenu = () => {
        setMobileMenuOpen(false)
    }

    // Update the language in SettingsContext
    const handleLanguageChange = (event) => {
        updateLanguage(event.target.value)
    }

    const features = [
        {
            icon: Sprout,
            titleKey: 'fieldManagement',
            descriptionKey: 'fieldDescription',
            image: photos.field,
        },
        {
            icon: Satellite,
            titleKey: 'satelliteImagery',
            descriptionKey: 'satelliteDescription',
            image: photos.satellite,
        },
        {
            icon: TrendingUp,
            titleKey: 'cropRecommendations',
            descriptionKey: 'cropDescription',
            image: photos.crops,
        },
        {
            icon: CloudSun,
            titleKey: 'weatherInsights',
            descriptionKey: 'weatherDescription',
            image: photos.weather,
        },
        {
            icon: FlaskConical,
            titleKey: 'farmSimulation',
            descriptionKey: 'simulationDescription',
            image: photos.tractor,
        },
        {
            icon: BarChart3,
            titleKey: 'digitalTwin',
            descriptionKey: 'twinDescription',
            image: photos.sensor,
        },
    ]

    const handleImageError = (event, fallback = SVG_FALLBACK) => {
        event.currentTarget.onerror = (e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = SVG_FALLBACK
        }
        event.currentTarget.src = fallback
    }

    const navLinks = [
        [t('home'), '#home'],
        [t('features'), '#features'],
        [t('about'), '#about'],
        [t('contact'), '#contact'],
    ]

    return (
        <main className="min-h-screen bg-[#F7FAF7]">

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-3">

                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="flex items-center gap-2 shrink-0"
                    >
                        <img
                            src={FhasalMark}
                            alt="Fhasal logo"
                            className="w-9 h-9 object-contain"
                        />

                        <span className="text-2xl font-bold text-[#347052]">
                            Fhasal
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-7">
                        <NavLinks links={navLinks} onNavigate={closeMenu} />
                    </div>

                    <div className="hidden sm:flex items-center gap-3">
                        <LanguageSelector />

                        <Link
                            to="/login"
                            className="px-4 py-2 text-[#347052] font-semibold hover:bg-green-50 rounded-lg"
                        >
                            {t('login')}
                        </Link>

                        <Link
                            to="/signup"
                            className="px-5 py-2.5 bg-[#347052] text-white font-semibold rounded-lg hover:bg-[#28583F] transition"
                        >
                            {t('getStarted')}
                        </Link>
                    </div>

                    <div className="sm:hidden flex items-center gap-2">
                        <LanguageSelector />

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-[#347052]"
                            aria-label="Toggle navigation menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="sm:hidden border-t bg-white px-5 py-5 space-y-4">
                        <div className="flex flex-col gap-4">
                            <NavLinks links={navLinks} onNavigate={closeMenu} />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="text-center border border-[#347052] text-[#347052] py-3 rounded-xl font-semibold"
                            >
                                {t('login')}
                            </Link>

                            <Link
                                to="/signup"
                                onClick={closeMenu}
                                className="text-center bg-[#347052] text-white py-3 rounded-xl font-semibold"
                            >
                                {t('signup')}
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO */}
            <section id="home" className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-7">
                            <div className="inline-flex items-center gap-2 bg-green-100 text-[#347052] px-4 py-2 rounded-full text-sm font-semibold">
                                <Leaf size={16} />
                                {t('smartAgriculture')}
                            </div>

                            <a
                                href="https://www.linkedin.com/feed/update/urn:li:activity:7528450030106611713/"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/15 border border-[#0A66C2]/20 text-[#0A66C2] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition group"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-[#0A66C2] animate-pulse" />
                                <span>🚀 48-Hour Hackathon Build • Read Story</span>
                                <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            {t('growSmarter')}

                            <span className="block text-[#347052]">
                                {t('farmBetter')}
                            </span>
                        </h1>

                        <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                            {t('heroDescription')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-9">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center gap-2 bg-[#347052] text-white px-7 py-4 rounded-xl font-semibold hover:bg-[#28583F] shadow-md transition"
                            >
                                {t('createAccount')}
                                <ArrowRight size={19} />
                            </Link>

                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center border border-[#347052] text-[#347052] px-7 py-4 rounded-xl font-semibold hover:bg-green-50"
                            >
                                {t('login')}
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-6 mt-9 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                                <ShieldCheck size={18} className="text-[#347052]" />
                                {t('fieldManagement')}
                            </span>

                            <span className="flex items-center gap-2">
                                <Satellite size={18} className="text-[#347052]" />
                                {t('satelliteImagery')}
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-3xl overflow-hidden shadow-xl h-[390px] sm:h-[490px]">
                            <img
                                src={photos.hero}
                                alt="Indian farmer working in a green agricultural field"
                                onError={(event) => handleImageError(event)}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg flex items-center gap-4">
                            <div className="bg-white p-2 rounded-xl shadow-xs border border-green-100 flex items-center justify-center shrink-0">
                                <img src={FhasalMark} alt="Fhasal logo" className="w-8 h-8 object-contain" />
                            </div>

                            <div>
                                <p className="font-bold text-gray-900">
                                    {t('welcome')}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {t('welcomeDescription')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="bg-white py-20 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-5 sm:px-8">

                    <div className="text-center mb-12">
                        <p className="text-sm font-bold text-[#347052] uppercase tracking-wider">
                            {t('features')}
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                            {t('everythingFarmNeeds')}
                        </h2>

                        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                            {t('featuresDescription')}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                        {features.map((feature) => {
                            const Icon = feature.icon

                            return (
                                <div
                                    key={feature.titleKey}
                                    className="group bg-[#F7FAF7] rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300"
                                >
                                    <div className="h-52 overflow-hidden">
                                        <img
                                            src={feature.image}
                                            alt={t(feature.titleKey)}
                                            loading="lazy"
                                            onError={(event) => handleImageError(event, photos.field)}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    </div>

                                    <div className="p-6">
                                        <div className="bg-green-100 text-[#347052] w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                                            <Icon size={23} />
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900">
                                            {t(feature.titleKey)}
                                        </h3>

                                        <p className="text-gray-500 mt-2 leading-relaxed text-sm">
                                            {t(feature.descriptionKey)}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 scroll-mt-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src={photos.irrigation}
                            alt="Water irrigation in agricultural farmland"
                            loading="lazy"
                            onError={(event) => handleImageError(event)}
                            className="w-full h-64 object-cover rounded-2xl"
                        />

                        <img
                            src={photos.drone}
                            alt="Agricultural drone monitoring crop rows"
                            loading="lazy"
                            onError={(event) => handleImageError(event)}
                            className="w-full h-64 object-cover rounded-2xl mt-9"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-bold text-[#347052] uppercase tracking-wider">
                            {t('about')}
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                            {t('aboutTitle')}
                        </h2>

                        <p className="text-gray-600 mt-5 leading-relaxed">
                            {t('aboutDescription')}
                        </p>

                        <p className="text-gray-600 mt-4 leading-relaxed">
                            {t('aboutDescription2')}
                        </p>

                        <div className="space-y-4 mt-7">
                            {[
                                'aboutPoint1',
                                'aboutPoint2',
                                'aboutPoint3',
                                'aboutPoint4',
                            ].map((key) => (
                                <div key={key} className="flex items-center gap-3">
                                    <ShieldCheck className="text-[#347052] shrink-0" size={20} />

                                    <span className="text-gray-700 text-sm">
                                        {t(key)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
                <div className="relative overflow-hidden rounded-3xl min-h-[300px] flex items-center">

                    <img
                        src={photos.cta}
                        alt="Agricultural machinery working on farmland"
                        loading="lazy"
                        onError={(event) => handleImageError(event)}
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-[#173D2A]/85" />

                    <div className="relative z-10 text-center w-full px-6 py-14">
                        <Sprout size={42} className="text-green-200 mx-auto mb-5" />

                        <h2 className="text-3xl sm:text-4xl font-bold text-white">
                            {t('ctaTitle')}
                        </h2>

                        <p className="text-green-100 mt-4 max-w-xl mx-auto">
                            {t('ctaDescription')}
                        </p>

                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 bg-white text-[#347052] rounded-xl font-bold hover:bg-green-50 transition"
                        >
                            {t('getStarted')}
                            <ArrowRight size={19} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="bg-white py-20 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-5 sm:px-8">

                    <div className="text-center mb-12">
                        <p className="text-sm font-bold text-[#347052] uppercase tracking-wider">
                            {t('contact')}
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                            {t('contactTitle')}
                        </h2>

                        <p className="text-gray-500 mt-3">
                            {t('contactDescription')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

                        <a
                            href="mailto:YOUR_EMAIL@example.com"
                            className="p-7 rounded-2xl border border-gray-100 bg-[#F7FAF7] text-center hover:shadow-lg transition"
                        >
                            <Mail size={28} className="text-[#347052] mx-auto mb-4" />

                            <h3 className="font-bold text-gray-900">
                                {t('emailUs')}
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                YOUR_EMAIL@example.com
                            </p>
                        </a>

                        <a
                            href="tel:+910000000000"
                            className="p-7 rounded-2xl border border-gray-100 bg-[#F7FAF7] text-center hover:shadow-lg transition"
                        >
                            <Phone size={28} className="text-[#347052] mx-auto mb-4" />

                            <h3 className="font-bold text-gray-900">
                                {t('callUs')}
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                {t('addPhone')}
                            </p>
                        </a>

                        <a
                            href="https://wa.me/910000000000"
                            target="_blank"
                            rel="noreferrer"
                            className="p-7 rounded-2xl border border-gray-100 bg-[#F7FAF7] text-center hover:shadow-lg transition"
                        >
                            <MessageCircle size={28} className="text-[#347052] mx-auto mb-4" />

                            <h3 className="font-bold text-gray-900">
                                {t('whatsapp')}
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                {t('chatTeam')}
                            </p>
                        </a>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-gray-200 bg-white py-8">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-5">

                    <Link to="/" className="text-[#347052] font-bold text-xl">
                        Fhasal
                    </Link>

                    <div className="flex flex-wrap justify-center items-center gap-5 text-sm text-gray-500">
                        <a href="#home" className="hover:text-[#347052]">
                            {t('home')}
                        </a>

                        <a href="#features" className="hover:text-[#347052]">
                            {t('features')}
                        </a>

                        <a href="#about" className="hover:text-[#347052]">
                            {t('about')}
                        </a>

                        <a href="#contact" className="hover:text-[#347052]">
                            {t('contact')}
                        </a>

                        <a
                            href="https://www.linkedin.com/feed/update/urn:li:activity:7528450030106611713/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#0A66C2] hover:text-[#004182] font-semibold transition"
                        >
                            <span>Featured on LinkedIn</span>
                            <ExternalLink size={13} />
                        </a>

                        <Link to="/login" className="hover:text-[#347052]">
                            {t('login')}
                        </Link>
                    </div>

                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Fhasal. {t('footerDescription')}
                    </p>
                </div>
            </footer>
        </main>
    )
}

export default Landing
