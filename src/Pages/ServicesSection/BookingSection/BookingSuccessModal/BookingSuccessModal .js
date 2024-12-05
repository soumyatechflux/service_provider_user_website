import React from 'react';
import './BookingSuccessModal.css';

const BookingSuccessModal = () => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="success-modal">
          <div className="checkmark-circle">
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          
          <h2 className="success-title">Booking Successful !</h2>
          
          <p className="success-message">
            Your booking is currently awaiting confirmation from the service provider.
            We'll update you as soon as it's accepted!
          </p>
          
          <button 
            className="btn btn-primary back-home-btn" 
            
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;

