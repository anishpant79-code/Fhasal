import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Sprout,
    MapPin,
    Droplets,
    Thermometer,
    Calendar,
    Filter,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Info,
    RefreshCw,
    Plus,
    ChevronDown,
    ChevronUp,
    ShieldAlert,
    TrendingUp,
} from 'lucide-react'

import { useFields } from '../../context/FieldContext'
import { useSettings } from '../../context/SettingsContext'
import { getTranslation } from '../../utils/translations'
import { getCurrentGrowingSeason } from '../../utils/cropSuitability'
import BackButton from '../../components/common/BackButton'
import { evaluateFieldSuitability, REFERENCE_CROPS } from '../../services/recommendationService'
import { getFieldCoordinates, fetchOpenMeteoWeather } from '../../utils/fieldWeather'

const Recommendations = () => {
    const { fields = [], loading: fieldsLoading } = useFields()
    const { settings } = useSettings()

    const languageCode = settings?.languageCode || 'en'
    const t = (key) => getTranslation(languageCode, key)

    const [selectedFieldId, setSelectedFieldId] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [weatherData, setWeatherData] = useState(null)
    const [weatherLoading, setWeatherLoading] = useState(false)
    const [weatherError, setWeatherError] = useState('')
    const [expandedCropId, setExpandedCropId] = useState(null)

    // Select first field once fields load
    useEffect(() => {
        if (fields.length > 0 && !selectedFieldId) {
            setSelectedFieldId(String(fields[0].id || fields[0]._id))
        }
    }, [fields, selectedFieldId])

    const selectedField = useMemo(() => {
        return fields.find(
            (f) => String(f.id || f._id) === String(selectedFieldId)
        ) || fields[0] || null
    }, [fields, selectedFieldId])

    const currentSeason = useMemo(() => getCurrentGrowingSeason(), [])

    // Fetch weather data for selected field
    useEffect(() => {
        if (!selectedField) return

        let isCancelled = false
        const controller = new AbortController()

        const loadWeather = async () => {
            try {
                setWeatherLoading(true)
                setWeatherError('')

                const coords = await getFieldCoordinates(
                    selectedField.fieldLocation,
                    selectedField.boundary,
                    controller.signal
                )

                if (isCancelled) return

                const weather = await fetchOpenMeteoWeather(
                    coords.latitude,
                    coords.longitude,
                    controller.signal
                )

                if (isCancelled) return
                setWeatherData(weather)
            } catch (err) {
                if (isCancelled) return
                console.warn('Weather fetch warning for recommendations:', err.message)
                setWeatherError('Live weather unavailable. Using regional seasonal baseline.')
            } finally {
                if (!isCancelled) setWeatherLoading(false)
            }
        }

        loadWeather()

        return () => {
            isCancelled = true
            controller.abort()
        }
    }, [selectedField])

    // Calculate crop suitability evaluations
    const evaluatedCrops = useMemo(() => {
        if (!selectedField) {
            // Default baseline evaluation
            return REFERENCE_CROPS.map((crop) => ({
                ...crop,
                suitability: {
                    score: 75,
                    rating: 'Baseline reference',
                    coverage: 100,
                    factors: [],
                    message: 'Select a registered field to view personalized recommendations.',
                },
            }))
        }

        const avgTemp = weatherData?.current?.temperature ?? 24
        const rainfall = weatherData?.weeklyRainfall ?? 15

        return evaluateFieldSuitability({
            field: selectedField,
            temperature: avgTemp,
            rainfall,
            season: currentSeason,
        })
    }, [selectedField, weatherData, currentSeason])

    // Filter by category
    const filteredCrops = useMemo(() => {
        if (selectedCategory === 'All') return evaluatedCrops
        return evaluatedCrops.filter((crop) => crop.category === selectedCategory)
    }, [evaluatedCrops, selectedCategory])

    const categories = ['All', 'Cereals', 'Pulses', 'Oilseeds', 'Commercial']

    const getScoreBadge = (score) => {
        if (score >= 80) {
            return {
                bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                label: 'High Suitability',
                bar: 'bg-emerald-500',
            }
        }
        if (score >= 60) {
            return {
                bg: 'bg-amber-50 text-amber-700 border-amber-200',
                label: 'Moderate Suitability',
                bar: 'bg-amber-500',
            }
        }
        return {
            bg: 'bg-orange-50 text-orange-700 border-orange-200',
            label: 'Caution / Low',
            bar: 'bg-orange-500',
        }
    }

    return (
        <div className="min-h-screen bg-fhasal-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <BackButton />
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#347052] bg-[#E8F4EA] px-3 py-1 rounded-full mb-2">
                            <Sprout size={14} />
                            Fhasal Agronomic Intelligence
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#344334]">
                            Crop Suitability & Advice
                        </h1>
                        <p className="text-sm text-[#7A8475] mt-1">
                            Personalized crop recommendations based on your field's soil, weather forecast, and current growing season.
                        </p>
                    </div>

                    {fields.length > 0 && (
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#E5EAE1] shadow-sm">
                            <span className="text-xs font-medium text-[#7A8475]">Field:</span>
                            <select
                                value={selectedFieldId}
                                onChange={(e) => setSelectedFieldId(e.target.value)}
                                className="bg-transparent text-sm font-semibold text-[#174B35] outline-none cursor-pointer"
                            >
                                {fields.map((f) => {
                                    const id = f.id || f._id
                                    return (
                                        <option key={id} value={id}>
                                            {f.fieldName} ({f.fieldArea} {f.areaUnit})
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    )}
                </div>

                {/* Empty State: No Fields Registered */}
                {!fieldsLoading && fields.length === 0 && (
                    <div className="bg-white rounded-2xl border border-[#E4E9DE] p-8 sm:p-12 text-center shadow-sm">
                        <div className="w-16 h-16 rounded-2xl bg-[#E8F4EA] text-[#347052] flex items-center justify-center mx-auto mb-4">
                            <Sprout size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-[#344334] mb-2">
                            Register Your First Field
                        </h2>
                        <p className="text-sm text-[#7A8475] max-w-md mx-auto mb-6">
                            To unlock accurate, farm-specific crop suitability scores and weather forecasts, add your field boundary and soil type.
                        </p>
                        <Link
                            to="/fields/add"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#347052] text-white font-semibold hover:bg-[#285C42] transition shadow-sm"
                        >
                            <Plus size={18} />
                            Register Field Now
                        </Link>
                    </div>
                )}

                {/* Field & Environmental Context Summary */}
                {selectedField && (
                    <div className="bg-white rounded-2xl border border-[#E4E9DE] p-5 sm:p-6 shadow-sm">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

                            <div className="pt-2 sm:pt-0 sm:px-3">
                                <p className="text-xs text-[#7A8475] flex items-center gap-1.5 mb-1">
                                    <MapPin size={14} className="text-[#347052]" />
                                    Field Location
                                </p>
                                <p className="text-sm font-semibold text-[#344334] truncate">
                                    {selectedField.fieldLocation || 'Location recorded'}
                                </p>
                                <p className="text-xs text-[#9AA397] mt-0.5">
                                    {selectedField.fieldArea} {selectedField.areaUnit}
                                </p>
                            </div>

                            <div className="pt-2 sm:pt-0 sm:px-3">
                                <p className="text-xs text-[#7A8475] flex items-center gap-1.5 mb-1">
                                    <Sprout size={14} className="text-[#347052]" />
                                    Soil Classification
                                </p>
                                <p className="text-sm font-semibold text-[#344334]">
                                    {selectedField.soilType || 'Soil type pending'}
                                </p>
                                <p className="text-xs text-[#9AA397] mt-0.5">
                                    Based on your field record
                                </p>
                            </div>

                            <div className="pt-2 sm:pt-0 sm:px-3">
                                <p className="text-xs text-[#7A8475] flex items-center gap-1.5 mb-1">
                                    <Calendar size={14} className="text-[#347052]" />
                                    Current Growing Season
                                </p>
                                <p className="text-sm font-semibold text-[#174B35]">
                                    {currentSeason} Season
                                </p>
                                <p className="text-xs text-[#9AA397] mt-0.5">
                                    Indian agricultural calendar
                                </p>
                            </div>

                            <div className="pt-2 sm:pt-0 sm:px-3">
                                <p className="text-xs text-[#7A8475] flex items-center gap-1.5 mb-1">
                                    <Thermometer size={14} className="text-[#347052]" />
                                    Forecast Weather
                                </p>
                                {weatherLoading ? (
                                    <p className="text-xs text-[#7A8475] animate-pulse">Loading weather...</p>
                                ) : weatherData?.current ? (
                                    <>
                                        <p className="text-sm font-semibold text-[#344334]">
                                            {weatherData.current.temperature.toFixed(1)}°C
                                        </p>
                                        <p className="text-xs text-[#9AA397] mt-0.5">
                                            Rainfall: {weatherData.weeklyRainfall?.toFixed(1) || 0} mm (7d)
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-xs text-amber-600">Season baseline active</p>
                                )}
                            </div>

                        </div>
                    </div>
                )}

                {/* Category Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <Filter size={16} className="text-[#7A8475] shrink-0" />
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                                selectedCategory === cat
                                    ? 'bg-[#347052] text-white shadow-sm'
                                    : 'bg-white text-[#526252] border border-[#E5EAE1] hover:bg-gray-50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Recommendations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredCrops.map((crop) => {
                        const score = crop.suitability.score || 0
                        const badge = getScoreBadge(score)
                        const isExpanded = expandedCropId === crop.id

                        return (
                            <div
                                key={crop.id}
                                className="bg-white rounded-2xl border border-[#E4E9DE] p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <span className="text-[11px] font-semibold text-[#7A8475] uppercase tracking-wider">
                                                {crop.category}
                                            </span>
                                            <h3 className="text-lg font-bold text-[#344334]">
                                                {crop.name}
                                            </h3>
                                        </div>

                                        <div className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0 ${badge.bg}`}>
                                            <span>{score}%</span>
                                            <span className="text-[11px] font-medium hidden sm:inline">• {badge.label}</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden mb-4">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${badge.bar}`}
                                            style={{ width: `${Math.min(score, 100)}%` }}
                                        />
                                    </div>

                                    {/* Key Attributes */}
                                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#F0F4EE] text-center mb-4">
                                        <div>
                                            <p className="text-[11px] text-[#7A8475]">Season</p>
                                            <p className="text-xs font-semibold text-[#344334] mt-0.5">
                                                {crop.season}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#7A8475]">Water Need</p>
                                            <p className="text-xs font-semibold text-[#344334] mt-0.5">
                                                {crop.water}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#7A8475]">Duration</p>
                                            <p className="text-xs font-semibold text-[#344334] mt-0.5">
                                                ~{crop.durationDays} days
                                            </p>
                                        </div>
                                    </div>

                                    {/* Advisory Tip */}
                                    <p className="text-xs text-[#526252] leading-relaxed mb-3">
                                        💡 {crop.advisory}
                                    </p>

                                    {/* Detailed Breakdown Accordion */}
                                    {isExpanded && crop.suitability.factors && (
                                        <div className="mt-3 pt-3 border-t border-[#F0F4EE] space-y-2 text-xs">
                                            <p className="font-semibold text-[#344334] mb-1">
                                                Agronomic Scoring Breakdown:
                                            </p>
                                            {crop.suitability.factors.map((factor, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-2.5 rounded-lg bg-[#F9FAF8] border border-[#E9EFE8] flex items-start justify-between gap-2"
                                                >
                                                    <div>
                                                        <span className="font-medium text-[#263D30]">
                                                            {factor.name}:
                                                        </span>
                                                        <p className="text-[11px] text-[#7A8475] mt-0.5">
                                                            {factor.explanation}
                                                        </p>
                                                    </div>
                                                    <span className="font-bold text-[#347052] shrink-0">
                                                        {factor.score}/{factor.maximum}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer Toggle Button */}
                                <div className="mt-4 pt-3 border-t border-[#F0F4EE] flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setExpandedCropId(isExpanded ? null : crop.id)}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#347052] hover:text-[#285C42] transition"
                                    >
                                        {isExpanded ? (
                                            <>
                                                Hide Analysis <ChevronUp size={14} />
                                            </>
                                        ) : (
                                            <>
                                                View Factor Details <ChevronDown size={14} />
                                            </>
                                        )}
                                    </button>

                                    <Link
                                        to="/rotation-lab"
                                        className="text-xs font-medium text-[#7A8475] hover:text-[#347052] inline-flex items-center gap-1"
                                    >
                                        Plan Rotation <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}

export default Recommendations
