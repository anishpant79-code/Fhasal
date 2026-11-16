/**
 * Agricultural calculation utilities for Fhasal
 */

export const SQ_METERS_PER_UNIT = {
    acre: 4046.8564224,
    acres: 4046.8564224,
    hectare: 10000,
    hectares: 10000,
    guntha: 101.17141056,
    gunthas: 101.17141056,
    bigha: 2500,
    bighas: 2500,
    sqm: 1,
}

/**
 * Convert area between units
 */
export const convertArea = (value, fromUnit = 'acre', toUnit = 'acre') => {
    const numericValue = Number(value)
    if (!Number.isFinite(numericValue) || numericValue <= 0) return 0

    const fromFactor = SQ_METERS_PER_UNIT[String(fromUnit).toLowerCase()] || SQ_METERS_PER_UNIT.acre
    const toFactor = SQ_METERS_PER_UNIT[String(toUnit).toLowerCase()] || SQ_METERS_PER_UNIT.acre

    const sqMeters = numericValue * fromFactor
    return sqMeters / toFactor
}

/**
 * Calculate field area from GPS coordinates using spherical geodesy / planar approximation
 * @param {Array<[number, number]>|Array<{lat: number, lng: number}>} coordinates
 * @param {string} unit
 * @returns {number} area in specified unit
 */
export const calculateFieldArea = (coordinates, unit = 'acre') => {
    if (!Array.isArray(coordinates) || coordinates.length < 3) return 0

    const normalized = coordinates.map((pt) => {
        if (Array.isArray(pt)) return { lat: Number(pt[0]), lng: Number(pt[1]) }
        return { lat: Number(pt.lat), lng: Number(pt.lng) }
    })

    // Spherical polygon area (in square meters)
    const EARTH_RADIUS = 6378137 // meters
    let totalArea = 0
    const len = normalized.length

    for (let i = 0; i < len; i++) {
        const p1 = normalized[i]
        const p2 = normalized[(i + 1) % len]

        const dLng = ((p2.lng - p1.lng) * Math.PI) / 180
        const lat1 = (p1.lat * Math.PI) / 180
        const lat2 = (p2.lat * Math.PI) / 180

        totalArea += dLng * (2 + Math.sin(lat1) + Math.sin(lat2))
    }

    totalArea = Math.abs((totalArea * EARTH_RADIUS * EARTH_RADIUS) / 2)

    return convertArea(totalArea, 'sqm', unit)
}

/**
 * Format numbers with locale and precision
 */
export const formatNumber = (num, decimals = 2) => {
    const val = Number(num)
    if (!Number.isFinite(val)) return '0'
    return val.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

/**
 * Estimate seed requirement in kilograms
 */
export const calculateSeedRequirement = (area, unit = 'acre', rateKgPerAcre = 20) => {
    const areaInAcres = convertArea(area, unit, 'acre')
    return areaInAcres * rateKgPerAcre
}

/**
 * Estimate crop harvest yield in quintals (1 quintal = 100 kg)
 */
export const estimateHarvestYield = (area, unit = 'acre', quintalsPerAcre = 15) => {
    const areaInAcres = convertArea(area, unit, 'acre')
    return areaInAcres * quintalsPerAcre
}

export default {
    SQ_METERS_PER_UNIT,
    convertArea,
    calculateFieldArea,
    formatNumber,
    calculateSeedRequirement,
    estimateHarvestYield,
}
