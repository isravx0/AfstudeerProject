import React, { useState } from 'react';
import './UserAccountPage.css';

const UserAccountPage = () => {
  const [image, setImage] = useState(null);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNumber: '',
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Save changes", userInfo);
  };

  const handleCancel = () => {
    console.log("Cancel changes");
  };

  return (
    <div className="user-account-container">
      {/* Profile Picture Section */}
      <div className="section profile-section">
        <div className="section-header">Profile Picture</div>
        <div className="profile-img-container">
          <div className="profile-text">
            <h2>Upload Your Photo</h2>
            <p>Your photo must be in PNG or JPG format.</p>
          </div>
          <div className="profile-img-area">
            {image ? (
              <img src={image} alt="User" className="profile-img" />
            ) : (
              <div className="placeholder-img">No Image</div>
            )}
            <label htmlFor="image-upload" className="upload-label">Upload</label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="upload-input"
            />
          </div>
        </div>
      </div>

      {/* User Information Section */}
      <div className="section info-section">
        <div className="section-header">Personal Information</div>
        <div className="form-group">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={userInfo.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={userInfo.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={userInfo.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userInfo.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={userInfo.mobileNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-actions">
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </div>

      {/* Two Factor Authentication Section */}
      <div className="section">
        <div className="section-header">Two Factor Authentication</div>
        <p>Two-factor authentication (2FA) adds an extra layer of security to your account. Enabling this will require you to provide a second form of verification in addition to your password when logging in.</p>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Notification Settings Section */}
      <div className="section">
        <div className="section-header">Notification Settings</div>
        <div className="form-group">
          <label>
            <input type="checkbox" /> Enable Email Notifications
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" /> Enable SMS Notifications
          </label>
        </div>
      </div>

      {/* Privacy & Security Settings Section */}
      <div className="section">
        <div className="section-header">Privacy & Security Settings</div>
        <div className="form-group">
          <label>
            <input type="checkbox" /> Share Data with Partners
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" /> Enable Targeted Ads
          </label>
        </div>
      </div>
    </div>
  );
};

export default UserAccountPage;
