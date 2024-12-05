// import React from 'react'

// const PaymentStep = () => {
//   return (
//     <div>PaymentStep</div>
//   )
// }

// export default PaymentStep

import React, { useEffect } from "react";
import "./PaymentStep.css";

const PaymentStep = ({ isOpen, onClose }) => {
  // Close modal on Esc key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-labelledby="payment-modal-title"
      aria-hidden={!isOpen}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 id="payment-modal-title">Payment</h2>
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close payment modal"
          >
            ✖
          </button>
        </div>
        <div className="modal-body">
          <p>Complete your payment to confirm the booking.</p>
          <div className="payment-options">
            <button className="payment-button">Pay Now</button>
            <button className="payment-button">Pay Later</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;

