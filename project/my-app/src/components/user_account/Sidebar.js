import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./style/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        <h2 className="sidebar-title">Dashboard</h2>
        <li>
            <NavLink to="/user-account/personal-info" activeClassName="active">
            <span className="icon">👤</span>
            <span className="text">Personal Info</span>
            </NavLink>
        </li>
        <li>
            <NavLink to="/user-account/data-sharing" activeClassName="active">
            <span className="icon">🔄</span>
            <span className="text">Data Sharing</span>
            </NavLink>
        </li>
        <li>
            <NavLink to="/user-account/dashboard" activeClassName="active">
            <span className="icon">📊</span>
            <span className="text">Dashboard</span>
            </NavLink>
        </li>
        <li>
            <NavLink to="/user-account/settings" activeClassName="active">
            <span className="icon">⚙️</span>
            <span className="text">Settings</span>
            </NavLink>
        </li>
        </ul>

      </div>
    </>
  );
};

export default Sidebar;
