// import React, { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import axios from "axios";
// import { useAuth } from "../AuthContext";
// import MFASettings from "./MFASettings";  // Updated import here
// import MFAEmail from "../login/MFAEmail";
// import MfaVerificationPage from "../login/MfaVerificationPage";

// const SettingsPage = () => {
//   const { userData, token } = useAuth();
//   const [mfaEnabled, setMfaEnabled] = useState(false);
//   const [mfaMethod, setMfaMethod] = useState("");
//   const [showMFASettings, setShowMFASettings] = useState(false);  // Renamed state
//   const [showMFAVerificationPage, setShowMFAVerificationPage] = useState(false);
//   const [showMFAEmail, setShowMFAEmail] = useState(false);

//   useEffect(() => {
//     if (token && userData?.email) {
//       fetchMFAStatus();
//     }
//   }, [token, userData?.email]);

//   const fetchMFAStatus = () => {
//     if (token && userData?.email) {
//       axios
//         .get("http://localhost:5000/api/check-mfa-enabled", {
//           params: { email: userData.email },
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           setMfaEnabled(response.data.mfaEnabled);
//           setMfaMethod(response.data.mfaMethod);
//         })
//         .catch(() =>
//           Swal.fire("Error", "Failed to retrieve MFA status.", "error")
//         );
//     }
//   };

//   const handleToggleMFA = () => {
//     if (mfaEnabled) {
//       // Ask for MFA verification before disabling it
//       setShowMFAVerificationPage(true);
//     } else {
//       handleSelectMfaMethod();
//     }
//   };

//   const handleMFAConfirmed = () => {
//     if (mfaEnabled) {
//       // Disable MFA after verification
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

//   return (
//     <div className="settings-container">
//       {!showMFASettings && !showMFAEmail && !showMFAVerificationPage ? (
//         <>
//           <h1>Settings</h1>
//           <div className="settings-option">
//             <h2>MFA Security</h2>
//             <p>
//               Status: <strong>{userData?.mfa_enabled  ? "Enabled" : "Disabled"}</strong>
//             </p>

//             {userData?.mfa_enabled  && userData?.mfa_method  && (
//               <p>
//                 Current Method: <strong>{userData?.mfa_method.toUpperCase()}</strong>
//               </p>
//             )}
//             <button onClick={handleToggleMFA} className="settings-button">
//               {userData?.mfa_enabled ? "Disable MFA" : "Enable MFA"}
//             </button>
//           </div>
//         </>
//       ) : showMFASettings ? (  // Display the QR Code method (Authy)
//         <MFASettings email={userData.email} />
//       ) : showMFAEmail ? (  // Display the Email MFA method
//         <MFAEmail email={userData.email} />
//       ) : showMFAVerificationPage ? (  // MFA verification page if disabling MFA
//         <MfaVerificationPage
//           email={userData.email}
//           onMFAConfirmed={handleMFAConfirmed}
//         />
//       ) : null}
//     </div>
//   );
// };

// export default SettingsPage;
