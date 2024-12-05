import React, { useEffect, useState } from "react";
import { Pencil, MapPin, Plus, Pen, Check, X } from "lucide-react";
import "./ProfileDetails.css";
import {
  getProfileAPI,
  editProfileAPI,
} from "../../../utils/APIs/ProfileApis/ProfileApi";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

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
  const token=sessionStorage.getItem("ServiceProviderUserToken")
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

  const addNewAddress = () => {
    setAddresses((prev) => [...prev, { ...newAddress, id: Date.now() }]);
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
    setIsAddingAddress(false);
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
  };

  const handleAddressChange = (field, value) => {
    setNewAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit=()=>{

  }

  const handleDelete=()=>{
    
  }

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      // const response = await getProfileAPI();
      
      const response = await axios.get(`${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.status && response?.data?.success) {
        setProfileDataResponse(response?.data?.data);
        const data = response?.data?.data;
        setAvatar(data.image || data.name.charAt(0).toUpperCase());
        setName(data.name);
        setPhone(data.mobile);
        setEmail(data.email);
        setAddresses([
          {
            id: 1,
            address: "Plot no.209, Kavuri Hills, Madhapur, Telangana 500033",
            phone: "+91 1234567890",
          },
        ]);
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

      // const response = await editProfileAPI(data);
      const response = await axios.patch(`${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/profile`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.status === 200 && response?.data?.success) {
        setProfileDataResponse(response.data.data);
        setEditedProfile(response.data.data);
        setIsEditing(false);
        setEditingField(null);
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
    return <Loader />;
  }

  if (!profileDataResponse) {
    return <div>Error loading profile data.</div>;
  }

  return (
    <div className="container nav-container profile-container">
      <h1>Profile</h1>

      <div className="profile-content">
        {/* Avatar Section */}
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
                />
              ) : (
                <span>{profileDataResponse.mobile}</span>
              )}
              <button
                className="edit-button"
                onClick={() => {
                  setIsEditing(true);
                  setEditingField("mobile");
                }}
              >
                <Pencil size={16} />
              </button>
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

          {addresses.map((address) => (
        <div key={address.id} className="mb-3">
          <div className="d-flex align-items-center">
            <p className="flex-fill mb-0">
              {address.houseNumber}, {address.streetAddress}, {address.streetAddressLine},{" "}
              {address.landmark}, {address.city} - {address.state} {address.pincode} {address.country}
            </p>
            <Dropdown>
              <Dropdown.Toggle as="span" id="dropdown-custom-components" className="cursor-pointer">
                <BsThreeDotsVertical />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#" 
                onClick={() => handleEdit(address.id)}
                >
                  <FaEdit className="me-2" /> Edit
                </Dropdown.Item>
                <Dropdown.Item href="#" 
                onClick={() => handleDelete(address.id)}
                >
                  <FaTrashAlt className="me-2" /> Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      ))}

          {!isAddingAddress && (
            <a
              className="add-address"
              onClick={() => setIsAddingAddress(true)}
            >
              <Plus size={16} />
              Add New Address
            </a>
          )}



          
          {isAddingAddress && (
            <div className="new-address-form">
              <h3>Add New Address</h3>
              <input
                type="text"
                placeholder="House Number"
                value={newAddress.houseNumber}
                onChange={(e) =>
                  handleAddressChange("houseNumber", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Street Address 1"
                value={newAddress.streetAddress}
                onChange={(e) =>
                  handleAddressChange("streetAddress", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Street Address 2"
                value={newAddress.streetAddressLine}
                onChange={(e) => handleAddressChange("streetAddressLine", e.target.value)}
              />
               <input
                type="text"
                placeholder="Landmark"
                value={newAddress.landmark}
                onChange={(e) => handleAddressChange("landmark", e.target.value)}
              />


              <div className="d-flex gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                />
              </div>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) =>
                    handleAddressChange("pincode", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={(e) => handleAddressChange("country", e.target.value)}
                />
              </div>

              <div className="new-address-actions">
                <button className="save-button" onClick={() => addNewAddress()}>
                  <Check size={16} /> Save
                </button>
                <button className="cancel-button" onClick={cancelAddAddress}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
