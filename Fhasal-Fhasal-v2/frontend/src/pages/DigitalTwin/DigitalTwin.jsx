
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BackButton from '../../components/common/BackButton'

import {
    Globe,
    MapPin,
    Sprout,
    Layers,
    Thermometer,
    Droplets,
    Wind,
    Satellite,
    Activity,
    Info,
    RefreshCw,
    Pencil,
    CheckCircle2,
    Wheat,
    FlaskConical,
    ArrowRight,
    CloudSun,
    Mountain,
    AlertCircle,
    Sun,
} from 'lucide-react'

import { useFields } from '../../context/FieldContext'
import { useSettings } from '../../context/SettingsContext'
import FieldDetailsMap from '../Fields/FieldDetailsMap'

import {
    getFieldCoordinates,
    fetchOpenMeteoWeather,
    getWeatherDescription,
} from '../../utils/fieldWeather'

const AREA_TO_SQM = {
    acre: 4046.8564224,
    hectare: 10000,
    guntha: 101.17141056,
}

const NASA_POWER_URL =
    'https://power.larc.nasa.gov/api/temporal/daily/point'

const normalizeUnit = (unit) => {
    const value = String(unit || 'acre').toLowerCase()

    if (value.startsWith('hectare') || value === 'ha') return 'hectare'
    if (value.startsWith('guntha')) return 'guntha'

    return 'acre'
}

const convertArea = (area, fromUnit, toUnit) => {
    const value = Number(area)

    if (!Number.isFinite(value)) return 0

    return (
        value *
        AREA_TO_SQM[normalizeUnit(fromUnit)] /
        AREA_TO_SQM[normalizeUnit(toUnit)]
    )
}

const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0)
}

const formatEnvironmentalValue = (value, decimals = 1) => {
    if (
        value === null ||
        value === undefined ||
        !Number.isFinite(Number(value))
    ) {
        return 'Unavailable'
    }

    return Number(value).toFixed(decimals)
}

const getDateString = (date) => {
    return date.toISOString().split('T')[0]
}

const getDateRange = () => {
    const endDate = new Date()
    endDate.setUTCDate(endDate.getUTCDate() - 3)

    const startDate = new Date(endDate)
    startDate.setUTCDate(startDate.getUTCDate() - 29)

    return {
        start: getDateString(startDate).replaceAll('-', ''),
        end: getDateString(endDate).replaceAll('-', ''),
    }
}

const getValidValues = (values) => {
    if (!values) return []

    return Object.values(values)
        .map(Number)
        .filter((value) => Number.isFinite(value) && value > -900)
}

const getAverage = (values) => {
    const valid = getValidValues(values)

    if (!valid.length) return null

    return valid.reduce((sum, value) => sum + value, 0) / valid.length
}

const getTotal = (values) => {
    const valid = getValidValues(values)

    if (!valid.length) return null

    return valid.reduce((sum, value) => sum + value, 0)
}

// NASA POWER historical observations.
const fetchNasaPower = async (latitude, longitude, signal) => {
    const { start, end } = getDateRange()

    const params = new URLSearchParams({
        parameters: 'T2M,PRECTOTCORR,RH2M,WS2M,ALLSKY_SFC_SW_DWN',
        community: 'AG',
        longitude: String(longitude),
        latitude: String(latitude),
        start,
        end,
        format: 'JSON',
    })

    const response = await fetch(
        `${NASA_POWER_URL}?${params.toString()}`,
        { signal }
    )

    if (!response.ok) {
        throw new Error('NASA POWER historical data is unavailable.')
    }

    const result = await response.json()
    const properties = result.properties?.parameter

    if (!properties) {
        throw new Error('NASA POWER returned no historical observations.')
    }

    return {
        temperature: getAverage(properties.T2M),
        rainfall: getTotal(properties.PRECTOTCORR),
        humidity: getAverage(properties.RH2M),
        wind: getAverage(properties.WS2M),
        solar: getAverage(properties.ALLSKY_SFC_SW_DWN),
        startDate: start,
        endDate: end,
    }
}

