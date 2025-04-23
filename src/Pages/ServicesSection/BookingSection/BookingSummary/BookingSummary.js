import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./BookingSummary.css";
import PaymentStep from "../PaymentStep/PaymentStep";

const BookingSummary = ({ bookingDetails, onClose }) => {
  const {
    bookingFor,
    address,
    people,
    menu,
    date,
    time,
    specialRequests,
    offers,
    total,
    discount,
    gst,
    grandTotal,
    additionalDetails,
  } = bookingDetails;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="booking-booking-form">
      <div className="booking-summary-header">
        <button onClick={onClose} className="booking-summary-back-button">
          <ChevronLeft size={24} />
        </button>
        <h2>Booking Summary</h2>
      </div>

      <h3 className="booking-summary-label">Booking Details</h3>
      <div className="booking-summary-details">
        <div className="booking-detail-card">
          <div>
            <strong>Booking For:</strong>
          </div>
          <div>jSDFhlkjsDHLKJFSDJFks</div>
        </div>
        <div className="booking-detail-card">
          <div>
            <strong>Address:</strong>
          </div>
          <div>ksdjfhksjdhfkjsdhf</div>
        </div>
        <div className="booking-detail-card">
          <div>
            <strong>Number of People:</strong>
          </div>
          <div>8</div>
        </div>
        <div className="booking-detail-card">
          <div>
            <strong>Menu and Dishes:</strong>
          </div>
          <div> {menu || "Not specified"}</div>
        </div>
        <div className="booking-detail-card">
          <div>
            <strong>Date & Time:</strong>
          </div>
          <div>
            {date} - {time}
          </div>
        </div>
        <div className="booking-detail-card">
          <div>
            <strong>Special Requests / Instructions:</strong>
          </div>{" "}
          <div>{specialRequests || "None"}</div>
        </div>
      </div>

      <div className="booking-summary-offers">
        <h3 className="booking-summary-label">Offers</h3>
        <div className="offers-card">
          <div>
            <p className="mb-0">{offers || "Get up to ₹100 off"}</p>
            <p className="mb-0 ml-2 text-sm">
              see all coupons
              <ChevronRight size={16} />
            </p>
          </div>
          <div>
            <button className="offer-apply-button">Apply</button>
          </div>
        </div>
      </div>

      <h3 className="booking-summary-label">Fare Breakdown</h3>
      <div className="fare-breakdown-section">
        <div className="fare-breakdown-card">
          <div className="fare-breakdown-div">
            <div className="fare-breakdown-title">Total:</div>
            <div>₹{total} </div>
          </div>
          <div className="fare-breakdown-div">
            <div className="fare-breakdown-title">Discount:</div>
            <div> -₹{discount}</div>
          </div>
          <div className="fare-breakdown-div">
            <div className="fare-breakdown-title">GST:</div>
            <div>₹{gst}</div>
          </div>
          <div className="fare-breakdown-div mt-1">
            <div className="fare-breakdown-title">
              {" "}
              <h5>Grand Total: </h5>
            </div>
            <div>
              <h5>₹{grandTotal}</h5>
            </div>
          </div>
          <div className="fare-saving-message-div">
            <p className="fare-saving-message text-center">
              Hurray! You saved ₹{discount} on the final bill
            </p>
          </div>
        </div>
      </div>

      <div className="additional-details mb-2">
        <h3 className="booking-summary-label">Additional Details</h3>
        <div className="details-item">
          <span className="mb-1">🌙 Night Surcharge Policy</span>
          <span className="mb-1">⏰ Timing: </span>
          <span className="mb-1">💵 Surcharge: </span>
        </div>
      </div>

      <div className="booking-summary-footer">
        <div className="estimated-fare">
          <h4>Estimated Fare</h4>
          <p>
            {" "}
            <h4>₹{grandTotal || 0} </h4>
          </p>
        </div>
        <button className="checkout-button" onClick={openModal}>
          Checkout
        </button>
      </div>

    </div>
  );
};

export default BookingSummary;
