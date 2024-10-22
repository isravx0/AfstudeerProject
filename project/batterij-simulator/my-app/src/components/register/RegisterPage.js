import React, { useState } from "react";
import axios from "axios"; // Ensure axios is imported
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./style/RegisterForm.css"; // Import your styles

const RegisterForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const initialFormData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    location: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const [isSubmitted, setIsSubmitted] = useState(false); // State to track successful registration
  const [loading, setLoading] = useState(false); // For showing a loading indicator
  const [error, setError] = useState(null); // State for error messages

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    setError(null); // Reset error message

    // Validate that the passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false); // Stop loading
      return; // Exit the function
    }

    // Validate that the password is at least 8 characters long
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false); // Stop loading
      return; // Exit the function
    }

    // Validate that phoneNumber contains only numbers
    const phoneNumberPattern = /^\d+$/;
    if (!phoneNumberPattern.test(formData.phoneNumber)) {
      setError("Phone number must contain only numbers");
      setLoading(false); // Stop loading
      return; // Exit the function
    }

    // Validate that the password is at least 8 characters long
    if (formData.phoneNumber.length < 5) {
      setError("Phone number must be at least 5 numbers long");
      setLoading(false); // Stop loading
      return; // Exit the function
    }
    try {
      // Send the actual form data to the API
      await axios.post('http://localhost:5000/api/register', {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
      });

      alert('User registered successfully');
      setIsSubmitted(true); // Mark form as successfully submitted
    } catch (error) {
      console.log("Error registering:", error);
      setError("Error registering user. Please try again."); // Set error message for user feedback
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle cancel button click (navigates back to welcome page)
  const handleCancel = () => {
    navigate('/');
  };

  // If form is submitted successfully, show confirmation message
  if (isSubmitted) {
    return (
      <div className="confirmation-container">
        <h1>Registration Successful!</h1>
        <p>Welcome, {formData.name}! Your account has been successfully created.</p>
        <p>You can now <strong> <a href="/login">log in</a> </strong> to access your dashboard and start managing your energy consumption.</p>
        <p>Thank you for joining us!</p>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-left-panel">
        <h1>Create your account!</h1>
        <p>
          Register to access your personal dashboard and real-time monitoring of
          your solar yield and battery status.
        </p>
        <p>Fill in the details to start optimizing your energy management.</p>
      </div>
      <div className="register-right-panel">
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="First and last name *"
            value={formData.name}
            onChange={handleChange}
            className="register-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            className="register-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleChange}
            className="register-input"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password *"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="register-input"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone number *"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="register-input"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location *"
            value={formData.location}
            onChange={handleChange}
            className="register-input"
            required
          />
          <div className="register-checkbox-container">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              By signing up, I agree with the <a href="/">Terms of Use</a> &amp;
              <a href="/">Privacy Policy</a>.
            </label>
          </div>

          <div className="register-button-container">
            <button type="submit" className="register-submit-button" disabled={loading}>
              {loading ? "Registering..." : "Sign up"}
            </button>
            <button type="button" className="register-cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
          {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
        </form>
        <p className="register-login-prompt">
          Have an account? <a href="/login">Log in here!</a>
        </p>

      </div>
    </div>
  );
};

export default RegisterForm;