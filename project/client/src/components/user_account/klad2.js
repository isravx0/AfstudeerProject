// import React, { useState, useEffect } from "react";
// import "./style/SettingsPage.css";
// import { useAuth } from "../AuthContext"; // Context for user data and authentication token
// import Swal from "sweetalert2";
// import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
// import axios from 'axios';
// import MFASettings from "./MFASettings";  // Import for MFA settings page
// import MFAEmail from "../login/MFAEmail";  // Import for Email MFA
// import MfaVerificationPage from "../login/MfaVerificationPage"; // Import for MFA Verification

// const SettingsPage = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [notifications, setNotifications] = useState(true);
//   const [language, setLanguage] = useState("English");
//   const [mfaEnabled, setMfaEnabled] = useState(false);
//   const [mfaMethod, setMfaMethod] = useState("");
//   const [showMFASettings, setShowMFASettings] = useState(false);
//   const [showMFAVerificationPage, setShowMFAVerificationPage] = useState(false);
//   const [showMFAEmail, setShowMFAEmail] = useState(false);
//   const { userData, setUserData, token } = useAuth();
//   const navigate = useNavigate();

//   // Use effect to get user settings from API or localStorage
//   useEffect(() => {
//     if (token) {
//       const authToken = localStorage.getItem("authToken");
//       axios
//         .get("/api/user-info", {
//           headers: { Authorization: `Bearer ${authToken}` },
//         })
//         .then((response) => {
//           setUserData(response.data.user);
//         })
//         .catch((err) => {
//           console.error("Failed to load user data:", err);
//           Swal.fire({
//             icon: "error",
//             title: "Error",
//             text: "Failed to load user data. Please try again later.",
//           });
//         });
//     }

//     const savedNotifications = localStorage.getItem("notifications");
//     if (savedNotifications !== null) {
//       setNotifications(JSON.parse(savedNotifications));
//     }

//     const saveMFA = localStorage.getItem("mfaEnabled");
//     if (saveMFA !== null) {
//       setNotifications(JSON.parse(saveMFA));
//     }

//   }, [token, setUserData]);

//   // Fetch MFA status from backend
//   const fetchMFAStatus = () => {
//     if (token && userData?.email) {
//       axios
//         .get("http://localhost:5000/api/check-mfa-enabled", {
//           params: { email: userData.email },
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           console.log('MFA Status Response:', response.data); // Debugging

//           setMfaEnabled(userData.mfa_enabled);
//           setMfaMethod(userData.mfa_method);
//         })
//         .catch(() =>
//           Swal.fire("Error", "Failed to retrieve MFA status.", "error")
//         );
//     }
//   };

//   // Handle MFA method selection
//   const handleSelectMfaMethod = () => {
//     Swal.fire({
//       title: "Enable MFA",
//       text: "Choose an MFA method:",
//       icon: "info",
//       showDenyButton: true,
//       showCancelButton: true,
//       confirmButtonText: "Authy (QR Code)",
//       denyButtonText: "Email",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setShowMFASettings(true);  // Show QR Code method (Authy)
//       } else if (result.isDenied) {
//         setShowMFAEmail(true);  // Show Email method
//       }
//     });
//   };

//   // Handle Notification Toggle
//   const handleNotificationToggle = async () => {
//     try {
//       const newStatus = !notifications;
//       setNotifications(newStatus);
//       localStorage.setItem("notifications", JSON.stringify(newStatus));

//       const response = await axios.put('http://localhost:5000/update-notifications', {
//         notifications: newStatus
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.status === 200) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Notifications Updated',
//           text: `Notifications have been turned ${newStatus ? "on" : "off"}.`,
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to update notification settings. Please try again.',
//       });
//     }
//   };

//   // Handle Language Change
//   const handleLanguageChange = (e) => {
//     const selectedLanguage = e.target.value;
//     setLanguage(selectedLanguage);

//     Swal.fire({
//       icon: 'success',
//       title: 'Language Changed',
//       text: `Your preferred language has been changed to ${selectedLanguage}.`,
//       timer: 1500,
//       showConfirmButton: false
//     });
//   };

