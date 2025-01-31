import React, { useState, useEffect, useRef, useCallback } from "react";
import { Pencil, MapPin, Plus, Pen, Check, X } from "lucide-react";
import "./ProfileDetails.css";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { BsPencil, BsTrash, BsThreeDotsVertical } from "react-icons/bs";
import { Modal, Button } from "react-bootstrap";
import MessageModal from "../../MessageModal/MessageModal";
import { toast } from "react-toastify";
import { useJsApiLoader } from "@react-google-maps/api";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import LocationModal from "./LocationModal";
import { FaCopy, FaWhatsapp, FaFacebook, FaTwitter, FaEnvelope } from "react-icons/fa";

const ProfileDetails = () => {
  const [profileDataResponse, setProfileDataResponse] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [editingField, setEditingField] = useState(null); // Track which field is being edited
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false); // New state for address form
  const [isEditingAddress, setIsEditingAddress] = useState(false); // State for editing address modal
  const [isDeletingAddress, setIsDeletingAddress] = useState(false); // State for deleting address modal
  const [addressToEdit, setAddressToEdit] = useState(null); // Track the address being edited
  const [addressToDelete, setAddressToDelete] = useState(null); // Track the address being deleted
  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [message, setMessage] = useState("");
  const handleShow = () => setShow(true);

  const [referralCode, setReferralCode] = useState(""); // State for referral code

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const dropdownRefs = useRef([]);

  const handleDropdownToggle = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleOutsideClick = useCallback((e) => {
    // Check if dropdownRefs.current exists and has entries
    if (dropdownRefs.current) {
      const clickedOutside = Object.values(dropdownRefs.current).every(
        (ref) => !ref || !ref.contains(e.target)
      );

      if (clickedOutside) {
        setOpenDropdownIndex(null);
      }
    }
  }, []);

  // Add event listener for outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);
  useEffect(() => {
    dropdownRefs.current = {};
  }, [addresses]);

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.status && response?.data?.success) {
        setProfileDataResponse(response?.data?.data);
        const data = response?.data?.data;
        setAvatar(data.image || data.name.charAt(0).toUpperCase());
        setName(data?.name);
        setPhone(data.mobile);
        setEmail(data.email);
        setAddresses(data?.address);
        setEditedProfile(data); // Pre-fill the editedProfile state
        setReferralCode(data?.referral_code || "N/A"); // Set referral code from API
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setMessage("Referral code copied!"); // Set success message
    setShow(true); // Show modal
};

