const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')

const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'fhasal_default_development_jwt_secret_key_2026'
}

const formatUserResponse = (user) => ({
    id: user._id.toString(),
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    location: user.location || '',
    district: user.district || '',
    state: user.state || '',
    bio: user.bio || '',
    preferredLanguage: user.preferredLanguage || 'en',
    preferredUnit: user.preferredUnit || 'Acre',
    createdAt: user.createdAt,
})

// Register
const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters',
            })
        }

        const normalizedEmail = email.toLowerCase().trim()
        const existingUser = await User.findOne({ email: normalizedEmail })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered',
            })
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            password,
        })

        const token = jwt.sign(
            { id: user._id },
            getJwtSecret(),
            { expiresIn: '7d' }
        )

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: formatUserResponse(user),
        })
    } catch (error) {
        console.error('Registration error:', error.message)
        return res.status(500).json({
            success: false,
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
                success: false,
                message: 'Email and password are required',
            })
        }

        const normalizedEmail = email.toLowerCase().trim()
        const user = await User.findOne({ email: normalizedEmail }).select('+password')

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        const token = jwt.sign(
            { id: user._id },
            getJwtSecret(),
            { expiresIn: '7d' }
        )

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: formatUserResponse(user),
        })
    } catch (error) {
        console.error('Login error:', error.message)
        return res.status(500).json({
            success: false,
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
                success: false,
                message: 'Email is required',
            })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const user = await User.findOne({ email: normalizedEmail })

        const response = {
            success: true,
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

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`

        // Send reset email via nodemailer
        try {
            await sendEmail({
                to: user.email,
                subject: 'Fhasal - Password Reset Request',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #E5EAE1; border-radius: 12px; background-color: #FAFCF9;">
                        <h2 style="color: #174B35; margin-bottom: 8px;">Fhasal Password Reset</h2>
                        <p style="color: #456354; font-size: 15px;">Hello ${user.name},</p>
                        <p style="color: #456354; font-size: 15px;">You requested a password reset for your Fhasal agriculture account. Click the button below to set a new password:</p>
                        <div style="margin: 24px 0;">
                            <a href="${resetUrl}" style="background-color: #347052; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Reset Password</a>
                        </div>
                        <p style="color: #7A8475; font-size: 13px;">This link will expire in 15 minutes. If you did not request this, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #E5EAE1; margin: 24px 0;" />
                        <p style="color: #7A8475; font-size: 12px;">© 2026 Fhasal - Smart Agriculture Platform</p>
                    </div>
                `,
            })
        } catch (emailErr) {
            console.warn('Email sending failed (will continue):', emailErr.message)
        }

        // Return reset link in dev mode for convenient testing
        if (process.env.NODE_ENV !== 'production') {
            response.resetLink = resetUrl
        }

        return res.status(200).json(response)
    } catch (error) {
        console.error('Forgot password error:', error.message)
        return res.status(500).json({
            success: false,
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
                success: false,
                message: 'Token and new password are required',
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
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
                success: false,
                message: 'Reset link is invalid or expired',
            })
        }

        user.password = password
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined

        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Password reset successful. Please log in.',
        })
    } catch (error) {
        console.error('Reset password error:', error.message)
        return res.status(500).json({
            success: false,
            message: 'Unable to reset password',
        })
    }
}

// Get Current User Profile
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }

        return res.status(200).json({
            success: true,
            user: formatUserResponse(user),
        })
    } catch (error) {
        console.error('Get profile error:', error.message)
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch user profile',
        })
    }
}

// Update Current User Profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }

        const allowedUpdates = [
            'name',
            'phone',
            'location',
            'district',
            'state',
            'bio',
            'preferredLanguage',
            'preferredUnit',
        ]

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = typeof req.body[field] === 'string'
                    ? req.body[field].trim()
                    : req.body[field]
            }
        })

        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: formatUserResponse(user),
        })
    } catch (error) {
        console.error('Update profile error:', error.message)
        return res.status(400).json({
            success: false,
            message: error.message || 'Unable to update profile',
        })
    }
}

// Change Password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required',
            })
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters',
            })
        }

        const user = await User.findById(req.user._id).select('+password')
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect current password',
            })
        }

        user.password = newPassword
        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        })
    } catch (error) {
        console.error('Change password error:', error.message)
        return res.status(500).json({
            success: false,
            message: 'Unable to change password',
        })
    }
}

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    getMe,
    updateProfile,
    changePassword,
}
