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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
          </div>

          <div className="join-partner-form-group">
            <textarea
              name="message"
              className="join-partner-textarea"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
            />
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
          <p className="join-partner-address-text">123 Connaught Place, Rajiv Chowk,</p>
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
