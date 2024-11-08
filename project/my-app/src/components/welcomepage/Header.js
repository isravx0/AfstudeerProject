import React from 'react';
import logo from './images/logo.png';
import profile from './images/profile.png';
import LogoutButton from '../logout/LogoutButton'; 
import { useAuth } from '../AuthContext';
import './style/Header.css';

const Header = () => {
  const { loggedIn, userData, error } = useAuth();

  return (
    <div className='navbar'>
      <a href='/'>
        <img className='logo' src={logo} alt='logo'></img>
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

              <img src={profile} alt='profile' className='profile'></img>
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
