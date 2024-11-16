import React from "react";
import { Link } from "react-router-dom";
import "./style/Sidebar.css";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2 className="sidebar-title">Dashboard</h2>
            <ul className="sidebar-menu">
                <li>
                    <Link to="/personal-info" className="menu-item">
                        Personal Info
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard" className="menu-item">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/data-sharing" className="menu-item">
                        Data Sharing
                    </Link>
                </li>
                <li>
                    <Link to="/settings" className="menu-item">
                        Settings
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
