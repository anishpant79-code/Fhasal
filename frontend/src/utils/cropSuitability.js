
// src/utils/cropSuitability.js

/**
 * Indicative crop suitability scoring engine.
 *
 * Factors:
 * Soil compatibility: 25 points
 * Temperature:         35 points
 * Forecast rainfall:  20 points
 * Growing season:     20 points
 *
 * IMPORTANT:
 * These are demonstration scoring rules, not validated agronomic thresholds.
 * Seven-day rainfall is not a substitute for seasonal rainfall or irrigation data.
 */

// --------------------------------------------------
// 1. Soil normalization
// --------------------------------------------------

const normalizeSoil = (soil) => {
    if (!soil) return ''

    const value = soil
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')

    const aliases = {
        'black soil': 'black',
        black: 'black',

        'red soil': 'red',
        red: 'red',

        'alluvial soil': 'alluvial',
        alluvial: 'alluvial',

        'sandy soil': 'sandy',
        sandy: 'sandy',

        'sandy loam': 'sandy-loam',
        'sandy loam soil': 'sandy-loam',
        'sandy-loam': 'sandy-loam',

        'clayey soil': 'clayey',
        clayey: 'clayey',
        clay: 'clayey',

        'loamy soil': 'loamy',
        loamy: 'loamy',
        loam: 'loamy',

        'clay loam': 'clay-loam',
        'clay loam soil': 'clay-loam',
        'clayey loam': 'clay-loam',

        'laterite soil': 'laterite',
        laterite: 'laterite',
    }

    return aliases[value] || ''
}

// --------------------------------------------------
// 2. Current Indian growing season
// --------------------------------------------------

export const getCurrentGrowingSeason = (date = new Date()) => {
    const month = date.getMonth() + 1

    // Broad indicative Indian seasonal calendar.
    if (month >= 6 && month <= 10) {
        return 'Kharif'
    }

    if (month === 11 || month === 12 || month <= 3) {
        return 'Rabi'
    }

    return 'Transition'
}

// --------------------------------------------------
// 3. Soil suitability
// --------------------------------------------------

const calculateSoilScore = (fieldSoil, crop) => {
    const normalizedSoil = normalizeSoil(fieldSoil)

    if (!normalizedSoil) {
        return null
    }

    const compatible = Array.isArray(crop.soilCategories)
        ? crop.soilCategories.includes(normalizedSoil)
        : false

    return {
        name: 'Soil compatibility',
        score: compatible ? 25 : 10,
        maximum: 25,
        status: compatible ? 'good' : 'caution',
        explanation: compatible
            ? `The ${fieldSoil} category appears in this crop's reference soil profile.`
            : `The ${fieldSoil} category is not listed in this crop's reference soil profile. This does not prove the crop is unsuitable.`,
    }
}

// --------------------------------------------------
// 4. Temperature suitability
// --------------------------------------------------

const calculateTemperatureScore = (temperature, crop) => {
    if (
        temperature === null ||
        temperature === undefined ||
        !Number.isFinite(Number(temperature)) ||
        !Array.isArray(crop.temperatureRange) ||
        crop.temperatureRange.length !== 2
    ) {
        return null
    }

    const value = Number(temperature)
    const [minimum, maximum] = crop.temperatureRange

    let score
    let status
    let explanation

    if (value >= minimum && value <= maximum) {
        score = 35
        status = 'good'
        explanation =
            `The forecast average of ${value.toFixed(1)}°C is within the broad ${minimum}–${maximum}°C reference range.`
    } else {
        const distance = value < minimum
            ? minimum - value
            : value - maximum

        if (distance <= 3) {
            score = 25
            status = 'moderate'
        } else if (distance <= 6) {
            score = 15
            status = 'caution'
        } else {
            score = 5
            status = 'caution'
        }

        explanation =
            `The forecast average is ${value.toFixed(1)}°C, outside the broad ${minimum}–${maximum}°C reference range.`
    }

    return {
        name: 'Temperature',
        score,
        maximum: 35,
        status,
        explanation,
    }
}

// --------------------------------------------------
// 5. Forecast rainfall suitability
// --------------------------------------------------

