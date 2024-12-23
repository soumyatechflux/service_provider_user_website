import React, { useEffect, useRef, useState } from "react";
import "./BookingSection.css";
import { ChevronLeft, ChevronRight, Loader, MapPin } from "lucide-react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import RazorpayPayment from "./RazorpayPayment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { ArrowBarDown } from "react-bootstrap-icons";
import EditAddressForm from "../../ProfilePage/ProfileDetails/EditAddressForm/EditAddressForm";
import { Dropdown, Modal } from "react-bootstrap";
import AddAddressForm from "../../ProfilePage/ProfileDetails/AddAddressForm/AddAddressForm";
import { BsThreeDotsVertical } from "react-icons/bs";
import MessageModal from "../../MessageModal/MessageModal";
import { IoIosArrowForward } from "react-icons/io";

const BookingSection = () => {
  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = location.state || {}; // Handle case where no state is passed
  const [menuOrServicesOptions, setmenuOrServicesOptions] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [showGrid, setShowGrid] = useState(false);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isAddingAddress, setIsAddingAddress] = useState(false); // New state for address form
  const [addressToEdit, setAddressToEdit] = useState(null); // Track the address being edited
  const [isEditingAddress, setIsEditingAddress] = useState(false); // State for editing address modal
  const [makeDisable, setMakeDisable] = useState(false);

  const [addresses, setAddresses] = useState([]);

  const cancelAddAddress = () => {
    setNewAddress({
      houseNumber: "",
      streetAddress: "",
      streetAddressLine: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    });
    setIsAddingAddress(false);
  };

  const [newAddress, setNewAddress] = useState({
    houseNumber: "",
    streetAddress: "",
    streetAddressLine: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });



  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

    
      if (response?.status && response?.data?.success) {
        const data = response?.data?.data;
   
        setAddresses(data?.address);
        if (data?.address?.length > 0) {
          setSelectedLocation(data?.address[0]);
        }


      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);










  const dummyTimeSlots = Array(12)
    .fill()
    .map((_, index) => {
      const hours = Math.floor(index / 4);
      const minutes = index % 2 === 0 ? "00" : "30";
      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    });

  const handleDropdownClick = () => {
    setShowGrid(!showGrid);
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setShowGrid(false); // Close the grid after selection
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/menu_and_services/${service?.category_id}`
        );

        if (response?.data?.success === true) {
          setmenuOrServicesOptions(response?.data?.data || []);
        } else {
          setmenuOrServicesOptions([]);
        }
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
  // const [selectedTime, setSelectedTime] = useState("");

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
  });


  
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);



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
      selectedDate === "" ||
      selectedTime === "" ||
      people <= 0
      // || menu.length === 0
    ) {

      // alert("Please fill all required fields.");
      setMessage("Please fill all required fields.");
        setShow(true);
        handleShow(); // Show the modal
      return;
    }

    // Special Requests field is optional, no validation needed for it

    // If all required fields are filled, call the nextStep function
    nextStep();
  };

  const handleChangeAddressValues = (e) => {
    const { name, value } = e.target;
    // setAddressForm((prevState) => ({
    //   ...prevState,
    //   [name]: value,
    // }));
  };

  // Assuming you have values for people, service price, discount, and GST
  const total = people * (service?.price || 0);
  // const total = service?.price || 0;

  const discount = 0; // Discount value
  const gst = 0; // GST value

  const grandTotal = total - discount + gst; // Final Grand Total

  const [callRazorPay, setCallRazorPay] = useState(false);
  const [BookingData, setBookingData] = useState();

  const handlePayment = async (mod) => {

const dateObj = new Date(selectedDate);

// Add 1 day to the current date
dateObj.setDate(dateObj.getDate() + 1);


    try {
      const body = {
        booking: {
          category_id: service?.category_id,
          sub_category_id: service?.id,
          visit_date: dateObj.toISOString(), 
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
                const formattedTime = `${hours
                  .toString()
                  .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`; // Add seconds as `00`
                return formattedTime;
              }
            }
            return "00:00:00"; 
          })(),
          visit_address_id: selectedLocation?.address_id,
          address_from: "",
          address_to: "",
          number_of_people: people, 
          guest_name: BookingForGuestName,
          instructions: specialRequests || "",
          payment_mode: mod, 
          menu_and_service_ids: menu || [],
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
          <div
            className="booking-booking-form"
            //  onSubmit={handleSubmitForm}
          >
            <div className="booking-form-header">
              <button
                className="booking-back-button"
                onClick={() => navigate("/")}
              >
                ←
              </button>
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

              <div >
                {/* <div className="d-flex"> */}
                  <div className="booking-form-group flex-fill">
                  <label className="booking-form-label" htmlFor="time-input">
                    Select Visit Date
                  </label>
                    <LocalizationProvider dateAdapter={AdapterDateFns}  style={{ width: '100%' }}>
                      <DatePicker
                        // label="Select Visit Date"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        minDate={new Date()}
                        renderInput={(params) => <TextField {...params}  />}
                      />
                    </LocalizationProvider>
                  </div>
                  {/* </div> */}

                <div className="booking-form-group">
                  <label className="booking-form-label" htmlFor="time-input">
                    Select Time of Visit
                  </label>
                  <input
    type="time"
    id="time-input"
    className="booking-form-input"
    value={selectedTime}
    onChange={(e) => setSelectedTime(e.target.value)}
  />
                </div>

         
              </div>

              <div>
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

                <div
                  className="booking-form-group"
                  style={{ position: "relative" }}
                >
                  <label className="booking-form-label">
                    Select Menu / Service (Optional)
                  </label>

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
                              className="menu-checkbox"
                              id={`service-${option.id}`}
                              value={option.id}
                              checked={menu.includes(option.id)}
                              onChange={() => handleCheckboxChange(option.id)}
                              style={{
                                margin: 0, // Remove any margin around the checkbox
                                cursor: "pointer"
                              }}
                            />
                            <label
                              htmlFor={`service-${option.id}`}
                              style={{ margin: 0 }}
                            >
                              {option.name}{" "}
                              {/* Using the 'name' property from the API */}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

              <div>
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
                    <a
                      href="#"
                      className="read-policy-button"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default anchor behavior
                        // Add any additional logic here if needed
                        console.log("Cancellation policy clicked");
                      }}
                    >
                      READ CANCELLATION POLICY<IoIosArrowForward className="arrow_for_cancellation"/>
                    </a>
                  </div>
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
              <div className="add-location-header">
                <button className="back-button" onClick={prevStep}>
                  ←
                </button>
            <MapPin size={20} />

                <h2 className="header-title">Select Booking Location</h2>
              </div>














































              {/* <div className="address-card">
                <div className="address-icon">📍</div>
                <div className="address-text">
                  123 Conni, 110001
                </div>
              </div>

              <button className="add-address-link" onClick={nextStep}>
                Add New Address
              </button> */}
















<div className="address-section mt-0">
          <div className="address-header">
            {/* <MapPin size={20} /> */}
            {/* <h2>Select Address</h2> */}
          </div>



       {addresses.map((address, index) => (
  <div key={address.address_id} className="mb-3">
    <div className="d-flex align-items-center">
      {/* Radio button for selecting address */}
      <input
        type="radio"
        name="address"
        id={`address-${address.address_id}`}
        checked={selectedLocation?.address_id === address?.address_id} // Check if this is the selected address
        onChange={() => setSelectedLocation(address)} // Set the selected address when clicked
        className="me-2"
        style={{cursor:"pointer", width:"auto"}}
      />
      <p className="flex-fill mb-0 address-p">
        <span className="serial-number me-2">{index + 1}.</span>
        {address.house}, {address.street_address}{" "}
        {address.street_address_line2}, {address.landmark},{" "}
        {address.city} - {address.state} {address.postal_code}{" "}
        {address.country}
      </p>
      <Dropdown>
        <Dropdown.Toggle
          as="span"
          id="dropdown-custom-components"
          className="cursor-pointer border-0 bg-transparent p-0 d-flex align-items-center"
          bsPrefix="custom-toggle" // Disables Bootstrap’s caret icon
        >
          <BsThreeDotsVertical size={18} style={{ cursor: "pointer" }} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-end">
          <Dropdown.Item
            onClick={() => {
              setAddressToEdit(address?.address_id);
              setIsEditingAddress(true);
            }}
          >
            Edit
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
))}



          <a className="add-address" onClick={() => setIsAddingAddress(true)}>
            + Add New Address
          </a>

          {/* Modal for Adding New Address */}
          <Modal show={isAddingAddress} onHide={cancelAddAddress} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add New Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddAddressForm
                fetchProfile={fetchProfile}
                cancelAddAddress={cancelAddAddress}
              />
            </Modal.Body>
          </Modal>

          {/* Modal for Editing Address */}
          <Modal show={isEditingAddress} onHide={() => setIsEditingAddress(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EditAddressForm
                addressId={addressToEdit}
                closeModal={() => setIsEditingAddress(false)}
                refreshAddresses={fetchProfile} // A function to refresh the address list
              />
            </Modal.Body>
          </Modal>

         
        </div>





























































































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
                <h2 className="address-header-title">
                  Confirm Booking Location
                </h2>
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

       
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="booking-booking-form">
            <div className="booking-summary-header">
              <button
               onClick={() => setStep(2)}
                className="booking-summary-back-button"
              >
                <ChevronLeft size={24} />
              </button>
              <h2>Booking Summary</h2>
            </div>

            <h3 className="booking-summary-label">Booking Details</h3>
            <div className="booking-summary-details">
              <div className="booking-detail-card">
                <div>
                  <strong>Booking For :</strong>
                </div>
                <div>{BookingForGuestName}</div>
              </div>
              <div className="booking-detail-card">
                <div>
                  <strong>Address : </strong>
                </div>
                <div>
                <p className="flex-fill mb-0 address-p">
 
        {selectedLocation.house}, {selectedLocation.street_selectedLocation}{" "}
        {selectedLocation.street_selectedLocation_line2}, {selectedLocation.landmark},{" "}
        {selectedLocation.city} - {selectedLocation.state} {selectedLocation.postal_code}{" "}
        {selectedLocation.country}
      </p>
                  </div>
              </div>

              <div className="booking-detail-card">
                <div>
                  <strong>Number of People : </strong>
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
                  <strong>Date & Time:</strong>{" "}
                  {format(new Date(selectedDate), "dd MMM yyyy")},{" "}
                  {format(new Date(`2024-12-12T${selectedTime}:00`), "hh:mm a")}
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
                    <h5>Grand Total:</h5>
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
              <button className="checkout-button" onClick={nextStep}>
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
                  <button
                    className="payment-action-button"
                    onClick={(event) => {
                      handlePayment("online");
                      setCallRazorPay(true);
                      event.target.disabled = true; // Disable the clicked button
                      event.target.nextSibling.disabled = true; // Disable the sibling button
                      setMakeDisable(true);

                    }}
                    disabled = {makeDisable}
                  >
                    Pay Now
                  </button>
                  <button
                    className="payment-action-button"
                    onClick={(event) => {
                      handlePayment("cod");
                      setCallRazorPay(false);
                      event.target.disabled = true; // Disable the clicked button
                      event.target.previousSibling.disabled = true; // Disable the sibling button
                      setMakeDisable(true);
                    }}
                    disabled = {makeDisable}
                  >
                    Pay Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {callRazorPay && BookingData && (
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

              <button
                className="btn back-home-btn"
                onClick={() => navigate("/")} 
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
          <MessageModal
              show={show}
              handleClose={handleClose}
              handleShow={handleShow}
              message={message}
            />

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