import React from 'react';
import './Footer.css';
import logoText from '../assets/logotext.png'; // white version of your brand text

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container py-4">
        <div className="row">
          {/* Logo Section */}
          <div className="col-md-3 mb-4 mb-md-0 d-flex align-items-start">
            <img src={logoText} alt="Falcon Superline" className="footer-logo" />
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-list">
              <li><a href="#">Home</a></li>
              <li><a href="#">Book Ticket</a></li>
              <li><a href="#">Gallery</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">My Profile</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6 className="footer-heading">Contact Us</h6>
            <ul className="footer-list">
              <li><a href="mailto:falcon@gmail.com">falcon@gmail.com</a></li>
              <li>+94-716348127</li>
              <li>+94-112109824</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-md-3">
            <h6 className="footer-heading">Social Media</h6>
            <ul className="footer-list">
              <li><a href="#">Like Us on Facebook</a></li>
              <li><a href="#">Follow Us on Instagram</a></li>
              <li><a href="#">Follow Us on X</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
