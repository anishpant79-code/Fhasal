
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Register
const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: 'Please provide all required fields',
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters',
            })
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim(),
        })

        if (existingUser) {
            return res.status(409).json({
                message: 'Email is already registered',
            })
        }

        const user = await User.create({
            name,
            email,
            phone,
            password,
        })

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        return res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        })
    } catch (error) {
        console.error('Registration error:', error.message)
        return res.status(500).json({
            message: 'Registration failed',
        })
    }
}

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
            })
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        }).select('+password')

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: 'Invalid email or password',
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        })
    } catch (error) {
        console.error('Login error:', error.message)
        return res.status(500).json({
            message: 'Login failed',
        })
    }
}

// Forgot Password

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                message: 'Email is required',
            })
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        })

        console.log('Forgot password account found:', Boolean(user))
        console.log('Current NODE_ENV:', process.env.NODE_ENV)

        const response = {
            message: 'If an account exists, a password reset link has been generated.',
        }

        if (!user) {
            return res.status(200).json(response)
        }

        const resetToken = crypto.randomBytes(32).toString('hex')

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')

        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000

        await user.save({ validateBeforeSave: false })

        if (process.env.NODE_ENV !== 'production') {
            response.resetLink =
                `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
        }

        return res.status(200).json(response)

    } catch (error) {
        console.error('Forgot password error:', error.message)

        return res.status(500).json({
            message: 'Unable to process password reset',
        })
    }
}


// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body

        if (!token || !password) {
            return res.status(400).json({
                message: 'Token and new password are required',
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters',
            })
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        }).select('+password +resetPasswordToken +resetPasswordExpires')

        if (!user) {
            return res.status(400).json({
                message: 'Reset link is invalid or expired',
            })
        }

        user.password = password
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined

        await user.save()

        return res.status(200).json({
            message: 'Password reset successful. Please log in.',
        })
    } catch (error) {
        console.error('Reset password error:', error.message)
        return res.status(500).json({
            message: 'Unable to reset password',
        })
    }
}

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
}
