import React, { useEffect, useRef, useState } from "react";
import "./ModifyBooking.css";
import { ChevronLeft, ChevronRight, Loader, MapPin } from "lucide-react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { ArrowBarDown } from "react-bootstrap-icons";
import { Dropdown, Modal } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessageModal from "../../MessageModal/MessageModal";
import RazorpayPayment from "../../ServicesSection/BookingSection/RazorpayPayment";
import EditAddressForm from "../ProfileDetails/EditAddressForm/EditAddressForm";
import AddAddressForm from "../ProfileDetails/AddAddressForm/AddAddressForm";



const ModifyBooking = () => {

    const location = useLocation();
    const navigate = useNavigate();

   const { id } = location.state || {};
   const { service } = location.state || {};


  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [loading, setLoading] = useState(false);
  const [menuOrServicesOptions, setmenuOrServicesOptions] = useState([]);
  const [menu, setMenu] = useState([]);
  // const [selectedTime, setSelectedTime] = useState("");
  const [showGrid, setShowGrid] = useState(false);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isAddingAddress, setIsAddingAddress] = useState(false); // New state for address form
  const [addressToEdit, setAddressToEdit] = useState(null); // Track the address being edited
  const [isEditingAddress, setIsEditingAddress] = useState(false); // State for editing address modal
  const [makeDisable, setMakeDisable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    const storedName = sessionStorage.getItem("user_name");
    if (storedName) {
      setBookingForGuestName(storedName);
    }
  }, []);


  const [step, setStep] = useState(1); // Manage the current step









  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [minTime, setMinTime] = useState("");

  useEffect(() => {
    updateMinTime(new Date());
  }, []);

  // Helper to get current time in HH:MM format in Asia/Kolkata timezone
  const getCurrentTimeInDelhi = () => {
    const now = new Date();
    const delhiTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const hours = String(delhiTime.getHours()).padStart(2, "0");
    const minutes = String(Math.floor(delhiTime.getMinutes() / 15) * 15).padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const updateMinTime = (date) => {
    const isToday = date.toDateString() === new Date().toDateString();
    setMinTime(isToday ? getCurrentTimeInDelhi() : "00:00");
  };
  


  const handleDateChange = (newDate) => {
    const delhiDate = new Date(
      newDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
  
    setSelectedDate(delhiDate);
  
    const isToday = delhiDate.toDateString() === new Date().toDateString();
  
    if (isToday) {
      updateMinTime(new Date()); // Update minTime to current time for today
    } else {
      setMinTime("00:00"); // Reset minTime for future dates
    }
  
    setSelectedTime(""); // Clear the time selection
  };



  const roundToNearestInterval = (timeString, intervalMinutes = 15) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const roundedMinutes = Math.ceil(totalMinutes / intervalMinutes) * intervalMinutes;
  
  const newHours = Math.floor(roundedMinutes / 60);
  const newMinutes = roundedMinutes % 60;
  
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

// const handleTimeChange = (e) => {
//   const selectedTimeValue = e.target.value;
//   const roundedTime = roundToNearestInterval(selectedTimeValue);
  
//   if (selectedDate.toDateString() === new Date().toDateString()) {
//     const currentTime = getCurrentTimeInDelhi();
//     if (roundedTime < currentTime) {
//       toast.error("You cannot select a past time for today's date!");
//       setSelectedTime(currentTime);
//       return;
//     }
//   }
  
//   setSelectedTime(roundedTime);
// };


  const handleTimeChange = (e) => {
    const selectedTimeValue = e.target.value;
    const roundedTime = roundToNearestInterval(selectedTimeValue);

    if (selectedDate.toDateString() === new Date().toDateString()) {
      const currentTime = getCurrentTimeInDelhi();
      if (roundedTime < currentTime) {
        toast.error("You cannot select a past time for today's date!");
        setSelectedTime(currentTime);
        return;
      }
    }

    setSelectedTime(roundedTime);
  };


  // Generate 15-minute intervals for the entire day
  const generateTimeIntervals = () => {
    const intervals = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        intervals.push(time);
      }
    }
    return intervals;
  };
  
  const timeOptions = generateTimeIntervals();
  
  const getCurrentTimeInHHMM = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  
  const filterTimeOptions = () => {
    const currentDate = new Date();
    const today = currentDate.toDateString();
    const currentTime = getCurrentTimeInHHMM();
  
    if (selectedDate.toDateString() === today) {
      return timeOptions.filter((time) => time >= currentTime);
    }
  
    return timeOptions;
  };
  
  const filteredTimeOptions = filterTimeOptions();








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

  const [selectedLocationFromForDriver, setSelectedLocationFromForDriver] = useState({
  });  
  const [selectedLocationToForDriver, setSelectedLocationToForDriver] = useState({
  });

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setSelectedLocation(addresses[0]);
      setSelectedLocationFromForDriver(addresses[0]);
      setSelectedLocationToForDriver(addresses[0]);

    }
  }, [addresses]);


  
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

  const handleCheckboxChangeForDriver = (id) => {
    // If the item is already selected, do nothing
    if (menu.includes(id)) {
      return;
    }
  
    // Otherwise, set the selected item to the new id and close the dropdown
    setMenu([id]); // This ensures only one item is selected
    setIsDropdownOpen(false); // Close the dropdown after selection
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

          // visit_date: dateObj.toISOString(), 

          visit_date:selectedDate,

          // visit_time: (() => {
          //   if (selectedTime) {
          //     const timeParts = selectedTime.match(/(\d{1,2}):(\d{2})/); // Match hours and minutes
          //     if (timeParts) {
          //       let hours = parseInt(timeParts[1], 10);
          //       const minutes = parseInt(timeParts[2], 10);

          //       // If the time is less than 12:00, convert it to 24-hour format
          //       if (hours < 12) {
          //         hours = hours + 12; // Add 12 for PM conversion
          //       }

          //       // Format hours and minutes to ensure they are two digits
          //       const formattedTime = `${hours
          //         .toString()
          //         .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`; // Add seconds as `00`
          //       return formattedTime;
          //     }
          //   }
          //   return "00:00:00"; 
          // })(),

          visit_time: selectedTime,

          visit_address_id: selectedLocation?.address_id,

  
          address_from: service?.category_id === 2 ? selectedLocationFromForDriver?.address_id : "",
          address_to: service?.category_id === 2 ? selectedLocationToForDriver?.address_id : "",

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












  
  const handleGetAppPrefilledData = async () => {
    try {
      setLoading(true);
  
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/bookings/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Upcomming Booking response:", response);
  
      if (response.status === 200 && response.data.success === true) {
        const mainGetResData = response.data.data;

      



      }
      
    } catch (error) {
      console.error("Failed to fetch upcoming bookings:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    handleGetAppPrefilledData();
  }, []);







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
              <h1 className="booking-form-title">Booking For :</h1>
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

     















              <div>
      {/* Date Picker */}
      <div className="booking-form-group flex-fill">
        <label className="booking-form-label" htmlFor="date-input">
          Select Visit Date
        </label>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()} // Disable past dates
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>

      {/* Time Picker */}
      <div className="booking-form-group">
    <label className="booking-form-label" htmlFor="time-select">
      Select Time of Visit
    </label>
    <div className="booking-time-dropdown-wrapper">
      <select
        id="time-select"
        className="booking-time-dropdown"
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
      >
        <option value="" disabled>
          Select a time
        </option>
        {filteredTimeOptions.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
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

               
               
               
               
               
               
               
               
               
               
               
               
               
               
{(service?.category_id === 1 || service?.category_id === 3 )&& (
               
               <>
            
               
              
                  <div
                    className="dropdown-container"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px", // Reduce gap between elements
                    }}
                  >
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

                  </>

)}























        
               
               
{(service?.category_id === 2)&& (
               
               <>
            
               
              
            <div
  className="dropdown-container"
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "4px", // Reduce gap between elements
  }}
