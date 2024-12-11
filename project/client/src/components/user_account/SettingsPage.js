import React, { useState, useEffect } from "react";
import "./style/SettingsPage.css";
import { useAuth } from "../AuthContext"; // Context for user data and authentication token
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
import axios from 'axios';

const SettingsPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const { userData, setUserData, token } = useAuth();

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

    // Set the initial state based on localStorage
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications !== null) {
      setNotifications(JSON.parse(savedNotifications));
    }

    const savedTwoFactor = localStorage.getItem("twoFactorAuth");
    if (savedTwoFactor !== null) {
      setTwoFactorAuth(JSON.parse(savedTwoFactor));
    }
  }, [token, setUserData]);

  // Function to handle saving settings
  const handleSaveChanges = () => {
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Your changes have been successfully saved!',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Function to handle Two Factor Auth
  const handleTwoFactorToggle = async () => {
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
  


  // Function to handle notifications toggle
  const handleNotificationToggle = async () => {
    try {
      const newStatus = !notifications;
      setNotifications(newStatus);
      localStorage.setItem("notifications", JSON.stringify(newStatus));
  
      await axios.put('http://localhost:5000/update-notifications', {
        notifications: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Notifications Updated',
        text: `Notifications have been turned ${newStatus ? "on" : "off"}.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update notification settings. Please try again.',
      });
    }
  };
  
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
  
    Swal.fire({
      icon: 'success',
      title: 'Language Changed',
      text: `Your preferred language has been changed to ${selectedLanguage}.`,
      timer: 1500,
      showConfirmButton: false
    });
  };
  

  // Function to handle password reset
  // Functie voor wachtwoord reset met bevestiging
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
    return; // Annuleer als de gebruiker klikt op "Cancel"
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
      <div className="settings-box">
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
      </div>

      {/* Language Settings */}
      <div className="settings-box">
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
      </div>

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
      </div>

      {/* Change Password Section */}
      <div className="settings-box">
        <h2>Change Password</h2>
        <p>If you want to change your password, enter your email and request a password reset.</p>

        {/* Email Input for Password Reset */}
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

        {/* Message Display */}
        {message && (
          <p className={message.includes("successfully") ? "success-message" : "error-message"}>{message}</p>
        )}

        <button onClick={handlePasswordReset} className="btn-save" disabled={loading}>
          {loading ? "Sending..." : "Send Password Reset Link"}
        </button>
      </div>

      {/* Sharing and Access */}
      <div className="settings-box">
        <h2>Sharing and Access</h2>
        <p>Manage access to your profile and shared content.</p>
        <Link to="/user-account/data-sharing" className="btn-save">Manage Sharing Settings</Link>
      </div>
      
    </div>
  );
};

export default SettingsPage;
