import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className=" footer-container">
        {/* Branding */}
        <div className="container nav-container footer-brand ">
          <h2 className="text-left">Servyo</h2>
        </div>

        {/* Footer Columns */}
        <div className="footer-columns">
          {/* Company Section */}
          <div className="footer-column">
            <h4>Company</h4>
            <ul className="footer-subContent">
              <li>
                <Link to="/about-us">About Us</Link>
              </li>
              <li>
                <Link to="/join-as-partner">Contact Us</Link>
              </li>
              <li>
                <a href="/privacy-policy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms-and-conditions">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="footer-column">
            <h4>Services</h4>
            <ul className="footer-subContent">
              <li>
                <Link to="/services/cook-service">Cook</Link>
              </li>
              <li>
                <Link to="/services/driver-service">Driver</Link>
              </li>
              <li>
                <Link to="/services/gardener-service">Gardener</Link>
              </li>
            </ul>
          </div>

          {/* For Partners Section */}
          <div className="footer-column">
            <h4>For Partners</h4>
            <ul className="footer-subContent">
              <li>
                <a href="/join-as-partner">Register as a Professional</a>
              </li>
            </ul>
          </div>

          {/* Social Links Section */}
          <div className="footer-column">
            <h4>Social Links</h4>
            <div className="social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            <div className="app-buttons ">
              <a href="/app-store" className="store-button-footer google-play">
                <img className="store-img" src="./Footer/AppStore.png" alt="App Store" />
              </a>
              <a href="/google-play" className="store-button-footer google-play">
                <img className="store-img" src="./Footer/GooglePlayStore.png" alt="Google Play" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>Copyright © 2024 Servyo</p>
      </div>
    </footer>
  );
};

export default Footer;