const shareText = `Use my referral code *${referralCode}* to sign up and enjoy benefits!`;
    const currentURL = window.location.href;

    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentURL)}`;
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    const emailURL = `mailto:?subject=Join with my referral code&body=${encodeURIComponent(shareText)}`;

  const handleDelete = async (id) => {
    try {
      setLoading(true); // Show a loading spinner or disable UI during API call
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/address/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.status && response?.data?.success) {
        setIsDeletingAddress(false); // Close the modal

        toast.success("Address deleted successfully");
        fetchProfile();
      }
    } catch (err) {
      console.error("Error deleting address:", err);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const saveChanges = async () => {
    try {
      setLoading(true);

      // Validation for empty name
      if (
        editingField === "name" &&
        (!editedProfile.name || editedProfile.name.trim() === "")
      ) {
        setLoading(false);
        setMessage("Name should not be empty.");
        setShow(true);
        handleShow(); // Show the modal
        return;
      }

      const data = new FormData();

      if (editingField === "image" && editedProfile.image) {
        data.append("image", editedProfile.image || null);
      } else if (editingField === "name") {
        data.append("name", editedProfile.name);
      } else if (editingField === "email") {
        data.append("email", editedProfile.email);
      } else if (editingField === "mobile") {
        data.append("mobile", editedProfile.mobile);
      }

      setIsEditing(false);
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/profile`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.status === 200 && response?.data?.success) {
        setProfileDataResponse(response.data.data);
        setEditedProfile(response.data.data);
        setIsEditing(false);
        setEditingField(null);
        setMessage("Profile Data Updated successfully");
        setShow(true);
        handleShow(); // Show the modal
        return;
      } else {
        setMessage(response?.data?.message || "");
        setShow(true);
        handleShow();
      }
    } catch (err) {
      console.error("Error saving profile changes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle avatar change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditedProfile((prev) => ({
        ...prev,
        image: file,
      }));
      setEditingField("image");
    } else {
      setEditedProfile((prev) => ({
        ...prev,
        image: null,
      }));
      setEditingField("image");
    }
  };

  const cancelEdit = () => {
    setEditedProfile({ ...profileDataResponse });
    setIsEditing(false);
    setEditingField(null);
    setEditedProfile(profileDataResponse); // Reset editedProfile to initial data
  };

  const [locationData, setLocationData] = useState({
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

  const fetchDefaultAddress = async (addressId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/address/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();

        if (result.success === true) {
          const data = result.data; // Data fetched successfully

          setLocationData({
            latitude: data?.latitude || "",
            longitude: data?.longitude || "",
            city: data?.city || "",
            district: data?.district || "",
            state: data?.state || "",
            country: data?.country || "",
            postalCode: data?.postal_code || "", // Correcting the naming
            formattedAddress: data?.formatted_address || "", // Correcting the naming
            landmark: data?.landmark || "",
            streetAddressLine2: data?.street_address_line2 || "", // Correcting the naming
          });
          setLoading(false);
        } else {
          setLoading(false);
          // Show error message via toast
          toast.error(`Failed to fetch address: ${result.message}`);
        }
      } else {
        setLoading(false);
        // Handle failed response status
        toast.error("Error fetching address: " + response.statusText);
      }
    } catch (error) {
      setLoading(false);
      // Show error message via toast
      toast.error(`Error fetching address: ${error.message}`);
    }
  };

  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  // });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY, // Your API key
    libraries: ["places"], // Add the Places library here
  });

  if (!isLoaded) {
    return null; // Or show a custom loader component.
  }

  return (
    <>
      {loading && Loader}

      <div className="container nav-container profile-container">
        <h1>Profile</h1>

        {loading && (
          <div className="loader-overlay">
            <div className="spinner"></div>
          </div>
        )}

        <div className="profile-content">
          {/* Avatar Section */}
          <div className="avatar-div">
            <div className="avatar">
              {editedProfile.image ? (
                <img
                  src={
                    editedProfile.image
                      ? typeof editedProfile.image === "string"
                        ? editedProfile.image
                        : URL.createObjectURL(editedProfile.image)
                      : "/dummy-image.jpg"
                  }
                  alt="Profile"
                  onError={(e) => (e.target.src = "/dummy-image.jpg")} // Fallback if the image URL fails
                  className="avatar-img"
                />
              ) : (
                <span className="avatar-placeholder">
                  {profileDataResponse?.name?.charAt(0).toUpperCase()}
                </span>
              )}

              <button
                className="avatar-edit"
                onClick={() => {
                  document.getElementById("fileInput").click(); // Trigger file input click
                  setIsEditing(true);
                  setEditingField("image");
                }}
              >
                <Pen size={16} />
              </button>

              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="details-section">
            {/* Name */}
            <div className="detail-item">
              <label>Full Name</label>
              <div className="detail-value">
                {isEditing && editingField === "name" ? (
                  <input
                    type="text"
                    value={editedProfile.name} // Autofill with state
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                ) : (
                  <>
                    {profileDataResponse?.name && (
                      <span>{profileDataResponse.name}</span>
                    )}
                  </>
                )}
                <button
                  className="edit-button"
                  onClick={() => {
                    setIsEditing(true);
                    setEditingField("name");
                  }}
                >
                  <Pencil size={16} />
                </button>
              </div>
            </div>

            {/* Mobile */}
            <div className="detail-item">
              <label>Mobile Number</label>
              <div className="detail-value">
                {isEditing && editingField === "mobile" ? (
                  <input
                    type="text"
                    value={editedProfile.mobile || phone} // Autofill with state
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    disabled
                  />
                ) : (
                  <span>{profileDataResponse.mobile}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="detail-item">
  <label>Email</label>
  <div className="detail-value">
    {isEditing && editingField === "email" ? (
      <input
        type="email"
        value={editedProfile.email || ""} // Ensure controlled input
        onChange={(e) => handleInputChange("email", e.target.value)}
      />
    ) : (
      <span>{profileDataResponse.email}</span>
    )}
    <button
      className="edit-button"
      onClick={() => {
        setIsEditing(true);
        setEditingField("email");
        setEditedProfile((prev) => ({
          ...prev,
          email: profileDataResponse.email || "", // Initialize with current email
        }));
      }}
    >
      <Pencil size={16} />
    </button>
  </div>
</div>



            {isEditing && (
              <div className="edit-actions">
                <button
                  className="save-button btn-edit-profile"
                  onClick={saveChanges}
                >
                  <Check size={16} /> Save
                </button>
                <button
                  className="cancel-button btn-edit-profile"
                  onClick={cancelEdit}
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Address Section */}
          <div className="address-section">
            <div className="address-header">
              <MapPin size={20} />
              <h2>Manage Address</h2>
            </div>

            {addresses.map((address, index) => (
              <div key={address.id} className="mb-3">
                <div className="d-flex align-items-center">
                  <p className="flex-fill mb-0 address-p">
                    <span className="serial-number me-2">{index + 1}.</span>
                    <>
      {address.street_address_line2 ? address.street_address_line2 + ", " : ""}
      {address.landmark ? address.landmark + ", " : ""}
      {address.city ? address.city + ", " : ""}
      {address.district ? address.district + ", " : ""}
      {address.state ? address.state + ", " : ""}
      {address.postal_code ? address.postal_code + ", " : ""}
      {address.country ? address.country : ""}
    </>
                  </p>

                  <div
                    className="position-relative"
                    ref={(el) => {
                      if (el) {
                        dropdownRefs.current[index] = el;
                      } else {
                        delete dropdownRefs.current[index];
                      }
                    }}
                  >
                    <button
                      className="custom-dropdown-toggle"
                      onClick={() => handleDropdownToggle(index)}
                    >
                      <BsThreeDotsVertical
                        size={18}
                        style={{ cursor: "pointer" }}
                      />
                    </button>
                    {openDropdownIndex === index && (
                      <div className="custom-dropdown-menu1">
                        <button
                          className="custom-dropdown-item"
                          onClick={() => {
                            fetchDefaultAddress(address?.address_id);
                            setAddressToEdit(address?.address_id);
                            setIsEditingAddress(true);
                            setOpenDropdownIndex(null);
                          }}
                        >
                          <BsPencil size={16} className="me-2" /> Edit
                        </button>

                        <button
                          className="custom-dropdown-item"
                          onClick={() => {
                            setAddressToDelete(address?.address_id);
                            setIsDeletingAddress(true);
                            setOpenDropdownIndex(null); // Close dropdown
                          }}
                        >
                          <BsTrash size={16} className="me-2" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="container mt-5 mb-5">
              <Button
                onClick={() => setIsAddingAddress(true)}
                className="btn btn-primary nav-buttons"
              >
                {" "}
                + Add New Address
              </Button>
              <LocationModal
                show={isAddingAddress}
                onHide={() => {
                  setIsAddingAddress(false);
                  fetchProfile();
                }}
                latitude=""
                longitude=""
                city=""
                district=""
                state=""
                country=""
                postalCode=""
                formattedAddress=""
                landmark=""
                streetAddressLine2=""
                addressToEditId={null}
              />
            </div>

            {/* Modal for Editing Address */}

            <div>
              {/* <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
{isEditingAddress && (
     <LocationModal
        show={isEditingAddress}
        onHide={() => {
          setIsEditingAddress(false);
          fetchProfile();
        }}
        latitude={Number(locationData.latitude)}
        longitude={Number(locationData.longitude)}        
        city={locationData.city}
        district={locationData.district}
        state={locationData.state}
        country={locationData.country}
        postalCode={locationData.postalCode}
        formattedAddress={locationData.formattedAddress}
        landmark={locationData.landmark}
        streetAddressLine2={locationData.streetAddressLine2}
        addressToEditId={addressToEdit}
      />
    )}

      </LoadScript> */}

              <LocationModal
                show={isEditingAddress}
                onHide={() => {
                  setIsEditingAddress(false);
                  fetchProfile();
                }}
                latitude={Number(locationData.latitude)}
                longitude={Number(locationData.longitude)}
                city={locationData.city}
                district={locationData.district}
                state={locationData.state}
                country={locationData.country}
                postalCode={locationData.postalCode}
                formattedAddress={locationData.formattedAddress}
                landmark={locationData.landmark}
                streetAddressLine2={locationData.streetAddressLine2}
                addressToEditId={addressToEdit}
              />
            </div>

            {/* Modal for Deleting Address */}
            <Modal
              show={isDeletingAddress}
              onHide={() => setIsDeletingAddress(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Delete Address</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to delete this address?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setIsDeletingAddress(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleDelete(addressToDelete);
                  }}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>

      <div className="container nav-container profile-container">
        <h1 >Share You Referral Code</h1>
      <div className="referral-container">
                {/* Referral Code */}
                <span className="referral-code">{referralCode}</span>

                {/* Copy Button */}
                <button className="icon-btn copy-btn" onClick={copyToClipboard}>
                    <FaCopy />
                </button>

                {/* Social Media Share Buttons */}
                <a href={whatsappURL} target="_blank" rel="noopener noreferrer" className="icon-btn whatsapp">
                    <FaWhatsapp />
                </a>
                <a href={facebookURL} target="_blank" rel="noopener noreferrer" className="icon-btn facebook">
                    <FaFacebook />
                </a>
                <a href={twitterURL} target="_blank" rel="noopener noreferrer" className="icon-btn twitter">
                    <FaTwitter />
                </a>
                <a href={emailURL} className="icon-btn email">
                    <FaEnvelope />
                </a>
            </div>
      </div>

      <MessageModal show={show} handleClose={handleClose} message={message} />
    </>
  );
};

export default ProfileDetails;
