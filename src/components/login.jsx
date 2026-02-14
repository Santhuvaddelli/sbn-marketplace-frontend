import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!validateRequiredLogin) return;
    if (!validateLoginEmail) return;
    if (!validateLoginPassword) return;
    try {
      const res = await api.post("/api/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      toast.success("login Success");
      navigate("/home/dashboard")
    }
    catch (error) {
      toast.error("Invalid Creadentials");
    }
  }

  // Required Fields Validation
  const validateRequiredLogin = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };
  const validateLoginEmail = () => {
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Invalid Email Address");
      return false;
    }
    return true;
  };
  const validateLoginPassword = () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  return (
    <div className="login-page">
      {/* Top left page logo */}
      <Link to="/">
        <img src="/SBN_LOGO.jpeg" className="login-top-logo" alt="Logo" />
      </Link>

      {/* Left bottom content */}
      <div className="login-left-text">
        <h3>
          Welcome to the Member Management Application, your gateway to
          manage all your membership and user data with ease.
        </h3>
        <div className="login-points">
          <span><img className="tickmark-logo" src="TickMarkLogo.png" alt="check" /> Easy Membership Management</span>
          <span><img className="tickmark-logo" src="TickMarkLogo.png" alt="check" /> Seamless User Experience</span>
          <span><img className="tickmark-logo" src="TickMarkLogo.png" alt="check" /> Comprehensive Data Access</span>
        </div>
      </div>

      {/* REFINED LOGIN CARD */}
      <div className="login-card">
        {/* Logo and Welcome aligned small and to the left */}
        <div className="card-header-left">
          <img src="/SBN_LOGO.jpeg" className="card-logo-small" alt="Logo" />
          <span className="welcome-msg-small">Welcome to SBN</span>
        </div>

        <h5 className="card-subtitle-italic">
          Manage your membership with ease and access your account seamlessly.
        </h5>

        <div className="input-container">
          <input type="text" placeholder="Email Address" className="login-input-small" onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="login-input-small"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="password-eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            )}
          </span>
        </div>

        <div className="remember-me-row">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember Me</label>
        </div>

        <button className="sign-in-button" onClick={handleLogin}>Sign In</button>

        <div className="or-text">OR</div>

        <button className="register-button-outline">
          <Link to="/member">Request To Register</Link>
        </button>

        <div className="card-footer-policy">
          By continuing, you agree to our <span>Privacy Policy</span>.
        </div>
      </div>
    </div>
  );
}