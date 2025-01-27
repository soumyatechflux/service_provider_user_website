import React, { useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 28.6139, // Default latitude (e.g., Delhi)
  lng: 77.209, // Default longitude (e.g., Delhi)
};

const LocationModal = ({
  show,
  onHide,
  latitude,
  longitude,
}) => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: latitude || defaultCenter.lat,
    lng: longitude || defaultCenter.lng,
  });

  const [searchBox, setSearchBox] = useState(null);
  const mapRef = useRef(null);

  const onLoad = (autocomplete) => {
    setSearchBox(autocomplete);
  };

  const onPlaceChanged = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
  
      // Debugging to inspect the `place` object
      console.log("Place Object:", place);
  
      if (place && place.geometry && place.geometry.location) {
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCurrentPosition(newPosition);
        mapRef.current.panTo(newPosition); // Pan the map to the new position
      } else {
        console.error("Invalid place or missing geometry. Please select a valid location.");
        alert("Please select a valid location from the suggestions.");
      }
    }
  };
  

  const handleMapClick = (event) => {
    setCurrentPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select Location</h5>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={onHide}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
          <Autocomplete
  onLoad={onLoad}
  onPlaceChanged={onPlaceChanged}
  options={{
    fields: ["geometry", "formatted_address"],
    types: ["geocode"], // Restrict to geocode results
  }}
>
  <input
    type="text"
    placeholder="Search places..."
    className="form-control mb-3"
  />
</Autocomplete>


            <div style={{ height: "400px" }}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={14}
                onClick={handleMapClick}
                onLoad={(map) => {
                  mapRef.current = map;
                  map.panTo(currentPosition); // Ensure the map centers on the current position
                }}
              >
                <Marker
                  position={currentPosition}
                  draggable
                  onDragEnd={(event) =>
                    setCurrentPosition({
                      lat: event.latLng.lat(),
                      lng: event.latLng.lng(),
                    })
                  }
                />
              </GoogleMap>
            </div>
            <div className="mt-3">
              <p>
                <strong>Latitude:</strong> {currentPosition.lat}
              </p>
              <p>
                <strong>Longitude:</strong> {currentPosition.lng}
              </p>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                console.log("Selected Location:", currentPosition);
                onHide();
              }}
            >
              Save Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
