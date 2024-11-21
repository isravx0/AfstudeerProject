import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./style/Sidebar.css";  // Keep your existing CSS import

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <NavLink to="/user-account/personal-info" activeClassName="active">
              <i className="icon bi bi-person"></i> {/* Bootstrap Icon for Person */}
              <span className="text">Personal Info</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/user-account/data-sharing" activeClassName="active">
              <i className="icon bi bi-arrow-repeat"></i> {/* Bootstrap Icon for Sync */}
              <span className="text">Data Sharing</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/user-account/dashboard" activeClassName="active">
              <i className="icon bi bi-bar-chart"></i> {/* Bootstrap Icon for Chart */}
              <span className="text">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/user-account/settings" activeClassName="active">
              <i className="icon bi bi-gear"></i> {/* Bootstrap Icon for Settings */}
              <span className="text">Settings</span>
            </NavLink>
          </li>
        </ul>

        {/* Logout Link */}
        <div className="logout-section">
          <NavLink to="/logout" className="logout-link">
            <i className="icon bi bi-box-arrow-right"></i> {/* Bootstrap Icon for Logout */}
            <span className="text">Logout</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
