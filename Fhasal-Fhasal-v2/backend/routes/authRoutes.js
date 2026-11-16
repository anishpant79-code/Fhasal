const express = require('express')
const router = express.Router()

const {
    register,
    login,
    forgotPassword,
    resetPassword,
    getMe,
    updateProfile,
    changePassword,
} = require('../controllers/authController')

const { protect } = require('../middleware/authMiddleware')

// Public auth routes
router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/reset-password/:token', resetPassword)
router.put('/reset-password/:token', resetPassword)

// Protected user profile routes
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePassword)

module.exports = router
