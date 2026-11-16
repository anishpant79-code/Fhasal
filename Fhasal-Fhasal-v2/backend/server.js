
require('dotenv').config()

const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const fieldRoutes = require('./routes/fieldRoutes')

const app = express()

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}))

app.use(express.json())

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/fields', fieldRoutes)

// Home Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Fhasal Backend API',
    })
})

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Fhasal backend is running',
    })
})

// Start Server
const startServer = async () => {
    try {
        await connectDB()

        const PORT = process.env.PORT || 5000

        app.listen(PORT, () => {
            console.log(`Fhasal server running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Server startup failed:', error.message)
        process.exit(1)
    }
}

startServer()
