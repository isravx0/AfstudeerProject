import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faXTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import './style/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className='footerContainer'>
        <div className='socialIcons'>
          <a href='#'><i><FontAwesomeIcon icon={faFacebookF} /></i></a>
          <a href='#'><i><FontAwesomeIcon icon={faInstagram} /></i></a>
          <a href='#'><i><FontAwesomeIcon icon={faXTwitter} /></i></a>
          <a href='#'><i><FontAwesomeIcon icon={faLinkedinIn} /></i></a>
        </div> 

        <div className='footerNav'>
          <ul>
            <li><a href='/features'>Features</a></li>
            <li><a href='/pricing'>Pricing</a></li>
            <li><a href='/help'>Help Center</a></li>
            <li><a href='/feedback'>Feedback</a></li>
            <li><a href='/about-us'>About us</a></li>
            <li><a href='/faq'>FAQ</a></li>
          </ul>
        </div>

      </div>

      <div className='footerBottom'>
          <p>Copyright &copy;2024; Solar Panel Simulation</p>
        </div>
    </footer>
  );
};

export default Footer;
