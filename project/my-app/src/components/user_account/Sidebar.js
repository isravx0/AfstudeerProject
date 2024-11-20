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
              <i className="bi bi-person"></i> {/* Bootstrap Icon for Person */}
              <span className="text">Personal Info</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/user-account/data-sharing" activeClassName="active">
              <i className="bi bi-arrow-repeat"></i> {/* Bootstrap Icon for Sync */}
              <span className="text">Data Sharing</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/user-account/dashboard" activeClassName="active">
              <i className="bi bi-bar-chart"></i> {/* Bootstrap Icon for Chart */}
              <span className="text">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/user-account/settings" activeClassName="active">
              <i className="bi bi-gear"></i> {/* Bootstrap Icon for Settings */}
              <span className="text">Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
