import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MdLocationOn } from "react-icons/md";
import Loader from "../../Loader/Loader";
import debounce from "lodash.debounce";


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

    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
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
      (error) => {
        console.error("Error fetching current location:", error);
        alert("Please enable location access or set a manual location.");
      }
    );
  }, [service]);
  

  // Fetch address from coordinates
  const fetchAddress = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`
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
  //   if (startPoint !== "My Current Location" && endPoint && startCoordinates && endCoordinates) {
  //     calculateRoute();
  //   }
  // }, [startPoint, endPoint, startCoordinates, endCoordinates,distance,duration]);

  


  const debounceTime = 600;
  let debounceTimer = null;
  
  useEffect(() => {
    if (
      startPoint !== "My Current Location" &&
      endPoint &&
      startCoordinates &&
      endCoordinates
    ) {
      // Clear previous debounce timer
      clearTimeout(debounceTimer);
  
      // Set a new debounce timer
      debounceTimer = setTimeout(() => {
        calculateRoute();
      }, debounceTime);
    }
  
    return () => clearTimeout(debounceTimer);
  }, [startPoint, endPoint, startCoordinates, endCoordinates]);

  

  useEffect(() => {
    if (DriverCoordinates) {
      const { startPoint, endPoint, startCoordinates, endCoordinates } = DriverCoordinates;
  
      setStartPoint(startPoint || "");
      setEndPoint(endPoint || "");
      setStartCoordinates(startCoordinates || null);
      setEndCoordinates(endCoordinates || null);
  
      // Fetch location only if required values are missing
      if (!(startPoint && endPoint && startCoordinates && endCoordinates)) {
        getCurrentLocation();
      }
    } else {
      getCurrentLocation();
    }
  }, [DriverCoordinates, getCurrentLocation]);
  







  if (!isLoaded || loading) {
    return <Loader />;
  }
  


  return (
    <>
      {(loading || !isLoaded )&& (
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