// Shared weather service + NASA historical data.
const fetchFieldEnvironment = async (
    location,
    boundary = [],
    signal
) => {
    const coordinates = await getFieldCoordinates(
        location,
        boundary,
        signal
    )

    const { latitude, longitude } = coordinates

    const [weatherResult, nasaResult] = await Promise.allSettled([
        fetchOpenMeteoWeather(latitude, longitude, signal),
        fetchNasaPower(latitude, longitude, signal),
    ])

    if (signal?.aborted) {
        throw new DOMException('Request aborted', 'AbortError')
    }

    if (weatherResult.status === 'rejected') {
        throw weatherResult.reason ||
            new Error('Unable to retrieve weather information.')
    }

    const resolvedLocation =
        coordinates.source === 'boundary'
            ? 'Registered field boundary'
            : location?.trim() || 'Geocoded field location'

    return {
        location: resolvedLocation,
        latitude,
        longitude,
        coordinateSource: coordinates.source,
        weather: weatherResult.value,
        nasa: nasaResult.status === 'fulfilled'
            ? nasaResult.value
            : null,
        nasaError: nasaResult.status === 'rejected'
            ? nasaResult.reason?.message ||
              'NASA POWER historical data is temporarily unavailable.'
            : '',
        loadedAt: new Date(),
    }
}

