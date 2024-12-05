import React, { useState, useEffect, useRef } from 'react';
import './AddLocationStep.css';

const AddLocationStep = ({ onBack, onConfirm }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState({
    address: 'Connaught Place, Rajiv Chowk, New Delhi, Delhi, 110001',
    lat: 28.6289,
    lng: 77.2065
  });
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
  
    script.onload = () => initializeMap(); // Initialize map after script loads
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script); // Cleanup script on unmount
    };
  }, []);
  
  const initializeMap = () => {
    if (!window.google) {
      console.error("Google Maps script not loaded properly.");
      return;
    }
  
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: selectedLocation.lat, lng: selectedLocation.lng },
      zoom: 15,
    });
  
    const marker = new window.google.maps.Marker({
      map: map,
      position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
      draggable: true,
    });
  
    const searchBox = new window.google.maps.places.SearchBox(searchBoxRef.current);
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(searchBoxRef.current);
  
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
  
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;
  
      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;
  
      map.setCenter(place.geometry.location);
      marker.setPosition(place.geometry.location);
  
      setSelectedLocation({
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });
  
    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      setSelectedLocation({
        address: "Custom location",
        lat: position.lat(),
        lng: position.lng(),
      });
    });
  };
  
  
  return (
    <div className="location-overlay">
      <div className="location-content">
        <div className="location-header">
          <button className="back-button" onClick={onBack}>←</button>
          <h2 className="header-title">Confirm booking location</h2>
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
          <h3 className="selection-title">Select booking location</h3>
          <div className="address-card">
            <div className="address-marker">📍</div>
            <div className="address-text">{selectedLocation.address}</div>
          </div>
          <button className="add-address-button" onClick={() => onConfirm(selectedLocation)}>
            Add new Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLocationStep;

