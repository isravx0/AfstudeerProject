import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Style/password_reset.css';

function ResetPassword() {
  const { token } = useParams(); // Get the token from the URL parameters
  const navigate = useNavigate(); // Hook to navigate to another page
  const [newPassword, setNewPassword] = useState(''); // State for the new password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirming the new password
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [successMessage, setSuccessMessage] = useState(''); // State for success messages

  const handleResetPassword = async (e) => {
      e.preventDefault(); // Prevent the default form submission
      
      // Check if the passwords match
      if (newPassword !== confirmPassword) {
          setErrorMessage('Passwords do not match.'); // Set error message if they don't match
          return;
      }

      // Make the API call to reset the password
      try {
          const response = await fetch('http://localhost:5000/api/reset-password', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token, newPassword }), // Send the token and new password
          });

          const data = await response.json(); // Parse the JSON response
          if (response.ok) {
              setSuccessMessage('Password successfully changed! You will be redirected to the login page.');
              setTimeout(() => {
                  navigate('/login'); // Navigate to the login page after 2 seconds
              }, 2000);
          } else {
              setErrorMessage(data); // Show error message
          }
      } catch (error) {
          setErrorMessage('An error occurred, please try again.'); // General error message
      }
  };

  return (
    <div className="new-password-container">
      <div className="new-password-panel">
        <h1>Solar Panel Simulation</h1>
        <p>Reset your password to regain access to your account.</p>
        
        <form className="password-reset-form" onSubmit={handleResetPassword}>
          <h2>Reset Password</h2>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          <input 
            type="password" 
            className="password-reset-input"
            placeholder="New Password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            className="password-reset-input"
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="password-reset-button">Reset Password</button>

        </form>

      </div>

  </div>
  );
}

export default ResetPassword;
