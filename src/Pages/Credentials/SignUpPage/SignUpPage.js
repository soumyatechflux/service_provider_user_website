import React, { useEffect, useState } from "react";
import "./SignUpPage.css";
import { Link, useNavigate } from "react-router-dom";
import { OTPAPI, SignUpAPI } from "../../../utils/APIs/credentialsApis";
import MessageModal from "../../MessageModal/MessageModal";
import Loader from "../../Loader/Loader";

const countryCode = "+91";
const SignUpPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(""); // Changed to a string for a 4-digit OTP
  const [countryCode, setCountryCode] = useState("+91");
  const [referralCode, setReferralCode] = useState(""); // Added referral code state
  const [step, setStep] = useState("signup");
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true); // Initially disabled
  const [countdown, setCountdown] = useState(30); // Countdown starts at 30 seconds

  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
      setError("");
    }
  };

  const handleBackToHome = () => {
    navigate("/"); // Navigate to the home route
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
        referral_code: referralCode.trim() || null, // Included referral_code
      },
    };

    try {
      setLoading(true);
      const response = await SignUpAPI(data);
      console.log("API Response:", response);
      if (response?.status === 200 && response?.data?.success === true) {
        setMessage(response.data.message || "OTP sent successfully.");
        handleShow();
        setStep("otp");
      } else {
        setMessage(response?.data?.message || "Failed to send OTP. Please try again.");
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
                <span className="country-code-display">{countryCode}</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`phone-number-input ${error ? "input-error-unique" : ""}`}
                  placeholder="Enter phone number"
                />
              </div>
              <label className="login-label text-left">Do You Have a Referral Code (Optional)</label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="name-input-unique"
                placeholder="Enter your Referral Code"
              />
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
                  <a
                    href="#"
                    className="terms-link-unique"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open("/terms-and-conditions", "_blank");
                    }}
                  >
                    Terms & Conditions
                  </a>{" "}
                  & Privacy Policy.
                </label>
              </div>
              {error && <p className="error-message-unique">{error}</p>}
              <button className="send-otp-button-unique" onClick={handleSendOtp}>
                Send OTP
              </button>
              <p className="login-link-container-unique">
                Already a user?{" "}
                <a href="/login" className="login-link-unique">
                  Log In
                </a>
              </p>
              <button className="back-button-unique1" onClick={handleBackToHome}>
                ← Back To Home
              </button>
            </div>
          ) : (
            <div className="otp-card-unique">
              <button onClick={() => setStep("signup")} className="back-button-unique">
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
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const newOtp = otp.split("");
                      newOtp[index] = e.target.value;
                      setOtp(newOtp.join(""));
                    }}
                    className="otp-input-unique"
                    inputMode="numeric"
                  />
                ))}
              </div>
              {error && <p className="error-message-unique">{error}</p>}
              <button className="verify-otp-button-unique mb-2">
                Sign Up
              </button>
              <p className="resend-otp-unique">
                Didn’t receive OTP?{" "}
                <button className="resend-button-unique" disabled={isDisabled}>
                  {isDisabled ? `Resend in ${countdown}s` : "Resend"}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
      <MessageModal show={show} handleClose={handleClose} message={message} />
    </>
  );
};

export default SignUpPage;
