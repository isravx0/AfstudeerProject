import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext"; // Context for user data and authentication token
import axios from "axios";
import "./style/PersonalInfoPage.css";

const PersonalInfoPage = () => {
  const { userData, setUserData, token } = useAuth();
  const locations = [
    "Amsterdam",
    "Rotterdam",
    "Den Haag",
    "Utrecht",
    "Eindhoven",
    "Groningen",
    "Maastricht",
    "Tilburg",
    "Leiden",
    "Delft",
  ];

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user profile data when the component mounts if the token is available
    if (token) {
      const authToken = localStorage.getItem("authToken");

      axios
        .get("/api/user-info", {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          setUserData(response.data.user); // Set the fetched data in context
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
  }, [token, setUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        if (file.size <= 5 * 1024 * 1024) {
          const formData = new FormData();
          formData.append("profilePicture", file); // Append the file to the form data
    
          setLoading(true);
    
          axios
            .put("http://localhost:3000/upload-profile-picture", formData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                "Content-Type": "multipart/form-data", // Ensure that the Content-Type is set correctly
              },
            })
            .then((response) => {
              console.log("File uploaded:", response.data);
              // Update the user profile with the new picture URL (file path)
              setUserData((prevData) => ({
                ...prevData,
                profilePicture: response.data.filePath, // Update the profile picture path in the state
              }));
              Swal.fire({
                icon: "success",
                title: "Profile picture updated!",
                text: "Your new profile picture has been saved.",
                timer: 1500,
                showConfirmButton: false,
              });
            })
            .catch((error) => {
              console.error("Upload error:", error);
              Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "There was an error uploading your profile picture. Please try again.",
              });
            })
            .finally(() => setLoading(false));
        } else {
          Swal.fire({
            icon: "error",
            title: "File Size Too Large",
            text: "Please upload an image smaller than 5MB.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Please upload a valid image file.",
        });
      }
    };
    

  const validateForm = () => {
    const { name, email, phoneNumber, location } = userData;
    const newErrors = {};
    let isValid = true;

    if (!name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
      isValid = false;
    } else if (!/^\d{10,}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number (at least 10 digits).";
      isValid = false;
    }
    if (!location) {
      newErrors.location = "Location is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    setLoading(true);

    try {
      const authToken = localStorage.getItem("authToken");

      const response = await axios.put(
        "http://localhost:3000/update-profile", // Ensure this matches your backend URL
        userData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Show success message after profile update
      Swal.fire({
        icon: "success",
        title: "Profile updated successfully!",
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error during update:", error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
          confirmButtonText: "Log In",
        }).then(() => {
          localStorage.removeItem("authToken"); // Clear token
          window.location.href = "/login"; // Redirect to login page
        });
      } else {
        const status = error.response?.status || "Unknown";
        const message = error.response?.data?.message || "An unexpected error occurred.";
        const details = error.response?.data || {};

        console.error("Error status:", status);
        console.error("Error message:", message);
        console.error("Error details:", details);

        Swal.fire({
          icon: "error",
          title: `Error ${status}`,
          text: message,
        });
      }
    } finally {
      setLoading(false);
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
                value={userData?.name || ""}
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
                value={userData?.email || ""}
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
                value={userData?.phoneNumber || ""}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && (
                <div className="error-message">{errors.phoneNumber}</div>
              )}
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={userData?.dob || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={userData?.gender || ""}
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
                value={userData?.location || ""}
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
              {errors.location && (
                <div className="error-message">{errors.location}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={userData?.bio || ""}
              onChange={handleInputChange}
              placeholder="Tell us a bit about yourself"
            />
          </div>

          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
