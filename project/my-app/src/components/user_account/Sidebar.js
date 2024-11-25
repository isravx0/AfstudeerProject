import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Importeer de context om gebruikersgegevens op te halen
import defaultProfilePic from "./images/profile-image.png"; // Zorg ervoor dat het bestand correct wordt geïmporteerd
import "./style/Sidebar.css";

const Sidebar = ({ onToggle }) => {
  const { userData } = useAuth(); // Verkrijg de gebruikersgegevens uit de context
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState); // Notify parent about the collapse state
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Toggle Button */}
      <div className="toggle-btn" onClick={toggleSidebar}>
        <i className={`bi ${isCollapsed ? "bi-chevron-right" : "bi-chevron-left"}`}></i>
      </div>

      {/* Navigation Menu */}
      <ul>
        <li>
          <NavLink to="/user-account/personal-info" activeClassName="active">
            <i className="icon bi bi-person"></i>
            <span className="text">Personal Info</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/user-account/data-sharing" activeClassName="active">
            <i className="icon bi bi-arrow-repeat"></i>
            <span className="text">Data Sharing</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/user-account/dashboard" activeClassName="active">
            <i className="icon bi bi-bar-chart"></i>
            <span className="text">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/user-account/settings" activeClassName="active">
            <i className="icon bi bi-gear"></i>
            <span className="text">Settings</span>
          </NavLink>
        </li>
      </ul>

      {/* Profile Section */}
      <div className="profile-section">
        {userData?.profilePicture ? (
          <img
            src={`http://localhost:3000${userData.profilePicture}`} // Dynamisch de afbeelding weergeven
            alt="Profile"
          />
        ) : (
          <img src={defaultProfilePic} alt="Default Profile" /> // Standaard afbeelding als er geen profiel is
        )}
        <span className="name">{userData?.name || "User Name"}</span> {/* Dynamisch de naam van de gebruiker */}
      </div>

      {/* Logout Section */}
      <div className="logout-section">
        <NavLink to="/logout" className="logout-link">
          <i className="icon bi bi-box-arrow-right"></i>
          <span className="logout-link text">Logout</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
