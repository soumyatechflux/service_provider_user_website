import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MdLocationOn } from "react-icons/md";

const containerStyle = {
  width: "100%",
  height: "400px",
  margin: "20px 0",
};

const center = {
  lat: 28.6139,
  lng: 77.209,
};

const DriverBookingMap = ({ onSelectPoints }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);
  const [startPoint, setStartPoint] = useState("My Current Location");
  const [endPoint, setEndPoint] = useState("");
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);

  const [startAutocomplete, setStartAutocomplete] = useState(null);
  const [endAutocomplete, setEndAutocomplete] = useState(null);

  const handleLoadStartAutocomplete = (autocomplete) =>
    setStartAutocomplete(autocomplete);
  const handleLoadEndAutocomplete = (autocomplete) =>
    setEndAutocomplete(autocomplete);

  const getCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {

        const { latitude, longitude } = position.coords;
        // setStartPoint({ lat: latitude, lng: longitude });
        fetchAddress(latitude, longitude);
        setStartCoordinates({ lat: latitude, lng: longitude });
      },
      (error) => console.error("Error fetching current location:", error)
    );
  }, []);

  const [loading, setLoading] = useState(false);

  const fetchAddress = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GEOLOCATION_API_KEY}`
      );
  
      const data = await response.json();
  
      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0];
        setStartPoint(result.formatted_address); // Properly set full address string
      }
    } catch (error) {
      console.error("Error fetching address:", error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const calculateRoute = async () => {
    if (!startPoint || !endPoint) return;

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin:
          typeof startPoint === "string"
            ? startPoint
            : `${startPoint.lat},${startPoint.lng}`,
        destination:
          typeof endPoint === "string"
            ? endPoint
            : `${endPoint.lat},${endPoint.lng}`,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);

      if (onSelectPoints && typeof onSelectPoints === "function") {
        onSelectPoints({
          startPoint,
          startCoordinates,
          endPoint,
          endCoordinates,
          distance: results.routes[0].legs[0].distance.text,
          duration: results.routes[0].legs[0].duration.text,
        });
      } else {
        console.warn("onSelectPoints is not a function or undefined");
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    if (startPoint !== "My Current Location" && endPoint) {
      calculateRoute();
    }
  }, [startPoint, endPoint, startCoordinates, endCoordinates]);

  // Inline styles for the loader and overlay
  const loaderStyle = {
    border: "8px solid #f3f3f3", // Light grey
    borderTop: "8px solid #3498db", // Blue
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 2s linear infinite",
  };

  const overlayStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "999", // Ensure the overlay is on top
    backdropFilter: "blur(5px)", // Apply the blur effect
  };

  // Spinning animation keyframes as an inline style
  const spinAnimation =
    "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";

  return isLoaded ? (
    <>
      {loading && (
        <div style={overlayStyle}>
          <div style={loaderStyle}></div>
        </div>
      )}

      <div className="container mt-4 mb-4">
        <div className="mb-4">
          <label className="form-label">
            Pickup Location <MdLocationOn size={20} />
          </label>
          <div className="w-100">
            <Autocomplete
              onLoad={handleLoadStartAutocomplete}
              onPlaceChanged={() => {
                if (startAutocomplete) {
                  const place = startAutocomplete.getPlace();
                  const location = place.geometry?.location;
                  if (location) {
                    setStartPoint(place.formatted_address);
                    setStartCoordinates({
                      lat: location.lat(),
                      lng: location.lng(),
                    });
                  }
                }
              }}
            >
              <input
                type="text"
                className="form-control w-100"
                placeholder="Search location"
                value={
                  typeof startPoint === "string"
                    ? startPoint
                    : "My Current Location"
                }
                onChange={(e) => setStartPoint(e.target.value)}
              />
            </Autocomplete>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Drop Location <MdLocationOn size={20} />
          </label>
          <div className="w-100">
            <Autocomplete
              onLoad={handleLoadEndAutocomplete}
              onPlaceChanged={() => {
                if (endAutocomplete) {
                  const place = endAutocomplete.getPlace();
                  const location = place.geometry?.location;
                  if (location) {
                    setEndPoint(place.formatted_address);
                    setEndCoordinates({
                      lat: location.lat(),
                      lng: location.lng(),
                    });
                  }
                }
              }}
            >
              <input
                type="text"
                className="form-control w-100"
                placeholder="Search location"
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
              />
            </Autocomplete>
          </div>
        </div>

        {distance && startPoint && endPoint && (
          <p style={{ marginTop: "10px" }}>Distance: {distance}</p>
        )}
        {duration && startPoint && endPoint && <p>Duration: {duration}</p>}

        {startPoint && endPoint && (
          <>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onLoad={(mapInstance) => setMap(mapInstance)}
            >
              {directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} />
              )}
            </GoogleMap>
          </>
        )}
      </div>
    </>
  ) : (
    <p>Loading...</p>
  );
};

export default DriverBookingMap;
