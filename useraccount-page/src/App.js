import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.js";
import PersonalInfoPage from "./components/PersonalInfoPage";
import DashboardPage from "./components/DashboardPage";
import DataSharingPage from "./components/DataSharingPage";
import SettingsPage from "./components/SettingsPage";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                <div className="main-content">
                    <Routes>
                        <Route path="/personal-info" element={<PersonalInfoPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/data-sharing" element={<DataSharingPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="*" element={<Navigate to="/personal-info" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
