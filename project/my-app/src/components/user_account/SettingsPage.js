import React, { useState } from "react";
import "./style/SettingsPage.css";
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
import axios from 'axios';

const SettingsPage = () => {
  const [email, setEmail] = useState(""); // Email state for password reset
  const [message, setMessage] = useState(""); // Message to show feedback
  const [loading, setLoading] = useState(false); // Loading state for feedback
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [fontSize, setFontSize] = useState("Medium");
  const [privacy, setPrivacy] = useState("Public");

  const handleSaveChanges = () => {
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Your settings have been successfully saved!',
      timer: 1500,
      showConfirmButton: false
    });
  };
  

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format. Please enter a valid email.");
      setLoading(false); // Stop loading
      return;
    }
  
    try {
      // API request to send reset link
      const response = await axios.post('http://localhost:3000/api/password-reset', { email });
      Swal.fire({
        icon: 'success',
        title: 'Password Reset Instructions Sent',
        text: 'Check your email for the password reset instructions.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'Email Not Registered',
            text: 'This email is not registered.',
          });
        } else if (error.response.status === 429) {
          Swal.fire({
            icon: 'error',
            title: 'Too Many Requests',
            text: 'You have reached the maximum number of password reset requests. Please try again later.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error Processing Request',
            text: 'There was an error processing your request. Please try again.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Please check your connection and try again.',
        });
      }
    } finally {
      setLoading(false); // Stop loading
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
              onClick={() => setNotifications(!notifications)}
            >
              {notifications ? "On" : "Off"}
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="settings-box">
        <h2>Appearance</h2>
        <div className="setting-item">
          <label htmlFor="darkMode">Theme:</label>
          <select
            id="darkMode"
            value={darkMode ? "Dark" : "Light"}
            onChange={(e) => setDarkMode(e.target.value === "Dark")}
            className="form-control"
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </select>
        </div>

        <div className="setting-item">
          <label htmlFor="fontSize">Font Size:</label>
          <select
            id="fontSize"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="form-control"
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
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
            onChange={(e) => setLanguage(e.target.value)}
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
          <label htmlFor="privacy">Profile Visibility:</label>
          <select
            id="privacy"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="form-control"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Friends Only">Friends Only</option>
          </select>
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

      {/* Save Changes */}
      <div className="settings-box">
        <button onClick={handleSaveChanges} className="btn-save">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
