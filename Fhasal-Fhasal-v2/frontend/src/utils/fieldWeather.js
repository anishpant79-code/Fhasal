
const GEOCODING_URL =
    'https://geocoding-api.open-meteo.com/v1/search'

const WEATHER_URL =
    'https://api.open-meteo.com/v1/forecast'

// Convert different boundary formats into valid coordinates.
export const getBoundaryCoordinates = (boundary = []) => {
    if (!Array.isArray(boundary)) return []

    return boundary
        .map((point) => {
            let latitude
            let longitude

            if (Array.isArray(point)) {
                // Leaflet-style [latitude, longitude]
                latitude = Number(point[0])
                longitude = Number(point[1])
            } else if (point && typeof point === 'object') {
                latitude = Number(
                    point.lat ?? point.latitude
                )

                longitude = Number(
                    point.lng ?? point.lon ?? point.longitude
                )
            }

            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude) ||
                latitude < -90 ||
                latitude > 90 ||
                longitude < -180 ||
                longitude > 180
            ) {
                return null
            }

            return {
                latitude,
                longitude,
            }
        })
        .filter(Boolean)
}

// Calculate the approximate centre of a registered field.
export const getBoundaryCentre = (boundary = []) => {
    const coordinates = getBoundaryCoordinates(boundary)

    if (coordinates.length < 3) return null

    const latitude =
        coordinates.reduce(
            (sum, point) => sum + point.latitude,
            0
        ) / coordinates.length

    const longitude =
        coordinates.reduce(
            (sum, point) => sum + point.longitude,
            0
        ) / coordinates.length

    return {
        latitude,
        longitude,
    }
}

// Find field coordinates.
// Registered field boundaries take priority over typed locations.
export const getFieldCoordinates = async (
    location,
    boundary = [],
    signal
) => {
    if (signal?.aborted) {
        throw new DOMException('Request aborted', 'AbortError')
    }

    const boundaryCentre = getBoundaryCentre(boundary)

    if (boundaryCentre) {
        return {
            ...boundaryCentre,
            source: 'boundary',
        }
    }

    const searchLocation = String(location || '').trim()

    if (!searchLocation) {
        throw new Error(
            'No field boundary or location is available. Please update your field details.'
        )
    }

    const params = new URLSearchParams({
        name: searchLocation,
        count: '1',
        language: 'en',
        format: 'json',
        countryCode: 'IN',
    })

    const response = await fetch(
        `${GEOCODING_URL}?${params.toString()}`,
        { signal }
    )

    if (!response.ok) {
        throw new Error(
            'Unable to find the field location. Please try again.'
        )
    }

    const result = await response.json()

    if (!result.results?.length) {
        throw new Error(
            `No coordinates found for "${searchLocation}". Please check the field location.`
        )
    }

    const place = result.results[0]

    return {
        latitude: Number(place.latitude),
        longitude: Number(place.longitude),
        source: 'geocoding',
        resolvedName: place.name,
        country: place.country,
    }
}

// Retrieve current weather and a seven-day forecast.
export const fetchOpenMeteoWeather = async (
    latitude,
    longitude,
    signal
) => {
    const lat = Number(latitude)
    const lon = Number(longitude)

    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon) ||
        lat < -90 ||
        lat > 90 ||
        lon < -180 ||
        lon > 180
    ) {
        throw new Error('Invalid field coordinates.')
    }

    if (signal?.aborted) {
        throw new DOMException('Request aborted', 'AbortError')
    }

    const params = new URLSearchParams({
        latitude: String(lat),
        longitude: String(lon),

        current: [
            'temperature_2m',
            'relative_humidity_2m',
            'precipitation',
            'wind_speed_10m',
            'weather_code',
        ].join(','),

        daily: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'precipitation_sum',
            'precipitation_probability_max',
        ].join(','),

        timezone: 'auto',
        forecast_days: '7',
        wind_speed_unit: 'ms',
    })

    const response = await fetch(
        `${WEATHER_URL}?${params.toString()}`,
        { signal }
    )

    if (!response.ok) {
        throw new Error(
            'Unable to retrieve current weather and forecast.'
        )
    }

    const result = await response.json()

    if (!result.current || !result.daily) {
        throw new Error(
            'Weather service returned incomplete information.'
        )
    }

    return {
        current: result.current,
        daily: result.daily,
        timezone: result.timezone,
        latitude: result.latitude,
        longitude: result.longitude,
        loadedAt: new Date(),
    }
}

// Convert WMO weather codes into readable descriptions.
export const getWeatherDescription = (code) => {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',

        45: 'Fog',
        48: 'Depositing rime fog',

        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',

        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',

        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',

        66: 'Light freezing rain',
        67: 'Heavy freezing rain',

        71: 'Slight snowfall',
        73: 'Moderate snowfall',
        75: 'Heavy snowfall',
        77: 'Snow grains',

        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',

        85: 'Slight snow showers',
        86: 'Heavy snow showers',

        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    }

    if (code === null || code === undefined) {
        return 'Weather unavailable'
    }

    return descriptions[Number(code)] || 'Unknown weather conditions'
}

// Complete field weather helper.
// Useful when a page needs coordinates and weather together.
export const fetchFieldWeather = async (
    field,
    signal
) => {
    if (!field) {
        throw new Error('No field was provided.')
    }

    const coordinates = await getFieldCoordinates(
        field.fieldLocation,
        field.boundary,
        signal
    )

    const weather = await fetchOpenMeteoWeather(
        coordinates.latitude,
        coordinates.longitude,
        signal
    )

    return {
        ...coordinates,
        weather,
        loadedAt: new Date(),
    }
}
