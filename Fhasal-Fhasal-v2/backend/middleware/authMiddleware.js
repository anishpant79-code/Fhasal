const jwt = require('jsonwebtoken')
const User = require('../models/User')

const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'fhasal_default_development_jwt_secret_key_2026'
}

const protect = async (req, res, next) => {
    try {
        let token

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Please login.',
            })
        }

        const decoded = jwt.verify(token, getJwtSecret())

        const user = await User.findById(decoded.id).select('-password')

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User account not found.',
            })
        }

        req.user = user

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token.',
        })
    }
}

module.exports = { protect }
