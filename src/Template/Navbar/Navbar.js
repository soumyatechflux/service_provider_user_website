import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { ChevronDown, MapPin, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navbarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loginStatus = sessionStorage.getItem("IsLogedIn");
    setIsLoggedIn(loginStatus === "true");
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.setItem("IsLogedIn", "false");
    closeAllDropdowns();
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleNavbarClick = (e) => {
    // Check if the clicked element is within an interactive dropdown or navbar item
    if (
      e.target.closest(".nav-item.dropdown") ||
      e.target.closest(".navbar-toggler") ||
      e.target.closest(".custom-dropdown-menu")
    ) {
      return; // Do not close dropdowns if interacting with these elements
    }
    closeAllDropdowns();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!navbarRef.current?.contains(event.target)) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    closeAllDropdowns();
  };

  const handleNavigationCustom = (path) => {
    closeAllDropdowns();
    navigate(path);
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light sticky-top"
      id="except-div"
      ref={navbarRef}
      onClick={handleNavbarClick}
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

        {/* Desktop Navigation */}
        <div
          className={`navbar-collapse collapse ${
            isMobileMenuOpen ? "show" : ""
          }`}
        >
          {/* Main Navigation Items */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => handleNavigationCustom("/")}
                style={{ cursor: "pointer" }}
              >
                Home
              </a>
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
                Services{" "}
                <ChevronDown
                  className="dropdown-icon"
                  style={{
                    transition: "transform 0.3s",
                    transform:
                      activeDropdown === "services"
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                />
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
              <a
                className="nav-link"
                style={{ cursor: "pointer" }}
                onClick={() => handleNavigationCustom("/about-us")}
              >
                About Us
              </a>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/join-as-partner"
                onClick={() => handleNavigationCustom("/join-as-partner")}
              >
                Join As Partner
              </Link>
            </li>
          </ul>

          {/* Right Side Items */}
          <div className="navbar-nav right-items">
            {/* Location Dropdown */}
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
                  <ChevronDown
                    className="ms-1"
                    style={{
                      transition: "transform 0.3s",
                      transform:
                        activeDropdown === "location"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </div>
              </a>
              {activeDropdown === "location" && (
                <div className="dropdown-menu show">
                  {["Delhi", "Mumbai", "Bangalore", "Chennai"].map((city) => (
                    <a
                      key={city}
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLocationChange(city);
                      }}
                    >
                      {city}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Download App Button */}
            <button
              className="btn btn-primary d-lg-inline-block nav-buttons"
              onClick={() => {
                window.location.href = "https://play.google.com/store";
              }}
            >
              Download App
            </button>

            {/* User Profile Dropdown */}
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
                        onClick={closeAllDropdowns}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="#"
                        className="custom-dropdown-item"
                        onClick={handleLogoutClick}
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

        {/* Mobile Sidebar */}
        <div className={`sidebar ${isMobileMenuOpen ? "show" : ""}`}>
          {/* Close Button */}
          <div>
            <button
              className="sidebar-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Items */}
          <ul className="navbar-nav">
          <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDropdown(
                    activeDropdown === "profile" ? null : "profile"
                  );
                }}
              >
                Profile{" "}
                <ChevronDown
                  className="dropdown-icon"
                  style={{
                    transition: "transform 0.3s",
                    transform:
                      activeDropdown === "profile"
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                />
              </a>
              {activeDropdown === "profile" && (
                <div className="dropdown-menu profile-drop show">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/my-profile"
                        className="dropdown-item"
                        onClick={closeAllDropdowns}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item"
                        onClick={handleLogoutClick}
                      >
                        Logout
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="dropdown-item"
                      onClick={closeAllDropdowns}
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => handleNavigationCustom("/")}
                style={{ cursor: "pointer" }}
              >
                Home
              </a>
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
                Services{" "}
                <ChevronDown
                  className="dropdown-icon"
                  style={{
                    transition: "transform 0.3s",
                    transform:
                      activeDropdown === "services"
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                />
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
              <a
                className="nav-link"
                style={{ cursor: "pointer" }}
                onClick={() => handleNavigationCustom("/about-us")}
              >
                About Us
              </a>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/join-as-partner"
                onClick={() => handleNavigationCustom("/join-as-partner")}
              >
                Join As Partner
              </Link>
            </li>
            {/* Mobile Location Dropdown */}
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
                  <ChevronDown
                    className="ms-1"
                    style={{
                      transition: "transform 0.3s",
                      transform:
                        activeDropdown === "location"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </div>
              </a>
              {activeDropdown === "location" && (
                <div className="dropdown-menu show dropdown-menu-w">
                  {["Delhi", "Mumbai", "Bangalore", "Chennai"].map((city) => (
                    <a
                      key={city}
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLocationChange(city);
                      }}
                    >
                      {city}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {/* Mobile Download Button */}
            <button
              className="btn btn-primary nav-buttons"
              onClick={() => {
                window.location.href = "https://play.google.com/store";
              }}
            >
              Download App
            </button>
            
          </ul>
        </div>

        {/* Overlay for Mobile Menu */}
        <div
          className={`overlay ${isMobileMenuOpen ? "show" : ""}`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Logout Confirmation Modal */}
        <Modal show={showLogoutModal} onHide={cancelLogout} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to log out?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelLogout}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmLogout}>
              Logout
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </nav>
  );
};

export default Navbar;
