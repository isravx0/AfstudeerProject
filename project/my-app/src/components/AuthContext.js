import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // Function to check if the user is logged in
  const isLoggedIn = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') ? true : false;
  };

  // Function to fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:3000/api/user-info', {
        headers: { Authorization: token },
      });
      setUserData(response.data.user);
    } catch (error) {
      setError('Error fetching user data.');
      console.error('Error fetching user data:', error);
    }
  };

  // Function to handle login
  const login = async (token) => {
    localStorage.setItem('authToken', token);
    setLoggedIn(true); // Set loggedIn to true after login
    await fetchUserData(); // Fetch user data after login
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setLoggedIn(false); // Update loggedIn to false after logout
    setUserData(null); // Reset user data
  };

  // Function to update user profile
  const updateProfile = async (updatedData) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    try {
      const response = await axios.put(
        'http://localhost:3001/api/update-profile',
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Profile updated:", response.data); // Log response data to check if it's updated
      setUserData(response.data.user); // Update user data after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile.');
    }
  };


  useEffect(() => {
    const checkLoginStatus = isLoggedIn();
    setLoggedIn(checkLoginStatus);
    if (checkLoginStatus) {
      fetchUserData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, userData, error, setUserData, login, logout, updateProfile}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
