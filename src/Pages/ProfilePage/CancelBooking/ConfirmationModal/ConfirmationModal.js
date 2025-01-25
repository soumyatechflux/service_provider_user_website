import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Importing cross icon

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {


  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            {/* Close button (cross icon) */}
            <button type="button" className="close" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#000' }}>
              <FaTimes />
            </button>
  
          </div>
          <div className="modal-body text-center py-4">
            <div className="mb-3">
              <span role="img" aria-label="thinking" style={{ fontSize: '2rem' }}>🤔</span>
            </div>
            <h5 className="mb-3">Are you sure about cancelling this booking?</h5>
            <p className="text-muted">You can always Modify it.</p>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button className="btn btn-danger px-4" onClick={onConfirm}>
                Yes Cancel Booking
              </button>
              {/* <button className="btn btn-primary px-4" onClick={() => {
                handleModifyButton(bookingId?.booking_id);
              }}>
                Modify Booking
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
