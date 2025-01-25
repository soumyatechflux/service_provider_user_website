import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className=" footer-container">
        {/* Branding */}
        <div className="container nav-container footer-brand mb-3">
        <img
            src="/LOGO_SP2.png"
            className="Footer-logo"
            // style={{ width: "186px", height: "54px" }}
          ></img>
        </div>

        {/* Footer Columns */}
        <div className="container nav-container footer-columns">
          {/* Company Section */}
          <div className="footer-column">
            <h4>Company</h4>
            <ul className="footer-subContent">
              <li>
                <Link to="/about-us">About Us</Link>
              </li>
              <li>
                <Link to="/contact-us">Contact Us</Link>
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
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
            <div className="app-buttons ">
              <a
                href="https://www.apple.com/app-store/" // Replace with your app's App Store URL
                 Google Play Store URL
                className="store-button-footer google-play"
              >
                <img
                  className="store-img"
                  src="/Footer/apple.png"
                  alt="App Store"
                />
              </a>
              <a
              href="https://play.google.com/store" // Replace with your app's
                className="store-button-footer google-play"
              >
                <img
                  className="store-img"
                  src="/Footer/google.png"
                  alt="Google Play"
                />
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
