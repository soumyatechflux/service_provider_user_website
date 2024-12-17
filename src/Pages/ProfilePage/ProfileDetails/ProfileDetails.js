import React, { useEffect, useState } from "react";
import { Pencil, MapPin, Plus, Pen, Check, X } from "lucide-react";
import "./ProfileDetails.css";
import { getProfileAPI, editProfileAPI } from "../../../utils/APIs/ProfileApis/ProfileApi";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { BsPencil, BsTrash, BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import AddAddressForm from "./../ProfileDetails/AddAddressForm/AddAddressForm"; // Import the new form component
import EditAddressForm from "./EditAddressForm/EditAddressForm";
import MessageModal from "../../MessageModal/MessageModal";

const ProfileDetails = () => {
  const [profileDataResponse, setProfileDataResponse] = useState(null);
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

 
  const [newAddress, setNewAddress] = useState({
    houseNumber: "",
    streetAddress: "",
    streetAddressLine: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const handleAddressChange = (field, value) => {
    setNewAddress({ ...newAddress, [field]: value });
  };

  const addNewAddress = () => {
    setAddresses([...addresses, newAddress]);
    setNewAddress({
      houseNumber: "",
      streetAddress: "",
      streetAddressLine: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    });
    setIsAddingAddress(false);
  };

  const cancelAddAddress = () => {
    setNewAddress({
      houseNumber: "",
      streetAddress: "",
      streetAddressLine: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    });
    setIsAddingAddress(false);
  };




   


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
        setName(data.name);
        setPhone(data.mobile);
        setEmail(data.email);
        setAddresses(data?.address);
        setEditedProfile(data); // Pre-fill the editedProfile state
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


  const handleDelete = async (id) => {
    try {
      setLoading(true); // Show a loading spinner or disable UI during API call
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/address/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response?.status && response?.data?.success) {
        setIsDeletingAddress(false); // Close the modal
        // Optionally refresh the address list or notify the user
        console.log("Address deleted successfully");
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
      const data = new FormData();

      if (editingField === "image" && editedProfile.image) {
        data.append("image", editedProfile.image);
      } else if (editingField === "name") {
        data.append("name", editedProfile.name);
      } else if (editingField === "email") {
        data.append("email", editedProfile.email);
      } else if (editingField === "mobile") {
        data.append("mobile", editedProfile.mobile);
      }

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
        setMessage("Profile Data Updated sucessfully");
        setShow(true);
        handleShow(); // Show the modal
      return;
      }
      else{
        setMessage(response?.data?.message||"");
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
    }
  };

  const cancelEdit = () => {
    setEditedProfile({ ...profileDataResponse });
    setIsEditing(false);
    setEditingField(null);
  };

  if (loading) {
    return <Loader />
  }

  if (!profileDataResponse) {
    return <div>Error loading profile data.</div>;
  }

  return (
    <>
     <div className="container nav-container profile-container">
      <h1>Profile</h1>

      <div className="profile-content">
        {/* Avatar Section */}
        <div className="avatar-div">
        <div className="avatar">
          {editedProfile.image ? (
            <img
              src={
                typeof editedProfile.image === "string"
                  ? editedProfile.image
                  : URL.createObjectURL(editedProfile.image)
              }
              alt="Avatar"
              className="avatar-img"
            />
          ) : (
            <span className="avatar-placeholder">
              {profileDataResponse.name.charAt(0).toUpperCase()}
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
                  value={editedProfile.name || name} // Autofill with state
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              ) : (
                <span>{profileDataResponse.name}</span>
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
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  disabled
                />
              ) : (
                <span>{profileDataResponse.mobile}</span>
              )}
              {/* <button
                className="edit-button"
                onClick={() => {
                  setIsEditing(true);
                  setEditingField("mobile");
                }}
              >
                <Pencil size={16} />
              </button> */}
            </div>
          </div>

          {/* Email */}
          <div className="detail-item">
            <label>Email</label>
            <div className="detail-value">
              {isEditing && editingField === "email" ? (
                <input
                  type="email"
                  value={editedProfile.email || email} // Autofill with state
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
        {address.house}, {address.street_address}{" "}
        {address.street_address_line2}, {address.landmark},{" "}
        {address.city} - {address.state} {address.postal_code}{" "}
        {address.country}
      </p>
      <Dropdown>
        <Dropdown.Toggle
          as="span"
          id="dropdown-custom-components"
          className="cursor-pointer border-0 bg-transparent p-0 d-flex align-items-center"
          bsPrefix="custom-toggle" // Disables Bootstrap’s caret icon
        >
          <BsThreeDotsVertical size={18} style={{ cursor: "pointer" }} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-end">
          <Dropdown.Item
            onClick={() => {
              setAddressToEdit(address?.address_id);
              setIsEditingAddress(true);
            }}
          >
            <BsPencil size={16} className="me-2" /> Edit
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setAddressToDelete(address?.address_id); // Set the address ID to delete
              setIsDeletingAddress(true); // Show the confirmation modal
            }}
          >
            <BsTrash size={16} className="me-2" /> Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
))}



          <a className="add-address" onClick={() => setIsAddingAddress(true)}>
            + Add New Address
          </a>

          {/* Modal for Adding New Address */}
          <Modal show={isAddingAddress} onHide={cancelAddAddress} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add New Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddAddressForm
                fetchProfile={fetchProfile}
                cancelAddAddress={cancelAddAddress}
              />
            </Modal.Body>
          </Modal>

          {/* Modal for Editing Address */}
          <Modal show={isEditingAddress} onHide={() => setIsEditingAddress(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EditAddressForm
                addressId={addressToEdit}
                closeModal={() => setIsEditingAddress(false)}
                refreshAddresses={fetchProfile} // A function to refresh the address list
              />
            </Modal.Body>
          </Modal>

          {/* Modal for Deleting Address */}
          <Modal show={isDeletingAddress} onHide={() => setIsDeletingAddress(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Delete Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to delete this address?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsDeletingAddress(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDelete(addressToDelete); // Delete the selected address
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>




















      </div>
    </div>
    
    <MessageModal
        show={show}
        handleClose={handleClose}
        message={message}
      />
    </>
   
  );
};

export default ProfileDetails;
