import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import runnerImage from '../assets/Runner.png';
import './OTP.css';

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [receivedOtp, setReceivedOtp] = useState(null); // State for debug OTP

  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('userEmail');
    if (!storedEmail) {
      navigate('/');
    } else {
      setEmail(storedEmail);
      // Send OTP via backend API
      sendOTPToEmail(storedEmail);
    }
  }, [navigate]);

  const sendOTPToEmail = async (emailAddress) => {
    setIsSendingOTP(true);
    setErrorMessage('');
    setReceivedOtp(null);

    try {
      const response = await fetch('https://assignment1-kxjm.onrender.com/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailAddress }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        if (data.otp) {
          setReceivedOtp(data.otp);
        }
      } else {
        setErrorMessage(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrorMessage('Failed to connect to server. Make sure backend is running on port 5000.');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setErrorMessage('Please enter complete 6-digit OTP');
      return;
    }

    // Clear any previous error
    setErrorMessage('');
    setIsVerifying(true);

    try {
      const response = await fetch('https://assignment1-kxjm.onrender.com/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();

      if (data.success) {
        // OTP is correct, navigate to home
        navigate('/home');
      } else {
        // OTP is incorrect, show error
        setErrorMessage(data.message || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage('Failed to connect to server. Make sure backend is running.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    // Clear inputs and error
    setOtp(['', '', '', '', '', '']);
    setErrorMessage('');

    // Call backend to send new OTP
    await sendOTPToEmail(email);

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-left">
        <div className="logo">
          <span>Productr</span>
          <span className="logo-icon">🔗</span>
        </div>
        <div className="image-card">
          <img src={runnerImage} alt="Runner" className="runner-image" />
          <div className="image-text">
            <p>Uplist your</p>
            <p>product to market</p>
          </div>
        </div>
      </div>

      <div className="otp-right">
        <div className="otp-form-container">
          <h1 className="otp-title">Enter Verification Code</h1>
          <p className="otp-subtitle">
            We've sent a 6-digit verification code to
            <br />
            <strong>{email}</strong>
          </p>

          {/* Email sent message */}
          {isSendingOTP && (
            <div className="otp-sent-message">
              <div className="email-icon">📧</div>
              <p className="otp-sent-text">
                Sending OTP to your email...
              </p>
            </div>
          )}

          {otpSent && !isSendingOTP && (
            <div className="otp-sent-message">
              <div className="email-icon">📧</div>
              <p className="otp-sent-text">
                OTP has been sent to your email address
              </p>
              <p className="otp-sent-note">
                Check your email inbox for the 6-digit verification code. The code will expire in 5 minutes.
              </p>
            </div>
          )}

          {/* Display Received OTP (For Debugging/No-Email scenarios) */}
          {receivedOtp && (
            <div style={{
              margin: '20px 0',
              padding: '15px',
              border: '2px dashed #667eea',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                <strong>Debug Mode / Email Failed:</strong> Use this OTP
              </p>
              <h2 style={{ margin: 0, color: '#667eea', letterSpacing: '5px' }}>{receivedOtp}</h2>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="otp-error">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleVerify} className="otp-form">
            <div className="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button type="submit" className="verify-button" disabled={isVerifying}>
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button onClick={handleResendOTP} className="resend-button">
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;
