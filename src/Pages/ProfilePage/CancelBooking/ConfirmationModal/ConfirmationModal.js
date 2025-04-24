
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, bookingId }) => {
  const [cancelDetails, setCancelDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && bookingId?.booking_id) {
      fetchCancelDetails(bookingId?.booking_id);
    }
  }, [isOpen, bookingId]);

  const fetchCancelDetails = async (id) => {
    setError(null);

    try {
      const token = sessionStorage.getItem('ServiceProviderUserToken');
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/cancel_booking/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.data?.success) {
        setCancelDetails(response?.data);
      } else {
        setError(response?.data?.message);
      }
    } catch (err) {
      console.error('Error fetching cancellation details:', err);
      const errorMessage =
        err.response?.data?.message || 'Error fetching cancellation details. Please try again.';
      setError(errorMessage);
    }
  };

  const shouldShowCancelDetails =
    cancelDetails &&
    (cancelDetails.cancelAmount > 0 || cancelDetails.refund_amount > 0);

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#000' }}
            >
              <FaTimes />
            </button>
          </div>
          <div className="modal-body text-center py-4">
            <div className="mb-3">
              <span role="img" aria-label="thinking" style={{ fontSize: '2rem' }}>🤔</span>
            </div>

            {/* Conditional Heading */}
            {error ? (
              <p className="text-danger">{error}</p>
            ) : shouldShowCancelDetails ? (
              <h5 className="mb-3">
                You may be charged a cancellation fee if you cancel this booking.
              </h5>
            ) : (
              <h5 className="mb-3">
                Are you sure about cancelling this booking?
              </h5>
            )}

            {shouldShowCancelDetails && !error && (
              <div className="cancel-details-container mb-4">
                <div className="cancel-info p-3 mb-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  {cancelDetails.cancelAmount > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Cancellation Charge:</span>
                      <span className="text-danger">₹{cancelDetails?.cancelAmount}</span>
                    </div>
                  )}
                  {cancelDetails.refund_amount > 0 && (
                    <div className="d-flex justify-content-between">
                      <span>Refund Amount:</span>
                      <span className="text-success">₹{cancelDetails?.refund_amount}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="d-flex justify-content-center gap-2 mt-4">
              {/* <button
                className="btn btn-danger px-4"
                onClick={onConfirm}
              >
                Yes, Cancel Booking
              </button> */}

<button
  className="btn btn-danger px-4"
  onClick={onConfirm}
  disabled={!!error}
  style={{
    cursor: error ? 'not-allowed' : 'pointer',
    opacity: error ? 0.6 : 1,
  }}
>
  Yes, Cancel Booking
</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
