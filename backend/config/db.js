
const dns = require('dns')

// Use Google DNS for MongoDB SRV lookup
dns.setServers(['8.8.8.8', '8.8.4.4'])

const mongoose = require('mongoose')

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is missing from .env')
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 15000,
        })

        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection failed:', error.message)
        throw error
    }
}

module.exports = connectDB
