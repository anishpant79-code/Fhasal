
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 8,
            select: false,
        },

        role: {
            type: String,
            enum: ['farmer', 'admin'],
            default: 'farmer',
        },

        // Password reset fields
        resetPasswordToken: {
            type: String,
            select: false,
        },

        resetPasswordExpires: {
            type: Date,
            select: false,
        },
    },
    {
        timestamps: true,
    }
)

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

// Compare login password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
