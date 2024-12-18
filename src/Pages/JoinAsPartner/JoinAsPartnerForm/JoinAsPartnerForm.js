import React, { useState } from 'react';
import './JoinAsPartnerForm.css';
import { Link } from 'react-router-dom';

const JoinAsPartnerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    city: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the formData state
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error for the field being edited
    setErrors((prev) => ({
      ...prev,
      [name]: '', // Clear the error for this field
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)
    ) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log('Form submitted:', formData);
      // Clear the form and errors
      setFormData({
        name: '',
        mobile: '',
        email: '',
        city: '',
        message: '',
      });
      setErrors({});
    }
  };

  return (
    <div className="container nav-container join-partner-container">
      {/* Get In Touch Section */}
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
            <select
              name="city"
              className="join-partner-select"
              value={formData.city}
              onChange={handleChange}
            >
              <option value="">City</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="bangalore">Bangalore</option>
              <option value="chennai">Chennai</option>
            </select>
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

          <button type="submit" className="join-partner-button">
            Send Now
          </button>
        </form>
      </div>

      {/* Join As A Partner Section */}
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
    </div>
  );
};

export default JoinAsPartnerForm;
