import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Spinner } from "react-bootstrap"; // Import Spinner for loading indicator
import { FaLocationArrow } from "react-icons/fa";

const LocationModal = ({
  show,
  onHide,
  latitude,
  longitude,
  city,
  district,
  state,
  country,
  postalCode,
  formattedAddress,
}) => {
  const [location, setLocation] = useState(null); // User's selected location
  const [addressDetails, setAddressDetails] = useState({
    latitude: "",
    longitude: "",
    city: "",
    district: "",
    state: "",
    country: "",
    postalCode: "",
    formattedAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    if (show) {
      if (latitude && longitude) {
        // Prefill data if latitude and longitude are passed as props
        const initialLocation = { lat: latitude, lng: longitude };
        setLocation(initialLocation);
        setAddressDetails({
          latitude: latitude,
          longitude: longitude,
          city: city || "",
          district: district || "",
          state: state || "",
          country: country || "", // Ensure this is set correctly
          postalCode: postalCode || "",
          formattedAddress: formattedAddress || "",
        });
        setMapLoading(false); // Map is ready after pre-filling
      } else {
        fetchCurrentLocation(); // Fetch current location if no props data
      }
    } else {
      resetState();
    }
  }, [show, latitude, longitude, city, district, state, country, postalCode, formattedAddress]);
  
  const resetState = () => {
    setLocation(null);
    setAddressDetails({
      latitude: "",
      longitude: "",
      city: "",
      district: "",
      state: "",
      country: "",
      postalCode: "",
      formattedAddress: "",
    });
    setLoading(false);
    setMapLoading(true); // Reset map loading when the modal is closed
  };

  const fetchCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = { lat: latitude, lng: longitude };
          setLocation(currentLocation);
          fetchAddress(currentLocation);
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setAddressDetails((prev) => ({
            ...prev,
            formattedAddress: "Unable to get location. Please enable location access.",
          }));
          setLoading(false);
          setMapLoading(false); // Stop loading once error occurs
        }
      );
    } else {
      setAddressDetails((prev) => ({
        ...prev,
        formattedAddress: "Geolocation not supported by this browser.",
      }));
      setLoading(false);
      setMapLoading(false); // Stop loading once error occurs
    }
  };
  const fetchAddress = async (location) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.REACT_APP_GEOLOCATION_API_KEY}`
      );
  
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;
  
        const getComponent = (type) =>
          addressComponents.find((comp) => comp.types.includes(type))?.long_name || "";
  
        setAddressDetails({
          latitude: location.lat,
          longitude: location.lng,
          city: getComponent("locality"),
          district: getComponent("administrative_area_level_2"),
          state: getComponent("administrative_area_level_1"),
          country: getComponent("country"), // Ensure this is using 'country' key
          postalCode: getComponent("postal_code"),
          formattedAddress: result.formatted_address,
        });
      } else {
        setAddressDetails((prev) => ({
          ...prev,
          formattedAddress: "No address found for this location.",
        }));
      }
    } catch (error) {
      console.error("Error fetching address:", error.message);
      setAddressDetails((prev) => ({
        ...prev,
        formattedAddress: "Error fetching address.",
      }));
    } finally {
      setLoading(false);
      setMapLoading(false); // Map loading is complete
    }
  };
  

  const handleMarkerDragEnd = (e) => {
    const newLocation = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setLocation(newLocation);
    fetchAddress(newLocation);
  };

  const handleMapClick = (e) => {
    const clickedLocation = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setLocation(clickedLocation);
    fetchAddress(clickedLocation);
  };

  const handleResetLocation = () => {
    fetchCurrentLocation();
  };

  const handleSave = () => {
    alert(`Saved Location: ${addressDetails.formattedAddress}`);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Choose Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <p>Fetching location...</p>}
        {!loading && mapLoading && (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p>Loading map...</p>
          </div>
        )}
        {!loading && !mapLoading && location && (
          <>
            <GoogleMap
              mapContainerStyle={{ height: "400px", width: "100%" }}
              center={location}
              zoom={15}
              onClick={handleMapClick}
            >
              <Marker
                position={location}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
                icon={{
                  url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Map_marker_icon_%E2%80%93_Nicolas_Mollet_%E2%80%93_Flag_%E2%80%93_Default.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            </GoogleMap>
            <Form className="mt-4">
            <Button
  variant="outline-primary"
  className="mt-3 d-flex justify-content-center align-items-center mx-auto"
  onClick={handleResetLocation}
>
  <FaLocationArrow className="mr-2" />
  Reset to Current Location
</Button>
              <Form.Group controlId="latitude">
                <Form.Label>Latitude</Form.Label>
                <Form.Control type="text" value={addressDetails.latitude} disabled />
              </Form.Group>
              <Form.Group controlId="longitude" className="mt-2">
                <Form.Label>Longitude</Form.Label>
                <Form.Control type="text" value={addressDetails.longitude} disabled />
              </Form.Group>
              <Form.Group controlId="city" className="mt-2">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" value={addressDetails.city} />
              </Form.Group>
              <Form.Group controlId="district" className="mt-2">
                <Form.Label>District</Form.Label>
                <Form.Control type="text" value={addressDetails.district} />
              </Form.Group>
              <Form.Group controlId="state" className="mt-2">
                <Form.Label>State</Form.Label>
                <Form.Control type="text" value={addressDetails.state} />
              </Form.Group>
              <Form.Group controlId="country" className="mt-2">
                <Form.Label>Country</Form.Label>
                <Form.Control type="text" value={addressDetails.country} />
              </Form.Group>
              <Form.Group controlId="postalCode" className="mt-2">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control type="text" value={addressDetails.postalCode} />
              </Form.Group>
              <Form.Group controlId="formattedAddress" className="mt-2">
                <Form.Label>Formatted Address</Form.Label>
                <Form.Control type="text" value={addressDetails.formattedAddress} />
              </Form.Group>
            </Form>
       
          </>
        )}
        {!loading && !mapLoading && !location && (
          <p>Click "Get Live Location" to fetch your location.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="primary"
          disabled={!location || !addressDetails.formattedAddress || loading}
          onClick={handleSave}
        >
          Save Location
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationModal;
