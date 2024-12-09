import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Separate refs for each dropdown
  const locationDropdownRef = useRef(null);
  const servicesDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loginStatus = sessionStorage.getItem("IsLogedIn");
    if (loginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.setItem("IsLogedIn", "false");
    setProfileDropdownOpen(false);
  };

  const handleJoinAsPartner = () => {
    setLocationDropdownOpen(false);
    setServicesDropdownOpen(false);
    setProfileDropdownOpen(false);
    navigate("/join-as-partner");
  };

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    setLocationDropdownOpen(false);
    setServicesDropdownOpen(false);
    setProfileDropdownOpen(false);
  };

  const sliderRef = useRef(null);

const handleClickOutside = (event) => {
  if (
    locationDropdownRef.current &&
    !locationDropdownRef.current.contains(event.target) &&
    servicesDropdownRef.current &&
    !servicesDropdownRef.current.contains(event.target) &&
    profileDropdownRef.current &&
    !profileDropdownRef.current.contains(event.target) &&
    sliderRef.current &&
    !sliderRef.current.contains(event.target) // Check slider clicks
  ) {
    closeAllDropdowns();
  }
};
const handleSliderClick = (event) => {
  event.stopPropagation(); // Only if needed
};


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top">
      <div className="container nav-container nav-container-flex">
        <a href="/" className="navbar-brand font-serif">
          Servyo
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto mb-lg-0 ml-3">
            {/* Location Dropdown */}
            <li className="nav-item" ref={locationDropdownRef}>
              <div
                className="nav-link dropdown-toggle location-dropdown"
                onClick={() => setLocationDropdownOpen((prev) => !prev)}
                role="button"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div>
                  <i className="bi bi-geo-alt-fill me-1"></i>{" "}
                  <span style={{ color: "#999999", fontSize: "16px" }}>
                    Delhi
                  </span>
                </div>
                <i
                  className={`ms-1 bi ${
                    locationDropdownOpen ? "bi-chevron-up" : "bi-chevron-down"
                  }`}
                ></i>
              </div>
              {locationDropdownOpen && (
                <ul className="custom-dropdown" style={{ width: "283px" }}>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={closeAllDropdowns} // Close dropdown on click
                    >
                      Delhi
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={closeAllDropdowns} // Close dropdown on click
                    >
                      Mumbai
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={closeAllDropdowns} // Close dropdown on click
                    >
                      Bangalore
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={closeAllDropdowns} // Close dropdown on click
                    >
                      Chennai
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={closeAllDropdowns} // Close dropdown on click
                    >
                      Kolkata
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item mr-2 ml-4">
              <a href="/" className="nav-link">
                Home
              </a>
            </li>

            {/* Services Dropdown */}
            <li className="nav-item mr-2" ref={servicesDropdownRef}>
              <div
                className="nav-link dropdown-toggle"
                onClick={() => setServicesDropdownOpen((prev) => !prev)}
                role="button"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Services
                <i
                  className={`ms-1 bi mt-1 ml-1 ${
                    servicesDropdownOpen ? "bi-chevron-up" : "bi-chevron-down"
                  }`}
                ></i>
              </div>
              {servicesDropdownOpen && (
                <ul className="custom-dropdown">
                  <li>
                    <Link
                      to="/services/cook-service"
                      className="dropdown-item"
                      onClick={closeAllDropdowns} // Close dropdown on click
                    >
                      Chef
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/driver-service"
                      className="dropdown-item"
                      onClick={closeAllDropdowns} // Close dropdown on click
                    >
                      Driver
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/gardener-service"
                      className="dropdown-item"
                      onClick={closeAllDropdowns} // Close dropdown on click
                    >
                      Gardener
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <Link to="/about-us" className="nav-link">
                About Us
              </Link>
            </li>
          </ul>

          {/* Profile and Buttons */}
          <div className="d-flex align-items-center justify-content-center">
            {/* Profile Dropdown */}
            <div className="nav-item" ref={profileDropdownRef}>
              <div
                className="btn btn-link nav-link"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                role="button"
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-person-fill"></i>
              </div>
              {profileDropdownOpen && (
                <ul className="custom-dropdown dropdown-menu-end">
                  {isLoggedIn ? (
                    <>
                      <li>
                        <Link
                          to="/my-profile"
                          className="dropdown-item"
                          onClick={closeAllDropdowns} // Close dropdown on click
                        >
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <a
                          href="/login"
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Logout
                        </a>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link to="/login" className="dropdown-item">
                        Login
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>

            <button
              className="btn btn-outline-primary mr-4 d-none d-lg-inline-block nav-buttons"
              onClick={handleJoinAsPartner}
            >
              Join As Partner
            </button>
            <button className="btn btn-primary d-none d-lg-inline-block nav-buttons">
              Download App
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
