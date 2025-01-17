


import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CancellationModal.css';
import UpcomingTab from '../../BookingTabs/UpcomingTab/UpcomingTab';

const CancellationModal = ({ isOpen, onClose, onNext, booking,onConfirm}) => {
  const [selectedReason, setSelectedReason] = useState('');

  const reasons = [
    "A reason here for cancellation of booking",
    "Another reason for cancellation of booking",
    "A different reason for cancellation of booking",
    "Yet another reason for cancellation of booking",
  ];

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
  };
 

  const handleConfirmCancellation = () => {
    if (selectedReason) {
      onNext(selectedReason);
      onConfirm(selectedReason);
    }
  };

  console.log("",selectedReason)

  return (
    <>
     <div
      className={`modal fade ${isOpen ? 'show' : ''}`}
      style={{ display: isOpen ? 'block' : 'none' }}
      tabIndex="-1"
      aria-hidden={!isOpen}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cancel Booking</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="booking-image mb-3 text-center">
              <img
                src="./../../ServicesSection/demoCancel.jpg"
                alt="cancel"
                className="cancel-image img-fluid"
              />
              {/* <p className="mt-2">{booking.serviceType}</p> */}
            </div>
            <div className="mb-3">
              <h6 className="form-label">Reason for Cancellation</h6>
              <div className="reasons-list">
                {reasons.map((reason, index) => (
                  <div key={index} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="cancellationReason"
                      id={`reason-${index}`}
                      value={reason}
                      onChange={() => handleReasonSelect(reason)}
                      checked={selectedReason === reason}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`reason-${index}`}
                    >
                      {reason}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="btn btn-danger w-100"
              onClick={handleConfirmCancellation}
              disabled={!selectedReason} // Disable button if no reason is selected
            >
              Cancel Now
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
   
  );
};

export default CancellationModal;
