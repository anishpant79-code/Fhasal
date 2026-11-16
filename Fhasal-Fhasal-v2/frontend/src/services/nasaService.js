const NASA_POWER_URL = 'https://power.larc.nasa.gov/api/temporal/daily/point'
const OPEN_METEO_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'
const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

const formatDateParam = (date) => {
    return date.toISOString().split('T')[0].replaceAll('-', '')
}

export const nasaService = {
    /**
     * Get default historical 30-day range accounting for NASA reporting latency (3-4 days)
     */
    getDefaultDateRange() {
        const endDate = new Date()
        endDate.setUTCDate(endDate.getUTCDate() - 3)

        const startDate = new Date(endDate)
        startDate.setUTCDate(startDate.getUTCDate() - 29)

        return {
            start: formatDateParam(startDate),
            end: formatDateParam(endDate),
            startDate,
            endDate,
        }
    },

    /**
     * Fetch agroclimatology data from NASA POWER API
     */
    async fetchPowerData(latitude, longitude, customRange = null) {
        const range = customRange || this.getDefaultDateRange()
        const parameters = [
            'T2M',
            'T2M_MAX',
            'T2M_MIN',
            'PRECTOTCORR',
            'RH2M',
            'WS2M',
            'ALLSKY_SFC_SW_DWN',
            'GWETROOT',
            'GWETTOP',
        ].join(',')

        const url = `${NASA_POWER_URL}?parameters=${parameters}&community=AG&longitude=${longitude}&latitude=${latitude}&start=${range.start}&end=${range.end}&format=JSON`

        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`NASA POWER request failed with status: ${response.status}`)
        }
        const data = await response.json()
        return data?.properties?.parameter || {}
    },

    /**
     * Fetch 7-day live agro forecast from Open-Meteo
     */
    async fetchLiveForecast(latitude, longitude) {
        const url = `${OPEN_METEO_WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration&timezone=auto`

        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Open-Meteo request failed with status: ${response.status}`)
        }
        return await response.json()
    },

    /**
     * Search locations via Open-Meteo Geocoding
     */
    async geocodeLocation(query, count = 5) {
        if (!query || query.trim().length < 2) return []
        const url = `${OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(query.trim())}&count=${count}&language=en&format=json`

        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Geocoding failed with status: ${response.status}`)
        }
        const data = await response.json()
        return data?.results || []
    },

    /**
     * Extract finite average from NASA parameter map
     */
    computeAverage(parameterMap) {
        if (!parameterMap) return null
        const validValues = Object.values(parameterMap)
            .map(Number)
            .filter((v) => Number.isFinite(v) && v > -900)
        if (!validValues.length) return null
        return validValues.reduce((sum, v) => sum + v, 0) / validValues.length
    },

    /**
     * Extract finite total from NASA parameter map
     */
    computeTotal(parameterMap) {
        if (!parameterMap) return null
        const validValues = Object.values(parameterMap)
            .map(Number)
            .filter((v) => Number.isFinite(v) && v > -900)
        if (!validValues.length) return null
        return validValues.reduce((sum, v) => sum + v, 0)
    },
}

export default nasaService
