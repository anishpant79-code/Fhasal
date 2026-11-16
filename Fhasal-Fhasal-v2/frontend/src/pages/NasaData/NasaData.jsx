
import React, { useState } from 'react'
import BackButton from '../../components/common/BackButton'
import {
    Satellite,
    CloudSun,
    Droplets,
    Thermometer,
    Wind,
    Leaf,
    MapPin,
    Search,
    RefreshCw,
    Info,
    ExternalLink,
    Activity,
    Sun,
    AlertCircle,
} from 'lucide-react'

const NASA_POWER_URL =
    'https://power.larc.nasa.gov/api/temporal/daily/point'

const GEOCODING_URL =
    'https://geocoding-api.open-meteo.com/v1/search'

const getDateString = (date) => {
    return date.toISOString().split('T')[0]
}

const getDateRange = () => {
    // NASA POWER daily data can have a reporting delay.
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

const formatValue = (value, decimals = 1) => {
    if (value === null || value === undefined || !Number.isFinite(value)) {
        return 'Unavailable'
    }

    return value.toFixed(decimals)
}

const NasaData = () => {
    const [location, setLocation] = useState('')
    const [searchedLocation, setSearchedLocation] = useState('')
    const [coordinates, setCoordinates] = useState(null)
    const [environmentData, setEnvironmentData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSearch = async (e) => {
        e.preventDefault()

        const searchTerm = location.trim()

        if (!searchTerm) {
            setError('Please enter a village, town, district or region.')
            return
        }

        setLoading(true)
        setError('')
        setEnvironmentData(null)
        setCoordinates(null)

        try {
            // Step 1: Find the location's coordinates.
            const geoResponse = await fetch(
                `${GEOCODING_URL}?name=${encodeURIComponent(searchTerm)}&count=1&language=en&format=json`
            )

            if (!geoResponse.ok) {
                throw new Error('Could not search for this location.')
            }

            const geoData = await geoResponse.json()
            const place = geoData.results?.[0]

            if (!place) {
                throw new Error(
                    'Location not found. Try entering a more specific village, town or district name.'
                )
            }

            const latitude = place.latitude
            const longitude = place.longitude

            // Step 2: Request NASA POWER daily observations.
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

            const nasaResponse = await fetch(
                `${NASA_POWER_URL}?${params.toString()}`
            )

            if (!nasaResponse.ok) {
                throw new Error('NASA POWER could not retrieve data for this location.')
            }

            const nasaResult = await nasaResponse.json()
            const properties = nasaResult.properties?.parameter

            if (!properties) {
                throw new Error('NASA POWER returned no environmental observations.')
            }

            const result = {
                temperature: getAverage(properties.T2M),
                rainfall: getTotal(properties.PRECTOTCORR),
                humidity: getAverage(properties.RH2M),
                wind: getAverage(properties.WS2M),
                solar: getAverage(properties.ALLSKY_SFC_SW_DWN),
                startDate: start,
                endDate: end,
            }

            setSearchedLocation(
                [place.name, place.admin1, place.country]
                    .filter(Boolean)
                    .join(', ')
            )

            setCoordinates({
                latitude,
                longitude,
            })

            setEnvironmentData(result)
        } catch (err) {
            setError(
                err.message || 'Something went wrong while retrieving NASA data.'
            )
        } finally {
            setLoading(false)
        }
    }

    const dataCards = [
        {
            title: 'Average Temperature',
            description: 'Average air temperature over the selected observation period.',
            value: environmentData
                ? formatValue(environmentData.temperature)
                : '--',
            unit: '°C',
            icon: Thermometer,
            color: 'bg-orange-100 text-orange-700',
        },
        {
            title: 'Total Rainfall',
            description: 'Accumulated daily precipitation over the observation period.',
            value: environmentData
                ? formatValue(environmentData.rainfall)
                : '--',
            unit: 'mm',
            icon: Droplets,
            color: 'bg-blue-100 text-blue-700',
        },
        {
            title: 'Relative Humidity',
            description: 'Average relative humidity in the atmosphere.',
            value: environmentData
                ? formatValue(environmentData.humidity)
                : '--',
            unit: '%',
            icon: CloudSun,
            color: 'bg-cyan-100 text-cyan-700',
        },
        {
            title: 'Wind Speed',
            description: 'Average wind speed at the observation location.',
            value: environmentData
                ? formatValue(environmentData.wind)
                : '--',
            unit: 'm/s',
            icon: Wind,
            color: 'bg-purple-100 text-purple-700',
        },
        {
            title: 'Solar Radiation',
            description: 'Average daily incoming solar radiation.',
            value: environmentData
                ? formatValue(environmentData.solar)
                : '--',
            unit: 'kWh/m²/day',
            icon: Sun,
            color: 'bg-amber-100 text-amber-700',
        },
    ]

    return (
        <div className="min-h-screen bg-fhasal-green-light p-4 md:p-8">
            <div className="mb-4">
                <BackButton />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-fhasal-green mb-2">
                        <Satellite size={20} />
                        <span className="text-sm font-semibold">
                            EARTH OBSERVATION
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        NASA Data Explorer
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Explore environmental observations for agricultural monitoring.
                    </p>
                </div>

                <a
                    href="https://power.larc.nasa.gov/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-fhasal-green text-white px-5 py-3 rounded-xl hover:bg-green-800 transition-colors"
                >
                    NASA POWER
                    <ExternalLink size={17} />
                </a>
            </div>

            {/* Location Search */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                    Explore a Location
                </h2>

                <p className="text-sm text-gray-500 mb-5">
                    Enter a village, town, district or region to retrieve NASA environmental observations.
                </p>

                <form
                    onSubmit={handleSearch}
                    className="flex flex-col sm:flex-row gap-3 max-w-2xl"
                >
                    <div className="relative flex-1">
                        <MapPin
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={19}
                        />

                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter location, e.g. Pune, Maharashtra"
                            className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-fhasal-green text-white px-6 py-3 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-60"
                    >
                        {loading ? (
                            <RefreshCw size={18} className="animate-spin" />
                        ) : (
                            <Search size={18} />
                        )}

                        {loading ? 'Fetching...' : 'Search'}
                    </button>
                </form>

                {error && (
                    <div className="mt-5 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-700">
                        <AlertCircle size={20} className="shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {searchedLocation && coordinates && (
                    <div className="mt-5 p-4 bg-green-50 rounded-xl">
                        <p className="text-sm text-green-800 font-semibold">
                            <MapPin size={15} className="inline mr-1" />
                            {searchedLocation}
                        </p>

                        <p className="text-xs text-green-700 mt-2">
                            Latitude: {coordinates.latitude.toFixed(4)} |
                            Longitude: {coordinates.longitude.toFixed(4)}
                        </p>

                        <p className="text-xs text-green-700 mt-1">
                            Observation period: {environmentData?.startDate} to {environmentData?.endDate}
                        </p>
                    </div>
                )}
            </div>

            {/* Environmental Data */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Environmental Observations
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    {environmentData
                        ? 'NASA POWER observations retrieved for the searched location.'
                        : 'Search for a location to load its environmental data.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {dataCards.map((card) => {
                    const Icon = card.icon

                    return (
                        <div
                            key={card.title}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                                <Icon size={24} />
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mt-5">
                                {card.title}
                            </h3>

                            <p className="text-sm text-gray-500 mt-2 min-h-10">
                                {card.description}
                            </p>

                            <div className="mt-5 pt-4 border-t border-gray-100">
                                <p className="text-2xl font-bold text-fhasal-green">
                                    {card.value}
                                    {card.value !== '--' && card.value !== 'Unavailable' && (
                                        <span className="text-sm font-medium text-gray-500 ml-1">
                                            {card.unit}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Data Information */}
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-3">
                <Info className="text-blue-600 shrink-0" />

                <div>
                    <h3 className="font-semibold text-blue-900">
                        Understanding NASA POWER Data
                    </h3>

                    <p className="text-sm text-blue-800 mt-1">
                        NASA POWER provides gridded meteorological and solar observations.
                        The values shown here are averages or totals over the displayed
                        observation period, not live weather readings or direct measurements
                        from an individual farm.
                    </p>

                    <p className="text-sm text-blue-800 mt-2">
                        Rainfall is accumulated across the available daily observations.
                        Temperature, humidity, wind and solar radiation are averaged.
                        Data availability and spatial resolution vary by parameter.
                    </p>
                </div>
            </div>

            {/* Data Source */}
            <div className="mt-5 bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Activity size={18} className="text-fhasal-green" />
                    Data Source
                </div>

                <p className="text-sm text-gray-500 mt-2">
                    NASA Prediction Of Worldwide Energy Resources (POWER)
                </p>

                <a
                    href="https://power.larc.nasa.gov/docs/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-fhasal-green font-medium mt-3 hover:underline"
                >
                    View NASA POWER documentation
                    <ExternalLink size={14} />
                </a>
            </div>

        </div>
    )
}

export default NasaData
