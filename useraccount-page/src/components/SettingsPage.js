import React, { useState } from "react";
import "./style/SettingsPage.css";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [fontSize, setFontSize] = useState("Medium");

  const handleSaveChanges = () => {
    alert("Settings saved successfully!");
    // You can extend this functionality to persist the settings (e.g., via localStorage or a backend API)
  };

  return (
    <div className="settings-page">
      <div className="settings-box">
        <h1>Settings</h1>
        <p>Customize your experience and preferences</p>
        </div>

        {/* Style Settings */}
        <div className="settings-box">
            {/* Language Selection */}
            <div className="settings-box">
                <div className="setting-item">
                <label htmlFor="language">Language:</label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="form-control"
                >
                    <option value="English">English</option>
                    <option value="Spanish">Dutch</option>
                    <option value="German">German</option>
                </select>
            </div>

            {/* Font Size Selection */}
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

            {/*Dark Mode Selections*/}
            <div className="setting-item">
                <label htmlFor="darkMode">Dark Mode:</label>
                <select
                id="darkMode"
                value={darkMode}
                onChange={(e) => setDarkMode(e.target.value)}
                className="form-control"
                >
                    <option value="Light">Light</option>
                    <option value="Dark">Dark</option>
                </select>
            </div>
        </div>
        
        {/* Notification Setting */}
        <div className="settings-box">
            <div className="setting-item">
                <label htmlFor="notification">Notification:</label>
                <select
                id="notification"
                value={notifications}
                onChange={(e) => setNotifications(e.target.value)}
                className="form-control"
                >
                    <option value="On">On</option>
                    <option value="Off">Off</option>
                </select>
            </div>
        </div>

        {/* Save Changes Button */}
        <div className="setting-item">
          <button onClick={handleSaveChanges} className="btn-save">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
