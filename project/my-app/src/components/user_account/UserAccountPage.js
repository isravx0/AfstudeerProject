import React, { useState } from 'react';
import './style/UserAccountPage.css';

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
      <div className="section user_profile-section">
        <div className="section-header user_section-header">Profile Picture</div>
        <div className="profile-img-container user_profile-img-container">
          <div className="profile-text user_profile-text">
            <h2 className="user_h2">Upload Your Photo</h2>
            <p className="user_p">Your photo must be in PNG or JPG format.</p>
          </div>
          <div className="profile-img-area user_profile-img-area">
            {image ? (
              <img src={image} alt="User" className="profile-img user_profile-img" />
            ) : (
              <div className="placeholder-img user_placeholder-img">No Image</div>
            )}
            <label htmlFor="image-upload" className="upload-label user_upload-label">Upload</label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="upload-input user_upload-input"
            />
          </div>
        </div>
      </div>

      {/* User Information Section */}
      <div className="section user_info-section">
        <div className="section-header user_section-header">Personal Information</div>
        <div className="form-group user_form-group">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={userInfo.firstName}
            onChange={handleInputChange}
            className="user_input"
          />
        </div>
        <div className="form-group user_form-group">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={userInfo.lastName}
            onChange={handleInputChange}
            className="user_input"
          />
        </div>
        <div className="form-group user_form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={userInfo.email}
            onChange={handleInputChange}
            className="user_input"
          />
        </div>
        <div className="form-group user_form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userInfo.password}
            onChange={handleInputChange}
            className="user_input"
          />
        </div>
        <div className="form-group user_form-group">
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={userInfo.mobileNumber}
            onChange={handleInputChange}
            className="user_input"
          />
        </div>

        <div className="form-actions user_form-actions">
          <button className="save-btn user_save-btn" onClick={handleSave}>Save</button>
          <button className="cancel-btn user_cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </div>

      {/* Two Factor Authentication Section */}
      <div className="section user_2fa-section">
        <div className="section-header user_section-header">Two Factor Authentication</div>
        <p className="user_p">Two-factor authentication (2FA) adds an extra layer of security to your account. Enabling this will require you to provide a second form of verification in addition to your password when logging in.</p>
        <label className="switch user_switch">
          <input type="checkbox" />
          <span className="slider round user_slider"></span>
        </label>
      </div>

      {/* Notification Settings Section */}
      <div className="section user_notification-section">
        <div className="section-header user_section-header">Notification Settings</div>
        <div className="form-group user_form-group">
          <label className="user_label">
            <input type="checkbox" /> Enable Email Notifications
          </label>
        </div>
        <div className="form-group user_form-group">
          <label className="user_label">
            <input type="checkbox" /> Enable SMS Notifications
          </label>
        </div>
      </div>

      {/* Privacy & Security Settings Section */}
      <div className="section user_privacy-section">
        <div className="section-header user_section-header">Privacy & Security Settings</div>
        <div className="form-group user_form-group">
          <label className="user_label">
            <input type="checkbox" /> Share Data with Partners
          </label>
        </div>
        <div className="form-group user_form-group">
          <label className="user_label">
            <input type="checkbox" /> Enable Targeted Ads
          </label>
        </div>
      </div>
    </div>
  );
};

export default UserAccountPage;
