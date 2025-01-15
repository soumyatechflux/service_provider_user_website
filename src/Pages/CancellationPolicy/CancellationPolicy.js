import React from "react";
import "./CancellationPolicy.css"; // Import the CSS file for styling

const CancellationPolicy = () => {
  return (
    <div className="cp-container">
      <div className="cp-header">
        <h1>Cancellation Policy</h1>
      </div>

      <div className="cp-content">
        <div className="cp-section">
          <h3>Introduction</h3>
          <p>
            At [Your Service Name], we value your time and commitment. This cancellation policy outlines the terms for canceling booked services to ensure a fair process for both customers and service providers.
          </p>
        </div>

        <div className="cp-section">
          <h3>Cancellation Guidelines</h3>
          <ul>
            <li>
              Cancellations made more than 24 hours before the scheduled service will not incur any charges.
            </li>
            <li>
              Cancellations made within 24 hours of the scheduled service may incur a cancellation fee of up to 50% of the service cost.
            </li>
            <li>
              Failure to cancel or no-shows will result in a full charge for the service.
            </li>
          </ul>
        </div>

        <div className="cp-section">
          <h3>How to Cancel</h3>
          <p>
            To cancel a service, please follow these steps:
          </p>
          <ul>
            <li>Log in to your account on our platform.</li>
            <li>Navigate to the "My Bookings" section.</li>
            <li>Select the booking you wish to cancel and click "Cancel."</li>
            <li>Follow the on-screen instructions to confirm the cancellation.</li>
          </ul>
        </div>

        <div className="cp-section">
          <h3>Refund Policy</h3>
          <p>
            Refunds for cancellations will be processed as per the cancellation guidelines:
          </p>
          <ul>
            <li>Full refunds for cancellations made more than 24 hours in advance.</li>
            <li>Partial refunds for cancellations made within 24 hours of the service.</li>
            <li>No refunds for no-shows or last-minute cancellations.</li>
          </ul>
        </div>

        <div className="cp-section">
          <h3>Contact Us</h3>
          <p>
            If you have any questions about this cancellation policy or need assistance, please contact our support team at support@[yourdomain].com or call us at 123-456-7890.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
