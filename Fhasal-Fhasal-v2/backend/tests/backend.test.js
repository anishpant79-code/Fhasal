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

    test('DevStore UserModel create, find and password comparison', async () => {
        const User = require('../models/User')
        const email = `testfarmer_${Date.now()}@example.com`
        const user = await User.create({
            name: 'Ramesh Patel',
            email,
            phone: '9876543210',
            password: 'StrongFarmerPassword1',
        })

        assert.ok(user._id)
        assert.strictEqual(user.name, 'Ramesh Patel')
        assert.strictEqual(user.email, email)

        const found = await User.findOne({ email }).select('+password')
        assert.ok(found)
        const isMatch = await found.comparePassword('StrongFarmerPassword1')
        assert.strictEqual(isMatch, true)

        const wrongMatch = await found.comparePassword('WrongPass')
        assert.strictEqual(wrongMatch, false)
    })

    test('DevStore FieldModel create, find and update cycle', async () => {
        const Field = require('../models/Field')
        const ownerId = 'test_owner_123'
        const field = await Field.create({
            owner: ownerId,
            fieldName: 'North Paddy Plot',
            fieldArea: 3.5,
            areaUnit: 'acre',
            fieldLocation: 'Nashik, Maharashtra',
            currentCrop: 'Rice',
            boundary: [[19.9975, 73.7898], [19.9985, 73.7908], [19.9965, 73.7918]],
        })

        assert.ok(field._id)
        assert.strictEqual(field.fieldName, 'North Paddy Plot')

        const list = await Field.find({ owner: ownerId }).sort({ createdAt: -1 })
        assert.ok(list.length >= 1)
        assert.strictEqual(list[0].fieldName, 'North Paddy Plot')
    })
})
