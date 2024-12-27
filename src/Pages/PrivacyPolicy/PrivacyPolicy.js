
import React from "react";
import "./PrivacyPolicy.css"; // Optional: For custom styling

const PrivacyPolicy = () => {
  return (
    <div className="sp-container">
      <div className="sp-header">
        <h1>Privacy Policy</h1>
      </div>
      
      <div className="sp-content">
        <div className="sp-section">
          <h2>Information Collection</h2>
          <p>We collect information that you provide directly to us, including but not limited to your name, email address, phone number, and service preferences when you register for our services.</p>
        </div>

        <div className="sp-section">
          <h2>Information Usage</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, communicate with you about your service requests, and enhance your user experience.</p>
        </div>

        <div className="sp-section">
          <h2>Information Sharing</h2>
          <p>We share your information with service providers only to the extent necessary to fulfill your service requests. We do not sell or rent your personal information to third parties.</p>
        </div>

        <div className="sp-section">
          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, disclosure, or destruction.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
