import React, { useState } from 'react';
import './AddressFormStep.css';

const AddressFormStep = ({ onBack, onConfirm }) => {
  const [addressForm, setAddressForm] = useState({
    city: 'Delhi',
    area: '',
    society: '',
    houseNo: '',
    landmark: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedAddress = {
      address: `${addressForm.houseNo}, ${addressForm.society}`,
      city: addressForm.city,
      state: "Delhi",
      zipCode: "",
      area: addressForm.area,
      landmark: addressForm.landmark,
    };
  
    onConfirm(formattedAddress); // Notify parent with address
  };
  

  return (
    <div className="address-form-overlay">
      <div className="address-form-content">
        <div className="address-form-header">
          <button className="back-button" onClick={onBack}>←</button>
          <h2 className="header-title">Confirm booking location</h2>
        </div>

        <div className="map-preview">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search your location"
              className="search-input"
            />
            <button className="search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="address-form-section">
          <h3 className="section-title">Select booking location</h3>
          
          <form onSubmit={handleSubmit} className="address-form">
            <input
              type="text"
              name="city"
              value={addressForm.city}
              onChange={handleChange}
              className="form-input"
              placeholder="Delhi"
              disabled
            />
            
            <input
              type="text"
              name="area"
              value={addressForm.area}
              onChange={handleChange}
              className="form-input"
              placeholder="Area"
              required
            />
            
            <input
              type="text"
              name="society"
              value={addressForm.society}
              onChange={handleChange}
              className="form-input"
              placeholder="Society / Locality / Colony"
              required
            />
            
            <input
              type="text"
              name="houseNo"
              value={addressForm.houseNo}
              onChange={handleChange}
              className="form-input"
              placeholder="House no. / Flat no. / Building"
              required
            />
            
            <input
              type="text"
              name="landmark"
              value={addressForm.landmark}
              onChange={handleChange}
              className="form-input"
              placeholder="Landmark"
            />

            <button type="submit" className="confirm-button">
              Confirm Address
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressFormStep;

