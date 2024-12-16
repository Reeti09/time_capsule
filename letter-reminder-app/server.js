const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Email sending route
app.post('/send-email', (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ success: false, message: 'Email and message are required.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Letter to Yourself',
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);  // Log detailed error in backend console
            return res.status(500).json({ success: false, message: 'Failed to send email.' });
        }
        console.log('Email sent: ' + info.response);  // Log success
        return res.status(200).json({ success: true, message: 'Email sent successfully.' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});