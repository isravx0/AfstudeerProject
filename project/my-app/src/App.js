import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/welcomepage/Header';
import MainContent from './components/welcomepage/MainContent';
import Footer from './components/welcomepage/Footer';
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import PasswordReset from './components/password_reset/Password_reset';
import ResetPassword from './components/password_reset/NewPassword';
import FAQPage from './components/faq/FAQPage';
import FloatingChatButton from './components/faq/FloatingChatButton.js';
import ContactPage from './components/contact/ContactPage'; 
import InformationPage from './components/information/InformationPage';
import Homepage from './components/homepage/homepage';
import PersonalInfoPage from './components/user_account/PersonalInfoPage';
import DataSharingPage from './components/user_account/DataSharingPage';
import DashboardPage from './components/user_account/DashboardPage';
import SettingsPage from './components/user_account/SettingsPage';
import Sidebar from './components/user_account/Sidebar';
import FeedbackForm from './components/feedback/FeedbackForm.js';
import PrivateRoute from './components/PrivateRoute'; 
import { AuthProvider } from './components/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/password_reset" element={<PasswordReset />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/information" element={<InformationPage />} />
            <Route path="/feedback" element={<FeedbackForm />} />

            {/* Protect user account pages with Sidebar */}
            <Route 
              path="/personal-info" 
              element={
                <PrivateRoute>
                  <div style={{ display: 'flex' }}>
                    <Sidebar />
                    <div style={{ marginLeft: '250px', width: '100%' }}>
                      <PersonalInfoPage />
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <div style={{ display: 'flex' }}>
                    <Sidebar />
                    <div style={{ marginLeft: '250px', width: '100%' }}>
                      <DashboardPage />
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            <Route 
              path="/data-sharing" 
              element={
                <PrivateRoute>
                  <div style={{ display: 'flex' }}>
                    <Sidebar />
                    <div style={{ marginLeft: '250px', width: '100%' }}>
                      <DataSharingPage />
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            <Route 
              path="/settings" 
              element={
                <PrivateRoute>
                  <div style={{ display: 'flex' }}>
                    <Sidebar />
                    <div style={{ marginLeft: '250px', width: '100%' }}>
                      <SettingsPage />
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            {/* Protect the /home route */}
            <Route 
              path="/home" 
              element={
                <PrivateRoute>
                  <Homepage />
                </PrivateRoute>
              }     
            />
          </Routes>

          <FloatingChatButton />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
