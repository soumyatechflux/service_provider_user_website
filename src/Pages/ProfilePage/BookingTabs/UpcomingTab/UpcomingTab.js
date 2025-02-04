import React, { useState, useEffect } from "react";
import { Star, Clock, User, Trophy } from "lucide-react";
import { ChefHat, Car, Leaf } from "lucide-react"; // Import appropriate icons
import "./UpcomingTab.css";
import { useNavigate } from "react-router-dom";
import CancellationModal from "../../CancelBooking/CancellationModal/CancellationModal";
import ConfirmationModal from "../../CancelBooking/ConfirmationModal/ConfirmationModal";
import SuccessModal from "../../CancelBooking/SuccessModal/SuccessModal";
import Loader from "./../../../Loader/Loader";
import axios from "axios";
import ModifyBooking from "../../ModifyBooking/ModifyBooking";
import MessageModal from "../../../MessageModal/MessageModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RazorpayPayment from "../../../ServicesSection/BookingSection/RazorpayPayment";
import { useLocation } from "react-router-dom";

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
  const [ActiveBookingData, setActiveBookingData] = useState({});
  const [isSuccess, setIsSuccess] = useState();

  const navigate = useNavigate();

  const [currentModal, setCurrentModal] = useState(null);
  const [cancelId, setCancelId] = useState(null);

  const handleCancelClick = (id) => {
    // console.log("iddd", id);
    setCancelId(id);
    setCurrentModal("cancellation");
  };

  const handleCancellationNext = () => {
    setCurrentModal("confirmation");
  };

  const handleCloseModal = () => {
    setCurrentModal(null);
    setCancelId(null);
    fetchUpcommingBookings();
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

  const location = useLocation();

  const handleModifyButton = (booking) => {
    const serviceObject = {
      id: booking?.sub_category_id,
      category_id: booking?.category_id,
      booking_id: booking?.booking_id,
    };

    // Navigate and pass serviceObject as state
    navigate("/modify-booking", { state: { service: serviceObject } });
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
    setLoading(true);
    const cancelDetails = {
      booking: {
        booking_id: cancelId,
        reason: selectedReason,
      },
    };

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/cancel_booking`,
        cancelDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);

      if (response?.data?.success) {
        setCurrentModal(null); // Close the modal
        toast.success(
          response?.data?.message ||
            "The booking has been successfully cancelled."
        );
        setMessage(
          response?.data?.message ||
            "The booking has been successfully cancelled."
        );
        setIsSuccess(true); // Set to true for success
        setCurrentModal("success"); // Show success modal
      } else {
        setMessage(response?.data?.message || "Failed to cancel booking!");
        setIsSuccess(false); // Set to false for error
        setCurrentModal("error"); // Optionally create an error modal
      }
    } catch (error) {
      setLoading(false);
      setMessage(error.response?.data?.message || "Failed to cancel booking.");
      setIsSuccess(false); // Set to false for error
      setCurrentModal("error"); // Optionally create an error modal
    }
  };

  const passDataToNext = (reason) => {
    setSelectedReason(reason);
  };

  const [callRazorPay, setCallRazorPay] = useState(false);
  const [BookingData, setBookingData] = useState();

  const handlePayment = async (mod, ID) => {
    setLoading(true);

    try {
      const body = {
        booking: {
          booking_id: ID,
          payment_mode: mod,
        },
      };

      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/book_service`,

        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);

      if (response.status === 200) {
        // toast.success(response?.data?.message || "Successful!");

        if (response?.data?.order) {
          setBookingData(response?.data?.order);
          setCallRazorPay(true);
          console.log("sdjnkc6754dsgvhfrtynsdcbj");
        } else {
          setBookingData();
          setCallRazorPay(false);
        }
      } else {
        toast.error(response.data.error_msg || "Please try again.");
        // setModalMessage(response.data.error_msg || "Please try again.");
        // setShowModal(true);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
      // setModalMessage("An error occurred. Please try again later.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Function to format time to "04:39 PM"

  const categoryIcons = {
    1: ChefHat,
    2: Car,
    3: Leaf,
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);

    // Format the time with hour, minute, and AM/PM
    const formattedTime = date.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Convert the AM/PM part to uppercase
    return formattedTime.replace(/(am|pm)/, (match) => match.toUpperCase());
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
                <div className="booking-details mt-3 mb-3">
                  <div className="column1">
                    <div className="details-header">
                      <h2 className="details-head">
                        {formatDate(bookingsIdWise?.visit_date)} at{" "}
                        {formatTime(bookingsIdWise?.visit_time)}
                      </h2>

                      {/* <div className="service-image image-flex">
                        <img
                          src="./../ServicesSection/demoCancel.jpg"
                          style={{ marginBottom: "15px" }}
                        />
                        <h2 className="heading-text">
                          {bookingsIdWise?.sub_category?.sub_category_name}
                        </h2>
                      </div> */}

                      <div className="service-image image-flex">
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
                            }[bookingsIdWise?.sub_category_id] ||
                            "./../ServicesSection/demoCancel.jpg" // Fallback image
                          }
                          alt={
                            bookingsIdWise?.sub_category?.sub_category_name ||
                            "Service Image"
                          }
                          style={{ marginBottom: "15px" }}
                        />
                        <h2 className="heading-text">
                          {bookingsIdWise?.sub_category?.sub_category_name
                            ?.split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </h2>
                      </div>
                    </div>
                    <div className="provider-section">
                      <h3 className="heading-text">Service Provider</h3>
                      {bookingsIdWise?.partner?.name && (
                        <>
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
                                <p>{bookingsIdWise?.partner?.name}</p>
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
                                {bookingsIdWise?.partner?.years_of_experience}{" "}
                                yrs of exp.
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      {!bookingsIdWise?.partner?.name && (
                        <p>No Partner Accepted</p>
                      )}
                    </div>
                    <div className="details-actions">
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancelClick(booking?.booking_id)}
                        disabled={
                          booking?.booking_status === "cancelled" ||
                          booking?.booking_status === "inprogress"
                        }
                        style={{
                          cursor:
                            booking?.booking_status === "cancelled" ||
                            booking?.booking_status === "inprogress"
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            booking?.booking_status === "cancelled" ||
                            booking?.booking_status === "inprogress"
                              ? 0.5
                              : 1,
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        className="btn-modify-upcoming"
                        onClick={() => {
                          handleModifyButton(booking);
                        }}
                        disabled={
                          booking?.partner_name ||
                          booking?.booking_status !== "upcoming"
                        }
                        style={{
                          cursor:
                            booking?.partner_name ||
                            booking?.booking_status === "cancelled"
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            booking?.partner_name ||
                            booking?.booking_status === "cancelled"
                              ? 0.5
                              : 1,
                        }}
                      >
                        Modify
                      </button>
                    </div>
                  </div>
                  <div className="column2">
                    <h3 className="heading-text mb-4">Booking Details</h3>
                    <div className="booking-info">
                      <div className="info-group mb-2">
                        <h4 className="booking-subtitle">Booking For</h4>
                        <p className="booking-info-text">
                          {bookingsIdWise?.guest_name}
                        </p>
                        <h4 className="booking-subtitle">Booking Of</h4>
                        <p className="booking-info-text">
                          {bookingsIdWise?.category?.category_name} -{" "}
                          {bookingsIdWise?.sub_category?.sub_category_name}
                        </p>
                      </div>
                      <div className="info-group">
                        <h4 className="booking-subtitle">Address</h4>
                        {bookingsIdWise?.category_id === 2 ? (
                          <>
                            <p className="booking-info-text">
                              <strong>From: </strong>
                              {bookingsIdWise?.address_from || "N/A"}
                            </p>
                            <p className="booking-info-text">
                              <strong>To: </strong>
                              {bookingsIdWise?.address_to || "N/A"}
                            </p>
                          </>
                        ) : (
                          <p className="booking-info-text">
                            {bookingsIdWise?.visit_address || "N/A"}
                          </p>
                        )}
                      </div>

                      {bookingsIdWise?.sub_category_id === 9 && (
                        <div className="info-group">
                          <h4 className="booking-subtitle">
                            Total Visiting Slots
                          </h4>
                          <p className="booking-info-text">
                            {bookingsIdWise?.gardener_visiting_slots
                              ? JSON.parse(
                                  bookingsIdWise.gardener_visiting_slots
                                ).length
                              : "N/A"}
                          </p>
                        </div>
                      )}
                      
                      <div className="info-group">
  <h4 className="booking-subtitle">
    {bookingsIdWise?.sub_category_id === 8
      ? "Number Of Hours Booked"
      : bookingsIdWise?.category_id === 2 ||
        bookingsIdWise?.sub_category_id === 9
      ? bookingsIdWise?.sub_category_id === 9
        ? "Gardener Visiting Slots"
        : "Number Of Hours Booked"
      : "Number of People"}
  </h4>
  <p className="booking-info-text">
    {bookingsIdWise?.sub_category_id === 8
      ? bookingsIdWise?.no_of_hours_booked
      : bookingsIdWise?.category_id === 2
      ? bookingsIdWise?.no_of_hours_booked
      : bookingsIdWise?.sub_category_id === 9
      ? bookingsIdWise?.gardener_visiting_slots &&
        JSON.parse(bookingsIdWise.gardener_visiting_slots).map(
          (slot, index) => {
            const formattedDate = new Date(slot.date).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            );
            return (
              <div key={index}>
                <strong>Date : </strong>
                {formattedDate},{" "}
                <strong>Approx Time :</strong> {slot.hours} mins
              </div>
            );
          }
        )
      : bookingsIdWise?.people_count}
  </p>
</div>


                      <div className="info-group">
                        {bookingsIdWise?.category_id !== 3 && (
                          <h4 className="booking-subtitle">
                            {bookingsIdWise?.category_id === 2
                              ? "Car Type"
                              : "Menu and Dishes"}
                          </h4>
                        )}

                        <p className="booking-info-text">
                          {bookingsIdWise?.category_id === 2
                            ? bookingsIdWise?.car_type // Show car type when category_id === 2
                            : bookingsIdWise?.sub_category_id === 3
                            ? bookingsIdWise?.menu?.map((item, index) => (
                                <span key={index}>
                                  {item.name}
                                  {index !== bookingsIdWise.menu.length - 1 &&
                                    ", "}
                                </span>
                              ))
                            : bookingsIdWise?.dishes?.map((dish, index) => (
                                <span key={index}>
                                  {dish}
                                  {index !== bookingsIdWise.dishes.length - 1 &&
                                    ", "}
                                </span>
                              ))}
                        </p>
                      </div>
                      {bookingsIdWise?.sub_category_id !== 9 && (
                        <div className="info-group">
                          <h4 className="booking-subtitle">Date & Time</h4>
                          <p className="booking-info-text">
                            {`${formatDate(
                              bookingsIdWise?.visit_date
                            )}, ${formatTime(bookingsIdWise?.visit_time)}`}
                          </p>
                        </div>
                      )}

                      {bookingsIdWise?.category_id !== 3 && (
                        <div className="info-group">
                          <h4 className="booking-subtitle">
                            Special Requests / Instructions
                          </h4>
                          <p className="booking-info-text">
                            {bookingsIdWise?.instructions?.trim()
                              ? bookingsIdWise.instructions
                              : "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="column3">
                    <h3 className="heading-text mb-4">Billing Details</h3>
                    <div className="billing-info">
                      <div className="billing-row">
                        <span className="billing-subtitle">Base Price</span>
                        <span className="billing-subtitle">
                          ₹{bookingsIdWise?.actual_price}
                        </span>
                      </div>
                      <div className="billing-row discount">
                        <span className="billing-subtitle">Discount</span>
                        <span className="billing-subtitle">
                          -₹{bookingsIdWise?.discount_amount}
                        </span>
                      </div>
                      <div className="billing-row">
                        <span className="billing-subtitle">Total</span>
                        <span className="billing-subtitle">
                          ₹{bookingsIdWise?.price}
                        </span>
                      </div>

                      {/* <div className="billing-row ">
                        <span className="billing-subtitle">Menu Price</span>
                        <span className="billing-subtitle">
                          ₹{bookingsIdWise?.menu_amount || 0}
                        </span>
                      </div> */}
                      <div className="billing-row">
                      <span className="billing-subtitle">All Taxes</span>
                      <span className="billing-subtitle">
                        ₹{bookingsIdWise?.all_taxes}
                      </span>
                      </div>
                      {bookingsIdWise?.category_id ==2 && (
                    <div className="billing-row">
                      <span className="billing-subtitle">Secure Fee</span>
                      <span className="billing-subtitle">
                        ₹{bookingsIdWise?.secure_fee}
                      </span>
                    </div>
                      )}
                      {/* <div className="billing-row">
                        <span className="billing-subtitle">Platform Fee</span>
                        <span className="billing-subtitle">
                          ₹{bookingsIdWise?.platform_fee}
                        </span>
                      </div> */}
                      {bookingsIdWise?.final_amount != 0 && (
  <div className="billing-row">
    <span className="billing-subtitle">Extra Charges</span>
    <span className="billing-subtitle">
      ₹{bookingsIdWise?.final_amount}
    </span>
  </div>
)}

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
                          {bookingsIdWise?.payment_mode === "cod"
                            ? "COD"
                            : bookingsIdWise?.payment_mode === "online"
                            ? "Online"
                            : bookingsIdWise?.payment_mode}
                        </span>
                      </div>

                      {bookingsIdWise?.payment_mode !== "online" && (
                        <>
                          {/*
                      
                      <button
                  className="payment-option-button mt-2 mb-2"
                  onClick={() => {
                    handlePayment("online", booking?.booking_id);
                    // setCallRazorPay(true); 
                  }}
                  
                  disabled={bookingsIdWise?.payment_mode === "online"}
                >
                  <div className="payment-option">
                    <div className="payment-icon">
                      <img src="/atm-card.png" alt="Card Icon" />
                    </div>
                    <div className="payment-details">
                      <h3>Pay using UPI, Cards</h3>
                      <p>Experience cashless bookings</p>
                    </div>
                    <div className="payment-arrow">→</div>
                  </div>
                </button> 
                
                */}
                        </>
                      )}

                      {callRazorPay && BookingData && (
                        <>
                          {/* {console.log("CallingGatewaydvnkegrfhyubjvdf")} */}
                          <RazorpayPayment
                            BookingData={BookingData}
                            callRazorPay={callRazorPay}
                            handleConfirmBooking={() => {
                              fetchUpcommingBookings();
                              handleViewMore(ActiveBookingData?.booking_id);
                            }}
                          />
                        </>
                      )}
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
                    <div className="service-info" style={{alignItems:"center"}}>
                      {booking?.category_id &&
                        React.createElement(
                          categoryIcons[booking.category_id],
                          // { className: "user-icon" }
                        )}
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
                        {booking?.partner_name || "No Partner Accepted"}
                      </p>
                    </div>

                    <div className="amount">₹{booking?.billing_amount}</div>
                  </div>

                  <div className="summary-actions">
                    <button
                      className="btn-modify"
                      onClick={() => {
                        handleModifyButton(booking);
                      }}
                      disabled={
                        booking?.partner_name ||
                        booking?.booking_status !== "upcoming"
                      }
                      style={{
                        cursor:
                          booking?.partner_name ||
                          booking?.booking_status === "cancelled"
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          booking?.partner_name ||
                          booking?.booking_status === "cancelled"
                            ? 0.5
                            : 1,
                      }}
                    >
                      Modify
                    </button>

                    <button
                      className="btn-view-details"
                      onClick={() => {
                        handleViewMore(booking?.booking_id);
                        setOpenBookingIndex(index);
                        setActiveBookingData(booking);
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
              sub_category_id={bookingsIdWise?.sub_category_id}
            />
            <ConfirmationModal
              isOpen={currentModal === "confirmation"}
              onClose={() => setCurrentModal("cancellation")}
              onConfirm={handleConfirmationNext}
              bookingId={bookingsIdWise}
            />
          </>
        )}

        {/* <MessageModal
          show={show}
          handleClose={handleClose}
          handleShow={handleShow}
          message={message}
        /> */}

        <SuccessModal
          isOpen={currentModal === "success" || currentModal === "error"}
          onClose={handleCloseModal}
          message={message}
          isSuccess={isSuccess} // Pass isSuccess flag
        />
      </div>
    </>
  );
};

export default UpcomingTab;
