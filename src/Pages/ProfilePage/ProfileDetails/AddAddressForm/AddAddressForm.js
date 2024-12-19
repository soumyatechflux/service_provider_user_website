import React, { useState } from "react";
import { Check, X } from "react-feather";
import MessageModal from "../../../MessageModal/MessageModal";
import Loader from "../../../Loader/Loader";
import axios from "axios";

const AddAddressForm = ({ cancelAddAddress,fetchProfile }) => {
  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [modalMessage,setModalMessage]=useState("")
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const[loading,setLoading]=useState(false)

  const [houseNumber, setHouseNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddressLine, setStreetAddressLine] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");

  const handleAddAddress = async () => {
    try {
      if (!token) {
        // toast.info("Please log in first.");
        setModalMessage("Please log in first.");
        handleShow(true);
        return;
      }

    
      const body = {

        address:{
          house: houseNumber,
          street_address:streetAddress,
          street_address_line2:streetAddressLine,
          landmark:landmark,
          city:city,
          state:state,
          postal_code:pincode,
          country:country
        }
      
      };
    

      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/address/add`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response)
      if(response?.status===200 && response?.data?.success){
       
        setModalMessage("Address Added Successfully.");
        handleShow();
        fetchProfile();
        cancelAddAddress();
      }
      else{
        setModalMessage(response?.data?.message||"Failed to add address");
        handleShow()
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // toast.error("An error occurred. Please check your connection.");
      setModalMessage("An error occurred. Please check your connection.");
       handleShow()
    } finally {
      setLoading(false);
    }
  };

  if(loading){
    return <Loader/>
  }
  
  return (
    <>
       <div className="new-address-form">
      <input
        type="text"
        placeholder="House Number"
        value={houseNumber}
        onChange={(e) => setHouseNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Street Address 1"
        value={streetAddress}
        onChange={(e) => setStreetAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Street Address 2"
        value={streetAddressLine}
        onChange={(e) => setStreetAddressLine(e.target.value)}
      />
      <input
        type="text"
        placeholder="Landmark"
        value={landmark}
        onChange={(e) => setLandmark(e.target.value)}
      />

      <div className="d-flex gap-2">
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </div>
      <div className="d-flex gap-2">
        <input
          type="text"
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
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
        handleShow={handleShow}
        message={modalMessage}
      />
    </>
   
  );
};

export default AddAddressForm;
