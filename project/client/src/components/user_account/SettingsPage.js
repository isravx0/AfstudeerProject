import React, { useState, useEffect } from "react";
import "./style/SettingsPage.css";
import { useAuth } from "../AuthContext"; // Context for user data and authentication token
import Swal from "sweetalert2";
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const SettingsPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [mfaMethod, setMfaMethod] = useState(""); 
  const { userData, setUserData, token } = useAuth();
  const navigate = useNavigate(); // Initialize navigate

  // Use effect to get user settings from API or localStorage
  useEffect(() => {
    if (token) {
        const authToken = localStorage.getItem("authToken");
        axios
            .get("/api/user-info", {
                headers: { Authorization: `Bearer ${authToken}` },
            })
            .then((response) => {
                setUserData(response.data.user);
                setTwoFactorAuth(response.data.user.mfa_enabled); // Sync MFA status
                setMfaMethod(response.data.user.mfa_method); // Sync MFA method (email or TOTP)
            })
            .catch((err) => {
                console.error("Failed to load user data:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to load user data. Please try again later.",
                });
            });
    }
    const savedTwoFactor = localStorage.getItem("twoFactorAuth");
    if (savedTwoFactor !== null) {
        setTwoFactorAuth(JSON.parse(savedTwoFactor));
    }
  }, [token, setUserData]);

  // Function to handle MFA method switch
  const handleMfaSwitch = () => {
    if (!twoFactorAuth) {
      Swal.fire({
        icon: 'warning',
        title: 'Two-Factor Authentication is not enabled',
        text: 'Please enable two-factor authentication first before switching the MFA method.',
      });
      return;
    }

    Swal.fire({
      title: 'Switch MFA Method',
      text: `You are currently using ${userData.mfa_method === "email" ? "Email" : "QR Code (Authy)"} as your MFA method. Do you want to switch to the other method?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, switch',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call API to switch MFA method on the server
          const response = await axios.post('http://localhost:5000/api/switch-mfa-method', {
            email: userData.email,
            currentMethod: userData.mfa_method,
          });

          Swal.fire({
            icon: 'success',
            title: 'MFA Method Switched',
            text: `Your MFA method has been switched to ${mfaMethod === "email" ? "QR Code (Authy)" : "Email"}.`,
            timer: 1500,
            showConfirmButton: false,
          });

          // Redirect to the respective MFA setup page (QR Code or Email)
          if (mfaMethod === "email") {
            navigate('/mfa-setup-authy'); // Redirect to the Authy QR setup page
          } else {
            navigate('/mfa-setup-email'); // Redirect to the Email MFA setup page
          }

        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to switch MFA method. Please try again.',
          });
        }
      }
    });
  };

  // Function to handle Two Factor Auth toggle
  const handleTwoFactorToggle = async () => {
    const newStatus = !twoFactorAuth;
    setTwoFactorAuth(newStatus);
    localStorage.setItem("twoFactorAuth", JSON.stringify(newStatus));

    if (userData && userData.loggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Action Required',
        text: 'Log out first to enable two-factor authentication.',
        showConfirmButton: true,
      });
      return;
    }
  
    const action = twoFactorAuth ? "disable" : "enable";
    try {
      const response = await axios.post('http://localhost:5000/api/toggle-mfa', {
        email: userData.email,
        action: action
      });
  
      setTwoFactorAuth(!twoFactorAuth);
  
      Swal.fire({
        icon: 'success',
        title: response.data.message,
        text: `Two-factor authentication has been ${action === "enable" ? "enabled" : "disabled"}.`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to toggle two-factor authentication. Please try again.',
      });
    }
  };

  // Function to handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format. Please enter a valid email.");
      return;
    }

    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: `We will send a password reset link to ${email}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, send it!',
      cancelButtonText: 'Cancel',
    });

    if (!confirmResult.isConfirmed) {
      return; // Cancel if the user clicks "Cancel"
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/password-reset', { email });

      Swal.fire({
        icon: 'success',
        title: 'Password Reset Email Sent',
        text: 'Check your email for further instructions.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      const errorMsg = error.response?.status === 404 
        ? 'Email not registered.' 
        : 'An error occurred. Please try again.';

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-box">
        <h1>Settings</h1>
        <p>Customize your experience and preferences</p>
      </div>

      {/* Notification Setting */}
      {/* <div className="settings-box">
        <h2>Notifications</h2>
        <div className="setting-item">
          <label>Enable Notifications:</label>
          <div className="toggle-switch">
            <button
              className={`toggle-btn ${notifications ? "on" : "off"}`}
              onClick={handleNotificationToggle}
            >
              {notifications ? "On" : "Off"}
            </button>
          </div>
        </div>
      </div> */}

      {/* Language Settings */}
      {/* <div className="settings-box">
        <h2>Languages</h2>
        <div className="setting-item">
          <label htmlFor="language">Preferred Language:</label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="form-control"
          >
            <option value="English">English</option>
            <option value="Dutch">Dutch</option>
          </select>
        </div>
      </div> */}

      {/* Privacy Settings */}
      <div className="settings-box">
        <h2>Privacy</h2>
        <div className="setting-item">
          <label>Two-Factor Authentication:</label>
          <button
            className={`toggle-btn ${twoFactorAuth ? "on" : "off"}`}
            onClick={handleTwoFactorToggle}
          >
            {twoFactorAuth ? "Enabled" : "Disabled"}
          </button>
        </div>
        {twoFactorAuth && (
          <div className="setting-item">
            <label>MFA Method: {userData?.mfa_method || "Not Set"}</label>
          </div>
        )}

        {twoFactorAuth && (
          <div className="setting-item">
            <button onClick={handleMfaSwitch} className="btn-save">
              Switch MFA Method
            </button>
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div className="settings-box">
        <h2>Change Password</h2>
        <p>If you want to change your password, enter your email and request a password reset.</p>
        <div className="setting-item">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter your email"
          />
        </div>
        {message && (
          <p className={message.includes("successfully") ? "success-message" : "error-message"}>{message}</p>
        )}
        <button onClick={handlePasswordReset} className="btn-save" disabled={loading}>
          {loading ? "Sending..." : "Send Password Reset Link"}
        </button>
      </div>

      <div className="settings-box">
        <h2>Sharing and Access</h2>
        <p>Manage access to your profile and shared content.</p>
        <Link to="/user-account/data-sharing" className="btn-save">Manage Sharing Settings</Link>
      </div>
    </div>
  );
};

export default SettingsPage;
