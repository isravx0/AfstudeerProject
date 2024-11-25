import React from 'react';
import logo from './images/logo.png';
import defaultProfilePic from './images/profile.png'; // Default profile picture in case user doesn't have one
import LogoutButton from '../logout/LogoutButton';
import { useAuth } from '../AuthContext';
import './style/Header.css';

const Header = () => {
  const { loggedIn, userData, error } = useAuth();

  // Determine profile picture to show (either user's or default)
  const profilePic = userData?.profilePicture
    ? `http://localhost:3000${userData.profilePicture}` // If the user has a profile picture, use it
    : defaultProfilePic; // Otherwise, use the default profile image

  return (
    <div className='navbar'>
      <a href='/'>
        <img className='logo' src={logo} alt='logo' />
      </a>

      <div className='headerMenu'>
        <div className='rightMenu'>
          {loggedIn ? (
            <>
              <ul>
                <a href='/home'><li>Home</li></a>
                <a href='/solar-panel-dashboard'><li>Solar Panels Dashboard</li></a>
                <a href='/battery-dashboard'><li>Battery Dashboard</li></a>
                <a href='/simulation'><li>Simulation</li></a>
              </ul>

              {/* Display profile picture */}
              <img src={profilePic} alt='profile' className='profile' />
              <span>{userData?.name}</span>
              <div className="dropdown-menu">
                <div className="menu-icon">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>

                <div className="dropdown-content">
                  <a href="#home">Link1</a>
                  <a href="#home">Link2</a>
                  <a href="#home">Link3</a>
                  <a href="#home">Link4</a>
                  <LogoutButton />
                </div>
              </div>
            </>
          ) : (
            <>
              <ul>
                <li>About Us</li>
                <li>Customer Service</li>
                <li>How it works?</li>
              </ul>
            </>
          )}

          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Header;
