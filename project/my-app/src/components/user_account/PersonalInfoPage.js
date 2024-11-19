import React, { useState } from "react";
import "./style/PersonalInfoPage.css";

const PersonalInfoPage = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    location: "New York, USA",
    gender: "",
    dob: "",
    profilePicture: null,
    bio: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, profilePicture: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Changes saved successfully!");
    console.log("User Data Submitted:", userData);
  };

  return (
    <div className="personal-info-page">
        <div className="personal-info-container">
            <h1>Personal Information</h1>
            <p>Update your personal details and profile preferences</p>
        </div>

      <div className="personal-info-container">
        {/* Profile Picture */}
        <div className="profile-picture-container">
          {userData.profilePicture ? (
            <img src={userData.profilePicture} alt="Profile" />
          ) : (
            <div className="placeholder">No profile picture uploaded</div>
          )}
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
            id="profile-picture-upload"
          />
          <label className="upload-btn" htmlFor="profile-picture-upload">
            Upload Profile Picture
          </label>
        </div>

        {/* Form */}
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={userData.dob}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <select
                name="location"
                value={userData.location}
                onChange={handleInputChange}
              >
                <option value="New York, USA">New York, USA</option>
                <option value="London, UK">London, UK</option>
                <option value="Sydney, Australia">Sydney, Australia</option>
                <option value="Tokyo, Japan">Tokyo, Japan</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={userData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
            ></textarea>
          </div>

          <button type="submit" className="btn-save">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
