import React, { useState } from "react";
import "./Style/RegisterForm.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted: ", formData);
  };

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
          <button type="submit" className="register-submit-button">
            Sign up
          </button>
        </form>
        <p className="register-login-prompt">
          Have an account? <a href="/login">Log in here!</a>
        </p>

        <div className="register-or-divider">
          <span>OR</span>
        </div>

        <div className="register-social-login">
          <button className="register-social-button facebook">f</button>
          <button className="register-social-button google">G</button>
          <button className="register-social-button apple"></button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
