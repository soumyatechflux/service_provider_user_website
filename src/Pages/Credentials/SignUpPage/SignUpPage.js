import React, { useEffect, useState } from "react";
import "./SignUpPage.css";
import { Link, useNavigate } from "react-router-dom";
import { OTPAPI, SignUpAPI } from "../../../utils/APIs/credentialsApis";
import MessageModal from "../../MessageModal/MessageModal";
import Loader from "../../Loader/Loader";

// import { SignUpAPI } from "./path-to-your-api-file"; // Update the path as needed

const countryCode = "+91";
const SignUpPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  // const [otp, setOtp] = useState(["", "", "", ""]);
  const [otp, setOtp] = useState(""); // Changed to a string for a 4-digit OTP
  const [countryCode, setCountryCode] = useState("+91");
  const [step, setStep] = useState("signup");
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true); // Initially disabled
  const [countdown, setCountdown] = useState(30); // Countdown starts at 10 seconds

  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
      setError("");
    }
  };

  const handleSendOtp = async () => {
    if (!name.trim()) {
      setMessage("Name cannot be empty.");
      handleShow();
      return;
    }
    if (!validatePhoneNumber(phone)) {
      setMessage("Enter a valid 10-digit phone number starting with 6-9.");
      handleShow();
      return;
    }
    if (!termsAccepted) {
      setMessage("You must accept the Terms & Conditions.");
      handleShow();
      return;
    }

    const data = {
      customer: {
        full_name: name,
        country_code: countryCode,
        mobile: phone,
      },
    };

    try {
      setLoading(true);
      const response = await SignUpAPI(data);
      console.log("API Response:", response);
      if (response?.status === 200 && response?.data?.success === true) {
        const message = response?.data?.message;

        // Extract the mobile number and OTP
        const regex = /OTP for (\d{10}): (\d{4})/;
        const match = message.match(regex);

        if (match) {
          const mobileNumber = match[1];
          const otp = match[2];
          localStorage.setItem("mobile", mobileNumber);
          localStorage.setItem("OTP", otp);
          setPhone(localStorage.getItem("mobile"));
          // setOtp(localStorage.getItem("OTP"));
          console.log("Mobile Number:", mobileNumber); // 7878787878
          console.log("OTP:", otp); // 9284
          setMessage(
            response.data.message ||
              "OTP send successfully to your register monbile number."
          );
          handleShow();
        } else {
          setMessage("No match found");
          handleShow();
        }
        setStep("otp");
      } else {
        setMessage(
          response?.data?.message || "Failed to send OTP. Please try again."
        );
        handleShow();
      }
    } catch (err) {
      setLoading(false);
      console.error("Error sending OTP:", err);
      setMessage("An error occurred while sending OTP. Please try again.");
      handleShow();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      // Allow only one digit
      const newOtp = otp.split("");
      newOtp[index] = value || ""; // Update the specific digit
      setOtp(newOtp.join(""));

      if (value && index < 3) {
        // Move to the next input field if a digit is entered
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = otp.split("");

      if (!newOtp[index]) {
        // Move to the previous input if the current is already empty
        if (index > 0) {
          const prevInput = document.getElementById(`otp-${index - 1}`);
          prevInput?.focus();
        }
      } else {
        // Clear the current input value
        newOtp[index] = "";
        setOtp(newOtp.join("")); // Join without a separator
      }
    }
  };

  const handleBack = () => setStep("signup");

  const handleVerifyOtp = async () => {
    const data = {
      customer: {
        country_code: countryCode,
        mobile: phone,
        otp: otp,
      },
    };

    try {
      setLoading(true);
      const response = await OTPAPI(data);
      console.log("API Response:", response);
      if (response?.status === 200 && response?.data?.success === true) {
        alert("Sign up successful!");

        navigate("/login");

        setStep("otp");
      } else {
        setMessage(
          response?.data?.message || "Failed to send OTP. Please try again."
        );
        handleShow();
      }
    } catch (err) {
      setLoading(false);
      console.error("Error sending OTP:", err);
      setMessage("An error occurred while sending OTP. Please try again.");
      handleShow();
    } finally {
      setLoading(false);
    }
    // console.log("OTP Verified:", otp.join(""));
  };

  useEffect(() => {
    let timer;

    // Start countdown on mount and whenever the button is disabled
    if (isDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) return prev - 1; // Decrement countdown
          clearInterval(timer); // Clear timer when countdown reaches 0
          setIsDisabled(false); // Enable the button
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [isDisabled]);

  const handleResendClick = () => {
    handleSendOtp(); // Call the resend OTP function
    setIsDisabled(true); // Disable the button
    setCountdown(10); // Reset the countdown
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="signup-container-unique">
        <div className="login-container">
          {step === "signup" ? (
            <div className="signup-card-unique">
              <h2 className="signup-title-unique">Sign Up</h2>
              <label className="login-label text-left">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="name-input-unique"
                placeholder="Enter your name"
              />
              <label className="login-label text-left">Phone Number</label>
              <div className="phone-input">
                {/* Display the fixed country code */}
                <span className="country-code-display">{countryCode}</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()} // Send OTP on Enter
                  className={`phone-number-input ${
                    error ? "input-error-unique" : ""
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="terms-container-unique">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  className="terms-checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                <label htmlFor="terms-checkbox" className="terms-and-condition">
                  I agree to the{" "}
                  <a href="#" className="terms-link-unique"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                  }}
                  >
                    Terms & Conditions
                  </a>{" "}
                  & Privacy Policy.
                </label>
              </div>
              {error && <p className="error-message-unique">{error}</p>}
              <button
                className="send-otp-button-unique"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>
              <p className="login-link-container-unique">
                Already a user?{" "}
                <a href="/login" className="login-link-unique">
                  Log In
                </a>
              </p>
            </div>
          ) : (
            <div className="otp-card-unique">
              <button onClick={handleBack} className="back-button-unique">
                ← Back
              </button>
              <h2 className="otp-title-unique">One Time Password</h2>
              <p className="otp-instructions-unique">
                Enter the OTP sent to your phone.
              </p>
              <div className="otp-input-container-unique">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ""} // Extract each digit from the OTP string
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleVerifyOtp(); // Trigger OTP verification on Enter
                      else handleKeyDown(index, e); // Handle regular key presses
                    }}
                    className="otp-input-unique"
                    inputMode="numeric"
                  />
                ))}
              </div>
              {error && <p className="error-message-unique">{error}</p>}
              <button
                className="verify-otp-button-unique"
                onClick={handleVerifyOtp}
              >
                Sign Up
              </button>
              <p className="resend-otp-unique">
                Didn’t receive OTP?{" "}
                <button
                  className="resend-button-unique"
                  onClick={handleResendClick}
                  disabled={isDisabled}
                >
                  {isDisabled ? `Resend in ${countdown}s` : "Resend"}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
      <MessageModal
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        message={message}
      />
    </>
  );
};

export default SignUpPage;
