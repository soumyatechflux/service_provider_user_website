import React, { useState } from "react";
import { Check, X } from "react-feather";
import MessageModal from "../../../MessageModal/MessageModal";
import Loader from "../../../Loader/Loader";
import axios from "axios";
import './AddAddressForm.css'

const AddAddressForm = ({ cancelAddAddress, fetchProfile }) => {
  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [modalMessage, setModalMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loading, setLoading] = useState(false);

  const [houseNumber, setHouseNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddressLine, setStreetAddressLine] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");

  const [errors, setErrors] = useState({
    houseNumber: "",
    streetAddress: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!houseNumber) newErrors.houseNumber = "House number is required.";
    if (!streetAddress) newErrors.streetAddress = "Street address is required.";
    if (!city) newErrors.city = "City is required.";
    if (!state) newErrors.state = "State is required.";
    if (!pincode) newErrors.pincode = "Pincode is required.";
    else if (!/^\d{6}$/.test(pincode)) newErrors.pincode = "Pincode must be a 6-digit number.";
    if (!country) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = async () => {
    if (!validateForm()) return; // Stop if validation fails

    try {
      if (!token) {
        setModalMessage("Please log in first.");
        handleShow();
        return;
      }

      const body = {
        address: {
          house: houseNumber,
          street_address: streetAddress,
          street_address_line2: streetAddressLine,
          landmark: landmark,
          city: city,
          state: state,
          postal_code: pincode,
          country: country,
        },
      };

      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/address/add`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.status === 200 && response?.data?.success) {
        setModalMessage("Address Added Successfully.");
        handleShow();
        fetchProfile();
        cancelAddAddress();
      } else {
        setModalMessage(response?.data?.message || "Failed to add address");
        handleShow();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setModalMessage("An error occurred. Please check your connection.");
      handleShow();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="new-address-form">
        <div className="form-group form-group-address">
          <label htmlFor="houseNumber">House Number</label>
          <input
            type="text"
            id="houseNumber"
            className="input-house-number"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
          />
          {errors.houseNumber && <p className="error">{errors.houseNumber}</p>}
        </div>

        <div className="form-group form-group-address">
          <label htmlFor="streetAddress">Street Address 1</label>
          <input
            type="text"
            id="streetAddress"
            className="input-street-address"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
          />
          {errors.streetAddress && <p className="error">{errors.streetAddress}</p>}
        </div>

        <div className="form-group form-group-address">
          <label htmlFor="streetAddressLine">Street Address 2</label>
          <input
            type="text"
            id="streetAddressLine"
            className="input-street-address-line"
            value={streetAddressLine}
            onChange={(e) => setStreetAddressLine(e.target.value)}
          />
        </div>

        <div className="form-group form-group-address">
          <label htmlFor="landmark">Landmark</label>
          <input
            type="text"
            id="landmark"
            className="input-landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
          />
        </div>

        <div className="form-group d-flex gap-2 form-group-address">
          <div className="flex-1">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              className="input-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && <p className="error">{errors.city}</p>}
          </div>

          <div className="flex-1">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              className="input-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            {errors.state && <p className="error">{errors.state}</p>}
          </div>
        </div>

        <div className="form-group d-flex gap-2 form-group-address">
          <div className="flex-1">
            <label htmlFor="pincode">Pincode</label>
            <input
              type="text"
              id="pincode"
              className="input-pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            {errors.pincode && <p className="error">{errors.pincode}</p>}
          </div>

          <div className="flex-1">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              className="input-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            {errors.country && <p className="error">{errors.country}</p>}
          </div>
        </div>

        <div className="new-address-actions">
          <button className="save-button" onClick={handleAddAddress}>
            <Check size={16} /> Save
          </button>
          <button className="cancel-button" onClick={cancelAddAddress}>
            <X size={16} /> Cancel
          </button>
        </div>
      </div>

      <MessageModal
        show={show}
        handleClose={handleClose}
        message={modalMessage}
      />
    </>
  );
};

export default AddAddressForm;
