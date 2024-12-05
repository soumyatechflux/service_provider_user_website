import React, { useState } from "react";
import "./ModifyBooking.css";
import { useNavigate } from "react-router-dom";

const ModifyBooking = ({bookingsIdWise,fetchUpcommingBookings}) => {
  const [selectedDate, setSelectedDate] = useState("05");
  const [people, setPeople] = useState(0);
  const [time, setTime] = useState("12:15 AM");
  const [menu, setMenu] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
 const navigate=useNavigate();
  const days = [
    { number: "05", label: "Sun" },
    { number: "05", label: "Mon" },
    { number: "05", label: "Tue" },
    { number: "05", label: "Wed" },
    { number: "05", label: "Thu" },
    { number: "05", label: "Fri" },
    { number: "05", label: "Sat" },
  ];

  const timeSlots = [
    "12:15 AM",
    "12:30 AM",
    "1:00 AM",
    "1:30 AM",
    "2:00 AM",
    "2:30 AM",
    "3:00 AM",
    "3:30 AM",
  ];

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


  const handleBack=()=>{
    console.log("back")
    navigate("/my-profile")
  }

  return (
    <div className="container nav-container modify-booking-container my-3">
      <div className="modify-booking-form">
        <div className="modify-form-header">
          <button className="modify-back-button" onClick={handleBack}>←</button>
          <h2 className="modify-form-title">Modify Booking</h2>
        </div>

        <form onSubmit={handleModify}>
          <div className="modify-form-group">
            <label className="modify-form-label">Select Visit Date</label>
            <div className="modify-calendar-grid">
              {days.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  className={`modify-calendar-day ${
                    selectedDate === `${day.label}-${day.number}`
                      ? "modify-selected"
                      : ""
                  }`}
                  onClick={() => setSelectedDate(`${day.label}-${day.number}`)}
                >
                  <span className="modify-day-label">{day.label}</span>
                  <span className="modify-day-number">{day.number}</span>
                  <span className="modify-day-label-secondary">
                    {day.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="modify-form-group">
            <label className="modify-form-label">Select Time of Visit</label>
            <select
              className="modify-select-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
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
            <div className="modify-cooking-time">
              Total cooking time: 3.5 hours
            </div>
          </div>

          <div className="modify-form-group">
            <label className="modify-form-label">Select Menu (Optional)</label>
            <select
              className="modify-select-input"
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
            >
              <option value="">Menu and Cuisine</option>
              <option value="italian">Italian</option>
              <option value="indian">Indian</option>
              <option value="chinese">Chinese</option>
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

          <button type="submit" className="modify-submit-button">
            Modify
          </button>
        </form>
      </div>

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
