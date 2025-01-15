import React, { useState, useEffect } from "react";
import { Star, Clock, User, Trophy, ChefHat } from "lucide-react";
import "./UpcomingTab.css";
import { useNavigate } from "react-router-dom";
import CancellationModal from "../../CancelBooking/CancellationModal/CancellationModal";
import ConfirmationModal from "../../CancelBooking/ConfirmationModal/ConfirmationModal";
import SuccessModal from "../../CancelBooking/SuccessModal/SuccessModal";
import Loader from "./../../../Loader/Loader";
import axios from "axios";
import ModifyBooking from "../../ModifyBooking/ModifyBooking";
import MessageModal from "../../../MessageModal/MessageModal";

const UpcomingTab = () => {
  const [openBookingIndex, setOpenBookingIndex] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsIdWise, setBookingsIdwise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const [currentModal, setCurrentModal] = useState(null);
  const [cancelId, setCancelId] = useState(null);

  const handleCancelClick = (id) => {
    console.log("iddd", id);
    setCancelId(id);
    setCurrentModal("cancellation");
  };

  const handleCancellationNext = () => {
    setCurrentModal("confirmation");
  };

  const handleCloseModal = () => {
    setCurrentModal(null);
    setCancelId(null);
  };

  const handleViewMore = async (id) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/bookings/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Upcomming Booking response:", response);

      if (response.status === 200 && response.data.success === true) {
        const idwiseData = response.data.data;
        console.log("Data fetched for ID:", idwiseData);

        setBookingsIdwise(idwiseData || []); // Update state
      }
    } catch (error) {
      console.error("Failed to fetch upcoming bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Monitor state update
  useEffect(() => {
    console.log("Updated bookingsIdWise:", bookingsIdWise);
  }, [bookingsIdWise]);

  const handleModifyButton = (id) => {
    navigate("/modify-booking", { state: { bookingsIdWise, id } });
  };

  const fetchUpcommingBookings = async () => {
    try {
      setLoading(true);
      // const response = await getUpCommingBookingsAPI();
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/upcoming_bookings`,

        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Upcomming Booking response", response);
      console.log(response.status);
      if (response.status === 200 && response.data.success === true) {
        console.log("All Upcommings", response.data.data);
        setBookings(response.data.data || []); // Assuming the response contains a `bookings` field
      }
    } catch (error) {
      // toast.error("Failed to fetch upcomming bookings.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUpcommingBookings();
  }, []);

  const handleConfirmationNext = async () => {
    console.log("...", selectedReason);

    const cancelDetails = {
      booking: {
        booking_id: cancelId,
        reason: selectedReason,
      },
    };

    console.log("Payload sent:", cancelDetails);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/cancel_booking`,
        cancelDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Optional: add Content-Type header if needed
          },
        }
      );

      if (response?.status === 200 && response?.data?.success) {
        setCurrentModal("success");
       
      } else {
        // alert(response?.data?.message || "Failed to cancel booking!");
        setMessage(response?.data?.message || "Failed to cancel booking!");
        setShow(true);
        handleShow(); // Show the modal
      }
    } catch (error) {
      console.error(
        "Error during cancellation:",
        error.response?.data || error.message
      );
      // alert(error.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const passDataToNext = (reason) => {
    setSelectedReason(reason);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Function to format time to "04:39 PM"
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <div className="booking-container">
        {bookings.length === 0 ? ( // Check if there are no bookings
          <div className="no-bookings-message">
            <h3>No upcoming bookings</h3>
          </div>
        ) : (
          bookings.map((booking, index) => (
            <div key={index} className="booking-item">
              {openBookingIndex === index ? (
                <div className="booking-details mt-3">
                  <div className="column1">
                    <div className="details-header">
                      <h2 className="details-head">
                        {formatDate(bookingsIdWise?.visit_date)} at{" "}
                        {formatTime(bookingsIdWise?.visit_time)}
                      </h2>
                      <div className="service-image image-flex">
                        <img src="./../ServicesSection/demoCancel.jpg" 
                        style={{marginBottom:"15px"}}/>
                        <h2 className="heading-text">
                          {bookingsIdWise?.sub_category?.sub_category_name}
                        </h2>
                      </div>
                    </div>
                    <div className="provider-section">
                      <h3 className="heading-text">Service Provider</h3>
                      <div className="provider-info">
                        <div className="provider-avatar">
                          <img
                            src={
                              bookingsIdWise?.partner?.image ||
                              "/dummy-image.jpg"
                            }
                            alt="image"
                            style={{
                              height: "60px",
                              width: "70px",
                              borderRadius: "50%",
                            }}
                          />
                        </div>
                        <div className="provider-details">
                          <h4 className="provider-name">
                            <p>
                              {bookingsIdWise?.partner?.name
                                ? bookingsIdWise?.partner?.name
                                : "No Partner Accepted"}
                            </p>
                          </h4>
                          <p className="provider-role">
                            {bookingsIdWise?.category?.category_name}
                          </p>
                        </div>
                      </div>
                      <div className="rating-profile mt-2">
                        <div>
                          <Star className="star-icon mr-1" />
                          <span>
                            <span style={{ fontWeight: "bold" }}>
                              {bookingsIdWise?.partner?.rating}/5
                            </span>{" "}
                            Rating
                          </span>
                        </div>
                        <div>
                          <Trophy className="clock-icon mr-1" />
                          <span className="">
                            {bookingsIdWise?.partner?.years_of_experience} yrs
                            of exp.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="details-actions">
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancelClick(booking?.booking_id)}
                        disabled={booking?.booking_status === "cancelled"}
                      style={{
                        cursor:
                          booking?.booking_status === "cancelled"
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          booking?.booking_status === "cancelled" ? 0.5 : 1,
                      }}>
                        Cancel
                      </button>
                      <button
                        className="btn-modify-upcoming"
                        onClick={() => {
                          handleModifyButton(booking?.booking_id);
                        }}
                        disabled={booking?.booking_status === "cancelled"}
                      style={{
                        cursor:
                          booking?.booking_status === "cancelled"
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          booking?.booking_status === "cancelled" ? 0.5 : 1,
                      }}
                      >
                        Modify
                      </button>
                    </div>
                  </div>
                  <div className="column2">
                    <h3 className="heading-text mb-4">Booking Details</h3>
                    <div className="booking-info">
                      <div className="info-group">
                        <h4 className="booking-subtitle">Booking For</h4>
                        <p className="booking-info-text">
                          {bookingsIdWise?.category?.category_name} -{" "}
                          {bookingsIdWise?.sub_category?.sub_category_name}
                        </p>
                      </div>
                      <div className="info-group">
                        <h4 className="booking-subtitle">Address</h4>
                        <p className="booking-info-text">
                          {bookingsIdWise?.visit_address}
                        </p>
                      </div>
                      <div className="info-group">
                        <h4 className="booking-subtitle">Number of People</h4>
                        <p className="booking-info-text">
                          {bookingsIdWise?.number_of_people}
                        </p>
                      </div>
                      <div className="info-group">
                        <h4 className="booking-subtitle">Menu and Dishes</h4>
                        <p className="booking-info-text">
                          {bookingsIdWise?.menu_and_services}
                        </p>
                      </div>
                      <div className="info-group">
                        <h4 className="booking-subtitle">Date & Time</h4>
                        <p className="booking-info-text">
                          {`${formatDate(
                            bookingsIdWise?.visit_date
                          )}, ${formatTime(bookingsIdWise?.visit_time)}`}
                        </p>
                      </div>
                      <div className="info-group">
                        <h4 className="booking-subtitle">
                          Special Requests / Instructions
                        </h4>
                        <p className="booking-info-text">
                          {bookingsIdWise?.instructions}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="column3">
                    <h3 className="heading-text mb-4">Billing Details</h3>
                    <div className="billing-info">
                      <div className="billing-row">
                        <span className="billing-subtitle">Total</span>
                        <span className="billing-subtitle">
                          ₹{bookingsIdWise?.price}
                        </span>
                      </div>
                      <div className="billing-row discount">
                        <span className="billing-subtitle">Discount</span>
                        <span className="billing-subtitle">
                          -₹{bookingsIdWise?.discount}
                        </span>
                      </div>
                      <div className="billing-row">
                        <span className="billing-subtitle">GST</span>
                        <span className="billing-subtitle">
                          ₹{bookingsIdWise?.gst_amount}
                        </span>
                      </div>
                      <div className="billing-row total">
                        <span className="billing-subtitle text-bold">
                          Grand Total
                        </span>
                        <span className="final-amount">
                          ₹{bookingsIdWise?.billing_amount}
                        </span>
                      </div>
                      <div className="payment-mode">
                        <span className="billing-subtitle">Payment mode</span>
                        <span className="billing-subtitle">
                          {bookingsIdWise?.payment_mode}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn-view-less"
                    onClick={() => setOpenBookingIndex(null)}
                  >
                    View less
                  </button>
                </div>
              ) : (
                // Summary View
                <div className="booking-summary mt-3 mb-3">
                  <div className="summary-header">
                    <div className="service-info">
                      <ChefHat className="user-icon" />
                      <h2 className="profile-heading">
                        {booking?.sub_category_name}
                      </h2>
                    </div>
                    <div
                      className="status-message"
                      style={{
                        color:
                          booking?.booking_status === "cancelled"
                            ? "red"
                            : "green",
                      }}
                    >
                      <span
                        className="status-dot"
                        style={{
                          backgroundColor:
                            booking?.booking_status === "cancelled"
                              ? "red"
                              : "green",
                        }}
                      ></span>
                      {booking?.booking_status
                        ? booking.booking_status.charAt(0).toUpperCase() +
                          booking.booking_status.slice(1)
                        : ""}
                    </div>
                  </div>

                  <div className="summary-content">
                    <div className="time-provider">
                      <p>{booking?.booking_date_time}</p>

                      <p>
                        Service Provider -{" "}
                        {booking?.partner_id
                          ? booking?.partner_name
                          : "No Partner Accepted"}
                      </p>
                    </div>

                    <div className="amount">₹{booking?.billing_amount}</div>
                  </div>

                  <div className="summary-actions">
                    <button
                      className="btn-modify"
                      onClick={() => handleModifyButton(booking?.booking_id)}
                      disabled={booking?.booking_status === "cancelled"}
                      style={{
                        cursor:
                          booking?.booking_status === "cancelled"
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          booking?.booking_status === "cancelled" ? 0.5 : 1,
                      }}
                    >
                      Modify
                    </button>
                    <button
                      className="btn-view-details"
                      onClick={() => {
                        handleViewMore(booking?.booking_id);
                        setOpenBookingIndex(index);
                      }}
                    >
                      View details
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {cancelId !== null && (
          <>
            <CancellationModal
              isOpen={currentModal === "cancellation"}
              onClose={handleCloseModal}
              onNext={handleCancellationNext}
              bookingsIdWise={bookingsIdWise}
              bookingId={cancelId}
              booking={bookings[cancelId]}
              onConfirm={passDataToNext}
            />
            <ConfirmationModal
              isOpen={currentModal === "confirmation"}
              onClose={() => setCurrentModal("cancellation")}
              onConfirm={handleConfirmationNext}
              bookingId={bookingsIdWise}
            />
            <SuccessModal
              isOpen={currentModal === "success"}
              onClose={handleCloseModal}
            />
            <ModifyBooking
              bookingsIdWise={bookingsIdWise}
              fetchUpcommingBookings={fetchUpcommingBookings}
            />
            <MessageModal
              show={show}
              handleClose={handleClose}
              handleShow={handleShow}
              message={message}
            />
          </>
        )}
      </div>
    </>
  );
};

export default UpcomingTab;
