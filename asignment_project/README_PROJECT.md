# Productr Login Flow Application

A modern, responsive authentication flow built with React and React Router.

## Features

- **Login Page**: Email/phone input with beautiful gradient design
- **OTP Verification**: 6-digit OTP input with auto-focus and paste support
- **Home Page**: Welcome dashboard with feature cards
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Navigation**: Seamless page transitions using React Router

## Project Structure

```
asignment_project/
├── public/
│   └── runner.jpg          ← Add your runner image here
├── src/
│   ├── pages/
│   │   ├── Login.jsx       - Login page component
│   │   ├── Login.css       - Login page styles
│   │   ├── OTP.jsx         - OTP verification page
│   │   ├── OTP.css         - OTP page styles
│   │   ├── Home.jsx        - Home/Dashboard page
│   │   └── Home.css        - Home page styles
│   ├── App.jsx             - Main app with routing
│   ├── App.css             - Global app styles
│   ├── index.css           - Reset and base styles
│   └── main.jsx            - Entry point
└── package.json
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd asignment_project
npm install
```

### 2. Add Runner Image
Save your runner image as `runner.jpg` and place it in the `public` folder:
- Path: `asignment_project/public/runner.jpg`
- The app has a gradient fallback if the image is missing

### 3. Run Development Server
```bash
npm run dev
```

The app will start at: `http://localhost:5173`

## How It Works

### Flow:
1. **Login Page** (`/`)
   - User enters email or phone number
   - Clicks "Login" button
   - Email is stored in sessionStorage
   - Navigates to OTP page

2. **OTP Page** (`/otp`)
   - User enters 6-digit OTP
   - Auto-focuses next input field
   - Supports paste functionality
   - Can resend OTP
   - After verification, navigates to Home page

3. **Home Page** (`/home`)
   - Displays welcome message with user email
   - Shows feature cards
   - Logout button returns to Login page

### Authentication:
- Currently uses sessionStorage for demo purposes
- In production, you would:
  - Send email to backend API
  - Backend sends actual OTP via email/SMS
  - Verify OTP with backend
  - Use JWT tokens for authentication

## Technologies Used

- **React 19.2.0** - UI library
- **React Router DOM 7.x** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with gradients and animations

## Design Features

- **Gradient Backgrounds**: Beautiful purple-blue gradient on left panel
- **Orange Sunset Gradient**: Fallback for runner image area
- **Smooth Transitions**: Hover effects and animations
- **Modern UI**: Clean, minimalist design
- **Responsive Layout**: Adapts to all screen sizes

## Customization

### Change Colors:
Edit the CSS files in `src/pages/` to customize:
- Primary color: `#1a1a4d` (dark blue)
- Accent color: `#4a90e2` (light blue)
- Gradient colors in `.login-left` and `.image-card`

### Modify OTP Length:
In [OTP.jsx](src/pages/OTP.jsx), change the initial state array length.

### Add Backend Integration:
Update the following functions:
- `handleLogin()` in [Login.jsx](src/pages/Login.jsx:14)
- `handleVerify()` in [OTP.jsx](src/pages/OTP.jsx:51)

## Building for Production

```bash
npm run build
```

Output will be in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

---

Made with ❤️ using React & Vite
