import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CancellationModal.css';
import UpcomingTab from '../../BookingTabs/UpcomingTab/UpcomingTab';

const CancellationModal = ({ isOpen, onClose, onNext, booking, onConfirm, sub_category_id }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const reasons = [
    "Selected wrong booking details",
    "Change of plans",
    "Booked by mistake",
    "Wait time is too long",
    "Issues with the service provider",
    "Other"
  ];

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    if (reason === "Other") {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setOtherReason('');
    }
  };

  const handleConfirmCancellation = () => {
    const finalReason = selectedReason === "Other" ? otherReason : selectedReason;
    if (finalReason) {
      onNext(finalReason);
      onConfirm(finalReason);
    }
  };

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
                  src={
                    {
                      1: "./../ServicesSection/CookingSection/chef.png",
                      2: "./../ServicesSection/CookingSection/chef-cooking-2.jpg",
                      3: "./../ServicesSection/CookingSection/chef3.png",
                      4: "./../ServicesSection/DriverServices/driverServices1.jpg",
                      5: "./../ServicesSection/DriverServices/driverServices.jpg",
                      6: "./../ServicesSection/DriverServices/driverServices3.jpg",
                      7: "./../ServicesSection/DriverServices/driverServices2.jpg",
                      8: "./../ServicesSection/GardenerServices/gardener3.jpg",
                      9: "./../ServicesSection/GardenerServices/gardener2.jpg",
                    }[sub_category_id] ||
                    "./../ServicesSection/demoCancel.jpg"
                  }
                  alt={"Service Image"}
                  style={{ marginBottom: "15px" }}
                />
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
                        style={{ cursor: "pointer" }}
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
                {showOtherInput && (
                  <textarea
                    className="form-control mt-2"
                    placeholder="Please specify your reason"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  ></textarea>
                )}
              </div>
              <button
                className="btn btn-danger w-100"
                onClick={handleConfirmCancellation}
                disabled={!selectedReason || (selectedReason === "Other" && !otherReason)}
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
