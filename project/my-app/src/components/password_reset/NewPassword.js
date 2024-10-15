import React, { useState } from "react";
import { useParams } from 'react-router-dom'; // Voor het ophalen van de token uit de URL
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams(); // Haal de token uit de URL
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/reset-password/${token}`, { newPassword });
      setMessage("Your password has been reset successfully!");
    } catch (error) {
      setMessage("There was an error resetting your password. The link may have expired.");
    }
  };

  return (
    <div className="reset-password-container">
      <h1>Reset your password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
