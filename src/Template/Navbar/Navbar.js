import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { ChevronDown, MapPin, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null); // Default to null

  const navbarRef = useRef(null);
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const loginStatus = sessionStorage.getItem("IsLogedIn");
    setIsLoggedIn(loginStatus === "true");
  }, []);

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.setItem("IsLogedIn", "false");
    closeAllDropdowns();
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  

  // Handle clicks outside navbar
  const handleClickOutside = (event) => {
    // Check if click is outside navbar
    if (!navbarRef.current?.contains(event.target)) {
      closeAllDropdowns();
      return;
    }
    
    // Check if click is on navbar but not on dropdown toggles
    const isDropdownToggle = event.target.closest('.dropdown-toggle') || 
                            event.target.closest('.user-icon-navbar');
    const isDropdownItem = event.target.closest('.dropdown-item') ||
                          event.target.closest('.custom-dropdown-item');
                          
    if (!isDropdownToggle && !isDropdownItem) {
      closeAllDropdowns();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLocationChange = (location) => {
    setSelectedLocation(location); // Update the selected location
    setActiveDropdown(null); // Close the dropdown
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light sticky-top"
      ref={navbarRef} // Attach the ref to the entire navbar
    >
      <div className="container container-nav">
        {/* Logo */}
        <Link
          className="navbar-brand"
          to="/"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            closeAllDropdowns();
          }}
        >
          <span className="logo">Servyo</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div
          className={`collapse navbar-collapse ${
            isMobileMenuOpen ? "show" : ""
          }`}
        >
          <ul className="navbar-nav">
            {/* Home Link */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  closeAllDropdowns();
                }}
              >
                Home
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDropdown(
                    activeDropdown === "services" ? null : "services"
                  );
                }}
              >
                Services <ChevronDown className="dropdown-icon" />
              </a>
              {activeDropdown === "services" && (
                <div className="dropdown-menu services-drop show">
                  <Link
                    to="/services/cook-service"
                    className="dropdown-item"
                    onClick={closeAllDropdowns}
                  >
                    Cook
                  </Link>
                  <Link
                    to="/services/driver-service"
                    className="dropdown-item"
                    onClick={closeAllDropdowns}
                  >
                    Driver
                  </Link>
                  <Link
                    to="/services/gardener-service"
                    className="dropdown-item"
                    onClick={closeAllDropdowns}
                  >
                    Gardener
                  </Link>
                </div>
              )}
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/about-us"
                onClick={closeAllDropdowns}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/join-as-partner"
                onClick={closeAllDropdowns}
              >
                Join As Partner
              </Link>
            </li>
          </ul>

          {/* Right Side Items */}
          <div className="navbar-nav right-items">
            <div className="nav-item dropdown location-dropdown">
              <a
                className="nav-link dropdown-toggle location-drop"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDropdown(
                    activeDropdown === "location" ? null : "location"
                  );
                }}
              >
                <div>
                  <i className="bi bi-geo-alt-fill me-1"></i>{" "}
                  <span style={{ color: "#999999", fontSize: "16px" }}>
                    {selectedLocation || "Select Location"}
                  </span>
                </div>
                <i
                  className={`ms-1 bi ${
                    activeDropdown === "location"
                      ? "bi-chevron-up"
                      : "bi-chevron-down"
                  }`}
                ></i>
              </a>
              {activeDropdown === "location" && (
                <div className="dropdown-menu show">
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLocationChange("Delhi");
                    }}
                  >
                    Delhi
                  </a>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLocationChange("Mumbai");
                    }}
                  >
                    Mumbai
                  </a>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLocationChange("Bangalore");
                    }}
                  >
                    Bangalore
                  </a>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLocationChange("Chennai");
                    }}
                  >
                    Chennai
                  </a>
                </div>
              )}
            </div>

            {/* Download App Button */}
            <button className="btn btn-primary d-none d-lg-inline-block nav-buttons">
              Download App
            </button>

            {/* Profile Dropdown */}
            <div className="nav-item dropdown">
              <a
                className="nav-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDropdown(
                    activeDropdown === "profile" ? null : "profile"
                  );
                }}
              >
                <User className="user-icon-navbar" />
              </a>
              {activeDropdown === "profile" && (
                <div className="custom-dropdown-menu">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/my-profile"
                        className="custom-dropdown-item"
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          closeAllDropdowns();
                        }}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/"
                        className="custom-dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="custom-dropdown-item"
                      onClick={closeAllDropdowns}
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
