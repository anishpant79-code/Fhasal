import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import {
    convertArea,
    calculateFieldArea,
    formatNumber,
    calculateSeedRequirement,
    estimateHarvestYield,
    SQ_METERS_PER_UNIT,
} from '../src/utils/calculations.js'

describe('Agricultural Calculations Utility', () => {
    test('convertArea correctly converts acres to hectares and square meters', () => {
        const areaInAcres = 2.47105
        const inHectares = convertArea(areaInAcres, 'acre', 'hectare')
        assert.ok(Math.abs(inHectares - 1.0) < 0.01, '2.471 acres should equal ~1 hectare')

        const oneAcreInSqm = convertArea(1, 'acre', 'sqm')
        assert.strictEqual(Math.round(oneAcreInSqm), 4047)
    })

    test('convertArea handles bigha conversion', () => {
        const twoBighaInSqm = convertArea(2, 'bigha', 'sqm')
        assert.strictEqual(twoBighaInSqm, 5000)

        const bighaToAcre = convertArea(1, 'bigha', 'acre')
        assert.ok(bighaToAcre > 0.6 && bighaToAcre < 0.65)
    })

    test('convertArea handles zero, negative, and invalid inputs gracefully', () => {
        assert.strictEqual(convertArea(0, 'acre', 'hectare'), 0)
        assert.strictEqual(convertArea(-5, 'acre', 'hectare'), 0)
        assert.strictEqual(convertArea('invalid', 'acre', 'hectare'), 0)
    })

    test('calculateFieldArea returns 0 for less than 3 boundary points', () => {
        assert.strictEqual(calculateFieldArea([]), 0)
        assert.strictEqual(calculateFieldArea([[20.1, 78.1]]), 0)
        assert.strictEqual(calculateFieldArea([[20.1, 78.1], [20.2, 78.2]]), 0)
    })

    test('calculateFieldArea returns a positive area for a valid triangular coordinate loop', () => {
        const triangleCoords = [
            [20.000, 78.000],
            [20.005, 78.000],
            [20.005, 78.005],
        ]
        const areaInAcres = calculateFieldArea(triangleCoords, 'acre')
        assert.ok(areaInAcres > 0, 'Calculated area must be strictly positive')
    })

    test('calculateSeedRequirement computes expected seed mass', () => {
        const seedKg = calculateSeedRequirement(5, 'acre', 20)
        assert.strictEqual(seedKg, 100)
    })

    test('estimateHarvestYield computes estimated quintals', () => {
        const yieldQuintals = estimateHarvestYield(3, 'acre', 15)
        assert.strictEqual(yieldQuintals, 45)
    })

    test('formatNumber formats numbers with precision', () => {
        assert.strictEqual(formatNumber(1234.567, 2), '1,234.57')
        assert.strictEqual(formatNumber('invalid'), '0')
    })
})
