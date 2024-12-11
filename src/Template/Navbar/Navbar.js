import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navbarRef = useRef(null); // Reference for the entire navbar
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
    closeAllDropdowns();
  };

  const handleJoinAsPartner = () => {
    closeAllDropdowns();
    navigate("/join-as-partner");
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setIsOpen(false); // Also close the hamburger menu
  };

  const handleClickOutside = (event) => {
    if (
      !navbarRef.current?.contains(event.target) &&
      !locationDropdownRef.current?.contains(event.target) &&
      !servicesDropdownRef.current?.contains(event.target) &&
      !profileDropdownRef.current?.contains(event.target)
    ) {
      closeAllDropdowns();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light sticky-top"
      ref={navbarRef} // Attach the ref to the entire navbar
    >
      <div className="container nav-container nav-container-flex">
        <Link to="/" className="navbar-brand font-serif" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Servyo
        </Link>
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
            <li className="" ref={locationDropdownRef}>
              <div
                className="nav-link dropdown-toggle location-dropdown"
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "location" ? null : "location"
                  )
                }
                role="button"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 10px"
                }}
              >
                <div>
                  <i className="bi bi-geo-alt-fill me-1"></i>{" "}
                  <span style={{ color: "#999999", fontSize: "16px" }}>Delhi</span>
                </div>
                <i
                  className={`ms-1 bi ${
                    activeDropdown === "location"
                      ? "bi-chevron-up"
                      : "bi-chevron-down"
                  }`}
                ></i>
              </div>
              {activeDropdown === "location" && (
                <ul className="custom-dropdown" style={{ width: "283px" }}>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={closeAllDropdowns}
                    >
                      Delhi
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={closeAllDropdowns}
                    >
                      Mumbai
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={closeAllDropdowns}
                    >
                      Bangalore
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={closeAllDropdowns}
                    >
                      Chennai
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={closeAllDropdowns}
                    >
                      Kolkata
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li className="  right-margin home-margin">
              <a href="/" className="nav-link">
                Home
              </a>
            </li>

            {/* Services Dropdown */}
            <li className=" right-margin" ref={servicesDropdownRef}>
              <div
                className="nav-link dropdown-toggle"
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "services" ? null : "services"
                  )
                }
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
                    activeDropdown === "services"
                      ? "bi-chevron-up"
                      : "bi-chevron-down"
                  }`}
                ></i>
              </div>
              {activeDropdown === "services" && (
                <ul className="custom-dropdown">
                  <li>
                    <Link
                      to="/services/cook-service"
                      className="dropdown-item"
                      onClick={closeAllDropdowns}
                    >
                      Chef
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/driver-service"
                      className="dropdown-item"
                      onClick={closeAllDropdowns}
                    >
                      Driver
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/gardener-service"
                      className="dropdown-item"
                      onClick={closeAllDropdowns}
                    >
                      Gardener
                    </Link>   
                    </li>
                  </ul>
                )}
              </li>
  
              <li className="">
                <Link to="/about-us" className="nav-link">
                  About Us
                </Link>
              </li>
            </ul>
  
            {/* Profile and Buttons */}
            <div className="d-flex align-items-center justify-content-center ">
              {/* Profile Dropdown */}
              <div className="right-margin " ref={profileDropdownRef}>
                <div
                  className="btn btn-link nav-link "
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "profile" ? null : "profile"
                    )
                  }
                  role="button"
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-person-fill"></i>
                </div>
                {activeDropdown === "profile" && (
                  <ul className="custom-dropdown dropdown-menu-end">
                    {isLoggedIn ? (
                      <>
                        <li>
                          <Link
                            to="/my-profile"
                            className="dropdown-item"
                            onClick={closeAllDropdowns}
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
  
