import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from "dotenv"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// In-memory OTP storage (in production, use Redis or database)
const otpStorage = new Map();

// Configure nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password (not regular password)
  }
});

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// API endpoint to send OTP
app.post('https://assignment1-kxjm.onrender.com/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with expiration (5 minutes)
    otpStorage.set(email, {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes from now
    });

    // Email configuration
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your Productr Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Productr</h1>
          </div>
          <div style="padding: 30px; background: #f5f5f5;">
            <h2 style="color: #333;">Verification Code</h2>
            <p style="color: #666; font-size: 16px;">Your OTP for Productr login is:</p>
            <div style="background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">© 2024 Productr. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send email (try-catch to allow OTP to work even if email fails)
    let emailSent = false;
    try {
      await transporter.sendMail(mailOptions);
      emailSent = true;
      console.log(`OTP sent to ${email}: ${otp}`);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue execution even if email fails
    }

    res.json({
      success: true,
      message: emailSent ? 'OTP sent successfully to your email' : 'OTP generated (Email failed)',
      otp: otp // Return OTP for testing/display purposes
    });

  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate OTP. Please try again.'
    });
  }
});

// API endpoint to verify OTP
app.post('https://assignment1-kxjm.onrender.com/api/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Get stored OTP
    const storedData = otpStorage.get(email);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found for this email. Please request a new one.'
      });
    }

    // Check if OTP expired
    if (Date.now() > storedData.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    if (storedData.otp === otp) {
      // OTP is correct, remove it from storage
      otpStorage.delete(email);
      res.json({
        success: true,
        message: 'OTP verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.'
    });
  }
});

// Health check endpoint
app.get('https://assignment1-kxjm.onrender.com/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