//   // Handle Password Reset
//   const handlePasswordReset = async (e) => {
//     e.preventDefault();

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setMessage("Invalid email format. Please enter a valid email.");
//       document.getElementById("email").style.borderColor = "red";
//       return;
//     } else {
//       document.getElementById("email").style.borderColor = "initial";
//     }

//     const confirmResult = await Swal.fire({
//       title: 'Are you sure?',
//       text: `We will send a password reset link to ${email}.`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, send it!',
//       cancelButtonText: 'Cancel',
//     });

//     if (!confirmResult.isConfirmed) {
//       return;
//     }

//     setLoading(true);

//     try {
//       await axios.post('http://localhost:5000/api/password-reset', { email });

//       Swal.fire({
//         icon: 'success',
//         title: 'Password Reset Email Sent',
//         text: 'Check your email for further instructions.',
//         timer: 1500,
//         showConfirmButton: false,
//       });
//     } catch (error) {
//       const errorMsg = error.response?.status === 404
//         ? 'Email not registered.'
//         : 'An error occurred. Please try again.';

//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: errorMsg,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleMFA = () => {
//     if (mfaEnabled) {
//       setShowMFAVerificationPage(true);
//     } else {
//       handleSelectMfaMethod();
//     }
//   };

//   const handleMFAConfirmed = () => {
//     if (mfaEnabled) {
//       axios
//         .post(
//           "http://localhost:5000/api/disable-mfa",
//           { email: userData.email },
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         .then(() => {
//           setMfaEnabled(false);
//           setMfaMethod("");
//           Swal.fire("Disabled", "MFA has been disabled.", "success");
//         })
//         .catch(() =>
//           Swal.fire("Error", "Failed to disable MFA.", "error")
//         );
//     }
//   };

//   useEffect(() => {
//     fetchMFAStatus();
//   }, [token, userData?.email]);

//   return (
//     <div className="settings-page">
//       <div className="settings-box">
//         <h1>Settings</h1>
//         <p>Customize your experience and preferences</p>
//       </div>

//       {/* Notification Setting */}
//       <div className="settings-box">
//         <h2>Notifications</h2>
//         <div className="setting-item">
//           <label>Enable Notifications:</label>
//           <div className="toggle-switch">
//             <button
//               className={`toggle-btn ${notifications ? "on" : "off"}`}
//               onClick={handleNotificationToggle}
//             >
//               {notifications ? "On" : "Off"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Language Settings */}
//       <div className="settings-box">
//         <h2>Languages</h2>
//         <div className="setting-item">
//           <label htmlFor="language">Preferred Language:</label>
//           <select
//             id="language"
//             value={language}
//             onChange={handleLanguageChange}
//             className="form-control"
//           >
//             <option value="English">English</option>
//             <option value="Dutch">Dutch</option>
//           </select>
//         </div>
//       </div>

//       {/* MFA Settings */}
//       <div className="settings-box">
//         <h2>Two-Factor Authentication</h2>
//         <button onClick={handleToggleMFA} className="btn-save">
//           {userData?.mfa_enabled ? "Disable MFA" : "Enable MFA"}
//         </button>
//         {/* Conditional rendering for MFA settings */}
//         {showMFASettings && <MFASettings email={userData.email} />}
//         {showMFAEmail && <MFAEmail email={userData.email} />}
//         {showMFAVerificationPage && <MfaVerificationPage email={userData.email} onMFAConfirmed={handleMFAConfirmed} />}
//       </div>

//       {/* Change Password Section */}
//       <div className="settings-box">
//         <h2>Change Password</h2>
//         <p>If you want to change your password, enter your email and request a password reset.</p>
//         <div className="setting-item">
//           <label htmlFor="email">Email Address:</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="form-control"
//             placeholder="Enter your email"
//           />
//         </div>
//         {message && (
//           <p className={message.includes("successfully") ? "success-message" : "error-message"}>{message}</p>
//         )}
//         <button onClick={handlePasswordReset} className="btn-save" disabled={loading}>
//           {loading ? "Sending..." : "Send Password Reset Link"}
//         </button>
//       </div>

//       {/* Sharing and Access */}
//       <div className="settings-box">
//         <h2>Sharing and Access</h2>
//         <p>Manage access to your profile and shared content.</p>
//         <Link to="/user-account/data-sharing" className="btn-save">Manage Sharing Settings</Link>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;