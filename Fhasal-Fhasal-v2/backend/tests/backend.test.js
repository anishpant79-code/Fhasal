const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

describe('Backend Core Security & Models', () => {
    const JWT_SECRET = 'fhasal_test_jwt_secret_2026'

    test('JWT token generation and verification cycle', () => {
        const payload = { id: '65f1a2b3c4d5e6f7a8b9c0d1', role: 'farmer' }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
        assert.ok(typeof token === 'string' && token.length > 20)

        const decoded = jwt.verify(token, JWT_SECRET)
        assert.strictEqual(decoded.id, payload.id)
        assert.strictEqual(decoded.role, payload.role)
    })

    test('JWT verification rejects tampered or expired tokens', () => {
        const payload = { id: 'test_user_id' }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
        const tampered = token.slice(0, -5) + 'xxxxx'

        assert.throws(() => {
            jwt.verify(tampered, JWT_SECRET)
        })
    })

    test('Bcrypt password hashing and verification', async () => {
        const plainPassword = 'FarmerSecretPassword123'
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(plainPassword, salt)

        assert.notStrictEqual(hash, plainPassword)
        const isMatch = await bcrypt.compare(plainPassword, hash)
        assert.strictEqual(isMatch, true)

        const isWrongMatch = await bcrypt.compare('WrongPassword', hash)
        assert.strictEqual(isWrongMatch, false)
    })

    test('Field areaUnit supports all 4 standard regional units', () => {
        const allowedUnits = ['acre', 'hectare', 'guntha', 'bigha']
        const testUnits = ['Acre', 'HECTARE', 'guntha', 'Bigha']

        testUnits.forEach((unit) => {
            const normalized = unit.toLowerCase()
            assert.ok(allowedUnits.includes(normalized), `Unit ${unit} must be supported`)
        })
    })
})