const DigitalTwin = () => {
    const { fields = [] } = useFields()
    const { settings } = useSettings()

    const displayUnit = normalizeUnit(settings?.areaUnit)

    const unitLabel = {
        acre: 'Acres',
        hectare: 'Hectares',
        guntha: 'Guntha',
    }[displayUnit]

    const [selectedFieldId, setSelectedFieldId] = useState(
        fields.length > 0 ? String(fields[0].id) : ''
    )

    const [lastRefreshed, setLastRefreshed] = useState(null)
    const [environmentData, setEnvironmentData] = useState(null)
    const [environmentLoading, setEnvironmentLoading] = useState(false)
    const [environmentError, setEnvironmentError] = useState('')
    const [refreshCount, setRefreshCount] = useState(0)

    // Keep the selected field valid when fields are added or deleted.
    useEffect(() => {
        if (fields.length === 0) {
            setSelectedFieldId('')
            return
        }

        const fieldExists = fields.some(
            (field) => String(field.id || field._id) === selectedFieldId
        )

        if (!fieldExists) {
            setSelectedFieldId(String(fields[0].id || fields[0]._id))
        }
    }, [fields, selectedFieldId])

    const selectedField = useMemo(
        () =>
            fields.find(
                (field) => String(field.id || field._id) === selectedFieldId
            ) || null,
        [fields, selectedFieldId]
    )

    const convertedArea = useMemo(() => {
        if (!selectedField) return 0

        return convertArea(
            selectedField.fieldArea,
            selectedField.areaUnit,
            displayUnit
        )
    }, [selectedField, displayUnit])

    const boundaryCount = selectedField?.boundary?.length || 0
    const hasBoundary = boundaryCount >= 3

    const cropName =
        selectedField?.crop ||
        selectedField?.cropName ||
        selectedField?.currentCrop ||
        'Not specified'

    const soilName =
        selectedField?.soil ||
        selectedField?.soilType ||
        selectedField?.soilCategory ||
        'Not specified'

    // Load environmental data for the selected field.
    useEffect(() => {
        const controller = new AbortController()

        const loadEnvironment = async () => {
            if (!selectedField) {
                setEnvironmentData(null)
                setEnvironmentError('')
                setEnvironmentLoading(false)
                setLastRefreshed(null)
                return
            }

            setEnvironmentLoading(true)
            setEnvironmentError('')
            setEnvironmentData(null)

            try {
                const result = await fetchFieldEnvironment(
                    selectedField.fieldLocation,
                    selectedField.boundary,
                    controller.signal
                )

                if (!controller.signal.aborted) {
                    setEnvironmentData(result)
                    setLastRefreshed(new Date())
                }
            } catch (error) {
                if (
                    error.name !== 'AbortError' &&
                    !controller.signal.aborted
                ) {
                    setEnvironmentError(
                        error.message ||
                        'Unable to load environmental data.'
                    )
                }
            } finally {
                if (!controller.signal.aborted) {
                    setEnvironmentLoading(false)
                }
            }
        }

        loadEnvironment()

        return () => {
            controller.abort()
        }
    }, [
        selectedField?.id,
        selectedField?.fieldLocation,
        selectedField?.boundary,
        refreshCount,
    ])

    const handleRefresh = () => {
        if (!selectedField || environmentLoading) return

        setRefreshCount((count) => count + 1)
    }

    const currentWeather = environmentData?.weather?.current
    const dailyWeather = environmentData?.weather?.daily
    const nasaData = environmentData?.nasa

    // Calculate the total rainfall expected over the next seven days.
    const forecastRainfall = useMemo(() => {
        const values = dailyWeather?.precipitation_sum

        if (!Array.isArray(values) || !values.length) return null

        const valid = values
            .map(Number)
            .filter((value) => Number.isFinite(value) && value >= 0)

        if (!valid.length) return null

        return valid.reduce((sum, value) => sum + value, 0)
    }, [dailyWeather])

    const environmentCards = [
        {
            title: 'Temperature',
            description: 'Current air temperature',
            value: currentWeather
                ? formatEnvironmentalValue(currentWeather.temperature_2m)
                : 'Unavailable',
            unit: '°C',
            icon: Thermometer,
            color: 'bg-orange-100 text-orange-700',
        },
        {
            title: 'Rainfall Forecast',
            description: 'Expected total rainfall over the next 7 days',
            value: forecastRainfall !== null
                ? formatEnvironmentalValue(forecastRainfall)
                : 'Unavailable',
            unit: 'mm',
            icon: Droplets,
            color: 'bg-blue-100 text-blue-700',
        },
        {
            title: 'Humidity',
            description: 'Current relative humidity',
            value: currentWeather
                ? formatEnvironmentalValue(currentWeather.relative_humidity_2m)
                : 'Unavailable',
            unit: '%',
            icon: CloudSun,
            color: 'bg-cyan-100 text-cyan-700',
        },
        {
            title: 'Wind Speed',
            description: 'Current wind speed',
            value: currentWeather
                ? formatEnvironmentalValue(currentWeather.wind_speed_10m)
                : 'Unavailable',
            unit: 'm/s',
            icon: Wind,
            color: 'bg-purple-100 text-purple-700',
        },
    ]

    const quickLinks = [
        {
            title: 'Farm Simulation',
            description: 'Estimate crop yield, water needs and cultivation costs.',
            icon: FlaskConical,
            link: '/simulation',
            color: 'bg-green-100 text-green-700',
        },
        {
            title: 'Satellite Imagery',
            description: 'Explore satellite imagery and the NDVI interface.',
            icon: Satellite,
            link: '/satellite-imagery',
            color: 'bg-blue-100 text-blue-700',
        },
        {
            title: 'Crop Recommendations',
            description: 'Explore available crop recommendations.',
            icon: Wheat,
            link: '/recommendations',
            color: 'bg-amber-100 text-amber-700',
        },
    ]

    return (
        <div className="min-h-screen bg-fhasal-green-light p-4 md:p-8">
            <div className="mb-4">
                <BackButton />
            </div>

            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-fhasal-green">
                        <Globe size={20} />
                        <span className="text-sm font-semibold">
                            FARM VISUALIZATION
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Digital Twin
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Explore a digital representation of your registered farmland.
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={!selectedField || environmentLoading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={18}
                        className={environmentLoading ? 'animate-spin' : ''}
                    />
                    {environmentLoading ? 'Refreshing...' : 'Refresh Overview'}
                </button>
            </div>

            {/* Field Selector */}
            <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <MapPin className="text-fhasal-green" size={20} />
                    <h2 className="font-bold text-gray-800">
                        Select a Registered Field
                    </h2>
                </div>

                {fields.length > 0 ? (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <select
                            value={selectedFieldId}
                            onChange={(e) => setSelectedFieldId(e.target.value)}
                            className="w-full max-w-xl rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        >
                            {fields.map((field) => {
                                const fId = String(field.id || field._id)
                                return (
                                    <option
                                        key={fId}
                                        value={fId}
                                    >
                                        {field.fieldName || field.name || 'Unnamed Field'}
                                    </option>
                                )
                            })}
                        </select>

                        {selectedField && (
                            <Link
                                to={`/fields/${selectedField.id || selectedField._id}/edit`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-fhasal-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                            >
                                <Pencil size={16} />
                                Edit Field
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="flex gap-3 rounded-xl bg-amber-50 p-5">
                        <Info className="shrink-0 text-amber-600" />

                        <div>
                            <p className="font-semibold text-gray-800">
                                No registered fields available
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                                Register a field before viewing its Digital Twin.
                            </p>

                            <Link
                                to="/fields/add"
                                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline"
                            >
                                Register a Field
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Field Content */}
            {selectedField && (
                <>
                    {/* Field Overview */}
                    <div className="mb-8">
                        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Field Overview
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Information from your registered field.
                                </p>
                            </div>

                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                                <CheckCircle2 size={15} />
                                Field Registered
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Field Name
                                    </p>
                                    <Sprout className="text-fhasal-green" size={21} />
                                </div>

                                <h3 className="mt-3 break-words text-xl font-bold text-gray-800">
                                    {selectedField.fieldName || selectedField.name || 'Unnamed Field'}
                                </h3>
                            </div>

                            <div className="rounded-2xl bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Field Area
                                    </p>
                                    <Layers className="text-fhasal-green" size={21} />
                                </div>

                                <h3 className="mt-3 text-xl font-bold text-gray-800">
                                    {formatNumber(convertedArea)} {unitLabel}
                                </h3>

                                <p className="mt-1 text-xs text-gray-400">
                                    Based on registered field area
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Location
                                    </p>
                                    <MapPin className="text-fhasal-green" size={21} />
                                </div>

                                <h3 className="mt-3 break-words text-lg font-bold text-gray-800">
                                    {selectedField.fieldLocation || 'Not specified'}
                                </h3>
                            </div>

                            <div className="rounded-2xl bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Boundary Points
                                    </p>
                                    <Globe className="text-fhasal-green" size={21} />
                                </div>

                                <h3 className="mt-3 text-xl font-bold text-gray-800">
                                    {boundaryCount}
                                </h3>

                                <p className="mt-1 text-xs text-gray-400">
                                    {hasBoundary ? 'Boundary available' : 'Boundary incomplete'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Crop and Soil Information */}
                    <div className="mb-8">
                        <h2 className="mb-5 text-xl font-bold text-gray-800">
                            Crop & Soil Information
                        </h2>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="rounded-2xl bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-green-100 p-3 text-green-700">
                                        <Wheat size={23} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Registered Crop
                                        </p>

                                        <h3 className="mt-1 text-lg font-bold text-gray-800">
                                            {cropName}
                                        </h3>
                                    </div>
                                </div>

                                <p className="mt-4 text-xs text-gray-400">
                                    {cropName === 'Not specified'
                                        ? 'Crop information has not been added to this field.'
                                        : 'Crop information from your registered field.'}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                                        <Mountain size={23} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Soil Type
                                        </p>

                                        <h3 className="mt-1 text-lg font-bold text-gray-800">
                                            {soilName}
                                        </h3>
                                    </div>
                                </div>

                                <p className="mt-4 text-xs text-gray-400">
                                    {soilName === 'Not specified'
                                        ? 'Soil information has not been added to this field.'
                                        : 'Soil information from your registered field.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Digital Field Map */}
                    <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Digital Field Model
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Geographic boundary of {selectedField.fieldName || selectedField.name || 'your selected field'}.
                                </p>
                            </div>

                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                                <Activity size={15} />
                                Field Boundary View
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-xl">
                            {hasBoundary ? (
                                <FieldDetailsMap
                                    boundary={selectedField.boundary}
                                />
                            ) : (
                                <div className="flex min-h-64 items-center justify-center rounded-xl bg-gray-50 p-6">
                                    <div className="text-center">
                                        <MapPin
                                            className="mx-auto mb-3 text-gray-400"
                                            size={34}
                                        />

                                        <p className="font-semibold text-gray-700">
                                            No Field Boundary Available
                                        </p>

                                        <p className="mt-2 text-sm text-gray-500">
                                            Add at least three boundary points to display your field on the map.
                                        </p>

                                        <Link
                                            to={`/fields/${selectedField.id}/edit`}
                                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-fhasal-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                                        >
                                            <Pencil size={15} />
                                            Update Boundary
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Environmental Monitoring */}
            <div className="mb-6">
                <div className="flex items-center gap-2">
                    <CloudSun className="text-fhasal-green" size={23} />

                    <h2 className="text-2xl font-bold text-gray-800">
                        Environmental Monitoring
                    </h2>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                    Current weather and seven-day forecast for your selected field coordinates.
                </p>
            </div>

            {environmentLoading && (
                <div className="mb-5 flex items-center gap-3 rounded-xl bg-white p-4 text-sm text-gray-600 shadow-sm">
                    <RefreshCw size={18} className="animate-spin text-fhasal-green" />
                    Retrieving field environmental data...
                </div>
            )}

            {environmentError && (
                <div className="mb-5 flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                    <AlertCircle size={20} className="shrink-0" />

                    <div>
                        <p className="font-semibold">
                            Environmental data unavailable
                        </p>

                        <p className="mt-1 text-sm">
                            {environmentError}
                        </p>

                        {selectedField && (
                            <Link
                                to={`/fields/${selectedField.id}/edit`}
                                className="mt-2 inline-block text-sm font-semibold underline"
                            >
                                Check field boundary and location
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Current Weather Summary */}
            {currentWeather && (
                <div className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Current conditions
                            </p>

                            <h3 className="mt-1 text-xl font-bold text-gray-800">
                                {getWeatherDescription(currentWeather.weather_code)}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                {environmentData?.location}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Sun className="text-amber-500" size={32} />

                            <span className="text-3xl font-bold text-gray-800">
                                {formatEnvironmentalValue(currentWeather.temperature_2m)}°C
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Environmental Cards */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {environmentCards.map((card) => {
                    const Icon = card.icon

                    const available =
                        card.value !== 'Unavailable' &&
                        card.value !== '--'

                    return (
                        <div
                            key={card.title}
                            className="rounded-2xl bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}>
                                    <Icon size={22} />
                                </div>

                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                    environmentLoading
                                        ? 'bg-blue-50 text-blue-700'
                                        : available
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {environmentLoading
                                        ? 'Loading'
                                        : available
                                            ? 'Available'
                                            : 'Unavailable'}
                                </span>
                            </div>

                            <h3 className="mt-4 font-semibold text-gray-800">
                                {card.title}
                            </h3>

                            <p className="mt-1 text-sm text-gray-400">
                                {card.description}
                            </p>

                            <p className="mt-3 text-2xl font-bold text-gray-800">
                                {environmentLoading ? (
                                    <span className="text-sm font-medium text-gray-400">
                                        Loading...
                                    </span>
                                ) : (
                                    <>
                                        {card.value}

                                        {available && (
                                            <span className="ml-1 text-sm font-medium text-gray-500">
                                                {card.unit}
                                            </span>
                                        )}
                                    </>
                                )}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Seven-Day Forecast */}
            {dailyWeather?.time && (
                <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
                    <div className="mb-5">
                        <h3 className="text-lg font-bold text-gray-800">
                            Seven-Day Weather Forecast
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Daily temperature range and expected rainfall.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
                        {dailyWeather.time.map((date, index) => (
                            <div
                                key={date}
                                className="rounded-xl bg-gray-50 p-3"
                            >
                                <p className="text-xs font-semibold text-gray-500">
                                    {new Date(`${date}T00:00:00`).toLocaleDateString(
                                        'en-IN',
                                        {
                                            weekday: 'short',
                                            day: 'numeric',
                                            month: 'short',
                                        }
                                    )}
                                </p>

                                <div className="mt-3 flex items-center gap-1">
                                    <Sun size={16} className="text-amber-500" />

                                    <span className="text-sm font-bold text-gray-800">
                                        {formatEnvironmentalValue(
                                            dailyWeather.temperature_2m_max?.[index],
                                            0
                                        )}°
                                    </span>
                                </div>

                                <p className="mt-1 text-xs text-gray-500">
                                    Low: {formatEnvironmentalValue(
                                        dailyWeather.temperature_2m_min?.[index],
                                        0
                                    )}°
                                </p>

                                <div className="mt-3 flex items-center gap-1">
                                    <Droplets size={14} className="text-blue-500" />

                                    <span className="text-xs font-semibold text-gray-700">
                                        {formatEnvironmentalValue(
                                            dailyWeather.precipitation_sum?.[index],
                                            1
                                        )} mm
                                    </span>
                                </div>

                                <p className="mt-1 text-xs text-gray-400">
                                    Rain chance: {
                                        dailyWeather.precipitation_probability_max?.[index] ??
                                        '--'
                                    }%
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* NASA Historical Environmental Information */}
            {environmentData && (
                <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                            <Sun size={22} />
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-800">
                                NASA POWER Historical Observations
                            </h3>

                            <p className="text-sm text-gray-500">
                                Historical environmental data for the field coordinates.
                            </p>
                        </div>
                    </div>

                    {nasaData ? (
                        <>
                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl bg-amber-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        Average Solar Radiation
                                    </p>

                                    <p className="mt-2 text-xl font-bold text-gray-800">
                                        {formatEnvironmentalValue(nasaData.solar)}
                                        <span className="ml-1 text-xs font-medium text-gray-500">
                                            kWh/m²/day
                                        </span>
                                    </p>
                                </div>

                                <div className="rounded-xl bg-orange-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        30-Day Average Temperature
                                    </p>

                                    <p className="mt-2 text-xl font-bold text-gray-800">
                                        {formatEnvironmentalValue(nasaData.temperature)}
                                        <span className="ml-1 text-xs font-medium text-gray-500">
                                            °C
                                        </span>
                                    </p>
                                </div>

                                <div className="rounded-xl bg-blue-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        30-Day Total Rainfall
                                    </p>

                                    <p className="mt-2 text-xl font-bold text-gray-800">
                                        {formatEnvironmentalValue(nasaData.rainfall)}
                                        <span className="ml-1 text-xs font-medium text-gray-500">
                                            mm
                                        </span>
                                    </p>
                                </div>

                                <div className="rounded-xl bg-cyan-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        30-Day Average Humidity
                                    </p>

                                    <p className="mt-2 text-xl font-bold text-gray-800">
                                        {formatEnvironmentalValue(nasaData.humidity)}
                                        <span className="ml-1 text-xs font-medium text-gray-500">
                                            %
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-gray-500">
                                NASA observation period: {nasaData.startDate} – {nasaData.endDate}
                            </p>
                        </>
                    ) : (
                        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                            Current weather is available, but NASA POWER historical observations could not be retrieved.

                            {environmentData.nasaError && (
                                <p className="mt-1 text-xs">
                                    {environmentData.nasaError}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="mt-4 border-t border-gray-100 pt-4 text-xs leading-6 text-gray-500">
                        Coordinates: {environmentData.latitude.toFixed(5)}, {environmentData.longitude.toFixed(5)}
                        <br />
                        Coordinate source: {environmentData.coordinateSource === 'boundary'
                            ? 'Registered field boundary centre'
                            : 'Location name search'}
                        <br />
                        Weather source: Open-Meteo
                        <br />
                        Historical data source: NASA POWER
                    </div>
                </div>
            )}

            {/* Quick Access */}
            <div className="mb-8">
                <h2 className="mb-5 text-xl font-bold text-gray-800">
                    Quick Access
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {quickLinks.map((item) => {
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.title}
                                to={item.link}
                                className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`rounded-xl p-3 ${item.color}`}>
                                        <Icon size={23} />
                                    </div>

                                    <ArrowRight
                                        size={19}
                                        className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-fhasal-green"
                                    />
                                </div>

                                <h3 className="mt-4 font-bold text-gray-800">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    {item.description}
                                </p>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Refresh Information */}
            <div className="mb-6 flex flex-col gap-2 rounded-xl border border-gray-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-700">
                        Overview status
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        {lastRefreshed
                            ? `Last refreshed: ${lastRefreshed.toLocaleString('en-IN')}`
                            : 'Environmental data has not loaded successfully yet.'}
                    </p>
                </div>

                <span className={`flex items-center gap-2 text-xs font-medium ${
                    environmentData
                        ? 'text-green-700'
                        : 'text-gray-500'
                }`}>
                    <CheckCircle2 size={16} />

                    {environmentData
                        ? 'Weather data loaded'
                        : 'Waiting for environmental data'}
                </span>
            </div>

            {/* Digital Twin Information */}
            <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-5">
                <Info className="shrink-0 text-blue-600" size={21} />

                <div>
                    <h3 className="font-semibold text-blue-900">
                        About the Digital Twin
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-blue-800">
                        The Digital Twin combines your registered field information
                        with weather information from Open-Meteo and historical
                        environmental observations from NASA POWER. When a field
                        boundary is available, its approximate centre is used
                        instead of relying on the typed location name.
                    </p>

                    <p className="mt-2 text-sm leading-6 text-blue-800">
                        These are modelled or gridded environmental estimates
                        around the field coordinates, not direct measurements
                        from sensors inside your farm. Soil moisture, field-level
                        NDVI, crop growth modelling and live satellite monitoring
                        require additional integrations.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DigitalTwin
