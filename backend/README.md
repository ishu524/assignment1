# Productr Backend - OTP Email Service

Backend server for sending OTP via Gmail for the Productr application.

## Features

- Send OTP to email via Gmail
- Verify OTP with expiration (5 minutes)
- RESTful API endpoints
- In-memory OTP storage
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- Gmail account with App Password enabled

## Gmail App Password Setup

1. Go to [Google Account](https://myaccount.google.com)
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled
4. Go to **App passwords** at the bottom
5. Select app: **Mail**
6. Select device: **Other (Custom name)** → Enter "Productr"
7. Click **Generate**
8. Copy the 16-character password (save it securely)

## Installation

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Gmail credentials:
```env
PORT=5000
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 2. Send OTP
```http
POST /api/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to your email"
}
```

### 3. Verify OTP
```http
POST /api/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid OTP. Please try again."
}
```

## OTP Expiration

- OTP expires after **5 minutes**
- Expired OTPs are automatically removed from storage
- Users need to request a new OTP after expiration

## Security Notes

- Never commit `.env` file to version control
- Use Gmail App Password, not regular password
- OTP is stored in memory (use Redis/database for production)
- CORS is enabled for localhost:5173 (Vite default port)

## Troubleshooting

**"Invalid credentials" error:**
- Make sure you're using Gmail App Password, not regular password
- Check if 2-Step Verification is enabled
- Verify the email and password in `.env` file

**"Port already in use" error:**
- Change PORT in `.env` file
- Or kill the process using port 5000

**Email not received:**
- Check spam folder
- Verify Gmail credentials
- Check server console for error logs

## Production Deployment

For production, consider:
- Use a database (PostgreSQL/MongoDB) for OTP storage
- Implement rate limiting to prevent abuse
- Add request validation middleware
- Use environment-specific configurations
- Deploy on services like Heroku, AWS, or Railway

## License

ISC
