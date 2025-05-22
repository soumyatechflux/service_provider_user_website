import React, { useEffect, useState } from "react";
import { Star, Clock, User, Trophy, ChefHat, Car, Leaf } from "lucide-react";
import "./PreviousTab.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../../Loader/Loader";
import ReviewModal from "../ReviewModal/ReviewModal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CustomerInvoiceData from "../../Invoice/CustomerInvoiceData";
import { pdf } from '@react-pdf/renderer';
import PartnerInvoiceData from "../../Invoice/PartnerInvoiceData";


function PreviousTab() {
  const [openBookingIndex, setOpenBookingIndex] = useState(null);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [bookingsIdWise, setBookingIdwise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false); // Modal state
  const token = sessionStorage.getItem("ServiceProviderUserToken");

  const navigate = useNavigate();
  const bookingId = bookingsIdWise?.booking_id; // Example, replace with actual bookingId

  const handleModifyButton = () => {
    navigate("/my-profile");
  };

  const handleDownloadInvoice = async (data) => {
    if (!data) return;
  
    // Always download Customer Invoice
    const customerBlob = await pdf(<CustomerInvoiceData data={data} />).toBlob();
    const customerUrl = URL.createObjectURL(customerBlob);
    
    const customerLink = document.createElement('a');
    customerLink.href = customerUrl;
    customerLink.download = `Invoice-${data.invoice_number_customer || data.id}.pdf`;
    customerLink.click();
  
    // Only download Partner Invoice if status is "completed"
    if (data.booking_status === "completed") {
      const partnerBlob = await pdf(<PartnerInvoiceData data={data} />).toBlob();
      const partnerUrl = URL.createObjectURL(partnerBlob);
      
      const partnerLink = document.createElement('a');
      partnerLink.href = partnerUrl;
      partnerLink.download = `Invoice-${data.invoice_number_partner || data.id}.pdf`;
      partnerLink.click();
      
      URL.revokeObjectURL(partnerUrl);
    }
  
    // Cleanup
    URL.revokeObjectURL(customerUrl);
  };

  const handleViewMore = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/bookings/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Previous Booking response", response);
      console.log(response.status);
      if (response.status === 200 && response.data.success === true) {
        console.log("response.data.data", response.data.data);
        setBookingIdwise(response.data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleRatingButtonClick = () => {
    setIsRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  const handleHelpCentreButtonClick = (bookingId, subCategoryName) => {
    navigate("/help-centre", {
      state: {
        booking_id: bookingId,
        sub_category_name: subCategoryName,
      },
    });
  };

  useEffect(() => {
    const fetchPreviousBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/previous_bookings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Previous Booking response", response);
        console.log(response.status);
        if (response.status === 200 && response.data.success === true) {
          console.log("response.data.data", response.data.data);
          setPreviousBookings(response.data.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousBookings();
  }, []);

  if (loading) {
    return <Loader />;
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

    // Format the time with hour, minute, and AM/PM
    const formattedTime = date.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Convert the AM/PM part to uppercase
    return formattedTime.replace(/(am|pm)/, (match) => match.toUpperCase());
  };
  const categoryIcons = {
    1: ChefHat,
    2: Car,
    3: Leaf,
  };

  return (
    <div className="booking-container">
      {previousBookings.length === 0 ? ( // Show message if no previous bookings
        <div className="no-bookings-message">
          <h3>No previous bookings</h3>
        </div>
      ) : (
        previousBookings.map((booking, index) => (
          <div key={index} className="booking-item">
            {openBookingIndex === index ? (
              // Detailed View
              <div className="booking-details mt-3 mb-3">
                <div className="column1">
                  <div className="details-header">
                    <h2 className="details-head">
                      {formatDate(bookingsIdWise?.visit_date)} at{" "}
                      {formatTime(bookingsIdWise?.visit_time)}
                    </h2>

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
                              {bookingsIdWise?.partner?.years_of_experience} yrs
                              of exp.
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    {!bookingsIdWise?.partner?.name && (
                      <p>No Partner Accepted</p>
                    )}
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
                          {bookingsIdWise?.gardener_monthly_subscription
                            ? (() => {
                                const subscription = JSON.parse(
                                  bookingsIdWise.gardener_monthly_subscription
                                );
                                const visitText = `${subscription.visit} ${
                                  subscription.visit > 1 ? "visits" : "visit"
                                }`;
                                const hours = Math.floor(
                                  subscription.hours / 60
                                );
                                const minutes = subscription.hours % 60;
                                const timeText = `${
                                  hours
                                    ? `${hours} hr${hours > 1 ? "s" : ""}`
                                    : ""
                                } ${
                                  minutes
                                    ? `${minutes} min${minutes > 1 ? "s" : ""}`
                                    : ""
                                }`;
                                return `${visitText} lasting ${timeText} per visit`;
                              })()
                            : "N/A"}
                        </p>
                      </div>
                    )}
                    <div className="info-group">
                      <h4 className="booking-subtitle">
                        {bookingsIdWise?.sub_category_id === 8
                          ? "Visit Time"
                          : bookingsIdWise?.category_id === 2 ||
                            bookingsIdWise?.sub_category_id === 9
                          ? bookingsIdWise?.sub_category_id === 9
                            ? "Gardener Visiting Slots"
                            : "Number Of Hours Booked"
                          : "Number of People"}
                      </h4>
                      <p className="booking-info-text">
                        {bookingsIdWise?.sub_category_id === 8
                          ? new Date(
                              `1970-01-01T${bookingsIdWise?.visit_time}`
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true, // Ensures AM/PM format
                            })
                          : bookingsIdWise?.category_id === 2
                          ? bookingsIdWise?.no_of_hours_booked
                          : bookingsIdWise?.sub_category_id === 9
                          ? bookingsIdWise?.gardener_visiting_slots &&
                            JSON.parse(
                              bookingsIdWise.gardener_visiting_slots
                            ).map((slot, index) => {
                              const formattedDate = new Date(
                                slot.date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              });
                              return (
                                <div key={index}>
                                  <strong>Date : </strong>
                                  {formattedDate}
                                </div>
                              );
                            })
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

                      {/* <p className="booking-info-text">
                        {bookingsIdWise?.category_id === 2 ? (
                          bookingsIdWise?.car_type // Show car type when category_id === 2
                        ) : bookingsIdWise?.sub_category_id === 3 ? (
                          bookingsIdWise?.menu?.length > 0 ? (
                            bookingsIdWise?.menu?.map((item, index) => (
                              <span key={index}>
                                {item.name}
                                {index !== bookingsIdWise.menu.length - 1 &&
                                  ", "}
                              </span>
                            ))
                          ) : (
                            <span>No menu items selected</span>
                          )
                        ) : bookingsIdWise?.category_id !== 3 &&
                          bookingsIdWise?.dishes?.length > 0 ? (
                          bookingsIdWise?.dishes?.map((dish, index) => (
                            <span key={index}>
                              {dish}
                              {index !== bookingsIdWise.dishes.length - 1 &&
                                ", "}
                            </span>
                          ))
                        ) : bookingsIdWise?.category_id !== 3 ? (
                          <span>No Dishes Selected</span>
                        ) : null}
                      </p> */}


                      <p className="booking-info-text">
                        {bookingsIdWise?.category_id === 2 ? (
                          bookingsIdWise?.car_type // Show car type when category_id === 2
                        ) : bookingsIdWise?.sub_category_id === 3 ? (
                          bookingsIdWise?.menu?.length > 0 ? (
                            bookingsIdWise?.menu?.map((item, index) => (
                              <span key={index}>
                                {item.name}-{item.quantity}
                                {index !== bookingsIdWise.menu.length - 1 && <br />}
                              </span>
                            ))
                          ) : (
                            <span>No menu items selected</span>
                          )
                        ) : bookingsIdWise?.category_id !== 3 &&
                          bookingsIdWise?.dishes?.length > 0 ? (
                          bookingsIdWise?.dishes?.map((dish, index) => (
                            <span key={index}>
                              {dish}
                              {index !== bookingsIdWise.dishes.length - 1 && ", "}
                            </span>
                          ))
                        ) : bookingsIdWise?.category_id !== 3 ? (
                          <span>No Dishes Selected</span>
                        ) : null}
                      </p>
                    </div>

                    {bookingsIdWise?.category_id == 2 && (
                      <div className="info-group">
                        <h4 className="booking-subtitle">Transmission Type</h4>
                        <p className="booking-info-text">
                          {bookingsIdWise?.transmission_type}
                        </p>
                      </div>
                    )}

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

                    {/* {bookingsIdWise?.category_id == 2 && (
                      <div className="info-group">
                        <h4 className="booking-subtitle">Transmission Type</h4>
                        <p className="booking-info-text">
                          {bookingsIdWise?.transmission_type}
                        </p>
                      </div>
                    )} */}

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
                  </div>
                </div>
                <div className="column3">
                  <h3 className="heading-text mb-4">Billing Details</h3>
                  <div className="billing-info">
                    <div className="billing-row">
                      <span className="billing-subtitle">Amount</span>
                      <span className="billing-subtitle">
                        ₹{bookingsIdWise?.actual_price}
                      </span>
                    </div>

                    <div className="billing-row">
                      <span className="billing-subtitle">Taxes and Fees</span>
                      <span className="billing-subtitle">
                        ₹{bookingsIdWise?.all_taxes}
                      </span>
                    </div>

                    {bookingsIdWise?.secure_fee > 0 && (
                      <div className="billing-row">
                        <span className="billing-subtitle">Secure Fee</span>
                        <span className="billing-subtitle">
                          ₹{bookingsIdWise?.secure_fee}
                        </span>
                      </div>
                    )}

                    {bookingsIdWise?.night_charge > 0 && (
                      <div className="billing-row">
                        <span className="billing-subtitle">Night Charges</span>
                        <span className="billing-subtitle">
                          ₹{bookingsIdWise?.night_charge}
                        </span>
                      </div>
                    )}

                    <div className="billing-row discount">
                      <span className="billing-subtitle">Discount</span>
                      <span className="billing-subtitle">
                        -₹{bookingsIdWise?.discount_amount}
                      </span>
                    </div>

                    {bookingsIdWise?.extra_charge != 0 && (
                      <div className="billing-row">
                        <span className="billing-subtitle">Extra Charges</span>
                        <span className="billing-subtitle">
                          {/* ₹{bookingsIdWise?.extra_charge} */}₹
                          {bookingsIdWise?.extra_charge}
                        </span>
                      </div>
                    )}

                    {bookingsIdWise?.due_payments > 0 && (
                      <div className="billing-row">
                        <span className="billing-subtitle">
                          Cancellation Charges Due Amount
                        </span>
                        <span className="billing-subtitle">
                          +₹{bookingsIdWise?.due_payments}
                        </span>
                      </div>
                    )}

                    {/* {bookingsIdWise?.use_points_amount > 0 && (
                      <div className="billing-row">
                        <span className="billing-subtitle">Reward Points</span>
                        <span className="billing-subtitle">
                          -₹{bookingsIdWise?.use_points_amount}
                        </span>
                      </div>
                    )} */}

                    {bookingsIdWise?.use_points > 0 && bookingsIdWise?.use_points_amount > 0 && (
  <div className="billing-row">
    <span className="billing-subtitle">Reward Points</span>
    <span className="billing-subtitle">
      -₹{bookingsIdWise?.use_points_amount}
    </span>
  </div>
)}

                    <div className="billing-row total">
                      <span className="billing-subtitle text-bold">
                        Total Amount
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
                  </div>
                  {/* {bookingsIdWise?.booking_status === "completed" ? (
                    <div>
                      <button
                        className="rating-button"
                        onClick={() =>
                          handleHelpCentreButtonClick(
                            bookingsIdWise.booking_id,
                            bookingsIdWise?.sub_category?.sub_category_name
                          )
                        }
                      >
                        Raise a Ticket
                      </button>

                      <button
                        className="rating-button"
                        onClick={handleRatingButtonClick}
                      >
                        Give Rating to Partner
                      </button>
                    </div>
                  ) : (
                    <button className="rating-button disabled" disabled>
                      Rating Unavailable
                    </button>
                  )}
 {bookingsIdWise && Object.keys(bookingsIdWise).length > 0 ? (
  <PDFDownloadLink
  document={<InvoiceData data={bookingsIdWise} />}
  fileName={`Invoice-${bookingsIdWise.booking_id || bookingsIdWise.id}.pdf`}
  style={{ textDecoration: 'none' }}
>
  {({ blob, url, loading, error }) => (
    <button className="rating-button">
      {loading ? 'Generating Invoice...' : 'Download Invoice'}
    </button>
  )}
</PDFDownloadLink>

) : (
  <button className="rating-button" disabled>
    Download Invoice
  </button>
)} */}



{/* {(bookingsIdWise?.booking_status === "completed" || bookingsIdWise?.booking_status === "cancelled") && (
  <div>
    {bookingsIdWise?.booking_status === "completed" && (
      <>
        <button
          className="rating-button"
          onClick={() =>
            handleHelpCentreButtonClick(
              bookingsIdWise.booking_id,
              bookingsIdWise?.sub_category?.sub_category_name
            )
          }
        >
          Raise a Ticket
        </button>

        <button
          className="rating-button"
          onClick={handleRatingButtonClick}
        >
          Give Rating to Partner
        </button>
      </>
    )}

    {bookingsIdWise && Object.keys(bookingsIdWise).length > 0 && (
      <button
        className="rating-button"
        onClick={() => handleDownloadInvoice(bookingsIdWise)}
      >
        Download Invoice
      </button>
    )}
  </div>
)} */}


{(bookingsIdWise?.booking_status === "completed" || bookingsIdWise?.booking_status === "cancelled") && (
  <div>
    {bookingsIdWise?.booking_status === "completed" && (
      <>
        <button
          className="rating-button"
          onClick={() =>
            handleHelpCentreButtonClick(
              bookingsIdWise.booking_id,
              bookingsIdWise?.sub_category?.sub_category_name
            )
          }
        >
          Raise a Ticket
        </button>

        <button
          className="rating-button"
          onClick={handleRatingButtonClick}
        >
          Give Rating to Partner
        </button>
      </>
    )}

    {bookingsIdWise && Object.keys(bookingsIdWise).length > 0 &&
      !(
        bookingsIdWise.booking_status === "cancelled" &&
        bookingsIdWise.cancel_charge_amount === "0.00"
      ) && (
        <button
          className="rating-button"
          onClick={() => handleDownloadInvoice(bookingsIdWise)}
        >
          Download Invoice
        </button>
      )}
  </div>
)}

{bookingsIdWise?.booking_status !== "completed" &&
 bookingsIdWise?.booking_status !== "cancelled" && (
  <div>
    <button className="rating-button disabled" disabled>
      Rating Unavailable
    </button>
  </div>
)}


          
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
                  <div
                    className="service-info"
                    style={{ alignItems: "center" }}
                  >
                    {booking?.category_id &&
                      React.createElement(categoryIcons[booking.category_id], {
                        // className: "user-icon",
                      })}
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
                          : booking?.booking_status === "completed"
                          ? "green"
                          : "inherit",
                    }}
                  >
                    <span
                      className="status-dot"
                      style={{
                        backgroundColor:
                          booking?.booking_status === "cancelled"
                            ? "red"
                            : booking?.booking_status === "completed"
                            ? "green"
                            : "transparent",
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
      <ReviewModal
        isOpen={isRatingModalOpen}
        onClose={handleCloseRatingModal}
        partnerId={bookingsIdWise?.partner?.id}
        categoryId={bookingsIdWise?.category?.id}
        bookingId={bookingsIdWise?.booking_id || bookingsIdWise?.id}
      />
    </div>
  );
}

export default PreviousTab;
