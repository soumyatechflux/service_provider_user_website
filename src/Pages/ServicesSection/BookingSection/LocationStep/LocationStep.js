import React from 'react';
import './LocationStep.css';

const LocationStep = ({ onConfirm, onAddNew }) => {
  return (
    <div className="location-overlay">
      <div className="location-content">
        <h2 className="location-title">Select booking location</h2>
        
        <div className="address-card">
          <div className="address-icon">📍</div>
          <div className="address-text">
            123 Connaught Place, Rajiv Chowk, New Delhi, Delhi, 110001
          </div>
        </div>

        <button className="add-address-link" onClick={onAddNew}>
          Add New Address
        </button>

        <button className="confirm-address-button" onClick={onConfirm}>
          Confirm Address
        </button>
      </div>
    </div>
  );
};

export default LocationStep;
