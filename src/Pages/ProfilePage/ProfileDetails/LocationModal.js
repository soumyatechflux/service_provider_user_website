import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { GoogleMap, Marker, Polygon, useJsApiLoader } from "@react-google-maps/api";
import { FaLocationArrow } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../Loader/Loader";
import { FaCrosshairs } from "react-icons/fa";
import MessageModal from "../../MessageModal/MessageModal";
import marPinImg from "../../marker_pin.png";


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
  streetAddressLine2,
  addressToEditId,
}) => {
  // const DefLocCP = { lat: 28.6315, lng: 77.2167 };
  // const [location, setLocation] = useState(DefLocCP);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries: ['places']
  });

  const DEFAULT_CENTER = { lat: 28.6315, lng: 77.2167 };
  const [location, setLocation] = useState(
    latitude && longitude
      ? { lat: latitude, lng: longitude }
      : DEFAULT_CENTER
  );



  const [addressDetails, setAddressDetails] = useState({
    latitude: "",
    longitude: "",
    city: "",
    district: "",
    state: "",
    country: "India",
    postalCode: "",
    formattedAddress: "",
    landmark: "",
    streetAddressLine2: "",
  });
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  const token = sessionStorage.getItem("ServiceProviderUserToken");

  const [showMsg, setShowMsg] = useState(false);
  const handleClose = () => setShowMsg(false);
  const handleShow = () => setShowMsg(true);

  useEffect(() => {
    if (!showMsg) {
      // if (latitude && longitude) {
      if (country) {
        const initialLocation = { lat: latitude, lng: longitude };
        setLocation(initialLocation);
        setAddressDetails({
          latitude: latitude,
          longitude: longitude,
          city: city || "",
          district: district || "",
          state: state || "",
          country: country || "India",
          postalCode: postalCode || "",
          formattedAddress: formattedAddress || "",
          landmark: landmark || "", // Prefill landmark
          streetAddressLine2: streetAddressLine2 || "", // Prefill street address
        });
        setMapLoading(false); // Map is ready after pre-filling
      } else {
        // fetchCurrentLocation();
        // console.log("dsvbjnk");
        resetState();
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
      country: "India",
      postalCode: "",
      formattedAddress: "",
      landmark: "",
      streetAddressLine2: "",
    });
    setLoading(false);
    // setMapLoading(true);
    setMapLoading(false);
  };

  const NCR_BOUNDARIES = [
    { lat: 28.9, lng: 76.7 }, // Top-left (Gurgaon side)
    { lat: 28.9, lng: 77.8 }, // Top-right (Ghaziabad side)
    { lat: 27.5, lng: 77.8 }, // Bottom-right (Mathura side)
    { lat: 27.5, lng: 76.7 }, // Bottom-left (Palwal side)
  ];

  const fetchCurrentLocation = () => {
    setLoading(true);
    setMapLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let { latitude, longitude } = position.coords;

          // Define approximate Delhi NCR boundaries
          const delhiNCRBounds = {
            north: 28.9,
            south: 28.4,
            west: 76.8,
            east: 77.4,
          };

          // Check if the fetched location is outside Delhi NCR
          const isOutsideDelhiNCR =
            latitude < delhiNCRBounds.south ||
            latitude > delhiNCRBounds.north ||
            longitude < delhiNCRBounds.west ||
            longitude > delhiNCRBounds.east;

          if (isOutsideDelhiNCR) {
            // console.warn("User is outside Delhi NCR. Setting default location to Connaught Place.");
            latitude = 28.6315;
            longitude = 77.2167;
          }

          const currentLocation = { lat: latitude, lng: longitude };
          setLocation(currentLocation);
          fetchAddress(currentLocation);

          setMapLoading(false);
          setLoading(false);
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
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`
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

  const NCR_BOUNDS = {
    north: 28.9, // Top boundary (Gurgaon, Ghaziabad)
    south: 27.5, // Bottom boundary (Palwal, Mathura)
    east: 77.8, // Right boundary (Noida, Ghaziabad)
    west: 76.7, // Left boundary (Gurgaon, Manesar)
  };

  const DEFAULT_LOCATION = { lat: 28.6315, lng: 77.2167 };

  const handleMapClick = (e) => {
    const clickedLocation = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    // Check if clicked location is inside NCR boundaries
    const isInsideNCR =
      clickedLocation.lat >= NCR_BOUNDS.south &&
      clickedLocation.lat <= NCR_BOUNDS.north &&
      clickedLocation.lng >= NCR_BOUNDS.west &&
      clickedLocation.lng <= NCR_BOUNDS.east;

    if (!isInsideNCR) {
      // alert("Location outside Delhi NCR is not allowed. Defaulting to Connaught Place.");
      handleShow();
      setLocation(DEFAULT_LOCATION);
      fetchAddress(DEFAULT_LOCATION);
    } else {
      setLocation(clickedLocation);
      fetchAddress(clickedLocation);
    }
  };

  const handleResetLocation = () => {
    fetchCurrentLocation();
  };

  const isFormValid = () => {
    return (
      // addressDetails.latitude !== null &&
      // addressDetails.longitude !== null &&
      addressDetails.streetAddressLine2 !== "" &&
      // addressDetails.landmark !== "" &&
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
        latitude: addressDetails.latitude || "",
        longitude: addressDetails.longitude || "",
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
        latitude: addressDetails.latitude || "",
        longitude: addressDetails.longitude || "",
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

  const [UseMyLocation, setUseMyLocation] = useState(false);

  const handleGetCurrentLocation = () => {
    setUseMyLocation((prevState) => {
      const newState = !prevState;

      // Call handleResetLocation() only when newState (UseMyLocation) is true
      if (newState) {
        setLoading(true);

        handleResetLocation();
        setLoading(false);
      }

      return newState;
    });

    setLoading(true);

    resetState();
    setLoading(false);
  };

  useEffect(() => {
    if (show) {
      if (latitude && longitude) {
        setUseMyLocation(true);
      } else {
        setUseMyLocation(false);
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

  const spinAnimation =
    "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";

  const allStates = [
    { code: "AP", name: "Andhra Pradesh" },
    { code: "AR", name: "Arunachal Pradesh" },
    { code: "AS", name: "Assam" },
    { code: "BR", name: "Bihar" },
    { code: "CT", name: "Chhattisgarh" },
    { code: "GA", name: "Goa" },
    { code: "GJ", name: "Gujarat" },
    { code: "HR", name: "Haryana" },
    { code: "HP", name: "Himachal Pradesh" },
    { code: "JK", name: "Jammu & Kashmir" },
    { code: "JH", name: "Jharkhand" },
    { code: "KA", name: "Karnataka" },
    { code: "KL", name: "Kerala" },
    { code: "MP", name: "Madhya Pradesh" },
    { code: "MH", name: "Maharashtra" },
    { code: "MN", name: "Manipur" },
    { code: "ML", name: "Meghalaya" },
    { code: "MZ", name: "Mizoram" },
    { code: "NL", name: "Nagaland" },
    { code: "OD", name: "Odisha" },
    { code: "PB", name: "Punjab" },
    { code: "RJ", name: "Rajasthan" },
    { code: "SK", name: "Sikkim" },
    { code: "TN", name: "Tamil Nadu" },
    { code: "TS", name: "Telangana" },
    { code: "UP", name: "Uttar Pradesh" },
    { code: "WB", name: "West Bengal" },

    // Union Territories
    { code: "AN", name: "Andaman and Nicobar Islands" },
    { code: "CH", name: "Chandigarh" },
    { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
    { code: "DL", name: "Delhi" },
    { code: "LD", name: "Lakshadweep" },
    { code: "PY", name: "Puducherry" },
    { code: "LA", name: "Ladakh" },
    { code: "LD", name: "Lakshadweep" },
    { code: "ML", name: "Mizoram" },
  ];

  // Function to handle the change and allow only numbers
  const handlePostalCodeChange = (e) => {
    const value = e.target.value;
    // Check if the value is numeric
    if (/^\d*$/.test(value)) {
      setAddressDetails((prev) => ({
        ...prev,
        postalCode: value,
      }));
    } else {
      // Show a toast if the value is not numeric
      toast.error("Please enter a valid number for the postal code.");
    }
  };











  
  if (loadError) {
    console.error('Google Maps JS API failed to load', loadError);
    return <div>Error loading map</div>;
  }
  if (!isLoaded) {
    return <Loader />;
  }



  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        {loading && Loader}

        {mapLoading && Loader}

        <Modal.Header
          closeButton
          style={{
            marginBottom: "0px",
            paddingBottom: "0px",
            // backgroundColor: '#f8f9fa',
            borderBottom: "1px solid #dee2e6",
            marginTop: "-15px",
          }}
        >
          <Modal.Title
            style={{
              color: "#007bff", // Set color to blue (you can change it)
              fontSize: "24px", // Adjust the font size
              fontWeight: "bold", // Make the text bold
              textAlign: "center", // Align text to the center
              margin: "0",
              marginTop: "-15px",
            }}
          >
            Address
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            {/* {loading && <p style={{ textAlign: 'center', fontSize: '16px', color: '#007bff' }}>Loading...</p>} */}
            {mapLoading && Loader}
            {loading && Loader}

            <>
              {UseMyLocation && (
                <GoogleMap
                  mapContainerStyle={{ height: "250px", width: "100%" }}
                  center={location}
                  zoom={11} // Set zoom level accordingly
                  onClick={handleMapClick}
                  options={{
                    restriction: {
                      latLngBounds: {
                        north: 29.5, // Top boundary
                        south: 27.5, // Bottom boundary
                        east: 77.8, // Right boundary
                        west: 76.7, // Left boundary
                      },
                      strictBounds: true, // Prevent users from panning outside
                    },
                  }}
                >
                  {/* Polygon to highlight the selectable area */}
                  <Polygon
                    paths={NCR_BOUNDARIES}
                    options={{
                      fillColor: '#ADD8E6', fillOpacity: 0.35,
                      strokeColor: '#0000FF', strokeOpacity: 0.8,
                      strokeWeight: 2
                    }}
                  />















                  {/* Draggable Marker */}
                  {/* <Marker
                    position={location}
                    draggable
                    onDragEnd={handleMarkerDragEnd}
                    icon={{
                      url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Map_marker_icon_%E2%80%93_Nicolas_Mollet_%E2%80%93_Flag_%E2%80%93_Default.png",
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                  /> */}

         <Marker
       position={location}
       draggable
       onDragEnd={handleMarkerDragEnd}
       icon={{
          //  url: "https://img.icons8.com/ios-filled/50/000000/marker.png",
           url: {marPinImg},
           scaledSize: new window.google.maps.Size(40, 40),
       }}
   />


                </GoogleMap>

              )}
              <Form className="mt-4">
                {UseMyLocation && (
                  <Button
                    variant="outline-primary"
                    className="mt-3 d-flex justify-content-center align-items-center mx-auto"
                    onClick={handleResetLocation}
                  >
                    <FaLocationArrow className="mr-2" />
                    Reset to Current Location
                  </Button>
                )}
                <Button
                  variant="outline-primary"
                  className="mt-3 d-flex justify-content-center align-items-center mx-auto"
                  onClick={handleGetCurrentLocation}
                  disabled={loading}
                  style={{
                    backgroundColor: "lightgreen",
                    marginBottom: "10px",
                  }}
                >
                  <FaCrosshairs className="mr-2" />
                  {UseMyLocation
                    ? "Do not use location from the map"
                    : "Use My Current Location"}
                </Button>

                <style>{spinAnimation}</style>

                {(mapLoading || loading) && (
                  <div style={overlayStyle}>
                    <div style={loaderStyle}></div>
                  </div>
                )}

                {!UseMyLocation && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <hr
                      style={{
                        flexGrow: 1,
                        border: "0",
                        borderTop: "1px solid #000",
                      }}
                    />
                    <span style={{ padding: "0 10px" }}>OR</span>
                    <hr
                      style={{
                        flexGrow: 1,
                        border: "0",
                        borderTop: "1px solid #000",
                      }}
                    />
                  </div>
                )}

                <Form.Group controlId="streetAddressLine2" className="mt-2">
                  <Form.Label>Flat No. | Building Name *</Form.Label>
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
                  <Form.Label>Street | Area Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={addressDetails.formattedAddress}
                    onChange={(e) =>
                      setAddressDetails((prev) => ({
                        ...prev,
                        formattedAddress: e.target.value,
                      }))
                    }
                  />
                </Form.Group>

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

                <Form.Group controlId="city" className="mt-2">
                  <Form.Label>City *</Form.Label>
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
                  <Form.Label>District *</Form.Label>
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

                {/* <Form.Group controlId="state" className="mt-2">
  <Form.Label>State *</Form.Label>
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
</Form.Group> */}

                <Form.Group controlId="state" className="mt-2">
                  <Form.Label>State *</Form.Label>
                  <Form.Control
                    as="select"
                    value={addressDetails.state}
                    style={{
                      cursor: "pointer",
                      appearance: "none", // Removes default browser styling
                      backgroundImage:
                        'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 12%22%3E%3Cpath fill=%22none%22 stroke=%22%23333%22 stroke-width=%221.5%22 d=%22M1 4l5 5 5-5%22/%3E%3C/svg%3E")',
                      backgroundPosition: "right 10px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "10px",
                      paddingRight: "30px",
                    }}
                    onChange={(e) =>
                      setAddressDetails((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select a state</option>
                    {allStates?.map((state) => (
                      <option key={state.code} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="country" className="mt-2">
                  <Form.Label>Country *</Form.Label>
                  <Form.Control
                    type="text"
                    value={addressDetails.country}
                    onChange={(e) =>
                      setAddressDetails((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    disabled
                  />
                </Form.Group>

                <Form.Group controlId="postalCode" className="mt-2">
                  <Form.Label>Postal Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={addressDetails.postalCode}
                    onChange={handlePostalCodeChange}
                  />
                </Form.Group>
              </Form>
            </>
          </>
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
            {addressToEditId !== null ? "Update Location" : "Save Location"}
          </Button>
        </Modal.Footer>
      </Modal>

      {showMsg && (
        <MessageModal
          show={showMsg}
          handleClose={handleClose}
          message={
            "Location outside Delhi NCR is not allowed. Defaulting to Connaught Place."
          }
        />
      )}
    </>
  );
};

export default LocationModal;
