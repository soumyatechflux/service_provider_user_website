import React from "react";
import "./TermsAndConditions.css"; // Optional: For custom styling

const TermsAndConditions = () => {
  return (
    <div className="sp-container">
      <div className="sp-header">
        <h1>Terms and Conditions</h1>
      </div>
      
      <div className="sp-content">
        <div className="sp-section">
          <h2>Service Agreement</h2>
          <p>By using our platform, you agree to these terms and conditions. Our services are provided on an 'as is' and 'as available' basis, subject to these terms and any additional terms presented at the time of service booking.</p>
        </div>

        <div className="sp-section">
          <h2>User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must provide accurate and complete information when booking services.</p>
        </div>

        <div className="sp-section">
          <h2>Cancellation Policy</h2>
          <p>Cancellations must be made at least 24 hours before the scheduled service. Late cancellations may incur charges as detailed in our cancellation policy.</p>
        </div>

        <div className="sp-section">
          <h2>Liability</h2>
          <p>We strive to provide reliable services but cannot guarantee uninterrupted access to our platform or services.</p>
        </div>
      </div>
    </div>
  );
};
export default TermsAndConditions;
