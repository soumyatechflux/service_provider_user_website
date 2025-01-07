import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";
import Loader from "../../../Loader/Loader";
import MessageModal from "../../../MessageModal/MessageModal";

const EditAddressForm = ({ addressId, closeModal, refreshAddresses }) => {
  const [houseNumber, setHouseNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddressLine, setStreetAddressLine] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [setaddressId, setAddressId] = useState(0);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Fetch address by ID
  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/address/${addressId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response?.data?.data;
        setAddressId(data.address_id);
        setHouseNumber(data.house || "");
        setStreetAddress(data.street_address || "");
        setStreetAddressLine(data.street_address_line2 || "");
        setLandmark(data.landmark || "");
        setCity(data.city || "");
        setState(data.state || "");
        setPincode(data.postal_code || "");
        setCountry(data.country || "");
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoading(false);
      }
    };

    if (addressId) fetchAddress();
  }, [addressId]);

  // Save address
  const handleSave = async () => {
    const updatedAddress = {
      address: {
        address_id: addressId,
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

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/address`,
        updatedAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.status === 200 && response?.data?.success) {
        setMessage(response?.data?.message || "Address updated successfully!");
        refreshAddresses(); // Refresh the address list
      } else {
        setMessage(response?.data?.message || "Failed to update Address!");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      setMessage("Failed to update address.");
    } finally {
      handleShow(); // Show the MessageModal
    }
  };

  return (
    <div className="new-address-form">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="form-group mb-2">
            <label htmlFor="houseNumber">House Number</label>
            <input
              id="houseNumber"
              type="text"
              placeholder="House Number"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="streetAddress">Street Address 1</label>
            <input
              id="streetAddress"
              type="text"
              placeholder="Street Address 1"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="streetAddressLine">Street Address 2</label>
            <input
              id="streetAddressLine"
              type="text"
              placeholder="Street Address 2"
              value={streetAddressLine}
              onChange={(e) => setStreetAddressLine(e.target.value)}
            />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="landmark">Landmark</label>
            <input
              id="landmark"
              type="text"
              placeholder="Landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2 mb-2">
            <div className="form-group flex-fill">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="form-group flex-fill">
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex gap-2 mb-2">
            <div className="form-group flex-fill">
              <label htmlFor="pincode">Pincode</label>
              <input
                id="pincode"
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>

            <div className="form-group flex-fill">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div className="new-address-actions">
            <button className="save-button" onClick={handleSave}>
              <Check size={16} /> Save
            </button>
            <button className="cancel-button" onClick={closeModal}>
              <X size={16} /> Cancel
            </button>
          </div>
        </>
      )}
      <MessageModal
        show={show}
        handleClose={() => {
          setShow(false); // Hide the MessageModal
          closeModal(); // Close the EditAddressForm modal
        }}
        message={message}
      />
      ;
    </div>
  );
};

export default EditAddressForm;
