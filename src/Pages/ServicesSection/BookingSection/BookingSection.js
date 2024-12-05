import React, { useEffect, useRef, useState } from "react";
import "./BookingSection.css";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import RazorpayPayment from "./RazorpayPayment";



const BookingSection = () => {

  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

    // Access the service object from the location state
    const { service } = location.state || {}; // Handle case where no state is passed
  


  const [menuOrServicesOptions, setmenuOrServicesOptions] = useState([]);
  const [menu, setMenu] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/menu_and_services/${service?.category_id}`);

        if(response?.data?.success === true){
        setmenuOrServicesOptions(response?.data?.data || []);
        }else{ setmenuOrServicesOptions([])}

      setLoading(false);

      } catch (error) {
        console.error("Error fetching restaurant locations:", error);
        setmenuOrServicesOptions([]);
      setLoading(false);

      }
    };
    fetchData();
  }, []);





  const [BookingForGuestName, setBookingForGuestName] = useState("");


  const [step, setStep] = useState(1); // Manage the current step

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    // Get today's date and format it as MM-DD-YYYY
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format
    setSelectedDate(formattedDate); // Set default selected date as today
  }, []);

  const currentTime = new Date().toISOString().slice(0, 16); // Get the current time in 'HH:MM' format


  const [people, setPeople] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");


  const additionalDetails = {
    surchargeTiming: "10:00 PM - 6:00 AM",
    surchargeRate: "20%",
  };

  const cancellationPolicy = {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  };



  // step 3 constants


  const [selectedLocation, setSelectedLocation] = useState({
    address: "Connaught Place, Rajiv Chowk, New Delhi, Delhi, 110001",
    lat: 28.6289,
    lng: 77.2065,
  });
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);

  // step 4
  const [addressForm, setAddressForm] = useState({
    city: "Delhi", // Default city
    area: "Connaught Place", // Hardcoded area
    society: "Connaught Plaza", // Hardcoded society or locality
    houseNo: "12B", // Hardcoded house number
    landmark: "Near Metro Station", // Hardcoded landmark
  });
  

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setStep(2); // Move to Step 2
  };


  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleCheckboxChange = (id) => {
    if (menu.includes(id)) {
      setMenu(menu.filter((item) => item !== id));
    } else {
      setMenu([...menu, id]);
    }
  };




  const validateFieldsStepOne = (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
  
    // Check if all the required fields are filled
    if (
      BookingForGuestName === "" ||
      selectedDate === "" || // If date is not selected
      selectedTime === "" || // If time is not selected
      people <= 0 || // If the number of people is not valid (less than 1)
      menu.length === 0  || // If no menu is selected
      specialRequests === ""
    ) {
      alert("Please fill all fields.");
      return;
    } else {
      // If all fields are filled, call the nextStep function
      nextStep();
    }
  };
  

  const handleChangeAddressValues = (e) => {
    const { name, value } = e.target;
    setAddressForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  

// Assuming you have values for people, service price, discount, and GST
const total = people * (service?.price || 0); // Base total
const discount = 0; // Discount value
const gst = 0; // GST value

const grandTotal = total - discount + gst; // Final Grand Total





const [callRazorPay, setCallRazorPay] = useState(false);
const [BookingData, setBookingData] = useState();


const handlePayment = async (mod) => {




  try {


    const body = {
      booking: {
        category_id: service?.category_id,
        sub_category_id: service?.id,
        visit_date: selectedDate, // Using the selectedDate as per your context
        visit_time: (() => {
          if (selectedTime) {
            const timeParts = selectedTime.match(/(\d{1,2}):(\d{2})/); // Match hours and minutes
            if (timeParts) {
              let hours = parseInt(timeParts[1], 10);
              const minutes = parseInt(timeParts[2], 10);

              // If the time is less than 12:00, convert it to 24-hour format
              if (hours < 12) {
                hours = hours + 12; // Add 12 for PM conversion
              }

              // Format hours and minutes to ensure they are two digits
              const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`; // Add seconds as `00`
              return formattedTime;
            }
          }
          return "00:00:00"; // Default fallback time if no time is provided
        })(),
        visit_address_id: 1, // Assuming a constant value here
        address_from: "", // Empty for now, can be updated based on your form inputs
        address_to: "", // Empty for now, can be updated based on your form inputs
        number_of_people: people, // Assuming `people` variable holds the number of people
        instructions: specialRequests || "", // Special requests if provided, otherwise empty string
        payment_mode: mod, // Payment method passed as parameter (either "cod" or "online")
        menu_and_service_ids: menu || [], // Assuming `menu` holds the selected menu and services as an array
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
      } else {
        setBookingData();
        setCallRazorPay(false);
      }

      if (mod === "cod") {

        // toast.info("Please confirm your booking to proceed.");

        nextStep(true);

      }
    } else {
      // toast.error(response.data.error_msg || "Please try again.");
      // setModalMessage(response.data.error_msg || "Please try again.");
      // setShowModal(true);
    }
  } catch (error) {
    setLoading(false);
    console.error("Error:", error);
    // toast.error("An error occurred. Please try again later.");
    // setModalMessage("An error occurred. Please try again later.");
  }



};








  return (


    <>
    {loading && <Loader />}


    <div className="container nav-container booking-booking-container">
      {step === 1 && (
        <div className="booking-booking-form"
        //  onSubmit={handleSubmitForm}
         >
          <div className="booking-form-header">
            <button className="booking-back-button">←</button>
            <h2 className="booking-form-title">Booking</h2>
          </div>

          <form>





          <div className="booking-form-group">
        <label className="booking-form-label" htmlFor="guestName">
          Enter Booking Guest Name
        </label>
        <input
          type="text"
          id="guestName"
          name="guestName"
          placeholder="Booking Guest Name"
          value={BookingForGuestName} // Controlled component value
          onChange={(e) => setBookingForGuestName(e.target.value)} // Updates the selected date
      
        />
      </div>










          <div className="booking-form-group">
        <label className="booking-form-label" htmlFor="visit-date">
          Select Visit Date
        </label>
        <input
          type="date"
          id="visit-date"
          name="visit-date"
          value={selectedDate} // Controlled component value
          onChange={(e) => setSelectedDate(e.target.value)} // Updates the selected date
          min={new Date().toISOString().split("T")[0]} // Disable past dates
          style={{
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>






      <div className="booking-form-group">
        <label className="booking-form-label" htmlFor="time-input">
          Select Time of Visit
        </label>
        <input
          type="time"
          id="time-input"
          name="visit-time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)} // Updates the selected time
          min={selectedDate === new Date().toISOString().split("T")[0] ? currentTime.slice(11) : "00:00"} // Disable past times if today's date is selected
          style={{
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>


      <div className="booking-form-group">
      <label className="booking-form-label">Number of People</label>
      <div className="booking-counter-container">
        <button
          type="button"
          className="booking-counter-button"
          onClick={() => setPeople(Math.max(1, people - 1))} // Ensure people never go below 1
        >
          -
        </button>
        <span className="booking-counter-value">{people}</span>
        <button
          type="button"
          className="booking-counter-button"
          onClick={() => setPeople(people + 1)} // Increment people
        >
          +
        </button>
      </div>
      <div className="booking-cooking-time">
        Total cooking time: 3.5 hours
      </div>
    </div>









    <div className="booking-form-group" style={{ position: "relative" }}>
      <label className="booking-form-label">Select Menu / Service (Optional)</label>

      {/* Dropdown container */}
      <div
        className="dropdown-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px", // Reduce gap between elements
        }}
      >
        {/* Toggle to open dropdown */}
        <div
          className="dropdown-input"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            cursor: "pointer",
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%", // Full width for better alignment
          }}
        >
          {menu.length > 0
            ? `Selected: ${menuOrServicesOptions
                .filter((option) => menu.includes(option.id))
                .map((option) => option.name)
                .join(", ")}`
            : "Select a service"}
          <span>{isDropdownOpen ? "▲" : "▼"}</span>
        </div>

        {/* Dropdown options list */}
        {isDropdownOpen && (
          <div
            className="dropdown-options"
            style={{
              position: "absolute",
              top: "100%", // Place the dropdown directly below the input
              left: 0,
              right: 0,
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "white",
              width: "100%", // Match the width of the input
              maxHeight: "200px",
              overflowY: "auto",
              zIndex: 10,
              padding: "0", // Remove padding to reduce space
            }}
          >
            {menuOrServicesOptions.map((option) => (
              <div
                key={option.id}
                className="dropdown-option"
                style={{
                  padding: "8px",
                  display: "flex", // Align checkbox and label on the same line
                  alignItems: "center", // Center the checkbox and text vertically
                  gap: "8px", // Add space between checkbox and text
                }}
              >
                <input
                  type="checkbox"
                  id={`service-${option.id}`}
                  value={option.id}
                  checked={menu.includes(option.id)}
                  onChange={() => handleCheckboxChange(option.id)}
                  style={{
                    margin: 0, // Remove any margin around the checkbox
                  }}
                />
                <label htmlFor={`service-${option.id}`} style={{ margin: 0 }}>
                  {option.name} {/* Using the 'name' property from the API */}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>









            <div className="booking-form-group">
              <label className="booking-form-label">
                Special Requests / Instructions (Optional)
              </label>
              <input
                className="booking-textarea"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Enter Your Special Request"
              />
            </div>

            <div className="additional-details">
              <h3>Additional Details</h3>
              <div className="details-item">
                <span className="mb-1">🌙 Night Surcharge Policy</span>
                <span className="mb-1">
                  ⏰ Timing: {additionalDetails.surchargeTiming}
                </span>
                <span className="mb-1">
                  💵 Surcharge: {additionalDetails.surchargeRate}
                </span>
              </div>
            </div>

            <div className="cancellation-policy">
              <h3>Cancellation Policy</h3>
              <div className="cancellation-policy-div">
                <p>{cancellationPolicy.text}</p>
                <a href="#" className="read-policy-button">
                  READ CANCELLATION POLICY
                </a>
              </div>
            </div>

            <div className="payable-amount-section">
            <p className="payable-amount">
  ₹ {total} <br />
  Payable Amount
</p>

              <button
                type="submit"
                className="continue-button"
                // onClick={nextStep}
                onClick={validateFieldsStepOne}

              >
                Continue
              </button>
            </div>
          </form>



        </div>
      )}














      {step === 2 && (
        <div className="location-container">
          <div className="location-content">
            <h2 className="location-title">Select Booking Location</h2>

            <div className="address-card">
              <div className="address-icon">📍</div>
              <div className="address-text">
                123 Connaught Place, Rajiv Chowk, New Delhi, Delhi, 110001
              </div>
            </div>

            <button className="add-address-link" onClick={nextStep}>
              Add New Address
            </button>

            {/* This button now sets the step to 5 */}
            <button
              className="confirm-address-button"
              onClick={() => setStep(5)}
            >
              Confirm Address
            </button>
          </div>
        </div>
      )}














      {step === 3 && (
        <div className="add-location-container">
          <div className="add-location-content">
            <div className="add-location-header">
              <button className="back-button" onClick={prevStep}>
                ←
              </button>
              <h2 className="header-title">Confirm Booking Location</h2>
            </div>

            <div className="search-container">
              <input
                ref={searchBoxRef}
                type="text"
                placeholder="Search your location"
                className="search-input"
              />
            </div>

            <div className="map-container" ref={mapRef}></div>

            <div className="location-selection">
              <h3 className="selection-title">Selected Location</h3>
              <div className="address-card">
                <div className="address-marker">📍</div>
                <div className="address-text">{selectedLocation.address}</div>
              </div>
              <button className="add-address-button" onClick={nextStep}>
                Confirm and Add Address
              </button>
            </div>
          </div>
        </div>
      )}












      {step === 4 && (
        <div className="address-step-container">
          <div className="address-step-content">
            <div className="address-step-header">
              <button className="address-back-button" onClick={prevStep}>
                ←
              </button>
              <h2 className="address-header-title">Confirm Booking Location</h2>
            </div>

            <div className="map-preview-container">
              <div className="search-bar-container">
                <input
                  type="text"
                  placeholder="Search your location"
                  className="search-bar-input"
                />
                <button className="search-bar-button">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
            </div>


            <div className="address-step-form-section">
  <h3 className="form-section-title">Select Booking Location</h3>
  <form className="address-step-form">
    <input
      type="text"
      name="city"
      value={addressForm.city}
      onChange={handleChangeAddressValues} // Calls the handleChangeAddressValues function
      className="address-step-input"
      placeholder="Delhi"
    />
    <input
      type="text"
      name="area"
      value={addressForm.area}
      onChange={handleChangeAddressValues} // Calls the handleChangeAddressValues function
      className="address-step-input"
      placeholder="Area"
      required
    />
    <input
      type="text"
      name="society"
      value={addressForm.society}
      onChange={handleChangeAddressValues} // Calls the handleChangeAddressValues function
      className="address-step-input"
      placeholder="Society / Locality / Colony"
      required
    />
    <input
      type="text"
      name="houseNo"
      value={addressForm.houseNo}
      onChange={handleChangeAddressValues} // Calls the handleChangeAddressValues function
      className="address-step-input"
      placeholder="House no. / Flat no. / Building"
      required
    />
    <input
      type="text"
      name="landmark"
      value={addressForm.landmark}
      onChange={handleChangeAddressValues} // Calls the handleChangeAddressValues function
      className="address-step-input"
      placeholder="Landmark"
    />
    <button
      type="button"  // Ensure it's a button and doesn't submit the form automatically
      onClick={nextStep}
      className="address-step-confirm-button"
    >
      Confirm Address
    </button>
  </form>
</div>









          </div>
        </div>
      )}

      {step === 5 && (
        <div className="booking-booking-form">
          <div className="booking-summary-header">
            <button onClick={prevStep} className="booking-summary-back-button">
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
              <div>{BookingForGuestName}</div>
            </div>
            <div className="booking-detail-card">
  <div>
    <strong>Address:</strong>
  </div>
  <div>{`${addressForm.houseNo}, ${addressForm.society}, ${addressForm.area}, ${addressForm.city}, ${addressForm.landmark}`}</div>
</div>

            <div className="booking-detail-card">
              <div>
                <strong>Number of People:</strong>
              </div>
              <div>{people}</div>
            </div>
            <div className="booking-detail-card">
              <div>
              <div className="selected-services">
  <strong>Menu / Services : </strong> 
  {menu.length > 0
    ? menuOrServicesOptions
        .filter((option) => menu.includes(option.id)) // Filter selected services based on IDs
        .map((option) => option.name) // Extract names of selected services
        .join(", ") // Join names with commas
    : "No menu selected"}
</div>

              </div>
        
            </div>
            <div className="booking-detail-card">
              <div>
              <strong>Date & Time:</strong> {format(new Date(selectedDate), 'dd MMM yyyy')}, {format(new Date(`2024-12-12T${selectedTime}:00`), 'hh:mm a')}
              </div>
              <div></div>
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
                <p className="mb-0">{"Get up to ₹100 off"}</p>
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
    <div> ₹ {total} </div>
  </div>
  <div className="fare-breakdown-div">
    <div className="fare-breakdown-title">Discount:</div>
    <div> -₹ {discount}</div>
  </div>
  <div className="fare-breakdown-div">
    <div className="fare-breakdown-title">GST:</div>
    <div>+₹ {gst}</div>
  </div>
  <div className="fare-breakdown-div mt-1">
    <div className="fare-breakdown-title">
      <h5>
        Grand Total: 
     
      </h5>
    </div>
    <div>
      <h5>₹ {grandTotal}</h5>
    </div>
  </div>
  <div className="fare-saving-message-div">
    <p className="fare-saving-message text-center">
      Hurray! You saved ₹ {discount} on the final bill
    </p>
  </div>
</div>




          </div>

          <div className="additional-details">
              <h3>Additional Details</h3>
              <div className="details-item">
                <span className="mb-1">🌙 Night Surcharge Policy</span>
                <span className="mb-1">
                  ⏰ Timing: {additionalDetails.surchargeTiming}
                </span>
                <span className="mb-1">
                  💵 Surcharge: {additionalDetails.surchargeRate}
                </span>
              </div>
            </div>

          <div className="booking-summary-footer">
            <div className="estimated-fare">
              <h4>Estimated Fare</h4>
              <p>
                {" "}
                <h4>₹{grandTotal} </h4>
              </p>
            </div>
            <button className="checkout-button"
             onClick={nextStep}
             >
              Checkout
            </button>
          </div>
        </div>
      )}



      {step === 6 && (
        <div className="payment-section-container">
          <div className="flex-fill payment-section-main-div">
            <div className="payment-section-header">
              <h2 className="payment-title">Payment</h2>

              <button
                className="payment-close-button"
                onClick={prevStep}
                aria-label="Close payment section"
              >
                ✖
              </button>
            </div>
            <div className="payment-section-body">
              <p>Complete your payment to confirm the booking.</p>
              <div className="payment-options">
                <button className="payment-action-button"
          onClick={() => { handlePayment("online"); setCallRazorPay(true); }}
                 >
                  Pay Now
                </button>
                <button className="payment-action-button" 
            onClick={() => { handlePayment("cod"); setCallRazorPay(false); }}
                >
                  Pay Later
                </button>
              </div>
            </div>
          </div>
        </div>



      )}



{ callRazorPay && BookingData &&  (
  <RazorpayPayment
    BookingData={BookingData}
    callRazorPay={callRazorPay}
    handleConfirmBooking={nextStep}
  />
)}






      {step === 7 && (
        <div className="success-container">
          <div className="success-content">
            <div className="checkmark-circle">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h2 className="success-title">Booking Successful!</h2>

            <p className="success-message">
              Your booking is currently awaiting confirmation from the service
              provider. We'll update you as soon as it's accepted!
            </p>

            <button className="btn back-home-btn">Back to Home</button>
          </div>
        </div>
      )}

      <div className="booking-illustration-section">
        <h1 className="booking-page-title"># Lorem ipsum dolor sit</h1>
        <h2 className="booking-main-title">LOREM IPSUM</h2>
        <img
          src="./../ServicesSection/modify-booking.jpg"
          alt="Chef illustration"
          className="booking-illustration"
        />
      </div>
    </div>
    </>
  );
};

export default BookingSection;
