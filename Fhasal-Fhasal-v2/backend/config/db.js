
const dns = require('dns')

// Use Google DNS for MongoDB SRV lookup
dns.setServers(['8.8.8.8', '8.8.4.4'])

const mongoose = require('mongoose')

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.log('----------------------------------------------------')
        console.log('⚡ [Fhasal Dev Engine] MONGO_URI not found in backend/.env.')
        console.log('⚡ [Fhasal Dev Engine] Starting in Development Mode with local storage (dev-storage.json).')
        console.log('⚡ [Fhasal Dev Engine] All features (register, login, profile, fields) are fully active!')
        console.log('----------------------------------------------------')
        return false
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 15000,
        })

        console.log('MongoDB connected successfully')
        return true
    } catch (error) {
        console.warn('⚠️  MongoDB connection failed:', error.message)
        console.warn('⚡ [Fhasal Dev Engine] Falling back to local development storage.')
        return false
    }
}

module.exports = connectDB