>
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
            onChange={() => handleCheckboxChangeForDriver(option.id)}
            style={{
              margin: 0, // Remove any margin around the checkbox
              cursor: "pointer",
            }}
          />
          <label htmlFor={`service-${option.id}`} style={{ margin: 0 }}>
            {option.name}{" "}
          </label>
        </div>
      ))}
    </div>
  )}
</div>

                  </>

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








<div 
style={{
  overflowY: "auto", 
  maxHeight: "450px",
}} 
className="address-section mt-0">
     



{(service?.category_id === 1 || service?.category_id === 3 )&& (
  <>
       {addresses.map((address, index) => (
  <div key={address.address_id} className="mb-3" style={{border:"2px solid #D8D8D8", padding:"5px", borderRadius:"5px"}}>
    <div className="d-flex align-items-center">
      {/* Radio button for selecting address */}
      <input
        type="radio"
        name="address"
        id={`address-${address.address_id}`}
        checked={selectedLocation?.address_id === address?.address_id} 
        onChange={() => setSelectedLocation(address)} 
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


      


      <Dropdown className="custom-dropdown-container">
        <Dropdown.Toggle
          as="span"
          id="dropdown-custom-components"
           className="custom-dropdown-toggle"
          bsPrefix="custom-toggle" // Disables Bootstrap’s caret icon
        >
          <BsThreeDotsVertical size={18} style={{ cursor: "pointer" }} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="custom-dropdown-menu-booking">
          
          <Dropdown.Item
          className="custom-dropdown-item-booking"
            onClick={() => {
              setAddressToEdit(address?.address_id);
              setIsEditingAddress(true);
            }}
          >
           <span>Edit</span> 
          </Dropdown.Item>
          
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
))}

</>
)}


































