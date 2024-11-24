import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext'; // Context for user data and authentication token
import axios from 'axios';
import "./style/PersonalInfoPage.css";

const PersonalInfoPage = () => {
  const { userData, setUserData, token } = useAuth();
  const locations = ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven", "Groningen", "Maastricht", "Tilburg", "Leiden", "Delft"];

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
  });

  useEffect(() => {
    // Fetch user profile data when the component mounts if token is available
    if (token) {
      axios.get('/api/user-profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUserData(response.data); // Set the fetched data in context
      })
      .catch(err => {
        console.error('Failed to load user data:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load user data. Please try again later.',
        });
      });
    }
  }, [token, setUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) { // Check if the file is an image
      if (file.size <= 5 * 1024 * 1024) { // Check if the file size is under 5MB
        setUserData(prevData => ({ ...prevData, profilePicture: URL.createObjectURL(file) }));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'File Size Too Large',
          text: 'Please upload an image smaller than 5MB.',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload a valid image file.',
      });
    }
  };

  const validateForm = () => {
    const { name, email, phoneNumber, location} = userData;
    let newErrors = {};
    let isValid = true;

    if (!name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
      }
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
      isValid = false;
    } else {
      const phoneRegex = /^\d{10,}$/;
      if (!phoneRegex.test(phoneNumber)) {
        newErrors.phoneNumber = "Please enter a valid phone number (at least 10 digits).";
        isValid = false;
      }
    }
    if (!location) {
      newErrors.location = "Location is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Data being sent to backend:', userData);

    if (validateForm()) {

      // Log the data to the console
      console.log('Data being sent to the API:', userData);
      console.log('Authorization Token:', token);

      // Send data to the API using the token

      axios.put('http://localhost:3001/update-profile', userData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            }
        })
        .then(response => {

            console.log('Update response:', response.data); // Log response from backend
            Swal.fire({
                icon: 'success',
                title: 'Profile updated successfully!',
                text: 'Your personal information has been updated.',
                timer: 1500,
                showConfirmButton: false,
            });
        })
        .catch(error => {
            console.error('Error during update:', error.response || error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'There was an error updating your profile. Please try again.',
            });
        });
    }
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
          {userData?.profilePicture ? (
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
                value={userData?.name || ''}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData?.email || ''}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phoneNumber"
                value={userData?.phoneNumber || ''}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={userData?.dob || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={userData?.gender || ''}
                onChange={handleInputChange}
              >
                <option value="">Select Gender (Optional)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <select
                name="location"
                value={userData?.location || ''}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Choose a location
                </option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.location && <div className="error-message">{errors.location}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={userData?.bio || ''}
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
