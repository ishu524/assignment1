# Productr Application - Complete Setup Guide

## Overview
This application consists of:
- **Frontend**: React + Vite application (port 5173)
- **Backend**: Node.js Express server for OTP email service (port 5000)

## Step 1: Backend Setup

### 1.1 Navigate to backend folder
```bash
cd backend
```

### 1.2 Install dependencies
```bash
npm install
```

### 1.3 Set up Gmail App Password

1. Go to [Google Account](https://myaccount.google.com)
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled
4. Scroll down to **App passwords**
5. Select app: **Mail**
6. Select device: **Other (Custom name)** → Enter "Productr"
7. Click **Generate**
8. Copy the 16-character password (save it securely)

### 1.4 Create .env file
```bash
# Create .env file in backend folder
cp .env.example .env
```

Edit the `.env` file and add your credentials:
```env
PORT=5000
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

**Important**: Replace with your actual Gmail address and the App Password you generated.

### 1.5 Start the backend server
```bash
npm run dev
```

You should see:
```
Server is running on port 5000
Health check: http://localhost:5000/api/health
```

**Keep this terminal running!**

## Step 2: Frontend Setup

### 2.1 Open a new terminal and navigate to frontend folder
```bash
cd asignment_project
```

### 2.2 Install dependencies (if not already done)
```bash
npm install
```

### 2.3 Start the frontend development server
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Keep this terminal running too!**

## Step 3: Test the Application

1. Open your browser and go to `http://localhost:5173`
2. Enter your email address on the login page
3. Click "Login"
4. Check your email inbox for the OTP (6-digit code)
5. Enter the OTP on the verification page
6. You'll be redirected to the home page

## Troubleshooting

### Backend Issues

**"Invalid credentials" error:**
- Make sure you're using Gmail App Password, not your regular Gmail password
- Verify 2-Step Verification is enabled in your Google Account
- Double-check the email and password in `.env` file

**"Port already in use" error:**
- Change PORT in `.env` file to a different port (e.g., 5001)
- Or kill the process using port 5000

**Email not received:**
- Check your spam/junk folder
- Verify Gmail credentials in `.env` file
- Check backend terminal for error logs
- Make sure backend server is running

### Frontend Issues

**"Failed to connect to server" error:**
- Make sure backend server is running on port 5000
- Check that backend URL in OTP.jsx is `http://localhost:5000`
- Check browser console for CORS errors

**OTP expires:**
- OTP is valid for 5 minutes only
- Request a new OTP by clicking "Resend OTP"

## Architecture

### Backend API Endpoints

1. **POST /api/send-otp**
   - Sends OTP to the provided email
   - Stores OTP with 5-minute expiration

2. **POST /api/verify-otp**
   - Verifies the OTP entered by user
   - Checks expiration and validity

3. **GET /api/health**
   - Health check endpoint

### Frontend Pages

1. **Login Page** (`/`)
   - User enters email
   - Email stored in sessionStorage

2. **OTP Page** (`/otp`)
   - Automatically sends OTP to email via backend
   - User enters 6-digit OTP
   - Verifies OTP with backend

3. **Home Page** (`/home`)
   - Displays published/unpublished products

4. **Products Page** (`/products`)
   - Full CRUD operations for products
   - Publish/Unpublish functionality

## Security Notes

- Never commit `.env` file to version control
- Use Gmail App Password, not regular password
- OTP is stored in memory (use Redis/database for production)
- OTP expires after 5 minutes
- Backend validates all OTP requests

## Production Deployment

For production, consider:
- Use a database (PostgreSQL/MongoDB) for OTP storage
- Implement rate limiting to prevent abuse
- Add request validation middleware
- Use environment-specific configurations
- Deploy backend on Heroku, AWS, or Railway
- Deploy frontend on Vercel, Netlify, or similar

## Need Help?

Check the detailed documentation:
- Backend: `backend/README.md`
- Frontend: `asignment_project/README.md` (if exists)
