import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, bookingId, selectedReason }) => {
  const token = sessionStorage.getItem("ServiceProviderUserToken");

  console.log("Confirm Modal", bookingId);
  const navigate = useNavigate();

  const handleModifyButton = (id) => {
    navigate("/modify-booking", { state: { id } });
  };

  return (
    <div
      className={`modal ${isOpen ? 'show' : ''}`}
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Cross Icon to Close the Modal */}
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose} // Close the modal when clicked
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '1.5rem',
                cursor: 'pointer',
                position: 'absolute',
                right: '10px',
                top: '10px',
              }}
            >
              &times; {/* Cross icon */}
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body text-center py-4">
            <div className="mb-3">
              <span role="img" aria-label="thinking" style={{ fontSize: '2rem' }}>
                🤔
              </span>
            </div>
            <h5 className="mb-3">Are you sure about cancelling this booking?</h5>
            <p className="text-muted">You can always Modify it.</p>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button className="btn btn-danger px-4" onClick={onConfirm}>
                Yes, Cancel
              </button>
              <button
                className="btn btn-primary px-4"
                onClick={() => {
                  handleModifyButton(bookingId?.booking_id);
                }}
              >
                Modify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