const calculateRainfallScore = (rainfall, crop) => {
    if (
        rainfall === null ||
        rainfall === undefined ||
        !Number.isFinite(Number(rainfall)) ||
        Number(rainfall) < 0
    ) {
        return null
    }

    const value = Number(rainfall)
    const waterNeed = (crop.water || '').toLowerCase()

    let score
    let status
    let explanation

    if (waterNeed === 'high') {
        if (value >= 30) {
            score = 20
            status = 'good'
        } else if (value >= 15) {
            score = 14
            status = 'moderate'
        } else if (value >= 5) {
            score = 8
            status = 'caution'
        } else {
            score = 4
            status = 'caution'
        }
    } else if (waterNeed === 'medium') {
        if (value >= 10 && value <= 40) {
            score = 20
            status = 'good'
        } else if (value >= 5 && value < 10) {
            score = 14
            status = 'moderate'
        } else if (value > 40 && value <= 60) {
            score = 14
            status = 'moderate'
        } else {
            score = 8
            status = 'caution'
        }
    } else {
        if (value <= 20) {
            score = 20
            status = 'good'
        } else if (value <= 35) {
            score = 14
            status = 'moderate'
        } else {
            score = 8
            status = 'caution'
        }
    }

    explanation =
        `The seven-day forecast shows ${value.toFixed(1)} mm of rainfall. The crop's reference water requirement is ${crop.water.toLowerCase()}. Actual water availability also depends on irrigation, soil moisture and drainage.`

    return {
        name: 'Forecast rainfall',
        score,
        maximum: 20,
        status,
        explanation,
    }
}

// --------------------------------------------------
// 6. Growing season suitability
// --------------------------------------------------

const calculateSeasonScore = (crop, currentSeason) => {
    if (!currentSeason || currentSeason === 'Transition') {
        return {
            name: 'Growing season',
            score: 10,
            maximum: 20,
            status: 'moderate',
            explanation:
                'The current period is treated as a seasonal transition. Check local sowing calendars.',
        }
    }

    const cropSeasons = (crop.season || '')
        .toLowerCase()
        .split('/')
        .map((season) => season.trim())

    const compatible = cropSeasons.includes(currentSeason.toLowerCase())

    return {
        name: 'Growing season',
        score: compatible ? 20 : 8,
        maximum: 20,
        status: compatible ? 'good' : 'caution',
        explanation: compatible
            ? `${currentSeason} is included in this crop's reference growing season.`
            : `${currentSeason} is not listed as this crop's reference growing season.`,
    }
}

// --------------------------------------------------
// 7. Main suitability calculation
// --------------------------------------------------

export const calculateCropSuitability = ({
    crop,
    fieldSoil = '',
    averageTemperature = null,
    weeklyRainfall = null,
    currentSeason = getCurrentGrowingSeason(),
}) => {
    if (!crop) {
        return {
            score: null,
            rating: 'Unavailable',
            coverage: 0,
            factors: [],
            message: 'Crop information is missing.',
        }
    }

    const factors = [
        calculateSoilScore(fieldSoil, crop),
        calculateTemperatureScore(averageTemperature, crop),
        calculateRainfallScore(weeklyRainfall, crop),
        calculateSeasonScore(crop, currentSeason),
    ].filter(Boolean)

    const availableMaximum = factors.reduce(
        (total, factor) => total + factor.maximum,
        0
    )

    const earnedPoints = factors.reduce(
        (total, factor) => total + factor.score,
        0
    )

    const coverage = availableMaximum

    if (availableMaximum === 0) {
        return {
            score: null,
            rating: 'Insufficient data',
            coverage: 0,
            factors,
            message: 'Not enough information to calculate crop suitability.',
        }
    }

    const score = Math.round(
        (earnedPoints / availableMaximum) * 100
    )

    let rating

    if (score >= 80) {
        rating = 'High suitability'
    } else if (score >= 60) {
        rating = 'Moderate suitability'
    } else if (score >= 40) {
        rating = 'Low suitability'
    } else {
        rating = 'Very low suitability'
    }

    return {
        score,
        rating,
        coverage,
        factors,
        message:
            `Calculated using ${factors.length} available factors. ${coverage}/100 weighted points were available.`,
    }
}
