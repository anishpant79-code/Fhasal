
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

// 404 Not Found Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    })
})

// Centralized Global Error Handler
app.use((err, req, res, _next) => {
    console.error('Unhandled server error:', err.stack || err.message)
    const statusCode = err.status || err.statusCode || 500
    res.status(statusCode).json({
        success: false,
        message:
            process.env.NODE_ENV === 'production'
                ? 'Internal server error. Please try again later.'
                : err.message || 'Internal server error',
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
