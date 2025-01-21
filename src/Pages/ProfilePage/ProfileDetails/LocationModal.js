import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Spinner } from "react-bootstrap"; // Import Spinner for loading indicator
import { FaLocationArrow } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../Loader/Loader";


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
  landmark,
  streetAddressLine2, // New props for landmark and street address
  addressToEditId
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
    landmark: "", // Initialize landmark
    streetAddressLine2: "", // Initialize street address
  });
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  const token = sessionStorage.getItem("ServiceProviderUserToken");

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
          country: country || "",
          postalCode: postalCode || "",
          formattedAddress: formattedAddress || "",
          landmark: landmark || "", // Prefill landmark
          streetAddressLine2: streetAddressLine2 || "", // Prefill street address
        });
        setMapLoading(false); // Map is ready after pre-filling
      } else {
        fetchCurrentLocation(); // Fetch current location if no props data
      }
    } else {
      resetState();
    }
  }, [
    show,
    latitude,
    longitude,
    city,
    district,
    state,
    country,
    postalCode,
    formattedAddress,
    landmark,
    streetAddressLine2,
  ]);

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
      landmark: "",
      streetAddressLine2: "",
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
            formattedAddress:
              "Unable to get location. Please enable location access.",
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
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.REACT_APP_GEOLOCATION_API_KEY}`
      );

      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;

        const getComponent = (type) =>
          addressComponents.find((comp) => comp.types.includes(type))
            ?.long_name || "";

        setAddressDetails({
          latitude: location.lat,
          longitude: location.lng,
          city: getComponent("locality"),
          district: getComponent("administrative_area_level_2"),
          state: getComponent("administrative_area_level_1"),
          country: getComponent("country"),
          postalCode: getComponent("postal_code"),
          formattedAddress: result.formatted_address,
          landmark: "", 
          streetAddressLine2: "", 
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



  const isFormValid = () => {
    return (
      addressDetails.latitude !== null &&
      addressDetails.longitude !== null &&
      addressDetails.streetAddressLine2 !== "" &&
      addressDetails.landmark !== "" &&
      addressDetails.city !== "" &&
      addressDetails.state !== "" &&
      addressDetails.postalCode !== "" &&
      addressDetails.country !== "" &&
      addressDetails.district !== "" &&
      addressDetails.formattedAddress !== ""
    );
  };
  

  const handleSave = async () => {
    

    if (!isFormValid()) {
      toast.error("Please fill in all fields.");
      return;
    }


    // Prepare the body for the API request
    const body = {
      address: {
        latitude: addressDetails.latitude || null,
        longitude: addressDetails.longitude || null,
        street_address_line2: addressDetails.streetAddressLine2 || "",
        landmark: addressDetails.landmark || "",
        city: addressDetails.city || "",
        state: addressDetails.state || "",
        postal_code: addressDetails.postalCode || "",
        country: addressDetails.country || "",
        district: addressDetails.district || "",
        formatted_address: addressDetails.formattedAddress || "",
      },
    };
  
    setLoading(true);

    try {
      // Make the API POST request to save the address
      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/address/add`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Handle the response from the API
      if (response.data.success) {
        toast.success("Address saved successfully!");
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(`Failed to save address: ${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error(`Error saving address: ${error.message}`);
    }
    
    // Optionally hide the modal or perform any other actions
    onHide();
  };








  
  const handleUpdate = async () => {
    

    if (!isFormValid()) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Prepare the body for the API request
    const body = {
      address: {
        address_id: addressToEditId,
        latitude: addressDetails.latitude || null,
        longitude: addressDetails.longitude || null,
        street_address_line2: addressDetails.streetAddressLine2 || "",
        landmark: addressDetails.landmark || "",
        city: addressDetails.city || "",
        state: addressDetails.state || "",
        postal_code: addressDetails.postalCode || "",
        country: addressDetails.country || "",
        district: addressDetails.district || "",
        formatted_address: addressDetails.formattedAddress || "",
      },
    };
  
    setLoading(true);

    try {
      // Make the API POST request to save the address
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/address`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Handle the response from the API
      if (response.data.success) {
        toast.success("Address updated successfully!");
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(`Failed to update address: ${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error(`Error in updating address: ${error.message}`);
    }
    
    // Optionally hide the modal or perform any other actions
    onHide();
  };




  return (
    <>

   


    <Modal show={show} onHide={onHide} size="lg">

{loading && Loader}


      <Modal.Header closeButton>
        <Modal.Title>Choose Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
 
      {loading && <p style={{ textAlign: 'center', fontSize: '16px', color: '#007bff' }}>Loading...</p>}



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

              {/* <Form.Group controlId="latitude">
                <Form.Label>Latitude</Form.Label>
                <Form.Control type="text" value={addressDetails.latitude} disabled />
              </Form.Group>
              <Form.Group controlId="longitude" className="mt-2">
                <Form.Label>Longitude</Form.Label>
                <Form.Control type="text" value={addressDetails.longitude} disabled />
              </Form.Group> */}

<Form.Group controlId="landmark" className="mt-2">
  <Form.Label>Landmark</Form.Label>
  <Form.Control
    type="text"
    value={addressDetails.landmark}
    onChange={(e) =>
      setAddressDetails((prev) => ({
        ...prev,
        landmark: e.target.value,
      }))
    }
  />
</Form.Group>

<Form.Group controlId="streetAddressLine2" className="mt-2">
  <Form.Label>Full Address</Form.Label>
  <Form.Control
    type="text"
    value={addressDetails.streetAddressLine2}
    onChange={(e) =>
      setAddressDetails((prev) => ({
        ...prev,
        streetAddressLine2: e.target.value,
      }))
    }
  />
</Form.Group>

<Form.Group controlId="formattedAddress" className="mt-2">
  <Form.Label>Formatted Address</Form.Label>
  <Form.Control type="text" value={addressDetails.formattedAddress} disabled />
</Form.Group>

<Form.Group controlId="city" className="mt-2">
  <Form.Label>City</Form.Label>
  <Form.Control
    type="text"
    value={addressDetails.city}
    onChange={(e) =>
      setAddressDetails((prev) => ({
        ...prev,
        city: e.target.value,
      }))
    }
  />
</Form.Group>

<Form.Group controlId="district" className="mt-2">
  <Form.Label>District</Form.Label>
  <Form.Control
    type="text"
    value={addressDetails.district}
    onChange={(e) =>
      setAddressDetails((prev) => ({
        ...prev,
        district: e.target.value,
      }))
    }
  />
</Form.Group>

<Form.Group controlId="state" className="mt-2">
  <Form.Label>State</Form.Label>
  <Form.Control
    type="text"
    value={addressDetails.state}
    onChange={(e) =>
      setAddressDetails((prev) => ({
        ...prev,
        state: e.target.value,
      }))
    }
  />
</Form.Group>

<Form.Group controlId="country" className="mt-2">
  <Form.Label>Country</Form.Label>
  <Form.Control
    type="text"
    value={addressDetails.country}
    onChange={(e) =>
      setAddressDetails((prev) => ({
        ...prev,
        country: e.target.value,
      }))
    }
  />
</Form.Group>

<Form.Group controlId="postalCode" className="mt-2">
  <Form.Label>Postal Code</Form.Label>
  <Form.Control
    type="text"
    value={addressDetails.postalCode}
    onChange={(e) =>
      setAddressDetails((prev) => ({
        ...prev,
        postalCode: e.target.value,
      }))
    }
  />
</Form.Group>

             
            </Form>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
  variant="primary" 
  onClick={() => {
    if (addressToEditId !== null) {
      handleUpdate();
    } else {
      handleSave(); 
    }
  }}
>
  {addressToEditId !== null ? 'Update Location' : 'Save Location'}
</Button>

      </Modal.Footer>
    </Modal>
    </>
  );
};

export default LocationModal;
