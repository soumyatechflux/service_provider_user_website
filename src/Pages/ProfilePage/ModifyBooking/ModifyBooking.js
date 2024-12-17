
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ModifyBooking.css";
import { useNavigate,useLocation} from "react-router-dom";
import axios from "axios";
import MessageModal from "../../MessageModal/MessageModal";


const ModifyBooking = ({fetchUpcommingBookings }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [people, setPeople] = useState(0);
  const [time, setTime] = useState("12:15 AM");
  const [menu, setMenu] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingsIdWise,setBookingsIdwise]= useState([]);
  const [categoryIdWise,setCategoriesIdwise]= useState([]);
  const token = sessionStorage.getItem("ServiceProviderUserToken")
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //  Extract passed state
   const { id } = location.state || {};
   console.log("MINE",id)

  

  const handleModify = (e) => {
    e.preventDefault();
    console.log({
      selectedDate,
      time,
      people,
      menu,
      specialRequests,
    });
  };
 
  const formatTimeTo12Hour = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":").map(Number); // Split into hours and minutes
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${String(minutes).padStart(2, "0")} ${ampm}`;
  };
  


  const handleViewMore = async () => {
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
      
        // Convert fetched date to a Date object if it's not already
        const visitDate = new Date(idwiseData?.visit_date);
        if (!isNaN(visitDate)) {
          setSelectedDate(visitDate);
        }
      
        setMenu(idwiseData?.menu_and_services);
        setPeople(idwiseData?.number_of_people);
        const formattedTime = formatTimeTo12Hour(idwiseData?.visit_time);
        setTime(formattedTime);
        setSpecialRequests(idwiseData?.instructions)


      }
      
    } catch (error) {
      console.error("Failed to fetch upcoming bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("ID WISE DATA",bookingsIdWise)
  
  useEffect(() => {
    handleViewMore();
  }, []);

 
  const handleCategory = async () => {
    try {
      setLoading(true);
  
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/menu_and_services/${bookingsIdWise?.category_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Upcomming Booking response:", response);
  
      if (response.status === 200 && response.data.success === true) {
        const idwiseCategoryData = response.data.data;
        console.log("Data fetched for ID:", idwiseCategoryData);
        setCategoriesIdwise(idwiseCategoryData || []); // Update state
    }
      
    } catch (error) {
      console.error("Failed to fetch upcoming bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCategory();
  }, [bookingsIdWise]);

  const handleBack = () => {
    navigate("/my-profile");
  };

  const formatDateWithOrdinal = () => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate)) return "";
  
    const day = selectedDate.getDate();
    const month = selectedDate.toLocaleString("en-US", { month: "long" });
    const year = selectedDate.getFullYear();
    const weekday = selectedDate.toLocaleString("en-US", { weekday: "long" });
  
    const getOrdinal = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
  
    return `${weekday}, ${day}${getOrdinal(day)} ${month} ${year}`;
  };



  const handleSave = async () => {
    const updatedAddress = {
      booking:{
        booking_id:id,
        category_id:bookingsIdWise?.category_id,
        visit_date:selectedDate,
        menu_and_services:menu,
        number_of_people:people,
        visit_time:time,
        instructions:specialRequests,
      }
    };
    try {
     
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/update_booking`,
        updatedAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if(response?.status===200 && response?.data?.success){
        // alert(response?.data?.message||"booking updated successfully!");
        setMessage(response?.data?.message||"booking updated successfully!");
        setShow(true);
        handleShow(); // Show the modal
      }
      else{
        // alert(response?.data?.message||"Failed to update Booking!");
        setMessage(response?.data?.message||"Failed to update Booking!");
        setShow(true);
        handleShow(); // Show the modal
      }
    } catch (error) {
      console.error("Error updating address:", error);
      // alert("Failed to update address.");
      setMessage("Failed to update address.");
        setShow(true);
        handleShow(); // Show the modal
    }
  };
  

  return (
    <div className="container nav-container modify-booking-container my-3">
      <div className="modify-booking-form">
        <div className="modify-form-header">
          <button className="modify-back-button" onClick={handleBack}>
            ←
          </button>
          <h2 className="modify-form-title">Modify Booking</h2>
        </div>

        <form onSubmit={handleModify}>
        <div className="modify-form-group">
          <label className="modify-form-label">Select Visit Date</label>
          <input
            type="text"
            className="modify-text-input"
            placeholder="Enter visit date (e.g., Thursday, 22nd December 2024)"
            value={selectedDate ? formatDateWithOrdinal(selectedDate) : ""}
            disabled
          />

        </div>



          <div className="modify-form-group">
            <label className="modify-form-label">Select Time of Visit</label>
            <input
              type="text"
              className="modify-text-input"
              placeholder="Enter time (e.g., 12:15 AM)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled
            />
          </div>

          <div className="modify-form-group">
            <label className="modify-form-label">Number of People</label>
            <div className="modify-counter-container">
              <button
                type="button"
                className="modify-counter-button"
                onClick={() => setPeople(Math.max(0, people - 1))}
              >
                -
              </button>
              <span className="modify-counter-value">{people}</span>
              <button
                type="button"
                className="modify-counter-button"
                onClick={() => setPeople(people + 1)}
              >
                +
              </button>
            </div>
            {/* <div className="modify-cooking-time">
              Total cooking time: 3.5 hours
            </div> */}
          </div>

          <div className="modify-form-group">
            <label className="modify-form-label">Select Menu (Optional)</label>
            <select
              className="modify-select-input"
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
            >
              {/* <option value="">Menu and Cuisine</option> */}
              {categoryIdWise.length > 0 ? (
          categoryIdWise.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))
        ) : (
          <option value="" disabled>
            No Countries found
          </option>
        )}
            </select>
          </div>

          <div className="modify-form-group">
            <label className="modify-form-label">
              Special Requests / Instructions (Optional)
            </label>
            <textarea
              className="modify-textarea"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>

          <button className="modify-submit-button" onClick={handleSave}>
            Modify
          </button>
        </form>
      </div>
      <MessageModal
              show={show}
              handleClose={handleClose}
              handleShow={handleShow}
              message={message}
            />

      <div className="modify-illustration-section">
        <h1 className="modify-page-title"># Lorem ipsum dolor sit</h1>
        <h2 className="modify-main-title">LOREM IPSUM</h2>
        <img
          src="./ServicesSection/modify-booking.jpg"
          alt="Chef illustration"
          className="modify-illustration"
        />
      </div>
    </div>
    
  );

};

export default ModifyBooking;
