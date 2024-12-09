import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmationModal = ({ isOpen, onClose, onConfirm,bookingId,selectedReason }) => {

const token = sessionStorage.getItem("ServiceProviderUserToken")

console.log("Confirm Modal",bookingId)

  // const handleConfirmCancellation = async () => {
  //   const updatedAddress = {
  //     booking:{
  //       booking_id:cancelId,
  //       reason:selectedReason,
  //     }
  //   };
  //   try {
     
  //     const response = await axios.patch(
  //       `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/cancel_booking`,
  //       updatedAddress,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     if(response?.status===200 && response?.data?.success){
        
  //       alert(response?.data?.message||"booking Canceled successfully!");
  //     }
  //     else{
  //       alert(response?.data?.message||"Failed to Canceled Booking!");
  //     }
  //   } catch (error) {
  //     console.error("Error updating address:", error);
  //     alert("Failed to update address.");
  //   }
  // };
  const navigate = useNavigate();
  const handleModifyButton = (id) => {
    navigate("/modify-booking", { state: {id} });
  };
  return (
        <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center py-4">
                <div className="mb-3">
                  <span role="img" aria-label="thinking" style={{ fontSize: '2rem' }}>🤔</span>
                </div>
                <h5 className="mb-3">Are you sure about cancelling this booking?</h5>
                <p className="text-muted">You can always Modify it.</p>
                <div className="d-flex justify-content-center gap-2 mt-4">
                  <button className="btn btn-danger px-4" onClick={onConfirm}>
                    Cancel
                  </button>
                  <button className="btn btn-primary px-4" onClick={()=>{
                    handleModifyButton(bookingId?.booking_id)
                    // handleViewMore(booking?.booking_id)
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
}

export default ConfirmationModal