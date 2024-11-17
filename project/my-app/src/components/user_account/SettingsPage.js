import React, { useState } from "react";
import "./style/SettingsPage.css";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [fontSize, setFontSize] = useState("Medium");
  const [timezone, setTimezone] = useState("UTC");
  const [privacy, setPrivacy] = useState("Public");

  const handleSaveChanges = () => {
    alert("Settings saved successfully!");
    // You can extend this functionality to persist the settings (e.g., via localStorage or a backend API)
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
    // Add actual logout logic here
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
            <option value="Spanish">Spanish</option>
            <option value="German">German</option>
            <option value="French">French</option>
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

      {/* Timezone Settings */}
      <div className="settings-box">
        <h2>Timezone and Date</h2>
        <div className="setting-item">
          <label htmlFor="timezone">Timezone:</label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="form-control"
          >
            <option value="UTC">UTC</option>
            <option value="GMT">GMT</option>
            <option value="EST">EST</option>
            <option value="PST">PST</option>
          </select>
        </div>
      </div>

      {/* Sharing and Access */}
      <div className="settings-box">
        <h2>Sharing and Access</h2>
        <p>Manage access to your profile and shared content.</p>
        <button className="btn-save">Manage Sharing Settings</button>
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
