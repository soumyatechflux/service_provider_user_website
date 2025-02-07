import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MdLocationOn } from "react-icons/md";
import Loader from "../../Loader/Loader";

const containerStyle = {
  width: "100%",
  height: "400px",
  margin: "20px 0",
};

const center = {
  lat: 28.6139,
  lng: 77.209,
};

const DriverBookingMap = ({ onSelectPoints, service ,DriverCoordinates}) => {
  const { isLoaded } =
   useJsApiLoader({

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

  const [loading, setLoading] = useState(false);

  // Handle loading of Autocomplete instances
  const handleLoadStartAutocomplete = (autocomplete) =>
    setStartAutocomplete(autocomplete);
  const handleLoadEndAutocomplete = (autocomplete) =>
    setEndAutocomplete(autocomplete);

  // Fetch current location and set initial coordinates
  const getCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchAddress(latitude, longitude);
        setStartCoordinates({ lat: latitude, lng: longitude });
        if (service?.id === 4) {
          setEndCoordinates({ lat: latitude, lng: longitude });
        }
      },
      (error) => console.error("Error fetching current location:", error)
    );
  }, [service]);

  // Fetch address from coordinates
  const fetchAddress = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GEOLOCATION_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0];
        setStartPoint(result?.formatted_address);
        if (service?.id === 4) {
          setEndPoint(result.formatted_address);
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate route between start and end points
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
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };


  // useEffect(() => {
  //   if(!DriverCoordinates){
  //   setLoading(true);
  //   getCurrentLocation();
  //   setLoading(false);
  //   }

  // }, [getCurrentLocation]);







  useEffect(() => {
    if (DriverCoordinates) {
      const { startPoint, endPoint, startCoordinates, endCoordinates } = DriverCoordinates;
  
      // Check if all required values are present
      if (startPoint && endPoint && startCoordinates && endCoordinates) {
        // Do not call getCurrentLocation if all values are present
        console.log("All values are present. Skipping getCurrentLocation.");
      } else {
        setLoading(true);
        // Call getCurrentLocation if any value is missing
        getCurrentLocation();
        setLoading(false);

      }
    }
  }, [DriverCoordinates, getCurrentLocation]);







  // Calculate route when startPoint or endPoint changes
  useEffect(() => {
    if (startPoint !== "My Current Location" && endPoint) {
      calculateRoute();
    }
  }, [startPoint, endPoint, startCoordinates, endCoordinates]);

  // Reset state values if onSelectPoints has values
  useEffect(() => {
    // console.log(DriverCoordinates,"DriverCoordinatesbhjdfv");

    if (DriverCoordinates) {
      const { startPoint, endPoint, startCoordinates, endCoordinates } = DriverCoordinates;

      if (startPoint) setStartPoint(startPoint);
      if (endPoint) setEndPoint(endPoint);
      if (startCoordinates) setStartCoordinates(startCoordinates);
      if (endCoordinates) setEndCoordinates(endCoordinates);
    }
  }, [DriverCoordinates]);

  // Loader and overlay styles
  const loaderStyle = {
    border: "8px solid #f3f3f3",
    borderTop: "8px solid #3498db",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "999",
    backdropFilter: "blur(5px)",
  };

  // Render the component
  return (
    <>
      {(loading || !isLoaded )&& (
        // <div style={overlayStyle}>
        //   <div style={loaderStyle}></div>
        //   {/* <Loader /> */}
        // </div>
        <div>
               <Loader />
        </div>
      )}

      {isLoaded ? (
        <>
          {service?.id !== 4 && (
            <div className="container mt-4 mb-4">
              <div className="mb-4">
                <label className="form-label">
                  Pickup  <MdLocationOn size={20} />
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
                    options={{
                      componentRestrictions: { country: "IN" },
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
                  {service.id === 7 ? "Destination" : "Drop"}
                  <MdLocationOn size={20} />
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
                    options={{
                      componentRestrictions: { country: "IN" },
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
              )}
            </div>
          )}

          {service?.id === 4 && (
            <div className="container mt-4 mb-4">
              <div className="mb-4">
                <label className="form-label">
                  Pickup and Drop Location <MdLocationOn size={20} />
                </label>
                <div className="w-100">
                  <Autocomplete
                    onLoad={handleLoadStartAutocomplete}
                    onPlaceChanged={() => {
                      if (startAutocomplete) {
                        const place = startAutocomplete.getPlace();
                        const location = place.geometry?.location;
                        if (location) {
                          const formattedAddress = place.formatted_address;
                          const coordinates = {
                            lat: location.lat(),
                            lng: location.lng(),
                          };

                          setStartPoint(formattedAddress);
                          setStartCoordinates(coordinates);

                          setEndPoint(formattedAddress);
                          setEndCoordinates(coordinates);
                        }
                      }
                    }}
                    options={{
                      componentRestrictions: { country: "IN" },
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
                      onChange={(e) => {
                        const value = e.target.value;
                        setStartPoint(value);
                        setEndPoint(value);
                      }}
                    />
                  </Autocomplete>
                </div>
              </div>

              {startPoint && endPoint && (
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
              )}
            </div>
          )}
        </>
      ) : (
        <>

        <Loader />

        </>
      )}
    </>
  );
};

export default DriverBookingMap;