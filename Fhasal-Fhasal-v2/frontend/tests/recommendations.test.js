import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import {
    evaluateFieldSuitability,
    REFERENCE_CROPS,
} from '../src/services/recommendationService.js'
import {
    calculateCropSuitability,
    getCurrentGrowingSeason,
} from '../src/utils/cropSuitability.js'

describe('Crop Recommendations & Suitability Engine', () => {
    test('REFERENCE_CROPS catalog contains all 9 planned Indian agriculture crops', () => {
        assert.strictEqual(REFERENCE_CROPS.length, 9)
        const cropIds = REFERENCE_CROPS.map((c) => c.id)
        assert.ok(cropIds.includes('rice'))
        assert.ok(cropIds.includes('wheat'))
        assert.ok(cropIds.includes('cotton'))
        assert.ok(cropIds.includes('chickpea'))
        assert.ok(cropIds.includes('millets'))
    })

    test('getCurrentGrowingSeason accurately identifies seasonal periods', () => {
        // Month 7 = July (Kharif)
        const julyDate = new Date(2026, 6, 15)
        assert.strictEqual(getCurrentGrowingSeason(julyDate), 'Kharif')

        // Month 12 = December (Rabi)
        const decDate = new Date(2026, 11, 15)
        assert.strictEqual(getCurrentGrowingSeason(decDate), 'Rabi')
    })

    test('evaluateFieldSuitability computes scores and sorts crops descending by score', () => {
        const field = { soilType: 'Black Soil' }
        const weather = { temperature: 28, rainfall: 45 }
        const recommendations = evaluateFieldSuitability({
            field,
            temperature: weather.temperature,
            rainfall: weather.rainfall,
            season: 'Kharif',
        })

        assert.strictEqual(recommendations.length, REFERENCE_CROPS.length)

        for (let i = 0; i < recommendations.length - 1; i++) {
            const currentScore = recommendations[i].suitability.score || 0
            const nextScore = recommendations[i + 1].suitability.score || 0
            assert.ok(
                currentScore >= nextScore,
                `Recommendations must be sorted descending: ${currentScore} >= ${nextScore}`
            )
        }
    })

    test('calculateCropSuitability assigns higher scores to soil-compatible crops', () => {
        const cotton = REFERENCE_CROPS.find((c) => c.id === 'cotton')
        assert.ok(cotton)

        // Cotton thrives in black soil
        const blackSoilEval = calculateCropSuitability({
            crop: cotton,
            fieldSoil: 'Black Soil',
            averageTemperature: 28,
            weeklyRainfall: 30,
            currentSeason: 'Kharif',
        })

        // Unfavorable soil
        const incompatibleEval = calculateCropSuitability({
            crop: cotton,
            fieldSoil: 'Laterite Soil',
            averageTemperature: 28,
            weeklyRainfall: 30,
            currentSeason: 'Kharif',
        })

        assert.ok(
            blackSoilEval.score > incompatibleEval.score,
            `Black soil score (${blackSoilEval.score}) should exceed incompatible score (${incompatibleEval.score})`
        )
    })
})
