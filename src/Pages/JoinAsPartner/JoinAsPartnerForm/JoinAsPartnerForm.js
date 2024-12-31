import React, { useState } from "react";
import "./JoinAsPartnerForm.css";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import MessageModal from "../../MessageModal/MessageModal";

const JoinAsPartnerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    message: "",
  });

  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [message, setMessage] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleClosePopup = () => setShowPopup(false); // Close popup handler

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleLocationChange = (city) => {
    setSelectedLocation(city);
    setFormData({ ...formData, city });
    setActiveDropdown(null); // Close dropdown after selection
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile =
        "Enter a valid 10-digit mobile number starting with 6-9.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }

    setErrors(newErrors); // Set the errors state
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      return; // Stop submission if there are validation errors
    }

    const supportData = {
      support: {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        city: formData.city,
        description: formData.message,
      },
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/support/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(supportData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setFormData({
          name: "",
          mobile: "",
          email: "",
          city: "",
          message: "",
        });
        setErrors({});
        setShowPopup(true); // Show the popup only on success
      } else {
        console.error("Error submitting form:", result);
      }
    } catch (error) {
      console.error("Error during API request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container nav-container join-partner-container">
      <div className="join-partner-section">
        <h2 className="join-partner-title">Get In Touch</h2>
        <form onSubmit={handleSubmit}>
          <div className="join-partner-form-group">
            <input
              type="text"
              name="name"
              className="join-partner-input"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="join-partner-form-group">
            <div className="join-partner-phone-input">
              <input
                type="text"
                className="join-partner-country-code"
                value="+91"
                disabled
              />
              <input
                type="tel"
                name="mobile"
                className="join-partner-input"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
            {errors.mobile && <p className="error-text">{errors.mobile}</p>}
          </div>

          <div className="join-partner-form-group">
            <input
              type="email"
              name="email"
              className="join-partner-input"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="join-partner-form-group">
            <div className="nav-item dropdown location-dropdown">
              <a
                className="nav-link dropdown-toggle location-drop"
                href="#"
                style={{width:"auto", marginRight:"0px"}}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDropdown(activeDropdown === "location" ? null : "location");
                }}
              >
                <div style={{gap:"10px"}}>
                  <i className="bi bi-geo-alt-fill me-1"></i>{" "}
                  <span style={{ color: "#999999", fontSize: "16px" }}>
                    {selectedLocation || "Select Location"}
                  </span>
                  
                </div>
              </a>
              {activeDropdown === "location" && (
                <div className="dropdown-menu show">
                  {["Delhi", "Mumbai", "Bangalore", "Chennai"].map((city) => (
                    <a
                      key={city}
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLocationChange(city);
                      }}
                    >
                      {city}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {errors.city && <p className="error-text">{errors.city}</p>}
          </div>

          <div className="join-partner-form-group">
            <textarea
              name="message"
              className="join-partner-textarea"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
            />
            {errors.message && <p className="error-text">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="join-partner-button"
            disabled={isSubmitting}
          >
            Send Now
          </button>
        </form>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Thank You!</h2>
            <p>Your message has been successfully sent.</p>
            <button className="close-btn" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="join-partner-section2">
        <div className="join-partner-text-center">
          <h2 className="join-partner-title">Join As A Partner</h2>
          <p>Download Our Partner App</p>
          <div>
            <button className="join-partner-button-download">
              Download App
            </button>
          </div>
        </div>

        <div className="join-partner-help-section">
          <h3 className="join-partner-help-title">Need Help?</h3>
          <Link to="/contact-us" className="join-partner-link text-center">
            Open Help Centre →
          </Link>
        </div>

        <div className="join-partner-address-section">
          <h3 className="join-partner-address-title">Our office addresses</h3>
          <p className="join-partner-address-text">
            123 Connaught Place, Rajiv Chowk,
          </p>
          <p className="join-partner-address-text">New Delhi, Delhi, 110001</p>
          <a href="#" className="join-partner-link">
            Check Map →
          </a>
        </div>
      </div>
      <MessageModal
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        message={message}
      />
    </div>
  );
};

export default JoinAsPartnerForm;
