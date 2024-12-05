// import React, { useState } from 'react';
// import './CancellationModal.css'

// const CancellationModal = ({ isOpen, onClose, onNext, booking }) => {
//   const [selectedReason, setSelectedReason] = useState('');

//   const reasons = [
//     "A reason here for cancellation of booking",
//     "Another reason for cancellation of booking",
//     "A different reason for cancellation of booking",
//     "Yet another reason for cancellation of booking",
//   ];

//   const handleReasonSelect = (reason) => {
//     setSelectedReason(reason);
//   };

//   const handleConfirmCancellation = () => {
//     if (selectedReason) {
//       onNext(selectedReason);
//     }
//   };

//   return (
//     <div
//       className={`modal ${isOpen ? 'show' : ''}`}
//       style={{ display: isOpen ? 'block' : 'none' }}
//     >
//       <div className="modal-dialog">
//         <div className="modal-content">
//           <div className="modal-header border-0">
//             <h5 className="modal-title">Cancel Booking</h5>
//             <button
//               type="button"
//               className="btn-close"
//               onClick={onClose}
//             ></button>
//           </div>
//           <div className="modal-body">
//             <div className="booking-image mb-3">
//               <img
//                 src="./../../ServicesSection/test2.jpg"
//                 alt={booking.serviceType}
//                 className="cancel-image" 
//               />
//               <p className="mt-2 text-center">{booking.serviceType}</p>
//             </div>
//             <div className="mb-3">
//               <h6 className="form-label">Reason for Cancellation</h6>
//               <div className="reasons-list">
//                 {reasons.map((reason, index) => (
//                   <div key={index} className="form-check mb-2">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="cancellationReason"
//                       id={`reason-${index}`}
//                       value={reason}
//                       onChange={() => handleReasonSelect(reason)}
//                       checked={selectedReason === reason}
//                     />
//                     <label
//                       className="form-check-label"
//                       htmlFor={`reason-${index}`}
//                     >
//                       {reason}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <button
//               className="btn btn-danger w-100"
//               onClick={handleConfirmCancellation}
//               disabled={!selectedReason} // Disable button if no reason is selected
//             >
//               Cancel Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CancellationModal;




import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CancellationModal.css';

const CancellationModal = ({ isOpen, onClose, onNext, booking }) => {
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
    }
  };

  return (
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
                src="./../../ServicesSection/test2.jpg"
                alt={booking.serviceType}
                className="cancel-image img-fluid"
              />
              <p className="mt-2">{booking.serviceType}</p>
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
  );
};

export default CancellationModal;
