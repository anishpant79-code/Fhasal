const nodemailer = require('nodemailer')

const createTransporter = () => {
    // If Gmail credentials provided with service mode or smtp
    const user = process.env.EMAIL_USER
    const pass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD

    if (!user || !pass) {
        return null
    }

    if (process.env.EMAIL_HOST) {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: Number(process.env.EMAIL_PORT) === 465,
            auth: { user, pass },
        })
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
    })
}

const sendEmail = async ({ to, subject, html, text }) => {
    const user = process.env.EMAIL_USER
    const transporter = createTransporter()

    if (!transporter) {
        console.warn(
            '[Fhasal Email Service] EMAIL_USER and EMAIL_PASS are not configured in .env. Email simulated.'
        )
        return { simulated: true }
    }

    const mailOptions = {
        from: `"Fhasal Support" <${user}>`,
        to,
        subject,
        html: html || text,
        text: text || '',
    }

    return transporter.sendMail(mailOptions)
}

module.exports = sendEmail
