import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./style/Sidebar.css";
import profilePic from "./images/profile-image.png";

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState); // Notify parent about the collapse state
    }
  };

  // Example user data (can be dynamic based on logged-in user)
  const user = {
    name: "John Doe",
    profilePic: profilePic, // Example profile pic URL
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

      {/* Profile Section (Moved to right above Logout) */}
      <div className="profile-section">
        <img src={user.profilePic} alt="Profile" />
        <span className="name">{user.name}</span>
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