<>
      {(service?.category_id === 2) && (
        <>
          <span>Select Address From:</span>
          {addresses.map((address, index) => (
            <div
              key={address.address_id}
              className="mb-3"
              style={{ border: "2px solid #D8D8D8", padding: "5px", borderRadius: "5px" }}
            >
              <div className="d-flex align-items-center">
                {/* Radio button for selecting address */}
                <input
                  type="radio"
                  name="address-from"
                  id={`address-from-${address.address_id}`}
                  checked={selectedLocationFromForDriver?.address_id === address?.address_id}
                  onChange={() => setSelectedLocationFromForDriver(address)}
                  className="me-2"
                  style={{ cursor: "pointer", width: "auto" }}
                />
                <p className="flex-fill mb-0 address-p">
                  <span className="serial-number me-2">{index + 1}.</span>
                  {address.house}, {address.street_address} {address.street_address_line2}, {address.landmark}, {address.city} - {address.state} {address.postal_code} {address.country}
                </p>
                <Dropdown className="custom-dropdown-container">
                  <Dropdown.Toggle
                    as="span"
                    id="dropdown-custom-components"
                     className="custom-dropdown-toggle"
                    bsPrefix="custom-toggle"
                  >
                    <BsThreeDotsVertical size={18} style={{ cursor: "pointer" }} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-dropdown-menu-booking">
                    <Dropdown.Item
                    className="custom-dropdown-item-booking"
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
        </>
      )}

      <hr />

      {(service?.category_id === 2) && (
        <>
          <span>Select Address To:</span>
          {addresses.map((address, index) => (
            <div
              key={address.address_id}
              className="mb-3"
              style={{ border: "2px solid #D8D8D8", padding: "5px", borderRadius: "5px" }}
            >
              <div className="d-flex align-items-center">
                {/* Radio button for selecting address */}
                <input
                  type="radio"
                  name="address-to"
                  id={`address-to-${address.address_id}`}
                  checked={selectedLocationToForDriver?.address_id === address?.address_id}
                  onChange={() => setSelectedLocationToForDriver(address)}
                  className="me-2"
                  style={{ cursor: "pointer", width: "auto" }}
                />
                <p className="flex-fill mb-0 address-p">
                  <span className="serial-number me-2">{index + 1}.</span>
                  {address.house}, {address.street_address} {address.street_address_line2}, {address.landmark}, {address.city} - {address.state} {address.postal_code} {address.country}
                </p>
                <Dropdown className="custom-dropdown-container">
                  <Dropdown.Toggle
                    as="span"
                    id="dropdown-custom-components"
                    className="custom-dropdown-toggle"
                    bsPrefix="custom-toggle"
                  >
                    <BsThreeDotsVertical size={18} style={{ cursor: "pointer" }} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-dropdown-menu-booking">
                    <Dropdown.Item
                    className="custom-dropdown-item-booking"
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
        </>
      )}
    </>































































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









              {(service?.category_id === 1 || service?.category_id === 3) && (

<>

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
              </>

)}





{(service?.category_id === 2) && (

<>

              <div className="booking-detail-card">
                <div>
                  <strong>Address From:</strong>
                </div>
                <div>
                <p className="flex-fill mb-0 address-p">
      {selectedLocationFromForDriver?.house}, {selectedLocationFromForDriver?.street_address}{" "}
      {selectedLocationFromForDriver?.street_address_line2}, {selectedLocationFromForDriver?.landmark}, {" "}
      {selectedLocationFromForDriver?.city} - {selectedLocationFromForDriver?.state} {selectedLocationFromForDriver?.postal_code}{" "}
      {selectedLocationFromForDriver?.country}
    </p>
                  </div>
              </div>








              <div className="booking-detail-card">
                <div>
                  <strong>Address To:</strong>
                </div>
                <div>
                <p className="flex-fill mb-0 address-p">
                {selectedLocationToForDriver?.house}, {selectedLocationToForDriver?.street_address}{" "}
      {selectedLocationToForDriver?.street_address_line2}, {selectedLocationToForDriver?.landmark}, {" "}
      {selectedLocationToForDriver?.city} - {selectedLocationToForDriver?.state} {selectedLocationToForDriver?.postal_code}{" "}
      {selectedLocationToForDriver?.country}
    </p>
                  </div>
              </div>

              </>

)}





































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

            <div className="booking-summary-footer ">
              <div className="estimated-fare">
                <div>
                <h4>Estimated Fare</h4>
                </div>
                <div>
                  
                <p>
                  {" "}
                  <h4>₹{grandTotal} </h4>
                </p>
                </div>
              </div>
              
              <button className="checkout-button" onClick={nextStep}>
                Checkout
              </button>
              </div>
              
          </div>
        )}

        {/* {step === 6 && (
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

                <span>
                ₹ {grandTotal}
                </span>
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
        )} */}



{step === 6 && (
  <div className="payment-section-container">
    <div className="payment-section-main-div">
      <div className="payment-section-header">
        <button
          className="payment-back-button"
          onClick={prevStep}
          aria-label="Go back"
        >
          ←
        </button>
        <h2 className="payment-title">Bill Total: ₹ {grandTotal}</h2>
      </div>


      <div className="payment-section-body">


      <button        onClick={(event) => {
              handlePayment("online");
              setCallRazorPay(true);
              event.target.disabled = true;
              setMakeDisable(true);
            }}
            disabled={makeDisable}  style={{cursor:"pointer"}}  >

        <div className="payment-option">
          <div className="payment-icon">
            <img src="/atm-card.png" alt="Card Icon" />
          </div>
          <div className="payment-details">
            <h3>Pay using UPI, Cards</h3>
            <p>For cashless booking</p>
          </div>
          <button
            className="payment-arrow-button"
            onClick={(event) => {
              handlePayment("online");
              setCallRazorPay(true);
              event.target.disabled = true;
              setMakeDisable(true);
            }}
            disabled={makeDisable}
          >
            →
          </button>
        </div>
        </button>



        <button
            className="payment-arrow-button"
            onClick={(event) => {
              handlePayment("cod");
              setCallRazorPay(false);
              event.target.disabled = true;
              setMakeDisable(true);
            }}
            disabled={makeDisable}
            style={{cursor:"pointer"}} 
          >
        <div className="payment-option">
          <div className="payment-icon">
            <img src="/money.png" alt="Cash Icon" />
          </div>
          <div className="payment-details">
            <h3>Pay after booking</h3>
            <p>Pay in cash or UPI to service provider</p>
          </div>
          <button
            className="payment-arrow-button"
            onClick={(event) => {
              handlePayment("cod");
              setCallRazorPay(false);
              event.target.disabled = true;
              setMakeDisable(true);
            }}
            disabled={makeDisable}
          >
            →
          </button>
        </div>
        </button>




        
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

              <p className="success-message" style={{marginBottom:"200px", textAlign:"center" ,fontWeight:"bold"}}>
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

export default ModifyBooking;